import { useState, type CSSProperties, type FormEvent } from "react";

interface CCNInputProps {
  onSearch: (ccn: string) => void;
  isLoading: boolean;
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    width: "100%",
    maxWidth: "440px",
  },
  row: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },
  input: {
    flex: 1,
    minWidth: 0,
    padding: "10px 12px",
    border: "1px solid #cbd5e1",
    borderRadius: "6px",
    fontSize: "16px",
    lineHeight: 1.4,
  },
  button: {
    padding: "10px 16px",
    border: "1px solid #1f2937",
    borderRadius: "6px",
    backgroundColor: "#1f2937",
    color: "#ffffff",
    fontSize: "16px",
    fontWeight: 700,
    lineHeight: 1.4,
    cursor: "pointer",
  },
  disabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
  error: {
    margin: 0,
    color: "#b91c1c",
    fontSize: "14px",
    lineHeight: 1.4,
  },
} satisfies Record<string, CSSProperties>;

function CCNInput({ onSearch, isLoading }: CCNInputProps) {
  const [ccn, setCcn] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedCcn = ccn.trim();

    if (!trimmedCcn || trimmedCcn.length !== 6) {
      setError("Enter a 6-digit CCN.");
      return;
    }

    onSearch(trimmedCcn);
  }

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <div style={styles.row}>
        <input
          type="text"
          inputMode="numeric"
          value={ccn}
          onChange={(event) => {
            setCcn(event.target.value);
            setError("");
          }}
          disabled={isLoading}
          placeholder="686123"
          aria-label="CMS Certification Number"
          aria-invalid={Boolean(error)}
          style={{
            ...styles.input,
            ...(isLoading ? styles.disabled : {}),
          }}
        />
        <button
          type="submit"
          disabled={isLoading}
          style={{
            ...styles.button,
            ...(isLoading ? styles.disabled : {}),
          }}
        >
          {isLoading ? "Searching..." : "Search"}
        </button>
      </div>
      {error ? <p style={styles.error}>{error}</p> : null}
    </form>
  );
}

export default CCNInput;
