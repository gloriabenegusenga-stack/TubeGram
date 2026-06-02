import { Home, Compass, Film, PlusCircle, User, LogOut } from 'lucide-react';
import { UserProfile } from '../types';

interface NavigationProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenCreate: () => void;
  currentUser: UserProfile;
  onLogOut: () => void;
}

export default function Navigation({ activeTab, setActiveTab, onOpenCreate, currentUser, onLogOut }: NavigationProps) {
  const navItems = [
    { id: 'feed', label: 'Home', icon: Home },
    { id: 'explore', label: 'Explore', icon: Compass },
    { id: 'shorts', label: 'Shorts', icon: Film },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <>
      {/* Desktop Left Sidebar: Combines YouTube side nav and Instagram minimal sidebar */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 border-r border-zinc-800 bg-zinc-950 px-4 py-6 z-30">
        {/* Unified Logo */}
        <div className="flex items-center gap-2 px-3 mb-8 cursor-pointer select-none" onClick={() => setActiveTab('feed')}>
          <div className="bg-red-600 px-2 py-0.5 rounded font-extrabold text-white text-lg tracking-tighter shadow-md">
            V
          </div>
          <span className="font-extrabold text-xl tracking-tighter bg-gradient-to-r from-white via-zinc-200 to-zinc-400 bg-clip-text text-transparent">
            TubeGram
          </span>
          <span className="text-[10px] bg-red-600/10 border border-red-500/25 text-red-500 font-bold px-1.5 py-0.2 rounded uppercase ml-1 scale-90">
            Pro
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`nav-desktop-${item.id}`}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-4 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 group relative ${
                  isActive
                    ? 'bg-zinc-900 text-white shadow-inner shadow-zinc-800'
                    : 'text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100'
                }`}
              >
                <Icon className={`w-5.5 h-5.5 transition-transform duration-300 group-hover:scale-105 ${
                  isActive ? 'text-red-500' : 'text-zinc-400 group-hover:text-zinc-300'
                }`} />
                <span>{item.label}</span>
                {isActive && (
                  <span className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-red-500 rounded-r-lg" />
                )}
              </button>
            );
          })}

          {/* Special Create Post Button resembling standard post triggers */}
          <button
            id="nav-desktop-create"
            onClick={onOpenCreate}
            className="w-full flex items-center gap-4 px-3.5 py-3 rounded-xl text-sm font-medium transition-all duration-300 text-zinc-400 hover:bg-zinc-900/50 hover:text-zinc-100 group"
          >
            <PlusCircle className="w-5.5 h-5.5 text-zinc-400 group-hover:text-zinc-200 group-hover:scale-105 transition-all duration-300" />
            <span>Create</span>
          </button>
        </nav>

        {/* Elegant user card in Sidebar */}
        <div className="mt-auto space-y-2">
          <div 
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-3 p-2.5 rounded-xl bg-zinc-900/40 hover:bg-zinc-900/70 border border-zinc-800/40 cursor-pointer transition-colors duration-200"
          >
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-10 h-10 rounded-full object-cover border border-zinc-800"
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-zinc-100 truncate">{currentUser.name}</p>
              <p className="text-xs text-zinc-500 truncate font-mono">@{currentUser.username}</p>
            </div>
          </div>
          
          <button
            onClick={onLogOut}
            className="w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold text-zinc-505 hover:bg-red-500/10 hover:text-red-400 border border-transparent hover:border-red-500/20 transition-all cursor-pointer group"
          >
            <span className="tracking-wide">Sign Out session</span>
            <LogOut className="w-3.5 h-3.5 text-zinc-500 group-hover:text-red-400 transition-colors" />
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-zinc-950/95 backdrop-blur-md border-t border-zinc-800 flex items-center justify-around px-2 pb-safe z-30">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              id={`nav-mobile-${item.id}`}
              onClick={() => setActiveTab(item.id)}
              className="flex flex-col items-center justify-center w-12 h-12 transition-colors duration-200"
            >
              <Icon className={`w-6.5 h-6.5 ${
                isActive ? 'text-red-500 scale-105' : 'text-zinc-400'
              }`} />
              <span className="sr-only">{item.label}</span>
            </button>
          );
        })}

        {/* Mobile Create Button */}
        <button
          id="nav-mobile-create"
          onClick={onOpenCreate}
          className="flex flex-col items-center justify-center w-12 h-12 text-zinc-400 hover:text-zinc-100"
        >
          <PlusCircle className="w-6.5 h-6.5 text-zinc-400" />
          <span className="sr-only">Create</span>
        </button>
      </div>
    </>
  );
}
