import React from 'react';
import { Property, PropertyFilterState } from '../../types/property';
import { PropertyCard } from './PropertyCard';
import { SearchIcon, ShieldCheckIcon } from '../common/Icons';

export type DataSourceType = 'live' | 'demo';

interface PropertyListProps {
  properties: Property[];
  filters: PropertyFilterState;
  isLoading: boolean;
  error: string | null;
  dataSource: DataSourceType;
  onDataSourceChange: (source: DataSourceType) => void;
  liveCount: number;
  demoCount: number;
  isBackendConnected: boolean | null;
  backendMessage?: string;
  onRetryConnection: () => void;
  onSelectProperty: (property: Property) => void;
  onRequestVisit: (property: Property) => void;
  onResetFilters: () => void;
}

export const PropertyList: React.FC<PropertyListProps> = ({
  properties,
  filters,
  isLoading,
  error,
  dataSource,
  onDataSourceChange,
  liveCount,
  demoCount,
  isBackendConnected,
  backendMessage,
  onRetryConnection,
  onSelectProperty,
  onRequestVisit,
  onResetFilters,
}) => {
  // Apply search filtering
  const filteredProperties = properties.filter((item) => {
    // Location filter (city or area)
    if (filters.location.trim()) {
      const query = filters.location.toLowerCase();
      const matchCity = item.city.toLowerCase().includes(query);
      const matchArea = item.area.toLowerCase().includes(query);
      const matchTitle = item.title.toLowerCase().includes(query);
      if (!matchCity && !matchArea && !matchTitle) return false;
    }

    // Property Type
    if (filters.propertyType !== 'ALL' && item.propertyType !== filters.propertyType) {
      return false;
    }

    // Gender Preference
    if (filters.genderPreference !== 'ALL' && item.genderPreference !== filters.genderPreference) {
      return false;
    }

    // Max Rent
    if (item.rentAmount > filters.maxRent) {
      return false;
    }

    // Safety Amenity: CCTV
    if (filters.cctvRequired && !item.safetyAmenities.cctv) {
      return false;
    }

    // Safety Amenity: Security Guard
    if (filters.guardRequired && !item.safetyAmenities.securityGuard) {
      return false;
    }

    // Safety Amenity: Biometric
    if (filters.biometricRequired && !item.safetyAmenities.biometricAccess) {
      return false;
    }

    // Evidence Reviewed
    if (filters.evidenceReviewedOnly && !item.verification.propertyEvidenceReviewed) {
      return false;
    }

    // On-Site Verified
    if (filters.onSiteVerifiedOnly && !item.verification.onSiteVerified) {
      return false;
    }

    return true;
  });

  return (
    <section id="browse-section" style={{ padding: '3.5rem 0', backgroundColor: '#f8fafc' }}>
      <div className="container">
        {/* Backend Connectivity Status Bar */}
        <div style={{
          backgroundColor: isBackendConnected ? '#f0fdfa' : '#fff1f2',
          border: `1px solid ${isBackendConnected ? '#ccfbf1' : '#fecdd3'}`,
          borderRadius: '12px',
          padding: '0.75rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '0.75rem',
          fontSize: '0.85rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{
              width: 10,
              height: 10,
              borderRadius: '50%',
              backgroundColor: isBackendConnected ? '#059669' : '#e11d48'
            }} />
            <strong style={{ color: isBackendConnected ? '#0f766e' : '#be123c' }}>
              {isBackendConnected ? 'Backend Status: Connected' : 'Backend Status: Offline / Disconnected'}
            </strong>
            <span style={{ color: '#64748b' }}>
              ({backendMessage || (isBackendConnected ? 'Spring Boot 4.0.8 API on port 8080' : 'Cannot reach backend')})
            </span>
          </div>

          {!isBackendConnected && (
            <button
              onClick={onRetryConnection}
              className="btn-outline-navy"
              style={{ fontSize: '0.75rem', padding: '0.25rem 0.65rem' }}
            >
              Retry Connection
            </button>
          )}
        </div>

        {/* Section Headline & Data Source Switcher */}
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '1.75rem', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#0d9488', fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.35rem' }}>
              <ShieldCheckIcon size={16} /> Verified Rental Catalog
            </div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(1.6rem, 3vw, 2.2rem)', fontWeight: 800, color: '#0f172a' }}>
              Available Verified Accommodations
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              {dataSource === 'live'
                ? `Showing real PostgreSQL listings from backend REST API (${filteredProperties.length} active).`
                : `Showing verified sample listings in demo mode (${filteredProperties.length} samples).`}
            </p>
          </div>

          {/* Strict Data Source Separation Tabs */}
          <div style={{
            display: 'inline-flex',
            backgroundColor: '#e2e8f0',
            padding: '4px',
            borderRadius: '10px',
            gap: '4px'
          }}>
            <button
              type="button"
              onClick={() => onDataSourceChange('live')}
              style={{
                backgroundColor: dataSource === 'live' ? '#ffffff' : 'transparent',
                color: dataSource === 'live' ? '#0f172a' : '#64748b',
                boxShadow: dataSource === 'live' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
              title="Query real listings from PostgreSQL truststay_db database"
            >
              <span>⚡ Live Database</span>
              <span style={{
                backgroundColor: dataSource === 'live' ? '#eff6ff' : '#cbd5e1',
                color: dataSource === 'live' ? '#1d4ed8' : '#475569',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.72rem'
              }}>
                {liveCount}
              </span>
            </button>

            <button
              type="button"
              onClick={() => onDataSourceChange('demo')}
              style={{
                backgroundColor: dataSource === 'demo' ? '#ffffff' : 'transparent',
                color: dataSource === 'demo' ? '#0f172a' : '#64748b',
                boxShadow: dataSource === 'demo' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                border: 'none',
                borderRadius: '8px',
                padding: '0.45rem 0.9rem',
                fontSize: '0.82rem',
                fontWeight: 700,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem',
                transition: 'all 0.15s ease'
              }}
              title="View sample accommodation catalog"
            >
              <span>📋 Sample Demo Catalog</span>
              <span style={{
                backgroundColor: dataSource === 'demo' ? '#fef3c7' : '#cbd5e1',
                color: dataSource === 'demo' ? '#b45309' : '#475569',
                padding: '0.1rem 0.45rem',
                borderRadius: '9999px',
                fontSize: '0.72rem'
              }}>
                {demoCount}
              </span>
            </button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
            <div style={{
              width: 44,
              height: 44,
              border: '4px solid #cbd5e1',
              borderTopColor: '#0d9488',
              borderRadius: '50%',
              margin: '0 auto 1rem auto',
              animation: 'spin 1s linear infinite'
            }} />
            <p style={{ color: '#0f172a', fontWeight: 600 }}>Fetching accommodations from {dataSource === 'live' ? 'Spring Boot REST API' : 'catalog'}...</p>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <div style={{ padding: '3rem 2rem', textAlign: 'center', backgroundColor: '#fff1f2', borderRadius: '16px', border: '1px solid #fecdd3', marginBottom: '2rem' }}>
            <h3 style={{ color: '#e11d48', fontWeight: 700, marginBottom: '0.5rem' }}>Failed to retrieve live data</h3>
            <p style={{ color: '#64748b', marginBottom: '1.25rem', maxWidth: '600px', margin: '0 auto 1.25rem auto' }}>{error}</p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
              <button onClick={onRetryConnection} className="btn-primary">
                Retry API Connection
              </button>
              <button onClick={() => onDataSourceChange('demo')} className="btn-secondary" style={{ color: '#0f172a', borderColor: '#cbd5e1' }}>
                Switch to Sample Demo Catalog
              </button>
            </div>
          </div>
        )}

        {/* Live Database Empty State (Honest reporting: 0 items in PostgreSQL) */}
        {!isLoading && !error && dataSource === 'live' && properties.length === 0 && (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px dashed #93c5fd'
          }}>
            <div style={{ color: '#3b82f6', marginBottom: '1rem' }}>
              <ShieldCheckIcon size={48} />
            </div>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
              No Listings in PostgreSQL Database Yet
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '580px', margin: '0 auto 1.5rem auto', lineHeight: '1.6' }}>
              The Spring Boot REST API is connected and the <code>truststay_db</code> database schema is initialized, but no host has created a listing in the database yet.
            </p>
            <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button onClick={() => onDataSourceChange('demo')} className="btn-primary">
                View Sample Demo Accommodations ({demoCount})
              </button>
              <button onClick={onRetryConnection} className="btn-outline-navy">
                Refresh Live Database
              </button>
            </div>
          </div>
        )}

        {/* Filter Empty Results State (when properties exist but search filter yields 0) */}
        {!isLoading && !error && properties.length > 0 && filteredProperties.length === 0 && (
          <div style={{
            padding: '4rem 2rem',
            textAlign: 'center',
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            border: '1.5px dashed #cbd5e1'
          }}>
            <div style={{ color: '#94a3b8', marginBottom: '1rem' }}>
              <SearchIcon size={48} />
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>
              No accommodations match your search filters
            </h3>
            <p style={{ color: '#64748b', fontSize: '0.95rem', maxWidth: '480px', margin: '0 auto 1.5rem auto' }}>
              Try adjusting your rent range or disabling specific safety filters.
            </p>
            <button onClick={onResetFilters} className="btn-primary">
              Clear All Filters
            </button>
          </div>
        )}

        {/* Grid of Property Cards */}
        {!isLoading && !error && filteredProperties.length > 0 && (
          <div className="grid grid-cols-1 sm-grid-cols-2 lg-grid-cols-3 gap-6">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                onSelectProperty={onSelectProperty}
                onRequestVisit={onRequestVisit}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
