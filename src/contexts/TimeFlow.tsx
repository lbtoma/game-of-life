import { createContext, FC, useContext } from "react";

export const DEFAULT_TICK_PERIOD_MS = 200;

export class TimeFlow {
  private interval: ReturnType<typeof setInterval> | null = null;
  private tickPeriodMs: number = DEFAULT_TICK_PERIOD_MS;
  private _tick: number = 0;
  onNextTick: () => void | PromiseLike<void> = () => {};

  get isRunning(): boolean {
    return !!this.interval;
  }

  get ticksPerSecond(): number {
    return 1000 / this.tickPeriodMs;
  }

  set ticksPerSecond(ticksPerSecond: number) {
    this.tickPeriodMs = Math.round(1000 / ticksPerSecond);

    if (!this.tickPeriodMs) throw "Too many ticks per second!";
    if (this.isRunning) this.start();
  }

  get tick(): number {
    return this._tick;
  }

  start = () => {
    if (this.isRunning) clearInterval(this.interval!);

    this.interval = setInterval(async () => {
      this._tick++;
      await this.onNextTick();
    }, this.tickPeriodMs);
  };

  pause = () => {
    if (this.interval) clearInterval(this.interval);
    this.interval = null;
  };
}

export const TimeFlowContext = createContext<TimeFlow>(new TimeFlow());

export const TimeFlowProvider: FC = ({ children }) => (
  <TimeFlowContext.Provider value={new TimeFlow()}>
    {children}
  </TimeFlowContext.Provider>
);

export const useTimeFlow = () => useContext(TimeFlowContext);
