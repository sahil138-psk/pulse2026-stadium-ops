import { useMemo } from 'react';
import { Compass, Languages, Navigation, Leaf, Sparkles, Volume2, RefreshCw } from 'lucide-react';
import type { WasteItem, RoutePath } from '../mockData';

interface FanPortalProps {
  fanMobileSubTab: 'concierge' | 'route' | 'recycle';
  setFanMobileSubTab: (tab: 'concierge' | 'route' | 'recycle') => void;
  fanQuery: string;
  setFanQuery: (q: string) => void;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  translatedText: { original: string; translated: string; response: string } | null;
  onFanTranslate: () => void;
  languagesMap: Record<string, { label: string; welcome: string; translationPrompt: string; aiResponse: string }>;
  routeFrom: string;
  setRouteFrom: (from: string) => void;
  routeTo: string;
  setRouteTo: (to: string) => void;
  calculatedPath: RoutePath | null;
  scannedItem: WasteItem | null;
  fanEcoPoints: number;
  isScanning: boolean;
  onScanItem: (item: WasteItem) => void;
  onClaimEcoPoints: () => void;
  ecoSuccessMsg: string;
  wasteCatalog: WasteItem[];
}

export default function FanPortal({
  fanMobileSubTab,
  setFanMobileSubTab,
  fanQuery,
  setFanQuery,
  selectedLanguage,
  setSelectedLanguage,
  translatedText,
  onFanTranslate,
  languagesMap,
  routeFrom,
  setRouteFrom,
  routeTo,
  setRouteTo,
  calculatedPath,
  scannedItem,
  fanEcoPoints,
  isScanning,
  onScanItem,
  onClaimEcoPoints,
  ecoSuccessMsg,
  wasteCatalog
}: FanPortalProps) {

  // Memoize waste catalog items
  const renderedWaste = useMemo(() => {
    return wasteCatalog.map(w => (
      <button 
        key={w.id} 
        style={{ background: '#12182b', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', color: 'white', fontSize: '0.7rem', padding: '6px 8px', cursor: 'pointer', flex: '1 1 45%' }}
        onClick={() => onScanItem(w)}
        disabled={isScanning}
        aria-label={`Simulate scanning ${w.name}`}
      >
        Scan {w.name}
      </button>
    ));
  }, [wasteCatalog, isScanning, onScanItem]);

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '40px', alignItems: 'start' }} id="panel-fan" role="tabpanel" aria-labelledby="tab-btn-fan">
      
      {/* Informative Side Card */}
      <section style={{ display: 'flex', flexDirection: 'column', gap: '20px' }} aria-label="Fan portal documentation">
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.25rem', marginBottom: '8px' }}>Fan Portal Mobile Interface Simulator</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: '1.5' }}>
            This panel simulates the World Cup fan mobile app. Fans visiting the stadium can query live multilingual assistance, calculate safe, crowd-aware routes, and scan plastic trash to log Eco-Points.
          </p>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <h4 style={{ color: 'var(--accent-gold)', marginBottom: '8px', fontSize: '0.95rem' }}>Core Operations Leveraged:</h4>
          <ul style={{ paddingLeft: '20px', fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <li>
              <strong>Context Translation</strong>: Automatically translates questions to Arabic, Portuguese, French, or Spanish.
            </li>
            <li>
              <strong>Detour Rerouting</strong>: Avoids congested gate queues based on real-time sensors.
            </li>
            <li>
              <strong>Computer Vision recycling</strong>: Grants eco points via simulated bounding-box scanning.
            </li>
          </ul>
        </div>
      </section>

      {/* Mobile Simulator Frame */}
      <section style={{ display: 'flex', justifyContent: 'center' }} aria-label="Smartphone simulator screen">
        <div className="mobile-simulator">
          <div className="mobile-screen">
            <div className="mobile-header">
              <span style={{ fontSize: '0.75rem', fontWeight: 'bold' }}>11:52 AM</span>
              <span className="badge badge-gold" style={{ fontSize: '0.55rem', padding: '2px 6px' }}>FIFA 2026</span>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-cyan)' }}>LTE ● 94%</span>
            </div>

            {/* Mobile navigation tab buttons */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '4px', marginBottom: '16px' }} role="tablist" aria-label="Mobile app subpages">
              <button 
                role="tab"
                aria-selected={fanMobileSubTab === 'concierge'}
                aria-label="Multilingual AI Concierge page"
                style={{ background: fanMobileSubTab === 'concierge' ? 'rgba(0,229,255,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: fanMobileSubTab === 'concierge' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontSize: '0.7rem', padding: '8px 2px', cursor: 'pointer' }}
                onClick={() => setFanMobileSubTab('concierge')}
              >
                AI Concierge
              </button>
              <button 
                role="tab"
                aria-selected={fanMobileSubTab === 'route'}
                aria-label="Navigation path detour planner page"
                style={{ background: fanMobileSubTab === 'route' ? 'rgba(0,229,255,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: fanMobileSubTab === 'route' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontSize: '0.7rem', padding: '8px 2px', cursor: 'pointer' }}
                onClick={() => setFanMobileSubTab('route')}
              >
                Smart Path
              </button>
              <button 
                role="tab"
                aria-selected={fanMobileSubTab === 'recycle'}
                aria-label="Green rewards scanner page"
                style={{ background: fanMobileSubTab === 'recycle' ? 'rgba(0,229,255,0.1)' : 'none', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '6px', color: fanMobileSubTab === 'recycle' ? 'var(--accent-cyan)' : 'var(--text-secondary)', fontSize: '0.7rem', padding: '8px 2px', cursor: 'pointer' }}
                onClick={() => setFanMobileSubTab('recycle')}
              >
                Eco Scan
              </button>
            </div>

            {/* Sub Tab: Concierge */}
            {fanMobileSubTab === 'concierge' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '420px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <label htmlFor="mobile-lang-select" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Select Language:</label>
                  <select 
                    id="mobile-lang-select"
                    value={selectedLanguage}
                    onChange={(e) => setSelectedLanguage(e.target.value)}
                    style={{ background: '#12182b', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', fontSize: '0.75rem' }}
                  >
                    {Object.entries(languagesMap).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>

                <div style={{ background: '#161e36', padding: '10px 14px', borderRadius: '12px 12px 12px 2px', fontSize: '0.75rem', lineHeight: '1.4', border: '1px solid var(--glass-border)' }}>
                  <span style={{ color: 'var(--accent-cyan)', fontWeight: 'bold' }}>AI Agent:</span> {languagesMap[selectedLanguage].welcome}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <label htmlFor="mobile-query-input" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>Ask Question in English:</label>
                    <button 
                      style={{ background: 'none', border: 'none', fontSize: '0.6rem', color: 'var(--accent-gold)', cursor: 'pointer' }}
                      onClick={() => setFanQuery(languagesMap[selectedLanguage].translationPrompt)}
                      aria-label="Load language test query"
                    >
                      Auto-Fill Example
                    </button>
                  </div>
                  <input 
                    id="mobile-query-input"
                    type="text" 
                    placeholder="Type question here..."
                    value={fanQuery}
                    onChange={(e) => setFanQuery(e.target.value)}
                    style={{ background: '#12182b', border: '1px solid rgba(255,255,255,0.1)', padding: '8px', borderRadius: '4px', color: 'white', fontSize: '0.75rem' }}
                  />
                  <button 
                    className="glow-btn-cyan" 
                    style={{ padding: '6px', borderRadius: '4px', fontSize: '0.75rem', marginTop: '4px' }}
                    onClick={onFanTranslate}
                    aria-label="Submit translated query"
                  >
                    Translate & Submit
                  </button>
                </div>

                {translatedText && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }} aria-live="polite">
                    <div style={{ fontStyle: 'italic', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                      {translatedText.translated}
                    </div>
                    <div style={{ background: 'rgba(0, 229, 255, 0.05)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(0,229,255,0.15)', fontSize: '0.75rem' }}>
                      <div style={{ fontWeight: 'bold', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '4px' }}>
                        <Volume2 size={12} aria-hidden="true" /> Translated Response:
                      </div>
                      <p style={{ color: 'white', lineHeight: '1.4' }}>{translatedText.response}</p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Sub Tab: Path Finder */}
            {fanMobileSubTab === 'route' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '420px', overflowY: 'auto' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="mobile-route-from" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>From Entrance:</label>
                    <select 
                      id="mobile-route-from"
                      value={routeFrom}
                      onChange={(e) => setRouteFrom(e.target.value)}
                      style={{ background: '#12182b', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', fontSize: '0.7rem' }}
                    >
                      <option>Gate 3 (South Hub)</option>
                      <option>Gate 4 (West entrance)</option>
                    </select>
                  </div>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <label htmlFor="mobile-route-to" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)' }}>To Location:</label>
                    <select 
                      id="mobile-route-to"
                      value={routeTo}
                      onChange={(e) => setRouteTo(e.target.value)}
                      style={{ background: '#12182b', color: 'white', border: '1px solid rgba(255,255,255,0.1)', padding: '6px', borderRadius: '4px', fontSize: '0.7rem' }}
                    >
                      <option>Sector 120 Seating</option>
                      <option>Sector 104 Seating</option>
                      <option>FIFA Official Merch Store</option>
                    </select>
                  </div>
                </div>

                {calculatedPath ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }} aria-live="polite">
                    <div style={{ background: '#161e36', padding: '12px', borderRadius: '8px', border: '1px solid var(--glass-border)', fontSize: '0.75rem' }}>
                      <div style={{ color: 'var(--text-secondary)', marginBottom: '6px' }}>Direct Pathway:</div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: calculatedPath.isCongested ? 'var(--accent-rose)' : 'white' }}>
                        <span>Time: {calculatedPath.congestedTimeMins} mins</span>
                        <span>Dist: {calculatedPath.distanceMeters}m</span>
                      </div>
                      {calculatedPath.isCongested && (
                        <div style={{ color: 'var(--accent-rose)', fontSize: '0.65rem', marginTop: '4px' }}>
                          ⚠️ High Ingress Bottleneck on route.
                        </div>
                      )}
                    </div>

                    {calculatedPath.isCongested && calculatedPath.alternativeRouteId && (
                      <div style={{ background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0, 230, 118, 0.25)', padding: '12px', borderRadius: '8px', fontSize: '0.75rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--accent-emerald)', fontWeight: 'bold', marginBottom: '6px' }}>
                          <Sparkles size={12} aria-hidden="true" />
                          <span>AI Smart Detour Suggestion</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', lineHeight: '1.4', marginBottom: '6px' }}>
                          {calculatedPath.aiRerouteReason}
                        </p>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--accent-emerald)' }}>
                          <span>Detour Time: 7 mins (Saves 7m!)</span>
                          <span>Detour Dist: 520m</span>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.75rem', padding: '20px' }}>
                    Route is currently clear of bottlenecks. No detour adjustments needed.
                  </div>
                )}
              </div>
            )}

            {/* Sub Tab: Eco Scan */}
            {fanMobileSubTab === 'recycle' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', height: '420px', overflowY: 'auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#161e36', padding: '8px 12px', borderRadius: '6px' }}>
                  <span style={{ fontSize: '0.75rem' }}>Wallet Balance:</span>
                  <span className="badge badge-emerald" style={{ fontWeight: 'bold' }}>{fanEcoPoints} Points</span>
                </div>

                <div style={{ background: '#050810', borderRadius: '8px', border: '2px dashed var(--accent-cyan)', height: '180px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }} aria-label="Camera scanner view">
                  {isScanning ? (
                    <>
                      <div style={{ position: 'absolute', left: 0, width: '100%', height: '4px', background: 'var(--accent-cyan)', boxShadow: '0 0 10px var(--accent-cyan)', animation: 'scanner-sweep 2s linear infinite' }} />
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px', color: 'var(--accent-cyan)', zIndex: 2 }}>
                        <RefreshCw size={24} className="animate-spin" aria-hidden="true" />
                        <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Vision Classifier Active...</span>
                      </div>
                    </>
                  ) : scannedItem ? (
                    <>
                      <div style={{ position: 'absolute', border: '2px solid var(--accent-emerald)', top: '15%', left: '20%', right: '20%', bottom: '15%', zIndex: 1, boxShadow: '0 0 15px rgba(0, 230, 118, 0.3)' }} aria-label="Target Bounding Box" />
                      <div style={{ position: 'absolute', top: '18px', left: '25%', background: 'var(--accent-emerald)', color: 'black', fontSize: '0.55rem', fontWeight: 'bold', padding: '2px 6px', zIndex: 2 }}>
                        {scannedItem.name} : 94.2% Conf
                      </div>
                      <img src={scannedItem.imageUrl} alt={scannedItem.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.4 }} />
                    </>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.75rem', zIndex: 2 }}>
                      <Compass size={32} aria-hidden="true" />
                      <span>Choose a waste item to scan below</span>
                    </div>
                  )}
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'space-between' }}>
                  {renderedWaste}
                </div>

                {scannedItem && (
                  <div style={{ background: 'rgba(0, 230, 118, 0.05)', border: '1px solid rgba(0,230, 118, 0.25)', padding: '10px', borderRadius: '8px', fontSize: '0.75rem' }} aria-live="polite">
                    <div style={{ fontWeight: 'bold', color: 'var(--accent-emerald)' }}>Scan Match: {scannedItem.type}</div>
                    <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: '4px 0 8px', lineHeight: '1.3' }}>
                      {scannedItem.sop}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--accent-cyan)' }}>Carbon Saved: {scannedItem.carbonSavedGrams}g CO2</span>
                      <button 
                        className="glow-btn-cyan" 
                        style={{ padding: '4px 10px', borderRadius: '4px', fontSize: '0.65rem', borderColor: 'var(--accent-emerald)', color: 'var(--accent-emerald)' }}
                        onClick={onClaimEcoPoints}
                        aria-label="Claim scanning points rewards"
                      >
                        Claim Points
                      </button>
                    </div>
                  </div>
                )}

                {ecoSuccessMsg && (
                  <div style={{ background: 'rgba(0, 230, 118, 0.1)', color: 'var(--accent-emerald)', padding: '8px', borderRadius: '6px', fontSize: '0.7rem', textAlign: 'center', fontWeight: 'bold' }} role="status">
                    {ecoSuccessMsg}
                  </div>
                )}
              </div>
            )}

            <div style={{ flexGrow: 1 }} />

            {/* Mobile bottom nav elements */}
            <div className="mobile-nav-bottom">
              <button 
                className={`mobile-nav-btn ${fanMobileSubTab === 'concierge' ? 'active' : ''}`} 
                onClick={() => setFanMobileSubTab('concierge')}
                aria-label="AI concierge tab"
              >
                <Languages size={14} aria-hidden="true" />
                <span>Concierge</span>
              </button>
              <button 
                className={`mobile-nav-btn ${fanMobileSubTab === 'route' ? 'active' : ''}`} 
                onClick={() => setFanMobileSubTab('route')}
                aria-label="Detour pathfinder tab"
              >
                <Navigation size={14} aria-hidden="true" />
                <span>Pathfinder</span>
              </button>
              <button 
                className={`mobile-nav-btn ${fanMobileSubTab === 'recycle' ? 'active' : ''}`} 
                onClick={() => setFanMobileSubTab('recycle')}
                aria-label="Green rewards tab"
              >
                <Leaf size={14} aria-hidden="true" />
                <span>Green Rewards</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
