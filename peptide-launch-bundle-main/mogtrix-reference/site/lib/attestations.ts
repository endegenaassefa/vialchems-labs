import type { Attestation } from "@/lib/types";

export const requiredAttestations: Attestation[] = [
  {
    id: "age-qualified",
    label: "I am at least 21 years old and authorized to request research materials.",
    clause: "Requester confirms age and authority to submit a research material request.",
    required: true
  },
  {
    id: "research-only",
    label: "I understand these materials are for laboratory research use only.",
    clause: "Materials are intended only for qualified laboratory research and are not offered for consumer use.",
    required: true
  },
  {
    id: "no-guidance",
    label: "I will not request preparation, application, or subject-use guidance from Mogtrix.",
    clause: "Mogtrix does not provide protocols, preparation directions, or subject-use recommendations.",
    required: true
  },
  {
    id: "affiliation",
    label: "I am affiliated with a laboratory, institution, or research-based facility.",
    clause: "Requester represents research affiliation and responsibility for compliant handling.",
    required: true
  }
];
