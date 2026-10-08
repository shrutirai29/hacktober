import React, { useState, useEffect } from 'react';
import { canopyAI } from '../services/localAIProvider';
import { 
  Mountain, 
  Leaf, 
  CloudSun, 
  Sparkles, 
  Map, 
  Cpu, 
  BookOpen, 
  Navigation, 
  Award,
  Search,
  Sun,
  Moon,
  Volume2,
  VolumeX,
  Menu,
  X,
  Compass,
  User
} from 'lucide-react';

export default function Navbar({ 
  activeTab, 
  setActiveTab, 
  audioMuted, 
  onToggleAudioMute, 
  darkMode, 
  onToggleDarkMode,
  onOpenPrizeHub,
  onSearch 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [aiStatus, setAiStatus] = useState(canopyAI.getStatus());

  useEffect(() => {
    return canopyAI.subscribe((status) => {
      setAiStatus(status);
    });
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Mountain },
    { id: 'field-mode', label: 'Field Mode', icon: Compass, isField: true },
    { id: '3d-map', label: '3D Map', icon: Map },
    { id: 'ai-guide', label: 'AI Guide', icon: Sparkles },
    { id: 'weather', label: 'Weather', icon: CloudSun },
    { id: 'birds', label: 'Birds', icon: Leaf },
    { id: 'sensors', label: 'Sensors', icon: Cpu },
    { id: 'journal', label: 'Journal', icon: BookOpen },
    { id: 'trails', label: 'Trails', icon: Navigation },
    { id: 'hacktoberfest', label: 'Hacktoberfest', icon: Award, isPrize: true },
  ];

  const handleNavClick = (id) => {
    if (id === 'hacktoberfest') {
      onOpenPrizeHub();
    } else {
      setActiveTab(id);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#F2F8F4]/95 backdrop-blur-md border-b border-[#DCE7DF] transition-colors shadow-sm w-full">
      {/* Header Container */}
      <div className="max-w-[1520px] mx-auto px-2.5 sm:px-4 lg:px-5">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-1.5 sm:gap-2">
          
          {/* Logo & Subtitle */}
          <div 
            onClick={() => setActiveTab('home')}
            className="flex items-center gap-1.5 sm:gap-2 cursor-pointer shrink-0 select-none group"
          >
            <div className="w-8 h-8 rounded-xl bg-[#285943] flex items-center justify-center text-[#FBF8EF] shadow-sm transition group-hover:scale-105">
              <svg className="w-4.5 h-4.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m8 3 4 8 5-5 5 15H2L8 3z" />
                <path d="M12 18v.01" stroke="#A8C5A0" strokeWidth="3" />
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-1">
                <span className="font-extrabold text-[14px] sm:text-[16px] tracking-tight text-[#1A2E22]">
                  Touch Grass
                </span>
                <span className="text-[#3F7D5A] text-xs font-bold">🌿</span>
              </div>
              <p className="text-[9px] font-medium text-[#486350] -mt-0.5 hidden sm:block">
                AI for a Wilder You
              </p>
            </div>
          </div>

          {/* Desktop Nav Items (Compact pills that fit all screens) */}
          <nav className="hidden xl:flex items-center gap-0.5 bg-[#EBF5EE] p-0.5 rounded-2xl border border-[#C8DEC8] shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-1 px-2 py-1.5 rounded-xl text-[11px] font-semibold transition-all select-none ${
                    isActive
                      ? 'bg-[#285943] text-[#FBF8EF] shadow-xs'
                      : 'text-[#486350] hover:text-[#1A2E22] hover:bg-[#F2F8F4]'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 shrink-0 ${isActive ? 'text-[#FBF8EF]' : item.isPrize ? 'text-[#E7A94B]' : 'text-[#285943]'}`} />
                  <span className="whitespace-nowrap">{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Search, Theme, Audio & Avatar */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
            {/* Search Bar */}
            <div className="relative hidden 2xl:block w-40">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#486350]" />
              <input
                type="text"
                placeholder="Search trails..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (onSearch) onSearch(e.target.value);
                }}
                className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#EBF5EE] border border-[#C8DEC8] rounded-xl text-[#1A2E22] placeholder-[#486350] focus:outline-none focus:border-[#285943] transition"
              />
            </div>

            {/* Model & Offline Status Badge (Sleek & Space-Efficient) */}
            <div className={`hidden lg:flex items-center gap-1 px-2 py-1 rounded-xl border text-[10px] font-mono transition-colors shrink-0 ${
              aiStatus === 'UNAVAILABLE'
                ? 'bg-amber-100 border-amber-300 text-amber-900 shadow-xs'
                : 'bg-[#E2EFE5] border-[#C8DEC8] text-[#285943]'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full ${
                aiStatus === 'UNAVAILABLE' ? 'bg-amber-600 animate-bounce' : 'bg-emerald-600 animate-pulse'
              }`} />
              <span className="font-bold whitespace-nowrap">
                {aiStatus === 'UNAVAILABLE' ? 'SAFETY ENGINE' : 'LOCAL AI'}
              </span>
              {aiStatus !== 'UNAVAILABLE' && <span className="text-[#6F7B72] hidden 2xl:inline">• Offline</span>}
            </div>

            {/* Light / Theme Button */}
            <button
              onClick={onToggleDarkMode}
              title={darkMode ? "Switch to Daylight Mode" : "Switch to Alpine Night Mode"}
              aria-label="Toggle theme mode"
              className={`p-1.5 sm:p-2 rounded-xl border transition shadow-xs flex items-center justify-center shrink-0 ${
                darkMode 
                  ? 'bg-[#16261E] border-[#254234] text-[#38BDF8] hover:bg-[#1d3328]' 
                  : 'bg-[#EBF5EE] border-[#C8DEC8] text-[#E7A94B] hover:bg-[#E2EFE5]'
              }`}
            >
              {darkMode ? (
                <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#38BDF8] transition-transform duration-300 rotate-12" />
              ) : (
                <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#E7A94B] transition-transform duration-300 hover:rotate-45" />
              )}
            </button>

            {/* Audio Toggle Pill (shrink-0, perfectly fitted) */}
            <button
              onClick={onToggleAudioMute}
              title={audioMuted ? "Unmute Voice Guide" : "Mute Voice Guide"}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-xl text-xs font-bold transition shadow-xs shrink-0 whitespace-nowrap ${
                audioMuted
                  ? 'bg-[#EBF5EE] border border-[#C8DEC8] text-[#486350]'
                  : 'bg-[#285943] hover:bg-[#204735] text-[#FBF8EF] border border-[#285943]'
              }`}
            >
              {audioMuted ? (
                <>
                  <VolumeX className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden sm:inline text-[11px]">Muted</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-3.5 h-3.5 text-[#DCEBDA] animate-pulse shrink-0" />
                  <span className="hidden sm:inline text-[11px]">Audio</span>
                </>
              )}
            </button>

            {/* Hiker Profile Avatar */}
            <div 
              onClick={() => setActiveTab('journal')}
              title="Hiker Profile & Field Journal"
              className="relative w-8 h-8 rounded-full bg-gradient-to-br from-[#285943] to-[#1A382A] border-2 border-[#A8C5A0] shadow-xs flex items-center justify-center text-[#E2EFE5] cursor-pointer hover:scale-105 hover:border-[#285943] transition select-none group shrink-0"
            >
              <User className="w-4 h-4 text-[#DCEBDA] group-hover:text-white transition-colors" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-[#F2F8F4] shadow-xs" title="Hiker Online (Offline Active)" />
            </div>

            {/* Mobile Hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-1.5 sm:p-2 rounded-xl bg-[#EBF5EE] border border-[#C8DEC8] text-[#1A2E22] shrink-0"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-[#DCE7DF] bg-[#F2F8F4] px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold text-left transition ${
                  isActive
                    ? 'bg-[#285943] text-[#FBF8EF]'
                    : 'text-[#6F7B72] hover:bg-[#EBF5EE]'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-[#FBF8EF]' : 'text-[#3F7D5A]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
}
