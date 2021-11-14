import { TimeFlow, TimeFlowProvider, useTimeFlow } from "@/contexts/TimeFlow";
import { render } from "@testing-library/react";
import { FC } from "react";

describe("TimeFlow context", () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  test("Should be created paused", () => {
    const timeFlow = new TimeFlow();
    let isPaused = true;

    timeFlow.onNextTick = () => {
      isPaused = false;
    };

    jest.advanceTimersByTime(Math.floor(1000 / timeFlow.ticksPerSecond) * 3);

    expect(isPaused).toBe(true);
  });

  test("Should start the time flow correctly", () => {
    const timeFlow = new TimeFlow();
    const tickPeriodMs = Math.floor(1000 / timeFlow.ticksPerSecond);
    let ticks = 0;

    timeFlow.onNextTick = () => {
      ticks++;
    };

    timeFlow.start();
    jest.advanceTimersByTime(tickPeriodMs - 1);

    for (let i = 0; i < 3; i++) {
      expect(ticks).toBe(i);
      expect(timeFlow.tick).toBe(i);
      jest.advanceTimersByTime(tickPeriodMs);
    }
  });

  test("Should set the ticks per second correctly", () => {
    const timeFlow = new TimeFlow();
    let ticks = 0;

    timeFlow.onNextTick = () => {
      ticks++;
    };

    timeFlow.ticksPerSecond = 2 * timeFlow.ticksPerSecond;
    let tickPeriodMs = Math.round(1000 / timeFlow.ticksPerSecond);

    for (let i = 0; i < 3; i++) {
      expect(ticks).toBe(0);
      expect(timeFlow.tick).toBe(0);
      jest.advanceTimersByTime(tickPeriodMs);
    }

    timeFlow.start();
    jest.advanceTimersByTime(tickPeriodMs - 1);

    for (let i = 0; i < 3; i++) {
      expect(ticks).toBe(i);
      expect(timeFlow.tick).toBe(i);
      jest.advanceTimersByTime(tickPeriodMs);
    }

    timeFlow.ticksPerSecond = 3;
    tickPeriodMs = Math.round(1000 / timeFlow.ticksPerSecond);
    jest.advanceTimersByTime(tickPeriodMs - 1);

    for (let i = 3; i < 6; i++) {
      expect(ticks).toBe(i);
      expect(timeFlow.tick).toBe(i);
      jest.advanceTimersByTime(tickPeriodMs);
    }

    timeFlow.pause();
    jest.advanceTimersByTime(3 * tickPeriodMs);
    timeFlow.ticksPerSecond = 10;
    tickPeriodMs = Math.round(1000 / timeFlow.ticksPerSecond);
    timeFlow.start();
    jest.advanceTimersByTime(tickPeriodMs - 1);

    for (let i = 6; i < 9; i++) {
      expect(ticks).toBe(i);
      expect(timeFlow.tick).toBe(i);
      jest.advanceTimersByTime(tickPeriodMs);
    }
  });

  test("Should fail if the tick rate is too big", () => {
    expect(() => {
      new TimeFlow().ticksPerSecond = Infinity;
    }).toThrow();
  });

  test("Should pause the the time flow correctly", () => {
    const timeFlow = new TimeFlow();
    const tickPeriodMs = Math.floor(1000 / timeFlow.ticksPerSecond);
    let ticks = 0;

    timeFlow.onNextTick = () => {
      ticks++;
    };

    timeFlow.start();
    jest.advanceTimersByTime(tickPeriodMs - 1);

    for (let i = 0; i < 3; i++) {
      expect(ticks).toBe(i);
      expect(timeFlow.tick).toBe(i);
      jest.advanceTimersByTime(tickPeriodMs);
    }

    timeFlow.pause();
    for (let i = 0; i < 3; i++) {
      expect(ticks).toBe(3);
      expect(timeFlow.tick).toBe(3);
      jest.advanceTimersByTime(tickPeriodMs);
    }

    timeFlow.pause();
    timeFlow.start();
  });

  test("Should render the TimeFlowContext correctly", () => {
    const Component: FC = () => {
      const timeFlow = useTimeFlow();
      timeFlow.ticksPerSecond = 3;

      return <span data-testid="time-flow">{timeFlow.ticksPerSecond}</span>;
    };

    const timeFlowProvider = render(
      <TimeFlowProvider>
        <Component />
      </TimeFlowProvider>
    );

    expect(
      parseInt(timeFlowProvider.getByTestId("time-flow").textContent!)
    ).toBe(3);
  });
});
