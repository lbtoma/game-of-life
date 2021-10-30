import type { CSSProperties, FC } from "react";

const HEADER_STYLE: CSSProperties = {
  display: "block",
  textAlign: "center",
  height: "6rem",
  width: "100%",
};

const Header: FC = () => (
  <header data-testid="header" style={HEADER_STYLE}>
    <h1 data-testid="header-text">The Game of Life</h1>
  </header>
);

export default Header;
