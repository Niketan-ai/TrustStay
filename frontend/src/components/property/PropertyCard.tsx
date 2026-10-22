import React from 'react';
import { Property } from '../../types/property';
import {
  VerificationBadge,
  OnSitePill,
  EvidencePill,
} from '../common/VerificationBadge';
import {
  MapPinIcon,
  ShieldCheckIcon,
  VideoCameraIcon,
  LockIcon,
  ClockIcon,
} from '../common/Icons';

interface PropertyCardProps {
  property: Property;
  onSelectProperty: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  onSelectProperty,
  onRequestVisit,
}) => {
  return (
    <article className="property-card" aria-label={property.title}>
      {/* Property Image Container */}
      <div className="property-image-container">
        <img
          src={property.images[0]}
          alt={property.title}
          className="property-image"
          loading="lazy"
        />

        {/* Floating Badges */}
        <div className="property-floating-badges">
          {property.isDemo ? (
            <span className="badge-demo">Demo Listing</span>
          ) : (
            <span style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: '#eff6ff',
              color: '#1d4ed8',
              border: '1px solid #bfdbfe',
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              fontSize: '0.72rem',
              fontWeight: 700,
              textTransform: 'uppercase'
            }}>
              PostgreSQL Listing #{property.id}
            </span>
          )}
          {property.verification.onSiteVerified && <OnSitePill />}
          {!property.verification.onSiteVerified && property.verification.propertyEvidenceReviewed && (
            <EvidencePill />
          )}
        </div>

        {/* Trust Score Pill */}
        <div className="property-safety-score-pill" title="Calculated platform safety & verification score">
          <ShieldCheckIcon size={14} />
          <span>Trust Score: {property.safetyScore}/100</span>
        </div>
      </div>

      {/* Property Card Content */}
      <div className="property-content">
        {/* Type & Gender Preference */}
        <div className="property-type-row">
          <span style={{ color: '#2563eb' }}>{property.propertyType}</span>
          <span style={{
            background: property.genderPreference === 'Female Only' ? '#fdf2f8' : property.genderPreference === 'Male Only' ? '#eff6ff' : '#f0fdfa',
            color: property.genderPreference === 'Female Only' ? '#be185d' : property.genderPreference === 'Male Only' ? '#1d4ed8' : '#0f766e',
            padding: '0.15rem 0.5rem',
            borderRadius: '4px',
            fontSize: '0.72rem'
          }}>
            {property.genderPreference}
          </span>
        </div>

        {/* Title */}
        <h3 className="property-title">
          {property.title}
        </h3>

        {/* Location */}
        <div className="property-location">
          <MapPinIcon size={15} />
          <span>{property.area}, {property.city}</span>
        </div>

        {/* 4-Tier Verification Matrix */}
        <div className="property-verification-matrix">
          <VerificationBadge type="contact" verified={property.verification.contactVerified} size="sm" />
          <VerificationBadge type="identity" verified={property.verification.identityVerified} size="sm" />
          <VerificationBadge type="evidence" verified={property.verification.propertyEvidenceReviewed} size="sm" />
          <VerificationBadge type="onsite" verified={property.verification.onSiteVerified} size="sm" />
        </div>

        {/* Safety Amenities Chips */}
        <div className="property-amenities-pills">
          {property.safetyAmenities.cctv && (
            <span className="amenity-pill" title="24/7 CCTV in common areas">
              <VideoCameraIcon size={12} /> CCTV
            </span>
          )}
          {property.safetyAmenities.securityGuard && (
            <span className="amenity-pill" title="Security guard on premises">
              <LockIcon size={12} /> Guard
            </span>
          )}
          {property.safetyAmenities.biometricAccess && (
            <span className="amenity-pill" title="Biometric / Smart Lock">
              <ShieldCheckIcon size={12} /> Biometric
            </span>
          )}
          <span className="amenity-pill" title={`Curfew policy: ${property.safetyAmenities.curfew}`}>
            <ClockIcon size={12} /> {property.safetyAmenities.curfew}
          </span>
        </div>

        {/* Owner Information */}
        <div className="owner-snippet" style={{ marginBottom: '0.75rem' }}>
          <img
            src={property.owner.avatarUrl}
            alt={property.owner.name}
            className="owner-avatar"
            loading="lazy"
          />
          <div>
            <div style={{ fontWeight: 600, fontSize: '0.8rem', color: '#0f172a' }}>
              Host: {property.owner.name}
            </div>
            <div style={{ fontSize: '0.7rem', color: '#64748b' }}>
              {property.owner.badge} • Responds {property.owner.responseRate}
            </div>
          </div>
        </div>

        {/* Footer: Rent & CTAs */}
        <div className="property-footer-row">
          <div className="price-container">
            <span className="price-main">₹{property.rentAmount.toLocaleString()}</span>
            <span className="price-sub">/ month (Deposit: ₹{property.depositAmount.toLocaleString()})</span>
          </div>

          <div style={{ display: 'flex', gap: '0.4rem' }}>
            <button
              onClick={() => onSelectProperty(property)}
              className="btn-outline-navy"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.75rem' }}
              title="Inspect complete safety audit and verified documents"
            >
              Audit Details
            </button>
            <button
              onClick={() => onRequestVisit(property)}
              className="btn-primary"
              style={{ fontSize: '0.8rem', padding: '0.4rem 0.8rem' }}
              title="Book a physical or virtual visit request"
            >
              Book Visit
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
