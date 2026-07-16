import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Dashboard from './Dashboard';
import { queuePredictions } from '../mockData';

const mockSetSelectedGate = vi.fn();
const mockOnLaunchDispatch = vi.fn();

const metricSummary = {
  crowdCount: 68420,
  activeIncidents: 2,
  carbonOffsetKg: 342.8,
  aiModelAccuracy: 97.4
};

describe('Dashboard Component Tests', () => {
  it('should render the stadium occupancy metrics correctly', () => {
    render(
      <Dashboard 
        metricSummary={metricSummary}
        activeIncidents={[]}
        selectedGate={queuePredictions[2]}
        setSelectedGate={mockSetSelectedGate}
        queuePredictions={queuePredictions}
        onLaunchDispatch={mockOnLaunchDispatch}
      />
    );

    expect(screen.getByText('68,420')).toBeDefined();
    expect(screen.getByText('342.8 kg')).toBeDefined();
    expect(screen.getByText('97.4%')).toBeDefined();
  });

  it('should trigger setSelectedGate when user clicks on a gate node', () => {
    render(
      <Dashboard 
        metricSummary={metricSummary}
        activeIncidents={[]}
        selectedGate={queuePredictions[2]}
        setSelectedGate={mockSetSelectedGate}
        queuePredictions={queuePredictions}
        onLaunchDispatch={mockOnLaunchDispatch}
      />
    );

    // Gate 1 interactive node has aria label
    const gate1Btn = screen.getByLabelText('Inspect Gate 1: Metro entrance wait time forecast');
    fireEvent.click(gate1Btn);

    expect(mockSetSelectedGate).toHaveBeenCalledWith(queuePredictions[0]);
  });
});
