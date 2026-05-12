import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VialHero } from "@/components/vial-hero";

vi.mock("next/image", () => ({
  default: ({ alt, priority: _priority, src, ...props }: React.ImgHTMLAttributes<HTMLImageElement> & { priority?: boolean; src: string }) => (
    <img alt={alt} src={src} {...props} />
  )
}));

describe("VialHero", () => {
  it("renders the realistic vial asset with the motion layers", () => {
    const { getByTestId } = render(<VialHero />);

    const image = screen.getByAltText("Mogtrix vial");
    expect(image).toHaveAttribute("src", "/vials/realistic-vial.png");
    expect(getByTestId("vial-shadow")).toBeInTheDocument();
    expect(getByTestId("vial-highlight")).toBeInTheDocument();
  });
});
