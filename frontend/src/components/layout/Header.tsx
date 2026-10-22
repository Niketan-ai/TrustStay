import React, { useState } from 'react';
import { ShieldCheckIcon, MenuIcon, CloseIcon } from '../common/Icons';
import { useAuth } from '../../context/AuthContext';

interface HeaderProps {
  onOpenAuthInfo: () => void;
  onOpenReportModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onOpenAuthInfo, onOpenReportModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, logout } = useAuth();

  const getPrimaryRoleBadge = () => {
    if (!user || !user.roles || user.roles.length === 0) return null;
    if (user.roles.includes('ROLE_ADMIN')) {
      return <span style={{ backgroundColor: '#7c3aed', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>ADMIN</span>;
    }
    if (user.roles.includes('ROLE_OWNER')) {
      return <span style={{ backgroundColor: '#0284c7', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>OWNER</span>;
    }
    return <span style={{ backgroundColor: '#059669', color: '#ffffff', padding: '2px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700 }}>TENANT</span>;
  };

  return (
    <header className="site-header">
      {/* Top Demo Notification Banner */}
      <div className="demo-top-banner">
        <span>⚠️ DEMO ENVIRONMENT: Showing verified accommodation architecture with live Spring Boot backend.</span>
      </div>

      <div className="container">
        <nav className="site-nav" aria-label="Main Navigation">
          {/* Logo & Tagline */}
          <a href="#" className="brand-logo" aria-label="TrustStay Home">
            <div style={{
              width: 38,
              height: 38,
              borderRadius: '10px',
              background: 'linear-gradient(135deg, #2563eb, #0d9488)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <ShieldCheckIcon size={24} />
            </div>
            <span className="brand-logo-text">
              Trust<span className="brand-logo-accent">Stay</span>
            </span>
          </a>

          {/* Desktop Navigation */}
          <div className="nav-links">
            <a href="#browse-section" className="nav-link active">Browse Accommodations</a>
            <a href="#how-it-works" className="nav-link">How Verification Works</a>
            <a href="#safety-centre" className="nav-link">Safety Centre</a>
            <button
              onClick={onOpenReportModal}
              className="nav-link"
              style={{ background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
            >
              Report Listing
            </button>
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>
                      {user.fullName}
                    </span>
                    {getPrimaryRoleBadge()}
                  </div>
                  <span style={{ fontSize: '0.76rem', color: '#64748b' }}>
                    {user.email || user.phoneNumber}
                  </span>
                </div>
                <button
                  onClick={logout}
                  className="btn-secondary"
                  style={{ padding: '0.45rem 0.85rem', fontSize: '0.82rem' }}
                  title="Sign out of current account"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuthInfo}
                className="btn-secondary"
                title="Sign In or Register"
              >
                Sign In / Register
              </button>
            )}

            <button
              onClick={onOpenAuthInfo}
              className="btn-primary"
              title="Post verified property listing"
            >
              Post Property
            </button>

            {/* Mobile hamburger button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="mobile-nav-toggle"
              aria-label="Toggle navigation menu"
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="mobile-menu-drawer">
          <a
            href="#browse-section"
            className="nav-link active"
            onClick={() => setMobileMenuOpen(false)}
          >
            Browse Accommodations
          </a>
          <a
            href="#how-it-works"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            How Verification Works
          </a>
          <a
            href="#safety-centre"
            className="nav-link"
            onClick={() => setMobileMenuOpen(false)}
          >
            Safety Centre
          </a>
          <button
            onClick={() => {
              setMobileMenuOpen(false);
              onOpenReportModal();
            }}
            className="nav-link"
            style={{ textAlign: 'left', background: 'none', border: 'none', font: 'inherit', cursor: 'pointer' }}
          >
            Report Listing
          </button>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
            {isAuthenticated && user ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', padding: '0.5rem', background: '#f8fafc', borderRadius: '6px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user.fullName}</span>
                  {getPrimaryRoleBadge()}
                </div>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    logout();
                  }}
                  className="btn-secondary"
                  style={{ width: '100%', justifyContent: 'center' }}
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenAuthInfo();
                }}
                className="btn-secondary"
                style={{ width: '100%', justifyContent: 'center' }}
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
