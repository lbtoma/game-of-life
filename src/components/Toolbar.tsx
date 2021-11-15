import { useTimeFlow } from "@/contexts/TimeFlow";
import { ToolOption, useTools } from "@/contexts/Tools";
import { ChangeEvent, CSSProperties, FC, useState } from "react";

const ACTIVE_OPTION_STYLE: CSSProperties = { color: "orange" };

const Toolbar: FC = () => {
  const timeFlow = useTimeFlow();
  const tools = useTools();
  const [ticksPerSecond, setTicksPerSecond] = useState(timeFlow.ticksPerSecond);
  const [isRunning, setIsRunning] = useState(timeFlow.isRunning);
  const [toolOption, setToolOption] = useState(tools.currentOption);

  tools.onToolChange = setToolOption;

  const onStartStopClick = () => {
    isRunning ? timeFlow.pause() : timeFlow.start();

    setIsRunning(timeFlow.isRunning);
  };

  const onTicksPerSecondChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    timeFlow.ticksPerSecond = parseInt(e.currentTarget.value);
    setTicksPerSecond(timeFlow.ticksPerSecond);
  };

  return (
    <div className="toolbar__container">
      <button
        data-testid="start-stop-button"
        className="toolbar__button"
        onClick={onStartStopClick}
        style={{ color: isRunning ? "red" : "cyan" }}
      >
        {isRunning ? "STOP" : "START"}
      </button>
      <label className="toolbar__label">Ticks/s:</label>
      <input
        data-testid="tick-rate-slider"
        className="toolbar__input"
        type="range"
        step={1}
        min={1}
        max={100}
        value={ticksPerSecond}
        onChange={onTicksPerSecondChange}
      />
      <input
        data-testid="tick-rate-number"
        className="toolbar__input toolbar__tick-rate-number"
        type="number"
        min={1}
        max={100}
        value={ticksPerSecond}
        onChange={onTicksPerSecondChange}
      />
      <button
        data-testid="add-life-button"
        className="toolbar__button"
        onClick={() => {
          tools.currentOption = ToolOption.PUT_LIFE;
        }}
        style={
          (toolOption === ToolOption.PUT_LIFE && ACTIVE_OPTION_STYLE) || {}
        }
      >
        +
      </button>
      <button
        data-testid="remove-life-button"
        className="toolbar__button"
        onClick={() => {
          tools.currentOption = ToolOption.DELETE_LIFE;
        }}
        style={
          (toolOption === ToolOption.DELETE_LIFE && ACTIVE_OPTION_STYLE) || {}
        }
      >
        -
      </button>
    </div>
  );
};

export default Toolbar;
