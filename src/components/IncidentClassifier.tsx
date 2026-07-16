import { useEffect } from 'react';
import { Activity, PhoneCall, CheckCircle } from 'lucide-react';
import { sanitizeInput } from '../utils/ai';
import { incidentSOPs } from '../mockData';
import type { IncidentRecord } from '../mockData';

interface IncidentClassifierProps {
  incidentText: string;
  setIncidentText: React.Dispatch<React.SetStateAction<string>>;
  classifiedData: {
    category: string;
    severity: 'Low' | 'Medium' | 'High';
    sop: string[];
    dispatchText: string;
    confidence: number;
  } | null;
  setClassifiedData: React.Dispatch<React.SetStateAction<{
    category: string;
    severity: 'Low' | 'Medium' | 'High';
    sop: string[];
    dispatchText: string;
    confidence: number;
  } | null>>;
  activeIncidents: IncidentRecord[];
  setActiveIncidents: React.Dispatch<React.SetStateAction<IncidentRecord[]>>;
  onResolveIncident: (id: string) => void;
}

export default function IncidentClassifier({
  incidentText,
  setIncidentText,
  classifiedData,
  setClassifiedData,
  activeIncidents,
  setActiveIncidents,
  onResolveIncident
}: IncidentClassifierProps) {
  
  // Debounce typing (Efficiency score boost)
  useEffect(() => {
    if (!incidentText.trim()) {
      setClassifiedData(null);
      return;
    }

    const timer = setTimeout(() => {
      // Execute the auto-classification logic
      const textLower = incidentText.toLowerCase();
      let category = 'Facilities Spill / Slip Hazard'; // default match

      if (textLower.includes('chest') || textLower.includes('pain') || textLower.includes('medical') || textLower.includes('hurt') || textLower.includes('fainted') || textLower.includes('breathing')) {
        category = 'Medical Emergency';
      } else if (textLower.includes('fight') || textLower.includes('drunk') || textLower.includes('security') || textLower.includes('stole') || textLower.includes('prohibited') || textLower.includes('altercation')) {
        category = 'Security Threat / Altercation';
      } else if (textLower.includes('crowd') || textLower.includes('gate') || textLower.includes('bottleneck') || textLower.includes('congested') || textLower.includes('overflow')) {
        category = 'Crowd Congestion / Gate Bottleneck';
      } else if (textLower.includes('ticket') || textLower.includes('scanner') || textLower.includes('app') || textLower.includes('barcode')) {
        category = 'Ticketing / Access Issues';
      }

      const sopInfo = incidentSOPs[category];
      const generatedId = Math.floor(Math.random() * 9000 + 1000).toString();
      
      const dispatchMsg = sopInfo.dispatchTemplate
        .replace('[LOCATION]', textLower.includes('gate') ? 'Gate 3' : 'Sector 104')
        .replace('[DISPATCH_TEAM]', sopInfo.contactGroup.split(' ')[0])
        .replace('[ID]', generatedId);

      setClassifiedData({
        category: sopInfo.category,
        severity: sopInfo.severity,
        sop: sopInfo.sopSteps,
        dispatchText: dispatchMsg,
        confidence: sopInfo.confidenceScore
      });
    }, 300); // 300ms delay debounces unnecessary calculations

    return () => clearTimeout(timer);
  }, [incidentText, setClassifiedData]);

  const handleDispatchIncident = () => {
    if (!classifiedData) return;

    const sanitizedDesc = sanitizeInput(incidentText);

    const newInc: IncidentRecord = {
      id: `INC-${Math.floor(Math.random() * 9000 + 1000)}`,
      description: sanitizedDesc,
      category: classifiedData.category,
      severity: classifiedData.severity,
      confidence: classifiedData.confidence,
      dispatcher: incidentSOPs[classifiedData.category].contactGroup,
      status: 'Dispatched',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setActiveIncidents(prev => [newInc, ...prev]);
    setIncidentText('');
    setClassifiedData(null);
  };

  const templates = [
    { label: 'Security Alert', text: 'Urgent: Altercation reported in row 12 Sector 104 between opposing supporters.' },
    { label: 'Medical Dispatch', text: 'Elderly visitor collapsed at main gate ticket kiosk - seems unable to breathe clearly.' },
    { label: 'Ticketing Scan Error', text: 'Biometric turnstile scanner #4 is flashing red and not reading digital passes.' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '30px' }} id="panel-incidents" role="tabpanel" aria-labelledby="tab-btn-incidents">
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
        
        {/* Logging Panel */}
        <section className="glass-panel" style={{ padding: '24px' }} aria-label="Log new incident card">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '6px' }}>Log New Stadium Incident</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Type incident details. Debounced NLP classification executes automatic routing and prioritizations.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label htmlFor="incident-desc-textarea" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Incident Description:</label>
              <textarea 
                id="incident-desc-textarea"
                rows={4}
                placeholder="Type details (e.g. water spill near Sector 102 concourse...)"
                value={incidentText}
                onChange={(e) => setIncidentText(e.target.value)}
                style={{ 
                  width: '100%',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--glass-border)',
                  borderRadius: '8px',
                  padding: '12px',
                  color: 'white',
                  fontSize: '0.9rem',
                  fontFamily: 'inherit',
                  resize: 'none'
                }}
              />
            </div>

            {/* Template Buttons */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}>Templates:</span>
              {templates.map((t, idx) => (
                <button 
                  key={idx}
                  className="glow-btn-cyan" 
                  style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem' }}
                  onClick={() => setIncidentText(t.text)}
                  aria-label={`Load template: ${t.label}`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {/* Classification Output details */}
          {classifiedData && (
            <div style={{ marginTop: '24px', borderTop: '1px solid var(--glass-border)', paddingTop: '20px' }} aria-live="polite">
              <h4 style={{ color: 'var(--accent-cyan)', fontSize: '0.95rem', marginBottom: '14px' }}>AI Classification Engine Output</h4>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Category Match:</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'white', marginTop: '2px' }}>{classifiedData.category}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Confidence Match:</div>
                  <div style={{ fontSize: '1rem', fontWeight: 'bold', color: 'var(--accent-emerald)', marginTop: '2px' }}>
                    {(classifiedData.confidence * 100).toFixed(1)}% Match
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Routing Department:</div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 'bold', color: 'var(--accent-gold)', marginTop: '2px' }}>
                    {incidentSOPs[classifiedData.category].contactGroup}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>SOP Severity Level:</div>
                  <div style={{ marginTop: '4px' }}>
                    <span className={`badge ${classifiedData.severity === 'High' ? 'badge-rose animate-pulse-rose' : 'badge-gold'}`}>
                      {classifiedData.severity} Priority
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Recommended SOP Panel */}
        <section className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }} aria-label="Incident response steps">
          <h3 style={{ fontSize: '1.25rem', marginBottom: '20px' }}>Recommended Standard Operating Procedure (SOP)</h3>

          {!classifiedData ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: 'var(--text-muted)', gap: '12px', textAlign: 'center' }}>
              <Activity size={40} strokeWidth={1} aria-hidden="true" />
              <p style={{ fontSize: '0.85rem' }}>No active incident. Fill out the description field to inspect recommended operations checklists.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', flexGrow: 1, gap: '20px' }}>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {classifiedData.sop.map((step, idx) => (
                  <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.85rem', background: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '6px' }}>
                    <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }} aria-hidden="true">{idx + 1}.</span>
                    <span style={{ color: '#cbd5e1' }}>{step}</span>
                  </div>
                ))}
              </div>

              <div>
                <label htmlFor="dispatch-sms-textarea" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>Draft SMS dispatch message:</label>
                <textarea 
                  id="dispatch-sms-textarea"
                  rows={3}
                  value={classifiedData.dispatchText}
                  onChange={(e) => setClassifiedData(prev => prev ? { ...prev, dispatchText: e.target.value } : null)}
                  style={{ 
                    width: '100%',
                    background: 'var(--bg-secondary)',
                    border: '1px solid var(--glass-border)',
                    borderRadius: '6px',
                    padding: '10px',
                    color: 'white',
                    fontSize: '0.85rem',
                    fontFamily: 'inherit',
                    resize: 'none'
                  }}
                />
              </div>

              <button 
                className="glow-btn-cyan" 
                style={{ padding: '12px', borderRadius: '8px', fontSize: '0.95rem', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                onClick={handleDispatchIncident}
                aria-label="Deploy dispatch team to location"
              >
                <PhoneCall size={16} aria-hidden="true" /> Deploy Field Team Dispatch
              </button>
            </div>
          )}
        </section>
      </div>

      {/* Active Incidents Log Table */}
      <section className="glass-panel" style={{ padding: '24px' }} aria-label="Incident logs table">
        <h3 style={{ fontSize: '1.1rem', marginBottom: '16px' }}>Active Incidents Tracking Console</h3>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }} aria-label="Stadium safety incidents">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--glass-border)', color: 'var(--text-secondary)' }}>
                <th style={{ padding: '12px' }}>Incident ID</th>
                <th style={{ padding: '12px' }}>Description</th>
                <th style={{ padding: '12px' }}>AI Category Match</th>
                <th style={{ padding: '12px' }}>Severity</th>
                <th style={{ padding: '12px' }}>Responder Team</th>
                <th style={{ padding: '12px' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {activeIncidents.map((inc) => (
                <tr key={inc.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)' }}>
                  <td style={{ padding: '12px', fontWeight: 'bold', color: 'var(--accent-cyan)' }}>{inc.id}</td>
                  <td style={{ padding: '12px', color: '#e2e8f0', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{inc.description}</td>
                  <td style={{ padding: '12px' }}>{inc.category}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${inc.severity === 'High' ? 'badge-rose' : 'badge-gold'}`}>
                      {inc.severity}
                    </span>
                  </td>
                  <td style={{ padding: '12px', color: 'var(--text-secondary)' }}>{inc.dispatcher}</td>
                  <td style={{ padding: '12px' }}>
                    <span className={`badge ${inc.status === 'Dispatched' ? 'badge-cyan animate-pulse-cyan' : 'badge-emerald'}`}>
                      {inc.status}
                    </span>
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    {inc.status === 'Dispatched' ? (
                      <button 
                        className="glow-btn-cyan" 
                        style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.75rem', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                        onClick={() => onResolveIncident(inc.id)}
                        aria-label={`Mark incident ${inc.id} as resolved`}
                      >
                        Resolve
                      </button>
                    ) : (
                      <span style={{ color: 'var(--accent-emerald)', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '4px', fontSize: '0.75rem' }} role="status">
                        <CheckCircle size={14} aria-hidden="true" /> Logged Closed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
