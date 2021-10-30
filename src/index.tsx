import App from "./App";
import ReactDOM from "react-dom";
import { StrictMode } from "react";
import "@/styles/overrides.scss";

ReactDOM.render(
  <StrictMode>
    <App />
  </StrictMode>,
  document.getElementById("root")
);
