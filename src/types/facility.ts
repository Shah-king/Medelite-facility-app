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

export interface CMSStateAverage {
  state_or_nation: string;
  "percentage_of_short_stay_residents_who_were_rehospitalized__1d02": string;
  "percentage_of_short_stay_residents_who_had_an_outpatient_em_d911": string;
  number_of_hospitalizations_per_1000_longstay_resident_days: string;
  "number_of_outpatient_emergency_department_visits_per_1000_l_de9d": string;
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
