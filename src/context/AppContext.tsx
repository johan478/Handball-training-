import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  UserProfile, 
  Exercise, 
  TrainingSession, 
  PlayerDiagnosticRecord, 
  PlayerRpeFeedback, 
  CalendarEvent, 
  TeamTask 
} from '../types';
import { 
  MOCK_USERS, 
  MOCK_EXERCISES, 
  MOCK_TRAINING_SESSIONS, 
  MOCK_DIAGNOSTICS, 
  MOCK_RPE_FEEDBACK, 
  MOCK_CALENDAR_EVENTS, 
  MOCK_TEAM_TASKS 
} from '../data/mockData';

interface AppContextType {
  currentUser: UserProfile;
  switchUser: (userId: string) => void;
  users: UserProfile[];
  
  exercises: Exercise[];
  addCustomExercise: (exercise: Exercise) => void;
  addExerciseToSession: (exercise: Exercise) => void;
  removeExerciseFromSession: (exerciseId: string) => void;
  activeSession: TrainingSession;
  updateActiveSessionNotes: (notes: string) => void;
  
  livePlayerCount: number;
  setLivePlayerCount: (count: number) => void;
  
  diagnostics: PlayerDiagnosticRecord[];
  addDiagnostic: (record: PlayerDiagnosticRecord) => void;
  
  rpeFeedbacks: PlayerRpeFeedback[];
  submitRpeFeedback: (data: Omit<PlayerRpeFeedback, 'id' | 'submittedAt'>) => void;
  
  calendarEvents: CalendarEvent[];
  updateEventRsvp: (eventId: string, status: 'yes' | 'no' | 'maybe', reason?: string) => void;
  
  tasks: TeamTask[];
  toggleTaskStatus: (taskId: string) => void;
  assignTask: (task: Omit<TeamTask, 'id'>) => void;
  
  isOfflineMode: boolean;
  toggleOfflineMode: () => void;
  syncPendingCount: number;
  
  // Notification toast
  toastMessage: string | null;
  showToast: (msg: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Persistence via localStorage for offline realism
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('hc_current_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_USERS[0]; // Default Marcus (Head Coach)
  });

  const [exercises, setExercises] = useState<Exercise[]>(() => {
    const savedCustom = localStorage.getItem('hc_custom_exercises');
    if (savedCustom) {
      try {
        const parsed = JSON.parse(savedCustom);
        if (Array.isArray(parsed)) {
          return [...parsed, ...MOCK_EXERCISES];
        }
      } catch (e) { /* fallback */ }
    }
    return MOCK_EXERCISES;
  });
  const [activeSession, setActiveSession] = useState<TrainingSession>(() => {
    const saved = localStorage.getItem('hc_active_session');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_TRAINING_SESSIONS[0];
  });

  const [livePlayerCount, setLivePlayerCount] = useState<number>(12);
  const [diagnostics, setDiagnostics] = useState<PlayerDiagnosticRecord[]>(() => {
    const saved = localStorage.getItem('hc_diagnostics_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && typeof parsed[0]?.metrics?.cooperMeters === 'number') {
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    return MOCK_DIAGNOSTICS;
  });

  const [rpeFeedbacks, setRpeFeedbacks] = useState<PlayerRpeFeedback[]>(() => {
    const saved = localStorage.getItem('hc_rpe');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_RPE_FEEDBACK;
  });

  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem('hc_events_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0 && Array.isArray(parsed[0]?.attendees)) {
          return parsed;
        }
      } catch (e) { /* fallback */ }
    }
    return MOCK_CALENDAR_EVENTS;
  });

  const [tasks, setTasks] = useState<TeamTask[]>(() => {
    const saved = localStorage.getItem('hc_tasks');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) { /* fallback */ }
    }
    return MOCK_TEAM_TASKS;
  });

  const [isOfflineMode, setIsOfflineMode] = useState<boolean>(false);
  const [syncPendingCount, setSyncPendingCount] = useState<number>(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3800);
  };

  const switchUser = (userId: string) => {
    const found = MOCK_USERS.find(u => u.id === userId);
    if (found) {
      setCurrentUser(found);
      localStorage.setItem('hc_current_user', JSON.stringify(found));
      showToast(`Rolle gewechselt zu: ${found.name} (${found.role === 'head_coach' ? 'Cheftrainer' : found.role === 'player' ? `Spieler #${found.jerseyNumber}` : found.role === 'assistant_coach' ? 'Co-Trainer' : 'Elternteil'})`);
    }
  };

  const addExerciseToSession = (exercise: Exercise) => {
    if (activeSession.exercises.some(e => e.id === exercise.id)) {
      showToast(`"${exercise.title}" ist bereits im Trainingsplan enthalten.`);
      return;
    }
    const updatedExercises = [...activeSession.exercises, exercise];
    const newDuration = updatedExercises.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgScore = updatedExercises.reduce((acc, curr) => acc + curr.intensityScore, 0) / updatedExercises.length;
    
    const updated: TrainingSession = {
      ...activeSession,
      exercises: updatedExercises,
      totalDurationMinutes: newDuration,
      calculatedLoadScore: Number(avgScore.toFixed(1))
    };
    setActiveSession(updated);
    localStorage.setItem('hc_active_session', JSON.stringify(updated));
    showToast(`Übung hinzugefügt: ${exercise.title}`);
  };

  const removeExerciseFromSession = (exerciseId: string) => {
    const updatedExercises = activeSession.exercises.filter(e => e.id !== exerciseId);
    const newDuration = updatedExercises.reduce((acc, curr) => acc + curr.durationMinutes, 0);
    const avgScore = updatedExercises.length 
      ? updatedExercises.reduce((acc, curr) => acc + curr.intensityScore, 0) / updatedExercises.length 
      : 0;

    const updated: TrainingSession = {
      ...activeSession,
      exercises: updatedExercises,
      totalDurationMinutes: newDuration,
      calculatedLoadScore: Number(avgScore.toFixed(1))
    };
    setActiveSession(updated);
    localStorage.setItem('hc_active_session', JSON.stringify(updated));
    showToast('Übung aus Trainingsplan entfernt.');
  };

  const updateActiveSessionNotes = (notes: string) => {
    const updated = { ...activeSession, notes };
    setActiveSession(updated);
    localStorage.setItem('hc_active_session', JSON.stringify(updated));
  };

  const addDiagnostic = (record: PlayerDiagnosticRecord) => {
    const updated = [record, ...diagnostics];
    setDiagnostics(updated);
    localStorage.setItem('hc_diagnostics_v2', JSON.stringify(updated));
    if (isOfflineMode) {
      setSyncPendingCount(prev => prev + 1);
      showToast('Offline erfasst: Messung wird bei Netzverbindung automatisch synchronisiert.');
    } else {
      showToast(`Leistungstest für ${record.playerName} erfolgreich dokumentiert.`);
    }
  };

  const submitRpeFeedback = (data: Omit<PlayerRpeFeedback, 'id' | 'submittedAt'>) => {
    const newFeedback: PlayerRpeFeedback = {
      ...data,
      id: `rpe-${Date.now()}`,
      submittedAt: new Date().toISOString()
    };
    const updated = [newFeedback, ...rpeFeedbacks];
    setRpeFeedbacks(updated);
    localStorage.setItem('hc_rpe', JSON.stringify(updated));
    if (isOfflineMode) {
      setSyncPendingCount(prev => prev + 1);
      showToast('Offline gespeichert: RPE-Selbsteinschätzung wird synchronisiert, sobald online.');
    } else {
      showToast('RPE-Feedback übermittelt. Nur für das Trainerteam einsehbar.');
    }
  };

  const updateEventRsvp = (eventId: string, status: 'yes' | 'no' | 'maybe', reason?: string) => {
    const targetPlayerId = currentUser.isParentOf || (currentUser.role === 'player' ? currentUser.id : null);

    setCalendarEvents(prev => {
      const nextEvents = prev.map(evt => {
        if (evt.id !== eventId) return evt;

        const existingList = evt.attendees ? [...evt.attendees] : [];
        let updatedAttendees = existingList;
        const existingIndex = targetPlayerId
          ? existingList.findIndex(a => a.playerId === targetPlayerId)
          : -1;

        if (targetPlayerId && existingIndex >= 0) {
          const updatedEntry = {
            ...existingList[existingIndex],
            status,
            reason: status === 'yes' ? undefined : reason,
            updatedAt: new Date().toISOString()
          };
          updatedAttendees = existingList.map((a, idx) => (idx === existingIndex ? updatedEntry : a));

          const attendeesCount = {
            yes: updatedAttendees.filter(a => a.status === 'yes').length,
            no: updatedAttendees.filter(a => a.status === 'no').length,
            maybe: updatedAttendees.filter(a => a.status === 'maybe' || a.status === 'unanswered').length
          };

          if (evt.linkedTrainingSessionId === activeSession.id) {
            setLivePlayerCount(attendeesCount.yes);
          }

          return {
            ...evt,
            attendees: updatedAttendees,
            attendeesCount,
            userRsvp: status,
            userRsvpReason: reason
          };
        }

        // Fallback if a coach updates RSVP directly
        const prevStatus = evt.userRsvp;
        const attendees = { ...evt.attendeesCount };
        if (prevStatus === 'yes') attendees.yes = Math.max(0, attendees.yes - 1);
        if (prevStatus === 'no') attendees.no = Math.max(0, attendees.no - 1);
        if (prevStatus === 'maybe') attendees.maybe = Math.max(0, attendees.maybe - 1);

        if (status === 'yes') attendees.yes += 1;
        if (status === 'no') attendees.no += 1;
        if (status === 'maybe') attendees.maybe += 1;

        if (evt.linkedTrainingSessionId === activeSession.id && status === 'yes') {
          setLivePlayerCount(attendees.yes);
        }

        return {
          ...evt,
          userRsvp: status,
          userRsvpReason: reason,
          attendeesCount: attendees
        };
      });

      localStorage.setItem('hc_events_v2', JSON.stringify(nextEvents));
      return nextEvents;
    });
    showToast(`Rückmeldung aktualisiert: ${status === 'yes' ? 'Zugesagt' : status === 'no' ? 'Abgesagt' : 'Unsicher'}`);
  };

  const toggleTaskStatus = (taskId: string) => {
    setTasks(prev => {
      const updated = prev.map(t => t.id === taskId ? { ...t, isCompleted: !t.isCompleted } : t);
      localStorage.setItem('hc_tasks', JSON.stringify(updated));
      return updated;
    });
    showToast('Aufgabenstatus aktualisiert.');
  };

  const assignTask = (taskData: Omit<TeamTask, 'id'>) => {
    const newTask: TeamTask = {
      ...taskData,
      id: `task-${Date.now()}`
    };
    const updated = [newTask, ...tasks];
    setTasks(updated);
    localStorage.setItem('hc_tasks', JSON.stringify(updated));
    showToast(`Aufgabe "${newTask.title}" erfolgreich zugewiesen.`);
  };

  const addCustomExercise = (newExercise: Exercise) => {
    const exerciseWithMeta: Exercise = {
      ...newExercise,
      isCustom: true,
      authorName: currentUser.name
    };
    setExercises(prev => {
      const updated = [exerciseWithMeta, ...prev];
      const customOnly = updated.filter(e => e.isCustom);
      localStorage.setItem('hc_custom_exercises', JSON.stringify(customOnly));
      return updated;
    });

    if (isOfflineMode) {
      setSyncPendingCount(prev => prev + 1);
      showToast(`Übung "${newExercise.title}" offline gespeichert. Wird synchronisiert, sobald online.`);
    } else {
      showToast(`Eigene Übung "${newExercise.title}" erfolgreich in Lehrgangs-Datenbank gespeichert!`);
    }
  };

  const toggleOfflineMode = () => {
    setIsOfflineMode(prev => {
      const next = !prev;
      if (!next && syncPendingCount > 0) {
        showToast(`Online! ${syncPendingCount} lokale Datensätze erfolgreich synchronisiert.`);
        setSyncPendingCount(0);
      } else if (next) {
        showToast('Offline-Modus aktiviert (Service Worker & IndexedDB Cache aktiv).');
      }
      return next;
    });
  };

  return (
    <AppContext.Provider value={{
      currentUser,
      switchUser,
      users: MOCK_USERS,
      exercises,
      addCustomExercise,
      addExerciseToSession,
      removeExerciseFromSession,
      activeSession,
      updateActiveSessionNotes,
      livePlayerCount,
      setLivePlayerCount,
      diagnostics,
      addDiagnostic,
      rpeFeedbacks,
      submitRpeFeedback,
      calendarEvents,
      updateEventRsvp,
      tasks,
      toggleTaskStatus,
      assignTask,
      isOfflineMode,
      toggleOfflineMode,
      syncPendingCount,
      toastMessage,
      showToast
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
