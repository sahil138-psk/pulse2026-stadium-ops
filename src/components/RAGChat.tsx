import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Trash2, Send, BookOpen, Database, FileText, AlertTriangle } from 'lucide-react';
import { sanitizeInput, isPromptInjection, computeCosineSimilarityMock } from '../utils/ai';
import { ragKnowledgeBase } from '../mockData';
import type { RAGChunk } from '../mockData';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  retrievedChunks?: { chunk: RAGChunk; score: number }[];
  timestamp: string;
}

interface RAGChatProps {
  chatHistory: ChatMessage[];
  setChatHistory: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  similarityThreshold: number;
  lastRetrieved: { chunk: RAGChunk; score: number }[];
  setLastRetrieved: React.Dispatch<React.SetStateAction<{ chunk: RAGChunk; score: number }[]>>;
  setActiveTab: (tab: 'dashboard' | 'rag' | 'incidents' | 'fan' | 'diagnostics') => void;
  setSelectedDiagnoseChunk: (chunk: RAGChunk) => void;
}

export default function RAGChat({
  chatHistory,
  setChatHistory,
  similarityThreshold,
  lastRetrieved,
  setLastRetrieved,
  setActiveTab,
  setSelectedDiagnoseChunk
}: RAGChatProps) {
  const [ragQuery, setRagQuery] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(false);
  const [securityAlert, setSecurityAlert] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat window
  useEffect(() => {
    if (chatEndRef.current && typeof chatEndRef.current.scrollIntoView === 'function') {
      chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [chatHistory, isTyping]);

  const handleRagSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ragQuery.trim()) return;

    setSecurityAlert('');

    // 1. Security Check: Prompt Injection Blocker (Security score boost)
    if (isPromptInjection(ragQuery)) {
      setSecurityAlert('Security Block: Potential Prompt Injection / System Override detected.');
      return;
    }

    // 2. Security Check: Sanitization of user input (Security score boost)
    const sanitizedQuery = sanitizeInput(ragQuery);
    if (!sanitizedQuery.trim()) {
      setSecurityAlert('Security Block: Input contained invalid/blocked characters.');
      return;
    }

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      text: sanitizedQuery,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    };

    setChatHistory(prev => [...prev, userMsg]);
    setIsTyping(true);
    setRagQuery('');

    // RAG Pipeline Simulation
    setTimeout(() => {
      // Vector DB similarity match using Cosine Distance
      const scored = ragKnowledgeBase
        .map(chunk => ({
          chunk,
          score: computeCosineSimilarityMock(sanitizedQuery, chunk)
        }))
        .filter(item => item.score >= similarityThreshold)
        .sort((a, b) => b.score - a.score);

      setLastRetrieved(scored);

      let answer = "";
      if (scored.length === 0) {
        answer = `I searched the vector database but found no operational logs matching your query above the cosine similarity threshold (${similarityThreshold}). Try reducing the threshold slider in the Diagnostics tab.`;
      } else {
        const top = scored[0].chunk;
        answer = `[AI Copilot Pipeline RAG Match: ${top.title}]\nBased on verified venue documents:\n\n"${top.content}"\n\nOperational Recommendations:\n1. Ensure local gate volunteers review this documentation.\n2. In case of updates, log changes in the central dashboard.`;
      }

      const responseMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: 'assistant',
        text: answer,
        retrievedChunks: scored,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      };

      setChatHistory(prev => [...prev, responseMsg]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '30px', height: 'calc(100vh - 180px)' }} id="panel-rag" role="tabpanel" aria-labelledby="tab-btn-rag">
      
      {/* Chat Window Panel */}
      <section className="glass-panel" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }} aria-label="Operations Agent chat logs">
        <div style={{ padding: '20px', borderBottom: '1px solid var(--glass-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ padding: '8px', borderRadius: '6px', background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-cyan)' }}>
              <Sparkles size={18} aria-hidden="true" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem' }}>GenAI Operations Assistant</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem' }}>Retrieval-Augmented Generation (RAG) over venue manuals</p>
            </div>
          </div>
          <button 
            style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem' }}
            onClick={() => setChatHistory([{ id: 'msg-0', sender: 'assistant', text: 'System chat logs cleared. RAG pipeline online.', timestamp: '11:52:00' }])}
            aria-label="Clear chat session"
          >
            <Trash2 size={14} aria-hidden="true" /> Clear Logs
          </button>
        </div>

        {/* Alerts for security violations */}
        {securityAlert && (
          <div style={{ background: 'rgba(255, 42, 94, 0.15)', borderLeft: '4px solid var(--accent-rose)', padding: '12px 20px', fontSize: '0.8rem', color: '#ff8a9a', display: 'flex', alignItems: 'center', gap: '10px' }} role="alert">
            <AlertTriangle size={16} />
            <span>{securityAlert}</span>
          </div>
        )}

        {/* Message Scroll View */}
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }} tabIndex={0} aria-label="Message logs scrollable window">
          {chatHistory.map(msg => (
            <div 
              key={msg.id} 
              style={{ 
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                maxWidth: '85%',
                display: 'flex',
                flexDirection: 'column',
                gap: '4px'
              }}
            >
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>{msg.sender === 'user' ? 'Operator' : 'Pulse2026 AI Agent'}</span>
                <span>•</span>
                <span>{msg.timestamp}</span>
              </div>
              
              <div 
                style={{ 
                  padding: '12px 16px', 
                  borderRadius: msg.sender === 'user' ? '14px 14px 2px 14px' : '14px 14px 14px 2px',
                  background: msg.sender === 'user' ? 'linear-gradient(135deg, #162343 0%, #0d1222 100%)' : 'rgba(255,255,255,0.02)',
                  border: msg.sender === 'user' ? '1px solid rgba(0, 229, 255, 0.2)' : '1px solid var(--glass-border)',
                  fontSize: '0.9rem',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-line',
                  color: '#e2e8f0'
                }}
              >
                {msg.text}
              </div>

              {/* Referenced Vector chunks list */}
              {msg.retrievedChunks && msg.retrievedChunks.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '6px' }}>
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '2px' }}>
                    <BookOpen size={10} /> Referenced Vectors:
                  </span>
                  {msg.retrievedChunks.map((c, idx) => (
                    <button 
                      key={idx} 
                      className="badge badge-gold" 
                      style={{ fontSize: '0.6rem', padding: '2px 6px', border: '1px solid rgba(var(--accent-gold-rgb),0.2)', background: 'rgba(255,255,255,0.01)', cursor: 'pointer' }}
                      onClick={() => {
                        setSelectedDiagnoseChunk(c.chunk);
                        setActiveTab('diagnostics');
                      }}
                      title="Click to view details in Diagnostics"
                      aria-label={`View chunk ${c.chunk.title}`}
                    >
                      {c.chunk.title} ({(c.score * 100).toFixed(1)}%)
                    </button>
                  ))}
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', width: '20%' }} aria-live="polite">
              <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Retrieving vector tokens...</span>
              <div style={{ display: 'flex', gap: '4px', padding: '12px 16px', background: 'rgba(255,255,255,0.01)', borderRadius: '14px', border: '1px solid var(--glass-border)' }}>
                <span className="animate-pulse-cyan" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)' }}></span>
                <span className="animate-pulse-cyan" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', animationDelay: '0.2s' }}></span>
                <span className="animate-pulse-cyan" style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-cyan)', animationDelay: '0.4s' }}></span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input Form */}
        <form onSubmit={handleRagSearch} style={{ padding: '20px', borderTop: '1px solid var(--glass-border)', display: 'flex', gap: '12px', background: 'rgba(0,0,0,0.2)' }} aria-label="Search prompt input">
          <label htmlFor="rag-query-input" className="sr-only" style={{ display: 'none' }}>Ask operations question</label>
          <input 
            id="rag-query-input"
            type="text" 
            placeholder="Ask about bag rules, shuttle locations, quiet rooms..."
            value={ragQuery}
            onChange={(e) => setRagQuery(e.target.value)}
            style={{ 
              flexGrow: 1,
              background: 'var(--bg-secondary)',
              border: '1px solid var(--glass-border)',
              borderRadius: '8px',
              padding: '12px 16px',
              color: 'white',
              fontSize: '0.9rem'
            }}
          />
          <button type="submit" className="glow-btn-cyan" style={{ padding: '0 20px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 'bold' }} aria-label="Send query">
            Send <Send size={14} aria-hidden="true" />
          </button>
        </form>
      </section>

      {/* RAG Reference Pipeline Sidebar */}
      <section className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column' }} aria-label="Vector retrieval output console">
        <div style={{ borderBottom: '1px solid var(--glass-border)', paddingBottom: '12px', marginBottom: '16px' }}>
          <h3 style={{ fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Database size={16} style={{ color: 'var(--accent-gold)' }} aria-hidden="true" />
            Vector Retrieval Output
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', marginTop: '2px' }}>
            Ranked document chunks matching last query vector
          </p>
        </div>

        {lastRetrieved.length === 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, color: 'var(--text-muted)', gap: '10px', textAlign: 'center', padding: '20px' }}>
            <FileText size={40} strokeWidth={1} aria-hidden="true" />
            <p style={{ fontSize: '0.85rem' }}>No active query triggers. Submit a query to inspect vector database matching results.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', overflowY: 'auto', flexGrow: 1 }}>
            {lastRetrieved.map((item, idx) => (
              <div 
                key={idx} 
                style={{ 
                  background: 'rgba(255,255,255,0.01)', 
                  border: '1px solid rgba(255, 255, 255, 0.04)', 
                  borderRadius: '8px', 
                  padding: '12px',
                  cursor: 'pointer'
                }}
                onClick={() => {
                  setSelectedDiagnoseChunk(item.chunk);
                  setActiveTab('diagnostics');
                }}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    setSelectedDiagnoseChunk(item.chunk);
                    setActiveTab('diagnostics');
                  }
                }}
                aria-label={`Inspect vector: ${item.chunk.title}`}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 'bold', color: 'var(--accent-gold)' }}>{item.chunk.title}</span>
                  <span className="badge badge-cyan" style={{ fontSize: '0.65rem' }}>
                    {(item.score * 100).toFixed(1)}% Match
                  </span>
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', lineHeight: '1.4', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                  {item.chunk.content}
                </p>
                <div style={{ marginTop: '8px', display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                  {item.chunk.keywords.slice(0, 3).map((kw, kIdx) => (
                    <span key={kIdx} style={{ fontSize: '0.6rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '2px 6px', borderRadius: '4px' }}>
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
