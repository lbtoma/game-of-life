import { render } from "@testing-library/react";
import Header from "@/components/Header";

describe("Header.tsx", () => {
  test("Should render the header text correctly", () => {
    const header = render(<Header />);

    expect(header.getByTestId("header-text").textContent).toBe(
      "The Game of Life"
    );
  });
});
