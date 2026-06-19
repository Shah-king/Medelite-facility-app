import type {
  CMSApiResponse,
  CMSClaimsQM,
  CMSProviderInfo,
  CMSStateAverage,
  FacilityReportData,
} from "../types/facility";

const PROVIDER_INFORMATION_URL =
  "/cms-provider-data/provider-data/api/1/datastore/query/4pq5-n9py/0";

const MEDICARE_CLAIMS_QM_URL =
  "/cms-provider-data/provider-data/api/1/datastore/query/ijh5-nb2v/0";

const STATE_AVERAGES_URL =
  "/cms-provider-data/provider-data/api/1/datastore/query/xcdc-v8bm/0";

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

function toNumber(value: string | undefined | null): number | null {
  if (value === undefined || value === null || value === "") {
    return null;
  }

  const parsed = Number(value);

  return Number.isFinite(parsed) ? parsed : null;
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

async function fetchAveragesData(
  stateOrNation: string,
): Promise<CMSApiResponse<CMSStateAverage>> {
  const params = new URLSearchParams({
    "conditions[0][property]": "state_or_nation",
    "conditions[0][value]": stateOrNation,
    "conditions[0][operator]": "=",
  });
  const response = await fetch(`${STATE_AVERAGES_URL}?${params.toString()}`);

  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      `CMS averages request failed: ${response.status}${
        message ? ` - ${message}` : ""
      }`,
    );
  }

  return response.json() as Promise<CMSApiResponse<CMSStateAverage>>;
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

  const [stateAvgResponse, nationAvgResponse] = await Promise.all([
    fetchAveragesData(providerInfo.state),
    fetchAveragesData("NATION"),
  ]);
  const stateAvg = stateAvgResponse.results[0];
  const nationAvg = nationAvgResponse.results[0];

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
    certifiedBeds: toNumber(providerInfo.number_of_certified_beds) ?? 0,
    overallRating: toNumber(providerInfo.overall_rating) ?? 0,
    healthInspectionRating: toNumber(providerInfo.health_inspection_rating) ?? 0,
    staffingRating: toNumber(providerInfo.staffing_rating) ?? 0,
    qmRating: toNumber(providerInfo.qm_rating) ?? 0,
    facilityNameOverride: undefined,
    emr: undefined,
    currentCensus: undefined,
    patientType: undefined,
    prevCoverage: undefined,
    prevPerformance: undefined,
    claimsQMs,
    medicalCoverage: undefined,
    strHospitalization: formatPercent(shortStayHospitalization),
    strNationalAvgHosp: formatPercent(
      nationAvg
        ? toNumber(
            nationAvg[
              "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
            ],
          )
        : null,
    ),
    strStateAvgHosp: formatPercent(
      stateAvg
        ? toNumber(
            stateAvg[
              "percentage_of_short_stay_residents_who_were_rehospitalized__1d02"
            ],
          )
        : null,
    ),
    strEdVisit: formatPercent(shortStayEdVisit),
    strNationalAvgEd: formatPercent(
      nationAvg
        ? toNumber(
            nationAvg[
              "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
            ],
          )
        : null,
    ),
    strStateAvgEd: formatPercent(
      stateAvg
        ? toNumber(
            stateAvg[
              "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911"
            ],
          )
        : null,
    ),
    ltHospitalization: formatRate(longStayHospitalization),
    ltNationalAvgHosp: formatRate(
      nationAvg
        ? toNumber(nationAvg.number_of_hospitalizations_per_1000_longstay_resident_days)
        : null,
    ),
    ltStateAvgHosp: formatRate(
      stateAvg
        ? toNumber(stateAvg.number_of_hospitalizations_per_1000_longstay_resident_days)
        : null,
    ),
    ltEdVisit: formatRate(longStayEdVisit),
    ltNationalAvgEd: formatRate(
      nationAvg
        ? toNumber(
            nationAvg[
              "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
            ],
          )
        : null,
    ),
    ltStateAvgEd: formatRate(
      stateAvg
        ? toNumber(
            stateAvg[
              "number_of_outpatient_emergency_department_visits_per_1000_l_de9d"
            ],
          )
        : null,
    ),
  };
}
