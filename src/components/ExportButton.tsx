import { useState, type CSSProperties, type RefObject } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

interface ExportButtonProps {
  reportRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
}

const styles = {
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
} satisfies Record<string, CSSProperties>;

function ExportButton({ reportRef, disabled }: ExportButtonProps) {
  const [isExporting, setIsExporting] = useState(false);
  const isDisabled = disabled || isExporting;

  async function handleExport() {
    if (!reportRef.current || isDisabled) {
      return;
    }

    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, {
        scale: 2,
      });
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 10;
      const imageWidth = pageWidth - margin * 2;
      const imageHeight = (canvas.height * imageWidth) / canvas.width;

      pdf.addImage(imageData, "JPEG", margin, margin, imageWidth, imageHeight);
      pdf.save("facility-assessment.pdf");
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleExport}
      disabled={isDisabled}
      style={{
        ...styles.button,
        ...(isDisabled ? styles.disabled : {}),
      }}
    >
      {isExporting ? "Exporting..." : "Export PDF"}
    </button>
  );
}

export default ExportButton;
