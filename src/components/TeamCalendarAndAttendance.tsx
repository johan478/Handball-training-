import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { CalendarEvent, TeamTask, TaskType } from '../types';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  Shirt, 
  Car, 
  ClipboardList, 
  Apple, 
  RotateCcw, 
  Plus, 
  Users, 
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TeamCalendarAndAttendance: React.FC = () => {
  const { 
    currentUser, 
    calendarEvents, 
    updateEventRsvp, 
    tasks, 
    toggleTaskStatus, 
    assignTask,
    users 
  } = useApp();

  const isCoach = currentUser.role === 'head_coach' || currentUser.role === 'assistant_coach';

  const [activeTab, setActiveTab] = useState<'events' | 'tasks'>('events');
  const [taskScope, setTaskScope] = useState<'all' | 'mine'>('all');
  const [isAssigningTask, setIsAssigningTask] = useState(false);
  const [expandedEventIds, setExpandedEventIds] = useState<Record<string, boolean>>({});

  // New task form
  const [taskForm, setTaskForm] = useState({
    type: 'trikotwaesche' as TaskType,
    title: '',
    description: '',
    assignedPlayerId: users.find(u => u.role === 'player')?.id || 'user-player-1',
    dueDate: '2026-10-30',
    eventDate: '2026-10-28',
    rotationNote: 'Automatische Rotation nach Trikotnummer'
  });

  const targetMemberId = currentUser.isParentOf || currentUser.id;
  const myOpenTasks = tasks.filter(
    t => !t.isCompleted && t.assignedPlayerId === targetMemberId
  );
  const visibleTasks = taskScope === 'mine'
    ? tasks.filter(t => t.assignedPlayerId === targetMemberId)
    : tasks;
  const nextEvent = calendarEvents[0];

  const getEffectiveRsvp = (evt: CalendarEvent) => {
    if (!isCoach && evt.attendees) {
      const match = evt.attendees.find(a => a.playerId === targetMemberId);
      if (match) return match.status;
    }
    return evt.userRsvp;
  };

  const nextEventRsvp = nextEvent ? getEffectiveRsvp(nextEvent) : 'unanswered';

  const toggleEventAttendees = (eventId: string) => {
    setExpandedEventIds(prev => ({ ...prev, [eventId]: !prev[eventId] }));
  };

  const getTaskIcon = (type: TaskType) => {
    switch (type) {
      case 'trikotwaesche': return <Shirt className="w-4 h-4 text-emerald-400" />;
      case 'fahrdienst': return <Car className="w-4 h-4 text-sky-400" />;
      case 'kampfgericht': return <ClipboardList className="w-4 h-4 text-amber-400" />;
      case 'verpflegung': return <Apple className="w-4 h-4 text-rose-400" />;
      case 'harz_baelle': return <RotateCcw className="w-4 h-4 text-purple-400" />;
    }
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    const assignedPlayer = users.find(u => u.id === taskForm.assignedPlayerId);
    assignTask({
      type: taskForm.type,
      title: taskForm.title || `Dienst: ${taskForm.type}`,
      description: taskForm.description,
      assignedPlayerId: taskForm.assignedPlayerId,
      assignedPlayerName: assignedPlayer ? `${assignedPlayer.name} (#${assignedPlayer.jerseyNumber})` : 'Spieler',
      dueDate: taskForm.dueDate,
      eventDate: taskForm.eventDate,
      isCompleted: false,
      rotationNote: taskForm.rotationNote
    });
    setIsAssigningTask(false);
  };

  return (
    <div className="space-y-5">
      {/* Quick Status Bar: Next Event + Open Duties */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {nextEvent && (
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <div className="text-[11px] font-semibold text-sky-400">Nächster Termin</div>
              <div className="text-sm font-bold text-white truncate">{nextEvent.title}</div>
              <div className="text-xs text-slate-400 tabular-nums">
                {nextEvent.date} · {nextEvent.time} · Treffpunkt {nextEvent.meetingTime}
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-xs font-semibold shrink-0 ${
                nextEventRsvp === 'yes'
                  ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-700/40'
                  : nextEventRsvp === 'no'
                  ? 'bg-rose-950/60 text-rose-300 border border-rose-700/40'
                  : 'bg-amber-950/60 text-amber-300 border border-amber-700/40'
              }`}
            >
              {nextEventRsvp === 'yes'
                ? '✓ Zugesagt'
                : nextEventRsvp === 'no'
                ? '✕ Abgesagt'
                : 'Rückmeldung offen'}
            </span>
          </div>
        )}

        <div className="bg-slate-900/90 border border-slate-800 rounded-xl px-4 py-3 flex items-center justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-slate-400">Aufgaben & Dienste</div>
            <div className="text-sm font-bold text-white">
              {myOpenTasks.length > 0
                ? `${myOpenTasks.length} offene Aufgabe${myOpenTasks.length > 1 ? 'n' : ''} für dich`
                : `${tasks.filter(t => !t.isCompleted).length} offene Team-Aufgaben`}
            </div>
            <div className="text-xs text-slate-400 tabular-nums">
              {tasks.filter(t => t.isCompleted).length} von {tasks.length} Diensten erledigt
            </div>
          </div>
          <button
            type="button"
            onClick={() => {
              setActiveTab('tasks');
              if (myOpenTasks.length > 0) setTaskScope('mine');
            }}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-sky-400 rounded-lg text-xs font-semibold shrink-0 transition-colors"
          >
            {myOpenTasks.length > 0 ? 'Meine Dienste →' : 'Zum Dienstplan →'}
          </button>
        </div>
      </div>

      {/* Top Segmented Controls: Kalender vs Aufgabenverteiler */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg w-full sm:w-auto">
          <button
            type="button"
            onClick={() => setActiveTab('events')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'events' 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Termine & Rückmeldung
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('tasks')}
            className={`flex-1 sm:flex-initial px-4 py-2 text-xs font-semibold rounded-md transition-colors ${
              activeTab === 'tasks' 
                ? 'bg-sky-600 text-white shadow-sm' 
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Aufgaben & Dienste
          </button>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          {activeTab === 'tasks' && (
            <div className="flex items-center gap-1 p-1 bg-slate-800 rounded-lg">
              <button
                type="button"
                onClick={() => setTaskScope('all')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  taskScope === 'all' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Alle ({tasks.length})
              </button>
              <button
                type="button"
                onClick={() => setTaskScope('mine')}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors ${
                  taskScope === 'mine' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                Meine ({tasks.filter(t => t.assignedPlayerId === targetMemberId).length})
              </button>
            </div>
          )}

          {activeTab === 'tasks' && isCoach && (
            <button
              type="button"
              onClick={() => setIsAssigningTask(true)}
              className="px-3.5 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Dienst einteilen</span>
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: CALENDAR & ATTENDANCE */}
      {activeTab === 'events' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
          {calendarEvents.map((evt) => {
            const isMatch = evt.type === 'game' || evt.type === 'cup';
            const effectiveRsvp = getEffectiveRsvp(evt);
            const attendeesList = evt.attendees || [];
            const yesPlayers = attendeesList.filter(a => a.status === 'yes');
            const noPlayers = attendeesList.filter(a => a.status === 'no');
            const openPlayers = attendeesList.filter(a => a.status === 'maybe' || a.status === 'unanswered');
            const isExpanded = Boolean(expandedEventIds[evt.id]);

            return (
              <div
                key={evt.id}
                className={`bg-slate-900/90 border rounded-xl p-5 space-y-4 flex flex-col justify-between ${
                  isMatch ? 'border-amber-500/40' : 'border-slate-800'
                }`}
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className={`text-[11px] font-semibold uppercase tracking-wider ${
                      isMatch ? 'text-amber-400' : 'text-sky-400'
                    }`}>
                      {isMatch ? 'Meisterschaftsspiel' : 'Mannschaftstraining'}
                    </span>
                    <span className="text-xs text-slate-400 tabular-nums">
                      {evt.date}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-2">
                    {evt.title}
                  </h3>

                  <div className="space-y-1.5 text-xs text-slate-300">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                      <span>Beginn: <strong>{evt.time}</strong> (Treffpunkt: <strong>{evt.meetingTime}</strong>)</span>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                      <div>
                        <div>{evt.location}</div>
                        <div className="text-[11px] text-slate-500">{evt.address}</div>
                      </div>
                    </div>

                    {evt.notes && (
                      <div className="p-2.5 bg-slate-800/60 rounded-lg border border-slate-700/50 text-slate-300 text-[11px] mt-2">
                        {evt.notes}
                      </div>
                    )}
                  </div>
                </div>

                {/* Attendance Roster Summary + Coach-Only Player Names + 1-Click RSVP */}
                <div className="pt-3 border-t border-slate-800 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-sky-400" />
                      <span>Kader:</span>
                    </span>
                    <div className="flex items-center gap-2 font-semibold">
                      <span className="text-emerald-400 tabular-nums">{evt.attendeesCount.yes} Zu</span>
                      <span>·</span>
                      <span className="text-rose-400 tabular-nums">{evt.attendeesCount.no} Ab</span>
                      <span>·</span>
                      <span className="text-amber-400 tabular-nums">{evt.attendeesCount.maybe} Offen</span>
                    </div>
                  </div>

                  {/* COACH ONLY: Detailed list of which players accepted / declined / are unsure */}
                  {isCoach && attendeesList.length > 0 && (
                    <div className="bg-slate-800/60 border border-slate-700/70 rounded-lg p-2.5 space-y-2">
                      <button
                        type="button"
                        onClick={() => toggleEventAttendees(evt.id)}
                        className="w-full flex items-center justify-between text-xs font-semibold text-sky-300 hover:text-sky-200 transition-colors"
                      >
                        <span>Spieler-Zusagen anzeigen ({yesPlayers.length} zugesagt)</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                      </button>

                      {!isExpanded && yesPlayers.length > 0 && (
                        <div className="text-[11px] text-slate-300 leading-relaxed line-clamp-2">
                          <span className="text-emerald-400 font-semibold">Dabei: </span>
                          {yesPlayers.map(p => p.playerName.split(' (')[0]).join(', ')}
                        </div>
                      )}

                      {isExpanded && (
                        <div className="space-y-2.5 pt-2 border-t border-slate-700/60 text-[11px] max-h-60 overflow-y-auto pr-1">
                          <div>
                            <div className="font-semibold text-emerald-400 mb-1">
                              Zugesagt ({yesPlayers.length})
                            </div>
                            {yesPlayers.length === 0 ? (
                              <div className="text-slate-500">Noch keine Zusagen</div>
                            ) : (
                              <div className="flex flex-wrap gap-1">
                                {yesPlayers.map(p => (
                                  <span
                                    key={p.playerId}
                                    className="px-2 py-0.5 bg-emerald-950/50 border border-emerald-800/40 text-emerald-200 rounded"
                                  >
                                    {p.playerName}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>

                          {noPlayers.length > 0 && (
                            <div>
                              <div className="font-semibold text-rose-400 mb-1">
                                Abgesagt ({noPlayers.length})
                              </div>
                              <ul className="space-y-1 text-slate-300">
                                {noPlayers.map(p => (
                                  <li key={p.playerId} className="flex items-baseline justify-between gap-2">
                                    <span>{p.playerName}</span>
                                    {p.reason && <span className="text-slate-500 text-[10px]">{p.reason}</span>}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {openPlayers.length > 0 && (
                            <div>
                              <div className="font-semibold text-amber-400 mb-1">
                                Unsicher / Offen ({openPlayers.length})
                              </div>
                              <ul className="space-y-1 text-slate-300">
                                {openPlayers.map(p => (
                                  <li key={p.playerId} className="flex items-baseline justify-between gap-2">
                                    <span>{p.playerName}</span>
                                    <span className="text-slate-500 text-[10px]">
                                      {p.reason || (p.status === 'unanswered' ? 'Keine Rückmeldung' : 'Unsicher')}
                                    </span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <div className="text-[11px] text-slate-400">Mit einem Klick rückmelden:</div>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        type="button"
                        onClick={() => updateEventRsvp(evt.id, 'yes')}
                        className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          effectiveRsvp === 'yes'
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        <span>{effectiveRsvp === 'yes' ? 'Zugesagt' : 'Zusagen'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateEventRsvp(evt.id, 'no', 'Verletzt / Verhindert')}
                        className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          effectiveRsvp === 'no'
                            ? 'bg-rose-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>{effectiveRsvp === 'no' ? 'Abgesagt' : 'Absagen'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => updateEventRsvp(evt.id, 'maybe', 'Klärung folgt')}
                        className={`py-2.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-colors ${
                          effectiveRsvp === 'maybe'
                            ? 'bg-amber-600 text-white shadow-sm'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <HelpCircle className="w-3.5 h-3.5" />
                        <span>Unsicher</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TAB 2: AUTOMATED TEAM DUTIES DISTRIBUTOR */}
      {activeTab === 'tasks' && (
        <div className="space-y-4">
          {visibleTasks.length === 0 ? (
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-8 text-center text-xs text-slate-400">
              Aktuell sind dir keine Aufgaben zugewiesen.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {visibleTasks.map((task) => {
                const isMine = task.assignedPlayerId === targetMemberId;
                return (
                  <div
                    key={task.id}
                    className={`bg-slate-900/80 border rounded-xl p-4 space-y-3 transition-colors ${
                      task.isCompleted
                        ? 'border-slate-800 opacity-70'
                        : isMine
                        ? 'border-sky-500/50'
                        : 'border-slate-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center shrink-0 mt-0.5">
                          {getTaskIcon(task.type)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className={`text-sm font-bold ${task.isCompleted ? 'line-through text-slate-400' : 'text-white'}`}>
                              {task.title}
                            </h4>
                            {isMine && !task.isCompleted && (
                              <span className="text-[10px] font-semibold text-sky-400">· Deine Aufgabe</span>
                            )}
                          </div>
                          <p className="text-xs text-slate-400 mt-0.5">{task.description}</p>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => toggleTaskStatus(task.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors ${
                          task.isCompleted
                            ? 'bg-slate-800 text-emerald-400 border border-emerald-800/40'
                            : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-sm'
                        }`}
                      >
                        {task.isCompleted ? '✓ Erledigt' : 'Erledigt'}
                      </button>
                    </div>

                    <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <div>
                        Eingeteilt: <strong className="text-sky-400">{task.assignedPlayerName}</strong>
                      </div>
                      <div>
                        Fällig bis: <strong className="text-slate-200 tabular-nums">{task.dueDate}</strong>
                      </div>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 bg-slate-800/40 px-2 py-1 rounded">
                      <RotateCcw className="w-3 h-3" />
                      <span>{task.rotationNote}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Modal: New Task Assignment */}
      {isAssigningTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-white">Aufgabe zuweisen</h3>
              <button onClick={() => setIsAssigningTask(false)} className="text-slate-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-3.5 text-xs">
              <div>
                <label className="text-slate-400 block mb-1">Aufgaben-Typ</label>
                <select
                  value={taskForm.type}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, type: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="trikotwaesche">Trikotwäsche</option>
                  <option value="fahrdienst">Fahrdienst (Vereinsbus / PKW)</option>
                  <option value="kampfgericht">Kampfgericht (Zeitnehmer / Sekretär)</option>
                  <option value="verpflegung">Verpflegung (Obst & Getränke)</option>
                  <option value="harz_baelle">Harz entfernen & Bälle pumpen</option>
                </select>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Titel</label>
                <input
                  type="text"
                  required
                  placeholder="z. B. Trikotwäsche Grüner Satz"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Zuweisen an Spieler</label>
                <select
                  value={taskForm.assignedPlayerId}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, assignedPlayerId: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  {users.filter(u => u.role === 'player').map(p => (
                    <option key={p.id} value={p.id}>
                      {p.name} (#{p.jerseyNumber} · {p.position})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-slate-400 block mb-1">Fälligkeitsdatum</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, dueDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Spieltermin</label>
                  <input
                    type="date"
                    value={taskForm.eventDate}
                    onChange={(e) => setTaskForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
              </div>

              <div>
                <label className="text-slate-400 block mb-1">Details & Anweisungen</label>
                <textarea
                  rows={2}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Z. B. Bei 30 Grad waschen, kein Weichspüler..."
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAssigningTask(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg"
                >
                  Dienst speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
