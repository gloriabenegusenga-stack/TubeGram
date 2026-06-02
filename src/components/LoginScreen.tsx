import React, { useState } from 'react';
import { Award, Shield, CheckCheck, Loader2, Sparkles, User, Fingerprint } from 'lucide-react';

interface LoginScreenProps {
  onLoginSuccess: (userData: {
    name: string;
    username: string;
    avatar: string;
    bio: string;
  }) => void;
}

const BRAND_PRESETS = [
  {
    name: "Alex Vibes",
    username: "alex_vibes",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
    bio: "Cinematic digital storyteller • Tokyo transit Explorer • Designing dense interfaces"
  },
  {
    name: "Clara Travels",
    username: "clara_travels",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    bio: "Travel photojournalist & filmmaker. Documenting hidden corners of the earth!"
  },
  {
    name: "Jordan Dev",
    username: "jordan_dev",
    avatar: "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?auto=format&fit=crop&w=150&q=80",
    bio: "Tech entrepreneur • Full stack hardware craft • Coding responsive visual design grids"
  }
];

export default function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [customName, setCustomName] = useState('');
  const [customUsername, setCustomUsername] = useState('');
  const [customBio, setCustomBio] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(0);
  
  // Auth simulation triggers
  const [authenticating, setAuthenticating] = useState(false);
  const [currentStepText, setCurrentStepText] = useState('');
  const [provider, setProvider] = useState<string | null>(null);

  const triggerAuthSimulation = (providerName: string) => {
    if (authenticating) return;
    setProvider(providerName);
    setAuthenticating(true);

    const steps = [
      `Initializing OAuth handshake with secure ${providerName} endpoint...`,
      "Acquiring verified account credentials securely...",
      "Configuring cryptographic login token...",
      "Handshake verified! Loading high density feed..."
    ];

    let currentStep = 0;
    setCurrentStepText(steps[currentStep]);

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep < steps.length) {
        setCurrentStepText(steps[currentStep]);
      } else {
        clearInterval(timer);
        
        // Resolve profile
        let userResult = {
          name: "Anonymous User",
          username: "anonymous_tube",
          avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80",
          bio: `Authenticated via professional ${providerName} credentials. Welcome to my custom feed!`
        };

        if (selectedPreset !== null) {
          const preset = BRAND_PRESETS[selectedPreset];
          userResult = {
            ...preset,
            bio: `${preset.bio} • Logged in via ${providerName}`
          };
        } else if (customName.trim()) {
          const cleanUsername = (customUsername.trim() || customName.trim().toLowerCase().replace(/\s+/g, '_'));
          userResult = {
            name: customName.trim(),
            username: cleanUsername,
            avatar: `https://api.dicebear.com/7.x/pixel-art/svg?seed=${cleanUsername}`,
            bio: customBio.trim() || `Creator portfolio on TubeGram • Verified user from ${providerName}`
          };
        }

        onLoginSuccess(userResult);
        setAuthenticating(false);
      }
    }, 600);
  };

  return (
    <div id="login-screen-parent" className="min-h-screen bg-[#0f0f0f] text-zinc-100 flex items-center justify-center p-4 relative overflow-hidden select-none font-sans">
      
      {/* Dynamic Grid Background Accent */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] opacity-30 pointer-events-none" />

      {/* Decorative colored glow spheres */}
      <div className="absolute top-10 left-10 w-96 h-96 bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Login Canvas Container */}
      <div className="relative w-full max-w-lg bg-[#0a0a0a]/90 border border-zinc-800 rounded-2xl shadow-2xl p-6 md:p-8 backdrop-blur-xl z-10 transition-all">
        
        {/* Verification Loader overlay */}
        {authenticating && (
          <div className="absolute inset-0 bg-[#0a0a0a]/95 rounded-2xl flex flex-col items-center justify-center p-6 text-center z-50 animate-fade-in">
            <div className="relative w-16 h-16 flex items-center justify-center mb-6">
              <div className="absolute inset-0 rounded-full border-4 border-zinc-800 border-t-red-500 animate-spin" />
              <Fingerprint className="w-6 h-6 text-red-500 animate-pulse" />
            </div>
            
            <h3 className="font-extrabold text-white tracking-widest text-[11px] uppercase mb-1">
              {provider} Authenticating
            </h3>
            <p className="text-xs text-zinc-400 font-mono max-w-xs">{currentStepText}</p>

            <div className="flex gap-1.5 mt-6 items-center bg-zinc-950 px-4 py-2 border border-zinc-800 rounded-xl">
              <Shield className="w-3.5 h-3.5 text-red-500 animate-bounce" />
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">TubeGram Security Link</span>
            </div>
          </div>
        )}

        {/* Brand Header block */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-zinc-950 border border-zinc-800 rounded-full mb-4">
            <Award className="w-3.5 h-3.5 text-red-500 animate-pulse" />
            <span className="text-[9px] text-zinc-400 font-extrabold tracking-widest uppercase">Hybrid Digital Workspace v2</span>
          </div>

          <div className="flex items-center justify-center gap-2 mb-2">
            <div className="bg-red-650 text-white font-black text-xl px-2.5 py-0.5 rounded shadow tracking-tighter">
              V
            </div>
            <h1 className="text-2xl font-extrabold text-white tracking-tighter">
              TubeGram
            </h1>
          </div>
          <p className="text-xs text-zinc-400 max-w-xs mx-auto">
            Experience a beautiful high-density fusion of cinematic video feed and photographic discovery.
          </p>
        </div>

        {/* Step 1: Choose or build your credentials persona */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">
              1. Choose Sign-In Profile
            </h2>
            <button
              onClick={() => { setSelectedPreset(null); }}
              className={`text-[9px] font-bold px-2 py-0.5 rounded transition-all ${
                selectedPreset === null 
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              + Custom Handle
            </button>
          </div>

          {selectedPreset !== null ? (
            <div className="space-y-2">
              {BRAND_PRESETS.map((p, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedPreset(idx)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border transition-all cursor-pointer ${
                    selectedPreset === idx 
                      ? 'bg-zinc-950 border-red-500/60 ring-1 ring-red-500/20' 
                      : 'bg-[#121212]/50 border-zinc-805 hover:bg-[#121212] hover:border-zinc-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <img src={p.avatar} alt={p.name} className="w-8 h-8 rounded-full object-cover border border-zinc-900" />
                    <div className="text-left">
                      <p className="text-xs font-bold text-zinc-200">{p.name}</p>
                      <p className="text-[10px] text-zinc-500 font-mono">@{p.username}</p>
                    </div>
                  </div>
                  {selectedPreset === idx && (
                    <div className="bg-red-650/10 border border-red-500/30 text-red-400 px-2 py-0.5 rounded text-[9px] font-bold">
                      Active
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-zinc-950 p-4 border border-zinc-850 rounded-xl space-y-3 animate-fade-in text-left">
              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Display Name</label>
                  <input
                    type="text"
                    required
                    maxLength={20}
                    placeholder="e.g. Jordan Developer"
                    value={customName}
                    onChange={(e) => setCustomName(e.target.value)}
                    className="w-full text-xs p-2 bg-zinc-900 border border-zinc-801 rounded-lg text-zinc-200 focus:border-red-500 outline-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Username</label>
                  <input
                    type="text"
                    required
                    maxLength={15}
                    placeholder="e.g. jordan_dev"
                    value={customUsername}
                    onChange={(e) => setCustomUsername(e.target.value)}
                    className="w-full text-xs p-2 bg-zinc-900 border border-zinc-801 rounded-lg text-zinc-200 focus:border-red-500 outline-none font-mono"
                  />
                </div>
              </div>
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider block">Short Brand Bio</label>
                <input
                  type="text"
                  placeholder="e.g. Cinematographer documenting neon cities."
                  value={customBio}
                  onChange={(e) => setCustomBio(e.target.value)}
                  className="w-full text-xs p-2 bg-zinc-900 border border-zinc-801 rounded-lg text-zinc-200 focus:border-red-500 outline-none"
                />
              </div>
              <button
                type="button"
                onClick={() => setSelectedPreset(0)}
                className="text-[9px] font-bold text-red-400 hover:underline block"
              >
                ← Back to Predefined Brand Profiles
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Multi-provider Login buttons requested */}
        <div className="space-y-2.5">
          <h2 className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider text-left mb-2.5">
            2. Authorize via Provider Credentials
          </h2>

          <div className="grid grid-cols-2 gap-2.5">
            {/* Google */}
            <button
              onClick={() => triggerAuthSimulation('Google')}
              className="group flex items-center justify-center gap-2 p-2.5 bg-zinc-950 hover:bg-zinc-850/80 hover:text-white border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
            >
              <svg className="w-4 h-4 text-red-500 shrink-0 fill-current" viewBox="0 0 24 24">
                <path d="M12.24 10.285V13.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l2.427-2.334C17.955 2.192 15.34 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.986 0-.742-.08-1.307-.179-1.864z" />
              </svg>
              <span>Google ID</span>
            </button>

            {/* Facebook */}
            <button
              onClick={() => triggerAuthSimulation('Facebook')}
              className="group flex items-center justify-center gap-2 p-2.5 bg-blue-600/10 hover:bg-blue-600/25 border border-blue-600/30 hover:border-blue-500 rounded-xl text-xs font-bold text-blue-400 hover:text-blue-300 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z" />
              </svg>
              <span>Facebook</span>
            </button>

            {/* Discord */}
            <button
              onClick={() => triggerAuthSimulation('Discord')}
              className="group flex items-center justify-center gap-2 p-2.5 bg-[#5865F2]/10 hover:bg-[#5865F2]/25 border border-[#5865F2]/30 hover:border-[#5865F2]/60 rounded-xl text-xs font-bold text-[#5865F2] hover:text-[#7289da] transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
            >
              <svg className="w-4.5 h-4.5 fill-current shrink-0" viewBox="0 0 127.14 96.36">
                <path d="M107.7,8.07A105.15,105.15,0,0,0,77.26,0a77.19,77.19,0,0,0-3.3,6.83A96.67,96.67,0,0,0,53.22,6.83,77.19,77.19,0,0,0,49.88,0,105.15,105.15,0,0,0,19.44,8.07C3.66,31.58-1.86,54.65,1,77.53A105.73,105.73,0,0,0,32,96.36a77.7,77.7,0,0,0,6.63-10.85,67.43,67.43,0,0,1-10.5-5c.88-.65,1.72-1.34,2.51-2.07a75.14,75.14,0,0,0,73,0c.79.73,1.63,1.42,2.51,2.07a67.43,67.43,0,0,1-10.5,5A77.7,77.7,0,0,0,102.3,85.5a105.73,105.73,0,0,0,31-18.83C136.27,51.86,126.39,29.18,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5.14-12.69,11.41-12.69S53.9,46,53.79,53,48.72,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.24,60,73.24,53S78.38,40.31,84.69,40.31s11.41,5.66,11.41,12.69S91,65.69,84.69,65.69Z" />
              </svg>
              <span>Discord</span>
            </button>

            {/* Steam */}
            <button
              onClick={() => triggerAuthSimulation('Steam')}
              className="group flex items-center justify-center gap-2 p-2.5 bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 hover:border-zinc-700 rounded-xl text-xs font-bold text-zinc-300 transition-all cursor-pointer shadow-sm hover:scale-[1.01]"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12 2A10 10 0 002.34 9.17l4.59 1.9a3.17 3.17 0 011.64-.47l3.81-5.46a3 3 0 015.65.62l-5.6 3.93c0 .28.03.55.03.83 0 2.25-1.83 4.09-4.1 4.09l-1.93-.8-3.07 1.27A10 10 0 1012 2zm-3.5 12a1.5 1.5 0 110-3 1.5 1.5 0 010 3z" />
              </svg>
              <span>Steam Auth</span>
            </button>
          </div>
        </div>

        {/* Dynamic platform trust disclaimer */}
        <div className="mt-8 pt-4 border-t border-zinc-900 flex justify-between items-center text-[10px] text-zinc-600 font-mono">
          <span>SECURE SECP256K1 KEY</span>
          <span className="flex items-center gap-1.5 text-[9px] text-zinc-500 font-bold bg-zinc-950 px-2 py-0.5 rounded border border-zinc-850">
            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
            LIVE NODE CONNECTION
          </span>
        </div>

      </div>
    </div>
  );
}
