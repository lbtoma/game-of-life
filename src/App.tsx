import type { CSSProperties, FC } from "react";
import Layout from "./components/Layout";
import Matrix from "./components/Matrix";
import { AutomataProvider } from "./contexts/Automata";
import { TimeFlowProvider } from "./contexts/TimeFlow";
import { ToolsProvider } from "./contexts/Tools";
import { Lives } from "./types";

const MATRIX_STYLE: CSSProperties = {
  width: "120vmin",
  height: "60vmin",
};

const INITIAL_GENERATION: Lives = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
];

const App: FC = () => (
  <TimeFlowProvider>
    <AutomataProvider
      worldSize={{ x: 200, y: 100 }}
      initialGeneration={INITIAL_GENERATION}
    >
      <ToolsProvider>
        <Layout>
          <Matrix style={MATRIX_STYLE} />
        </Layout>
      </ToolsProvider>
    </AutomataProvider>
  </TimeFlowProvider>
);

export default App;
