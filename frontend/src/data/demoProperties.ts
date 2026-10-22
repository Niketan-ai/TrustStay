import { Property } from '../types/property';

export const DEMO_PROPERTIES: Property[] = [
  {
    id: 'ts-demo-101',
    title: 'The Scholar Haven - Premium Student Studio',
    tagline: 'Quiet study suites 5 minutes walking distance from University Campus',
    description: 'Purpose-built student accommodation offering dedicated quiet study hours, biometric entry at the main gate, 24/7 CCTV surveillance in common areas, and a full-time resident warden. High-speed fiber Wi-Fi and power backup included.',
    propertyType: 'Studio',
    targetTenant: 'Students Only',
    genderPreference: 'Co-ed',
    rentAmount: 14500,
    depositAmount: 25000,
    city: 'Bengaluru',
    area: 'Koramangala 4th Block',
    fullAddressApproximate: 'Near Christ University & St. John Hospital, Koramangala, Bengaluru',
    images: [
      'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=800&q=80'
    ],
    safetyAmenities: {
      cctv: true,
      securityGuard: true,
      biometricAccess: true,
      curfew: '10:30 PM (Biometric)',
      femaleWarden: false,
      emergencyResponseReady: true,
      fireSafetyCertified: true,
      visitorLogbook: true
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: true,
      airConditioning: true,
      laundry: true,
      studyDesk: true
    },
    verification: {
      contactVerified: true,
      identityVerified: true,
      propertyEvidenceReviewed: true,
      onSiteVerified: true
    },
    safetyScore: 98,
    owner: {
      id: 'own-301',
      name: 'Col. Rajesh Sharma (Retd.)',
      avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      badge: 'Certified Trusted Host',
      joinedYear: 2023,
      responseRate: 'Under 15 mins',
      isIdentityVerified: true
    },
    isDemo: true
  },
  {
    id: 'ts-demo-102',
    title: 'Ananya Living - Verified Women’s Executive PG',
    tagline: 'Safe, gated accommodation with female resident warden and 24/7 security guard',
    description: 'Exclusively for female students and working professionals. Features round-the-clock female warden, CCTV monitoring of perimeter and corridors, strict digital visitor logs, and nutritious homemade meals.',
    propertyType: 'PG / Co-Living',
    targetTenant: 'Open to All',
    genderPreference: 'Female Only',
    rentAmount: 11000,
    depositAmount: 15000,
    city: 'Pune',
    area: 'Viman Nagar',
    fullAddressApproximate: 'Opposite Symbiosis Campus, Lane 2, Viman Nagar, Pune',
    images: [
      'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80'
    ],
    safetyAmenities: {
      cctv: true,
      securityGuard: true,
      biometricAccess: true,
      curfew: '10:00 PM',
      femaleWarden: true,
      emergencyResponseReady: true,
      fireSafetyCertified: true,
      visitorLogbook: true
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: true,
      airConditioning: false,
      laundry: true,
      studyDesk: true
    },
    verification: {
      contactVerified: true,
      identityVerified: true,
      propertyEvidenceReviewed: true,
      onSiteVerified: true
    },
    safetyScore: 96,
    owner: {
      id: 'own-302',
      name: 'Sunita Deshmukh',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      badge: 'Superhost Verified',
      joinedYear: 2022,
      responseRate: 'Under 1 hour',
      isIdentityVerified: true
    },
    isDemo: true
  },
  {
    id: 'ts-demo-103',
    title: 'CyberPark Tech Residence - 1BHK Serviced Apartment',
    tagline: 'Modern tech-corridor apartment with smart locks and zero broker fees',
    description: 'Designed for young IT professionals. Situated in a high-security gated township with intercom access, dedicated parking, fire hydrants on every floor, and professional facility management.',
    propertyType: 'Apartment',
    targetTenant: 'Professionals Only',
    genderPreference: 'Co-ed',
    rentAmount: 22000,
    depositAmount: 40000,
    city: 'Gurugram',
    area: 'Cyber City, DLF Phase 3',
    fullAddressApproximate: 'DLF Phase 3, 200m from Moulsari Avenue Metro, Gurugram',
    images: [
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=800&q=80'
    ],
    safetyAmenities: {
      cctv: true,
      securityGuard: true,
      biometricAccess: false,
      curfew: 'No Curfew',
      emergencyResponseReady: true,
      fireSafetyCertified: true,
      visitorLogbook: true
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: false,
      airConditioning: true,
      laundry: true,
      studyDesk: true
    },
    verification: {
      contactVerified: true,
      identityVerified: true,
      propertyEvidenceReviewed: true,
      onSiteVerified: false
    },
    safetyScore: 84,
    owner: {
      id: 'own-303',
      name: 'Amitabh Sen',
      avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
      badge: 'Document Verified Owner',
      joinedYear: 2024,
      responseRate: 'Within 2 hours',
      isIdentityVerified: true
    },
    isDemo: true
  },
  {
    id: 'ts-demo-104',
    title: 'Powai Lakeview Coliving Suites',
    tagline: 'Shared coliving spaces close to IIT Bombay and Hiranandani tech offices',
    description: 'Spacious coliving rooms with balcony views, daily sanitization, CCTV on exterior premises, and individual keycard bedroom door locks. Ideal for postgraduate researchers and engineers.',
    propertyType: 'PG / Co-Living',
    targetTenant: 'Open to All',
    genderPreference: 'Co-ed',
    rentAmount: 16500,
    depositAmount: 30000,
    city: 'Mumbai',
    area: 'Powai',
    fullAddressApproximate: 'Near Hiranandani Gardens, Powai, Mumbai',
    images: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=800&q=80'
    ],
    safetyAmenities: {
      cctv: true,
      securityGuard: true,
      biometricAccess: true,
      curfew: '11:30 PM',
      emergencyResponseReady: true,
      fireSafetyCertified: true,
      visitorLogbook: true
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: true,
      airConditioning: true,
      laundry: true,
      studyDesk: true
    },
    verification: {
      contactVerified: true,
      identityVerified: true,
      propertyEvidenceReviewed: true,
      onSiteVerified: true
    },
    safetyScore: 94,
    owner: {
      id: 'own-304',
      name: 'Dr. Kavita Nair',
      avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
      badge: 'Safety Endorsed Owner',
      joinedYear: 2021,
      responseRate: 'Under 30 mins',
      isIdentityVerified: true
    },
    isDemo: true
  },
  {
    id: 'ts-demo-105',
    title: 'Green Meadows University Hostel (Men’s Wing)',
    tagline: 'Affordable campus-adjacent student accommodation with sports facilities',
    description: 'Budget-friendly shared rooms equipped with ergonomic study setups, high-speed WiFi, biometric mess entry, and gated compound with night security patrols.',
    propertyType: 'Hostel',
    targetTenant: 'Students Only',
    genderPreference: 'Male Only',
    rentAmount: 8500,
    depositAmount: 12000,
    city: 'Bengaluru',
    area: 'Electronic City Phase 1',
    fullAddressApproximate: 'Opposite PES Institute Road, Electronic City, Bengaluru',
    images: [
      'https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80'
    ],
    safetyAmenities: {
      cctv: true,
      securityGuard: true,
      biometricAccess: false,
      curfew: '10:00 PM',
      emergencyResponseReady: true,
      fireSafetyCertified: false,
      visitorLogbook: true
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: true,
      airConditioning: false,
      laundry: true,
      studyDesk: true
    },
    verification: {
      contactVerified: true,
      identityVerified: true,
      propertyEvidenceReviewed: false,
      onSiteVerified: false
    },
    safetyScore: 72,
    owner: {
      id: 'own-305',
      name: 'Venkatesh Rao',
      avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=200&q=80',
      badge: 'Identity Verified Only',
      joinedYear: 2025,
      responseRate: 'Within 4 hours',
      isIdentityVerified: true
    },
    isDemo: true
  },
  {
    id: 'ts-demo-106',
    title: 'The Solarium - Modern Sunny Micro-Loft',
    tagline: 'Independent fully-furnished micro apartment with smart lock keypad',
    description: 'Quiet, sunlit loft with private kitchenette, digital passcode access, exterior perimeter surveillance, and dedicated work-from-home corner.',
    propertyType: 'Studio',
    targetTenant: 'Professionals Only',
    genderPreference: 'Co-ed',
    rentAmount: 19000,
    depositAmount: 35000,
    city: 'Pune',
    area: 'Kalyani Nagar',
    fullAddressApproximate: 'Near Jogger Park, Kalyani Nagar, Pune',
    images: [
      'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
    ],
    safetyAmenities: {
      cctv: true,
      securityGuard: false,
      biometricAccess: true,
      curfew: 'No Curfew',
      emergencyResponseReady: true,
      fireSafetyCertified: true,
      visitorLogbook: false
    },
    generalAmenities: {
      wifi: true,
      powerBackup: true,
      mealsIncluded: false,
      airConditioning: true,
      laundry: true,
      studyDesk: true
    },
    verification: {
      contactVerified: true,
      identityVerified: true,
      propertyEvidenceReviewed: true,
      onSiteVerified: true
    },
    safetyScore: 91,
    owner: {
      id: 'own-306',
      name: 'Meera Kulkarni',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
      badge: 'Certified Trusted Host',
      joinedYear: 2023,
      responseRate: 'Under 45 mins',
      isIdentityVerified: true
    },
    isDemo: true
  }
];
