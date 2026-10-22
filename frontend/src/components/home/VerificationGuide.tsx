import React from 'react';
import { ShieldCheckIcon, UserCheckIcon, FileTextIcon, VideoCameraIcon } from '../common/Icons';

export const VerificationGuide: React.FC = () => {
  const steps = [
    {
      step: '01',
      title: 'Contact Verification',
      badge: 'Tier 1 • Instant Cryptographic Check',
      icon: <ShieldCheckIcon size={24} />,
      description: 'Host and tenant mobile numbers are verified using time-sensitive one-time passcodes (OTP). Unverified phone numbers cannot list accommodations or schedule room visits.',
      evidence: 'Mandatory phone cryptographic confirmation',
    },
    {
      step: '02',
      title: 'Identity Verification',
      badge: 'Tier 2 • KYC Review',
      icon: <UserCheckIcon size={24} />,
      description: 'Hosts submit government-issued identification (National ID / Passport) to prove their legal identity before publishing listings, preventing anonymous fake landlords.',
      evidence: 'Government ID verification & background check',
    },
    {
      step: '03',
      title: 'Property Evidence Review',
      badge: 'Tier 3 • Title & Legal Validation',
      icon: <FileTextIcon size={24} />,
      description: 'Safety Officers examine utility statements, municipal property tax receipts, or management agreements to ensure the host has the legal right to lease the accommodation.',
      evidence: 'Electricity bills, title deeds & registry contracts',
    },
    {
      step: '04',
      title: 'On-Site Physical Audit',
      badge: 'Tier 4 • The Gold Trust Badge',
      icon: <VideoCameraIcon size={24} />,
      description: 'A TrustStay Safety Inspector conducts a physical visit or live geotagged walkthrough verifying CCTV operation, biometric entry, fire safety equipment, and emergency exits.',
      evidence: 'Physical audit report & geo-tagged inspection photos',
    },
  ];

  return (
    <section id="how-it-works" className="verification-guide-section">
      <div className="container">
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <span className="section-badge">Human-in-the-Loop Security</span>
          <h2 className="section-title">How Our 4-Tier Verification Works</h2>
          <p className="section-description" style={{ marginLeft: 'auto', marginRight: 'auto' }}>
            Verification labels are never granted automatically. Each tier requires authentic physical or document evidence verified by trained safety officers.
          </p>
        </div>

        {/* 4 Cards Grid */}
        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-4 gap-6">
          {steps.map((s) => (
            <div key={s.step} className="tier-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span className="tier-number">{s.step}</span>
                <div style={{ color: '#0d9488' }}>{s.icon}</div>
              </div>
              <h3 className="tier-title">{s.title}</h3>
              <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#0d9488', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
                {s.badge}
              </span>
              <p className="tier-text">{s.description}</p>
              <div className="tier-evidence-tag">
                <strong>Requires:</strong> {s.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
