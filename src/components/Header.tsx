import { useState } from 'react';
import { Search, Flame, Bell, Check, User, Sparkles, MessageCircle, Heart, LogOut, Fingerprint } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  activeTagFilter: string;
  setActiveTagFilter: (tag: string) => void;
  currentUser?: UserProfile;
  onLogOut?: () => void;
}

export default function Header({
  searchQuery,
  setSearchQuery,
  activeTagFilter,
  setActiveTagFilter,
  currentUser,
  onLogOut
}: HeaderProps) {
  const [showAlerts, setShowAlerts] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);

  // Cool interactive trending hashtag tags list
  const trendingTags = ['travel', 'minimalism', 'cyberpunk', 'satisfying', 'shorts', 'desksetup'];

  // Cute mock notifications list
  const mockNotifications = [
    {
      id: 1,
      user: "clara_travels",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80",
      action: "liked your photo",
      target: "Sossusvlei Dunes, Namibia",
      time: "2 mins ago",
      icon: Heart,
      color: "text-red-500 bg-red-500/10"
    },
    {
      id: 2,
      user: "dev_architect",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&q=80",
      action: "commented",
      text: "Is that layout custom or stock mechanical?",
      target: "Seattle Workspace",
      time: "15 mins ago",
      icon: MessageCircle,
      color: "text-blue-500 bg-blue-500/10"
    },
    {
      id: 3,
      user: "gastronomy_daily",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=80&q=80",
      action: "voted your Short review",
      target: "Handmade scoring ASMR",
      time: "1 hour ago",
      icon: Sparkles,
      color: "text-yellow-500 bg-yellow-500/10"
    }
  ];

  return (
    <header className="w-full bg-zinc-950/80 backdrop-blur-md border-b border-zinc-850 sticky top-0 z-40 px-4 py-3 select-none">
      <div className="max-w-5xl mx-auto flex flex-col gap-3">
        
        {/* Row 1: Logo (Mobile) + Search Bar + Notifications */}
        <div className="flex items-center justify-between gap-4">
          
          {/* Logo representation shown only on mobile */}
          <div className="flex md:hidden items-center gap-1.5 cursor-pointer">
            <span className="bg-red-650 text-white text-base font-bold px-1.5 py-0.2 rounded tracking-tighter shadow">
              V
            </span>
            <span className="font-extrabold text-lg tracking-tighter bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent">
              TubeGram
            </span>
          </div>

          {/* Combined YouTube & Instagram Search Engine */}
          <div className="flex-1 max-w-lg mx-auto relative group">
            <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none text-zinc-500 group-focus-within:text-red-400 transition-colors">
              <Search className="w-4.5 h-4.5" />
            </div>
            <input
              type="text"
              placeholder="Search posts, descriptions, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2.2 pl-11 pr-12 bg-zinc-900 border border-zinc-800 focus:border-red-500 rounded-full text-xs text-zinc-100 outline-none placeholder-zinc-500 focus:bg-zinc-950 transition-all font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white text-xs font-bold font-mono focus:outline-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Notifications Alerts Drawer control & Login Place switcher */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => {
                setShowAlerts(!showAlerts);
                setShowUserDropdown(false);
              }}
              className={`p-2.5 rounded-full border border-zinc-800 text-zinc-300 hover:text-white transition-all bg-zinc-900 hover:bg-zinc-850 relative cursor-pointer ${
                showAlerts ? 'bg-red-600/10 text-red-400 border-red-500/20' : ''
              }`}
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-400 border border-zinc-900" />
            </button>

            {/* Float Alert Dialog */}
            {showAlerts && (
              <div className="absolute right-0 mt-12 w-72 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden z-50 animate-fade-in">
                <div className="p-3.5 bg-zinc-950 border-b border-zinc-850 flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 tracking-wider">Social Interactions</span>
                  <span className="text-[9px] bg-red-650/10 text-red-500 px-2 py-0.5 rounded-full font-semibold">Live Feed</span>
                </div>

                <div className="divide-y divide-zinc-855 max-h-80 overflow-y-auto no-scrollbar">
                  {mockNotifications.map(item => {
                    const Icon = item.icon;
                    return (
                      <div key={item.id} className="p-3 flex gap-3 text-xs text-zinc-300 items-start hover:bg-zinc-950/40 transition-colors">
                        <img
                          src={item.avatar}
                          alt={item.user}
                          className="w-8 h-8 rounded-full object-cover border border-zinc-800"
                        />
                        <div className="flex-1">
                          <p className="leading-snug">
                            <span className="font-bold text-zinc-100">@{item.user}</span>{' '}
                            {item.action}{' '}
                            <span className="text-zinc-450 italic">{item.target}</span>
                          </p>
                          {item.text && (
                            <p className="mt-1 bg-zinc-950/60 p-2 rounded-lg border border-zinc-850 text-[11px] text-zinc-400">
                              "{item.text}"
                            </p>
                          )}
                          <span className="text-[9px] text-zinc-500 font-mono mt-1 block">{item.time}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Quick Login profile switcher display container */}
            {currentUser && (
              <div className="relative">
                <button
                  onClick={() => {
                    setShowUserDropdown(!showUserDropdown);
                    setShowAlerts(false);
                  }}
                  className={`flex items-center gap-1.5 p-1 bg-zinc-900 hover:bg-zinc-850 rounded-full border transition-all cursor-pointer ${
                    showUserDropdown ? 'border-red-500 ring-2 ring-red-500/10' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                  title="Secure Login Details"
                >
                  <img
                    src={currentUser.avatar}
                    alt={currentUser.name}
                    className="w-7 h-7 rounded-full object-cover"
                  />
                </button>

                {showUserDropdown && (
                  <div className="absolute right-0 mt-3.5 w-64 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl p-4 z-50 text-left animate-fade-in space-y-3.5">
                    <div className="flex items-center gap-3 pb-3 border-b border-zinc-800/60">
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.name}
                        className="w-10 h-10 rounded-full object-cover border border-zinc-700"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-extrabold text-zinc-100 truncate">{currentUser.name}</p>
                        <p className="text-[10px] text-zinc-450 font-mono truncate">@{currentUser.username}</p>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <p className="text-[9px] uppercase font-bold text-zinc-500 tracking-wider">Verification place</p>
                      <div className="p-2.5 bg-zinc-950 border border-zinc-850 rounded-xl space-y-1">
                        <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400">
                          <span>Secure Status</span>
                          <span className="text-red-500 font-extrabold flex items-center gap-1 uppercase text-[8px]">
                            <Fingerprint className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                            Active
                          </span>
                        </div>
                        <p className="text-[9px] text-zinc-500 leading-tight">Switch accounts anytime to access other creators or log out of this secure instance.</p>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setShowUserDropdown(false);
                        onLogOut?.();
                      }}
                      className="w-full flex items-center justify-between px-3 py-2 bg-red-600/10 hover:bg-red-650 text-red-500 hover:text-white border border-red-500/20 hover:border-red-650 rounded-xl text-xs font-bold transition-all cursor-pointer group"
                    >
                      <span>Logout / Switch User</span>
                      <LogOut className="w-3.5 h-3.5 text-red-400 group-hover:text-white" />
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Row 2: Trending / Filtering tags list (Pills interface) */}
        <div className="flex gap-2 items-center overflow-x-auto no-scrollbar py-1 select-none">
          <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1 flex-shrink-0 mr-1.5">
            <Flame className="w-3.5 h-3.5 text-orange-500 fill-orange-500" />
            Trending:
          </span>

          {/* Reset All filter */}
          <button
            onClick={() => {
              setActiveTagFilter('');
              setSearchQuery('');
            }}
            className={`px-3 py-1.2 rounded-full text-[11px] font-bold tracking-tight transition-all cursor-pointer flex-shrink-0 ${
              !activeTagFilter 
                ? 'bg-red-600 text-white shadow-sm font-semibold' 
                : 'bg-zinc-900 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
            }`}
          >
            All Mixed
          </button>

          {/* Maps Pills */}
          {trendingTags.map(tag => {
            const isActive = activeTagFilter === tag;
            return (
              <button
                key={tag}
                onClick={() => {
                  setActiveTagFilter(isActive ? '' : tag);
                  setSearchQuery('');
                }}
                className={`px-3.5 py-1.2 rounded-full text-[11px] font-bold tracking-tight transition-all cursor-pointer flex-shrink-0 ${
                  isActive
                    ? 'bg-red-600 text-white shadow-sm font-semibold'
                    : 'bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-850'
                }`}
              >
                #{tag}
              </button>
            );
          })}
        </div>

      </div>
    </header>
  );
}
