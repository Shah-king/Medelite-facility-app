import type { CSSProperties, ChangeEvent } from "react";
import type { ManualInputs as ManualInputsValues } from "../types/facility";

interface ManualInputsProps {
  values: ManualInputsValues;
  onChange: (field: keyof ManualInputsValues, value: string) => void;
}

const styles = {
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
    width: "100%",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
  },
  label: {
    color: "#111827",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.4,
  },
  control: {
    width: "100%",
    boxSizing: "border-box",
    padding: "9px 11px",
    border: "1px solid #cbd5e1",
    borderRadius: "4px",
    backgroundColor: "#ffffff",
    color: "#111827",
    fontSize: "15px",
    lineHeight: 1.4,
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
} satisfies Record<string, CSSProperties>;

function ManualInputs({ values, onChange }: ManualInputsProps) {
  function handleChange(field: keyof ManualInputsValues) {
    return (event: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(field, event.target.value);
    };
  }

  return (
    <form style={styles.form}>
      <label style={styles.field}>
        <span style={styles.label}>Facility Name Override</span>
        <input
          type="text"
          value={values.facilityNameOverride ?? ""}
          onChange={handleChange("facilityNameOverride")}
          placeholder="Leave blank to use CMS name"
          style={styles.control}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>EMR</span>
        <input
          type="text"
          value={values.emr ?? ""}
          onChange={handleChange("emr")}
          placeholder="e.g. PCC, MatrixCare"
          style={styles.control}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Current Census</span>
        <input
          type="number"
          value={values.currentCensus ?? ""}
          onChange={handleChange("currentCensus")}
          style={styles.control}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Type of Patient</span>
        <input
          type="text"
          value={values.patientType ?? ""}
          onChange={handleChange("patientType")}
          placeholder="e.g. Long-term & Short-term"
          style={styles.control}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Previous Coverage from Medelite</span>
        <select
          value={values.prevCoverage ?? ""}
          onChange={handleChange("prevCoverage")}
          style={styles.control}
        >
          <option value=""></option>
          <option value="Yes">Yes</option>
          <option value="No">No</option>
        </select>
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Previous Provider Performance from Medelite</span>
        <input
          type="text"
          value={values.prevPerformance ?? ""}
          onChange={handleChange("prevPerformance")}
          placeholder="e.g. About 30 patients/day"
          style={styles.control}
        />
      </label>

      <label style={styles.field}>
        <span style={styles.label}>Medical Coverage</span>
        <input
          type="text"
          value={values.medicalCoverage ?? ""}
          onChange={handleChange("medicalCoverage")}
          placeholder="e.g. Optometry, PCP, Podiatry"
          style={styles.control}
        />
      </label>
    </form>
  );
}

export default ManualInputs;
