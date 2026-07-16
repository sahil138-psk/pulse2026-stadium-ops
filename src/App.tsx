import { useState, useEffect, useCallback, useMemo } from 'react';
import Layout from './components/Layout';
import Dashboard from './components/Dashboard';
import RAGChat from './components/RAGChat';
import IncidentClassifier from './components/IncidentClassifier';
import FanPortal from './components/FanPortal';
import Diagnostics from './components/Diagnostics';

import { 
  ragKnowledgeBase, 
  queuePredictions, 
  wasteCatalog, 
  routePaths
} from './mockData';

import type { RAGChunk, QueuePrediction, IncidentRecord, WasteItem } from './mockData';

// Custom Chat interface type definition
interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  retrievedChunks?: { chunk: RAGChunk; score: number }[];
  timestamp: string;
}

export default function App() {
  // Navigation Tabs state routing
  const [activeTab, setActiveTab] = useState<'dashboard' | 'rag' | 'incidents' | 'fan' | 'diagnostics'>('dashboard');

  // Scrolling news tickers alerts (static array, memoized)
  const liveAlerts = useMemo(() => [
    "AI Prediction: Gate 3 bottleneck starting in 12m. Dispatching overflow volunteer staff.",
    "Eco Alert: Level 2 concourse plastic recycling rate up 34% this hour.",
    "Operational support active: Multilingual LLM Agents translating 18 active languages.",
    "Transit Alert: Metro shuttle arrival frequency adjusted to 3 minutes due to incoming egress crowd wave."
  ], []);

  // AI Parameters tunable globally
  const [temperature, setTemperature] = useState<number>(0.3);
  const [similarityThreshold, setSimilarityThreshold] = useState<number>(0.6);
  const [systemPrompt, setSystemPrompt] = useState<string>(
    "You are the Pulse2026 Operations Copilot, an advanced RAG-driven AI helper for the FIFA World Cup 2026 stadium operators. Use only the retrieved context to answer operations, crowd control, transit, and security queries. Be direct, authoritative, and output actionable operations checklists."
  );

  // --- 1. Dashboard states ---
  const [selectedGate, setSelectedGate] = useState<QueuePrediction>(queuePredictions[2]); // Default Gate 3
  const [metricSummary, setMetricSummary] = useState({
    crowdCount: 68420,
    activeIncidents: 2,
    carbonOffsetKg: 342.8,
    aiModelAccuracy: 97.4
  });

  // Simulator tick updates for statistics
  useEffect(() => {
    const interval = setInterval(() => {
      setMetricSummary(prev => ({
        ...prev,
        crowdCount: Math.min(80000, Math.max(68000, prev.crowdCount + Math.floor(Math.random() * 21) - 10)),
        carbonOffsetKg: parseFloat((prev.carbonOffsetKg + 0.15).toFixed(1))
      }));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // --- 2. RAG Chat states ---
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    {
      id: 'msg-0',
      sender: 'assistant',
      text: 'System Initialized. Pulse2026 GenAI Copilot is online. Ask me about stadium policies, emergency exits, bag scanning rules, shuttle locations, or ticketing kiosks.',
      timestamp: '11:52:00'
    }
  ]);
  const [lastRetrieved, setLastRetrieved] = useState<{ chunk: RAGChunk; score: number }[]>([]);

  // --- 3. Incidents states ---
  const [incidentText, setIncidentText] = useState<string>('');
  const [classifiedData, setClassifiedData] = useState<{
    category: string;
    severity: 'Low' | 'Medium' | 'High';
    sop: string[];
    dispatchText: string;
    confidence: number;
  } | null>(null);

  const [activeIncidents, setActiveIncidents] = useState<IncidentRecord[]>([
    {
      id: 'INC-1024',
      description: 'Water leak and puddle forming on Floor 2, concourse section 212.',
      category: 'Facilities Spill / Slip Hazard',
      severity: 'Medium',
      confidence: 0.94,
      dispatcher: 'Sanitation & Safety Crew (Yellow Team)',
      status: 'Dispatched',
      timestamp: '11:42:00'
    },
    {
      id: 'INC-1025',
      description: 'Fan reporting severe chest pressure and dizziness near row 14, Sector 104.',
      category: 'Medical Emergency',
      severity: 'High',
      confidence: 0.98,
      dispatcher: 'Medical Response Unit (Red Team)',
      status: 'Dispatched',
      timestamp: '11:48:00'
    }
  ]);

  const onResolveIncident = useCallback((id: string) => {
    setActiveIncidents(prev => prev.map(inc => inc.id === id ? { ...inc, status: 'Resolved' } : inc));
  }, []);

  const onLaunchDispatchFromDashboard = useCallback((desc: string) => {
    setActiveTab('incidents');
    setIncidentText(desc);
  }, []);

  // --- 4. Fan Simulator states ---
  const [fanMobileSubTab, setFanMobileSubTab] = useState<'concierge' | 'route' | 'recycle'>('concierge');
  
  // Mobile translator states
  const [fanQuery, setFanQuery] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('es');
  const [translatedText, setTranslatedText] = useState<{ original: string; translated: string; response: string } | null>(null);

  const languagesMap = useMemo(() => ({
    'es': {
      label: 'Español (Spanish)',
      welcome: '¿Cómo puedo ayudarte en el estadio hoy?',
      translationPrompt: 'Where is the nearest medical aid station?',
      aiResponse: 'La estación de ayuda médica más cercana está en el Sector 104, en el pasillo principal.'
    },
    'ar': {
      label: 'العربية (Arabic)',
      welcome: 'كيف يمكنني مساعدتك في الملعب اليوم؟',
      translationPrompt: 'Where is gate 1 located?',
      aiResponse: 'يقع البوابة 1 في الجانب الشمالي من الملعب، بالقرب من محطة المترو.'
    },
    'pt': {
      label: 'Português (Portuguese)',
      welcome: 'Como posso ajudar você no estádio hoje?',
      translationPrompt: 'Do you accept clear bags?',
      aiResponse: 'Sim, aceitamos apenas bolsas transparentes menores que 12x6x12 polegadas.'
    },
    'fr': {
      label: 'Français (French)',
      welcome: 'Comment puis-je vous aider au stade aujourd\'hui?',
      translationPrompt: 'Is there a quiet room?',
      aiResponse: 'Oui, une salle sensorielle calme est située au niveau des suites 2, salle 24A.'
    }
  }), []);

  const onFanTranslate = useCallback(() => {
    if (!fanQuery.trim()) return;
    const lang = languagesMap[selectedLanguage as keyof typeof languagesMap];
    setTranslatedText({
      original: fanQuery,
      translated: `[AI Translate to ${lang.label.split(' ')[0]}]: "${fanQuery}" matches translation vectors.`,
      response: lang.aiResponse
    });
    setFanQuery('');
  }, [fanQuery, selectedLanguage, languagesMap]);

  // Mobile path finder routing
  const [routeFrom, setRouteFrom] = useState<string>('Gate 3 (South Hub)');
  const [routeTo, setRouteTo] = useState<string>('Sector 120 Seating');

  const calculatedPath = useMemo(() => {
    const found = routePaths.find(p => p.from === routeFrom && p.to === routeTo);
    return found || null;
  }, [routeFrom, routeTo]);

  // Mobile recycling states
  const [scannedItem, setScannedItem] = useState<WasteItem | null>(null);
  const [fanEcoPoints, setFanEcoPoints] = useState<number>(150);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [ecoSuccessMsg, setEcoSuccessMsg] = useState<string>('');

  const onScanItem = useCallback((item: WasteItem) => {
    setIsScanning(true);
    setScannedItem(null);
    setEcoSuccessMsg('');

    setTimeout(() => {
      setScannedItem(item);
      setIsScanning(false);
    }, 1500);
  }, []);

  const onClaimEcoPoints = useCallback(() => {
    if (!scannedItem) return;
    setFanEcoPoints(prev => prev + scannedItem.points);
    setEcoSuccessMsg(`Successfully claimed +${scannedItem.points} Eco-Points! Check your digital Wallet.`);
    setScannedItem(null);
  }, [scannedItem]);

  // --- 5. Diagnostics states ---
  const [selectedDiagnoseChunk, setSelectedDiagnoseChunk] = useState<RAGChunk>(ragKnowledgeBase[0]);

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab} liveAlerts={liveAlerts}>
      {activeTab === 'dashboard' && (
        <Dashboard 
          metricSummary={metricSummary}
          activeIncidents={activeIncidents}
          selectedGate={selectedGate}
          setSelectedGate={setSelectedGate}
          queuePredictions={queuePredictions}
          onLaunchDispatch={onLaunchDispatchFromDashboard}
        />
      )}

      {activeTab === 'rag' && (
        <RAGChat 
          chatHistory={chatHistory}
          setChatHistory={setChatHistory}
          similarityThreshold={similarityThreshold}
          lastRetrieved={lastRetrieved}
          setLastRetrieved={setLastRetrieved}
          setActiveTab={setActiveTab}
          setSelectedDiagnoseChunk={setSelectedDiagnoseChunk}
        />
      )}

      {activeTab === 'incidents' && (
        <IncidentClassifier 
          incidentText={incidentText}
          setIncidentText={setIncidentText}
          classifiedData={classifiedData}
          setClassifiedData={setClassifiedData}
          activeIncidents={activeIncidents}
          setActiveIncidents={setActiveIncidents}
          onResolveIncident={onResolveIncident}
        />
      )}

      {activeTab === 'fan' && (
        <FanPortal 
          fanMobileSubTab={fanMobileSubTab}
          setFanMobileSubTab={setFanMobileSubTab}
          fanQuery={fanQuery}
          setFanQuery={setFanQuery}
          selectedLanguage={selectedLanguage}
          setSelectedLanguage={setSelectedLanguage}
          translatedText={translatedText}
          onFanTranslate={onFanTranslate}
          languagesMap={languagesMap}
          routeFrom={routeFrom}
          setRouteFrom={setRouteFrom}
          routeTo={routeTo}
          setRouteTo={setRouteTo}
          calculatedPath={calculatedPath}
          scannedItem={scannedItem}
          fanEcoPoints={fanEcoPoints}
          isScanning={isScanning}
          onScanItem={onScanItem}
          onClaimEcoPoints={onClaimEcoPoints}
          ecoSuccessMsg={ecoSuccessMsg}
          wasteCatalog={wasteCatalog}
        />
      )}

      {activeTab === 'diagnostics' && (
        <Diagnostics 
          temperature={temperature}
          setTemperature={setTemperature}
          similarityThreshold={similarityThreshold}
          setSimilarityThreshold={setSimilarityThreshold}
          systemPrompt={systemPrompt}
          setSystemPrompt={setSystemPrompt}
          selectedDiagnoseChunk={selectedDiagnoseChunk}
          setSelectedDiagnoseChunk={setSelectedDiagnoseChunk}
          ragKnowledgeBase={ragKnowledgeBase}
        />
      )}
    </Layout>
  );
}
