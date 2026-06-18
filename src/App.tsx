import CCNInput from "./components/CCNInput";

const styles = {
  page: {
    minHeight: "100vh",
    padding: "40px 20px",
    backgroundColor: "#f8fafc",
    color: "#111827",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  shell: {
    width: "100%",
    maxWidth: "900px",
    margin: "0 auto",
  },
  title: {
    margin: "0 0 8px",
    fontSize: "28px",
    lineHeight: 1.2,
    fontWeight: 800,
  },
  intro: {
    margin: "0 0 24px",
    color: "#4b5563",
    fontSize: "16px",
    lineHeight: 1.5,
  },
};

function App() {
  return (
    <main style={styles.page}>
      <section style={styles.shell}>
        <h1 style={styles.title}>Facility Assessment Snapshot</h1>
        <p style={styles.intro}>
          Enter a CMS Certification Number to begin building the report.
        </p>
        <CCNInput onSearch={() => {}} isLoading={false} />
      </section>
    </main>
  );
}

export default App;
