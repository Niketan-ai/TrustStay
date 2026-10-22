import React from 'react';
import { PropertyFilterState } from '../../types/property';
import { SearchIcon, ShieldCheckIcon, VideoCameraIcon, LockIcon } from '../common/Icons';

interface HeroSearchProps {
  filters: PropertyFilterState;
  onFilterChange: (newFilters: PropertyFilterState) => void;
  onResetFilters: () => void;
  resultCount: number;
}

export const HeroSearch: React.FC<HeroSearchProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
  resultCount,
}) => {
  const handleInputChange = (field: keyof PropertyFilterState, value: string | number | boolean) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <section className="hero-section">
      <div className="container">
        {/* Brand Tagline Badge */}
        <div className="hero-tagline-pill">
          <ShieldCheckIcon size={16} />
          <span>Find Your Stay. Verify Before You Trust.</span>
        </div>

        {/* Hero Headlines */}
        <h1 className="hero-title">
          Safety-First Accommodation for Students & Professionals
        </h1>
        <p className="hero-subtitle">
          Every listing is evaluated through real identity confirmation, physical evidence reviews, and independent on-site safety audits.
        </p>

        {/* Search Bar Card */}
        <div className="search-card">
          <form onSubmit={(e) => e.preventDefault()} aria-label="Accommodation Search Form">
            <div className="search-grid">
              {/* Location input */}
              <div className="input-group">
                <label htmlFor="search-location" className="input-label">
                  City or Neighborhood
                </label>
                <input
                  id="search-location"
                  type="text"
                  className="input-control"
                  placeholder="e.g. Koramangala, Viman Nagar, Cyber City"
                  value={filters.location}
                  onChange={(e) => handleInputChange('location', e.target.value)}
                />
              </div>

              {/* Property Type */}
              <div className="input-group">
                <label htmlFor="search-type" className="input-label">
                  Accommodation Type
                </label>
                <select
                  id="search-type"
                  className="input-control"
                  value={filters.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                >
                  <option value="ALL">All Types</option>
                  <option value="Studio">Studio Apartment</option>
                  <option value="Apartment">Apartment / Flat</option>
                  <option value="PG / Co-Living">PG / Co-Living</option>
                  <option value="Hostel">Student Hostel</option>
                </select>
              </div>

              {/* Gender Preference */}
              <div className="input-group">
                <label htmlFor="search-gender" className="input-label">
                  Living Preference
                </label>
                <select
                  id="search-gender"
                  className="input-control"
                  value={filters.genderPreference}
                  onChange={(e) => handleInputChange('genderPreference', e.target.value)}
                >
                  <option value="ALL">All Accommodations</option>
                  <option value="Female Only">Female Only</option>
                  <option value="Male Only">Male Only</option>
                  <option value="Co-ed">Co-ed / Shared</option>
                </select>
              </div>

              {/* Max Rent Range */}
              <div className="input-group">
                <label htmlFor="search-max-rent" className="input-label">
                  Max Monthly Rent: ₹{filters.maxRent.toLocaleString()}
                </label>
                <input
                  id="search-max-rent"
                  type="range"
                  min="5000"
                  max="35000"
                  step="1000"
                  className="input-control"
                  style={{ padding: '0.4rem 0', cursor: 'pointer' }}
                  value={filters.maxRent}
                  onChange={(e) => handleInputChange('maxRent', Number(e.target.value))}
                />
              </div>

              {/* Search Count / Action */}
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <button
                  type="button"
                  className="btn-primary"
                  style={{ width: '100%', justifyContent: 'center', height: '44px' }}
                  onClick={() => {
                    const el = document.getElementById('browse-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <SearchIcon size={18} />
                  <span>Show ({resultCount})</span>
                </button>
              </div>
            </div>

            {/* Quick Safety Filter Chips */}
            <div className="filter-amenities-row">
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>
                Safety Filters:
              </span>

              <button
                type="button"
                className={`filter-chip ${filters.onSiteVerifiedOnly ? 'active' : ''}`}
                onClick={() => handleInputChange('onSiteVerifiedOnly', !filters.onSiteVerifiedOnly)}
                aria-pressed={filters.onSiteVerifiedOnly}
              >
                <ShieldCheckIcon size={14} />
                <span>On-Site Verified Only</span>
              </button>

              <button
                type="button"
                className={`filter-chip ${filters.cctvRequired ? 'active' : ''}`}
                onClick={() => handleInputChange('cctvRequired', !filters.cctvRequired)}
                aria-pressed={filters.cctvRequired}
              >
                <VideoCameraIcon size={14} />
                <span>24/7 CCTV</span>
              </button>

              <button
                type="button"
                className={`filter-chip ${filters.guardRequired ? 'active' : ''}`}
                onClick={() => handleInputChange('guardRequired', !filters.guardRequired)}
                aria-pressed={filters.guardRequired}
              >
                <LockIcon size={14} />
                <span>Security Guard</span>
              </button>

              <button
                type="button"
                className={`filter-chip ${filters.biometricRequired ? 'active' : ''}`}
                onClick={() => handleInputChange('biometricRequired', !filters.biometricRequired)}
                aria-pressed={filters.biometricRequired}
              >
                <LockIcon size={14} />
                <span>Biometric / Keycard Entry</span>
              </button>

              <button
                type="button"
                className={`filter-chip ${filters.evidenceReviewedOnly ? 'active' : ''}`}
                onClick={() => handleInputChange('evidenceReviewedOnly', !filters.evidenceReviewedOnly)}
                aria-pressed={filters.evidenceReviewedOnly}
              >
                <ShieldCheckIcon size={14} />
                <span>Property Evidence Reviewed</span>
              </button>

              {(filters.location ||
                filters.propertyType !== 'ALL' ||
                filters.genderPreference !== 'ALL' ||
                filters.cctvRequired ||
                filters.guardRequired ||
                filters.biometricRequired ||
                filters.evidenceReviewedOnly ||
                filters.onSiteVerifiedOnly ||
                filters.maxRent < 35000) && (
                <button
                  type="button"
                  onClick={onResetFilters}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#e11d48',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    marginLeft: 'auto',
                    textDecoration: 'underline'
                  }}
                >
                  Clear all filters
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
