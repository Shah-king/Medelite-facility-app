// Defines TypeScript interfaces for CMS API responses and the merged FacilityReportData object used across all components

export interface CMSApiResponse<T> {
  results: T[];
  count: number;
}

export interface CMSProviderInfo {
  cms_certification_number_ccn: string;
  provider_name: string;
  location: string;
  state: string;
  number_of_certified_beds: string;
  overall_rating: string;
  health_inspection_rating: string;
  staffing_rating: string;
  qm_rating: string;
}

export interface CMSClaimsQM {
  cms_certification_number_ccn: string;
  measure_code: string;
  measure_description: string;
  resident_type: string;
  adjusted_score: string | null;
}

export interface ManualInputs {
  facilityNameOverride?: string;
  emr?: string;
  currentCensus?: number;
  patientType?: string;
  prevCoverage?: "Yes" | "No";
  prevPerformance?: string;
  medicalCoverage?: string;
}

export interface FacilityReportData {
  ccn: string;
  providerName: string;
  location: string;
  state: string;
  certifiedBeds: number;
  overallRating: number;
  healthInspectionRating: number;
  staffingRating: number;
  qmRating: number;
  facilityNameOverride?: string;
  emr?: string;
  currentCensus?: number;
  patientType?: string;
  prevCoverage?: "Yes" | "No";
  prevPerformance?: string;
  medicalCoverage?: string;
  claimsQMs?: CMSClaimsQM[];
  strHospitalization?: string;
  strNationalAvgHosp?: string;
  strStateAvgHosp?: string;
  strEdVisit?: string;
  strNationalAvgEd?: string;
  strStateAvgEd?: string;
  ltHospitalization?: string;
  ltNationalAvgHosp?: string;
  ltStateAvgHosp?: string;
  ltEdVisit?: string;
  ltNationalAvgEd?: string;
  ltStateAvgEd?: string;
}
