export type FaqItem = {
  question: string;
  answer: string;
};

export const faqItems: FaqItem[] = [
  {
    question: "Who can access the full catalog?",
    answer:
      "Research teams and purchasing contacts with a legitimate research or procurement use case can sign in, verify email, and complete qualification to unlock the private catalog."
  },
  {
    question: "Why do some pages show prices while preview pages do not?",
    answer:
      "Public pages are a preview. Pricing appears after sign-in and qualification so account-only details stay inside the private catalog."
  },
  {
    question: "Does Mogtrix process payment online?",
    answer:
      "Yes. Qualified customers can buy selected pilot SKUs through hosted checkout, with final US shipping and tax shown in the secure payment step."
  },
  {
    question: "What does the COA Library show?",
    answer:
      "The COA Library shows batch-specific documents and release status for supported products."
  },
  {
    question: "What happens after I check out?",
    answer:
      "Checkout creates the order, sends payment to a secure hosted provider, and then returns status updates to your account order timeline by webhook."
  },
  {
    question: "What if a product is not in the live checkout pilot?",
    answer:
      "Products outside the pilot stay on the manual request path. The product page and cart will tell you when a line item must be handled through request review instead of hosted checkout."
  },
  {
    question: "What if payment fails or the confirmation takes longer than expected?",
    answer:
      "The order stays visible in your account. Failed payments show a retry or follow-up path, and delayed confirmations remain in a payment-pending state until the provider webhook arrives."
  },
  {
    question: "Can Mogtrix provide dosing, personal-use, or medical guidance?",
    answer:
      "No. Mogtrix does not provide dosing, personal-use, or medical guidance. The site is for research-use-only materials."
  }
];
