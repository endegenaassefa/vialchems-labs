import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { ComparativeTable } from "@/components/ui/ComparativeTable";

describe("ComparativeTable", () => {
  const rows = [
    {
      label: "COA coverage",
      industry: "11% of vendors",
      vialchemlabs: "100% of batches",
    },
    {
      label: "Sterility",
      industry: "Rarely reported",
      vialchemlabs: "USP <71> per batch",
    },
  ];

  it("renders a table with caption when provided", () => {
    render(<ComparativeTable rows={rows} caption="Test caption" />);
    expect(screen.getByText("Test caption")).toBeInTheDocument();
  });

  it("renders all rows with both industry and vialchemlabs values", () => {
    render(<ComparativeTable rows={rows} />);
    expect(screen.getByText("COA coverage")).toBeInTheDocument();
    expect(screen.getByText("11% of vendors")).toBeInTheDocument();
    expect(screen.getByText("100% of batches")).toBeInTheDocument();
    expect(screen.getByText("Sterility")).toBeInTheDocument();
    expect(screen.getByText("USP <71> per batch")).toBeInTheDocument();
  });

  it("renders default column headers", () => {
    render(<ComparativeTable rows={rows} />);
    expect(screen.getByText("Industry typical")).toBeInTheDocument();
    expect(screen.getByText("vialchemlabs")).toBeInTheDocument();
  });

  it("renders custom column headers when provided", () => {
    render(
      <ComparativeTable
        rows={rows}
        industryHeader="Old way"
        vialchemlabsHeader="New way"
      />,
    );
    expect(screen.getByText("Old way")).toBeInTheDocument();
    expect(screen.getByText("New way")).toBeInTheDocument();
  });

  it("renders an eyebrow when provided", () => {
    render(<ComparativeTable rows={rows} eyebrow="Side by side" />);
    expect(screen.getByText("Side by side")).toBeInTheDocument();
  });
});
