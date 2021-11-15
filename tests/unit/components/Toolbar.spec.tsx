import Toolbar from "@/components/Toolbar";
import { TimeFlow, TimeFlowContext } from "@/contexts/TimeFlow";
import { render, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

describe("Toolbar component", () => {
  test("Should render the Toolbar correctly", () => {
    const toolbar = render(<Toolbar />);

    expect(toolbar.getByTestId("start-stop-button").innerHTML).toBe("START");
    expect(toolbar.baseElement.innerHTML).toContain("Ticks/s");
    expect(toolbar.getByTestId("tick-rate-slider")).toBeDefined();
    expect(toolbar.getByTestId("tick-rate-number")).toBeDefined();
  });

  test("Should start and stop the time correctly", () => {
    const timeFlow = new TimeFlow();
    const toolbar = render(
      <TimeFlowContext.Provider value={timeFlow}>
        <Toolbar />
      </TimeFlowContext.Provider>
    );

    expect(timeFlow.isRunning).toBe(false);

    let button = toolbar.getByTestId("start-stop-button");
    expect(button.innerHTML).toBe("START");

    userEvent.click(button);
    expect(timeFlow.isRunning).toBe(true);

    button = toolbar.getByTestId("start-stop-button");
    expect(button.innerHTML).toBe("STOP");

    userEvent.click(button);
    expect(timeFlow.isRunning).toBe(false);
  });

  test("Should control the tick rate correctly", () => {
    const timeFlow = new TimeFlow();
    const toolbar = render(
      <TimeFlowContext.Provider value={timeFlow}>
        <Toolbar />
      </TimeFlowContext.Provider>
    );

    fireEvent.change(toolbar.getByTestId("tick-rate-slider"), {
      target: { value: "10" },
    });
    expect(timeFlow.ticksPerSecond).toBe(10);

    fireEvent.change(toolbar.getByTestId("tick-rate-number"), {
      target: { value: "20" },
    });
    expect(timeFlow.ticksPerSecond).toBe(20);
  });
});
