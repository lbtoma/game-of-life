import { Automata } from "@/contexts/Automata";
import { TimeFlow } from "@/contexts/TimeFlow";
import { ToolOption, Tools } from "@/contexts/Tools";

describe("Tools context", () => {
  test("Should get current option correctly", () => {
    const tools = new Tools(new Automata(), new TimeFlow());

    expect(tools.currentOption).toBe(ToolOption.PUT_LIFE);

    tools.currentOption = ToolOption.DELETE_LIFE;
    expect(tools.currentOption).toBe(ToolOption.DELETE_LIFE);
  });

  test("Should set the current option correctly", () => {
    const tools = new Tools(new Automata(), new TimeFlow());

    const onToolChangeSpy = jest.spyOn(tools, "onToolChange");

    tools.currentOption = ToolOption.DELETE_LIFE;

    expect(tools.currentOption).toBe(ToolOption.DELETE_LIFE);
    expect(onToolChangeSpy).toBeCalledWith(ToolOption.DELETE_LIFE);
  });

  test("Should handle the click correctly", () => {
    const automata = new Automata();
    const timeFlow = new TimeFlow();
    const tools = new Tools(automata, timeFlow);

    tools.handleClick({ coordinates: { x: 3, y: 3 }, buttonsSignal: 0b10 });
    expect(automata.lives).toStrictEqual([]);
    tools.handleClick({ coordinates: { x: 3, y: 3 }, buttonsSignal: 0b01 });
    expect(automata.lives).toStrictEqual([{ x: 3, y: 3 }]);

    tools.currentOption = ToolOption.DELETE_LIFE;

    timeFlow.start();
    tools.handleClick({ coordinates: { x: 3, y: 3 }, buttonsSignal: 0b01 });
    expect(automata.lives).toStrictEqual([{ x: 3, y: 3 }]);
    timeFlow.pause();
    tools.handleClick({ coordinates: { x: 3, y: 3 }, buttonsSignal: 0b01 });
    expect(automata.lives).toStrictEqual([]);
  });
});
