import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import IncidentClassifier from './IncidentClassifier';
import type { IncidentRecord } from '../mockData';

const mockSetIncidentText = vi.fn();
const mockSetClassifiedData = vi.fn();
const mockSetActiveIncidents = vi.fn();
const mockOnResolveIncident = vi.fn();

const activeIncidents: IncidentRecord[] = [
  {
    id: 'INC-999',
    description: 'Test water leak leak in lobby.',
    category: 'Facilities Spill / Slip Hazard',
    severity: 'Medium',
    confidence: 0.94,
    dispatcher: 'Sanitation Crew',
    status: 'Dispatched',
    timestamp: '12:00:00'
  }
];

describe('IncidentClassifier Component Tests', () => {
  it('should render the logging form and active incidents log table', () => {
    render(
      <IncidentClassifier 
        incidentText=""
        setIncidentText={mockSetIncidentText}
        classifiedData={null}
        setClassifiedData={mockSetClassifiedData}
        activeIncidents={activeIncidents}
        setActiveIncidents={mockSetActiveIncidents}
        onResolveIncident={mockOnResolveIncident}
      />
    );

    expect(screen.getByText('Log New Stadium Incident')).toBeDefined();
    expect(screen.getByText('Active Incidents Tracking Console')).toBeDefined();
    expect(screen.getByText('INC-999')).toBeDefined();
    expect(screen.getByText('Test water leak leak in lobby.')).toBeDefined();
  });

  it('should load template values when template buttons are clicked', () => {
    render(
      <IncidentClassifier 
        incidentText=""
        setIncidentText={mockSetIncidentText}
        classifiedData={null}
        setClassifiedData={mockSetClassifiedData}
        activeIncidents={activeIncidents}
        setActiveIncidents={mockSetActiveIncidents}
        onResolveIncident={mockOnResolveIncident}
      />
    );

    const secTemplateBtn = screen.getByLabelText('Load template: Security Alert');
    fireEvent.click(secTemplateBtn);

    expect(mockSetIncidentText).toHaveBeenCalledWith(
      'Urgent: Altercation reported in row 12 Sector 104 between opposing supporters.'
    );
  });
});
