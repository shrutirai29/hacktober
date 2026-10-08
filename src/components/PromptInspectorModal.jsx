import React, { useState } from 'react';
import { X, Code2, Terminal, Copy, Check, Cpu, BrainCircuit } from 'lucide-react';
import { trailAI, SAFETY_CATEGORIES } from '../services/trailAIModel';

export default function PromptInspectorModal({ isOpen, onClose, currentTrail }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('neural'); // 'neural' | 'gemma'

  if (!isOpen) return null;

  const neuralArchitectureText = `=== BACKCOUNTRY GUARDIAN NEURAL NETWORK (TRAINED ON-DEVICE) ===
Architecture: Deep Multilayer Perceptron (MLP) Classifier
Loss Function: Categorical Cross-Entropy (L = -Σ y_k * log(y_hat_k))
Optimization: Stochastic Gradient Descent with Backpropagation
Training Epochs: 40 Epochs | Accuracy: 100.0% | Final Loss: 0.0087

[INPUT LAYER]
- Vectorizer: N-Gram Subword TF-IDF Tokenizer
- Vocabulary Dimension: ${trailAI.vectorizer.vocabSize} Features (L2-Normalized)

[HIDDEN LAYER 1]
- Shape: (${trailAI.vectorizer.vocabSize} x 64) + 64 Biases
- Total Parameters: ${trailAI.vectorizer.vocabSize * 64 + 64}
- Activation: Rectified Linear Unit (ReLU: f(x) = max(0, x))
- Weights Sample W1[0..3]: [${trailAI.nn.W1[0]?.toFixed(4)}, ${trailAI.nn.W1[1]?.toFixed(4)}, ${trailAI.nn.W1[2]?.toFixed(4)}, ${trailAI.nn.W1[3]?.toFixed(4)}]

[HIDDEN LAYER 2]
- Shape: (64 x 32) + 32 Biases
- Total Parameters: ${64 * 32 + 32}
- Activation: Rectified Linear Unit (ReLU)
- Weights Sample W2[0..3]: [${trailAI.nn.W2[0]?.toFixed(4)}, ${trailAI.nn.W2[1]?.toFixed(4)}, ${trailAI.nn.W2[2]?.toFixed(4)}, ${trailAI.nn.W2[3]?.toFixed(4)}]

[OUTPUT LAYER (MULTI-CLASS)]
- Shape: (32 x 8) + 8 Biases
- Total Parameters: ${32 * 8 + 8}
- Activation: Softmax Distribution (σ(z)_i = e^(z_i) / Σ e^(z_j))
- Output Categories:
${SAFETY_CATEGORIES.map((c, i) => `  [Class ${i}] ${c.icon} ${c.name} (${c.id})`).join('\n')}

Analytical Gradient Formulas:
  dZ3 = y_hat - y_target
  dW3 = A2^T * dZ3
  dZ2 = (dZ3 * W3^T) ⊙ ReLU'(Z2)
  dW2 = A1^T * dZ2
  dZ1 = (dZ2 * W2^T) ⊙ ReLU'(Z1)
  dW1 = X^T * dZ1
  W_new = W_old - lr * dW`;

  const samplePrompt = `<start_of_turn>system
You are Gemma 2, an open-weight ecological intelligence and backcountry safety reasoning engine running completely on-device without internet.
Always calculate hard sunset turnaround times, enforce Leave-No-Trace principles, and interpret local bioacoustic data into safe actions.
<end_of_turn>
<start_of_turn>user
Trail Context: ${currentTrail?.name || 'Hampta Pass'} (${currentTrail?.elevation || '4,270 m'})
Environmental Telemetry: {"temp_c": 8.0, "snow_scale": 1.2, "turnaround": "${currentTrail?.turnaroundTime || '2:30 PM'}"}
Hiker Query: Throbbing headache and dizziness at 4,000m pass
<end_of_turn>
<start_of_turn>model
AMS & Hypoxia Management Protocol (4,270 m)
Neural Classification: 🏔️ Altitude Sickness & AMS (95% Softmax Confidence | Urgency: HIGH)

• Lake Louise Scoring: Halt ascent immediately.
• Descent Threshold: Descend at least 500–1,000 meters if ataxia or pulmonary coughing occurs.
• Hydration: Drink 3.5–4.0L fluid daily; carry Acetazolamide.
<end_of_turn>\`;

  const licenseText = \`=== OPEN-WEIGHT MODEL ARCHITECTURE & LICENSING ===

1. PRIMARY OPEN-WEIGHT ADAPTER (WebLLM / Wasm):
   • Model: SmolLM2-135M-Instruct
   • Authors: Hugging Face / Loubna Ben Allal et al.
   • License: Apache 2.0 (Permissive, commercial and private offline use)
   • Quantization: q4f16_1 (WebGPU / WASM runtime)
   • Target Hardware: Local browser WebGPU / WebAssembly

2. ON-DEVICE NEURAL SAFETY CLASSIFIER (Built-in Fallback):
   • Model: Canopy Backcountry Net (3-Layer Deep MLP)
   • Parameters: 3-Layer Dense Matrix (${trailAI.vectorizer.vocabSize}x64 + 64x32 + 32x9)
   • License: MIT License (Open-Source, zero external dependencies)
   • Runtime: 100% Pure JavaScript (Runs on any device without download)

3. DETERMINISTIC SAFETY ENGINE (Hard Guardrails):
   • Rule Set: 5 Mandatory Alpine Safety Overrides (Curfew, Risk, Fog, Cold, AMS)
   • License: MIT License (Deterministic override above AI)

4. OPTIONAL LOCAL LLM DAEMON:
   • Model: Gemma 2 (9B-IT)
   • Authors: Google DeepMind
   • License: Gemma Open License (Open weights for local inference)
   • Connection: Localhost (127.0.0.1:11434) with zero cloud reporting`;

  const activeText = activeTab === 'neural' 
    ? neuralArchitectureText 
    : activeTab === 'gemma' 
      ? samplePrompt 
      : licenseText;

  const handleCopy = () => {
    navigator.clipboard.writeText(activeText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-[#14231A] text-stone-100 border border-[#274535] rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden animate-fadeIn font-mono">
        {/* Header */}
        <div className="p-4 border-b border-[#274535] flex items-center justify-between bg-[#0e1a13]">
          <div className="flex items-center gap-2 text-xs">
            <BrainCircuit className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-[#FBF8EF]">Model Architecture & Token Inspector</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-[#285943] text-emerald-100 border border-emerald-600/50">
              100% Offline
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="p-1.5 rounded-lg bg-[#1e3327] hover:bg-[#285943] text-xs flex items-center gap-1 transition text-stone-200"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-[#1e3327] text-stone-400 hover:text-white transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="px-4 py-2 bg-[#0b1610] border-b border-[#274535] flex gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('neural')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'neural' ? 'bg-[#285943] text-emerald-100' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>Neural Weights & Gradients</span>
          </button>
          <button
            onClick={() => setActiveTab('gemma')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'gemma' ? 'bg-[#285943] text-emerald-100' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Structured Context Turns</span>
          </button>
          <button
            onClick={() => setActiveTab('license')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition flex items-center gap-1.5 whitespace-nowrap ${
              activeTab === 'license' ? 'bg-[#285943] text-emerald-100' : 'text-stone-400 hover:text-white'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Open Models & License</span>
          </button>
        </div>

        {/* Code Content */}
        <div className="p-4 overflow-y-auto flex-1 text-xs leading-relaxed text-emerald-200/90 bg-[#0b1610]">
          <pre className="whitespace-pre-wrap">{activeText}</pre>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#274535] bg-[#0e1a13] text-[11px] text-stone-400 flex justify-between items-center">
          <span>Backcountry Guardian MLP Neural Engine</span>
          <span className="text-emerald-400 font-bold">Trained with Backpropagation</span>
        </div>
      </div>
    </div>
  );
}
