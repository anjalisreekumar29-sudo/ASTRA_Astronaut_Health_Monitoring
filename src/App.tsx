import React, { useState } from 'react';
import { AstronautProvider, useAstronaut } from './context/AstronautContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { DisclaimerBanner } from './components/layout/DisclaimerBanner';
import { DashboardView } from './components/dashboard/DashboardView';
import { VitalsView } from './components/vitals/VitalsView';
import { PhysicalHealthView } from './components/physical/PhysicalHealthView';
import { MentalWellnessView } from './components/mental/MentalWellnessView';
import { AIHealthInsightsView } from './components/ai/AIHealthInsightsView';
import { AlertsView } from './components/alerts/AlertsView';
import { HealthReportsView } from './components/reports/HealthReportsView';
import { SettingsView } from './components/settings/SettingsView';
import { ManualEntryModal } from './components/vitals/ManualEntryModal';
import { MoodCheckInModal } from './components/mental/MoodCheckInModal';

const AppContent: React.FC = () => {
  const { activeTab } = useAstronaut();
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardView />;
      case 'vitals':
        return <VitalsView />;
      case 'physical':
        return <PhysicalHealthView />;
      case 'mental':
        return <MentalWellnessView />;
      case 'ai':
        return <AIHealthInsightsView />;
      case 'alerts':
        return <AlertsView />;
      case 'reports':
        return <HealthReportsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-space-950 text-slate-100 bg-grid-pattern">
      {/* Sidebar Navigation (Responsive: Desktop fixed, Mobile overlay drawer) */}
      <Sidebar
        mobileOpen={isMobileMenuOpen}
        onMobileClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Mission Control Display Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* NASA Space Apps Challenge Simulated Data Disclaimer Banner */}
        <DisclaimerBanner />

        {/* Global Mission Control Header */}
        <Header
          onOpenManualModal={() => setIsManualModalOpen(true)}
          onOpenCheckInModal={() => setIsCheckInModalOpen(true)}
          onToggleMobileMenu={() => setIsMobileMenuOpen(prev => !prev)}
        />

        {/* Dynamic Telemetry View Container */}
        <main className="flex-1 overflow-y-auto px-4 md:px-6 py-6 scroll-smooth">
          <div className="max-w-7xl mx-auto">
            {renderActiveView()}
          </div>
        </main>
      </div>

      {/* Global Interactive Modals */}
      <ManualEntryModal
        isOpen={isManualModalOpen}
        onClose={() => setIsManualModalOpen(false)}
      />

      <MoodCheckInModal
        isOpen={isCheckInModalOpen}
        onClose={() => setIsCheckInModalOpen(false)}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <AstronautProvider>
      <AppContent />
    </AstronautProvider>
  );
};

export default App;
