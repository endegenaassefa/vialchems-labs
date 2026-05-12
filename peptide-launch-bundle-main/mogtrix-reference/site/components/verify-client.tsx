"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Search } from "lucide-react";

import { lookupBatch, type LookupResult } from "@/lib/content/verification";
import { StatusPill } from "@/components/status-pill";

export function VerifyClient() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<LookupResult>({
    state: "empty",
    message: "Enter a batch code to search the verification index."
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    setResult(lookupBatch(String(form.get("batch") ?? "")));
  }

  return (
    <div className="form-panel stack">
      <div>
        <p className="eyebrow">Batch lookup</p>
        <h1>Search the library</h1>
        <p className="subtle">
          Search demo batch records now. The data layer is already shaped for
          Supabase-backed COA and testing records later.
        </p>
      </div>

      <form className="lookup-box" onSubmit={handleSubmit}>
        <div className="field">
          <label htmlFor="batch">Batch code</label>
          <input
            id="batch"
            name="batch"
            onChange={(event) => setQuery(event.target.value)}
            placeholder="MGX-BPC-2604"
            value={query}
          />
        </div>
        <button className="button button-primary" type="submit">
          <Search size={18} aria-hidden="true" />
          Search
        </button>
      </form>

      {result.state === "found" ? (
        <div className="legal-card">
          <StatusPill status={result.batch.status} />
          <h2>{result.batch.batchId}</h2>
          <p>{result.batch.notes}</p>
          <dl className="mt-4 grid gap-3 text-sm text-[var(--text-muted)]">
            <div>
              <dt className="font-semibold text-white">Record</dt>
              <dd>{result.batch.category}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Testing status</dt>
              <dd>{result.batch.documentStatus}</dd>
            </div>
            <div>
              <dt className="font-semibold text-white">Testing source</dt>
              <dd>{result.batch.testingLab}</dd>
            </div>
          </dl>
          <ul className="tag-list">
            <li>Released {result.batch.releasedAt}</li>
            {result.batch.documentSet.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="mt-4">
            <Link
              href={`/products/${result.batch.productSlug}`}
              className="button button-secondary"
            >
              Open related product
            </Link>
          </div>
        </div>
      ) : (
        <div className="alert">{result.message}</div>
      )}
    </div>
  );
}
