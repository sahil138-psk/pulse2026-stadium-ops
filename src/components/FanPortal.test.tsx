import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import FanPortal from './FanPortal';
import { wasteCatalog } from '../mockData';

const mockSetFanMobileSubTab = vi.fn();
const mockSetFanQuery = vi.fn();
const mockSetSelectedLanguage = vi.fn();
const mockOnFanTranslate = vi.fn();
const mockSetRouteFrom = vi.fn();
const mockSetRouteTo = vi.fn();
const mockOnScanItem = vi.fn();
const mockOnClaimEcoPoints = vi.fn();

const languagesMap = {
  'es': {
    label: 'Español (Spanish)',
    welcome: '¿Cómo puedo ayudarte en el estadio hoy?',
    translationPrompt: 'Where is the nearest medical aid station?',
    aiResponse: 'La estación de ayuda médica...'
  }
};

describe('FanPortal Component Tests', () => {
  it('should render the smartphone phone simulator framing', () => {
    render(
      <FanPortal 
        fanMobileSubTab="concierge"
        setFanMobileSubTab={mockSetFanMobileSubTab}
        fanQuery=""
        setFanQuery={mockSetFanQuery}
        selectedLanguage="es"
        setSelectedLanguage={mockSetSelectedLanguage}
        translatedText={null}
        onFanTranslate={mockOnFanTranslate}
        languagesMap={languagesMap}
        routeFrom="Gate 3 (South Hub)"
        setRouteFrom={mockSetRouteFrom}
        routeTo="Sector 120 Seating"
        setRouteTo={mockSetRouteTo}
        calculatedPath={null}
        scannedItem={null}
        fanEcoPoints={150}
        isScanning={false}
        onScanItem={mockOnScanItem}
        onClaimEcoPoints={mockOnClaimEcoPoints}
        ecoSuccessMsg=""
        wasteCatalog={wasteCatalog}
      />
    );

    expect(screen.getByText('11:52 AM')).toBeDefined();
    expect(screen.getByText('Select Language:')).toBeDefined();
  });

  it('should switch sub-tabs when the mobile navigation buttons are clicked', () => {
    render(
      <FanPortal 
        fanMobileSubTab="concierge"
        setFanMobileSubTab={mockSetFanMobileSubTab}
        fanQuery=""
        setFanQuery={mockSetFanQuery}
        selectedLanguage="es"
        setSelectedLanguage={mockSetSelectedLanguage}
        translatedText={null}
        onFanTranslate={mockOnFanTranslate}
        languagesMap={languagesMap}
        routeFrom="Gate 3 (South Hub)"
        setRouteFrom={mockSetRouteFrom}
        routeTo="Sector 120 Seating"
        setRouteTo={mockSetRouteTo}
        calculatedPath={null}
        scannedItem={null}
        fanEcoPoints={150}
        isScanning={false}
        onScanItem={mockOnScanItem}
        onClaimEcoPoints={mockOnClaimEcoPoints}
        ecoSuccessMsg=""
        wasteCatalog={wasteCatalog}
      />
    );

    const pathBtn = screen.getByRole('tab', { name: 'Navigation path detour planner page' });
    fireEvent.click(pathBtn);

    expect(mockSetFanMobileSubTab).toHaveBeenCalledWith('route');
  });
});
