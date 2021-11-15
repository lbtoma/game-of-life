import type { CSSProperties, FC } from "react";
import Layout from "./components/Layout";
import Matrix from "./components/Matrix";
import { AutomataProvider, Lives } from "./contexts/Automata";
import { TimeFlowProvider } from "./contexts/TimeFlow";

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
      worldSize={{ x: 180, y: 90 }}
      initialGeneration={INITIAL_GENERATION}
    >
      <Layout>
        <Matrix style={MATRIX_STYLE} />
      </Layout>
    </AutomataProvider>
  </TimeFlowProvider>
);

export default App;
