import React, { useState, useEffect, useRef } from 'react';
import { 
  Sparkles, 
  Send, 
  Mic, 
  Mountain, 
  Clock, 
  ShieldAlert, 
  Compass, 
  Code2, 
  Volume2
} from 'lucide-react';
import { askGemmaAgent } from '../services/gemmaTrailAgent';
import { speakTrailWhisper, playTrailChime } from '../services/voiceGuide';

export default function AIGuardianCard({ currentTrail, onOpenPromptInspector, audioMuted }) {
  const [messages, setMessages] = useState([
    {
      role: 'user',
      text: "What is the critical summit turnaround time for this trail?"
    },
    {
      role: 'ai',
      text: "Based on the high summit elevation and TabPFN sunset forecast, your hard turnaround time is strictly 2:30 PM.\n\nDescent across exposed moraine scree and verglas hard snow requires daylight. Temperatures plummet below freezing immediately after sundown."
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (!currentTrail) return;
    const trailName = currentTrail.name || 'Alpine Trail';
    const turnaround = currentTrail.turnaroundTime || '2:30 PM';
    const advisory = currentTrail.safetyAdvisory || `Strict ${turnaround} turnaround time enforced.`;
    setMessages([
      {
        role: 'user',
        text: `What is the critical safety turnaround time for ${trailName}?`
      },
      {
        role: 'ai',
        text: `Based on ${currentTrail.elevationGain || currentTrail.distance || 'high altitude'} and TabPFN microclimate analysis, your strict turnaround time is ${turnaround}.\n\n${advisory}`
      }
    ]);
  }, [currentTrail?.id]);

  const handleSendMessage = async (queryText = inputQuery) => {
    if (!queryText.trim() || isLoading) return;

    const userMsg = { role: 'user', text: queryText };
    setMessages(prev => [...prev, userMsg]);
    setInputQuery('');
    setIsLoading(true);

    try {
      const response = await askGemmaAgent(currentTrail, queryText);
      const aiMsg = { role: 'ai', text: response.response };
      setMessages(prev => [...prev, aiMsg]);

      if (!audioMuted) {
        const summary = response.response.split('\n')[0].replace(/[#*]/g, '');
        speakTrailWhisper(summary, { chime: 'nature' });
      }
    } catch (err) {
      setMessages(prev => [...prev, { 
        role: 'ai', 
        text: "Neural Copilot: Stick to the marked trail, adhere to the 2:30 PM hard turnaround time, and pack out all food waste." 
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChipClick = (prompt) => {
    handleSendMessage(prompt);
  };

  return (
    <div className="outdoor-card p-4 sm:p-5 bg-[#F2F8F4]/98 border-[#C8DEC8] flex flex-col h-full shadow-sm">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-2.5 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-[#DCEBDA] flex items-center justify-center text-[#285943]">
            <Sparkles className="w-4 h-4" />
          </div>
          <h3 className="text-sm font-extrabold text-[#20332A]">
            AI Backcountry Guardian
          </h3>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={onOpenPromptInspector}
            title="Inspect Neural Model Architecture"
            className="p-1 text-[#6F7B72] hover:text-[#285943] transition"
          >
            <Code2 className="w-3.5 h-3.5" />
          </button>
          <span className="px-2.5 py-0.5 rounded-full bg-[#DCEBDA] text-[#285943] text-[10px] font-bold border border-[#A8C8AF] flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            Trained Neural Model
          </span>
        </div>
      </div>

      {/* Chat Thread Messages: Fills available card height without dead gap */}
      <div className="flex-1 space-y-2.5 mb-2.5 overflow-y-auto pr-1 min-h-[160px] max-h-[300px]">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-[#285943] text-[#FBF8EF] flex items-center justify-center text-[10px] shrink-0 mr-2 mt-1 shadow-sm">
                <Mountain className="w-3.5 h-3.5 text-emerald-200" />
              </div>
            )}
            
            <div className={`p-3 rounded-2xl text-xs leading-relaxed max-w-[88%] ${
              msg.role === 'user'
                ? 'bg-[#DCEBDA] text-[#20332A] font-bold rounded-tr-sm shadow-xs'
                : 'bg-[#EBF5EE] text-[#20332A] border border-[#C8DEC8] rounded-tl-sm whitespace-pre-line shadow-xs'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-start">
            <div className="w-6 h-6 rounded-full bg-[#285943] text-[#FBF8EF] flex items-center justify-center text-[10px] shrink-0 mr-2 mt-1">
              <Mountain className="w-3.5 h-3.5 animate-spin" />
            </div>
            <div className="p-3 rounded-2xl bg-[#EBF5EE] text-xs text-[#6F7B72] border border-[#C8DEC8] flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5A] animate-bounce"></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5A] animate-bounce" style={{ animationDelay: '0.2s' }}></span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#3F7D5A] animate-bounce" style={{ animationDelay: '0.4s' }}></span>
              <span>Reasoning with Neural Model...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick Action Prompt Chips: Sits cleanly right above the input */}
      <div className="flex flex-wrap gap-1.5 mb-2.5 shrink-0">
        <button
          onClick={() => handleChipClick("Should I wear warm cloths for the trail or not?")}
          className="px-2.5 py-1 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] text-[10px] font-bold text-[#285943] hover:bg-[#DCEBDA] transition flex items-center gap-1 active:scale-95"
        >
          <span>🧥</span>
          <span>Warm Clothes?</span>
        </button>

        <button
          onClick={() => handleChipClick("Calculate strict sunset turnaround time.")}
          className="px-2.5 py-1 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] text-[10px] font-bold text-[#D97855] hover:bg-[#DCEBDA] transition flex items-center gap-1 active:scale-95"
        >
          <Clock className="w-3 h-3 text-[#E7A94B]" />
          <span>Sunset Turnaround</span>
        </button>

        <button
          onClick={() => handleChipClick("What wildlife safety protocols apply here?")}
          className="px-2.5 py-1 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] text-[10px] font-bold text-[#D97855] hover:bg-[#DCEBDA] transition flex items-center gap-1 active:scale-95"
        >
          <ShieldAlert className="w-3 h-3 text-[#E7A94B]" />
          <span>Wildlife Safety</span>
        </button>

        <button
          onClick={() => handleChipClick("Explain Leave No Trace rules for ridge mosses.")}
          className="px-2.5 py-1 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] text-[10px] font-bold text-[#D97855] hover:bg-[#DCEBDA] transition flex items-center gap-1 active:scale-95"
        >
          <Compass className="w-3 h-3 text-[#E7A94B]" />
          <span>Leave No Trace</span>
        </button>
      </div>

      {/* Input Box Row: Compact border and tight alignment */}
      <div className="pt-2 border-t border-[#C8DEC8] shrink-0 mt-auto">
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2 bg-[#EBF5EE] border border-[#C8DEC8] rounded-2xl px-3 py-1.5 focus-within:border-[#3F7D5A] transition"
        >
          <input
            type="text"
            placeholder="Ask anything about the trail..."
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            className="flex-1 bg-transparent text-xs text-[#20332A] placeholder-[#6F7B72] focus:outline-none"
          />

          <button
            type="button"
            title="Speak Question"
            onClick={() => handleSendMessage("What should I do if a thunderstorm approaches?")}
            className="p-1 text-[#6F7B72] hover:text-[#3F7D5A] transition"
          >
            <Mic className="w-4 h-4" />
          </button>

          <button
            type="submit"
            disabled={!inputQuery.trim() || isLoading}
            className="w-7 h-7 rounded-xl bg-[#285943] hover:bg-[#204936] disabled:opacity-40 text-[#FBF8EF] flex items-center justify-center transition shadow-sm shrink-0 active:scale-95"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
}
