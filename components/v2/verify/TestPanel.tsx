/**
 * TestPanel — 2x2 grid wrapper of TestCard for /verify/[slug].
 * Per super-prompt §6.4: renders the four lab tests in a responsive grid
 * (single column on mobile, 2x2 on tablet+).
 */
import type { ProductTestPanel } from "@/lib/content/coa";
import { TestCard, type TestKey } from "./TestCard";

const TEST_ORDER: TestKey[] = [
  "purity",
  "sterility",
  "endotoxin",
  "heavyMetals",
];

export interface TestPanelProps {
  panel: ProductTestPanel;
  productName: string;
}

export function TestPanel({ panel, productName }: TestPanelProps) {
  return (
    <section aria-label="Test reports">
      <div className="grid gap-4 md:grid-cols-2">
        {TEST_ORDER.map((key) => (
          <TestCard
            key={key}
            test={panel[key]}
            testKey={key}
            productName={productName}
          />
        ))}
      </div>
    </section>
  );
}
