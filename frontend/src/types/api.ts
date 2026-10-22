export interface BackendApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  timestamp: string;
}

export interface BackendUserResponse {
  id: number;
  phoneNumber: string;
  email: string | null;
  fullName: string;
  isPhoneVerified: boolean;
  isIdentityVerified: boolean;
  status: string;
  roles: string[];
  createdAt: string;
}

export interface BackendAuthResponse {
  token: string;
  user: BackendUserResponse;
}

export interface BackendPropertyResponse {
  id: number;
  title: string;
  description: string;
  propertyType: string;
  targetTenantType: string;
  genderPreference: string;
  rentAmount: number;
  depositAmount: number;
  addressLine1: string;
  city: string;
  state: string;
  postalCode: string;
  cctvPresent: boolean;
  securityGuard: boolean;
  biometricAccess: boolean;
  curfewTime: string | null;
  verificationStatus: string;
  safetyScore: number;
  isActive: boolean;
  ownerId: number | null;
  ownerName: string | null;
  createdAt: string;
}

export interface BackendHealthResponse {
  status: string;
  service: string;
  environment: string;
}
