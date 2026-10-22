import React from 'react';
import { Property } from '../types/property';
import { PropertyList } from '../components/property/PropertyList';
import { getActiveProperties } from '../services/api';

export const TenantDashboard: React.FC = () => {

  const [properties, setProperties] = React.useState<Property[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const data = await getActiveProperties();
        setProperties(data);
      } catch (e: any) {
        setError(e.message ?? 'Failed to load properties');
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Use empty filters object for now (no UI controls on dashboard)
  const emptyFilters = {
    location: '',
    propertyType: 'ALL',
    genderPreference: 'ALL',
    minRent: 0,
    maxRent: 1000000,
    cctvRequired: false,
    guardRequired: false,
    biometricRequired: false,
    evidenceReviewedOnly: false,
    onSiteVerifiedOnly: false,
  } as any;

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Available Accommodations</h1>
      <PropertyList
        properties={properties}
        filters={emptyFilters}
        isLoading={loading}
        error={error}
        dataSource="live"
        onDataSourceChange={() => {}}
        liveCount={properties.length}
        demoCount={0}
        isBackendConnected={true}
        backendMessage="Connected"
        onRetryConnection={() => {}}
        onSelectProperty={() => {}}
        onRequestVisit={() => {}}
        onResetFilters={() => {}}
      />
    </div>
  );
};

export default TenantDashboard;
