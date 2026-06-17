import type { CSSProperties } from "react";

interface HeaderProps {
  state: string;
}

const headerStyles = {
  container: {
    textAlign: "center",
    padding: "28px 16px 24px",
    borderBottom: "2px solid #1f2937",
    color: "#111827",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  brand: {
    margin: 0,
    fontSize: "28px",
    lineHeight: 1.2,
    fontWeight: 800,
    letterSpacing: "0.04em",
  },
  title: {
    margin: "10px 0 0",
    fontSize: "18px",
    lineHeight: 1.3,
    fontWeight: 700,
    letterSpacing: "0.08em",
  },
  state: {
    margin: "8px 0 0",
    fontSize: "18px",
    lineHeight: 1.3,
    fontWeight: 400,
  },
} satisfies Record<string, CSSProperties>;

function Header({ state }: HeaderProps) {
  return (
    <header style={headerStyles.container}>
      <h1 style={headerStyles.brand}>INFINITE — Managed by MEDELITE</h1>
      <p style={headerStyles.title}>FACILITY ASSESSMENT SNAPSHOT</p>
      <p style={headerStyles.state}>{state}</p>
    </header>
  );
}

export default Header;
