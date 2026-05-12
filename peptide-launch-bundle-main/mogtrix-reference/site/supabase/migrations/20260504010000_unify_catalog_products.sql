alter table public.products
  add column if not exists documentation_status text not null default 'document-review',
  add column if not exists availability_status text not null default 'limited-review',
  add column if not exists visible_to_approved boolean not null default true;

alter table public.products
  drop constraint if exists products_documentation_status_check,
  drop constraint if exists products_availability_status_check;

alter table public.products
  add constraint products_documentation_status_check check (
    documentation_status in ('coa-ready', 'document-review', 'pending-records')
  ),
  add constraint products_availability_status_check check (
    availability_status in ('requestable', 'limited-review', 'not-available')
  );

update public.products
set active = false,
    visible_to_approved = false,
    updated_at = timezone('utc', now())
where id in ('mtrx-reference-a', 'mtrx-analytical-b', 'mtrx-handling-c');

insert into public.products (
  id,
  slug,
  sku,
  name,
  summary,
  category,
  format,
  storage,
  price_cents,
  research_use_only,
  active,
  documentation_status,
  availability_status,
  visible_to_approved
)
values
  (
    'bpc-157-5mg',
    'bpc-157-5mg',
    'MGX-REC-BPC-005',
    'BPC-157 5mg',
    'Recovery-line peptide record with visible lot context, quality framing, and signed-in catalog pricing.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Controlled cold storage after intake.',
    4900,
    true,
    true,
    'coa-ready',
    'requestable',
    true
  ),
  (
    'bpc-157-tb-500-5mg-5mg',
    'bpc-157-tb-500-5mg-5mg',
    'MGX-REC-BT5-010',
    'BPC-157 + TB-500 5mg/5mg',
    'Blend reference entry with visible pricing, conservative copy, and gated document release.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Cold-chain logging required after receipt.',
    7900,
    true,
    true,
    'document-review',
    'requestable',
    true
  ),
  (
    'cjc-1295-no-dac-5mg',
    'cjc-1295-no-dac-5mg',
    'MGX-GH-CJC-005',
    'CJC-1295 No DAC 5mg',
    'GH-pathway peptide listing with visible pricing, batch code, and conservative research framing.',
    'analytical',
    'Lyophilized powder',
    '2-8 C unopened. Protect from heat and uncontrolled rehandling.',
    6900,
    true,
    true,
    'coa-ready',
    'requestable',
    true
  ),
  (
    'cjc-1295-ipamorelin-5mg-5mg',
    'cjc-1295-ipamorelin-5mg-5mg',
    'MGX-GH-CJI-010',
    'CJC-1295 + Ipamorelin 5mg/5mg',
    'Signed-in blend listing with visible price, blend record status, and conservative transfer language.',
    'analytical',
    'Lyophilized powder',
    '2-8 C unopened. Maintain internal blend handling logs.',
    8200,
    true,
    true,
    'document-review',
    'requestable',
    true
  ),
  (
    'ipamorelin-5mg',
    'ipamorelin-5mg',
    'MGX-GH-IPA-005',
    'Ipamorelin 5mg',
    'GH-pathway single-compound listing with clear pricing, specs, and batch lookup context.',
    'analytical',
    'Lyophilized powder',
    '2-8 C unopened. Controlled laboratory storage required.',
    6300,
    true,
    true,
    'coa-ready',
    'requestable',
    true
  ),
  (
    'semax-5mg',
    'semax-5mg',
    'MGX-NEU-SMX-005',
    'Semax 5mg',
    'Neuropeptide listing with visible price, archive-friendly batch info, and private-catalog tone.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Light-sensitive storage controls recommended.',
    5900,
    true,
    true,
    'coa-ready',
    'limited-review',
    true
  ),
  (
    'selank-5mg',
    'selank-5mg',
    'MGX-NEU-SLK-005',
    'Selank 5mg',
    'Private catalog listing with signed-in price visibility and conservative document framing.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Light-sensitive storage controls recommended.',
    6100,
    true,
    true,
    'coa-ready',
    'limited-review',
    true
  ),
  (
    'dihexa-5mg',
    'dihexa-5mg',
    'MGX-NEU-DHX-005',
    'Dihexa 5mg',
    'Signed-in neuro reference listing with price visibility, document framing, and batch-aware context.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Controlled cold storage after intake.',
    9500,
    true,
    true,
    'document-review',
    'limited-review',
    true
  ),
  (
    'ghk-cu-50mg-100mg',
    'ghk-cu-50mg-100mg',
    'MGX-DRM-GHK-100',
    'GHK-Cu 50mg / 100mg',
    'Dermal-signaling record with visible pricing and batch-context guardrails for qualified buyers.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Protect from prolonged light exposure.',
    8800,
    true,
    true,
    'coa-ready',
    'limited-review',
    true
  ),
  (
    'ghk-cu-bpc-157-tb-500-blend',
    'ghk-cu-bpc-157-tb-500-blend',
    'MGX-DRM-GBT-015',
    'GHK-Cu + BPC-157 + TB-500 Blend',
    'Blend listing with gated pricing, lot-level framing, and conservative document release language.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Cold-chain and light-control handling required.',
    9900,
    true,
    true,
    'document-review',
    'limited-review',
    true
  ),
  (
    'hgh-frag-176-191-5mg',
    'hgh-frag-176-191-5mg',
    'MGX-GH-FRG-005',
    'HGH Frag 176-191 5mg',
    'Analytical reference listing with signed-in price visibility and batch-linked document controls.',
    'analytical',
    'Lyophilized powder',
    '2-8 C unopened. Temperature excursions must be logged.',
    6500,
    true,
    true,
    'coa-ready',
    'limited-review',
    true
  ),
  (
    'mazdutide-10mg',
    'mazdutide-10mg',
    'MGX-MTB-MZD-010',
    'Mazdutide 10mg',
    'Metabolic-pathway listing with visible signed-in pricing and guarded batch detail routing.',
    'analytical',
    'Lyophilized powder',
    '2-8 C unopened. Controlled refrigerated storage required.',
    8700,
    true,
    true,
    'document-review',
    'limited-review',
    true
  ),
  (
    'mots-c-10mg-40mg',
    'mots-c-10mg-40mg',
    'MGX-MTB-MOT-040',
    'MOTS-c 10mg / 40mg',
    'Mitochondrial reference listing with visible price and qualified-review framing.',
    'analytical',
    'Lyophilized powder',
    '2-8 C unopened. Maintain temperature logs after intake.',
    9100,
    true,
    true,
    'coa-ready',
    'limited-review',
    true
  ),
  (
    'foxo4-dri-10mg',
    'foxo4-dri-10mg',
    'MGX-SEN-FOX-010',
    'FOXO4-DRI 10mg',
    'Signed-in listing for controlled senescence-pathway review and lot-aware document handling.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Keep within controlled cold storage.',
    11200,
    true,
    true,
    'document-review',
    'limited-review',
    true
  ),
  (
    'humanin-10mg',
    'humanin-10mg',
    'MGX-SEN-HMN-010',
    'Humanin 10mg',
    'Private-catalog reference listing with signed-in price visibility and conservative support routing.',
    'reference',
    'Lyophilized powder',
    '2-8 C unopened. Light-protected refrigerated storage required.',
    9800,
    true,
    true,
    'coa-ready',
    'limited-review',
    true
  )
on conflict (id) do update
set slug = excluded.slug,
    sku = excluded.sku,
    name = excluded.name,
    summary = excluded.summary,
    category = excluded.category,
    format = excluded.format,
    storage = excluded.storage,
    price_cents = excluded.price_cents,
    research_use_only = excluded.research_use_only,
    active = excluded.active,
    documentation_status = excluded.documentation_status,
    availability_status = excluded.availability_status,
    visible_to_approved = excluded.visible_to_approved,
    updated_at = timezone('utc', now());

drop policy if exists "Verified qualified customers can read active products" on public.products;
create policy "Verified qualified customers can read active visible products"
on public.products
for select
using (
  active = true
  and research_use_only = true
  and visible_to_approved = true
  and public.is_verified_qualified_customer()
);

drop policy if exists "Verified qualified customers can read product images" on public.product_images;
create policy "Verified qualified customers can read visible product images"
on public.product_images
for select
using (
  exists (
    select 1
    from public.products
    where products.id = product_images.product_id
      and products.active = true
      and products.research_use_only = true
      and products.visible_to_approved = true
      and public.is_verified_qualified_customer()
  )
);
