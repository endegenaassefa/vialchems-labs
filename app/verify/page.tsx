import type { Metadata } from "next";
import { V2Verify } from "@/components/v2/Verify";

export const metadata: Metadata = {
  title: "Vial Verification",
  description:
    "Batch-level vial verification and COA lookup for VialChem Labs research products.",
};

export default function VerifyPage() {
  return <V2Verify />;
}
