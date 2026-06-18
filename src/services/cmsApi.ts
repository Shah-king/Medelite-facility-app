import type {
  CMSApiResponse,
  CMSClaimsQM,
  CMSProviderInfo,
  FacilityReportData,
} from "../types/facility";

const PROVIDER_INFORMATION_URL =
  "/cms-provider-data/provider-data/api/1/datastore/query/4pq5-n9py/0";

const MEDICARE_CLAIMS_QM_URL =
  "/cms-provider-data/provider-data/api/1/datastore/query/ijh5-nb2v/0";

function buildCcnQuery(ccn: string): string {
  const params = new URLSearchParams({
    "conditions[0][property]": "cms_certification_number_ccn",
    "conditions[0][value]": ccn,
    "conditions[0][operator]": "=",
  });

  return params.toString();
}

async function fetchCmsData<T>(url: string, ccn: string): Promise<CMSApiResponse<T>> {
  const query = buildCcnQuery(ccn);
  const response = await fetch(`${url}?${query}`);

  if (!response.ok) {
    const message = await response.text();

    throw new Error(
      `CMS API request failed: ${response.status} ${response.statusText}${
        message ? ` - ${message}` : ""
      }`,
    );
  }

  return response.json() as Promise<CMSApiResponse<T>>;
}

function toNumber(value: string): number {
  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : 0;
}

function findAdjustedScore(claimsQMs: CMSClaimsQM[], measureCode: string): number | null {
  const measure = claimsQMs.find((claim) => claim.measure_code === measureCode);

  if (!measure?.adjusted_score) {
    return null;
  }

  const parsed = Number(measure.adjusted_score);

  return Number.isFinite(parsed) ? parsed : null;
}

function formatPercent(value: number | null): string | undefined {
  return value === null ? undefined : `${value.toFixed(1)}%`;
}

function formatRate(value: number | null): string | undefined {
  return value === null ? undefined : value.toFixed(2);
}

export async function fetchFacilityData(ccn: string): Promise<FacilityReportData> {
  const providerResponse = await fetchCmsData<CMSProviderInfo>(
    PROVIDER_INFORMATION_URL,
    ccn,
  );

  const providerInfo = providerResponse.results[0];

  if (!providerInfo) {
    throw new Error("No facility found for CCN: " + ccn);
  }

  const claimsResponse = await fetchCmsData<CMSClaimsQM>(MEDICARE_CLAIMS_QM_URL, ccn);
  const claimsQMs = claimsResponse.results;
  const shortStayHospitalization = findAdjustedScore(claimsQMs, "521");
  const shortStayEdVisit = findAdjustedScore(claimsQMs, "522");
  const longStayHospitalization = findAdjustedScore(claimsQMs, "551");
  const longStayEdVisit = findAdjustedScore(claimsQMs, "552");

  return {
    ccn,
    providerName: providerInfo.provider_name,
    location: providerInfo.location,
    state: providerInfo.state,
    certifiedBeds: toNumber(providerInfo.number_of_certified_beds),
    overallRating: toNumber(providerInfo.overall_rating),
    healthInspectionRating: toNumber(providerInfo.health_inspection_rating),
    staffingRating: toNumber(providerInfo.staffing_rating),
    qmRating: toNumber(providerInfo.qm_rating),
    facilityNameOverride: undefined,
    emr: undefined,
    currentCensus: undefined,
    patientType: undefined,
    prevCoverage: undefined,
    prevPerformance: undefined,
    claimsQMs,
    medicalCoverage: undefined,
    strHospitalization: formatPercent(shortStayHospitalization),
    strEdVisit: formatPercent(shortStayEdVisit),
    ltHospitalization: formatRate(longStayHospitalization),
    ltEdVisit: formatRate(longStayEdVisit),
  };
}
