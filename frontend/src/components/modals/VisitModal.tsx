import React, { useState } from 'react';
import { Property } from '../../types/property';
import { CloseIcon, ShieldCheckIcon } from '../common/Icons';

interface VisitModalProps {
  property: Property | null;
  onClose: () => void;
}

export const VisitModal: React.FC<VisitModalProps> = ({ property, onClose }) => {
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('10:00 AM');
  const [visitType, setVisitType] = useState<'IN_PERSON' | 'VIRTUAL_CALL'>('IN_PERSON');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  if (!property) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-visit-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 id="modal-visit-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
            Schedule a Verified Property Visit
          </h3>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Close dialog">
            <CloseIcon size={22} />
          </button>
        </div>

        <div style={{ padding: '0.75rem', backgroundColor: '#eff6ff', borderRadius: '8px', marginBottom: '1.25rem', border: '1px solid #bfdbfe', fontSize: '0.85rem', color: '#1e40af' }}>
          <strong>Property:</strong> {property.title} <br />
          <strong>Host:</strong> {property.owner.name} ({property.owner.badge})
        </div>

        {submittedNotice ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#f0fdfa', border: '1px solid #99f6e4', borderRadius: '12px' }}>
            <div style={{ color: '#0d9488', marginBottom: '0.75rem' }}>
              <ShieldCheckIcon size={36} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f766e', marginBottom: '0.5rem' }}>
              Visit Request Prototype Form
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', marginBottom: '1rem' }}>
              In Phase 4, this request will call the Java Spring Boot REST API endpoint:
              <br />
              <code style={{ background: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block', marginTop: '0.4rem' }}>
                POST /api/v1/visits
              </code>
              <br />
              Persisting securely in PostgreSQL 18 with Flyway schema tracking.
            </p>
            <button onClick={onClose} className="btn-primary" style={{ margin: '0 auto' }}>
              Understood
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            setSubmittedNotice(true);
          }}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="visit-type" className="input-label">Visit Format</label>
              <select
                id="visit-type"
                className="input-control"
                value={visitType}
                onChange={(e) => setVisitType(e.target.value as 'IN_PERSON' | 'VIRTUAL_CALL')}
              >
                <option value="IN_PERSON">In-Person Accompanied Visit</option>
                <option value="VIRTUAL_CALL">Live Video Call Walkthrough</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="visit-date" className="input-label">Preferred Date</label>
              <input
                id="visit-date"
                type="date"
                required
                className="input-control"
                value={preferredDate}
                onChange={(e) => setPreferredDate(e.target.value)}
              />
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="visit-time" className="input-label">Preferred Time Slot</label>
              <select
                id="visit-time"
                className="input-control"
                value={preferredTime}
                onChange={(e) => setPreferredTime(e.target.value)}
              >
                <option value="10:00 AM">Morning (10:00 AM - 12:00 PM)</option>
                <option value="02:00 PM">Afternoon (02:00 PM - 04:00 PM)</option>
                <option value="06:00 PM">Evening (06:00 PM - 08:00 PM)</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary">
                Confirm Slot
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
