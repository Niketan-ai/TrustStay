import React from 'react';
import { Property } from '../../types/property';
import { VerificationBadge, OnSitePill, EvidencePill } from '../common/VerificationBadge';
import { CloseIcon, MapPinIcon, ShieldCheckIcon, VideoCameraIcon, LockIcon, ClockIcon } from '../common/Icons';

interface PropertyDetailModalProps {
  property: Property | null;
  onClose: () => void;
  onRequestVisit: (property: Property) => void;
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  onClose,
  onRequestVisit,
}) => {
  if (!property) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-property-title">
      <div className="modal-content" style={{ maxWidth: '720px', maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
        {/* Top Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'center' }}>
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
              {!property.verification.onSiteVerified && property.verification.propertyEvidenceReviewed && <EvidencePill />}
            </div>
            <h2 id="modal-property-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.45rem', fontWeight: 800, color: '#0f172a' }}>
              {property.title}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#64748b', fontSize: '0.88rem' }}>
              <MapPinIcon size={16} />
              <span>{property.fullAddressApproximate}</span>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.25rem' }}
            aria-label="Close dialog"
          >
            <CloseIcon size={24} />
          </button>
        </div>

        {/* Image Carousel / Gallery */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '1.5rem', borderRadius: '12px', overflow: 'hidden' }}>
          {property.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`${property.title} preview ${idx + 1}`}
              style={{ width: '100%', height: '160px', objectFit: 'cover' }}
              loading="lazy"
            />
          ))}
        </div>

        {/* Verification Matrix Card */}
        <div style={{ backgroundColor: '#f0fdfa', border: '1px solid #ccfbf1', borderRadius: '12px', padding: '1rem', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f766e', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <ShieldCheckIcon size={18} /> Official Verification Audit
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f766e' }}>
              Safety Score: {property.safetyScore}/100
            </span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            <VerificationBadge type="contact" verified={property.verification.contactVerified} />
            <VerificationBadge type="identity" verified={property.verification.identityVerified} />
            <VerificationBadge type="evidence" verified={property.verification.propertyEvidenceReviewed} />
            <VerificationBadge type="onsite" verified={property.verification.onSiteVerified} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.4rem' }}>About this Stay</h4>
          <p style={{ color: '#475569', fontSize: '0.92rem', lineHeight: '1.6' }}>{property.description}</p>
        </div>

        {/* Safety & General Amenities */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              Safety Amenities
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <VideoCameraIcon size={16} /> 24/7 CCTV: {property.safetyAmenities.cctv ? 'Installed' : 'No'}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <LockIcon size={16} /> Security Guard: {property.safetyAmenities.securityGuard ? 'On Premises' : 'No'}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ShieldCheckIcon size={16} /> Biometric Keycard: {property.safetyAmenities.biometricAccess ? 'Yes' : 'No'}
              </li>
              <li style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <ClockIcon size={16} /> Curfew Policy: {property.safetyAmenities.curfew}
              </li>
            </ul>
          </div>

          <div>
            <h4 style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.6rem', textTransform: 'uppercase' }}>
              General Facilities
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem', color: '#334155' }}>
              <li>High-speed Fiber WiFi: {property.generalAmenities.wifi ? 'Included' : 'No'}</li>
              <li>Power Backup: {property.generalAmenities.powerBackup ? '100% Inverter' : 'No'}</li>
              <li>Meals Provided: {property.generalAmenities.mealsIncluded ? 'Available' : 'Self cooking'}</li>
              <li>Air Conditioning: {property.generalAmenities.airConditioning ? 'Equipped' : 'Not installed'}</li>
            </ul>
          </div>
        </div>

        {/* Owner Profile Snippet */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f8fafc', borderRadius: '10px', marginBottom: '1.5rem', border: '1px solid #e2e8f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <img src={property.owner.avatarUrl} alt={property.owner.name} style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }} />
            <div>
              <div style={{ fontWeight: 700, color: '#0f172a' }}>{property.owner.name}</div>
              <div style={{ fontSize: '0.75rem', color: '#64748b' }}>{property.owner.badge} • Host since {property.owner.joinedYear}</div>
            </div>
          </div>
          <span style={{ fontSize: '0.75rem', color: '#0f766e', fontWeight: 600 }}>Response Time: {property.owner.responseRate}</span>
        </div>

        {/* Footer Actions */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid #e2e8f0', paddingTop: '1.25rem' }}>
          <div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a' }}>₹{property.rentAmount.toLocaleString()} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ month</span></div>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Security Deposit: ₹{property.depositAmount.toLocaleString()}</div>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button onClick={onClose} className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRequestVisit(property);
              }}
              className="btn-primary"
            >
              Schedule Verified Visit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
