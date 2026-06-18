import type { CSSProperties } from "react";
import logo from "../assets/infinite-medelite-logo.png";

interface HeaderProps {
  state: string;
}

const headerStyles = {
  container: {
    textAlign: "center",
    padding: "16px 16px 16px",
    borderBottom: "2px solid #1f2937",
    color: "#111827",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  logo: {
    display: "block",
    width: "210px",
    height: "auto",
    margin: "0 auto 10px",
  },
  title: {
    margin: "0",
    fontSize: "13px",
    lineHeight: 1.25,
    fontWeight: 700,
    letterSpacing: "0.06em",
  },
  state: {
    margin: "6px 0 0",
    fontSize: "13px",
    lineHeight: 1.25,
    fontWeight: 400,
  },
} satisfies Record<string, CSSProperties>;

function Header({ state }: HeaderProps) {
  return (
    <header style={headerStyles.container}>
      <img
        src={logo}
        alt="INFINITE — Managed by MEDELITE"
        style={headerStyles.logo}
      />
      <p style={headerStyles.title}>FACILITY ASSESSMENT SNAPSHOT</p>
      <p style={headerStyles.state}>{state}</p>
    </header>
  );
}

export default Header;
