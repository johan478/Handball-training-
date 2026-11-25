import React, { useState, useMemo, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { PlayerDiagnosticRecord, DiagnosticMetrics } from '../types';
import { DIAGNOSTIC_TEST_GUIDES } from '../data/mockData';
import { 
  BarChart3, 
  TrendingUp, 
  Plus, 
  User, 
  Target, 
  Zap, 
  Flame, 
  Timer, 
  ShieldCheck, 
  Activity,
  Dumbbell,
  BookOpen,
  Users,
  Calculator,
  CheckCircle2
} from 'lucide-react';

export const DiagnosticsModule: React.FC = () => {
  const { currentUser, diagnostics, addDiagnostic, users } = useApp();

  const isCoach = currentUser.role === 'head_coach' || currentUser.role === 'assistant_coach';

  // Available players (filtered for data privacy: player only sees self)
  const accessiblePlayers = useMemo(() => {
    if (isCoach) {
      return users.filter(u => u.role === 'player');
    }
    return users.filter(u => u.id === currentUser.id || u.id === currentUser.isParentOf);
  }, [currentUser, isCoach, users]);

  const [selectedPlayerId, setSelectedPlayerId] = useState<string>(
    accessiblePlayers[0]?.id || 'user-player-1'
  );

  // Sync selectedPlayerId when switching user roles
  useEffect(() => {
    if (accessiblePlayers.length > 0 && !accessiblePlayers.some(p => p.id === selectedPlayerId)) {
      setSelectedPlayerId(accessiblePlayers[0].id);
    }
  }, [accessiblePlayers, selectedPlayerId]);

  const [activeTab, setActiveTab] = useState<'profile' | 'team' | 'protocols'>('profile');
  const [selectedGuideId, setSelectedGuideId] = useState<keyof DiagnosticMetrics>('cooperMeters');

  // Guard coach-only team tab
  const effectiveTab = !isCoach && activeTab === 'team' ? 'profile' : activeTab;

  const [isAddingTest, setIsAddingTest] = useState(false);
  const [show1RmHelper, setShow1RmHelper] = useState(false);
  const [submaxWeight, setSubmaxWeight] = useState('75');
  const [submaxReps, setSubmaxReps] = useState('6');

  // New Test Form State
  const [newMetrics, setNewMetrics] = useState({
    cooperMeters: '2950',
    piepTestLevel: '11.6',
    sprint20m: '2.91',
    standweitsprung: '256',
    bankdrueckenKg: '90',
    burpees1Min: '34',
    coachNotes: 'Gute Ausdauerbasis und konstante Wiederholungszahl bei den Burpees.',
    testType: 'mid_season' as 'pre_season' | 'mid_season' | 'post_season'
  });

  // Selected player's diagnostics sorted by date
  const playerTests = useMemo(() => {
    return diagnostics
      .filter(d => d.playerId === selectedPlayerId)
      .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
  }, [diagnostics, selectedPlayerId]);

  const preSeasonTest = playerTests.find(t => t.testType === 'pre_season') || playerTests[0];
  const latestTest = playerTests[playerTests.length - 1];
  const hasProgression = playerTests.length > 1;

  const selectedPlayer = users.find(u => u.id === selectedPlayerId) || accessiblePlayers[0];

  // Squad summary for Coach Team Benchmark table
  const squadLatestRecords = useMemo(() => {
    const players = users.filter(u => u.role === 'player');
    return players.map(player => {
      const tests = diagnostics
        .filter(d => d.playerId === player.id)
        .sort((a, b) => new Date(a.testDate).getTime() - new Date(b.testDate).getTime());
      return {
        player,
        latest: tests[tests.length - 1] || null
      };
    });
  }, [users, diagnostics]);

  const teamAverages = useMemo(() => {
    const valid = squadLatestRecords.map(r => r.latest).filter((r): r is PlayerDiagnosticRecord => Boolean(r));
    if (valid.length === 0) return null;
    const avg = (fn: (r: PlayerDiagnosticRecord) => number) =>
      valid.reduce((sum, r) => sum + fn(r), 0) / valid.length;
    return {
      cooperMeters: Math.round(avg(r => r.metrics.cooperMeters)),
      piepTestLevel: Number(avg(r => r.metrics.piepTestLevel).toFixed(1)),
      sprint20m: Number(avg(r => r.metrics.sprint20m).toFixed(2)),
      standweitsprung: Math.round(avg(r => r.metrics.standweitsprung)),
      bankdrueckenKg: Number(avg(r => r.metrics.bankdrueckenKg).toFixed(1)),
      burpees1Min: Math.round(avg(r => r.metrics.burpees1Min))
    };
  }, [squadLatestRecords]);

  // Helper to open protocol details for a specific test
  const openProtocolFor = (id: keyof DiagnosticMetrics) => {
    setSelectedGuideId(id);
    setActiveTab('protocols');
  };

  // Brzycki 1RM calculation
  const calculated1Rm = useMemo(() => {
    const w = parseFloat(submaxWeight) || 0;
    const r = parseInt(submaxReps, 10) || 1;
    if (r <= 1) return w;
    const clampedReps = Math.min(12, Math.max(1, r));
    const est = w / (1.0278 - 0.0278 * clampedReps);
    return Math.round(est * 2) / 2; // round to 0.5 kg
  }, [submaxWeight, submaxReps]);

  // Helper for 6-Axis Hexagon Radar Chart SVG
  const renderRadarChart = () => {
    if (!latestTest) return null;

    const categories = [
      { key: 'grundlagenausdauer', label: 'Cooper (Ausdauer)' },
      { key: 'spielausdauer', label: 'Piep-Test (Intervall)' },
      { key: 'schnelligkeit', label: '20m Sprint' },
      { key: 'sprungkraft', label: 'Standweitsprung' },
      { key: 'oberkoerperkraft', label: 'Bankdrücken' },
      { key: 'kraftausdauer', label: 'Burpees (1 Min)' }
    ];

    const size = 340;
    const center = size / 2;
    const radius = 104;
    const angleStep = (Math.PI * 2) / categories.length;

    const getCoordinates = (scores: Record<string, number>) => {
      return categories.map((cat, i) => {
        const val = scores[cat.key] || 50;
        const r = (val / 100) * radius;
        const angle = i * angleStep - Math.PI / 2;
        const x = center + r * Math.cos(angle);
        const y = center + r * Math.sin(angle);
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ');
    };

    const latestPoints = getCoordinates(latestTest.categoryScores);
    const prePoints = hasProgression && preSeasonTest ? getCoordinates(preSeasonTest.categoryScores) : null;

    return (
      <div className="flex flex-col items-center justify-center p-4 bg-slate-900/60 rounded-xl border border-slate-800">
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="w-full max-w-[340px] h-auto overflow-visible">
          {/* Concentric grid webs */}
          {[0.25, 0.5, 0.75, 1].map((scale, idx) => {
            const gridPoints = categories.map((_, i) => {
              const r = radius * scale;
              const angle = i * angleStep - Math.PI / 2;
              return `${(center + r * Math.cos(angle)).toFixed(1)},${(center + r * Math.sin(angle)).toFixed(1)}`;
            }).join(' ');
            return (
              <polygon
                key={idx}
                points={gridPoints}
                fill="none"
                stroke="#334155"
                strokeWidth={scale === 1 ? 1.5 : 1}
                strokeDasharray={scale === 1 ? 'none' : '3,3'}
              />
            );
          })}

          {/* Axes & Labels */}
          {categories.map((cat, i) => {
            const angle = i * angleStep - Math.PI / 2;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            const labelRadius = radius + 24;
            const labelX = center + labelRadius * Math.cos(angle);
            const labelY = center + labelRadius * Math.sin(angle);

            return (
              <g key={cat.key}>
                <line x1={center} y1={center} x2={x} y2={y} stroke="#334155" strokeWidth="1" />
                <text
                  x={labelX}
                  y={labelY}
                  fill="#94a3b8"
                  fontSize="10.5"
                  textAnchor="middle"
                  alignmentBaseline="middle"
                  className="font-medium"
                >
                  {cat.label}
                </text>
              </g>
            );
          })}

          {/* Baseline polygon (Pre-season if exists) */}
          {prePoints && (
            <polygon
              points={prePoints}
              fill="rgba(56, 189, 248, 0.15)"
              stroke="#38bdf8"
              strokeWidth="2"
              strokeDasharray="4,4"
            />
          )}

          {/* Latest test polygon */}
          <polygon
            points={latestPoints}
            fill="rgba(16, 185, 129, 0.25)"
            stroke="#10b981"
            strokeWidth="2.5"
          />
        </svg>

        {/* Legend */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-3 text-xs text-slate-300">
          {hasProgression && (
            <div className="flex items-center gap-1.5">
              <span className="w-3.5 h-0.5 bg-sky-400 inline-block border-t border-dashed"></span>
              <span>Eingangstest ({preSeasonTest?.testDate})</span>
            </div>
          )}
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-1 bg-emerald-500 rounded-sm inline-block"></span>
            <span>Aktueller Stand ({latestTest?.testDate})</span>
          </div>
        </div>
      </div>
    );
  };

  const handleSaveDiagnostic = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPlayer) return;

    const cooper = parseInt(newMetrics.cooperMeters, 10) || 2800;
    const piep = parseFloat(newMetrics.piepTestLevel) || 11.0;
    const sprint = parseFloat(newMetrics.sprint20m) || 3.0;
    const jump = parseInt(newMetrics.standweitsprung, 10) || 245;
    const bench = parseFloat(newMetrics.bankdrueckenKg) || 85;
    const burpees = parseInt(newMetrics.burpees1Min, 10) || 32;

    const clampScore = (val: number) => Math.min(100, Math.max(10, Math.round(val)));

    const record: PlayerDiagnosticRecord = {
      id: `diag-${Date.now()}`,
      playerId: selectedPlayer.id,
      playerName: selectedPlayer.name,
      position: selectedPlayer.position || 'RL',
      testDate: new Date().toISOString().split('T')[0],
      testType: newMetrics.testType,
      metrics: {
        cooperMeters: cooper,
        piepTestLevel: piep,
        sprint20m: sprint,
        standweitsprung: jump,
        bankdrueckenKg: bench,
        burpees1Min: burpees
      },
      categoryScores: {
        grundlagenausdauer: clampScore(((cooper - 1800) / 1500) * 100),
        spielausdauer: clampScore(((piep - 5.0) / 8.5) * 100),
        schnelligkeit: clampScore(((3.65 - sprint) / 0.9) * 100),
        sprungkraft: clampScore(((jump - 170) / 105) * 100),
        oberkoerperkraft: clampScore(((bench - 30) / 80) * 100),
        kraftausdauer: clampScore(((burpees - 10) / 30) * 100)
      },
      coachNotes: newMetrics.coachNotes
    };

    addDiagnostic(record);
    setIsAddingTest(false);
  };

  // Cooper Test VO2max approximation: (Distance_m - 504.9) / 44.73
  const estimateVo2Max = (meters: number) => ((meters - 504.9) / 44.73).toFixed(1);

  const activeGuide = DIAGNOSTIC_TEST_GUIDES.find(g => g.id === selectedGuideId) || DIAGNOSTIC_TEST_GUIDES[0];

  return (
    <div className="space-y-6">
      {/* Top Controls: Title, View Tabs, Player Selector & Add Button */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3.5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/10 border border-sky-500/20 flex items-center justify-center text-sky-400 shrink-0">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                {isCoach ? 'Leistungsdiagnostik (6 Feldtests)' : 'Deine Fitness- & Testwerte'}
              </h2>
              <p className="text-xs text-slate-400">
                {isCoach 
                  ? '6 standardisierte Hallentests — objektiv, reliabel und ohne Laboraufwand' 
                  : 'Persönliche Werte, Saisonverlauf und Erklärungen zu den 6 Tests'}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto justify-end">
            {/* Player Switcher (only shown if multiple players are accessible, e.g. coaches) */}
            {effectiveTab === 'profile' && accessiblePlayers.length > 1 && (
              <div className="flex items-center gap-2 bg-slate-800 px-3 py-1.5 rounded-lg border border-slate-700 w-full sm:w-auto">
                <User className="w-4 h-4 text-slate-400 shrink-0" />
                <select
                  value={selectedPlayerId}
                  onChange={(e) => setSelectedPlayerId(e.target.value)}
                  className="bg-transparent text-xs font-medium text-white focus:outline-none cursor-pointer w-full"
                >
                  {accessiblePlayers.map(p => (
                    <option key={p.id} value={p.id} className="bg-slate-800 text-white">
                      {p.name} (#{p.jerseyNumber} · {p.position})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Coach-only button to enter test */}
            {isCoach && (
              <button
                type="button"
                onClick={() => setIsAddingTest(true)}
                className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-colors whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Test erfassen</span>
              </button>
            )}
          </div>
        </div>

        {/* Sub-Navigation Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-slate-800/80 rounded-lg w-full sm:w-fit overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              effectiveTab === 'profile'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{isCoach ? 'Einzelprofil & Verlauf' : 'Meine Ergebnisse'}</span>
          </button>

          {isCoach && (
            <button
              type="button"
              onClick={() => setActiveTab('team')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
                effectiveTab === 'team'
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Kader-Benchmark</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setActiveTab('protocols')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-md transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 ${
              effectiveTab === 'protocols'
                ? 'bg-sky-600 text-white shadow-sm'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>{isCoach ? 'Test-Protokolle & Gütekriterien' : 'Test-Erklärungen'}</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: PLAYER PROFILE & PROGRESSION */}
      {effectiveTab === 'profile' && (
        latestTest ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Column: 6 Field Test Metric Cards (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Player Context Header */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs text-sky-400 font-semibold">
                    Position {selectedPlayer?.position} · Trikot #{selectedPlayer?.jerseyNumber}
                  </div>
                  <h3 className="text-lg font-bold text-white mt-0.5">{selectedPlayer?.name}</h3>
                </div>
                <div className="text-right text-xs text-slate-400">
                  <div>Letzte Testung: <strong className="text-slate-200 tabular-nums">{latestTest.testDate}</strong></div>
                  <div className="text-[11px] text-slate-500">
                    {latestTest.testType === 'pre_season' ? 'Saison-Eingangstest' : latestTest.testType === 'mid_season' ? 'Zwischentest (Mid-Season)' : 'Abschlusstest'}
                  </div>
                </div>
              </div>

              {/* 6 Standardized Field Tests Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* 1. Cooper Test */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Cooper Test (12 Min)</span>
                      <Activity className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums mt-1">
                      {latestTest.metrics.cooperMeters.toLocaleString('de-DE')} <span className="text-xs font-normal text-slate-400">m</span>
                    </div>
                  </div>
                  <div className="pt-1 space-y-1">
                    {hasProgression && preSeasonTest ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{latestTest.metrics.cooperMeters - preSeasonTest.metrics.cooperMeters} m seit Eingangstest</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400 tabular-nums">
                        Geschätzte VO2max: {estimateVo2Max(latestTest.metrics.cooperMeters)} ml/kg
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openProtocolFor('cooperMeters')}
                      className="text-[11px] text-sky-400 hover:underline block"
                    >
                      Protokoll & Gütekriterien →
                    </button>
                  </div>
                </div>

                {/* 2. Piep-Test */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Piep-Test (20m Shuttle)</span>
                      <Flame className="w-4 h-4 text-rose-400" />
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums mt-1">
                      {latestTest.metrics.piepTestLevel.toFixed(1)} <span className="text-xs font-normal text-slate-400">Level</span>
                    </div>
                  </div>
                  <div className="pt-1 space-y-1">
                    {hasProgression && preSeasonTest ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{(latestTest.metrics.piepTestLevel - preSeasonTest.metrics.piepTestLevel).toFixed(1)} Level</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        Oberliga-Richtwert: 10.5 – 12.2
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openProtocolFor('piepTestLevel')}
                      className="text-[11px] text-sky-400 hover:underline block"
                    >
                      Protokoll & Gütekriterien →
                    </button>
                  </div>
                </div>

                {/* 3. 20m Sprint */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>20-Meter-Sprint</span>
                      <Timer className="w-4 h-4 text-sky-400" />
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums mt-1">
                      {latestTest.metrics.sprint20m.toFixed(2)} <span className="text-xs font-normal text-slate-400">s</span>
                    </div>
                  </div>
                  <div className="pt-1 space-y-1">
                    {hasProgression && preSeasonTest ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>{(preSeasonTest.metrics.sprint20m - latestTest.metrics.sprint20m).toFixed(2)} s schneller</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        Oberliga-Richtwert: &lt; 3,04 s
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openProtocolFor('sprint20m')}
                      className="text-[11px] text-sky-400 hover:underline block"
                    >
                      Protokoll & Gütekriterien →
                    </button>
                  </div>
                </div>

                {/* 4. Standweitsprung */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Standweitsprung</span>
                      <Target className="w-4 h-4 text-amber-400" />
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums mt-1">
                      {latestTest.metrics.standweitsprung} <span className="text-xs font-normal text-slate-400">cm</span>
                    </div>
                  </div>
                  <div className="pt-1 space-y-1">
                    {hasProgression && preSeasonTest ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{latestTest.metrics.standweitsprung - preSeasonTest.metrics.standweitsprung} cm</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        Oberliga-Richtwert: 236 – 260 cm
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openProtocolFor('standweitsprung')}
                      className="text-[11px] text-sky-400 hover:underline block"
                    >
                      Protokoll & Gütekriterien →
                    </button>
                  </div>
                </div>

                {/* 5. Bankdrücken */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Bankdrücken (1RM)</span>
                      <Dumbbell className="w-4 h-4 text-purple-400" />
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums mt-1">
                      {latestTest.metrics.bankdrueckenKg.toFixed(1)} <span className="text-xs font-normal text-slate-400">kg</span>
                    </div>
                  </div>
                  <div className="pt-1 space-y-1">
                    {hasProgression && preSeasonTest ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{(latestTest.metrics.bankdrueckenKg - preSeasonTest.metrics.bankdrueckenKg).toFixed(1)} kg</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        Oberliga-Richtwert: 80 – 98 kg
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openProtocolFor('bankdrueckenKg')}
                      className="text-[11px] text-sky-400 hover:underline block"
                    >
                      Protokoll & Gütekriterien →
                    </button>
                  </div>
                </div>

                {/* 6. Burpees in 1 Minute */}
                <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-1.5 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>Burpees in 1 Minute</span>
                      <Zap className="w-4 h-4 text-cyan-400" />
                    </div>
                    <div className="text-2xl font-bold text-white tabular-nums mt-1">
                      {latestTest.metrics.burpees1Min} <span className="text-xs font-normal text-slate-400">Wdh.</span>
                    </div>
                  </div>
                  <div className="pt-1 space-y-1">
                    {hasProgression && preSeasonTest ? (
                      <div className="text-[11px] text-emerald-400 flex items-center gap-1">
                        <TrendingUp className="w-3.5 h-3.5 shrink-0" />
                        <span>+{latestTest.metrics.burpees1Min - preSeasonTest.metrics.burpees1Min} Wdh.</span>
                      </div>
                    ) : (
                      <div className="text-[11px] text-slate-400">
                        Oberliga-Richtwert: 29 – 36 Wdh.
                      </div>
                    )}
                    <button
                      type="button"
                      onClick={() => openProtocolFor('burpees1Min')}
                      className="text-[11px] text-sky-400 hover:underline block"
                    >
                      Protokoll & Gütekriterien →
                    </button>
                  </div>
                </div>
              </div>

              {/* Coach Diagnostic Assessment Notes */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <ShieldCheck className="w-4 h-4 text-sky-400" />
                  <span>Trainer-Beurteilung & Trainingssteuerung</span>
                </div>
                <p className="text-xs text-slate-300 bg-slate-800/60 p-3 rounded-lg border border-slate-700/60 leading-relaxed">
                  „{latestTest.coachNotes}“
                </p>
              </div>
            </div>

            {/* Right Column: Visual 6-Axis Radar & Test History (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-semibold text-white">Athletik-Profil (6 Feldtests)</h4>
                  <span className="text-xs text-slate-400">Normierte Skala 0–100</span>
                </div>

                {renderRadarChart()}

                <div className="text-xs text-slate-400 text-center pt-1">
                  {hasProgression 
                    ? 'Vergleich zwischen Saison-Eingangstest (blau gestrichelt) und aktuellem Leistungsstand (grün).'
                    : 'Erfasst alle 6 praxisnahen Testdimensionen auf einen Blick.'}
                </div>
              </div>

              {/* Historical Tests List */}
              {playerTests.length > 0 && (
                <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2.5">
                  <h4 className="text-xs font-semibold text-slate-300">Erfasste Messzeitpunkte ({playerTests.length})</h4>
                  <div className="divide-y divide-slate-800 text-xs">
                    {playerTests.map(t => (
                      <div key={t.id} className="py-2 flex items-center justify-between gap-2">
                        <div>
                          <div className="font-semibold text-white tabular-nums">{t.testDate}</div>
                          <div className="text-[11px] text-slate-400">
                            {t.testType === 'pre_season' ? 'Saison-Eingangstest' : t.testType === 'mid_season' ? 'Zwischentest' : 'Abschlusstest'}
                          </div>
                        </div>
                        <div className="text-right text-[11px] text-slate-300 tabular-nums">
                          <span>{t.metrics.cooperMeters}m · Lvl {t.metrics.piepTestLevel} · {t.metrics.sprint20m.toFixed(2)}s</span>
                          <div className="text-slate-400">
                            {t.metrics.standweitsprung}cm · {t.metrics.bankdrueckenKg}kg · {t.metrics.burpees1Min} Burpees
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-sm">
            Noch keine Leistungstests für diesen Spieler erfasst.
          </div>
        )
      )}

      {/* VIEW 2: TEAM BENCHMARK TABLE (COACH ONLY) */}
      {effectiveTab === 'team' && isCoach && (
        <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-white">Kader-Benchmark: Alle 6 Feldtests im Vergleich</h3>
              <p className="text-xs text-slate-400">
                Aktuellster Testwert je Spieler. Klick auf einen Spieler öffnet das vollständige Einzelprofil mit Saisonverlauf.
              </p>
            </div>
            <span className="text-xs text-slate-400">Nur für Trainerteam sichtbar</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-300">
              <thead className="bg-slate-800/80 text-slate-400 border-b border-slate-700">
                <tr>
                  <th className="py-2.5 px-3 font-semibold">Spieler</th>
                  <th className="py-2.5 px-3 font-semibold">Pos.</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Cooper (m)</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Piep-Test</th>
                  <th className="py-2.5 px-3 font-semibold text-right">20m Sprint</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Standweit</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Bankdrücken</th>
                  <th className="py-2.5 px-3 font-semibold text-right">Burpees (1m)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {squadLatestRecords.map(({ player, latest }) => (
                  <tr
                    key={player.id}
                    onClick={() => {
                      setSelectedPlayerId(player.id);
                      setActiveTab('profile');
                    }}
                    className="hover:bg-slate-800/50 cursor-pointer transition-colors"
                  >
                    <td className="py-3 px-3 font-semibold text-white whitespace-nowrap">
                      {player.name} <span className="text-slate-500 font-normal">#{player.jerseyNumber}</span>
                    </td>
                    <td className="py-3 px-3 text-sky-400 font-medium">{player.position}</td>
                    {latest ? (
                      <>
                        <td className="py-3 px-3 text-right tabular-nums">{latest.metrics.cooperMeters.toLocaleString('de-DE')} m</td>
                        <td className="py-3 px-3 text-right tabular-nums">Lvl {latest.metrics.piepTestLevel.toFixed(1)}</td>
                        <td className="py-3 px-3 text-right tabular-nums">{latest.metrics.sprint20m.toFixed(2)} s</td>
                        <td className="py-3 px-3 text-right tabular-nums">{latest.metrics.standweitsprung} cm</td>
                        <td className="py-3 px-3 text-right tabular-nums">{latest.metrics.bankdrueckenKg.toFixed(1)} kg</td>
                        <td className="py-3 px-3 text-right tabular-nums">{latest.metrics.burpees1Min} Wdh.</td>
                      </>
                    ) : (
                      <td colSpan={6} className="py-3 px-3 text-center text-slate-500">
                        Kein Test erfasst
                      </td>
                    )}
                  </tr>
                ))}

                {teamAverages && (
                  <tr className="bg-slate-800/50 font-bold text-white border-t border-slate-700">
                    <td className="py-3 px-3" colSpan={2}>Kader-Durchschnitt</td>
                    <td className="py-3 px-3 text-right tabular-nums text-sky-300">{teamAverages.cooperMeters.toLocaleString('de-DE')} m</td>
                    <td className="py-3 px-3 text-right tabular-nums text-sky-300">Lvl {teamAverages.piepTestLevel.toFixed(1)}</td>
                    <td className="py-3 px-3 text-right tabular-nums text-sky-300">{teamAverages.sprint20m.toFixed(2)} s</td>
                    <td className="py-3 px-3 text-right tabular-nums text-sky-300">{teamAverages.standweitsprung} cm</td>
                    <td className="py-3 px-3 text-right tabular-nums text-sky-300">{teamAverages.bankdrueckenKg.toFixed(1)} kg</td>
                    <td className="py-3 px-3 text-right tabular-nums text-sky-300">{teamAverages.burpees1Min} Wdh.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 3: PROTOCOLS & QUALITY CRITERIA (GÜTEKRITERIEN) */}
      {effectiveTab === 'protocols' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left selector list */}
          <div className="lg:col-span-4 space-y-2">
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-2">
              <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                Die 6 standardisierten Feldtests
              </h3>
              <p className="text-xs text-slate-400">
                Alle Tests sind ohne teure Labortechnik in jeder Vereinshalle oder auf dem Sportplatz durchführbar und erfüllen die sportwissenschaftlichen Hauptgütekriterien.
              </p>
            </div>

            {DIAGNOSTIC_TEST_GUIDES.map((guide, index) => {
              const isSelected = guide.id === activeGuide.id;
              return (
                <button
                  key={guide.id}
                  type="button"
                  onClick={() => setSelectedGuideId(guide.id)}
                  className={`w-full text-left p-3.5 rounded-xl border transition-colors ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 text-white'
                      : 'bg-slate-900/80 border-slate-800 text-slate-300 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-sm font-semibold">{index + 1}. {guide.shortName}</span>
                    <span className="text-[11px] text-slate-400">{guide.unit}</span>
                  </div>
                  <div className="text-xs text-slate-400 mt-1 line-clamp-1">{guide.targetAbility}</div>
                </button>
              );
            })}
          </div>

          {/* Right detail panel */}
          <div className="lg:col-span-8 bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
            <div className="border-b border-slate-800 pb-4 space-y-1">
              <div className="text-xs font-semibold text-sky-400">
                Zielkomponente: {activeGuide.targetAbility}
              </div>
              <h3 className="text-lg font-bold text-white">{activeGuide.name}</h3>
              <div className="text-xs text-slate-400">
                Benötigtes Equipment: <strong className="text-slate-200">{activeGuide.equipment}</strong>
              </div>
            </div>

            {/* Execution steps */}
            <div className="space-y-2.5">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Praxis-Durchführung für Trainer
              </h4>
              <ol className="space-y-2 text-xs text-slate-300 list-decimal list-inside bg-slate-800/50 p-4 rounded-xl border border-slate-800">
                {activeGuide.executionProtocol.map((step, i) => (
                  <li key={i} className="leading-relaxed">{step}</li>
                ))}
              </ol>
              <div className="p-3 bg-amber-950/20 border border-amber-800/40 rounded-lg text-xs text-amber-200">
                <strong>Standardisierungs-Hinweis:</strong> {activeGuide.standardizationTips}
              </div>
            </div>

            {/* Sport-Science Gütekriterien */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Sportwissenschaftliche Gütekriterien & Handball-Aussagekraft
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl space-y-1.5">
                  <div className="font-bold text-sky-400">Objektivität</div>
                  <p className="text-slate-300 leading-relaxed">{activeGuide.qualityCriteria.objectivity}</p>
                </div>
                <div className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl space-y-1.5">
                  <div className="font-bold text-emerald-400">Reliabilität</div>
                  <p className="text-slate-300 leading-relaxed">{activeGuide.qualityCriteria.reliability}</p>
                </div>
                <div className="p-3.5 bg-slate-800/70 border border-slate-700/60 rounded-xl space-y-1.5">
                  <div className="font-bold text-amber-400">Validität (Handball)</div>
                  <p className="text-slate-300 leading-relaxed">{activeGuide.qualityCriteria.validityHandball}</p>
                </div>
              </div>
            </div>

            {/* Benchmarks */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Orientierungswerte (Erwachsene / Herren-Bereich)
              </h4>
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-slate-400">Basis / Kreisliga</div>
                  <div className="font-bold text-slate-200 tabular-nums mt-0.5">{activeGuide.benchmarks.basis}</div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-sky-400">Oberliga / Verband</div>
                  <div className="font-bold text-white tabular-nums mt-0.5">{activeGuide.benchmarks.oberliga}</div>
                </div>
                <div className="p-3 bg-slate-800/60 rounded-lg border border-slate-800">
                  <div className="text-[11px] text-emerald-400">Leistungsbereich</div>
                  <div className="font-bold text-emerald-300 tabular-nums mt-0.5">{activeGuide.benchmarks.top}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Add New Diagnostic Test */}
      {isAddingTest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-xl w-full space-y-5 shadow-2xl my-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-white">Leistungstest erfassen</h3>
                <p className="text-xs text-slate-400">Spieler: {selectedPlayer?.name} (#{selectedPlayer?.jerseyNumber} · {selectedPlayer?.position})</p>
              </div>
              <button 
                type="button"
                onClick={() => setIsAddingTest(false)}
                className="text-slate-400 hover:text-white text-sm p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveDiagnostic} className="space-y-4">
              <div className="text-xs">
                <label className="text-slate-400 block mb-1">Testzeitpunkt</label>
                <select
                  value={newMetrics.testType}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, testType: e.target.value as any }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                >
                  <option value="pre_season">Saison-Eingangstest (Pre-Season)</option>
                  <option value="mid_season">Zwischentest (Mid-Season)</option>
                  <option value="post_season">Abschlusstest (Post-Season)</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="text-slate-300 font-medium block mb-1">1. Cooper Test (12 Min in m)</label>
                  <input
                    type="number"
                    step="10"
                    min="1000"
                    max="4500"
                    value={newMetrics.cooperMeters}
                    onChange={(e) => setNewMetrics(prev => ({ ...prev, cooperMeters: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">2. Piep-Test (Level, z. B. 11.4)</label>
                  <input
                    type="number"
                    step="0.1"
                    min="1"
                    max="20"
                    value={newMetrics.piepTestLevel}
                    onChange={(e) => setNewMetrics(prev => ({ ...prev, piepTestLevel: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">3. 20m Sprint (Sekunden)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="2.2"
                    max="6.0"
                    value={newMetrics.sprint20m}
                    onChange={(e) => setNewMetrics(prev => ({ ...prev, sprint20m: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">4. Standweitsprung (cm)</label>
                  <input
                    type="number"
                    step="1"
                    min="100"
                    max="350"
                    value={newMetrics.standweitsprung}
                    onChange={(e) => setNewMetrics(prev => ({ ...prev, standweitsprung: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white tabular-nums"
                    required
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-slate-300 font-medium">5. Bankdrücken (kg 1RM)</label>
                    <button
                      type="button"
                      onClick={() => setShow1RmHelper(prev => !prev)}
                      className="text-[11px] text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <Calculator className="w-3 h-3" />
                      <span>{show1RmHelper ? 'Schließen' : 'Aus Wdh. berechnen'}</span>
                    </button>
                  </div>
                  <input
                    type="number"
                    step="0.5"
                    min="20"
                    max="220"
                    value={newMetrics.bankdrueckenKg}
                    onChange={(e) => setNewMetrics(prev => ({ ...prev, bankdrueckenKg: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white tabular-nums"
                    required
                  />
                </div>

                <div>
                  <label className="text-slate-300 font-medium block mb-1">6. Burpees in 1 Minute (Wdh.)</label>
                  <input
                    type="number"
                    step="1"
                    min="5"
                    max="70"
                    value={newMetrics.burpees1Min}
                    onChange={(e) => setNewMetrics(prev => ({ ...prev, burpees1Min: e.target.value }))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white tabular-nums"
                    required
                  />
                </div>
              </div>

              {/* Optional Brzycki 1RM Calculator for safe submaximal testing */}
              {show1RmHelper && (
                <div className="p-3.5 bg-slate-800/80 border border-slate-700 rounded-xl space-y-2.5 text-xs">
                  <div className="font-semibold text-sky-300">
                    Sicherer Submaximal-Rechner (Brzycki-Formel für normales Hallentraining)
                  </div>
                  <div className="grid grid-cols-3 gap-2 items-end">
                    <div>
                      <label className="text-slate-400 block mb-1">Gewicht (kg)</label>
                      <input
                        type="number"
                        step="2.5"
                        value={submaxWeight}
                        onChange={(e) => setSubmaxWeight(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white tabular-nums"
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 block mb-1">Saubere Wdh. (2–10)</label>
                      <input
                        type="number"
                        min="1"
                        max="12"
                        value={submaxReps}
                        onChange={(e) => setSubmaxReps(e.target.value)}
                        className="w-full px-2.5 py-1.5 bg-slate-900 border border-slate-700 rounded text-white tabular-nums"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setNewMetrics(prev => ({ ...prev, bankdrueckenKg: String(calculated1Rm) }));
                        setShow1RmHelper(false);
                      }}
                      className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded flex items-center justify-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{calculated1Rm} kg übernehmen</span>
                    </button>
                  </div>
                </div>
              )}

              <div className="text-xs">
                <label className="text-slate-400 block mb-1">Trainer-Beurteilung / Trainingsempfehlung</label>
                <textarea
                  rows={3}
                  value={newMetrics.coachNotes}
                  onChange={(e) => setNewMetrics(prev => ({ ...prev, coachNotes: e.target.value }))}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  placeholder="Spezifische Stärken, Defizite oder Schwerpunkte für das nächste Training..."
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddingTest(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs"
                >
                  Abbrechen
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white font-semibold rounded-lg text-xs shadow-md"
                >
                  Testergebnis speichern
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
