import { useRef, useState, type CSSProperties } from "react";
import CCNInput from "./components/CCNInput";
import ExportButton from "./components/ExportButton";
import FacilityReport from "./components/FacilityReport";
import ManualInputsForm from "./components/ManualInputs";
import { fetchFacilityData } from "./services/cmsApi";
import type { FacilityReportData, ManualInputs } from "./types/facility";
import "./App.css";

const emptyManualInputs: ManualInputs = {
  facilityNameOverride: undefined,
  emr: undefined,
  currentCensus: undefined,
  patientType: undefined,
  prevCoverage: undefined,
  prevPerformance: undefined,
  medicalCoverage: undefined,
};

const styles = {
  title: {
    margin: "0 0 24px",
    color: "#111827",
    fontSize: "30px",
    fontWeight: 800,
    lineHeight: 1.2,
  },
  searchSection: {
    marginBottom: "20px",
  },
  error: {
    margin: "12px 0 0",
    color: "#b91c1c",
    fontSize: "14px",
    lineHeight: 1.4,
  },
  columnTitle: {
    margin: "0 0 12px",
    color: "#111827",
    fontSize: "18px",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  exportRow: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: "24px",
  },
} satisfies Record<string, CSSProperties>;

function normalizeManualValue(field: keyof ManualInputs, value: string) {
  if (field === "currentCensus") {
    return value === "" ? undefined : Number(value);
  }

  if (field === "prevCoverage") {
    return value === "" ? undefined : (value as ManualInputs["prevCoverage"]);
  }

  return value === "" ? undefined : value;
}

function App() {
  const [ccn, setCcn] = useState("");
  const [facilityData, setFacilityData] = useState<FacilityReportData | null>(
    null,
  );
  const [manualInputs, setManualInputs] =
    useState<ManualInputs>(emptyManualInputs);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  async function handleSearch(searchCcn: string) {
    setIsLoading(true);
    setError(null);
    setFacilityData(null);

    try {
      const data = await fetchFacilityData(searchCcn);
      setFacilityData(data);
      setCcn(searchCcn);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to fetch facility data.",
      );
    } finally {
      setIsLoading(false);
    }
  }

  function handleManualChange(field: keyof ManualInputs, value: string) {
    const nextValue = normalizeManualValue(field, value);

    setManualInputs((currentInputs) => ({
      ...currentInputs,
      [field]: nextValue,
    }));

    setFacilityData((currentData) =>
      currentData
        ? {
            ...currentData,
            [field]: nextValue,
          }
        : currentData,
    );
  }

  const reportData = facilityData
    ? {
        ...facilityData,
        ...manualInputs,
      }
    : null;

  return (
    <main className="app-page">
      <section className="app-container">
        <h1 style={styles.title}>Facility Assessment Report Generator</h1>

        <div style={styles.searchSection}>
          <CCNInput onSearch={handleSearch} isLoading={isLoading} />
          {error ? <p style={styles.error}>{error}</p> : null}
        </div>

        {reportData ? (
          <div className="app-report-grid">
            <section className="app-form-column">
              <h2 style={styles.columnTitle}>Manual Inputs</h2>
              <ManualInputsForm
                values={manualInputs}
                onChange={handleManualChange}
              />
            </section>

            <section className="app-report-column">
              <FacilityReport ref={reportRef} data={reportData} />
            </section>
          </div>
        ) : null}

        <div style={styles.exportRow}>
          <ExportButton
            reportRef={reportRef}
            disabled={facilityData === null || isLoading}
          />
        </div>

        {ccn ? <span className="app-loaded-ccn">Loaded CCN: {ccn}</span> : null}
      </section>
    </main>
  );
}

export default App;
