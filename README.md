# Medelite Facility Assessment Report Generator

A lightweight React micro-app for generating a polished facility assessment report for skilled nursing facilities. The app lets a user enter a CMS Certification Number (CCN), fetches public CMS provider and quality data, combines it with manual Medelite operational inputs, and exports the result as PDF or editable Word document.


## Features

- Dynamic CCN lookup against CMS Provider Data Catalog APIs.
- Facility name override for Medelite internal/localized facility naming.
- Manual operational inputs:
  - EMR
  - Current Census
  - Type of Patient
  - Previous Coverage from Medelite
  - Previous Provider Performance from Medelite
  - Medical Coverage
- Print-ready facility report with INFINITE / MEDELITE branding.
- Full 25-row report template based on the provided reference files.
- Medicare Care Compare hyperlink generated from the searched CCN.
- PDF export via `html2canvas` and `jsPDF`.
- Editable Word `.docx` export generated in-browser.
- Star-rating metric cards and grouped bar charts via Chart.js.
- CMS CORS workaround using a Vite dev proxy and Vercel rewrite.

## Implemented Bonus Features

- All 12 hospitalization / ED rows are present in the report.
- Facility-specific short-stay and long-stay claims metrics are mapped from CMS claims data.
- State and national comparison averages are fetched from the CMS averages dataset.
- Editable Word document export.
- Responsive metric cards and charts.

## Data Sources

The app currently queries these CMS Provider Data Catalog endpoints:

- Provider Information:
  `4pq5-n9py`
- Medicare Claims Quality Measures:
  `ijh5-nb2v`
- State / National Averages:
  `xcdc-v8bm`

During local development, requests are routed through:

```text
/cms-provider-data/...
```

Vite proxies that path to:

```text
https://data.cms.gov/...
```

For Vercel deployment, `vercel.json` provides the same rewrite.

## Report Mapping

CMS-powered fields include:

- Name of Facility
- Location
- Census Capacity
- Overall Star Rating
- Health Inspection
- Staffing
- Quality of Resident Care
- Short Term Hospitalization
- STR ED Visit
- LT Hospitalization
- ED Visit
- State and national comparison averages where available

Manual fields include:

- Facility Name Override
- EMR
- Current Census
- Type of Patient
- Previous Coverage from Medelite
- Previous Provider Performance from Medelite
- Medical Coverage

## Reference Test Case

Use this CCN to validate the app against the provided Kendall Lakes reference materials:

```text
686123
```

Care Compare URL format:

```text
https://www.medicare.gov/care-compare/details/nursing-home/686123
```

Note: CMS data updates over time, so live API values may differ from the static reference PDF.

## Tech Stack

- React 19
- TypeScript
- Vite
- Chart.js / react-chartjs-2
- html2canvas
- jsPDF
- Browser-generated `.docx` using minimal Office Open XML packaging

## Getting Started

Install dependencies:

```bash
npm install
```

Run the local dev server:

```bash
npm run dev
```

Build for production:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Deployment Notes

The app includes `vercel.json` with a rewrite for CMS API calls:

```json
{
  "rewrites": [
    {
      "source": "/cms-provider-data/:path*",
      "destination": "https://data.cms.gov/:path*"
    }
  ]
}
```

This is needed because direct browser calls to CMS endpoints can be blocked by CORS.

## Known Notes

- PDF export captures the rendered report and scales it to fit A4.
- Word export is editable and includes the report table and Medicare source link.
- Charts render unavailable comparison values as `0` and show a note when data is missing.
- The app intentionally keeps INFINITE / MEDELITE branding static; facility names only appear inside the report body.
