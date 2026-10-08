// Canopy Central AI Configuration
// Single source of truth for local open-weight foundation models and adapters.

export const AI_CONFIG = {
  // Primary In-Browser Engine (WebGPU)
  webllm: {
    providerId: 'webllm',
    providerName: 'WebLLM Open-Weight Engine',
    modelId: 'SmolLM2-135M-Instruct-q0f16-MLC',
    modelName: 'SmolLM2 (135M-Instruct)',
    modelType: 'open-weight',
    license: 'Apache 2.0',
    sourceUrl: 'https://huggingface.co/HuggingFaceTB/SmolLM2-135M-Instruct',
    runtime: 'WebGPU (In-Browser Execution)',
    estimatedSizeMb: 140,
    isLocal: true,
    requiresBackend: false,
    requiresApiKey: false
  },

  // Optional Local Desktop LLM (Ollama)
  ollama: {
    providerId: 'ollama',
    providerName: 'Local Ollama Desktop Engine',
    modelId: 'gemma2:9b',
    modelName: 'Google Gemma 2 (9B-IT)',
    modelType: 'open-weight',
    license: 'Gemma Open License',
    sourceUrl: 'https://ai.google.dev/gemma',
    endpoint: 'http://localhost:11434/api/generate',
    tagsEndpoint: 'http://localhost:11434/api/tags',
    runtime: 'Localhost Daemon (Port 11434)',
    estimatedSizeMb: 5400,
    isLocal: true,
    requiresBackend: true, // Requires running ollama serve locally
    requiresApiKey: false
  },

  // Lightweight Deterministic Emergency Fallback
  mlp: {
    providerId: 'mlp',
    providerName: 'Canopy On-Device Emergency Net',
    modelId: 'canopy-backcountry-mlp-v1',
    modelName: 'Canopy Neural Fallback (3-Layer Deep MLP)',
    modelType: 'open-weight',
    license: 'MIT',
    sourceUrl: 'https://github.com/shrutirai29/hacktober',
    runtime: 'WebAssembly / JavaScript CPU',
    estimatedSizeMb: 0.1,
    isLocal: true,
    requiresBackend: false,
    requiresApiKey: false
  },

  // Default challenge hierarchy: WebLLM is PRIMARY!
  defaultProvider: 'webllm',
  fallbackHierarchy: ['webllm', 'ollama', 'mlp'],

  // System safety prompt template
  systemPrompt: `You are Canopy, an offline backcountry safety assistant running locally on this device.
You operate with ZERO internet connectivity, ZERO cloud APIs, and ZERO remote surveillance.

Core Operating Directives:
1. Ground every recommendation exclusively in the provided Canopy telemetry.
2. NEVER invent or hallucinate telemetry values (temperature, elevation, risk, time, weather).
3. If a metric or checkpoint is unknown or unavailable, explicitly state that you do not have data for it.
4. Prioritize hiker life safety and Leave-No-Trace wilderness ethics above all.
5. NEVER override hard safety rules (such as turnaround cutoffs, severe risk thresholds, or whiteout hazards).
6. Canopy is an informational outdoor safety assistant, not a medical professional. Never prescribe medication.`
};
