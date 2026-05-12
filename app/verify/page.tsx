import type { Metadata } from "next";
import { V2Verify } from "@/components/v2/Verify";

export const metadata: Metadata = {
  title: "Get Verified",
  description:
    "Researcher qualification and vial verification for vailchem.labs research products.",
};

export default function VerifyPage() {
  return <V2Verify />;
}
