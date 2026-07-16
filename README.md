# 🏟️ Pulse2026: GenAI Stadium Operations & Fan Experience Platform

Pulse2026 is a premium, real-time stadium operations and fan experience platform designed for the **FIFA World Cup 2026**. The platform utilizes simulated Generative AI, RAG (Retrieval-Augmented Generation), Zero-Shot Classification, and LSTM time-series forecasting to optimize venue logistics, route crowds, respond to incidents, and assist fans.

---

## 🗺️ System Architecture Diagram

This diagram visualizes how raw inputs flow through our AI engines, get augmented by the LLM layer, and trigger operational outcomes:

```mermaid
graph TD
    %% Define Styles
    classDef client fill:#0f172a,stroke:#00e5ff,stroke-width:2px,color:#fff;
    classDef logic fill:#0f172a,stroke:#e2b744,stroke-width:2px,color:#fff;
    classDef model fill:#0f172a,stroke:#ff2a5e,stroke-width:2px,color:#fff;
    classDef output fill:#0f172a,stroke:#00e676,stroke-width:2px,color:#fff;

    %% Data Inputs
    subgraph INPUTS ["Data Sources (Real-time Input)"]
        A["Stadium Gate Turnstiles"]:::client
        B["Staff Incident Descriptions"]:::client
        C["Fan Concierge Queries"]:::client
        D["Eco Recycling Camera (Vision)"]:::client
    end

    %% Processing Layer
    subgraph LOGIC ["AI Core & Processing Engines"]
        E["LSTM Neural Network (Queue Predictor)"]:::logic
        F["Vector Similarity DB (Cosine Proximity Matcher)"]:::logic
        G["Zero-Shot NLP Text Classifier"]:::logic
        H["Dijkstra Congestion-Aware Router"]:::logic
    end

    %% AI Models
    subgraph MODELS ["Generative AI Layer"]
        I["RAG Document Augmentor"]:::model
        J["Large Language Model (LLM Agent)"]:::model
        K["SOP Dispatch Template Engine"]:::model
    end

    %% Project UI Output
    subgraph OUTPUTS ["Visual Output & Action Consoles"]
        L["Live Dashboard Ingress Heatmaps"]:::output
        M["RAG Operations Chat Copilot"]:::output
        N["SOP Volunteer Dispatch SMS"]:::output
        O["Mobile Translation & Pathfinder Detours"]:::output
        P["Digital Wallet Green Rewards (+Points)"]:::output
    end

    %% Flows
    A --> E
    E --> L
    
    B --> G
    G --> K
    K --> N
    
    C --> F
    F --> I
    I --> J
    J --> M
    
    D --> G
    G --> P
    
    A & H --> O
```

---

## ⚡ Core AI Workflows

### 1. Retrieval-Augmented Generation (RAG) Chat Pipeline
How the Operations Copilot answers query questions using semantic context vector indexing:

```mermaid
sequenceDiagram
    autonumber
    actor Operator as Command Center Operator
    participant UI as RAG Chat UI
    participant VDB as Vector Database (mockData.ts)
    participant Model as LLM Context Augmentor
    participant Agent as GenAI Copilot

    Operator->>UI: Types query (e.g. "What is the clear bag policy?")
    UI->>VDB: Run NLP tokenization & compute Cosine Proximity
    Note over VDB: Compares query tokens against<br/>indexed document chunks
    VDB-->>UI: Return matched document context (e.g. Bag Policy, 91.0% Score)
    UI->>Model: Pack context + system instructions + temperature settings
    Model->>Agent: Prompt: "Answer using this context: [Clear bag rules...]"
    Agent-->>UI: Generate detailed checklist response (typewriter effect)
    UI-->>Operator: Displays action checklist
```

---

### 2. Zero-Shot Incident Routing & Dispatch Pipeline
How the Safety Log automatically routes medical, facilities, or security reports to the correct SOP responder:

```mermaid
flowchart LR
    A[Staff Reports Incident Text] --> B{NLP Classifier Engine}
    B -- "Keywords: pain, chest" --> C[Medical Emergency]
    B -- "Keywords: leak, spill" --> D[Facilities Slip Hazard]
    B -- "Keywords: fight, altercation" --> E[Security Threat]
    
    C --> F[Select RED Team Medical SOP]
    D --> G[Select YELLOW Team Sanitation SOP]
    E --> H[Select BLACK Team Guard SOP]
    
    F & G & H --> I[Interpolate dispatch variables]
    I --> J[Pre-fill SMS message template]
    J --> K[Log active INCIDENT & Deploy dispatch]
```

---

## 💎 Features Included

1. **Operations Command Dashboard**:
   - **Spatial Heatmap**: Neon interactive representation of gate ingress nodes.
   - **LSTM Time-Series Forecasts**: Live line graphs predicting wait times 15, 30, and 60 minutes out.
2. **GenAI Operations Command Copilot**:
   - Full RAG chat module detailing similarity indices, vector search metadata, and temperature parameters.
3. **Zero-Shot Incident Dispatcher**:
   - Natural language classification that selects standard operating procedures and formats dispatch alerts.
4. **Mobile Fan Portal Simulator**:
   - **Multilingual Assistant**: Translation into Spanish, Arabic, Portuguese, and French.
   - **Congestion Pathfinder**: Smart routing detours to guide visitors around bottlenecks.
   - **Eco Scan Bounding Boxes**: Simulated Computer Vision that identifies recycling materials and awards points.
5. **AI Diagnostics Engine**:
   - Interactive 2D Vector Space coordinate plotter.
   - Prompt engineering and neural network model tuners.

---

## 🛠️ Technology Stack
* **Framework**: React 19, TypeScript, Vite 8 (relative assets base paths)
* **Styling**: Premium Custom Vanilla CSS (Glassmorphism, custom CSS variables, keyframe animations)
* **Icons**: Lucide React
* **Deployment**: GitHub Pages (Legacy build-branch strategy)

---

## 🚀 Running Locally

1. Install package dependencies:
   ```bash
   npm install
   ```
2. Run development server:
   ```bash
   npm run dev
   ```
3. Build production assets:
   ```bash
   npm run build
   ```
