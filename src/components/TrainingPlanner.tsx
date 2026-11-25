import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Exercise, CourtType, Difficulty, FocusCategory, LoadIntensity } from '../types';
import { TacticalCourtView } from './TacticalCourtView';
import { ExerciseCreatorModal } from './ExerciseCreatorModal';
import { DHB_METHODOLOGY_GUIDELINES } from '../data/mockData';
import { 
  Users, 
  Activity, 
  AlertTriangle, 
  Plus, 
  Minus,
  Check, 
  ArrowUpRight, 
  ArrowDownRight, 
  Lightbulb, 
  Award,
  Layers,
  Sparkles,
  BookOpen,
  Video,
  Image as ImageIcon,
  FileText,
  HeartHandshake,
  RotateCcw,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export const TrainingPlanner: React.FC = () => {
  const { 
    exercises, 
    activeSession, 
    addExerciseToSession, 
    removeExerciseFromSession,
    updateActiveSessionNotes,
    livePlayerCount,
    setLivePlayerCount
  } = useApp();

  // Filters
  const [selectedCourt, setSelectedCourt] = useState<CourtType | 'all'>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | 'all'>('all');
  const [selectedCategory, setSelectedCategory] = useState<FocusCategory | 'all'>('all');
  const [selectedIntensity, setSelectedIntensity] = useState<LoadIntensity | 'all'>('all');
  const [sourceFilter, setSourceFilter] = useState<'all' | 'dhb' | 'custom'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Active Plan drawer toggle for quick review
  const [isPlanExpanded, setIsPlanExpanded] = useState(false);

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isMethodologyModalOpen, setIsMethodologyModalOpen] = useState(false);

  // Selected Drill for deep-dive detail
  const [selectedExercise, setSelectedExercise] = useState<Exercise>(exercises[0]);

  // Active sub-tab inside drill details
  const [drillTab, setDrillTab] = useState<'tactics' | 'visuals' | 'variations' | 'mistakes' | 'adaptive'>('tactics');

  const hasActiveFilters =
    selectedCourt !== 'all' ||
    selectedDifficulty !== 'all' ||
    selectedCategory !== 'all' ||
    selectedIntensity !== 'all' ||
    sourceFilter !== 'all' ||
    searchQuery.trim().length > 0;

  const resetAllFilters = () => {
    setSelectedCourt('all');
    setSelectedDifficulty('all');
    setSelectedCategory('all');
    setSelectedIntensity('all');
    setSourceFilter('all');
    setSearchQuery('');
  };

  // Filter logic
  const filteredExercises = useMemo(() => {
    return exercises.filter(ex => {
      if (selectedCourt !== 'all' && ex.court !== selectedCourt) return false;
      if (selectedDifficulty !== 'all' && ex.difficulty !== selectedDifficulty) return false;
      if (selectedCategory !== 'all' && ex.category !== selectedCategory) return false;
      if (selectedIntensity !== 'all' && ex.intensity !== selectedIntensity) return false;
      if (sourceFilter === 'custom' && !ex.isCustom) return false;
      if (sourceFilter === 'dhb' && ex.isCustom) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchesTitle = ex.title.toLowerCase().includes(query);
        const matchesDesc = ex.shortDesc.toLowerCase().includes(query);
        const matchesSource = ex.officialSource.toLowerCase().includes(query);
        const matchesAuthor = ex.authorName ? ex.authorName.toLowerCase().includes(query) : false;
        if (!matchesTitle && !matchesDesc && !matchesSource && !matchesAuthor) return false;
      }
      return true;
    });
  }, [exercises, selectedCourt, selectedDifficulty, selectedCategory, selectedIntensity, sourceFilter, searchQuery]);

  // Ensure selectedExercise stays valid
  React.useEffect(() => {
    if (filteredExercises.length > 0 && !filteredExercises.some(e => e.id === selectedExercise?.id)) {
      setSelectedExercise(filteredExercises[0]);
    }
  }, [filteredExercises, selectedExercise]);

  // Participant-Adaptive Calculations
  const adaptiveCalculation = useMemo(() => {
    if (!selectedExercise) {
      return {
        count: livePlayerCount,
        isUnderMin: false,
        isOverMax: false,
        groupSetup: '',
        recommendation: '',
        workRestRatio: '',
        adaptedDuration: 15
      };
    }
    const count = livePlayerCount;
    const reqMin = selectedExercise.minPlayers;
    const reqMax = selectedExercise.maxPlayers;
    const isUnderMin = count < reqMin;
    const isOverMax = count > reqMax;

    let recommendation = '';
    let groupSetup = '';
    let workRestRatio = '';

    if (count <= 8) {
      groupSetup = '1 Kleingruppe (z. B. 3-gegen-2 oder 4-gegen-3 mit 1 Torwart)';
      recommendation = 'Kompaktes Stationsformat mit hoher Wiederholungszahl. Kurze Pausen für Trink- und Wurftechnik-Tipps nutzen.';
      workRestRatio = '1:1 (z. B. 45s Belastung / 45s Pause)';
    } else if (count <= 14) {
      groupSetup = '2 rotierende Gruppen (z. B. 6er-Angriffswelle gegen 5er-Abwehr + TW)';
      recommendation = 'Optimale Gruppengröße. Positionen und Rollen (Angriff/Abwehr) alle 4 Minuten geschlossen tauschen.';
      workRestRatio = '1:2 (Spielnahe Intensität mit Erholungszeit)';
    } else {
      groupSetup = '2 parallele Stationen oder 3-Gruppen-Turnier (Team A vs B, Team C wartet/übt außen)';
      recommendation = 'Große Gruppe: Entweder auf zwei Tore aufteilen oder schnelles 3-Team-Wechselturnier (Wechsel nach 2 Toren).';
      workRestRatio = '1:2.5 (Konstantes Tempo ohne Wartezeit-Stau)';
    }

    return {
      count,
      isUnderMin,
      isOverMax,
      groupSetup,
      recommendation,
      workRestRatio,
      adaptedDuration: count > 14 ? selectedExercise.durationMinutes + 5 : selectedExercise.durationMinutes
    };
  }, [livePlayerCount, selectedExercise]);

  // Load Management Warnings
  const isMatchDayNear = true;
  const totalSessionLoadScore = activeSession.exercises.reduce((acc, curr) => acc + curr.intensityScore, 0);
  const isOverloadRisk = totalSessionLoadScore > 12;

  const getIntensityLabel = (intensity: LoadIntensity) => {
    switch (intensity) {
      case 'regeneration': return <span className="text-emerald-400 font-medium">Regeneration</span>;
      case 'technik_taktik': return <span className="text-sky-400 font-medium">Technik & Taktik</span>;
      case 'spielform': return <span className="text-amber-400 font-medium">Spielform</span>;
      case 'hochintensiv': return <span className="text-rose-400 font-medium">Hochintensiv</span>;
    }
  };

  const getCourtLabel = (court: CourtType) => {
    switch (court) {
      case 'full': return 'Volles Spielfeld';
      case 'half': return '1/2 Halle';
      case 'one_goal': return '1 Tor';
    }
  };

  const getCategoryLabel = (cat: FocusCategory) => {
    switch (cat) {
      case 'abwehr': return 'Abwehr';
      case 'angriff_1v1': return '1-gegen-1';
      case 'tempospiel': return 'Tempospiel';
      case 'wurftechnik': return 'Wurftechnik';
      case 'kleingruppe': return 'Kleingruppe';
      case 'torwart': return 'Torwart';
      case 'athletik': return 'Athletik';
    }
  };

  return (
    <div className="space-y-5">
      {/* Top Bar: 1. Teilnehmerzahl & 2. Belastung + Aktiver Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        
        {/* Easy Participant Stepper & Slider (5 cols) */}
        <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-semibold text-white">
              <Users className="w-4 h-4 text-sky-400" />
              <span>Anwesende Spieler heute</span>
            </div>
            <span className="text-xs text-slate-400">
              {livePlayerCount >= 14 ? '2 Gruppen / Turnier' : livePlayerCount >= 10 ? '6v6 Formation' : 'Kleingruppe'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setLivePlayerCount(Math.max(6, livePlayerCount - 1))}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-white shrink-0 transition-colors"
              aria-label="Spielerzahl verringern"
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="range"
              min="6"
              max="22"
              value={livePlayerCount}
              onChange={(e) => setLivePlayerCount(Number(e.target.value))}
              className="w-full accent-sky-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
            />
            <button
              type="button"
              onClick={() => setLivePlayerCount(Math.min(22, livePlayerCount + 1))}
              className="w-9 h-9 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 flex items-center justify-center text-white shrink-0 transition-colors"
              aria-label="Spielerzahl erhöhen"
            >
              <Plus className="w-4 h-4" />
            </button>
            <span className="text-lg font-extrabold text-sky-400 tabular-nums w-8 text-right shrink-0">
              {livePlayerCount}
            </span>
          </div>
        </div>

        {/* Active Session Summary & Matchday Load Alert (7 cols) */}
        <div className="lg:col-span-7 bg-slate-900/90 border border-slate-800 rounded-xl p-4 flex flex-col justify-between gap-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <Activity className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Aktueller Trainingsplan</span>
                <span className="text-slate-400 font-normal">· Spiel in 2 Tagen (HSG Nordhorn)</span>
              </div>
              <p className="text-xs text-slate-400">
                {isOverloadRisk ? (
                  <span className="text-rose-400 font-medium">Achtung Überlastung: Intensität vor dem Spieltag reduzieren.</span>
                ) : isMatchDayNear ? (
                  <span>Empfehlung vor Spieltag: Max. Stufe 3 (Spielform/Taktik), keine Laktat-Sprints.</span>
                ) : (
                  'Ausgewogene Wochenbelastung.'
                )}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsPlanExpanded(prev => !prev)}
              className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg text-xs font-semibold text-white flex items-center justify-between gap-3 shrink-0 transition-colors"
            >
              <span className="tabular-nums">
                {activeSession.exercises.length} Übungen · {activeSession.totalDurationMinutes} Min ·{' '}
                <span className={activeSession.calculatedLoadScore > 3.5 ? 'text-amber-400' : 'text-emerald-400'}>
                  Last {activeSession.calculatedLoadScore}
                </span>
              </span>
              {isPlanExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
            </button>
          </div>

          {/* Expandable Active Plan Bar */}
          {isPlanExpanded && (
            <div className="pt-3 border-t border-slate-800 space-y-3">
              {activeSession.exercises.length === 0 ? (
                <div className="text-xs text-slate-400 py-2">
                  Noch keine Übungen im Plan. Wähle links eine Übung und klicke auf „+ Einplanen“.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {activeSession.exercises.map((drill, index) => (
                    <div
                      key={drill.id}
                      onClick={() => setSelectedExercise(drill)}
                      className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2 cursor-pointer hover:border-sky-500/60"
                    >
                      <div className="truncate">
                        <div className="text-[11px] text-slate-400">
                          {index + 1}. Übung · {drill.durationMinutes} Min
                        </div>
                        <div className="text-xs font-medium text-white truncate">{drill.title}</div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          removeExerciseFromSession(drill.id);
                        }}
                        className="text-slate-400 hover:text-rose-400 text-xs shrink-0 p-1.5"
                        title="Aus Plan entfernen"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-xs">
                <label className="text-slate-400 block mb-1">Trainer-Notiz zur Einheit</label>
                <input
                  type="text"
                  value={activeSession.notes}
                  onChange={(e) => updateActiveSessionNotes(e.target.value)}
                  placeholder="Notiz für dieses Training..."
                  className="w-full px-3 py-1.5 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white focus:outline-none focus:border-sky-500"
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main 2-Column Workspace: Left = Find Drills, Right = Selected Drill Details */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT: Search, Filter & Drill List (5 cols) */}
        <div className="lg:col-span-5 space-y-3.5">
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            {/* Header + Primary Actions */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <h2 className="text-sm font-bold text-white">Übungs-Datenbank</h2>
                <span className="text-xs text-slate-400">({filteredExercises.length})</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors whitespace-nowrap"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Eigene Übung</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsMethodologyModalOpen(true)}
                  className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 border border-slate-700 transition-colors whitespace-nowrap"
                  title="DHB-Methodik & Elternarbeit"
                >
                  <FileText className="w-3.5 h-3.5 text-amber-400" />
                  <span>DHB-Tipps</span>
                </button>
              </div>
            </div>

            {/* Search */}
            <input
              type="text"
              placeholder="Übung suchen (z. B. Kreuzen, Gegenstoß, E-Jugend)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />

            {/* Focus Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <button
                type="button"
                onClick={() => setSelectedCategory('all')}
                className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${selectedCategory === 'all' ? 'bg-sky-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
              >
                Alle
              </button>
              {(['abwehr', 'angriff_1v1', 'tempospiel', 'wurftechnik', 'kleingruppe', 'torwart', 'athletik'] as FocusCategory[]).map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2.5 py-1.5 rounded-md whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-sky-600 text-white font-semibold' : 'bg-slate-800 text-slate-300 hover:bg-slate-700'}`}
                >
                  {getCategoryLabel(cat)}
                </button>
              ))}
            </div>

            {/* Clean 2x2 Filter Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <select
                value={selectedCourt}
                onChange={(e) => setSelectedCourt(e.target.value as any)}
                className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="all">Hallenplatz: Alle</option>
                <option value="full">Volles Spielfeld</option>
                <option value="half">1/2 Halle</option>
                <option value="one_goal">1 Tor</option>
              </select>

              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value as any)}
                className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="all">Niveau: Alle</option>
                <option value="basis">Basis</option>
                <option value="fortgeschritten">Fortgeschritten</option>
                <option value="leistung">Leistung</option>
              </select>

              <select
                value={selectedIntensity}
                onChange={(e) => setSelectedIntensity(e.target.value as any)}
                className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="all">Belastung: Alle</option>
                <option value="regeneration">Regeneration</option>
                <option value="technik_taktik">Technik & Taktik</option>
                <option value="spielform">Spielform</option>
                <option value="hochintensiv">Hochintensiv</option>
              </select>

              <select
                value={sourceFilter}
                onChange={(e) => setSourceFilter(e.target.value as any)}
                className="px-2.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-200 focus:outline-none"
              >
                <option value="all">Quelle: Alle ({exercises.length})</option>
                <option value="dhb">DHB-Lehrgang ({exercises.filter(e => !e.isCustom).length})</option>
                <option value="custom">Eigene Übungen ({exercises.filter(e => e.isCustom).length})</option>
              </select>
            </div>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetAllFilters}
                className="text-xs text-sky-400 hover:underline flex items-center gap-1 pt-0.5"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Alle Filter zurücksetzen</span>
              </button>
            )}
          </div>

          {/* Drill List */}
          <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
            {filteredExercises.map((drill) => {
              const isSelected = selectedExercise?.id === drill.id;
              const isAddedToSession = activeSession.exercises.some(e => e.id === drill.id);

              return (
                <div
                  key={drill.id}
                  onClick={() => setSelectedExercise(drill)}
                  className={`p-3.5 rounded-xl border transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-800/95 border-sky-500 ring-1 ring-sky-500/30'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-sm font-semibold text-white truncate">{drill.title}</h4>
                      <p className="text-xs text-slate-400 line-clamp-2">{drill.shortDesc}</p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isAddedToSession) {
                          removeExerciseFromSession(drill.id);
                        } else {
                          addExerciseToSession(drill);
                        }
                      }}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold shrink-0 transition-colors flex items-center gap-1 ${
                        isAddedToSession 
                          ? 'bg-emerald-500/20 text-emerald-300 hover:bg-rose-500/20 hover:text-rose-300' 
                          : 'bg-sky-600/20 text-sky-300 hover:bg-sky-600 hover:text-white'
                      }`}
                      title={isAddedToSession ? 'Aus Plan entfernen' : 'In Plan übernehmen'}
                    >
                      {isAddedToSession ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span className="hidden sm:inline">{isAddedToSession ? 'Im Plan' : 'Plan'}</span>
                    </button>
                  </div>

                  <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {drill.isCustom && (
                        <>
                          <span className="text-emerald-400 font-semibold">Eigene Übung</span>
                          <span>·</span>
                        </>
                      )}
                      <span>{getCourtLabel(drill.court)}</span>
                      <span>·</span>
                      <span className="tabular-nums">{drill.durationMinutes} Min</span>
                      <span>·</span>
                      {getIntensityLabel(drill.intensity)}
                    </div>
                    
                    <div className="flex items-center gap-1.5 shrink-0">
                      {drill.sketchImageUrl && <ImageIcon className="w-3 h-3 text-sky-400" />}
                      {drill.videoClipUrl && <Video className="w-3 h-3 text-amber-400" />}
                    </div>
                  </div>
                </div>
              );
            })}

            {filteredExercises.length === 0 && (
              <div className="p-8 text-center bg-slate-900/60 border border-slate-800 rounded-xl text-slate-400 text-xs space-y-2">
                <p>Keine Übungen für die ausgewählten Filter gefunden.</p>
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-semibold mr-2"
                >
                  Filter löschen
                </button>
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(true)}
                  className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-semibold"
                >
                  Eigene Übung erstellen
                </button>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Selected Drill Details (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {selectedExercise ? (
            <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 space-y-5">
              {/* Header info */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-sky-400 font-medium">
                    <Award className="w-3.5 h-3.5 shrink-0" />
                    <span>{selectedExercise.officialSource}</span>
                  </div>
                  <h3 className="text-lg font-bold text-white">{selectedExercise.title}</h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 flex-wrap">
                    <span>{getCourtLabel(selectedExercise.court)}</span>
                    <span>·</span>
                    <span>{getCategoryLabel(selectedExercise.category)}</span>
                    <span>·</span>
                    <span className="tabular-nums">{selectedExercise.durationMinutes} Min</span>
                    <span>·</span>
                    <span>{selectedExercise.recommendedAgeGroup}</span>
                  </div>
                </div>

                {activeSession.exercises.some(e => e.id === selectedExercise.id) ? (
                  <button
                    type="button"
                    onClick={() => removeExerciseFromSession(selectedExercise.id)}
                    className="px-4 py-2 bg-rose-600/20 text-rose-300 hover:bg-rose-600/30 rounded-lg text-xs font-semibold shrink-0 transition-colors"
                  >
                    Aus Plan entfernen
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => addExerciseToSession(selectedExercise)}
                    className="px-4 py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-semibold shrink-0 transition-colors shadow-sm"
                  >
                    + In Trainingsplan übernehmen
                  </button>
                )}
              </div>

              {/* Clean Drill Tabs */}
              <div className="flex items-center gap-1.5 border-b border-slate-800 pb-2.5 overflow-x-auto text-xs">
                <button
                  type="button"
                  onClick={() => setDrillTab('tactics')}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    drillTab === 'tactics' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Ablauf & Taktik
                </button>

                {(selectedExercise.sketchImageUrl || selectedExercise.videoClipUrl) && (
                  <button
                    type="button"
                    onClick={() => setDrillTab('visuals')}
                    className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                      drillTab === 'visuals' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`}
                  >
                    Skizze & Video
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => setDrillTab('adaptive')}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    drillTab === 'adaptive' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Anpassung ({livePlayerCount} Spieler)
                </button>

                <button
                  type="button"
                  onClick={() => setDrillTab('variations')}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    drillTab === 'variations' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Einfacher / Schwerer
                </button>

                <button
                  type="button"
                  onClick={() => setDrillTab('mistakes')}
                  className={`px-3 py-1.5 rounded-lg font-semibold whitespace-nowrap transition-colors ${
                    drillTab === 'mistakes' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  Fehler & Korrektur
                </button>
              </div>

              {/* TAB 1: TACTICAL COURT & DESCRIPTION */}
              {drillTab === 'tactics' && (
                <div className="space-y-4">
                  <p className="text-xs text-slate-300 leading-relaxed">{selectedExercise.description}</p>

                  <TacticalCourtView 
                    data={selectedExercise.tacticalCourt} 
                    courtType={selectedExercise.court}
                    interactive={true}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="text-xs font-semibold text-white">Aufbau & Organisation</div>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {selectedExercise.setupInstructions.map((step, idx) => (
                          <li key={idx}>{step}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-slate-800/50 border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-400">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Wichtige Trainer-Hinweise</span>
                      </div>
                      <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                        {selectedExercise.coachingPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: VISUAL AIDS & VIDEO */}
              {drillTab === 'visuals' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {selectedExercise.sketchImageUrl ? (
                    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <ImageIcon className="w-4 h-4 text-sky-400" />
                        <span>Hochgeladene Skizze</span>
                      </div>
                      <img
                        src={selectedExercise.sketchImageUrl}
                        alt="Taktikskizze"
                        className="rounded-lg w-full max-h-60 object-contain bg-slate-900 border border-slate-700"
                      />
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-500 text-center flex items-center justify-center">
                      Keine separate Bildskizze vorhanden.
                    </div>
                  )}

                  {selectedExercise.videoClipUrl ? (
                    <div className="bg-slate-800/40 p-4 rounded-xl border border-slate-800 space-y-2">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                        <Video className="w-4 h-4 text-emerald-400" />
                        <span>Bewegungs-Videoclip</span>
                      </div>
                      {selectedExercise.videoClipUrl.startsWith('http') && !selectedExercise.videoClipUrl.includes('blob:') ? (
                        <div className="p-3 bg-slate-900 rounded-lg text-xs text-sky-400 break-all border border-slate-700">
                          Video-Link:{' '}
                          <a href={selectedExercise.videoClipUrl} target="_blank" rel="noreferrer" className="underline">
                            {selectedExercise.videoClipUrl}
                          </a>
                        </div>
                      ) : (
                        <video
                          controls
                          src={selectedExercise.videoClipUrl}
                          className="w-full max-h-60 rounded-lg bg-black border border-slate-700"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="p-4 bg-slate-900/60 rounded-xl border border-slate-800 text-xs text-slate-500 text-center flex items-center justify-center">
                      Kein Videoclip hinterlegt.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: PARTICIPANT-ADAPTIVE GENERATION */}
              {drillTab === 'adaptive' && (
                <div className="bg-sky-950/20 border border-sky-800/40 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4 text-sky-400" />
                      <h4 className="text-sm font-semibold text-white">
                        Automatische Einteilung für {livePlayerCount} Spieler
                      </h4>
                    </div>
                    <span className="text-xs text-slate-400 tabular-nums">
                      Empfohlen: {selectedExercise.recommendedPlayers} (Min {selectedExercise.minPlayers} · Max {selectedExercise.maxPlayers})
                    </span>
                  </div>

                  {adaptiveCalculation.isUnderMin ? (
                    <div className="p-3 bg-amber-950/40 border border-amber-800/50 rounded-lg text-xs text-amber-200 flex items-start gap-2">
                      <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Wenige Spieler ({livePlayerCount} &lt; {selectedExercise.minPlayers}):</strong> Außenpositionen mit Hütchen/Dummies besetzen oder Spielfeld auf die Rückraum-Kreis-Achse verkleinern.
                      </div>
                    </div>
                  ) : adaptiveCalculation.isOverMax ? (
                    <div className="p-3 bg-sky-950/40 border border-sky-800/50 rounded-lg text-xs text-sky-200 flex items-start gap-2">
                      <Users className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                      <div>
                        <strong>Viele Spieler ({livePlayerCount} &gt; {selectedExercise.maxPlayers}):</strong> Zweite Station auf dem anderen Hallentor aufbauen oder in 3er-Wellen rotieren.
                      </div>
                    </div>
                  ) : (
                    <div className="p-3 bg-emerald-950/30 border border-emerald-800/50 rounded-lg text-xs text-emerald-200">
                      Optimale Spielerzahl — alle Positionen können direkt besetzt werden.
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Empfohlene Einteilung</div>
                      <div className="text-xs font-semibold text-white mt-1">{adaptiveCalculation.groupSetup}</div>
                    </div>
                    <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
                      <div className="text-[11px] text-slate-400">Belastung / Pause</div>
                      <div className="text-xs font-semibold text-sky-300 mt-1">{adaptiveCalculation.workRestRatio}</div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-300 bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <strong className="text-slate-200">Praxistipp:</strong> {adaptiveCalculation.recommendation}
                  </div>
                </div>
              )}

              {/* TAB 4: VARIATIONS */}
              {drillTab === 'variations' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-emerald-950/20 border border-emerald-900/40 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                      <ArrowDownRight className="w-4 h-4" />
                      <span>Übung einfacher machen</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                      {selectedExercise.simplificationTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>

                  <div className="bg-amber-950/20 border border-amber-900/40 rounded-xl p-4 space-y-2">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Anspruch steigern</span>
                    </div>
                    <ul className="space-y-2 text-xs text-slate-300 list-disc list-inside">
                      {selectedExercise.progressionTips.map((tip, idx) => (
                        <li key={idx}>{tip}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {/* TAB 5: MISTAKES & CORRECTION */}
              {drillTab === 'mistakes' && (
                <div className="space-y-3">
                  {selectedExercise.typicalMistakes.map((item, idx) => (
                    <div key={idx} className="bg-slate-800/60 border border-slate-700/70 rounded-xl p-3.5 space-y-2">
                      <div className="flex items-start gap-2 text-xs text-rose-300 font-semibold">
                        <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 font-normal">Fehler: </span>
                          {item.mistake}
                        </div>
                      </div>
                      <div className="flex items-start gap-2 text-xs text-emerald-300 pl-6">
                        <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-slate-400 font-normal">Korrektur: </span>
                          {item.correctionTip}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-8 text-center bg-slate-900 border border-slate-800 rounded-xl text-slate-400 text-xs">
              Wähle links eine Übung aus.
            </div>
          )}

          {/* Always-visible Active Plan Overview at bottom right as well */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-sky-400" />
                <h3 className="text-sm font-semibold text-white">Geplante Einheit ({activeSession.date})</h3>
              </div>
              <span className="text-xs text-slate-400 tabular-nums">
                {activeSession.exercises.length} Übungen · {activeSession.totalDurationMinutes} Min
              </span>
            </div>

            {activeSession.exercises.length === 0 ? (
              <p className="text-xs text-slate-400">Noch keine Übungen ausgewählt.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                {activeSession.exercises.map((drill, index) => (
                  <div
                    key={drill.id}
                    onClick={() => setSelectedExercise(drill)}
                    className="p-2.5 rounded-lg bg-slate-800/80 border border-slate-700/60 flex items-center justify-between gap-2 cursor-pointer hover:border-sky-500/60"
                  >
                    <div className="truncate">
                      <div className="text-[11px] text-slate-400">
                        {index + 1}. Übung · {drill.durationMinutes} Min
                      </div>
                      <div className="text-xs font-medium text-white truncate">{drill.title}</div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeExerciseFromSession(drill.id);
                      }}
                      className="text-slate-400 hover:text-rose-400 text-xs shrink-0 p-1"
                      title="Entfernen"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL 1: CREATE CUSTOM EXERCISE */}
      <ExerciseCreatorModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onExerciseCreated={(newEx) => setSelectedExercise(newEx)}
      />

      {/* MODAL 2: DHB METHODISCHES HANDBUCH & ELTERNARBEIT */}
      {isMethodologyModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-3xl w-full my-6 p-6 space-y-5 shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setIsMethodologyModalOpen(false)}
              className="absolute top-5 right-5 text-slate-400 hover:text-white"
            >
              ✕
            </button>

            <div className="space-y-1">
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
                {DHB_METHODOLOGY_GUIDELINES.source}
              </span>
              <h3 className="text-lg font-bold text-white">
                {DHB_METHODOLOGY_GUIDELINES.title}
              </h3>
              <p className="text-xs text-slate-400">
                Wesentliche methodische Leitsätze für Handballtrainer aus dem DHB-Ausbildungslehrgang.
              </p>
            </div>

            <div className="space-y-4 pt-2">
              {DHB_METHODOLOGY_GUIDELINES.sections.map((section, idx) => (
                <div key={idx} className="p-4 bg-slate-800/50 rounded-xl border border-slate-800 space-y-2">
                  <h4 className="text-xs font-bold text-sky-400 uppercase">{section.title}</h4>
                  <ul className="space-y-1 text-xs text-slate-300 list-disc list-inside">
                    {section.rules.map((rule, rIdx) => (
                      <li key={rIdx}>{rule}</li>
                    ))}
                  </ul>
                </div>
              ))}

              <div className="p-4 bg-purple-950/20 border border-purple-800/40 rounded-xl space-y-3">
                <div className="flex items-center gap-2">
                  <HeartHandshake className="w-4 h-4 text-purple-400" />
                  <h4 className="text-xs font-bold text-purple-300 uppercase">
                    {DHB_METHODOLOGY_GUIDELINES.parentingChecklist.title} ({DHB_METHODOLOGY_GUIDELINES.parentingChecklist.source})
                  </h4>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {DHB_METHODOLOGY_GUIDELINES.parentingChecklist.steps.map((item, idx) => (
                    <div key={idx} className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800">
                      <strong className="text-purple-300 block">{idx + 1}. {item.step}</strong>
                      <span className="text-slate-400 text-[11px]">{item.desc}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-800">
              <button
                type="button"
                onClick={() => setIsMethodologyModalOpen(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-medium"
              >
                Schließen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
