import { forwardRef, type CSSProperties, type ReactNode } from "react";
import type { FacilityReportData } from "../types/facility";
import Header from "./Header";

interface FacilityReportProps {
  data: FacilityReportData;
}

const styles = {
  report: {
    width: "100%",
    maxWidth: "820px",
    margin: "0 auto",
    padding: "32px",
    backgroundColor: "#ffffff",
    color: "#000000",
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "28px",
    border: "1px solid #d1d5db",
  },
  labelCell: {
    width: "42%",
    padding: "12px 14px",
    borderBottom: "1px solid #d1d5db",
    color: "#000000",
    fontSize: "14px",
    fontWeight: 700,
    lineHeight: 1.4,
    verticalAlign: "top",
  },
  valueCell: {
    padding: "12px 14px",
    borderBottom: "1px solid #d1d5db",
    color: "#000000",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: 1.4,
    verticalAlign: "top",
  },
  footer: {
    marginTop: "24px",
    textAlign: "center",
    fontSize: "14px",
    lineHeight: 1.4,
  },
  link: {
    color: "#000000",
    textDecoration: "underline",
  },
} satisfies Record<string, CSSProperties>;

function displayValue(value: string | number | null | undefined): ReactNode {
  return value ?? "—";
}

const FacilityReport = forwardRef<HTMLDivElement, FacilityReportProps>(
  function FacilityReport({ data }, ref) {
    const rows: Array<[string, ReactNode]> = [
      ["Name of Facility", data.facilityNameOverride || data.providerName],
      ["Location", data.location],
      ["EMR", displayValue(data.emr)],
      ["Census Capacity", data.certifiedBeds],
      ["Current Census", displayValue(data.currentCensus)],
      ["Type of Patient", displayValue(data.patientType)],
      ["Previous Coverage from Medelite", displayValue(data.prevCoverage)],
      ["Previous Provider Performance from Medelite", displayValue(data.prevPerformance)],
      ["Medical Coverage", displayValue(data.medicalCoverage)],
      ["Overall Star Rating", data.overallRating],
      ["Health Inspection", data.healthInspectionRating],
      ["Staffing", data.staffingRating],
      ["Quality of Resident Care", data.qmRating],
      ["Short Term Hospitalization", displayValue(data.strHospitalization)],
      ["STR National Avg. for Hospitalization", displayValue(data.strNationalAvgHosp)],
      ["STR State National Avg. for Hospitalization", displayValue(data.strStateAvgHosp)],
      ["STR ED Visit", displayValue(data.strEdVisit)],
      ["STR ED Visits National Avg.", displayValue(data.strNationalAvgEd)],
      ["STR ED Visits State Avg.", displayValue(data.strStateAvgEd)],
      ["LT Hospitalization", displayValue(data.ltHospitalization)],
      ["LT National Avg. for Hospitalization", displayValue(data.ltNationalAvgHosp)],
      ["LT State National Avg. for Hospitalization", displayValue(data.ltStateAvgHosp)],
      ["ED Visit", displayValue(data.ltEdVisit)],
      ["LT ED Visits National Avg.", displayValue(data.ltNationalAvgEd)],
      ["LT ED Visits State Avg.", displayValue(data.ltStateAvgEd)],
    ];

    return (
      <div ref={ref} style={styles.report}>
        <Header state={data.state} />

        <table style={styles.table}>
          <tbody>
            {rows.map(([label, value], index) => {
              const rowStyle: CSSProperties = {
                backgroundColor: index % 2 === 0 ? "#ffffff" : "#f9fafb",
              };

              return (
                <tr key={label} style={rowStyle}>
                  <td style={styles.labelCell}>{label}</td>
                  <td style={styles.valueCell}>{value}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <footer style={styles.footer}>
          <a
            href={`https://www.medicare.gov/care-compare/details/nursing-home/${data.ccn}`}
            style={styles.link}
            target="_blank"
            rel="noreferrer"
          >
            View on Medicare Care Compare
          </a>
        </footer>
      </div>
    );
  },
);

export default FacilityReport;
