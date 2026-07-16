import React from 'react';
import { 
  Activity, Database, Shield, Compass, Cpu, User, Sparkles
} from 'lucide-react';

interface LayoutProps {
  activeTab: 'dashboard' | 'rag' | 'incidents' | 'fan' | 'diagnostics';
  setActiveTab: (tab: 'dashboard' | 'rag' | 'incidents' | 'fan' | 'diagnostics') => void;
  liveAlerts: string[];
  children: React.ReactNode;
}

export default function Layout({ activeTab, setActiveTab, liveAlerts, children }: LayoutProps) {
  const navItems = [
    { id: 'dashboard', label: 'Operations Dashboard', icon: <Activity size={18} /> },
    { id: 'rag', label: 'RAG Command Copilot', icon: <Database size={18} /> },
    { id: 'incidents', label: 'Incident Classifier', icon: <Shield size={18} /> },
    { id: 'fan', label: 'Fan Mobile Portal', icon: <Compass size={18} /> },
    { id: 'diagnostics', label: 'AI Engine Diagnostics', icon: <Cpu size={18} /> }
  ] as const;

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <aside className="sidebar" role="complementary" aria-label="Main sidebar navigation">
        <div className="sidebar-header">
          <div className="logo-icon" aria-hidden="true">★</div>
          <div className="logo-text">
            <h1>Pulse2026</h1>
            <p>Stadium Operations AI</p>
          </div>
        </div>

        <nav className="sidebar-nav" role="navigation" aria-label="Subsystem Selector">
          <div role="tablist" aria-label="System Views">
            {navItems.map((item) => (
              <button 
                key={item.id} 
                id={`tab-btn-${item.id}`}
                role="tab"
                aria-selected={activeTab === item.id}
                aria-controls={`panel-${item.id}`}
                aria-label={`Switch to ${item.label} view`}
                tabIndex={0}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                style={{ width: '100%', border: 'none', background: 'none', textAlign: 'left' }}
                onClick={() => setActiveTab(item.id)}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </nav>

        <div className="sidebar-footer">
          <div>Workspace: challenge 4</div>
          <div>Status: <span style={{ color: '#00e676', fontWeight: 'bold' }}>ONLINE</span></div>
          <div>AI Acc: <span style={{ color: '#00e5ff', fontWeight: 'bold' }}>97.4%</span></div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="main-content" role="main" id="main-content-area">
        <header className="top-nav" role="banner">
          <div className="marquee-container" aria-live="polite" aria-label="Scrolling System Alerts">
            <div className="marquee-label">Live AI Alerts</div>
            <div className="marquee-text-wrapper">
              {liveAlerts.concat(liveAlerts).map((alert, idx) => (
                <div key={idx} className="marquee-item">
                  <span aria-hidden="true"></span> {alert}
                </div>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <span className="badge badge-gold">
              <Sparkles size={12} aria-hidden="true" />
              FIFA World Cup 2026
            </span>
            <div 
              style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-tertiary)', border: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              aria-label="User Account"
            >
              <User size={18} className="glow-text-cyan" aria-hidden="true" />
            </div>
          </div>
        </header>

        <div className="page-wrapper">
          {children}
        </div>
      </main>
    </div>
  );
}
