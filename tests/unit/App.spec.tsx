import { render } from "@testing-library/react";
import App from "@/App";

describe("App.tsx", () => {
  test("Should render the app correctly", () => {
    render(<App />);
  });
});
