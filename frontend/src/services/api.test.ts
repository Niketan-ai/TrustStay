import test from 'node:test';
import assert from 'node:assert/strict';
import { mapBackendProperty, ApiError } from './api.ts';
import { BackendPropertyResponse } from '../types/api.ts';

test('mapBackendProperty - should never award verification badges to unverified properties', () => {
  const unverifiedBackendItem: BackendPropertyResponse = {
    id: 101,
    title: 'New Student Flat',
    description: 'Fresh listing submitted by landlord',
    propertyType: 'STUDIO',
    targetTenantType: 'STUDENTS_ONLY',
    genderPreference: 'CO_ED',
    rentAmount: 12000,
    depositAmount: 20000,
    addressLine1: 'Lane 5, Koramangala',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560034',
    cctvPresent: false,
    securityGuard: false,
    biometricAccess: false,
    curfewTime: null,
    verificationStatus: 'UNVERIFIED',
    safetyScore: 50,
    isActive: true,
    ownerId: 2,
    ownerName: 'Host Landlord',
    createdAt: '2026-10-21T20:00:00Z',
  };

  const mapped = mapBackendProperty(unverifiedBackendItem);

  assert.equal(mapped.id, '101');
  assert.equal(mapped.isDemo, false, 'Real backend properties must have isDemo: false');
  assert.equal(mapped.verification.onSiteVerified, false, 'Unverified listing must not have onSiteVerified');
  assert.equal(mapped.verification.propertyEvidenceReviewed, false, 'Unverified listing must not have evidenceReviewed');
  assert.equal(mapped.verification.identityVerified, false, 'Unverified listing must not have identityVerified');
  assert.equal(mapped.safetyScore, 50);
  assert.equal(mapped.owner.name, 'Host Landlord');
  assert.equal(mapped.owner.isIdentityVerified, false);
});

test('mapBackendProperty - should accurately map verified properties', () => {
  const verifiedBackendItem: BackendPropertyResponse = {
    id: 202,
    title: 'Audit Complete Apartment',
    description: 'Fully inspected listing',
    propertyType: 'APARTMENT',
    targetTenantType: 'ANY',
    genderPreference: 'FEMALE_ONLY',
    rentAmount: 18000,
    depositAmount: 30000,
    addressLine1: 'Road 12, Indiranagar',
    city: 'Bengaluru',
    state: 'Karnataka',
    postalCode: '560038',
    cctvPresent: true,
    securityGuard: true,
    biometricAccess: true,
    curfewTime: '11:00 PM',
    verificationStatus: 'VERIFIED',
    safetyScore: 95,
    isActive: true,
    ownerId: 5,
    ownerName: 'Verified Host',
    createdAt: '2026-10-21T20:00:00Z',
  };

  const mapped = mapBackendProperty(verifiedBackendItem);

  assert.equal(mapped.id, '202');
  assert.equal(mapped.isDemo, false);
  assert.equal(mapped.verification.onSiteVerified, true);
  assert.equal(mapped.verification.propertyEvidenceReviewed, true);
  assert.equal(mapped.safetyAmenities.cctv, true);
  assert.equal(mapped.safetyAmenities.securityGuard, true);
  assert.equal(mapped.safetyAmenities.biometricAccess, true);
  assert.equal(mapped.safetyAmenities.curfew, '11:00 PM');
  assert.equal(mapped.safetyScore, 95);
});

test('ApiError - handles status code and message correctly', () => {
  const err = new ApiError('Connection refused to backend', 503);
  assert.equal(err.message, 'Connection refused to backend');
  assert.equal(err.statusCode, 503);
  assert.equal(err.name, 'ApiError');
});
