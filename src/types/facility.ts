// Defines TypeScript interfaces for CMS API responses and the merged FacilityReportData object used across all components

export interface CMSApiResponse<T> {
  results: T[];
  count: number;
}

export interface CMSProviderInfo {
  "CMS Certification Number (CCN)": string;
  "Provider Name": string;
  "Location": string;
  "State": string;
  "Number of Certified Beds": number;
  "Overall Rating": number;
  "Health Inspection Rating": number;
  "Staffing Rating": number;
  "QM Rating": number;
}

export interface CMSClaimsQM {
  "CMS Certification Number (CCN)": string;
  "Measure Code": string;
  "Measure Description": string;
  "Resident type": string;
  "Adjusted Score": number | null;
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
}
