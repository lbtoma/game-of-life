import {
  Automata,
  AutomataProvider,
  Coordinates,
  Lives,
  useAutomata,
} from "@/contexts/Automata";
import { render } from "@testing-library/react";
import { FC } from "react";

describe("Automata context", () => {
  test("The live cell should dead with too few neighbors", () => {
    const automata = new Automata([
      { x: 10, y: 10 },
      { x: 20, y: 20 },
      { x: 21, y: 20 },
    ]);

    expect(automata.next().value).toStrictEqual([]);
  });

  test("The live cell should survive with 2 or 3 neighbors", () => {
    const automata = new Automata([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 10, y: 12 },
      { x: 20, y: 20 },
      { x: 20, y: 21 },
      { x: 20, y: 22 },
      { x: 21, y: 21 },
    ]);

    const nextGeneration = automata.next().value;

    expect(nextGeneration.some(({ x, y }) => x === 10 && y === 11)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 20 && y === 20)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 20 && y === 21)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 20 && y === 22)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 21 && y === 21)).toBe(true);
  });

  test("A life should birth with 3 neighbors", () => {
    const automata = new Automata([
      { x: 10, y: 10 },
      { x: 11, y: 10 },
      { x: 12, y: 10 },
    ]);

    expect(automata.next().value.some(({ x, y }) => x === 11 && y === 11)).toBe(
      true
    );
  });

  test("A life should not birth without exactly 3 neighbors", () => {
    const automata = new Automata([
      { x: 10, y: 10 },
      { x: 10, y: 11 },
      { x: 19, y: 20 },
      { x: 20, y: 20 },
      { x: 21, y: 21 },
      { x: 20, y: 22 },
      { x: 29, y: 29 },
      { x: 30, y: 29 },
      { x: 31, y: 29 },
      { x: 29, y: 30 },
      { x: 31, y: 30 },
      { x: 29, y: 31 },
      { x: 30, y: 31 },
      { x: 31, y: 31 },
    ]);

    const nextGeneration = automata.next().value;

    expect(nextGeneration.some(({ x, y }) => x === 5 && y == 5)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => x === 9 && y === 10)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => x === 20 && y === 21)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => x === 30 && y === 30)).toBe(false);
  });

  test("Should render the automata provider correctly", () => {
    const initialGeneration: Lives = [{ x: 1, y: 1 }];
    const worldSize: Coordinates = { x: 12, y: 24 };
    const Component: FC = () => {
      const a = useAutomata();

      return (
        <span data-testid="automata">
          {JSON.stringify(a.lives)},{JSON.stringify(a.worldSize)}
        </span>
      );
    };

    const automataProvider = render(
      <AutomataProvider
        initialGeneration={initialGeneration}
        worldSize={worldSize}
      >
        <Component />
      </AutomataProvider>
    );

    expect(automataProvider.getByTestId("automata").textContent).toBe(
      `${JSON.stringify(initialGeneration)},${JSON.stringify(worldSize)}`
    );
  });

  test("Should handle the space boundary correctly", () => {
    const automata = new Automata([
      { x: 6, y: 0 },
      { x: 7, y: 0 },
      { x: 8, y: 0 },
      { x: 0, y: 6 },
      { x: 0, y: 7 },
      { x: 0, y: 8 },
      { x: 16, y: 127 },
      { x: 17, y: 127 },
      { x: 18, y: 127 },
      { x: 127, y: 16 },
      { x: 127, y: 17 },
      { x: 127, y: 18 },
    ]);

    const nextGeneration = automata.next().value;

    expect(nextGeneration.some(({ x, y }) => x === 7 && y === 0)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 6 && y === 0)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => x === 8 && y === 0)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => x === 7 && y === 127)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 7 && y === 1)).toBe(true);

    expect(nextGeneration.some(({ x, y }) => y === 7 && x === 0)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => y === 6 && x === 0)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => y === 8 && x === 0)).toBe(false);
    expect(nextGeneration.some(({ x, y }) => y === 7 && x === 127)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => y === 7 && x === 1)).toBe(true);

    expect(nextGeneration.some(({ x, y }) => x === 17 && y === 127)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 16 && y === 127)).toBe(
      false
    );
    expect(nextGeneration.some(({ x, y }) => x === 18 && y === 127)).toBe(
      false
    );
    expect(nextGeneration.some(({ x, y }) => x === 17 && y === 0)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => x === 17 && y === 126)).toBe(true);

    expect(nextGeneration.some(({ x, y }) => y === 17 && x === 127)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => y === 16 && x === 127)).toBe(
      false
    );
    expect(nextGeneration.some(({ x, y }) => y === 18 && x === 127)).toBe(
      false
    );
    expect(nextGeneration.some(({ x, y }) => y === 17 && x === 0)).toBe(true);
    expect(nextGeneration.some(({ x, y }) => y === 17 && x === 126)).toBe(true);
  });
});
