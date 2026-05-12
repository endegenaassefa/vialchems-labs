import type { Metadata } from "next";
import { V2Coa } from "@/components/v2/Coa";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function CoaIndexPage() {
  return <V2Coa />;
}
