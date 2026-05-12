import { notFound } from "next/navigation";
import { getLegalPage, legalPages } from "@/lib/content/legal";

export function generateStaticParams() {
  return legalPages.map((page) => ({ slug: page.slug }));
}

export default async function LegalPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = getLegalPage(slug);
  if (!page) notFound();

  return (
    <main className="shell py-16">
      <article className="metal rounded-[22px] p-8">
        <p className="text-xs font-semibold uppercase text-[var(--accent)]">Mogtrix policy</p>
        <h1 className="mt-3 text-5xl font-black text-white">{page.title}</h1>
        <div className="mt-8 grid gap-5 text-[var(--text-muted)]">
          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2 className="text-xl font-black text-white">{section.heading}</h2>
              <div className="mt-2 grid gap-3 leading-7">
                {section.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>
      </article>
    </main>
  );
}
