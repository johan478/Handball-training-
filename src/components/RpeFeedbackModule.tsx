import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Lock, 
  Send, 
  CheckCircle2, 
  AlertCircle, 
  Moon, 
  UserCheck
} from 'lucide-react';

export const RpeFeedbackModule: React.FC = () => {
  const { currentUser, activeSession, rpeFeedbacks, submitRpeFeedback } = useApp();

  const isCoach = currentUser.role === 'head_coach' || currentUser.role === 'assistant_coach';

  // State for Player feedback submission
  const [rpeScore, setRpeScore] = useState<number>(7);
  const [sorenessLocation, setSorenessLocation] = useState<string>('');
  const [sleepQuality, setSleepQuality] = useState<number>(4);
  const [fatigueLevel, setFatigueLevel] = useState<number>(3);
  const [playerNotes, setPlayerNotes] = useState('');
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  // Check if current player already submitted for this session
  const playerExistingFeedback = useMemo(() => {
    return rpeFeedbacks.find(
      f => f.playerId === currentUser.id && f.trainingSessionId === activeSession.id
    );
  }, [rpeFeedbacks, currentUser.id, activeSession.id]);

  // Coach calculations: team average RPE, acute workload, soreness distribution
  const teamMetrics = useMemo(() => {
    if (rpeFeedbacks.length === 0) {
      return { avgRpe: 0, count: 0, highLoadCount: 0, sorenessIssues: [] };
    }
    const sum = rpeFeedbacks.reduce((acc, f) => acc + f.rpeScore, 0);
    const avg = sum / rpeFeedbacks.length;
    const highLoad = rpeFeedbacks.filter(f => f.rpeScore >= 8);
    const withSoreness = rpeFeedbacks.filter(
      f => f.sorenessLocation && f.sorenessLocation.trim() !== '' && f.sorenessLocation.trim().toLowerCase() !== 'keine'
    );

    return {
      avgRpe: Number(avg.toFixed(1)),
      count: rpeFeedbacks.length,
      highLoadCount: highLoad.length,
      sorenessIssues: withSoreness
    };
  }, [rpeFeedbacks]);

  const handlePlayerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRpeFeedback({
      trainingSessionId: activeSession.id,
      trainingTitle: activeSession.title,
      trainingDate: activeSession.date,
      playerId: currentUser.id,
      playerName: currentUser.name,
      rpeScore,
      sorenessLocation: sorenessLocation.trim() || 'keine',
      sleepQuality,
      fatigueLevel,
      playerNotes
    });
    setSubmittedSuccess(true);
  };

  const getRpeDescription = (score: number) => {
    switch (score) {
      case 1: return '1 - Kaum spürbar (sehr leichtes Traben / Dehnen)';
      case 2: return '2 - Sehr leicht (lockeres Warm-up)';
      case 3: return '3 - Leicht (angenehmes Passtraining ohne Hektik)';
      case 4: return '4 - Mäßig (Taktikdurchlauf mit Pausen)';
      case 5: return '5 - Spürbar (solides Formationsspiel)';
      case 6: return '6 - Etwas anstrengend (erhöhter Puls, leichte Ermüdung)';
      case 7: return '7 - Anstrengend (hohe Intensität, schwere Beine)';
      case 8: return '8 - Sehr anstrengend (hartes Tempospiel, Laktat spürbar)';
      case 9: return '9 - Extrem anstrengend (nahe Maximalgrenze)';
      case 10: return '10 - Totale Erschöpfung / All-out (nichts geht mehr)';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Privacy Notice Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center gap-3">
        <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 shrink-0">
          <Lock className="w-4 h-4" />
        </div>
        <div>
          <div className="text-sm font-bold text-white">
            Vertraulich · Nur für das Trainerteam sichtbar
          </div>
          <p className="text-xs text-slate-400">
            Mitspieler und Eltern können keine Rückmeldungen anderer Teammitglieder einsehen.
          </p>
        </div>
      </div>

      {/* VIEW CONDITIONAL ON ROLE: */}
      {isCoach ? (
        /* COACH VIEW: Team Aggregation & High-Risk Overload Dashboard */
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">Team-Durchschnitt RPE</div>
              <div className="text-2xl font-bold text-white tabular-nums flex items-baseline gap-2">
                <span>{teamMetrics.avgRpe}</span>
                <span className="text-xs font-normal text-slate-400">/ 10</span>
              </div>
              <div className="text-[11px] text-amber-400 pt-1">
                {teamMetrics.avgRpe >= 7.5 ? 'Hohe Belastungswoche' : 'Im optimalen Trainingskorridor'}
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">Eingegangene Rückmeldungen</div>
              <div className="text-2xl font-bold text-white tabular-nums">
                {teamMetrics.count} <span className="text-xs font-normal text-slate-400">von 14 Spielern</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Rücklaufquote: {Math.round((teamMetrics.count / 14) * 100)}%
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">Hohe Belastung (&ge; RPE 8)</div>
              <div className="text-2xl font-bold text-rose-400 tabular-nums">
                {teamMetrics.highLoadCount} <span className="text-xs font-normal text-slate-400">Spieler</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Präventive Regeneration prüfen
              </div>
            </div>

            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-1">
              <div className="text-xs text-slate-400">Gemeldete Schmerzpunkte</div>
              <div className="text-2xl font-bold text-amber-400 tabular-nums">
                {teamMetrics.sorenessIssues.length} <span className="text-xs font-normal text-slate-400">Spieler</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1">
                Physio / Warm-up anpassen
              </div>
            </div>
          </div>

          {/* Coach's Protected Feedback Table */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Einzelauswertung Spieler-Feedback (Nur Trainer-Zugriff)
                </h3>
                <p className="text-xs text-slate-400">
                  Einheit: {activeSession.title} ({activeSession.date})
                </p>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-sky-400 bg-sky-950/40 px-3 py-1 rounded-lg border border-sky-800/40">
                <UserCheck className="w-3.5 h-3.5" />
                <span>Geschützte Traineransicht</span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                  <tr>
                    <th className="py-2.5 px-3 font-semibold">Spieler</th>
                    <th className="py-2.5 px-3 font-semibold">RPE-Belastung</th>
                    <th className="py-2.5 px-3 font-semibold">Schmerz / Muskelkater</th>
                    <th className="py-2.5 px-3 font-semibold">Schlaf / Erholung</th>
                    <th className="py-2.5 px-3 font-semibold">Persönliche Notiz an Trainer</th>
                    <th className="py-2.5 px-3 font-semibold text-right">Eingereicht</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {rpeFeedbacks.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-3 font-medium text-white flex items-center gap-2">
                        <span>{item.playerName}</span>
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-0.5 rounded font-bold tabular-nums ${
                            item.rpeScore >= 8 
                              ? 'bg-rose-950 text-rose-300 border border-rose-800/50' 
                              : item.rpeScore >= 6 
                              ? 'bg-amber-950 text-amber-300 border border-amber-800/50' 
                              : 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                          }`}>
                            RPE {item.rpeScore}
                          </span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">
                            {item.rpeScore >= 8 ? 'Sehr hart' : item.rpeScore >= 6 ? 'Mäßig hart' : 'Locker'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3">
                        {!item.sorenessLocation || item.sorenessLocation.trim() === '' || item.sorenessLocation.trim().toLowerCase() === 'keine' ? (
                          <span className="text-slate-500">Keine Beschwerden</span>
                        ) : (
                          <span className="text-amber-400 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            <span>{item.sorenessLocation}</span>
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Moon 
                              key={star} 
                              className={`w-3.5 h-3.5 ${star <= item.sleepQuality ? 'text-sky-400 fill-sky-400' : 'text-slate-600'}`} 
                            />
                          ))}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-slate-300 italic max-w-xs truncate">
                        {item.playerNotes ? `„${item.playerNotes}“` : '—'}
                      </td>
                      <td className="py-3 px-3 text-right text-slate-500 text-[11px] tabular-nums">
                        {new Date(item.submittedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} Uhr
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (
        /* PLAYER / PARENT VIEW: Personal Self-Assessment Form */
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-sky-400 font-semibold">Training: {activeSession.title}</span>
                <h3 className="text-base font-bold text-white">Deine persönliche Selbsteinschätzung</h3>
              </div>
              <span className="text-xs text-slate-400">{activeSession.date}</span>
            </div>

            {playerExistingFeedback || submittedSuccess ? (
              <div className="p-6 bg-emerald-950/20 border border-emerald-800/40 rounded-xl space-y-3 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="text-sm font-bold text-white">Rückmeldung erfolgreich übermittelt!</h4>
                <p className="text-xs text-slate-300 max-w-md mx-auto">
                  Vielen Dank für dein Feedback. Dein Trainerteam nutzt diese Daten, um die Intensität vor dem nächsten Spiel optimal zu steuern.
                </p>
                <div className="pt-2 text-xs text-slate-400">
                  Dein übermittelter Belastungswert: <strong>RPE {playerExistingFeedback?.rpeScore || rpeScore}/10</strong>
                </div>
              </div>
            ) : (
              <form onSubmit={handlePlayerSubmit} className="space-y-6">
                
                {/* Borg CR10 Scale: 1-Tap Buttons + Slider */}
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-semibold text-white">
                      1. Wie anstrengend war das Training? (1 = sehr leicht, 10 = maximal)
                    </label>
                    <span className="text-base font-extrabold text-sky-400 tabular-nums">
                      {rpeScore} / 10
                    </span>
                  </div>

                  <div className="grid grid-cols-5 sm:grid-cols-10 gap-1.5">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                      <button
                        key={num}
                        type="button"
                        onClick={() => setRpeScore(num)}
                        className={`py-2 rounded-lg text-xs font-bold tabular-nums transition-colors ${
                          rpeScore === num
                            ? num >= 8
                              ? 'bg-rose-600 text-white'
                              : num >= 6
                              ? 'bg-amber-600 text-white'
                              : 'bg-emerald-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="1"
                    value={rpeScore}
                    onChange={(e) => setRpeScore(Number(e.target.value))}
                    className="w-full accent-sky-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
                  />

                  <div className="p-2.5 bg-slate-800/80 rounded-lg border border-slate-700 text-xs font-medium text-slate-200">
                    {getRpeDescription(rpeScore)}
                  </div>
                </div>

                {/* Free-text Soreness / Pain Location Input */}
                <div className="space-y-1.5">
                  <label htmlFor="soreness-input" className="text-xs font-semibold text-white block">
                    2. Hast du Schmerzen oder Muskelkater? Stelle eintippen (optional)
                  </label>
                  <input
                    id="soreness-input"
                    type="text"
                    value={sorenessLocation}
                    onChange={(e) => setSorenessLocation(e.target.value)}
                    placeholder="z. B. linkes Knie, rechte Wurfschulter, Wade — oder leer lassen"
                    className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                {/* Sleep & Fatigue */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white block">
                      3. Schlafqualität der letzten Nacht (1-5)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setSleepQuality(level)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                            sleepQuality === level 
                              ? 'bg-sky-600 text-white' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-white block">
                      4. Allgemeine Tages-Ermüdung (1-5)
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((level) => (
                        <button
                          key={level}
                          type="button"
                          onClick={() => setFatigueLevel(level)}
                          className={`w-9 h-9 rounded-lg flex items-center justify-center font-bold text-xs transition-colors ${
                            fatigueLevel === level 
                              ? 'bg-amber-600 text-white' 
                              : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                          }`}
                        >
                          {level}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Personal Notes to Coach */}
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-white block">
                    5. Vertrauliche Notiz an das Trainerteam (optional)
                  </label>
                  <textarea
                    rows={2}
                    value={playerNotes}
                    onChange={(e) => setPlayerNotes(e.target.value)}
                    placeholder="Z. B. leichte Zerrung, früher gehen müssen oder Wünsche für die nächste Taktik..."
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg transition-colors"
                >
                  <Send className="w-4 h-4" />
                  <span>Feedback vertraulich an Trainer übermitteln</span>
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
