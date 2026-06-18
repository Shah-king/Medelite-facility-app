import { useState, type CSSProperties, type RefObject } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import type { FacilityReportData } from "../types/facility";

interface ExportButtonProps {
  reportRef: RefObject<HTMLDivElement | null>;
  disabled: boolean;
  data: FacilityReportData | null;
}

const styles = {
  group: {
    display: "flex",
    gap: "10px",
    flexWrap: "wrap",
    justifyContent: "flex-end",
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
  secondaryButton: {
    backgroundColor: "#ffffff",
    color: "#1f2937",
  },
  disabled: {
    opacity: 0.65,
    cursor: "not-allowed",
  },
} satisfies Record<string, CSSProperties>;

const EXPORT_WIDTH_PX = 760;
const PDF_MARGIN_MM = 8;
const encoder = new TextEncoder();

function createExportNode(source: HTMLDivElement): HTMLDivElement {
  const exportNode = source.cloneNode(true) as HTMLDivElement;

  exportNode.style.position = "fixed";
  exportNode.style.left = "-10000px";
  exportNode.style.top = "0";
  exportNode.style.width = `${EXPORT_WIDTH_PX}px`;
  exportNode.style.maxWidth = "none";
  exportNode.style.boxSizing = "border-box";
  exportNode.style.backgroundColor = "#ffffff";

  document.body.appendChild(exportNode);

  return exportNode;
}

function getFittedImageSize(
  canvas: HTMLCanvasElement,
  maxWidth: number,
  maxHeight: number,
) {
  const widthScale = maxWidth / canvas.width;
  const heightScale = maxHeight / canvas.height;
  const scale = Math.min(widthScale, heightScale);

  return {
    width: canvas.width * scale,
    height: canvas.height * scale,
  };
}

function displayValue(value: string | number | null | undefined): string {
  return value === undefined || value === null ? "—" : String(value);
}

function getReportRows(data: FacilityReportData): Array<[string, string]> {
  return [
    ["Name of Facility", data.facilityNameOverride || data.providerName],
    ["Location", data.location],
    ["EMR", displayValue(data.emr)],
    ["Census Capacity", displayValue(data.certifiedBeds)],
    ["Current Census", displayValue(data.currentCensus)],
    ["Type of Patient", displayValue(data.patientType)],
    ["Previous Coverage from Medelite", displayValue(data.prevCoverage)],
    ["Previous Provider Performance from Medelite", displayValue(data.prevPerformance)],
    ["Medical Coverage", displayValue(data.medicalCoverage)],
    ["Overall Star Rating", displayValue(data.overallRating)],
    ["Health Inspection", displayValue(data.healthInspectionRating)],
    ["Staffing", displayValue(data.staffingRating)],
    ["Quality of Resident Care", displayValue(data.qmRating)],
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
}

function escapeXml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;");
}

function textRun(text: string, bold = false): string {
  return `<w:r><w:rPr>${bold ? "<w:b/>" : ""}<w:sz w:val="20"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r>`;
}

function paragraph(text: string, options: { bold?: boolean; center?: boolean; size?: number } = {}): string {
  return `<w:p><w:pPr>${options.center ? '<w:jc w:val="center"/>' : ""}</w:pPr><w:r><w:rPr>${options.bold ? "<w:b/>" : ""}<w:sz w:val="${options.size ?? 20}"/></w:rPr><w:t xml:space="preserve">${escapeXml(text)}</w:t></w:r></w:p>`;
}

function tableRow(label: string, value: string): string {
  return `<w:tr><w:tc><w:tcPr><w:tcW w:w="3600" w:type="dxa"/></w:tcPr><w:p>${textRun(label, true)}</w:p></w:tc><w:tc><w:tcPr><w:tcW w:w="5400" w:type="dxa"/></w:tcPr><w:p>${textRun(value)}</w:p></w:tc></w:tr>`;
}

function createDocumentXml(data: FacilityReportData): string {
  const rows = getReportRows(data)
    .map(([label, value]) => tableRow(label, value))
    .join("");

  return `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
  <w:body>
    ${paragraph("INFINITE — Managed by MEDELITE", { bold: true, center: true, size: 32 })}
    ${paragraph("FACILITY ASSESSMENT SNAPSHOT", { bold: true, center: true, size: 24 })}
    ${paragraph(data.state, { center: true, size: 22 })}
    <w:p/>
    <w:tbl>
      <w:tblPr>
        <w:tblW w:w="9000" w:type="dxa"/>
        <w:tblBorders>
          <w:top w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>
          <w:left w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>
          <w:bottom w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>
          <w:right w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>
          <w:insideH w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>
          <w:insideV w:val="single" w:sz="4" w:space="0" w:color="D1D5DB"/>
        </w:tblBorders>
      </w:tblPr>
      ${rows}
    </w:tbl>
    <w:p/>
    <w:p><w:pPr><w:jc w:val="center"/></w:pPr><w:hyperlink r:id="rIdCareCompare"><w:r><w:rPr><w:u w:val="single"/><w:color w:val="000000"/><w:sz w:val="20"/></w:rPr><w:t>View on Medicare Care Compare</w:t></w:r></w:hyperlink></w:p>
    <w:sectPr><w:pgSz w:w="12240" w:h="15840"/><w:pgMar w:top="720" w:right="720" w:bottom="720" w:left="720" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr>
  </w:body>
</w:document>`;
}

function createDocxFiles(data: FacilityReportData): Record<string, string> {
  const medicareUrl = `https://www.medicare.gov/care-compare/details/nursing-home/${data.ccn}`;

  return {
    "[Content_Types].xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/><Override PartName="/docProps/core.xml" ContentType="application/vnd.openxmlformats-package.core-properties+xml"/><Override PartName="/docProps/app.xml" ContentType="application/vnd.openxmlformats-officedocument.extended-properties+xml"/></Types>`,
    "_rels/.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdDocument" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/><Relationship Id="rIdCore" Type="http://schemas.openxmlformats.org/package/2006/relationships/metadata/core-properties" Target="docProps/core.xml"/><Relationship Id="rIdApp" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/extended-properties" Target="docProps/app.xml"/></Relationships>`,
    "word/document.xml": createDocumentXml(data),
    "word/_rels/document.xml.rels": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rIdCareCompare" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/hyperlink" Target="${escapeXml(medicareUrl)}" TargetMode="External"/></Relationships>`,
    "docProps/core.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><cp:coreProperties xmlns:cp="http://schemas.openxmlformats.org/package/2006/metadata/core-properties" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:dcterms="http://purl.org/dc/terms/" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"><dc:title>Facility Assessment Snapshot</dc:title><dc:creator>Medelite Facility App</dc:creator><cp:lastModifiedBy>Medelite Facility App</cp:lastModifiedBy><dcterms:created xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:created><dcterms:modified xsi:type="dcterms:W3CDTF">${new Date().toISOString()}</dcterms:modified></cp:coreProperties>`,
    "docProps/app.xml": `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Properties xmlns="http://schemas.openxmlformats.org/officeDocument/2006/extended-properties" xmlns:vt="http://schemas.openxmlformats.org/officeDocument/2006/docPropsVTypes"><Application>Medelite Facility App</Application></Properties>`,
  };
}

function makeCrcTable(): Uint32Array {
  const table = new Uint32Array(256);

  for (let i = 0; i < 256; i += 1) {
    let value = i;

    for (let bit = 0; bit < 8; bit += 1) {
      value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
    }

    table[i] = value >>> 0;
  }

  return table;
}

const crcTable = makeCrcTable();

function crc32(bytes: Uint8Array): number {
  let crc = 0xffffffff;

  for (const byte of bytes) {
    crc = crcTable[(crc ^ byte) & 0xff] ^ (crc >>> 8);
  }

  return (crc ^ 0xffffffff) >>> 0;
}

function uint16(value: number): Uint8Array {
  return new Uint8Array([value & 0xff, (value >>> 8) & 0xff]);
}

function uint32(value: number): Uint8Array {
  return new Uint8Array([
    value & 0xff,
    (value >>> 8) & 0xff,
    (value >>> 16) & 0xff,
    (value >>> 24) & 0xff,
  ]);
}

function concatBytes(parts: Uint8Array[]): Uint8Array {
  const totalLength = parts.reduce((sum, part) => sum + part.length, 0);
  const output = new Uint8Array(totalLength);
  let offset = 0;

  for (const part of parts) {
    output.set(part, offset);
    offset += part.length;
  }

  return output;
}

function createZip(files: Record<string, string>): Blob {
  const localParts: Uint8Array[] = [];
  const centralParts: Uint8Array[] = [];
  let offset = 0;

  for (const [name, content] of Object.entries(files)) {
    const nameBytes = encoder.encode(name);
    const contentBytes = encoder.encode(content);
    const checksum = crc32(contentBytes);
    const localHeader = concatBytes([
      uint32(0x04034b50),
      uint16(20),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(checksum),
      uint32(contentBytes.length),
      uint32(contentBytes.length),
      uint16(nameBytes.length),
      uint16(0),
      nameBytes,
    ]);
    const centralHeader = concatBytes([
      uint32(0x02014b50),
      uint16(20),
      uint16(20),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(checksum),
      uint32(contentBytes.length),
      uint32(contentBytes.length),
      uint16(nameBytes.length),
      uint16(0),
      uint16(0),
      uint16(0),
      uint16(0),
      uint32(0),
      uint32(offset),
      nameBytes,
    ]);

    localParts.push(localHeader, contentBytes);
    centralParts.push(centralHeader);
    offset += localHeader.length + contentBytes.length;
  }

  const centralDirectory = concatBytes(centralParts);
  const endOfCentralDirectory = concatBytes([
    uint32(0x06054b50),
    uint16(0),
    uint16(0),
    uint16(Object.keys(files).length),
    uint16(Object.keys(files).length),
    uint32(centralDirectory.length),
    uint32(offset),
    uint16(0),
  ]);

  const zipBytes = concatBytes([
    ...localParts,
    centralDirectory,
    endOfCentralDirectory,
  ]);
  const zipBuffer = zipBytes.buffer.slice(
    zipBytes.byteOffset,
    zipBytes.byteOffset + zipBytes.byteLength,
  ) as ArrayBuffer;

  return new Blob([zipBuffer], {
    type: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function ExportButton({ reportRef, disabled, data }: ExportButtonProps) {
  const [exportType, setExportType] = useState<"pdf" | "docx" | null>(null);
  const isExporting = exportType !== null;
  const isDisabled = disabled || isExporting || !data;

  async function handlePdfExport() {
    if (!reportRef.current || isDisabled) {
      return;
    }

    setExportType("pdf");

    const exportNode = createExportNode(reportRef.current);

    try {
      const canvas = await html2canvas(exportNode, {
        scale: 2,
        backgroundColor: "#ffffff",
      });
      const imageData = canvas.toDataURL("image/jpeg", 0.95);
      const pdf = new jsPDF("p", "mm", "a4");
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const maxImageWidth = pageWidth - PDF_MARGIN_MM * 2;
      const maxImageHeight = pageHeight - PDF_MARGIN_MM * 2;
      const imageSize = getFittedImageSize(
        canvas,
        maxImageWidth,
        maxImageHeight,
      );
      const x = (pageWidth - imageSize.width) / 2;
      const y = (pageHeight - imageSize.height) / 2;

      pdf.addImage(imageData, "JPEG", x, y, imageSize.width, imageSize.height);
      pdf.save("facility-assessment.pdf");
    } finally {
      exportNode.remove();
      setExportType(null);
    }
  }

  function handleDocxExport() {
    if (!data || isDisabled) {
      return;
    }

    setExportType("docx");

    try {
      const docx = createZip(createDocxFiles(data));
      downloadBlob(docx, "facility-assessment.docx");
    } finally {
      setExportType(null);
    }
  }

  return (
    <div style={styles.group}>
      <button
        type="button"
        onClick={handleDocxExport}
        disabled={isDisabled}
        style={{
          ...styles.button,
          ...styles.secondaryButton,
          ...(isDisabled ? styles.disabled : {}),
        }}
      >
        {exportType === "docx" ? "Exporting..." : "Export Word"}
      </button>
      <button
        type="button"
        onClick={handlePdfExport}
        disabled={isDisabled}
        style={{
          ...styles.button,
          ...(isDisabled ? styles.disabled : {}),
        }}
      >
        {exportType === "pdf" ? "Exporting..." : "Export PDF"}
      </button>
    </div>
  );
}

export default ExportButton;
