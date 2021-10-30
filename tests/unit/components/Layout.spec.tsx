import { render } from "@testing-library/react";
import Layout from "@/components/Layout";

describe("Layout.tsx", () => {
  test("Should render the header correctly", () => {
    const layout = render(<Layout />);

    expect(layout.getByTestId("header")).toBeDefined();
  });

  test("Should render the child component correctly", () => {
    const layout = render(
      <Layout>
        <div data-testid="child">foo</div>
      </Layout>
    );

    const child = layout.getByTestId("child");

    expect(child.textContent).toBe("foo");
  });
});
