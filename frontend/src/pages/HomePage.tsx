import React, { useState, useEffect, useCallback } from 'react';
import { Property, PropertyFilterState } from '../types/property';
import { DEMO_PROPERTIES } from '../data/demoProperties';
import { Header } from '../components/layout/Header';
import { HeroSearch } from '../components/home/HeroSearch';
import { PropertyList, DataSourceType } from '../components/property/PropertyList';
import { VerificationGuide } from '../components/home/VerificationGuide';
import { SafetyCentre } from '../components/home/SafetyCentre';
import { Footer } from '../components/layout/Footer';
import { PropertyDetailModal } from '../components/modals/PropertyDetailModal';
import { VisitModal } from '../components/modals/VisitModal';
import { ReportComplaintModal } from '../components/modals/ReportComplaintModal';
import { AuthInfoModal } from '../components/modals/AuthInfoModal';
import { getActiveProperties, getBackendHealth } from '../services/api';

const INITIAL_FILTERS: PropertyFilterState = {
  location: '',
  propertyType: 'ALL',
  genderPreference: 'ALL',
  minRent: 0,
  maxRent: 35000,
  cctvRequired: false,
  guardRequired: false,
  biometricRequired: false,
  evidenceReviewedOnly: false,
  onSiteVerifiedOnly: false,
};

export const HomePage: React.FC = () => {
  const [filters, setFilters] = useState<PropertyFilterState>(INITIAL_FILTERS);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [visitProperty, setVisitProperty] = useState<Property | null>(null);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Data Source Management: 'live' or 'demo'
  const [dataSource, setDataSource] = useState<DataSourceType>('live');
  const [liveProperties, setLiveProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Backend Connectivity
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  const [backendMessage, setBackendMessage] = useState<string>('');

  const loadBackendData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Check health
      const health = await getBackendHealth();
      setIsBackendConnected(true);
      setBackendMessage(`${health.service} (${health.status})`);

      // 2. Fetch live properties from PostgreSQL
      const data = await getActiveProperties();
      setLiveProperties(data);
    } catch (err: unknown) {
      setIsBackendConnected(false);
      const message = err instanceof Error ? err.message : 'Backend connection error';
      setError(message);
      setBackendMessage('Connection failed to http://localhost:8080');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBackendData();
  }, [loadBackendData]);

  // Selected property set based on current active data source
  const currentProperties = dataSource === 'live' ? liveProperties : DEMO_PROPERTIES;

  // Filter calculation for search button counter
  const resultCount = currentProperties.filter((item) => {
    if (filters.location.trim()) {
      const q = filters.location.toLowerCase();
      const match = item.city.toLowerCase().includes(q) || item.area.toLowerCase().includes(q) || item.title.toLowerCase().includes(q);
      if (!match) return false;
    }
    if (filters.propertyType !== 'ALL' && item.propertyType !== filters.propertyType) return false;
    if (filters.genderPreference !== 'ALL' && item.genderPreference !== filters.genderPreference) return false;
    if (item.rentAmount > filters.maxRent) return false;
    if (filters.cctvRequired && !item.safetyAmenities.cctv) return false;
    if (filters.guardRequired && !item.safetyAmenities.securityGuard) return false;
    if (filters.biometricRequired && !item.safetyAmenities.biometricAccess) return false;
    if (filters.evidenceReviewedOnly && !item.verification.propertyEvidenceReviewed) return false;
    if (filters.onSiteVerifiedOnly && !item.verification.onSiteVerified) return false;
    return true;
  }).length;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 1. Header with responsive navigation */}
      <Header
        onOpenAuthInfo={() => setIsAuthModalOpen(true)}
        onOpenReportModal={() => setIsReportModalOpen(true)}
      />

      <main style={{ flex: 1 }}>
        {/* 2 & 3. Hero Section & Search Bar */}
        <HeroSearch
          filters={filters}
          onFilterChange={setFilters}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
          resultCount={resultCount}
        />

        {/* 4 & 5. Accommodation Listing Cards with Live Backend / Demo Selector */}
        <PropertyList
          properties={currentProperties}
          filters={filters}
          isLoading={isLoading}
          error={error}
          dataSource={dataSource}
          onDataSourceChange={setDataSource}
          liveCount={liveProperties.length}
          demoCount={DEMO_PROPERTIES.length}
          isBackendConnected={isBackendConnected}
          backendMessage={backendMessage}
          onRetryConnection={loadBackendData}
          onSelectProperty={(prop) => setSelectedProperty(prop)}
          onRequestVisit={(prop) => setVisitProperty(prop)}
          onResetFilters={() => setFilters(INITIAL_FILTERS)}
        />

        {/* 6. How Verification Works */}
        <VerificationGuide />

        {/* 7. Safety Centre & Incident Reporting */}
        <SafetyCentre
          onOpenReportModal={() => setIsReportModalOpen(true)}
        />
      </main>

      {/* 8. Footer */}
      <Footer />

      {/* Interactive Modals */}
      <PropertyDetailModal
        property={selectedProperty}
        onClose={() => setSelectedProperty(null)}
        onRequestVisit={(prop) => {
          setSelectedProperty(null);
          setVisitProperty(prop);
        }}
      />

      <VisitModal
        property={visitProperty}
        onClose={() => setVisitProperty(null)}
      />

      <ReportComplaintModal
        isOpen={isReportModalOpen}
        onClose={() => setIsReportModalOpen(false)}
      />

      <AuthInfoModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};
// At the end of the file, add default export
export default HomePage;
