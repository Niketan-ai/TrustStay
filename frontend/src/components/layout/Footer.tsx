import React from 'react';
import { ShieldCheckIcon } from '../common/Icons';

export const Footer: React.FC = () => {
  return (
    <footer className="site-footer">
      <div className="container">
        <div className="footer-grid">
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{
                width: 32,
                height: 32,
                borderRadius: '8px',
                background: 'linear-gradient(135deg, #2563eb, #0d9488)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff'
              }}>
                <ShieldCheckIcon size={20} />
              </div>
              <span style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff' }}>
                Trust<span style={{ color: '#2dd4bf' }}>Stay</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '1.25rem' }}>
              Find Your Stay. Verify Before You Trust.
              The safety-first accommodation platform built for students and working professionals.
            </p>
            <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
              Powered by Java Spring Boot REST API & PostgreSQL 18
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="footer-col-title">Accommodations</h4>
            <ul className="footer-links">
              <li><a href="#browse-section" className="footer-link">Verified Student Studios</a></li>
              <li><a href="#browse-section" className="footer-link">Women’s Executive PGs</a></li>
              <li><a href="#browse-section" className="footer-link">Coliving & Hostels</a></li>
              <li><a href="#browse-section" className="footer-link">Gated Township Apartments</a></li>
            </ul>
          </div>

          {/* Safety & Compliance */}
          <div>
            <h4 className="footer-col-title">Trust & Safety</h4>
            <ul className="footer-links">
              <li><a href="#how-it-works" className="footer-link">4-Tier Verification Process</a></li>
              <li><a href="#safety-centre" className="footer-link">Safety Standards & CCTV Audits</a></li>
              <li><a href="#safety-centre" className="footer-link">Reporting Fake Listings</a></li>
              <li><a href="#safety-centre" className="footer-link">Owner Appeals & Strike Policy</a></li>
            </ul>
          </div>

          {/* Tech Architecture Notice */}
          <div>
            <h4 className="footer-col-title">Architecture Specs</h4>
            <ul className="footer-links">
              <li><span style={{ color: '#cbd5e1' }}>Frontend: React 19 + TypeScript + Vite</span></li>
              <li><span style={{ color: '#cbd5e1' }}>Backend: Java 25 + Spring Boot 3.4+</span></li>
              <li><span style={{ color: '#cbd5e1' }}>Database: PostgreSQL 18 (Flyway Migrations)</span></li>
              <li><span style={{ color: '#cbd5e1' }}>Fraud: Python FastAPI Microservice</span></li>
            </ul>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} TrustStay Platform. All rights reserved. Demo accommodation data for verification.</p>
          <div style={{ display: 'flex', gap: '1.5rem', color: '#64748b', fontSize: '0.8rem' }}>
            <span>Zero Brokerage Fraud</span>
            <span>Human-Inspected Stays</span>
            <span>End-to-End Audited</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
