export type UserRole = 'head_coach' | 'assistant_coach' | 'player' | 'parent';

export type Position = 'LA' | 'RL' | 'RM' | 'RR' | 'RA' | 'KM' | 'TW';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  jerseyNumber?: number;
  position?: Position;
  avatarUrl?: string;
  teamId: string;
  teamName: string;
  isParentOf?: string; // player ID if parent
}

export type CourtType = 'full' | 'half' | 'one_goal';
export type Difficulty = 'basis' | 'fortgeschritten' | 'leistung';
export type FocusCategory = 
  | 'abwehr' 
  | 'angriff_1v1' 
  | 'tempospiel' 
  | 'wurftechnik' 
  | 'kleingruppe' 
  | 'torwart' 
  | 'athletik';

export type LoadIntensity = 'regeneration' | 'technik_taktik' | 'spielform' | 'hochintensiv';

export interface TacticalPlayer {
  id: string;
  role: 'attack' | 'defense' | 'gk' | 'pivot';
  label: string;
  x: number; // 0 - 100% of court
  y: number; // 0 - 100% of court
  hasBall?: boolean;
}

export interface TacticalPath {
  id: string;
  fromX: number;
  fromY: number;
  toX: number;
  toY: number;
  type: 'pass' | 'run' | 'dribble' | 'shot';
  curve?: number;
}

export interface TacticalCourtData {
  players: TacticalPlayer[];
  paths: TacticalPath[];
  ballPosition?: { x: number; y: number };
}

export interface Exercise {
  id: string;
  title: string;
  shortDesc: string;
  category: FocusCategory;
  court: CourtType;
  difficulty: Difficulty;
  minPlayers: number;
  maxPlayers: number;
  recommendedPlayers: number;
  durationMinutes: number;
  intensity: LoadIntensity;
  intensityScore: number; // 1 to 5
  description: string;
  setupInstructions: string[];
  coachingPoints: string[];
  tacticalCourt: TacticalCourtData;
  simplificationTips: string[]; // Wie mache ich die Übung einfacher?
  progressionTips: string[];    // Wie steigere ich den Anspruch?
  typicalMistakes: { mistake: string; correctionTip: string }[];
  officialSource: string;       // e.g. "DHB Trainerakademie B-Lizenz"
  recommendedAgeGroup: string;  // e.g. "C- bis A-Jugend & Senioren"
  sketchImageUrl?: string;     // URL or Base64 uploaded sketch/diagram
  videoClipUrl?: string;       // URL or uploaded short demo video
  isCustom?: boolean;          // Flag for custom trainer exercises
  authorName?: string;         // Name of the creator
}

export interface TrainingSession {
  id: string;
  title: string;
  date: string;
  time: string;
  court: CourtType;
  location: string;
  exercises: Exercise[];
  totalDurationMinutes: number;
  calculatedLoadScore: number;
  loadCategory: LoadIntensity;
  targetFocus: FocusCategory[];
  notes: string;
  status: 'planned' | 'in_progress' | 'completed';
}

export interface DiagnosticMetrics {
  cooperMeters: number;       // Cooper Test 12 Min in Metern (z. B. 2850 m)
  piepTestLevel: number;      // Piep-Test / 20m Shuttle Run Level (z. B. 11.4)
  sprint20m: number;          // 20-Meter-Sprint in Sekunden (z. B. 2.92 s)
  standweitsprung: number;    // Standweitsprung in cm (z. B. 254 cm)
  bankdrueckenKg: number;     // Bankdrücken 1RM (oder geschätztes 1RM) in kg (z. B. 87.5 kg)
  burpees1Min: number;        // Burpees in 1 Minute (Anzahl Wdh., z. B. 34)
}

export interface DiagnosticTestGuide {
  id: keyof DiagnosticMetrics;
  name: string;
  shortName: string;
  unit: string;
  targetAbility: string;
  equipment: string;
  executionProtocol: string[];
  standardizationTips: string;
  qualityCriteria: {
    objectivity: string;
    reliability: string;
    validityHandball: string;
  };
  benchmarks: {
    basis: string;
    oberliga: string;
    top: string;
  };
}

export interface PlayerDiagnosticRecord {
  id: string;
  playerId: string;
  playerName: string;
  position: Position;
  testDate: string;
  testType: 'pre_season' | 'mid_season' | 'post_season';
  metrics: DiagnosticMetrics;
  categoryScores: {
    grundlagenausdauer: number; // Cooper Test (0-100)
    spielausdauer: number;      // Piep-Test (0-100)
    schnelligkeit: number;      // 20m Sprint (0-100)
    sprungkraft: number;        // Standweitsprung (0-100)
    oberkoerperkraft: number;   // Bankdrücken (0-100)
    kraftausdauer: number;      // Burpees 1 Min (0-100)
  };
  coachNotes: string;
}

export interface PlayerRpeFeedback {
  id: string;
  trainingSessionId: string;
  trainingTitle: string;
  trainingDate: string;
  playerId: string;
  playerName: string;
  rpeScore: number; // Borg CR10 (1-10)
  sorenessLocation: string;
  sleepQuality: number; // 1-5
  fatigueLevel: number; // 1-5
  playerNotes?: string;
  submittedAt: string;
}

export interface CalendarEvent {
  id: string;
  title: string;
  type: 'training' | 'game' | 'cup' | 'meeting' | 'team_event';
  date: string; // YYYY-MM-DD
  time: string;
  meetingTime: string;
  location: string;
  address: string;
  opponent?: string;
  isHomeGame?: boolean;
  notes?: string;
  linkedTrainingSessionId?: string;
  attendeesCount: {
    yes: number;
    no: number;
    maybe: number;
  };
  attendees?: AttendanceEntry[];
  userRsvp: 'yes' | 'no' | 'maybe' | 'unanswered';
  userRsvpReason?: string;
}

export interface AttendanceEntry {
  playerId: string;
  playerName: string;
  status: 'yes' | 'no' | 'maybe' | 'unanswered';
  reason?: string;
  updatedAt: string;
}

export type TaskType = 'trikotwaesche' | 'fahrdienst' | 'kampfgericht' | 'verpflegung' | 'harz_baelle';

export interface TeamTask {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  assignedPlayerId: string;
  assignedPlayerName: string;
  dueDate: string;
  eventDate: string;
  isCompleted: boolean;
  rotationNote: string;
}
