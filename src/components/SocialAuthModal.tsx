import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { UserRole, Position } from '../types';
import { ShieldCheck, Check, Sparkles, AlertCircle } from 'lucide-react';

interface SocialAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SocialAuthModal: React.FC<SocialAuthModalProps> = ({ isOpen, onClose }) => {
  const { showToast, switchUser } = useApp();

  const [authMode, setAuthMode] = useState<'login' | 'register'>('register');
  const [selectedRole, setSelectedRole] = useState<UserRole>('player');
  const [teamCode, setTeamCode] = useState('SG-WEST-26');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [position, setPosition] = useState<Position>('RL');
  const [jerseyNumber, setJerseyNumber] = useState('7');
  const [gdprAccepted, setGdprAccepted] = useState(true);
  const [parentConsentRequired, setParentConsentRequired] = useState(false);

  if (!isOpen) return null;

  const handleSocialSimulate = (provider: 'Google' | 'Apple') => {
    if (!gdprAccepted) {
      showToast('Bitte bestätige zuerst die datenschutzkonforme Verarbeitung nach DSGVO.');
      return;
    }
    showToast(`Erfolgreich via ${provider} authentifiziert! Willkommen bei HandballCoach Pro.`);
    // Automatically login as coach or player
    switchUser(selectedRole === 'head_coach' ? 'user-coach-1' : 'user-player-1');
    onClose();
  };

  const handleCustomRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gdprAccepted) {
      showToast('Bitte die Datenschutzerklärung akzeptieren.');
      return;
    }
    showToast(`Account für "${fullName || 'Neuer Spieler'}" erfolgreich erstellt und dem Team zugeordnet.`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-lg w-full p-6 space-y-5 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white text-sm"
        >
          ✕
        </button>

        {/* Title & Onboarding Hook */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span>
            <span className="text-xs font-bold text-sky-400 uppercase tracking-wider">Schnell-Registrierung</span>
          </div>
          <h3 className="text-lg font-bold text-white">
            {authMode === 'register' ? 'Neues Benutzerkonto anlegen' : 'Bei HandballCoach Pro anmelden'}
          </h3>
          <p className="text-xs text-slate-400">
            Tritt deiner Handballmannschaft sekundenschnell über Social-Login oder Team-Code bei.
          </p>
        </div>

        {/* Social Login 1-Click Buttons */}
        <div className="space-y-2.5">
          <button
            type="button"
            onClick={() => handleSocialSimulate('Google')}
            className="w-full py-2.5 px-4 bg-white hover:bg-slate-100 text-slate-900 font-semibold rounded-xl text-xs flex items-center justify-center gap-3 shadow-md transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>Mit Google fortfahren</span>
          </button>

          <button
            type="button"
            onClick={() => handleSocialSimulate('Apple')}
            className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-750 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-3 border border-slate-700 transition-colors"
          >
            <svg className="w-4 h-4 fill-current" viewBox="0 0 170 170">
              <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.7-3.04-7.58-7.7-11.64-13.99-6.3-9.77-11.1-20.78-14.4-33.01-3.3-12.24-4.96-23.77-4.96-34.6 0-14.28 3.65-26.06 10.96-35.34 7.31-9.28 16.48-14.07 27.5-14.38 4.78 0 10.28 1.37 16.51 4.11 6.23 2.74 10.15 4.17 11.76 4.29 1.25-.12 5.37-1.61 12.37-4.48 7-2.87 12.78-4.14 17.35-3.8 12.79.88 22.75 5.76 29.89 14.65-11.39 6.87-17.02 16.32-16.89 28.36.14 9.4 3.73 17.26 10.77 23.59 7.04 6.33 15.42 9.87 25.13 10.63-2.18 6.72-4.91 13.88-8.19 21.49zm-34.5-111.45c0 7.31-2.67 14.04-8.02 20.19-5.35 6.15-11.89 9.85-19.61 11.1-.13-1.08-.2-2.07-.2-2.96 0-7.09 2.87-14.01 8.6-20.76 5.73-6.75 12.14-10.46 19.23-11.13 0 1.25 0 2.44 0 3.56z" />
            </svg>
            <span>Mit Apple ID fortfahren</span>
          </button>
        </div>

        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-800 w-full"></div>
          <span className="bg-slate-900 px-3 text-[11px] text-slate-500 uppercase tracking-wider">
            Oder manuell mit Team-Code
          </span>
        </div>

        {/* Custom Form */}
        <form onSubmit={handleCustomRegister} className="space-y-3.5 text-xs">
          <div>
            <label className="text-slate-400 block mb-1">Rolle im Verein</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'player', label: 'Spieler' },
                { id: 'head_coach', label: 'Trainer' },
                { id: 'parent', label: 'Elternteil' }
              ].map(r => (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => setSelectedRole(r.id as any)}
                  className={`py-2 px-2 rounded-lg font-medium transition-colors ${
                    selectedRole === r.id 
                      ? 'bg-sky-600 text-white' 
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-750'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-slate-400 block mb-1">Vollständiger Name</label>
              <input
                type="text"
                placeholder="Max Mustermann"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
              />
            </div>
            <div>
              <label className="text-slate-400 block mb-1">Team-Einladungscode</label>
              <input
                type="text"
                value={teamCode}
                onChange={(e) => setTeamCode(e.target.value)}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white uppercase font-mono tracking-wider"
              />
            </div>
          </div>

          {selectedRole === 'player' && (
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-slate-400 block mb-1">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="RL">Rückraum Links (RL)</option>
                  <option value="RM">Rückraum Mitte (RM)</option>
                  <option value="RR">Rückraum Rechts (RR)</option>
                  <option value="LA">Linksaußen (LA)</option>
                  <option value="RA">Rechtsaußen (RA)</option>
                  <option value="KM">Kreisläufer (KM)</option>
                  <option value="TW">Torwart (TW)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Trikotnummer</label>
                <input
                  type="number"
                  value={jerseyNumber}
                  onChange={(e) => setJerseyNumber(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          )}

          {/* GDPR Compliance Checkboxes */}
          <div className="space-y-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={gdprAccepted}
                onChange={(e) => setGdprAccepted(e.target.checked)}
                className="mt-0.5 accent-sky-500 rounded"
              />
              <span>
                Ich willige in die datenschutzkonforme Speicherung meiner Daten (inkl. freiwilliger RPE-Belastungsangaben) nach Art. 6 & 9 DSGVO ein.
              </span>
            </label>

            <label className="flex items-start gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={parentConsentRequired}
                onChange={(e) => setParentConsentRequired(e.target.checked)}
                className="mt-0.5 accent-sky-500 rounded"
              />
              <span>
                Jugendspieler unter 16 Jahren: Zustimmung eines Erziehungsberechtigten liegt vor.
              </span>
            </label>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs transition-colors shadow-lg"
          >
            Registrierung abschließen & Team beitreten
          </button>
        </form>
      </div>
    </div>
  );
};
