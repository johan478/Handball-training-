import React, { useState, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Exercise, 
  CourtType, 
  Difficulty, 
  FocusCategory, 
  LoadIntensity,
  TacticalCourtData,
  TacticalPlayer
} from '../types';
import { TacticalCourtView } from './TacticalCourtView';
import { 
  Plus, 
  Upload, 
  Video, 
  Image as ImageIcon, 
  Sparkles, 
  AlertTriangle, 
  Lightbulb, 
  ArrowUpRight, 
  ArrowDownRight, 
  Layers, 
  CheckCircle, 
  Film, 
  PenTool, 
  Trash2, 
  BookOpen,
  Info
} from 'lucide-react';

interface ExerciseCreatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExerciseCreated?: (created: Exercise) => void;
}

export const ExerciseCreatorModal: React.FC<ExerciseCreatorModalProps> = ({
  isOpen,
  onClose,
  onExerciseCreated
}) => {
  const { addCustomExercise, currentUser, showToast } = useApp();

  // Core Form State
  const [title, setTitle] = useState('');
  const [shortDesc, setShortDesc] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FocusCategory>('angriff_1v1');
  const [court, setCourt] = useState<CourtType>('half');
  const [difficulty, setDifficulty] = useState<Difficulty>('fortgeschritten');
  const [intensity, setIntensity] = useState<LoadIntensity>('spielform');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [recommendedAgeGroup, setRecommendedAgeGroup] = useState('C- bis A-Jugend & Senioren');

  // Player counts
  const [minPlayers, setMinPlayers] = useState(6);
  const [maxPlayers, setMaxPlayers] = useState(14);
  const [recommendedPlayers, setRecommendedPlayers] = useState(10);

  // Coaching instructions & methodology (DHB Handout alignment)
  const [setupInstructionText, setSetupInstructionText] = useState('1 Tor mit Torhüter besetzen.\n2 Angreifer im Rückraum gegen 2 Abwehrspieler bei 9m.');
  const [coachingPointText, setCoachingPointText] = useState('DHB-Grundsatz: Nur einen Hauptfehler gleichzeitig ansprechen!\nSpielsituation einfrieren, wenn Ballhalter im Passschatten steht.');
  const [simplificationText, setSimplificationText] = useState('Abwehr passiv agieren lassen (nur Schatten-Deckung).\nGrößeren Passkorridor vorgeben.');
  const [progressionText, setProgressionText] = useState('Zeitlimit von 6 Sekunden bis zum Wurf vorgeben.\nZusätzlichen Außenspieler als Passoption hinzunehmen.');
  const [mistakeText, setMistakeText] = useState('Spieler läuft quer statt gerade aufs Tor zu stoßen.');
  const [correctionTipText, setCorrectionTipText] = useState('DHB-Korrektur: „Erster Schritt gerade aufs Tor! Erst nach dem Stoßen weiterpassen.“');

  // Visual Aids
  const [activeVisualTab, setActiveVisualTab] = useState<'board' | 'sketch' | 'upload_img' | 'video'>('board');
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [uploadedVideoFile, setUploadedVideoFile] = useState<string | null>(null);

  // Tactical Board State
  const [tacticalPlayers, setTacticalPlayers] = useState<TacticalPlayer[]>([
    { id: 'p1', role: 'attack', label: 'RM', x: 50, y: 35, hasBall: true },
    { id: 'p2', role: 'attack', label: 'RL', x: 30, y: 30 },
    { id: 'p3', role: 'defense', label: 'D1', x: 45, y: 18 },
    { id: 'p4', role: 'defense', label: 'D2', x: 55, y: 18 },
    { id: 'p5', role: 'gk', label: 'TW', x: 50, y: 6 }
  ]);

  // Canvas Freehand Sketch State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawColor, setDrawColor] = useState('#38bdf8'); // sky blue

  if (!isOpen) return null;

  // Pre-fill from DHB templates
  const loadDhbTemplate = (type: 'e_jugend_matten' | 'minis_schildkroeten' | 'koordination_3bahnen') => {
    if (type === 'e_jugend_matten') {
      setTitle('Mattenball mit Wahrnehmungs-Farbkarten');
      setCategory('kleingruppe');
      setCourt('half');
      setDifficulty('basis');
      setIntensity('spielform');
      setDurationMinutes(20);
      setMinPlayers(8);
      setMaxPlayers(18);
      setRecommendedPlayers(12);
      setRecommendedAgeGroup('E- & D-Jugend');
      setShortDesc('Aus dem DHB-Lehrgang: 14x20m Feld mit 4 Turnmatten & farbigen Wechselkarten zur Schulung der visuellen Wahrnehmung.');
      setDescription('Außerhalb des 14x20m Feldes 4 Turnmatten auslegen. 2 Teams spielen im Feld Manndeckung gegeneinander, Ziel ist das Anspielen eines für max. 3s sitzenden Spielers auf der Matte (= 1 Punkt). Farbkarten steuern Richtungswechsel.');
      setSetupInstructionText('14x20m Feld mit Hütchen markieren.\n2 Turnmatten an den Seiten.\nEinige Minuten stumm spielen lassen!');
      setCoachingPointText('Blick vom Ball lösen, um freie Matten zu erkennen.\nPositive Sprache: Sagen was gemeint ist!');
      setSimplificationText('Zeitlimit auf der Matte auf 5 Sekunden erhöhen.');
      setProgressionText('Farbkarten: Rot = quer spielen, Blau = längs, Grün = diagonal.');
      setMistakeText('Alle Kinder rennen gleichzeitig zum Ball (Rudelbildung).');
      setCorrectionTipText('DHB-Tipp: Spielsituation einfrieren, Lücken im Raum aufzeigen.');
      showToast('Vorlage „Mattenball mit Farbkarten“ (DHB E-Jugend) geladen!');
    } else if (type === 'minis_schildkroeten') {
      setTitle('Schildkröten-Kooperationsfangspiel');
      setCategory('athletik');
      setCourt('half');
      setDifficulty('basis');
      setIntensity('spielform');
      setDurationMinutes(15);
      setMinPlayers(8);
      setMaxPlayers(20);
      setRecommendedPlayers(14);
      setRecommendedAgeGroup('Minis (unter 8 Jahre)');
      setShortDesc('Kindgerechtes Fang- und Hebespiel zur Teambildung, Körperspannung und Raumorientierung.');
      setDescription('6 Tierpfleger fangen die geflohenen Schildkröten (andere Kinder). Bei Berührung legen sich diese auf den Bauch, machen sich steif und werden gemeinsam ins Weichboden-Revier getragen.');
      setSetupInstructionText('Weichbodenmatte als Revier aufbauen.\nTierpfleger mit Leibchen ausstatten.\nBildhafte Sprache nutzen!');
      setCoachingPointText('Kinder auf Augenhöhe ansprechen und Blickkontakt halten.\nGemeinsames Heben loben.');
      setSimplificationText('Kinder dürfen selbst ins Revier krabbeln.');
      setProgressionText('Zeitwettkampf zwischen 3 Gruppen stoppen.');
      setMistakeText('Kinder zerren unvorsichtig am Partner.');
      setCorrectionTipText('„Erst absprechen: Wer hebt vorne, wer hinten? Eins, zwei, hoch!“');
      showToast('Vorlage „Schildkröten-Fangspiel“ (DHB Minis) geladen!');
    } else {
      setTitle('3-Bahnen-Koordinationslauf mit Schlagwurf');
      setCategory('wurftechnik');
      setCourt('one_goal');
      setDifficulty('basis');
      setIntensity('spielform');
      setDurationMinutes(25);
      setMinPlayers(6);
      setMaxPlayers(16);
      setRecommendedPlayers(12);
      setRecommendedAgeGroup('E- bis C-Jugend');
      setShortDesc('3 parallele Stationsbahnen (Reifen, Bänke, Bandgasse) mit Doppelpass und Torabschluss.');
      setDescription('Stationswettkampf: Bahn 1 (Reifensprünge + Doppelpass), Bahn 2 (Bänke + Prellen + Schlagwurf), Bahn 3 (Baustellenband-Gasse + Täuschung).');
      setSetupInstructionText('3 Bahnen nebeneinander aufbauen.\nTorwart im Tor.');
      setCoachingPointText('Kinder Bewegungsabläufe vormachen lassen!\nLange Ausholbewegung anregen.');
      setSimplificationText('Ohne Doppelpass direkt auf das Tor werfen.');
      setProgressionText('Wettkampf: Welches Team erzielt in 4 Minuten die meisten Treffer?');
      setMistakeText('Mangelnde Ausholbewegung beim Wurf („Schieben“).');
      setCorrectionTipText('DHB-Selbstkorrektur: „Versucht flach von oben nach unten auf die Torlinie zu werfen!“');
      showToast('Vorlage „Koordinationsläufe“ (DHB E-Jugend) geladen!');
    }
  };

  // Image upload handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setUploadedImage(reader.result as string);
        showToast('Skizze/Bild erfolgreich geladen!');
      };
      reader.readAsDataURL(file);
    }
  };

  // Video upload handler
  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const videoObjectUrl = URL.createObjectURL(file);
      setUploadedVideoFile(videoObjectUrl);
      showToast('Videoclip für Bewegungsdemonstration hochgeladen!');
    }
  };

  // Canvas Sketch Handlers
  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.beginPath();
    ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    setIsDrawing(true);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  const saveCanvasAsSketch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL('image/png');
    setUploadedImage(dataUrl);
    showToast('Freihand-Skizze als visuelle Hilfe übernommen!');
    setActiveVisualTab('upload_img');
  };

  // Add new player to tactical board
  const addBoardPlayer = (role: 'attack' | 'defense' | 'gk' | 'pivot') => {
    const newId = `p-${Date.now()}`;
    const nextNum = tacticalPlayers.filter(p => p.role === role).length + 1;
    const labels = {
      attack: `A${nextNum}`,
      defense: `D${nextNum}`,
      gk: 'TW',
      pivot: `KM${nextNum}`
    };
    setTacticalPlayers(prev => [
      ...prev,
      {
        id: newId,
        role,
        label: labels[role],
        x: 50,
        y: role === 'gk' ? 6 : role === 'defense' ? 20 : 35
      }
    ]);
  };

  const handleSaveExercise = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      showToast('Bitte einen Übungsnamen eingeben.');
      return;
    }

    const intensityScoreMap: Record<LoadIntensity, number> = {
      regeneration: 1,
      technik_taktik: 2,
      spielform: 3,
      hochintensiv: 5
    };

    const newExercise: Exercise = {
      id: `custom-ex-${Date.now()}`,
      title: title.trim(),
      shortDesc: shortDesc.trim() || description.slice(0, 100),
      category,
      court,
      difficulty,
      minPlayers: Number(minPlayers),
      maxPlayers: Number(maxPlayers),
      recommendedPlayers: Number(recommendedPlayers),
      durationMinutes: Number(durationMinutes),
      intensity,
      intensityScore: intensityScoreMap[intensity],
      description: description.trim() || title,
      setupInstructions: setupInstructionText.split('\n').filter(s => s.trim().length > 0),
      coachingPoints: coachingPointText.split('\n').filter(s => s.trim().length > 0),
      tacticalCourt: {
        players: tacticalPlayers,
        paths: [
          { id: 'path-1', fromX: 50, fromY: 35, toX: 50, toY: 10, type: 'shot' }
        ],
        ballPosition: { x: 50, y: 35 }
      },
      simplificationTips: simplificationText.split('\n').filter(s => s.trim().length > 0),
      progressionTips: progressionText.split('\n').filter(s => s.trim().length > 0),
      typicalMistakes: [
        {
          mistake: mistakeText.trim() || 'Fehlendes Stoßen in die Nahtstelle.',
          correctionTip: correctionTipText.trim() || 'DHB-Korrektur: Direkter Blickkontakt und Anlauf gerade auf die Lücke.'
        }
      ],
      officialSource: `Eigene Trainer-Kreation (${currentUser.name})`,
      recommendedAgeGroup,
      sketchImageUrl: uploadedImage || undefined,
      videoClipUrl: uploadedVideoFile || videoUrl.trim() || undefined,
      isCustom: true,
      authorName: currentUser.name
    };

    addCustomExercise(newExercise);
    if (onExerciseCreated) onExerciseCreated(newExercise);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl max-w-4xl w-full my-6 p-5 sm:p-7 space-y-6 shadow-2xl relative max-h-[92vh] overflow-y-auto">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-slate-400 hover:text-white text-base transition-colors"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="space-y-1 pr-8">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400"></span>
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
              Trainer-Toolbox & Übungs-Editor
            </span>
          </div>
          <h2 className="text-xl font-extrabold text-white">
            Eigene Handball-Übung erstellen
          </h2>
          <p className="text-xs text-slate-400">
            Erstelle maßgeschneiderte Übungsformen mit Taktikskizzen, Videoclips und methodischen DHB-Coaching-Hinweisen.
          </p>
        </div>

        {/* DHB Lehrgangs-Vorlagen Schnellwahl */}
        <div className="bg-slate-800/80 border border-slate-700/60 rounded-xl p-3.5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-sky-400 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4" />
              <span>Schnellvorlage aus DHB-Trainerlehrgang laden:</span>
            </span>
            <span className="text-slate-400 text-[11px]">Klick füllt die Felder automatisch aus</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => loadDhbTemplate('e_jugend_matten')}
              className="p-2.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-lg text-left text-xs text-slate-200 transition-colors"
            >
              <div className="font-bold text-white text-[11px] truncate">Mattenball & Farbkarten</div>
              <div className="text-[10px] text-slate-400 truncate">DHB E-Jugend Einstieg</div>
            </button>

            <button
              type="button"
              onClick={() => loadDhbTemplate('koordination_3bahnen')}
              className="p-2.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-lg text-left text-xs text-slate-200 transition-colors"
            >
              <div className="font-bold text-white text-[11px] truncate">3-Bahnen-Koordinationslauf</div>
              <div className="text-[10px] text-slate-400 truncate">DHB E-Jugend Schlagwurf</div>
            </button>

            <button
              type="button"
              onClick={() => loadDhbTemplate('minis_schildkroeten')}
              className="p-2.5 bg-slate-900 hover:bg-slate-750 border border-slate-700 rounded-lg text-left text-xs text-slate-200 transition-colors"
            >
              <div className="font-bold text-white text-[11px] truncate">Schildkröten einfangen</div>
              <div className="text-[10px] text-slate-400 truncate">DHB Minis Fangspiel</div>
            </button>
          </div>
        </div>

        <form onSubmit={handleSaveExercise} className="space-y-6">
          
          {/* SECTION 1: Core Parameters (Name, Fokus, Platzgröße, Schwierigkeit) */}
          <div className="space-y-4 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>1. Basis-Parameter & Übungsdaten</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">
                  Übungsname *
                </label>
                <input
                  type="text"
                  required
                  placeholder="z. B. 2. Welle im 4-gegen-3 mit schnellem Rückzug"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-sky-500"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Trainings-Fokus (Kategorie) *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="angriff_1v1">Angriff (1-gegen-1 / Täuschung)</option>
                  <option value="abwehr">Abwehr (6:0 / 3:2:1 / Manndeckung)</option>
                  <option value="tempospiel">Tempospiel (1. bis 3. Welle)</option>
                  <option value="wurftechnik">Wurftechnik & Präzision</option>
                  <option value="kleingruppe">Kleingruppe & Kreuzen</option>
                  <option value="torwart">Torhüter-Training</option>
                  <option value="athletik">Athletik & Koordination</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Platzgröße / Hallenplatz *
                </label>
                <select
                  value={court}
                  onChange={(e) => setCourt(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="full">Volles Spielfeld (40x20m)</option>
                  <option value="half">1/2 Halle (Halbfeld 20x20m)</option>
                  <option value="one_goal">1 Tor (Torwurfzone)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Schwierigkeitsgrad *
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="basis">Basis (Minis bis D-Jugend / Grundlagen)</option>
                  <option value="fortgeschritten">Fortgeschritten (C- & B-Jugend)</option>
                  <option value="leistung">Leistung (A-Jugend & Aktive / Oberliga)</option>
                </select>
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Belastungs-Intensität *
                </label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none"
                >
                  <option value="regeneration">Regeneration (Low Load)</option>
                  <option value="technik_taktik">Technik & Taktik (Moderate)</option>
                  <option value="spielform">Spielform (High)</option>
                  <option value="hochintensiv">Hochintensiv / Kondition (Peak Load)</option>
                </select>
              </div>

              <div className="sm:col-span-2 grid grid-cols-1 sm:grid-cols-4 gap-3 pt-1">
                <div>
                  <label className="text-slate-400 block mb-1">Min. Spieler</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={minPlayers}
                    onChange={(e) => setMinPlayers(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Max. Spieler</label>
                  <input
                    type="number"
                    min="4"
                    max="30"
                    value={maxPlayers}
                    onChange={(e) => setMaxPlayers(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Empfohlen</label>
                  <input
                    type="number"
                    min="2"
                    max="30"
                    value={recommendedPlayers}
                    onChange={(e) => setRecommendedPlayers(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold text-sky-400"
                  />
                </div>
                <div>
                  <label className="text-slate-400 block mb-1">Dauer (Minuten)</label>
                  <input
                    type="number"
                    min="5"
                    max="60"
                    step="5"
                    value={durationMinutes}
                    onChange={(e) => setDurationMinutes(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white font-bold"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">
                  Kurzbeschreibung & Übungsziel
                </label>
                <input
                  type="text"
                  placeholder="Ziel der Übung in 1-2 prägnanten Sätzen..."
                  value={shortDesc}
                  onChange={(e) => setShortDesc(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="text-slate-300 font-semibold block mb-1">
                  Detaillierte Beschreibung & Ablauf
                </label>
                <textarea
                  rows={3}
                  placeholder="Ausführlicher Ablauf, Stationen, Ballführung, Passwege..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: Visual Aids (Taktikboard, Skizzen-Upload, Freihand-Skizze & Video-Clip) */}
          <div className="space-y-4 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                <span>2. Visuelle Hilfen (Taktiktafel, Skizzen & Video-Clips)</span>
              </div>
              <span className="text-[11px] text-slate-400">
                Wähle eine oder mehrere visuelle Darstellungen
              </span>
            </div>

            {/* Visual Aid Mode Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-800 rounded-lg overflow-x-auto text-xs">
              <button
                type="button"
                onClick={() => setActiveVisualTab('board')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeVisualTab === 'board' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>Interaktives Taktikboard</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveVisualTab('sketch')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeVisualTab === 'sketch' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>Freihand-Skizze zeichnen</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveVisualTab('upload_img')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeVisualTab === 'upload_img' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <ImageIcon className="w-3.5 h-3.5" />
                <span>Skizze/Bild hochladen</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveVisualTab('video')}
                className={`px-3 py-1.5 rounded-md font-medium flex items-center gap-1.5 transition-colors ${
                  activeVisualTab === 'video' ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Video className="w-3.5 h-3.5" />
                <span>Videoclip hochladen/verlinken</span>
              </button>
            </div>

            {/* VISUAL TAB 1: INTERACTIVE TACTICAL COURT */}
            {activeVisualTab === 'board' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Spieler mit Maus/Finger auf die gewünschte Position ziehen:</span>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => addBoardPlayer('attack')}
                      className="px-2 py-1 bg-blue-600/30 hover:bg-blue-600/50 text-blue-300 rounded text-[11px]"
                    >
                      + Angriff
                    </button>
                    <button
                      type="button"
                      onClick={() => addBoardPlayer('defense')}
                      className="px-2 py-1 bg-red-600/30 hover:bg-red-600/50 text-red-300 rounded text-[11px]"
                    >
                      + Abwehr
                    </button>
                    <button
                      type="button"
                      onClick={() => addBoardPlayer('pivot')}
                      className="px-2 py-1 bg-purple-600/30 hover:bg-purple-600/50 text-purple-300 rounded text-[11px]"
                    >
                      + Kreis
                    </button>
                  </div>
                </div>

                <div className="max-w-xl mx-auto">
                  <TacticalCourtView
                    data={{
                      players: tacticalPlayers,
                      paths: [
                        { id: 'path-shot', fromX: 50, fromY: 35, toX: 50, toY: 8, type: 'shot' }
                      ]
                    }}
                    courtType={court}
                    interactive={true}
                    onPlayersChange={setTacticalPlayers}
                  />
                </div>
              </div>
            )}

            {/* VISUAL TAB 2: FREEHAND SKETCH CANVAS */}
            {activeVisualTab === 'sketch' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Zeichne Wege, Zonen oder Aufbauten direkt auf das Feld:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {['#38bdf8', '#fbbf24', '#ef4444', '#10b981', '#ffffff'].map(c => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setDrawColor(c)}
                          style={{ backgroundColor: c }}
                          className={`w-5 h-5 rounded-full border ${drawColor === c ? 'border-white scale-110 ring-2 ring-sky-400' : 'border-transparent'}`}
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={clearCanvas}
                      className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs"
                    >
                      Löschen
                    </button>
                    <button
                      type="button"
                      onClick={saveCanvasAsSketch}
                      className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white font-medium rounded text-xs"
                    >
                      Als Skizze übernehmen
                    </button>
                  </div>
                </div>

                <div className="relative border border-slate-700 rounded-xl overflow-hidden bg-[#16213e] flex justify-center">
                  <canvas
                    ref={canvasRef}
                    width={700}
                    height={400}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    className="cursor-crosshair w-full max-w-2xl h-auto touch-none"
                  />
                </div>
              </div>
            )}

            {/* VISUAL TAB 3: IMAGE UPLOAD */}
            {activeVisualTab === 'upload_img' && (
              <div className="space-y-3 text-xs">
                <div className="border-2 border-dashed border-slate-700 rounded-xl p-6 text-center hover:border-slate-500 transition-colors">
                  <input
                    type="file"
                    id="sketch-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <label htmlFor="sketch-upload" className="cursor-pointer space-y-2 block">
                    <Upload className="w-8 h-8 text-sky-400 mx-auto" />
                    <div className="font-semibold text-white">Klicke zum Hochladen einer Taktikskizze oder Grafik</div>
                    <div className="text-slate-400 text-[11px]">PNG, JPG, SVG bis 10 MB</div>
                  </label>
                </div>

                {uploadedImage && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white">Vorschau der hochgeladenen Skizze:</span>
                      <button
                        type="button"
                        onClick={() => setUploadedImage(null)}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Entfernen</span>
                      </button>
                    </div>
                    <img
                      src={uploadedImage}
                      alt="Übungsskizze"
                      className="max-h-64 rounded-lg mx-auto object-contain border border-slate-700"
                    />
                  </div>
                )}
              </div>
            )}

            {/* VISUAL TAB 4: VIDEO CLIP UPLOAD / URL */}
            {activeVisualTab === 'video' && (
              <div className="space-y-4 text-xs">
                <div className="p-3 bg-sky-950/30 border border-sky-800/40 rounded-xl flex items-start gap-2.5">
                  <Info className="w-4 h-4 text-sky-400 shrink-0 mt-0.5" />
                  <div className="text-sky-200 text-[11px] leading-relaxed">
                    <strong>DHB-Methodik:</strong> „Nehmt von Zeit zu Zeit Kinder mit Video auf, damit sie sich selbst beobachten können.“ Kurze 5-15s Clips eignen sich hervorragend, um die richtige Schlagwurf-Ausholbewegung oder das Verschieben in der Abwehr vorzuführen.
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* File Upload */}
                  <div className="border-2 border-dashed border-slate-700 rounded-xl p-5 text-center">
                    <input
                      type="file"
                      id="video-upload"
                      accept="video/mp4,video/webm,video/quicktime"
                      onChange={handleVideoUpload}
                      className="hidden"
                    />
                    <label htmlFor="video-upload" className="cursor-pointer space-y-2 block">
                      <Film className="w-6 h-6 text-sky-400 mx-auto" />
                      <div className="font-semibold text-white">Videoclip von Gerät wählen</div>
                      <div className="text-slate-400 text-[11px]">MP4, WebM oder MOV (max. 50 MB)</div>
                    </label>
                  </div>

                  {/* External URL */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="text-slate-300 font-semibold block">
                      Oder Video-URL / Clip-Link einfügen:
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      value={videoUrl}
                      onChange={(e) => setVideoUrl(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500"
                    />
                  </div>
                </div>

                {(uploadedVideoFile || videoUrl) && (
                  <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-white flex items-center gap-1.5">
                        <Video className="w-4 h-4 text-emerald-400" />
                        <span>Vorschau des Videoclips:</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setUploadedVideoFile(null);
                          setVideoUrl('');
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Entfernen</span>
                      </button>
                    </div>

                    {uploadedVideoFile ? (
                      <video
                        controls
                        src={uploadedVideoFile}
                        className="max-h-56 rounded-lg mx-auto border border-slate-700 w-full max-w-md"
                      />
                    ) : (
                      <div className="text-[11px] text-sky-400 break-all p-2 bg-slate-800 rounded">
                        Verlinktes Video: {videoUrl}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* SECTION 3: Coaching Points, Progression/Regression & Typische Fehler (DHB Handout) */}
          <div className="space-y-4 bg-slate-850/60 p-4 rounded-xl border border-slate-800">
            <div className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <span>3. Trainer-Methodik & Varianten (DHB C-Trainer Standard)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Aufbau-Anweisungen (Zeile für Zeile)
                </label>
                <textarea
                  rows={3}
                  value={setupInstructionText}
                  onChange={(e) => setSetupInstructionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-slate-300 font-semibold block mb-1">
                  Zentrale Coaching-Points für den Trainer
                </label>
                <textarea
                  rows={3}
                  value={coachingPointText}
                  onChange={(e) => setCoachingPointText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-emerald-400 font-semibold flex items-center gap-1 mb-1">
                  <ArrowDownRight className="w-3.5 h-3.5" />
                  <span>Wie mache ich die Übung einfacher? (Regression)</span>
                </label>
                <textarea
                  rows={2}
                  value={simplificationText}
                  onChange={(e) => setSimplificationText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-amber-400 font-semibold flex items-center gap-1 mb-1">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                  <span>Wie steigere ich den Anspruch? (Progression)</span>
                </label>
                <textarea
                  rows={2}
                  value={progressionText}
                  onChange={(e) => setProgressionText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-rose-400 font-semibold flex items-center gap-1 mb-1">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Typischer Hauptfehler</span>
                </label>
                <input
                  type="text"
                  value={mistakeText}
                  onChange={(e) => setMistakeText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>

              <div>
                <label className="text-emerald-400 font-semibold flex items-center gap-1 mb-1">
                  <Lightbulb className="w-3.5 h-3.5" />
                  <span>Direkter Korrekturhinweis / Selbstkorrektur</span>
                </label>
                <input
                  type="text"
                  value={correctionTipText}
                  onChange={(e) => setCorrectionTipText(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium rounded-xl text-xs transition-colors"
            >
              Abbrechen
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-sky-600 hover:bg-sky-500 text-white font-bold rounded-xl text-xs shadow-lg transition-colors flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              <span>Übung speichern & in Datenbank veröffentlichen</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
