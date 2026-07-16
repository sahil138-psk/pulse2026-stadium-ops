import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import Diagnostics from './Diagnostics';
import { ragKnowledgeBase } from '../mockData';

const mockSetTemperature = vi.fn();
const mockSetSimilarityThreshold = vi.fn();
const mockSetSystemPrompt = vi.fn();
const mockSetSelectedDiagnoseChunk = vi.fn();

describe('Diagnostics Component Tests', () => {
  it('should render the vector space container and sliders', () => {
    render(
      <Diagnostics 
        temperature={0.3}
        setTemperature={mockSetTemperature}
        similarityThreshold={0.6}
        setSimilarityThreshold={mockSetSimilarityThreshold}
        systemPrompt="Test Prompt"
        setSystemPrompt={mockSetSystemPrompt}
        selectedDiagnoseChunk={ragKnowledgeBase[0]}
        setSelectedDiagnoseChunk={mockSetSelectedDiagnoseChunk}
        ragKnowledgeBase={ragKnowledgeBase}
      />
    );

    expect(screen.getByText('Vector Space Embeddings Visualization (2D Projection)')).toBeDefined();
    expect(screen.getByText('Vector Metadata Inspector')).toBeDefined();
    expect(screen.getByLabelText('Temperature (Entropy):')).toBeDefined();
  });

  it('should trigger setTemperature when user shifts slider', () => {
    render(
      <Diagnostics 
        temperature={0.3}
        setTemperature={mockSetTemperature}
        similarityThreshold={0.6}
        setSimilarityThreshold={mockSetSimilarityThreshold}
        systemPrompt="Test Prompt"
        setSystemPrompt={mockSetSystemPrompt}
        selectedDiagnoseChunk={ragKnowledgeBase[0]}
        setSelectedDiagnoseChunk={mockSetSelectedDiagnoseChunk}
        ragKnowledgeBase={ragKnowledgeBase}
      />
    );

    const tempSlider = screen.getByLabelText('Temperature (Entropy):');
    fireEvent.change(tempSlider, { target: { value: '0.5' } });

    expect(mockSetTemperature).toHaveBeenCalledWith(0.5);
  });
});
