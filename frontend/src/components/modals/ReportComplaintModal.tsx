import React, { useState } from 'react';
import { CloseIcon, FlagIcon, ShieldAlertIcon } from '../common/Icons';

interface ReportComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ReportComplaintModal: React.FC<ReportComplaintModalProps> = ({ isOpen, onClose }) => {
  const [category, setCategory] = useState('FAKE_LISTING');
  const [description, setDescription] = useState('');
  const [submittedNotice, setSubmittedNotice] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-report-title">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#e11d48' }}>
            <FlagIcon size={22} />
            <h3 id="modal-report-title" style={{ fontFamily: 'var(--font-display)', fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              File a Safety Complaint
            </h3>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer' }} aria-label="Close dialog">
            <CloseIcon size={22} />
          </button>
        </div>

        {submittedNotice ? (
          <div style={{ padding: '1.5rem', textAlign: 'center', backgroundColor: '#fff1f2', border: '1px solid #fecdd3', borderRadius: '12px' }}>
            <div style={{ color: '#e11d48', marginBottom: '0.75rem' }}>
              <ShieldAlertIcon size={36} />
            </div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#9f1239', marginBottom: '0.5rem' }}>
              Complaint Submission Prototype
            </h4>
            <p style={{ fontSize: '0.88rem', color: '#334155', lineHeight: '1.5', marginBottom: '1rem' }}>
              In Phase 4, your safety grievance will be dispatched to the Spring Boot REST API endpoint:
              <br />
              <code style={{ background: '#e2e8f0', padding: '0.2rem 0.4rem', borderRadius: '4px', fontSize: '0.8rem', display: 'inline-block', marginTop: '0.4rem' }}>
                POST /api/v1/complaints
              </code>
              <br />
              Triggering human triage by a Safety Officer and AI anomaly inspection via the Python FastAPI service.
            </p>
            <button onClick={onClose} className="btn-primary" style={{ margin: '0 auto', background: '#9f1239' }}>
              Close
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => {
            e.preventDefault();
            setSubmittedNotice(true);
          }}>
            <div className="input-group" style={{ marginBottom: '1rem' }}>
              <label htmlFor="complaint-category" className="input-label">Violation Category</label>
              <select
                id="complaint-category"
                className="input-control"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="FAKE_LISTING">Fake / Misleading Listing Information</option>
                <option value="SAFETY_HAZARD">Safety Hazard (Broken locks, no fire exit, CCTV failure)</option>
                <option value="FINANCIAL_FRAUD">Demanding unauthorized advance cash outside platform</option>
                <option value="HARASSMENT">Host / Staff Misconduct or Harassment</option>
              </select>
            </div>

            <div className="input-group" style={{ marginBottom: '1.5rem' }}>
              <label htmlFor="complaint-details" className="input-label">Incident Details</label>
              <textarea
                id="complaint-details"
                required
                rows={4}
                className="input-control"
                placeholder="Please describe the issue, dates, and any communications with the host..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button type="button" onClick={onClose} className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                Cancel
              </button>
              <button type="submit" className="btn-primary" style={{ background: 'linear-gradient(135deg, #e11d48, #be185d)' }}>
                Submit Urgent Report
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
