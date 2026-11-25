import React, { useState, useRef, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { Wifi, WifiOff, ChevronDown } from 'lucide-react';

interface HeaderProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
  onOpenSocialAuth: () => void;
}

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, onOpenSocialAuth }) => {
  const {
    currentUser,
    switchUser,
    users,
    isOfflineMode,
    toggleOfflineMode,
    syncPendingCount
  } = useApp();

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  const isCoach = currentUser.role === 'head_coach' || currentUser.role === 'assistant_coach';
  const isParent = currentUser.role === 'parent';

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'head_coach': return 'Cheftrainer';
      case 'assistant_coach': return 'Co-Trainer';
      case 'player': return 'Spieler';
      case 'parent': return 'Elternteil';
      default: return role;
    }
  };

  // Role-specific navigation tabs:
  // - Coaches: Trainingsplan, Diagnostik, Spieler-Feedback, Kalender & Aufgaben
  // - Players: Kalender & Aufgaben, Mein Feedback, Meine Fitness
  // - Parents: Kalender & Aufgaben only
  const navItems = isCoach
    ? [
        { id: 'planner', label: 'Trainingsplan', mobileLabel: 'Plan' },
        { id: 'diagnostics', label: 'Diagnostik', mobileLabel: 'Diagnostik' },
        { id: 'rpe', label: 'Spieler-Feedback', mobileLabel: 'Feedback' },
        { id: 'calendar', label: 'Kalender & Aufgaben', mobileLabel: 'Kalender' }
      ]
    : isParent
    ? [
        { id: 'calendar', label: 'Kalender & Aufgaben', mobileLabel: 'Kalender & Dienste' }
      ]
    : [
        { id: 'calendar', label: 'Kalender & Aufgaben', mobileLabel: 'Kalender & Dienste' },
        { id: 'rpe', label: 'Mein Feedback', mobileLabel: 'Feedback' },
        { id: 'diagnostics', label: 'Meine Fitness', mobileLabel: 'Fitness' }
      ];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-3">
        
        {/* Zone 1: Brand Wordmark */}
        <button
          type="button"
          onClick={() => onSelectTab(isCoach ? 'planner' : 'calendar')}
          className="text-base sm:text-lg font-extrabold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-sky-400 transition-colors"
        >
          HandballCoach Pro
        </button>

        {/* Zone 2: Clean role-based navigation links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold">
          {navItems.map((item) => {
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onSelectTab(item.id)}
                className={`transition-colors whitespace-nowrap shrink-0 py-1.5 ${
                  isActive
                    ? 'text-sky-400 border-b-2 border-sky-400'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Offline Toggle & Role Persona Switcher */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={toggleOfflineMode}
            className={`px-2.5 py-2 rounded-lg border text-xs flex items-center gap-1.5 transition-colors whitespace-nowrap shrink-0 ${
              isOfflineMode
                ? 'bg-amber-950/60 border-amber-800 text-amber-300'
                : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title={isOfflineMode ? 'Offline-Modus aktiv: Klicke für Online-Sync' : 'Online: Klicke um Offline-Modus zu testen'}
          >
            {isOfflineMode ? <WifiOff className="w-3.5 h-3.5 text-amber-400" /> : <Wifi className="w-3.5 h-3.5 text-emerald-400" />}
            <span className="hidden lg:inline">{isOfflineMode ? `Offline (${syncPendingCount})` : 'Online'}</span>
          </button>

          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsDropdownOpen((prev) => !prev)}
              className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold flex items-center gap-2 border border-slate-700 transition-colors whitespace-nowrap shrink-0"
            >
              <div className="text-left leading-tight">
                <div className="text-white font-bold truncate max-w-[120px] sm:max-w-none">{currentUser.name}</div>
                <div className="text-[10px] text-sky-400">{getRoleBadge(currentUser.role)}</div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl p-2 z-50 space-y-1">
                <div className="px-3 py-1.5 text-[11px] font-semibold text-slate-400 border-b border-slate-800">
                  Ansicht / Rolle wechseln
                </div>

                {users.map((u) => {
                  const isCurrent = u.id === currentUser.id;
                  return (
                    <button
                      key={u.id}
                      type="button"
                      onClick={() => {
                        switchUser(u.id);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full p-2.5 rounded-lg text-left text-xs flex items-center justify-between transition-colors ${
                        isCurrent ? 'bg-sky-600/20 text-sky-300 font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div>
                        <div className="text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400">
                          {getRoleBadge(u.role)}{u.position ? ` · ${u.position} (#${u.jerseyNumber})` : ''}
                        </div>
                      </div>
                      {isCurrent && <span className="text-xs text-sky-400 font-bold">Aktiv</span>}
                    </button>
                  );
                })}

                <div className="pt-2 border-t border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setIsDropdownOpen(false);
                      onOpenSocialAuth();
                    }}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold transition-colors"
                  >
                    Konto anlegen / Social-Login
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Tab Scroller */}
      <div className="flex md:hidden overflow-x-auto px-4 py-1.5 bg-slate-900 border-t border-slate-800/80 gap-2 text-xs">
        {navItems.map((item) => {
          const isActive = currentTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              className={`whitespace-nowrap px-3 py-2 rounded-lg font-medium transition-colors min-h-[38px] ${
                isActive ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
              }`}
            >
              {item.mobileLabel}
            </button>
          );
        })}
      </div>
    </header>
  );
};
