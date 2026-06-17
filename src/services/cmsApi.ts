import type {
  CMSApiResponse,
  CMSClaimsQM,
  CMSProviderInfo,
  FacilityReportData,
} from "../types/facility";

const PROVIDER_INFORMATION_URL =
  "https://data.cms.gov/provider-data/api/1/datastore/query/4pq5-n9py/0";

const MEDICARE_CLAIMS_QM_URL =
  "https://data.cms.gov/provider-data/api/1/datastore/query/ijh5-nb2v/0";

function buildCcnQuery(ccn: string): string {
  const params = new URLSearchParams({
    "conditions[0][property]": "CMS Certification Number (CCN)",
    "conditions[0][value]": ccn,
    "conditions[0][operator]": "=",
  });

  return params.toString();
}

async function fetchCmsData<T>(url: string, ccn: string): Promise<CMSApiResponse<T>> {
  const query = buildCcnQuery(ccn);
  const response = await fetch(`${url}?${query}`);

  if (!response.ok) {
    throw new Error(`CMS API request failed: ${response.status} ${response.statusText}`);
  }

  return response.json() as Promise<CMSApiResponse<T>>;
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

  return {
    ccn,
    providerName: providerInfo["Provider Name"],
    location: providerInfo["Location"],
    state: providerInfo["State"],
    certifiedBeds: providerInfo["Number of Certified Beds"],
    overallRating: providerInfo["Overall Rating"],
    healthInspectionRating: providerInfo["Health Inspection Rating"],
    staffingRating: providerInfo["Staffing Rating"],
    qmRating: providerInfo["QM Rating"],
    facilityNameOverride: undefined,
    emr: undefined,
    currentCensus: undefined,
    patientType: undefined,
    prevCoverage: undefined,
    prevPerformance: undefined,
    claimsQMs,
    medicalCoverage: undefined,
  };
}
