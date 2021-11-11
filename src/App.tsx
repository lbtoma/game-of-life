import type { CSSProperties, FC } from "react";
import Layout from "./components/Layout";
import Matrix from "./components/Matrix";
import { AutomataProvider, Lives } from "./contexts/Automata";

const MATRIX_STYLE: CSSProperties = {
  width: "160vmin",
  height: "80vmin",
};

const INITIAL_GENERATION: Lives = [
  { x: 0, y: 0 },
  { x: 1, y: 1 },
  { x: 1, y: 2 },
  { x: 2, y: 0 },
  { x: 2, y: 1 },
];

const App: FC = () => (
  <AutomataProvider
    worldSize={{ x: 254, y: 128 }}
    initialGeneration={INITIAL_GENERATION}
  >
    <Layout>
      <Matrix style={MATRIX_STYLE} />
    </Layout>
  </AutomataProvider>
);

export default App;
