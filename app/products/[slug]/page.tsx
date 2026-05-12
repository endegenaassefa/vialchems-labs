import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { V2ProductPage } from '@/components/v2/ProductPage';
import { getCatalogItem } from '@/components/v2/data';

export function generateStaticParams() {
  return [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = getCatalogItem(slug);
  if (!item) return {};
  return {
    title: item.shortName,
    description: item.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!getCatalogItem(slug)) notFound();
  return <V2ProductPage slug={slug} />;
}
