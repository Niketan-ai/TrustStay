export type PropertyType = 'Apartment' | 'Hostel' | 'PG / Co-Living' | 'Studio';

export type TargetTenant = 'Students Only' | 'Professionals Only' | 'Open to All';

export type GenderPreference = 'Female Only' | 'Male Only' | 'Co-ed';

export interface PropertySafetyAmenities {
  cctv: boolean;
  securityGuard: boolean;
  biometricAccess: boolean;
  curfew: string; // e.g. "10:30 PM", "11:00 PM", "No Curfew"
  femaleWarden?: boolean;
  emergencyResponseReady: boolean;
  fireSafetyCertified: boolean;
  visitorLogbook: boolean;
}

export interface PropertyGeneralAmenities {
  wifi: boolean;
  powerBackup: boolean;
  mealsIncluded: boolean;
  airConditioning: boolean;
  laundry: boolean;
  studyDesk: boolean;
}

export interface VerificationTierStatus {
  contactVerified: boolean;
  identityVerified: boolean;
  propertyEvidenceReviewed: boolean;
  onSiteVerified: boolean;
}

export interface PropertyOwner {
  id: string;
  name: string;
  avatarUrl: string;
  badge: string;
  joinedYear: number;
  responseRate: string;
  isIdentityVerified: boolean;
}

export interface Property {
  id: string;
  title: string;
  tagline: string;
  description: string;
  propertyType: PropertyType;
  targetTenant: TargetTenant;
  genderPreference: GenderPreference;
  rentAmount: number;
  depositAmount: number;
  city: string;
  area: string;
  fullAddressApproximate: string;
  images: string[];
  safetyAmenities: PropertySafetyAmenities;
  generalAmenities: PropertyGeneralAmenities;
  verification: VerificationTierStatus;
  safetyScore: number; // 0 - 100 calculated trust score
  owner: PropertyOwner;
  isDemo: boolean;
}

export interface PropertyFilterState {
  location: string;
  propertyType: string;
  genderPreference: string;
  minRent: number;
  maxRent: number;
  cctvRequired: boolean;
  guardRequired: boolean;
  biometricRequired: boolean;
  evidenceReviewedOnly: boolean;
  onSiteVerifiedOnly: boolean;
}
