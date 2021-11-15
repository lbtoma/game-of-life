import Matrix, { getLifeCoordinates } from "@/components/Matrix";
import { render } from "@testing-library/react";

describe("Matrix component", () => {
  test("Should get life coordinates correctly", () => {
    expect(
      getLifeCoordinates(
        { clientX: 200, clientY: 140 } as MouseEvent,
        { width: 300, height: 200, top: 40, left: 50 } as DOMRect,
        { x: 600, y: 300 }
      )
    ).toStrictEqual({ x: 300, y: 150 });

    expect(
      getLifeCoordinates(
        { clientX: 200, clientY: 240 } as MouseEvent,
        { width: 300, height: 200, top: 40, left: 50 } as DOMRect,
        { x: 600, y: 300 }
      )
    ).toStrictEqual(undefined);

    expect(
      getLifeCoordinates(
        { clientX: 350, clientY: 140 } as MouseEvent,
        { width: 300, height: 200, top: 40, left: 50 } as DOMRect,
        { x: 600, y: 300 }
      )
    ).toStrictEqual(undefined);

    expect(
      getLifeCoordinates(
        { clientX: 2000, clientY: 140 } as MouseEvent,
        { width: 300, height: 200, top: 40, left: 50 } as DOMRect,
        { x: 600, y: 300 }
      )
    ).toBe(undefined);

    expect(
      getLifeCoordinates(
        { clientX: 200, clientY: 1400 } as MouseEvent,
        { width: 300, height: 200, top: 40, left: 50 } as DOMRect,
        { x: 600, y: 300 }
      )
    ).toBe(undefined);
  });

  test("Should render the Matrix correctly", () => {
    const matrix = render(<Matrix />);

    expect(matrix.getByTestId("matrix").tagName).toBe("CANVAS");
  });
});
