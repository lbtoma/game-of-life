import { Lives, Coordinates } from "@/types";
import { createContext, FC, useContext } from "react";

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

export class Automata implements Iterator<Readonly<Lives>, Readonly<Lives>> {
  private nextGeneration = new Set<CoordinateIndex>();
  private processedCoordinates = new Set<CoordinateIndex>();
  public onLivesChange: (lives: Readonly<Lives>) => void | PromiseLike<void> =
    () => {};
  private _lives: Set<CoordinateIndex>;

  constructor(
    lives: Lives = [],
    public readonly worldSize: Coordinates = DEFAULT_WORD_SIZE
  ) {
    this._lives = new Set(
      lives.map(({ x, y }): CoordinateIndex => `${x},${y}`)
    );
  }

  get lives(): Readonly<Lives> {
    const lives: Lives = [];

    for (const life of this._lives) {
      const [x, y] = life.split(",").map((i) => parseInt(i)) as [
        number,
        number
      ];
      lives.push({ x, y });
    }

    return lives;
  }

  private _onLivesChange = () => this.onLivesChange(this.lives);

  private processNeighborhood = (
    coordinateIndex: CoordinateIndex,
    isFromLives: boolean
  ): void => {
    let aliveTotal = 0;
    const [x, y] = coordinateIndex.split(",").map((i) => parseInt(i)) as [
      number,
      number
    ];

    this.processedCoordinates.add(coordinateIndex);

    for (const { x: relX, y: relY } of NEIGHBORHOOD_RELATIVE_POSITIONS) {
      const neighbor: CoordinateIndex = `${
        (x - relX + this.worldSize.x) % this.worldSize.x
      },${(y - relY + this.worldSize.y) % this.worldSize.y}`;

      if (isFromLives && !this.processedCoordinates.has(neighbor)) {
        this.processNeighborhood(neighbor, false);
      }

      if (this._lives.has(neighbor)) {
        aliveTotal++;
      }
    }

    if (aliveTotal === 3 || (isFromLives && aliveTotal === 2)) {
      this.nextGeneration.add(coordinateIndex);
    }
  };

  addLives = (lives: Lives) => {
    lives.forEach(({ x, y }) => this._lives.add(`${x},${y}`));
    this._onLivesChange();
  };

  removeLives = (lives: Lives) => {
    lives.forEach(({ x, y }) => this._lives.delete(`${x},${y}`));
    this._onLivesChange();
  };

  clearLives = () => {
    this._lives.clear();
    this._onLivesChange();
  };

  public next = () => {
    this._lives.forEach((i) => this.processNeighborhood(i, true));
    this._lives = this.nextGeneration;
    this._onLivesChange();

    this.nextGeneration = new Set();
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
