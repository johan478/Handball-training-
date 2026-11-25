/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Header';
import { TrainingPlanner } from './components/TrainingPlanner';
import { DiagnosticsModule } from './components/DiagnosticsModule';
import { RpeFeedbackModule } from './components/RpeFeedbackModule';
import { TeamCalendarAndAttendance } from './components/TeamCalendarAndAttendance';
import { SocialAuthModal } from './components/SocialAuthModal';

const MainAppContent: React.FC = () => {
  const { toastMessage, currentUser } = useApp();
  const isCoach = currentUser.role === 'head_coach' || currentUser.role === 'assistant_coach';
  const isParent = currentUser.role === 'parent';

  const [currentTab, setCurrentTab] = useState<string>(() => (isCoach ? 'planner' : 'calendar'));
  const [isSocialAuthOpen, setIsSocialAuthOpen] = useState<boolean>(false);

  // Enforce strict role separation:
  // - Parents only have access to Kalender & Aufgaben
  // - Players never have access to Trainingsplan
  useEffect(() => {
    if (isParent && currentTab !== 'calendar') {
      setCurrentTab('calendar');
    } else if (!isCoach && currentTab === 'planner') {
      setCurrentTab('calendar');
    }
  }, [isCoach, isParent, currentTab]);

  const getHeaderCopy = () => {
    if (isCoach && currentTab === 'planner') {
      return {
        title: 'Trainingsplanung',
        subtitle: 'Übungen auswählen, auf Teilnehmerzahl anpassen und direkt für die Einheit speichern.'
      };
    }
    if (currentTab === 'diagnostics') {
      return {
        title: isCoach ? 'Leistungsdiagnostik' : 'Meine Fitness & Tests',
        subtitle: isCoach
          ? 'Cooper Test, Piep-Test, 20m Sprint, Standweitsprung, Bankdrücken und Burpees im Saisonverlauf.'
          : 'Deine persönlichen Ergebnisse aus den 6 Mannschafts-Feldtests.'
      };
    }
    if (currentTab === 'rpe') {
      return {
        title: isCoach ? 'Spieler-Feedback (RPE)' : 'Mein Trainings-Feedback',
        subtitle: isCoach
          ? 'Vertrauliche Auswertung des Team-Empfindens nach dem Training.'
          : 'Kurze Selbsteinschätzung für deinen Trainer — für Mitspieler nicht sichtbar.'
      };
    }
    return {
      title: 'Kalender & Aufgaben',
      subtitle: 'Termine, schnelle Zu- oder Absagen sowie Übersicht aller Teamdienste.'
    };
  };

  const { title, subtitle } = getHeaderCopy();

  return (
    <div className="min-h-screen bg-[#0b0f19] text-slate-100 flex flex-col selection:bg-sky-500 selection:text-white">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 border border-sky-500/50 text-white px-4 py-3 rounded-xl shadow-2xl flex items-center gap-3 text-xs">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar Navigation */}
      <Header
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        onOpenSocialAuth={() => setIsSocialAuthOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-5 space-y-5">
        {/* Compact, clear Page Title Bar */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 pb-3 border-b border-slate-800/80">
          <div>
            <div className="text-xs text-slate-400">
              SG Handball Westfalen · 1. Herren · Saison 2026/27
            </div>
            <h1 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight mt-0.5">
              {title}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>
          </div>
        </div>

        {/* Role-gated Views */}
        {isCoach && currentTab === 'planner' && <TrainingPlanner />}
        {!isParent && currentTab === 'diagnostics' && <DiagnosticsModule />}
        {!isParent && currentTab === 'rpe' && <RpeFeedbackModule />}
        {currentTab === 'calendar' && <TeamCalendarAndAttendance />}
      </main>

      {/* Social Login & Registration Modal */}
      <SocialAuthModal
        isOpen={isSocialAuthOpen}
        onClose={() => setIsSocialAuthOpen(false)}
      />

      {/* Quiet Footer */}
      <footer className="border-t border-slate-800/80 py-5 px-4 sm:px-6 text-xs text-slate-500 bg-slate-950/40">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>HandballCoach Pro · SG Handball Westfalen</span>
          <span>Datenschutz nach DSGVO (getrennte Trainer- und Spielerzugriffe)</span>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainAppContent />
    </AppProvider>
  );
}
