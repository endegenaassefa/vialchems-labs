/**
 * GET + PUT /api/account/addresses — read + replace the signed-in
 * customer's mailing + (optional) shipping address.
 *
 * Spec §3.5 Tab 2. Exactly one mailing and at most one shipping
 * row per profile (enforced by unique (profile_id, kind) on
 * customer_addresses).
 *
 * GET response: { mailing: AddressInput, shipping: AddressInput | null,
 *                 shipping_same_as_mailing: boolean }
 *
 * PUT payload: { mailing: AddressInput, shipping_same_as_mailing: boolean,
 *               shipping?: AddressInput }
 *   - When shipping_same_as_mailing=true, any existing shipping row is
 *     deleted. When false, the shipping row is upserted from the payload.
 */
import { NextResponse, type NextRequest } from "next/server";
import { z } from "zod";
import { extractAuthenticatedUser } from "@/lib/auth/extract-user";
import { serviceSupabase } from "@/lib/supabase";
import { addressSchema } from "@/lib/validation/customer";
import { captureException } from "@/lib/sentry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const putSchema = z
  .object({
    mailing: addressSchema,
    shipping_same_as_mailing: z.boolean(),
    shipping: addressSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.shipping_same_as_mailing && !data.shipping) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["shipping"],
        message:
          "Provide a shipping address or set shipping_same_as_mailing=true.",
      });
    }
  });

async function findProfileId(
  supabase: ReturnType<typeof serviceSupabase>,
  authUserId: string,
): Promise<string | null> {
  if (!supabase) return null;
  const profile = await supabase
    .from("customer_profiles")
    .select("id")
    .eq("auth_user_id", authUserId)
    .maybeSingle();
  if (profile.error || !profile.data) return null;
  return String(profile.data.id);
}

export async function GET(request: NextRequest) {
  const auth = await extractAuthenticatedUser(request);
  if (auth.kind === "supabase_unavailable") {
    return NextResponse.json(
      { ok: false, code: "supabase_unavailable" },
      { status: 503 },
    );
  }
  if (auth.kind !== "ok") {
    return NextResponse.json(
      { ok: false, code: "unauthorized" },
      { status: 401 },
    );
  }

  const supabase = serviceSupabase()!;
  try {
    const profileId = await findProfileId(supabase, auth.user.id);
    if (!profileId) {
      return NextResponse.json(
        {
          ok: true,
          mailing: null,
          shipping: null,
          shipping_same_as_mailing: true,
        },
        { status: 200 },
      );
    }
    const rows = await supabase
      .from("customer_addresses")
      .select("kind, street1, street2, city, region, postal_code, country")
      .eq("profile_id", profileId);
    if (rows.error) {
      captureException(rows.error, {
        tags: { route: "account/addresses", phase: "get" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }
    const data = rows.data ?? [];
    const mailing = data.find((r) => r.kind === "mailing") ?? null;
    const shipping = data.find((r) => r.kind === "shipping") ?? null;
    return NextResponse.json(
      {
        ok: true,
        mailing,
        shipping,
        shipping_same_as_mailing: shipping === null,
      },
      { status: 200 },
    );
  } catch (err) {
    captureException(err, {
      tags: { route: "account/addresses", phase: "outer" },
    });
    return NextResponse.json(
      { ok: false, code: "internal_error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: NextRequest) {
  const auth = await extractAuthenticatedUser(request);
  if (auth.kind === "supabase_unavailable") {
    return NextResponse.json(
      { ok: false, code: "supabase_unavailable" },
      { status: 503 },
    );
  }
  if (auth.kind !== "ok") {
    return NextResponse.json(
      { ok: false, code: "unauthorized" },
      { status: 401 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, code: "invalid_body" },
      { status: 400 },
    );
  }

  const parsed = putSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        code: "invalid_body",
        errors: parsed.error.issues.map((i) => ({
          path: i.path,
          message: i.message,
        })),
      },
      { status: 400 },
    );
  }
  const input = parsed.data;
  const supabase = serviceSupabase()!;
  try {
    const profileId = await findProfileId(supabase, auth.user.id);
    if (!profileId) {
      return NextResponse.json(
        { ok: false, code: "profile_not_found" },
        { status: 400 },
      );
    }

    // Mailing: upsert via (profile_id, kind) unique. Service-role
    // bypasses RLS so we can run upsert without per-row select first.
    const upsertMailing = await supabase.from("customer_addresses").upsert(
      {
        profile_id: profileId,
        kind: "mailing",
        street1: input.mailing.street1,
        street2: input.mailing.street2 ?? null,
        city: input.mailing.city,
        region: input.mailing.region,
        postal_code: input.mailing.postal_code,
        country: input.mailing.country,
      },
      { onConflict: "profile_id,kind" },
    );
    if (upsertMailing.error) {
      captureException(upsertMailing.error, {
        tags: { route: "account/addresses", phase: "upsert_mailing" },
      });
      return NextResponse.json(
        { ok: false, code: "internal_error" },
        { status: 500 },
      );
    }

    if (input.shipping_same_as_mailing) {
      // Drop the shipping row if it exists.
      const del = await supabase
        .from("customer_addresses")
        .delete()
        .eq("profile_id", profileId)
        .eq("kind", "shipping");
      if (del.error) {
        captureException(del.error, {
          tags: { route: "account/addresses", phase: "delete_shipping" },
        });
        return NextResponse.json(
          { ok: false, code: "internal_error" },
          { status: 500 },
        );
      }
    } else {
      const shipping = input.shipping!;
      const upsertShipping = await supabase.from("customer_addresses").upsert(
        {
          profile_id: profileId,
          kind: "shipping",
          street1: shipping.street1,
          street2: shipping.street2 ?? null,
          city: shipping.city,
          region: shipping.region,
          postal_code: shipping.postal_code,
          country: shipping.country,
        },
        { onConflict: "profile_id,kind" },
      );
      if (upsertShipping.error) {
        captureException(upsertShipping.error, {
          tags: { route: "account/addresses", phase: "upsert_shipping" },
        });
        return NextResponse.json(
          { ok: false, code: "internal_error" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (err) {
    captureException(err, {
      tags: { route: "account/addresses", phase: "outer" },
    });
    return NextResponse.json(
      { ok: false, code: "internal_error" },
      { status: 500 },
    );
  }
}
