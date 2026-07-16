import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from './App';

describe('App Coordinator Component Tests', () => {
  it('should render the app header and default to the Dashboard tab', () => {
    render(<App />);

    // Check header elements
    expect(screen.getByText('Pulse2026')).toBeDefined();
    expect(screen.getByText('Stadium Operations AI')).toBeDefined();
    
    // Check dashboard default view elements
    expect(screen.getByText('Live Crowd Congestion Heatmap')).toBeDefined();
  });

  it('should navigate between tabs when sidebar navigation buttons are clicked', () => {
    render(<App />);

    // Switch to Copilot Chat tab
    const chatTabBtn = screen.getByRole('tab', { name: /Switch to RAG Command Copilot view/i });
    fireEvent.click(chatTabBtn);
    expect(screen.getByText('GenAI Operations Assistant')).toBeDefined();

    // Switch to Incident Log tab
    const incidentTabBtn = screen.getByRole('tab', { name: /Switch to Incident Classifier view/i });
    fireEvent.click(incidentTabBtn);
    expect(screen.getByText('Log New Stadium Incident')).toBeDefined();

    // Switch to Fan Simulator tab
    const fanTabBtn = screen.getByRole('tab', { name: /Switch to Fan Mobile Portal view/i });
    fireEvent.click(fanTabBtn);
    expect(screen.getByText('Fan Portal Mobile Interface Simulator')).toBeDefined();

    // Switch to Diagnostics tab
    const diagTabBtn = screen.getByRole('tab', { name: /Switch to AI Engine Diagnostics view/i });
    fireEvent.click(diagTabBtn);
    expect(screen.getByText('Vector Space Embeddings Visualization (2D Projection)')).toBeDefined();
  });
});
