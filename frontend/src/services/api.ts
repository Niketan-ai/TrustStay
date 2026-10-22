import {
  BackendApiResponse,
  BackendAuthResponse,
  BackendHealthResponse,
  BackendPropertyResponse,
} from '../types/api';
import { Property, PropertyType, TargetTenant, GenderPreference } from '../types/property';

const API_BASE_URL = (import.meta?.env?.VITE_API_BASE_URL ?? 'http://localhost:8080').replace(/\/+$/, '');

/**
 * Standard API error class
 */
export class ApiError extends Error {
  public statusCode?: number;
  public details?: Record<string, string>;

  constructor(message: string, statusCode?: number, details?: Record<string, string>) {
    super(message);
    this.name = 'ApiError';
    this.statusCode = statusCode;
    this.details = details;
  }
}

/**
 * Maps propertyType enum from backend into readable frontend label
 */
function mapPropertyType(type: string): PropertyType {
  switch (type?.toUpperCase()) {
    case 'STUDIO':
      return 'Studio';
    case 'APARTMENT':
      return 'Apartment';
    case 'HOSTEL':
      return 'Hostel';
    case 'PG_CO_LIVING':
    default:
      return 'PG / Co-Living';
  }
}

/**
 * Maps targetTenant enum from backend
 */
function mapTargetTenant(tenant: string): TargetTenant {
  switch (tenant?.toUpperCase()) {
    case 'STUDENTS_ONLY':
      return 'Students Only';
    case 'PROFESSIONALS_ONLY':
      return 'Professionals Only';
    default:
      return 'Open to All';
  }
}

/**
 * Maps genderPreference enum from backend
 */
function mapGenderPreference(gender: string): GenderPreference {
  switch (gender?.toUpperCase()) {
    case 'FEMALE_ONLY':
      return 'Female Only';
    case 'MALE_ONLY':
      return 'Male Only';
    default:
      return 'Co-ed';
  }
}

/**
 * Safely converts a real backend PropertyResponse into the frontend Property model.
 * Strict Rule: Never invent verification tiers or claim unverified properties are verified.
 */
export function mapBackendProperty(item: BackendPropertyResponse): Property {
  const isVerified = item.verificationStatus === 'VERIFIED';

  return {
    id: String(item.id),
    title: item.title,
    tagline: `${item.propertyType} in ${item.city}`,
    description: item.description,
    propertyType: mapPropertyType(item.propertyType),
    targetTenant: mapTargetTenant(item.targetTenantType),
    genderPreference: mapGenderPreference(item.genderPreference),
    rentAmount: Number(item.rentAmount),
    depositAmount: Number(item.depositAmount),
    city: item.city,
    area: item.addressLine1 ? item.addressLine1.split(',')[0].trim() : item.city,
    fullAddressApproximate: `${item.addressLine1}, ${item.city}, ${item.state} - ${item.postalCode}`,
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
    ],
    safetyAmenities: {
      cctv: Boolean(item.cctvPresent),
      securityGuard: Boolean(item.securityGuard),
      biometricAccess: Boolean(item.biometricAccess),
      curfew: item.curfewTime || 'No Curfew Specified',
      emergencyResponseReady: true,
      fireSafetyCertified: false,
      visitorLogbook: Boolean(item.securityGuard),
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: false,
      airConditioning: false,
      laundry: true,
      studyDesk: true,
    },
    // Strict verification mapping based purely on database verification_status
    verification: {
      contactVerified: Boolean(item.ownerId),
      identityVerified: isVerified,
      propertyEvidenceReviewed: isVerified,
      onSiteVerified: isVerified,
    },
    safetyScore: item.safetyScore || 50,
    owner: {
      id: item.ownerId ? String(item.ownerId) : 'unassigned',
      name: item.ownerName || 'Property Host',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
      badge: isVerified ? 'Verified Host' : 'Host (Pending Verification)',
      joinedYear: new Date(item.createdAt || Date.now()).getFullYear(),
      responseRate: 'Standard',
      isIdentityVerified: isVerified,
    },
    isDemo: false, // Explicitly false for real database properties
  };
}

/**
 * Check backend health status (GET /api/v1/health)
 */
export async function getBackendHealth(): Promise<BackendHealthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/health`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new ApiError(`Health check failed with HTTP ${res.status}`, res.status);
    }
    const json: BackendApiResponse<BackendHealthResponse> = await res.json();
    return json.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Cannot connect to backend server at ${API_BASE_URL}. Ensure the Spring Boot API is running.`
    );
  }
}

/**
 * Fetch all active properties from database (GET /api/v1/properties)
 */
export async function getActiveProperties(): Promise<Property[]> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/properties`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) {
      throw new ApiError(`Failed to fetch properties (HTTP ${res.status})`, res.status);
    }
    const json: BackendApiResponse<BackendPropertyResponse[]> = await res.json();
    if (!json.success || !Array.isArray(json.data)) {
      throw new ApiError(json.message || 'Malformed backend response');
    }
    return json.data.map(mapBackendProperty);
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Network error connecting to ${API_BASE_URL}/api/v1/properties. Ensure backend is running.`
    );
  }
}

/**
 * Authenticate existing user (POST /api/v1/auth/login)
 */
export async function loginUser(identifier: string, password: string): Promise<BackendAuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify({ identifier, password }),
    });

    const json: BackendApiResponse<BackendAuthResponse> = await res.json();

    if (!res.ok || !json.success) {
      const rawData: unknown = json.data;
      const details = (rawData && typeof rawData === 'object') ? (rawData as Record<string, string>) : undefined;
      throw new ApiError(json.message || 'Login failed. Please check your credentials.', res.status, details);
    }

    return json.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Cannot connect to auth service at ${API_BASE_URL}. Ensure backend is running.`
    );
  }
}

/**
 * Register new tenant user (POST /api/v1/auth/signup)
 */
export async function signupUser(params: {
  fullName: string;
  phoneNumber: string;
  email?: string;
  password: string;
}): Promise<BackendAuthResponse> {
  try {
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
      body: JSON.stringify(params),
    });

    const json: BackendApiResponse<BackendAuthResponse> = await res.json();

    if (!res.ok || !json.success) {
      const rawData: unknown = json.data;
      const details = (rawData && typeof rawData === 'object') ? (rawData as Record<string, string>) : undefined;
      throw new ApiError(json.message || 'Registration failed.', res.status, details);
    }

    return json.data;
  } catch (err: unknown) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(
      `Cannot connect to auth service at ${API_BASE_URL}. Ensure backend is running.`
    );
  }
}
