export type TestingStep = {
  title: string;
  body: string;
};

export const testingHighlights = [
  "Batch-linked document status for each signed-in storefront record.",
  "Support documents referenced without exposing unsafe preparation language.",
  "Library and lookup flows built to map each batch code to a current review state."
];

export const testingSteps: TestingStep[] = [
  {
    title: "Identity and record review",
    body:
      "Each storefront record is paired with a batch code, catalog code, and documentation status so qualified buyers can review identity context before entering the request flow."
  },
  {
    title: "COA release control",
    body:
      "Document release is tied to the current batch state. Some records are COA-ready, while others remain in document review until the latest packet is cleared."
  },
  {
    title: "Library and lookup surfaces",
    body:
      "The COA Library, testing page, and batch lookup are separate from checkout so support research documentation without implying live commerce."
  }
];
