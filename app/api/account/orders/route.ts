import { NextResponse } from "next/server";
import { listCustomerOrders } from "@/lib/account/orders";
import { serviceSupabase } from "@/lib/supabase";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

function jsonError(error: string, status: number, message?: string): Response {
  return NextResponse.json({ ok: false, error, message }, { status });
}

function bearerToken(request: Request): string | null {
  const header = request.headers.get("authorization");
  if (!header) return null;
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match?.[1]?.trim() || null;
}

export async function GET(request: Request): Promise<Response> {
  const token = bearerToken(request);
  if (!token) {
    return jsonError("unauthorized", 401);
  }

  let supabase;
  try {
    supabase = serviceSupabase();
  } catch (error) {
    return jsonError("supabase_not_configured", 503, (error as Error).message);
  }
  if (!supabase) {
    return jsonError(
      "supabase_not_configured",
      503,
      "Account order history requires Supabase service-role access.",
    );
  }

  const userResult = await supabase.auth.getUser(token);
  const email = userResult.data.user?.email;
  if (userResult.error || !email) {
    return jsonError("unauthorized", 401);
  }

  try {
    const orders = await listCustomerOrders(supabase, email);
    return NextResponse.json({ ok: true, orders });
  } catch (error) {
    return jsonError("customer_orders_failed", 500, (error as Error).message);
  }
}
