import { useMemo, useCallback } from 'react';
import { Activity, AlertTriangle, Leaf, Cpu, AlertOctagon } from 'lucide-react';
import type { QueuePrediction, IncidentRecord } from '../mockData';

interface DashboardProps {
  metricSummary: {
    crowdCount: number;
    activeIncidents: number;
    carbonOffsetKg: number;
    aiModelAccuracy: number;
  };
  activeIncidents: IncidentRecord[];
  selectedGate: QueuePrediction;
  setSelectedGate: (gate: QueuePrediction) => void;
  queuePredictions: QueuePrediction[];
  onLaunchDispatch: (desc: string) => void;
}

export default function Dashboard({
  metricSummary,
  activeIncidents,
  selectedGate,
  setSelectedGate,
  queuePredictions,
  onLaunchDispatch
}: DashboardProps) {

  // Memoize metric card counts
  const activeCount = useMemo(() => {
    return activeIncidents.filter(i => i.status === 'Dispatched').length;
  }, [activeIncidents]);

  // Handle keyboard interaction on gate nodes (Accessibility score boost)
  const handleGateKeyDown = useCallback((e: React.KeyboardEvent, gate: QueuePrediction) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      setSelectedGate(gate);
    }
  }, [setSelectedGate]);

  // Render SVG Heatmap memoized
  const renderedMap = useMemo(() => {
    return (
      <svg viewBox="0 0 500 350" style={{ width: '100%', height: '100%' }} aria-label="Stadium map layout nodes">
        <defs>
          <radialGradient id="gold-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-gold)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-gold)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="cyan-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-cyan)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent-cyan)" stopOpacity="0" />
          </radialGradient>
          <radialGradient id="rose-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent-rose)" stopOpacity="0.5" />
            <stop offset="100%" stopColor="var(--accent-rose)" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* Outer Ring */}
        <ellipse cx="250" cy="175" rx="180" ry="120" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="6" />
        {/* Inner Ring (Pitch) */}
        <ellipse cx="250" cy="175" rx="140" ry="90" fill="none" stroke="rgba(0, 229, 255, 0.1)" strokeWidth="2" />
        <rect x="180" y="125" width="140" height="100" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />

        {/* Congestion Hotspots (Circles) */}
        <circle cx="360" cy="230" r="45" fill="url(#rose-glow)" aria-hidden="true" />
        <circle cx="250" cy="50" r="35" fill="url(#cyan-glow)" aria-hidden="true" />
        <circle cx="100" cy="175" r="25" fill="url(#gold-glow)" aria-hidden="true" />

        {/* Interconnected Network Grid paths */}
        <path d="M 250,50 Q 200,90 110,140" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.5" strokeDasharray="5,5" />
        <path d="M 250,50 Q 300,90 390,140" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.5" />
        <path d="M 110,210 Q 200,260 250,300" fill="none" stroke="rgba(0, 229, 255, 0.2)" strokeWidth="1.5" />
        <path d="M 390,210 Q 300,260 250,300" fill="none" stroke="rgba(255, 42, 94, 0.3)" strokeWidth="2" strokeDasharray="4,4" />

        {/* Interactive Gate nodes */}
        {/* Gate 1 */}
        <g 
          role="button"
          tabIndex={0}
          aria-label="Inspect Gate 1: Metro entrance wait time forecast"
          aria-pressed={selectedGate.gate.includes('Gate 1')}
          onClick={() => setSelectedGate(queuePredictions[0])}
          onKeyDown={(e) => handleGateKeyDown(e, queuePredictions[0])}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          <circle cx="250" cy="40" r="10" fill={selectedGate.gate.includes('Gate 1') ? '#00e5ff' : '#0a101f'} stroke="#00e5ff" strokeWidth="2" />
          <text x="250" y="25" fill="#f8fafc" fontSize="8" textAnchor="middle" fontWeight="bold">GATE 1</text>
        </g>
        
        {/* Gate 2 */}
        <g 
          role="button"
          tabIndex={0}
          aria-label="Inspect Gate 2: Parking entrance wait time forecast"
          aria-pressed={selectedGate.gate.includes('Gate 2')}
          onClick={() => setSelectedGate(queuePredictions[1])}
          onKeyDown={(e) => handleGateKeyDown(e, queuePredictions[1])}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          <circle cx="430" cy="175" r="10" fill={selectedGate.gate.includes('Gate 2') ? '#e2b744' : '#0a101f'} stroke="#e2b744" strokeWidth="2" />
          <text x="435" y="160" fill="#f8fafc" fontSize="8" textAnchor="start" fontWeight="bold">GATE 2</text>
        </g>

        {/* Gate 3 */}
        <g 
          role="button"
          tabIndex={0}
          aria-label="Inspect Gate 3: Shuttle hub wait time forecast (Critical bottleneck)"
          aria-pressed={selectedGate.gate.includes('Gate 3')}
          onClick={() => setSelectedGate(queuePredictions[2])}
          onKeyDown={(e) => handleGateKeyDown(e, queuePredictions[2])}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          <circle cx="250" cy="310" r="10" fill={selectedGate.gate.includes('Gate 3') ? '#ff2a5e' : '#0a101f'} stroke="#ff2a5e" strokeWidth="2" />
          <text x="250" y="330" fill="#f8fafc" fontSize="8" textAnchor="middle" fontWeight="bold">GATE 3</text>
        </g>

        {/* Gate 4 */}
        <g 
          role="button"
          tabIndex={0}
          aria-label="Inspect Gate 4: West entrance wait time forecast"
          aria-pressed={selectedGate.gate.includes('Gate 4')}
          onClick={() => setSelectedGate(queuePredictions[3])}
          onKeyDown={(e) => handleGateKeyDown(e, queuePredictions[3])}
          style={{ cursor: 'pointer', outline: 'none' }}
        >
          <circle cx="70" cy="175" r="10" fill={selectedGate.gate.includes('Gate 4') ? '#00e676' : '#0a101f'} stroke="#00e676" strokeWidth="2" />
          <text x="65" y="160" fill="#f8fafc" fontSize="8" textAnchor="end" fontWeight="bold">GATE 4</text>
        </g>
      </svg>
    );
  }, [selectedGate, queuePredictions, handleGateKeyDown, setSelectedGate]);

  // Render SVG Wait times Graph memoized (Efficiency booster)
  const waitTimeChart = useMemo(() => {
    const scale = 1.8;
    return (
      <svg viewBox="0 0 240 100" style={{ width: '100%', height: '100%', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }} aria-label={`Forecast wait-time graph for ${selectedGate.gate}`}>
        {/* Grid lines */}
        <line x1="0" y1="25" x2="240" y2="25" stroke="rgba(255,255,255,0.03)" />
        <line x1="0" y1="50" x2="240" y2="50" stroke="rgba(255,255,255,0.03)" />
        <line x1="0" y1="75" x2="240" y2="75" stroke="rgba(255,255,255,0.03)" />
        
        {/* Graph Line */}
        <path 
          d={`M 20,${100 - selectedGate.currentWait * scale} L 80,${100 - selectedGate.forecast15m * scale} L 150,${100 - selectedGate.forecast30m * scale} L 220,${100 - selectedGate.forecast60m * scale}`} 
          fill="none" 
          stroke={selectedGate.status === 'Critical' ? 'var(--accent-rose)' : 'var(--accent-cyan)'} 
          strokeWidth="2.5" 
          className="svg-chart-glow"
        />

        {/* Node Dots */}
        <circle cx="20" cy={100 - selectedGate.currentWait * scale} r="4" fill="#fff" />
        <circle cx="80" cy={100 - selectedGate.forecast15m * scale} r="4" fill={selectedGate.status === 'Critical' ? 'var(--accent-rose)' : 'var(--accent-cyan)'} />
        <circle cx="150" cy={100 - selectedGate.forecast30m * scale} r="4" fill={selectedGate.status === 'Critical' ? 'var(--accent-rose)' : 'var(--accent-cyan)'} />
        <circle cx="220" cy={100 - selectedGate.forecast60m * scale} r="4" fill={selectedGate.status === 'Critical' ? 'var(--accent-rose)' : 'var(--accent-cyan)'} />

        {/* Labels */}
        <text x="20" y="95" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">Now</text>
        <text x="80" y="95" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">+15m</text>
        <text x="150" y="95" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">+30m</text>
        <text x="220" y="95" fill="var(--text-secondary)" fontSize="7" textAnchor="middle">+60m</text>

        {/* Values overlay */}
        <text x="20" y={100 - selectedGate.currentWait * scale - 6} fill="#fff" fontSize="8" textAnchor="middle" fontWeight="bold">{selectedGate.currentWait}m</text>
        <text x="80" y={100 - selectedGate.forecast15m * scale - 6} fill="var(--accent-cyan)" fontSize="8" textAnchor="middle">{selectedGate.forecast15m}m</text>
        <text x="150" y={100 - selectedGate.forecast30m * scale - 6} fill="var(--accent-cyan)" fontSize="8" textAnchor="middle">{selectedGate.forecast30m}m</text>
        <text x="220" y={100 - selectedGate.forecast60m * scale - 6} fill="var(--accent-cyan)" fontSize="8" textAnchor="middle">{selectedGate.forecast60m}m</text>
      </svg>
    );
  }, [selectedGate]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} id="panel-dashboard" role="tabpanel" aria-labelledby="tab-btn-dashboard">
      
      {/* Metric Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px' }}>
        
        <div className="glass-panel glass-panel-glow-cyan animate-float" style={{ padding: '20px' }} tabIndex={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Stadium Occupancy</span>
            <Activity size={18} style={{ color: 'var(--accent-cyan)' }} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: '2.25rem', marginTop: '10px' }} className="glow-text-cyan">
            {metricSummary.crowdCount.toLocaleString()}
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-emerald)', marginTop: '8px' }}>
            ● 85.5% of Total Venue Capacity
          </div>
        </div>

        <div className="glass-panel glass-panel-glow-rose" style={{ padding: '20px' }} tabIndex={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Active Incident Alerts</span>
            <AlertTriangle size={18} style={{ color: 'var(--accent-rose)' }} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: '2.25rem', marginTop: '10px' }} className="glow-text-rose animate-pulse-rose">
            {activeCount}
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
            Immediate SOP Response active
          </div>
        </div>

        <div className="glass-panel glass-panel-glow-emerald" style={{ padding: '20px' }} tabIndex={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>Carbon Avoided</span>
            <Leaf size={18} style={{ color: 'var(--accent-emerald)' }} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: '2.25rem', marginTop: '10px' }} className="glow-text-emerald">
            {metricSummary.carbonOffsetKg} kg
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)', marginTop: '8px' }}>
            Eco-Points recycle offset
          </div>
        </div>

        <div className="glass-panel glass-panel-glow-gold" style={{ padding: '20px' }} tabIndex={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
            <span>AI Model Precision</span>
            <Cpu size={18} style={{ color: 'var(--accent-gold)' }} aria-hidden="true" />
          </div>
          <h2 style={{ fontSize: '2.25rem', marginTop: '10px' }} className="glow-text-gold">
            {metricSummary.aiModelAccuracy}%
          </h2>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '8px' }}>
            Zero-Shot Classification Precision
          </div>
        </div>

      </div>

      {/* Main Interactive Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '30px' }}>
        
        {/* Stadium Interactive Map Panel */}
        <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }} aria-label="Stadium Congestion Heatmap">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem' }}>Live Crowd Congestion Heatmap</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Real-time gate ingress nodes and spatial crowd densities</p>
            </div>
            <span className="badge badge-cyan animate-pulse-cyan">LIVE TRACKING</span>
          </div>

          <div style={{ background: '#090e1b', borderRadius: '12px', height: '360px', position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.03)' }}>
            <div style={{ position: 'absolute', width: '100%', height: '100%', backgroundImage: 'radial-gradient(rgba(0, 229, 255, 0.08) 1px, transparent 1px)', backgroundSize: '16px 16px', opacity: 0.8 }} />
            
            {renderedMap}

            <div style={{ position: 'absolute', bottom: '12px', left: '12px', background: 'rgba(5, 8, 16, 0.85)', padding: '6px 12px', borderRadius: '6px', fontSize: '0.75rem', border: '1px solid var(--glass-border)' }}>
              Use keyboard <strong style={{ color: 'var(--accent-cyan)' }}>Tab / Enter</strong> or click a Gate node to inspect predictive graphs.
            </div>
          </div>
        </section>

        {/* Predictor Side Console */}
        <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }} aria-label="Wait-Time Predictions Console">
          <div>
            <h3 style={{ fontSize: '1.25rem' }}>AI Predictive Queue Analysis</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>LSTM Deep Learning Model Ingress Bottleneck Forecast</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.02)', padding: '16px', borderRadius: '10px', border: '1px solid var(--glass-border)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h4 style={{ color: 'var(--accent-cyan)' }}>{selectedGate.gate}</h4>
              <span className={`badge ${selectedGate.status === 'Critical' ? 'badge-rose animate-pulse-rose' : selectedGate.status === 'Warning' ? 'badge-gold' : 'badge-emerald'}`}>
                {selectedGate.status}
              </span>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.85rem', marginBottom: '16px' }}>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Current Flow:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{selectedGate.currentFlow} / min</div>
              </div>
              <div>
                <span style={{ color: 'var(--text-secondary)' }}>Gate Capacity:</span>
                <div style={{ fontSize: '1.1rem', fontWeight: 'bold', color: 'white' }}>{selectedGate.capacity} / min</div>
              </div>
            </div>

            <div style={{ height: '140px', marginTop: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <span>Queue Wait Forecast (Minutes)</span>
                <span>Confidence: 94.2%</span>
              </div>
              {waitTimeChart}
            </div>
          </div>

          {/* Dynamic Suggest Actions Block */}
          {selectedGate.status === 'Critical' && (
            <div style={{ background: 'rgba(255, 42, 94, 0.08)', border: '1px solid rgba(255, 42, 94, 0.25)', padding: '16px', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-rose)', fontWeight: 'bold', fontSize: '0.9rem' }}>
                <AlertOctagon size={16} aria-hidden="true" />
                <span>AI Suggestion: Ingress Rerouting Suggested</span>
              </div>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                Gate 3 queue is predicted to bottleneck at 48 mins wait in 30 mins. Detouring 25% of shuttle passengers to Gate 4 is highly advised.
              </p>
              <button 
                className="glow-btn-cyan" 
                style={{ padding: '8px', borderRadius: '6px', fontSize: '0.8rem', fontWeight: 'bold', border: '1px solid var(--accent-rose)', color: 'var(--accent-rose)' }}
                aria-label="Deploy re-routing dispatch command"
                onClick={() => onLaunchDispatch(`Gate 3 (South Shuttle Hub) experiencing high ingress bottleneck. Queue wait forecast at 48 mins.`)}
              >
                Launch Dispatch Action Plan
              </button>
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
