import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import type { Category } from "@/lib/content/categories";

export function CategoryCard({ category }: { category: Category }) {
  return (
    <article className="category-card">
      <div className="category-media">
        <Image
          src={category.visual}
          alt=""
          width={900}
          height={540}
          priority={false}
        />
      </div>
      <div className="category-body">
        <p className="eyebrow">{category.eyebrow}</p>
        <h3>{category.title}</h3>
        <p>{category.summary}</p>
        <ul className="tag-list" aria-label={`${category.title} controls`}>
          {category.controls.map((control) => (
            <li key={control}>{control}</li>
          ))}
        </ul>
        <div className="hero-actions">
          <Link className="button button-secondary" href="/access">
            Request detail <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  );
}
