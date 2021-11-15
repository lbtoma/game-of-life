import type { CSSProperties, FC } from "react";
import Header from "./Header";
import Toolbar from "./Toolbar";

const CONTAINER_STYLE: CSSProperties = {
  marginLeft: "auto",
  marginRight: "auto",
  width: "min-content",
};

const Layout: FC = ({ children }) => (
  <>
    <Header />

    <div style={CONTAINER_STYLE}>{children}</div>

    <Toolbar />
  </>
);

export default Layout;
