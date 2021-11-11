import { createContext, FC, useContext } from "react";

export interface Coordinates {
  x: number;
  y: number;
}

export type Lives = Coordinates[];

export interface AutomataProps {
  initialGeneration?: Lives;
  worldSize?: Coordinates;
}

type CoordinateIndex = `${number},${number}`;

const NEIGHBORHOOD_RELATIVE_POSITIONS: Coordinates[] = [
  { y: -1, x: -1 },
  { y: -1, x: 0 },
  { y: -1, x: 1 },
  { y: 0, x: -1 },
  { y: 0, x: 1 },
  { y: 1, x: -1 },
  { y: 1, x: 0 },
  { y: 1, x: 1 },
];
const DEFAULT_WORD_SIZE = { x: 128, y: 128 };

export class Automata implements Iterator<Lives, Lives> {
  private nextGeneration: Lives = [];
  private processedCoordinates = new Set<CoordinateIndex>();

  constructor(
    public lives: Lives = [],
    public readonly worldSize: Coordinates = DEFAULT_WORD_SIZE
  ) {}

  private processNeighborhood = (
    coordinates: Coordinates,
    indexInLives?: number
  ): void => {
    let aliveTotal = 0;
    const isAlive = typeof indexInLives === "number";

    this.processedCoordinates.add(`${coordinates.x},${coordinates.y}`);

    for (const { x, y } of NEIGHBORHOOD_RELATIVE_POSITIONS) {
      const neighbor: Coordinates = {
        x: (coordinates.x - x + this.worldSize.x) % this.worldSize.x,
        y: (coordinates.y - y + this.worldSize.y) % this.worldSize.y,
      };

      if (
        isAlive &&
        !this.processedCoordinates.has(`${neighbor.x},${neighbor.y}`)
      ) {
        this.processNeighborhood(neighbor);
      }

      if (this.lives.some(({ x, y }) => x === neighbor.x && y === neighbor.y)) {
        aliveTotal++;
      }
    }

    if (
      (aliveTotal === 3 || (isAlive && aliveTotal === 2)) &&
      this.nextGeneration.every(
        ({ x, y }) => x !== coordinates.x || y !== coordinates.y
      )
    ) {
      this.nextGeneration.push(coordinates);
    }
  };

  public next = () => {
    this.lives.forEach(this.processNeighborhood);
    this.lives = this.nextGeneration;

    this.nextGeneration = [];
    this.processedCoordinates = new Set();

    return { done: false, value: this.lives };
  };
}

const AutomataContext = createContext<Automata>(new Automata());

export const AutomataProvider: FC<AutomataProps> = ({
  initialGeneration,
  worldSize,
  children,
}) => (
  <AutomataContext.Provider
    value={
      new Automata(initialGeneration ?? [], worldSize ?? DEFAULT_WORD_SIZE)
    }
  >
    {children}
  </AutomataContext.Provider>
);

export const useAutomata = () => useContext(AutomataContext);

export default AutomataContext;
