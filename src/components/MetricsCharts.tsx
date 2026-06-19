import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import type { CSSProperties } from "react";
import type { FacilityReportData } from "../types/facility";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

interface MetricsChartsProps {
  data: FacilityReportData;
}

const colors = {
  facility: "#1f2937",
  national: "#9ca3af",
  state: "#93c5fd",
  border: "#d1d5db",
  muted: "#6b7280",
  text: "#111827",
  panel: "#ffffff",
  subtle: "#f9fafb",
};

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    width: "100%",
  },
  cardsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
    gap: "12px",
  },
  card: {
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    backgroundColor: colors.panel,
    padding: "14px",
  },
  cardLabel: {
    margin: 0,
    color: colors.muted,
    fontSize: "12px",
    fontWeight: 700,
    lineHeight: 1.3,
  },
  cardValue: {
    margin: "6px 0 4px",
    color: colors.text,
    fontSize: "30px",
    fontWeight: 800,
    lineHeight: 1,
  },
  stars: {
    color: colors.text,
    fontSize: "18px",
    letterSpacing: "0.04em",
    lineHeight: 1,
  },
  section: {
    border: `1px solid ${colors.border}`,
    borderRadius: "6px",
    backgroundColor: colors.panel,
    padding: "16px",
  },
  sectionTitle: {
    margin: "0 0 12px",
    color: colors.text,
    fontSize: "16px",
    fontWeight: 800,
    lineHeight: 1.3,
  },
  legend: {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    marginBottom: "12px",
  },
  legendItem: {
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
    color: colors.text,
    fontSize: "12px",
    lineHeight: 1.3,
  },
  swatch: {
    width: "12px",
    height: "12px",
    borderRadius: "2px",
  },
  chartWrap: {
    position: "relative",
    height: "300px",
  },
  note: {
    margin: "10px 0 0",
    color: colors.muted,
    fontSize: "12px",
    lineHeight: 1.4,
  },
} satisfies Record<string, CSSProperties>;

const chartOptions = (yAxisLabel: string): ChartOptions<"bar"> => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      enabled: true,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
    },
    y: {
      beginAtZero: true,
      title: {
        display: true,
        text: yAxisLabel,
      },
    },
  },
});

function parseMetric(value: string | number | null | undefined): number {
  if (value === null || value === undefined || value === "") {
    return 0;
  }

  const parsed = typeof value === "number" ? value : Number(value.replace("%", ""));

  return Number.isFinite(parsed) ? parsed : 0;
}

function hasMissingValues(values: Array<string | number | null | undefined>): boolean {
  return values.some((value) => value === null || value === undefined || value === "");
}

function starsForRating(rating: number): string {
  const roundedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return "★".repeat(roundedRating) + "☆".repeat(5 - roundedRating);
}

function MetricCard({ label, value }: { label: string; value: number | undefined }) {
  const safeValue = value ?? 0;
  return (
    <article style={styles.card}>
      <p style={styles.cardLabel}>{label}</p>
      <p style={styles.cardValue}>{value ?? "—"}</p>
      <div aria-label={`${safeValue} out of 5 stars`} style={styles.stars}>
        {starsForRating(safeValue)}
      </div>
    </article>
  );
}

function CustomLegend() {
  const items = [
    ["Facility", colors.facility],
    ["National Avg", colors.national],
    ["State Avg", colors.state],
  ];

  return (
    <div style={styles.legend}>
      {items.map(([label, color]) => (
        <span key={label} style={styles.legendItem}>
          <span style={{ ...styles.swatch, backgroundColor: color }} />
          {label}
        </span>
      ))}
    </div>
  );
}

function GroupedBarChart({
  title,
  yAxisLabel,
  values,
}: {
  title: string;
  yAxisLabel: string;
  values: {
    hospitalization: [string | number | undefined, string | number | undefined, string | number | undefined];
    edVisit: [string | number | undefined, string | number | undefined, string | number | undefined];
  };
}) {
  const allValues = [...values.hospitalization, ...values.edVisit];
  const chartData: ChartData<"bar"> = {
    labels: ["Hospitalization", "ED Visit"],
    datasets: [
      {
        label: "Facility",
        data: [
          parseMetric(values.hospitalization[0]),
          parseMetric(values.edVisit[0]),
        ],
        backgroundColor: colors.facility,
      },
      {
        label: "National Avg",
        data: [
          parseMetric(values.hospitalization[1]),
          parseMetric(values.edVisit[1]),
        ],
        backgroundColor: colors.national,
      },
      {
        label: "State Avg",
        data: [
          parseMetric(values.hospitalization[2]),
          parseMetric(values.edVisit[2]),
        ],
        backgroundColor: colors.state,
      },
    ],
  };

  return (
    <section style={styles.section}>
      <h2 style={styles.sectionTitle}>{title}</h2>
      <CustomLegend />
      <div style={styles.chartWrap}>
        <Bar data={chartData} options={chartOptions(yAxisLabel)} />
      </div>
      {hasMissingValues(allValues) ? (
        <p style={styles.note}>Some comparison data unavailable for this facility</p>
      ) : null}
    </section>
  );
}

function MetricsCharts({ data }: MetricsChartsProps) {
  return (
    <section style={styles.container}>
      <div style={styles.cardsGrid}>
        <MetricCard label="Overall Star Rating" value={data.overallRating} />
        <MetricCard label="Health Inspection" value={data.healthInspectionRating} />
        <MetricCard label="Staffing" value={data.staffingRating} />
        <MetricCard label="Quality of Resident Care" value={data.qmRating} />
      </div>

      <GroupedBarChart
        title="Short-Term Metrics"
        yAxisLabel="Percentage (%)"
        values={{
          hospitalization: [
            data.strHospitalization,
            data.strNationalAvgHosp,
            data.strStateAvgHosp,
          ],
          edVisit: [data.strEdVisit, data.strNationalAvgEd, data.strStateAvgEd],
        }}
      />

      <GroupedBarChart
        title="Long-Term Metrics"
        yAxisLabel="Per 1,000 resident days"
        values={{
          hospitalization: [
            data.ltHospitalization,
            data.ltNationalAvgHosp,
            data.ltStateAvgHosp,
          ],
          edVisit: [data.ltEdVisit, data.ltNationalAvgEd, data.ltStateAvgEd],
        }}
      />
    </section>
  );
}

export default MetricsCharts;
