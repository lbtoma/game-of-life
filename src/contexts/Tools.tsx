import { Coordinates } from "@/types";
import { Automata, useAutomata } from "@/contexts/Automata";
import { createContext, FC, useContext } from "react";
import { TimeFlow, useTimeFlow } from "./TimeFlow";

export enum ToolOption {
  PUT_LIFE,
  DELETE_LIFE,
}

export interface ClickEvent {
  coordinates?: Coordinates;
  buttonsSignal: number;
}

const LEFT_CLICK_MASK = 0b1;

export class Tools {
  private _currentOption = ToolOption.PUT_LIFE;
  public onToolChange: (tool: ToolOption) => void | PromiseLike<void> =
    () => {};

  constructor(private automata: Automata, private timeFlow: TimeFlow) {}

  handleClick = ({ coordinates, buttonsSignal }: ClickEvent) => {
    const isLeftClick = buttonsSignal & LEFT_CLICK_MASK;

    if (isLeftClick && !this.timeFlow.isRunning && coordinates) {
      switch (this._currentOption) {
        case ToolOption.PUT_LIFE:
          this.automata.addLives([coordinates]);
          break;
        case ToolOption.DELETE_LIFE:
          this.automata.removeLives([coordinates]);
          break;
        default:
          break;
      }
    }
  };

  get currentOption(): ToolOption {
    return this._currentOption;
  }

  set currentOption(option: ToolOption) {
    this._currentOption = option;
    this.onToolChange(option);
  }
}

export const ToolsContext = createContext(
  new Tools(new Automata(), new TimeFlow())
);

export const ToolsProvider: FC = ({ children }) => {
  const automata = useAutomata();
  const timeFlow = useTimeFlow();

  return (
    <ToolsContext.Provider value={new Tools(automata, timeFlow)}>
      {children}
    </ToolsContext.Provider>
  );
};

export const useTools = () => useContext(ToolsContext);
