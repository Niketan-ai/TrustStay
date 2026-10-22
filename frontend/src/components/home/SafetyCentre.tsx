import React from 'react';
import { ShieldAlertIcon, FlagIcon, UserCheckIcon } from '../common/Icons';

interface SafetyCentreProps {
  onOpenReportModal: () => void;
}

export const SafetyCentre: React.FC<SafetyCentreProps> = ({ onOpenReportModal }) => {
  return (
    <section id="safety-centre" className="safety-centre-section">
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            color: '#2dd4bf',
            backgroundColor: 'rgba(45, 212, 191, 0.12)',
            border: '1px solid rgba(45, 212, 191, 0.3)',
            padding: '0.25rem 0.8rem',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            marginBottom: '0.75rem'
          }}>
            <ShieldAlertIcon size={16} /> Trust & Safety Centre
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', fontWeight: 800, marginBottom: '1rem' }}>
            Zero Tolerance for Fraud & Safety Hazards
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.05rem', maxWidth: '680px', margin: '0 auto' }}>
            Learn how TrustStay safeguards your deposits, flags duplicate photos with automated fraud scoring, and enforces immediate suspensions on unsafe accommodations.
          </p>
        </div>

        {/* 3 Safety Pillars */}
        <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-3 gap-6" style={{ marginBottom: '3.5rem' }}>
          <div className="safety-card">
            <div style={{ color: '#2dd4bf' }}><ShieldAlertIcon size={28} /></div>
            <h3 className="safety-card-title">1. How to Spot Suspicious Stays</h3>
            <p className="safety-card-text">
              Beware of hosts demanding cash-only tokens before scheduled visits, refusing video walkthroughs, or listing rents drastically below the local neighborhood average.
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.84rem', lineHeight: '1.6' }}>
              <li>Never transfer money outside the official verified channels.</li>
              <li>Always check for the "On-Site Verified" or "Evidence Approved" badge.</li>
            </ul>
          </div>

          <div className="safety-card">
            <div style={{ color: '#2dd4bf' }}><FlagIcon size={28} /></div>
            <h3 className="safety-card-title">2. Immediate Incident Reporting</h3>
            <p className="safety-card-text">
              Notice misleading photos, disabled CCTV cameras, or harassment? File an urgent complaint directly. Our safety response team triages reports within 4 hours.
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.84rem', lineHeight: '1.6' }}>
              <li>Upload photo or chat screenshots as direct evidence.</li>
              <li>Every complaint generates an auditable ticket id.</li>
            </ul>
          </div>

          <div className="safety-card">
            <div style={{ color: '#2dd4bf' }}><UserCheckIcon size={28} /></div>
            <h3 className="safety-card-title">3. Action, Strikes & Appeals</h3>
            <p className="safety-card-text">
              Violations result in immediate listing de-indexing and host account strikes. To preserve fairness, hosts may submit structured appeals reviewed by independent senior officers.
            </p>
            <ul style={{ paddingLeft: '1.2rem', color: '#94a3b8', fontSize: '0.84rem', lineHeight: '1.6' }}>
              <li>Permanent suspension for identity fraud or security tampering.</li>
              <li>All actions recorded in immutable compliance audit logs.</li>
            </ul>
          </div>
        </div>

        {/* Action Banner */}
        <div style={{
          backgroundColor: 'rgba(37, 99, 235, 0.15)',
          border: '1px solid rgba(37, 99, 235, 0.35)',
          borderRadius: '16px',
          padding: '2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          textAlign: 'center'
        }}>
          <div>
            <h4 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.4rem' }}>
              Encountered a suspicious listing or safety hazard?
            </h4>
            <p style={{ color: '#94a3b8', fontSize: '0.95rem', maxWidth: '600px' }}>
              Submit a report immediately. Our safety team will review evidence and enforce immediate protections.
            </p>
          </div>
          <button
            onClick={onOpenReportModal}
            className="btn-primary"
            style={{ background: 'linear-gradient(135deg, #e11d48, #be185d)' }}
          >
            <FlagIcon size={18} />
            <span>File a Safety Complaint</span>
          </button>
        </div>
      </div>
    </section>
  );
};
