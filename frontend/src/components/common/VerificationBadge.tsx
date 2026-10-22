import React from 'react';
import { ShieldCheckIcon, CheckCircleIcon, XCircleIcon } from './Icons';

export type VerificationType = 'contact' | 'identity' | 'evidence' | 'onsite';

interface VerificationBadgeProps {
  type: VerificationType;
  verified: boolean;
  size?: 'sm' | 'md';
}

const BADGE_CONFIG = {
  contact: {
    label: 'Contact Verified',
    description: 'Phone OTP confirmed',
  },
  identity: {
    label: 'Identity Verified',
    description: 'Government ID validated',
  },
  evidence: {
    label: 'Property Evidence Reviewed',
    description: 'Utility bills & ownership papers reviewed',
  },
  onsite: {
    label: 'On-Site Verified',
    description: 'Physical inspection completed',
  },
};

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  type,
  verified,
  size = 'md',
}) => {
  const config = BADGE_CONFIG[type];

  if (verified) {
    return (
      <span
        className={`verification-item verified ${size === 'sm' ? 'text-xs' : ''}`}
        title={`${config.label} — ${config.description}`}
      >
        <CheckCircleIcon size={size === 'sm' ? 14 : 16} />
        <span>{config.label}</span>
      </span>
    );
  }

  return (
    <span
      className={`verification-item unverified ${size === 'sm' ? 'text-xs' : ''}`}
      title={`${config.label} — Pending verification`}
    >
      <XCircleIcon size={size === 'sm' ? 14 : 16} />
      <span>{config.label} (Pending)</span>
    </span>
  );
};

export const OnSitePill: React.FC = () => (
  <span className="badge-verified-on-site" title="Physical verification completed by TrustStay Safety Inspector">
    <ShieldCheckIcon size={14} />
    <span>On-Site Verified</span>
  </span>
);

export const EvidencePill: React.FC = () => (
  <span className="badge-verified-evidence" title="Title deeds and utility evidence verified">
    <CheckCircleIcon size={14} />
    <span>Evidence Approved</span>
  </span>
);
