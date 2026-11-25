import { 
  UserProfile, 
  Exercise, 
  TrainingSession, 
  PlayerDiagnosticRecord, 
  DiagnosticTestGuide,
  PlayerRpeFeedback, 
  CalendarEvent, 
  TeamTask 
} from '../types';

export const CURRENT_TEAM = {
  id: 'team-handball-01',
  name: 'SG Handball Westfalen (1. Herren / Oberliga)',
  season: '2026/2027',
  nextMatchDate: '2026-10-28',
  nextMatchOpponent: 'HSG Nordhorn-Lingen II'
};

export const MOCK_USERS: UserProfile[] = [
  {
    id: 'user-coach-1',
    name: 'Marcus Lindemann',
    email: 'marcus.lindemann@sg-westfalen.de',
    role: 'head_coach',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
  },
  {
    id: 'user-coach-2',
    name: 'David Vogel',
    email: 'david.vogel@sg-westfalen.de',
    role: 'assistant_coach',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name
  },
  {
    id: 'user-player-1',
    name: 'Jan Kowalski',
    email: 'jan.kowalski@sg-westfalen.de',
    role: 'player',
    jerseyNumber: 7,
    position: 'RL',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name
  },
  {
    id: 'user-player-2',
    name: 'Lukas Bauer',
    email: 'lukas.bauer@sg-westfalen.de',
    role: 'player',
    jerseyNumber: 1,
    position: 'TW',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name
  },
  {
    id: 'user-player-3',
    name: 'Felix Meier',
    email: 'felix.meier@sg-westfalen.de',
    role: 'player',
    jerseyNumber: 14,
    position: 'KM',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name
  },
  {
    id: 'user-player-4',
    name: 'Timon Richter',
    email: 'timon.richter@sg-westfalen.de',
    role: 'player',
    jerseyNumber: 9,
    position: 'RM',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name
  },
  {
    id: 'user-parent-1',
    name: 'Sabine Kowalski',
    email: 'sabine.kowalski@web.de',
    role: 'parent',
    isParentOf: 'user-player-1',
    teamId: 'team-handball-01',
    teamName: CURRENT_TEAM.name
  }
];

export const MOCK_EXERCISES: Exercise[] = [
  {
    id: 'ex-1',
    title: 'Kreuzen mit Kreis-Sperre & Absetzen (Kleingruppe Rückraum)',
    shortDesc: 'Auslösehandlung mit RM und RL, Sperre am Kreis durch KM gegen offensive 3:2:1 / 6:0.',
    category: 'kleingruppe',
    court: 'half',
    difficulty: 'fortgeschritten',
    minPlayers: 6,
    maxPlayers: 14,
    recommendedPlayers: 10,
    durationMinutes: 18,
    intensity: 'spielform',
    intensityScore: 3,
    description: 'RM stößt in die Nahtstelle zwischen Halb- und Außenverteidiger, leitet das Kreuzen mit RL ein. Gleichzeitig setzt KM eine Sperre auf den Innenblock. RL hat die Option zum Schlagwurf, Durchbruch oder Bodenpass an den absetzenden KM.',
    setupInstructions: [
      'Angriff: 1x RM, 1x RL, 1x KM besetzen Positionen ab 12m.',
      'Abwehr: 2x Innenblocker (HR, HL) und 1x Torwart im Kasten.',
      'Bälle beim Zuspieler an der Mittellinie.',
      'Wiederholung in 3er-Wellen mit schnellem Positionswechsel.'
    ],
    coachingPoints: [
      'Gefährlichkeit vor dem Pass: RM muss das Tor direkt attackieren, nicht nur quer laufen.',
      'Timing der Sperre: KM darf sich erst im Moment des Kreuzens querstellen (kein Stürmerfoul).',
      'Kopf oben bei RL: Entscheidung Schlagwurf oder Pass an den Kreis innerhalb von 0.5s.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'RM', x: 50, y: 35, hasBall: true },
        { id: 'p2', role: 'attack', label: 'RL', x: 30, y: 30 },
        { id: 'p3', role: 'pivot', label: 'KM', x: 42, y: 17 },
        { id: 'p4', role: 'defense', label: 'D1', x: 44, y: 15 },
        { id: 'p5', role: 'defense', label: 'D2', x: 56, y: 15 },
        { id: 'p6', role: 'gk', label: 'TW', x: 50, y: 5 }
      ],
      paths: [
        { id: 't1', fromX: 50, fromY: 35, toX: 42, toY: 26, type: 'run' },
        { id: 't2', fromX: 42, fromY: 26, toX: 36, toY: 25, type: 'pass' },
        { id: 't3', fromX: 30, fromY: 30, toX: 46, toY: 18, type: 'run' },
        { id: 't4', fromX: 46, fromY: 18, toX: 50, toY: 6, type: 'shot' }
      ],
      ballPosition: { x: 50, y: 35 }
    },
    simplificationTips: [
      'Abwehr passiv agieren lassen (nur Schatten-Deckung ohne Körperkontakt).',
      'Distanz zur Abwehr vergrößern (Markierungshütchen bei 11m statt 9m).',
      'Zunächst nur eine feste Abschlussoption vorgeben (z. B. immer Wurf von RL).'
    ],
    progressionTips: [
      'Abwehr darf aktiv heraustreten und den Pass antizipieren (Wettkampfdruck).',
      'Zusätzlicher RR als weitere Passoption einbinden (4:3 Überzahlsituation).',
      'Zeitlimit von 6 Sekunden ab Anstoß bis zum Torabschluss setzen.'
    ],
    typicalMistakes: [
      {
        mistake: 'RM läuft quer statt in die Tiefe und bindet den Abwehrspieler nicht.',
        correctionTip: 'Traineranweisung: „Erster Schritt muss gerade aufs Tor gehen! Erst nach dem Stoßen kreuzen.“'
      },
      {
        mistake: 'KM stellt sich zu früh oder bewegt sich in der Sperre (Offensivfoul).',
        correctionTip: 'Fester Stand, breite Basis, Arme am Körper, Kopf zur Spielfeldseite halten.'
      },
      {
        mistake: 'RL nimmt den Ball im Stand an und verliert den Geschwindigkeitsvorteil.',
        correctionTip: 'RL startet aus dem Rückraum mit Anlauf und fängt den Ball in der Vorwärtsbewegung.'
      }
    ],
    officialSource: 'DHB Rahmentrainingskonzeption B-Lizenz / Modul Kooperation & Tempospiel',
    recommendedAgeGroup: 'B- & A-Jugend sowie Aktive'
  },
  {
    id: 'ex-2',
    title: '3-Wellen-Gegenstoß mit variabler Rückzugs-Verteidigung',
    shortDesc: 'Vollfeld-Tempospiel: 1. Welle über Außen, 2. Welle über Rückraum, 3. Welle Schnelle Mitte.',
    category: 'tempospiel',
    court: 'full',
    difficulty: 'leistung',
    minPlayers: 10,
    maxPlayers: 20,
    recommendedPlayers: 14,
    durationMinutes: 20,
    intensity: 'hochintensiv',
    intensityScore: 5,
    description: 'Nach Torabschluss auf Tor A startet Team Weiß sofort das Umschalten über LA/RA (1. Welle). Gelingt kein direkter Konter, folgt die 2. Welle im 3-gegen-2 bzw. 4-gegen-3. Team Blau sprintet im schnellen Rückzug zurück und formiert den Abwehrriegel.',
    setupInstructions: [
      'Volles Spielfeld. 2 Torhüter im Einsatz.',
      'Team Blau beginnt im Positionsangriff an Tor A.',
      'Nach Abschluss Sprint aller Spieler: Weiß schaltet um auf Angriff, Blau auf Rückzug.',
      'Dauer: 4 Serien à 4 Minuten mit hoher Taktung.'
    ],
    coachingPoints: [
      'Passgenauigkeit vor Schnelligkeit bei Langpässen des Torhüters.',
      'Außen laufen maximale Breite an den Seitenauslinien.',
      'Verteidiger sichern als Erstes den Passweg ins Zentrum ab.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'LA', x: 12, y: 70 },
        { id: 'p2', role: 'attack', label: 'RA', x: 88, y: 72 },
        { id: 'p3', role: 'attack', label: 'RM', x: 50, y: 60, hasBall: true },
        { id: 'p4', role: 'defense', label: 'D1', x: 40, y: 35 },
        { id: 'p5', role: 'defense', label: 'D2', x: 60, y: 35 },
        { id: 'p6', role: 'gk', label: 'TW', x: 50, y: 8 }
      ],
      paths: [
        { id: 't1', fromX: 50, fromY: 60, toX: 18, toY: 25, type: 'pass' },
        { id: 't2', fromX: 12, fromY: 70, toX: 18, toY: 24, type: 'run' },
        { id: 't3', fromX: 18, toX: 48, fromY: 24, toY: 10, type: 'shot' }
      ],
      ballPosition: { x: 50, y: 60 }
    },
    simplificationTips: [
      'Rückzug ohne Stören in der gegnerischen Hälfte (erst ab Mittellinie verteidigen).',
      'Keine Überzahlsituationen, sondern feste 2-gegen-1 Zuordnung.',
      'Torhüter wirft immer an die Mittellinie statt bis an den 9m-Kreis.'
    ],
    progressionTips: [
      'Strikter 8-Sekunden-Timer vom Pfiff bis zum Wurf auf der Shot-Clock.',
      'Tor zählte doppelt, wenn durch 1. Welle direkt ohne Dribbling erzielt.',
      'Abwehr darf im Vollsprint die ersten Passstationen aggressiv doppeln.'
    ],
    typicalMistakes: [
      {
        mistake: 'Feldspieler drehen sich beim Rückzug mit dem Rücken zum Ball um.',
        correctionTip: 'Rückwärts/Seitwärts-Sprint mit Blickrichtung zum Ball und Gegner.'
      },
      {
        mistake: 'Außenspieler laufen nach innen und verengen den Passkorridor.',
        correctionTip: 'An der Seitenlinie entlang sprinten, erst auf Höhe 9m nach innen ziehen.'
      }
    ],
    officialSource: 'DHB A-Lizenz Handbuch / Tempospiel & Schnelle Mitte',
    recommendedAgeGroup: 'B-Jugend bis Senioren'
  },
  {
    id: 'ex-3',
    title: '6:0-Abwehrverband: Ballorientiertes Verschieben & Absichern',
    shortDesc: 'Kompakte Grundformation mit Heraustreten auf Ballführenden und Absicherung durch den Nachbarn.',
    category: 'abwehr',
    court: 'half',
    difficulty: 'basis',
    minPlayers: 8,
    maxPlayers: 16,
    recommendedPlayers: 12,
    durationMinutes: 15,
    intensity: 'technik_taktik',
    intensityScore: 2,
    description: 'Die 6:0-Deckung verschiebt synchron zur Ballbewegung des gegnerischen Rückraums. Wenn RL den Ball erhält, tritt der HL bis auf 9m heraus, während Innenblock und Außenverteidiger einrücken und den Kreis absichern.',
    setupInstructions: [
      '6 Abwehrspieler an der 6m-Linie (AL, HL, IL, IR, HR, AR).',
      '5 Angreifer im Positionsangriff (LA, RL, RM, RR, RA) spielen den Ball mit Druck.',
      'Kreisläufer bewegt sich variabel zwischen den Innenblockern.'
    ],
    coachingPoints: [
      'Schrägstellung der Füße beim Heraustreten (Wurfhandseite antizipieren).',
      'Ständige Kommunikation: Lautstarkes Ansagen von Übernahmen („Ich hab RL!").',
      'Keine Lücken zwischen den Verteidigern aufreißen lassen.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'defense', label: 'AL', x: 20, y: 15 },
        { id: 'p2', role: 'defense', label: 'HL', x: 35, y: 20 },
        { id: 'p3', role: 'defense', label: 'IL', x: 45, y: 16 },
        { id: 'p4', role: 'defense', label: 'IR', x: 55, y: 16 },
        { id: 'p5', role: 'defense', label: 'HR', x: 65, y: 16 },
        { id: 'p6', role: 'defense', label: 'AR', x: 80, y: 15 },
        { id: 'p7', role: 'attack', label: 'RL', x: 34, y: 32, hasBall: true },
        { id: 'p8', role: 'attack', label: 'RM', x: 50, y: 35 },
        { id: 'p9', role: 'gk', label: 'TW', x: 50, y: 6 }
      ],
      paths: [
        { id: 't1', fromX: 35, fromY: 16, toX: 35, toY: 23, type: 'run' },
        { id: 't2', fromX: 45, fromY: 16, toX: 40, toY: 17, type: 'run' }
      ],
      ballPosition: { x: 34, y: 32 }
    },
    simplificationTips: [
      'Angriff darf nur Passen, keine Körpertäuschungen und keine Würfe.',
      'Verlangsamtes Balltempo (Trainer gibt den Passrhythmus mit Klatschen vor).'
    ],
    progressionTips: [
      'Angriff agiert mit freiem Spiel und 1-gegen-1 Durchbrüchen.',
      'Kreisläufer darf aktive Sperren gegen den heraustretenden Halbverteidiger setzen.'
    ],
    typicalMistakes: [
      {
        mistake: 'Abwehrspieler springt den Werfer im Block an und foult in der Luft.',
        correctionTip: 'Gerade nach oben springen („Kerzensprung"), Arme vertikal nach oben, keine Bewegung nach vorne.'
      },
      {
        mistake: 'Innenblock rückt nicht nach, wenn HL heraustritt -> Loch am Kreis.',
        correctionTip: 'Kettenreaktion einüben: „Wenn einer rausgeht, schließen zwei den Rücken!".'
      }
    ],
    officialSource: 'DHB C-/B-Trainer Grundkurs Abwehrsysteme',
    recommendedAgeGroup: 'C-Jugend bis Senioren'
  },
  {
    id: 'ex-4',
    title: '1-gegen-1 Passtäuschung mit Durchbruch & Sprungwurf',
    shortDesc: 'Dynamische Wurf- und Passtäuschung gegen heraustretenden Verteidiger aus 9m.',
    category: 'angriff_1v1',
    court: 'one_goal',
    difficulty: 'fortgeschritten',
    minPlayers: 6,
    maxPlayers: 12,
    recommendedPlayers: 8,
    durationMinutes: 14,
    intensity: 'hochintensiv',
    intensityScore: 4,
    description: 'Rückraumspieler läuft diagonal mit Vorbereitungsschritt an, deutet einen Pass nach rechts außen an und bricht mit tiefem Stemmschritt auf der Handseite nach links durch zum 6m-Sprungwurf.',
    setupInstructions: [
      '1 Tor mit Torhüter.',
      '1 Abwehrspieler auf Position Halb bei 8m.',
      'Anspieler auf RM spielt RL mit Druck an.',
      'RL attackiert im 1-gegen-1.'
    ],
    coachingPoints: [
      'Körperhaltung: Körperschwerpunkt absenken bei der Richtungsänderung.',
      'Ballschutz: Ball weg vom Verteidiger führen.',
      'Explosiver Abdruck des Standbeins nach der Täuschung.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'RL', x: 35, y: 38, hasBall: true },
        { id: 'p2', role: 'defense', label: 'DEF', x: 38, y: 22 },
        { id: 'p3', role: 'gk', label: 'TW', x: 50, y: 6 }
      ],
      paths: [
        { id: 't1', fromX: 35, fromY: 38, toX: 42, toY: 26, type: 'dribble' },
        { id: 't2', fromX: 42, fromY: 26, toX: 32, toY: 16, type: 'run' },
        { id: 't3', fromX: 32, fromY: 16, toX: 48, toY: 7, type: 'shot' }
      ],
      ballPosition: { x: 35, y: 38 }
    },
    simplificationTips: [
      'Verteidiger durch Schaumstoff-Dummy oder Stange ersetzen.',
      'Nur die Beinarbeit (3-Schritt-Rhythmus) ohne Ball trocken durchführen.'
    ],
    progressionTips: [
      'Verteidiger darf mit vollem Kontakt klammern.',
      'Wahlweise Durchbruch auf Hand- oder Gegenhandseite fordern.'
    ],
    typicalMistakes: [
      {
        mistake: 'Spieler macht Schrittfehler beim Abstoppen (mehr als 3 Schritte).',
        correctionTip: 'Rhythmus laut mitzählen: „Eins - Zwei - Sprung!".'
      },
      {
        mistake: 'Täuschung wird zu weit weg vom Verteidiger (bei 11m) ausgeführt.',
        correctionTip: 'Mutig bis auf 8,5m heranlaufen, um den Verteidiger zu binden.'
      }
    ],
    officialSource: 'EHF Coaching Academy / Individual Attack Tactics',
    recommendedAgeGroup: 'D-Jugend bis Senioren'
  },
  {
    id: 'ex-5',
    title: 'Torhüter-Stellungsspiel: Reaktionsbahn & Abpraller-Sicherung',
    shortDesc: 'Spezifisches Torwarttraining: Halbkreis-Winkelspiel, Fußabwehr & Übergang zum Gegenstoßpass.',
    category: 'torwart',
    court: 'one_goal',
    difficulty: 'leistung',
    minPlayers: 4,
    maxPlayers: 8,
    recommendedPlayers: 6,
    durationMinutes: 15,
    intensity: 'technik_taktik',
    intensityScore: 3,
    description: 'Torhüter bewegt sich im Halbkreis auf der Torlinie (Winkelhalbierende). Würfe erfolgen aus wechselnden Positionen (Außen, Rückraum, Kreis). Nach Parade sofort Ball sichern und punktgenauen Gegenstoßpass auf den sprintenden Außenspieler werfen.',
    setupInstructions: [
      '1 Torhüter im Tor, 1 Ersatztorhüter hinter dem Tor zum Zureichen.',
      '3 Schützen auf LA, RL, RM mit Ballkiste.',
      '1 Sprinter an der Mittellinie für den Konterpass.'
    ],
    coachingPoints: [
      'Kompakte Grundstellung: Hände auf Brusthöhe, Fersen leicht angehoben.',
      'Keine unnötigen Seitwärtssprünge vor dem Wurf („Stehen bleiben!").',
      'Blickkontakt zum Ball bis zum Einschlag in Hand oder Bein.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'gk', label: 'TW', x: 50, y: 8 },
        { id: 'p2', role: 'attack', label: 'S1', x: 20, y: 25 },
        { id: 'p3', role: 'attack', label: 'S2', x: 45, y: 35, hasBall: true },
        { id: 'p4', role: 'attack', label: 'S3', x: 75, y: 25 }
      ],
      paths: [
        { id: 't1', fromX: 45, fromY: 35, toX: 50, toY: 8, type: 'shot' },
        { id: 't2', fromX: 50, fromY: 8, toX: 85, toY: 45, type: 'pass' }
      ],
      ballPosition: { x: 45, y: 35 }
    },
    simplificationTips: [
      'Wurfwinkel vorab ankündigen (z.B. „Jetzt unten links").',
      'Geringere Wurfgeschwindigkeit (aus dem Stand werfen statt Sprungwurf).'
    ],
    progressionTips: [
      'Blickfeld durch Vorhang oder Dummies einschränken (späte Wurferkennung).',
      'Unmittelbar nach erstem Wurf zweiten Ball aus 6m unangekündigt nachwerfen.'
    ],
    typicalMistakes: [
      {
        mistake: 'Torwart springt zu früh in eine Ecke und wird ausgeguckt.',
        correctionTip: 'Ruhe bewahren, Schützen lesen, Körperschwerpunkt stabil halten.'
      }
    ],
    officialSource: 'DHB Torwart-Lehrbrief / Henning Fritz Methodik',
    recommendedAgeGroup: 'C-Jugend bis Bundesliga'
  },
  {
    id: 'ex-6',
    title: 'Intervall-Athletikparcours mit Handball-Präzisionswurf',
    shortDesc: 'Kondition & Schnellkraft unter Sauerstoffschuld mit Zielwurf auf Tor-Ecken.',
    category: 'athletik',
    court: 'full',
    difficulty: 'leistung',
    minPlayers: 6,
    maxPlayers: 18,
    recommendedPlayers: 12,
    durationMinutes: 20,
    intensity: 'hochintensiv',
    intensityScore: 5,
    description: 'Stationszirkel: Koordinationsleiter (Quick Feet), Medizinball-Schockwürfe, 20m Richtungswechsel-Sprint und abschließender Sprungwurf auf markierte Treffzonen im Tor unter physischer Ermüdung.',
    setupInstructions: [
      'Station 1: Koordinationsleiter an Seitenlinie.',
      'Station 2: Hürdensprünge (3x Minidreiecke).',
      'Station 3: 15m Sprint mit Ballprellen.',
      'Station 4: Sprungwurf über Blockdummy auf Tor.'
    ],
    coachingPoints: [
      'Saubere Wurfarmführung trotz Laktatbelastung.',
      'Stabile Landung auf beiden Beinen zur Verletzungsprophylaxe.',
      'Pulssteuerung: 30 Sekunden Belastung, 45 Sekunden Pause.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'P1', x: 15, y: 80 },
        { id: 'p2', role: 'attack', label: 'P2', x: 30, y: 55 },
        { id: 'p3', role: 'attack', label: 'P3', x: 50, y: 35, hasBall: true },
        { id: 'p4', role: 'gk', label: 'TW', x: 50, y: 6 }
      ],
      paths: [
        { id: 't1', fromX: 15, fromY: 80, toX: 30, toY: 55, type: 'run' },
        { id: 't2', fromX: 30, fromY: 55, toX: 50, toY: 35, type: 'dribble' },
        { id: 't3', fromX: 50, fromY: 35, toX: 50, toY: 7, type: 'shot' }
      ],
      ballPosition: { x: 50, y: 35 }
    },
    simplificationTips: [
      'Pausenzeiten verdoppeln (1:2 Belastungs-Pausen-Verhältnis).',
      'Wurf aus dem Stand statt aus dem Sprungwurf.'
    ],
    progressionTips: [
      'Zusätzlicher Gegenspieler im Rückzug setzt Verfolgungsdruck.',
      'Torhüter pariert aktiv (keine freien Zielecken).'
    ],
    typicalMistakes: [
      {
        mistake: 'Kollabierende Knieachse bei der Landung (Valgusstellung / Kreuzbandgefahr).',
        correctionTip: 'Knie über die Fußspitzen führen, weich federn, Gesäß nach hinten.'
      }
    ],
    officialSource: 'DHB Athletik-Konzeption Handball / Nachwuchsleistungssport',
    recommendedAgeGroup: 'B-Jugend bis Senioren'
  },
  {
    id: 'ex-dhb-e1',
    title: 'Mattenball mit Zusatzaufgaben (Einstieg E-Jugend)',
    shortDesc: 'Aus dem DHB-Lehrgang: 14x20m Spielfeld, Turnmatten, Manndeckung & optische Farbreize zur visuellen Wahrnehmung.',
    category: 'kleingruppe',
    court: 'half',
    difficulty: 'basis',
    minPlayers: 8,
    maxPlayers: 18,
    recommendedPlayers: 12,
    durationMinutes: 20,
    intensity: 'spielform',
    intensityScore: 3,
    description: 'Außerhalb eines 14 x 20 m großen Spielfelds jeweils 2 Turnmatten gegenüber hinlegen. 4 Mannschaften bilden. 2 Teams spielen im Feld nach Handballregeln mit Manndeckung gegeneinander, 2 üben mit Bällen im Übungsraum (Torraum). Ziel: Einen für maximal 3 Sekunden auf einer Matte sitzenden Mitspieler anspielen (= 1 Punkt).',
    setupInstructions: [
      '14x20m großes Feld mit Hütchen abstecken.',
      'Jeweils 2 Turnmatten gegenüber an den Außenseiten platzieren.',
      '4 Teams bilden (2 im Feld gegeneinander, 2 im Übungsraum mit Bällen).',
      'Wichtig: Zur visuellen Wahrnehmung einige Minuten völlig „stumm“ spielen lassen!'
    ],
    coachingPoints: [
      'Schnittstellen sehen: Schnelles Lösen vom Gegenspieler ohne Ball.',
      'Blickkontakt: Ballführender darf nicht nur auf den Ball schauen.',
      'Fairness & Manndeckung: Jeder Spieler hat einen festen Gegenspieler.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'A1', x: 25, y: 35, hasBall: true },
        { id: 'p2', role: 'attack', label: 'A2', x: 45, y: 25 },
        { id: 'p3', role: 'attack', label: 'A3', x: 75, y: 35 },
        { id: 'p4', role: 'defense', label: 'B1', x: 28, y: 38 },
        { id: 'p5', role: 'defense', label: 'B2', x: 48, y: 28 },
        { id: 'p6', role: 'defense', label: 'B3', x: 72, y: 38 }
      ],
      paths: [
        { id: 't1', fromX: 25, fromY: 35, toX: 45, toY: 25, type: 'pass' },
        { id: 't2', fromX: 45, fromY: 25, toX: 75, toY: 35, type: 'pass' }
      ],
      ballPosition: { x: 25, y: 35 }
    },
    simplificationTips: [
      'Größere Turnmatten verwenden oder 3 Sekunden Zeitlimit auf der Matte auf 5 Sekunden erhöhen.',
      'Überzahl für das ballbesitzende Team schaffen (z. B. 4 gegen 3).'
    ],
    progressionTips: [
      'Farbkarten-Regel (DHB-Arbeitsblatt 2): Trainer zeigt rot (= quer spielen), blau (= längs spielen), grün (= diagonal). Sofortige Richtungsanpassung!',
      'Zusatzaufgaben: Nach jedem Pass 1 Liegestütz oder Hock-Streck-Sprung absolvieren.',
      'Kleines Turnier der 4 Teams (6 Spiele à 3 Minuten).'
    ],
    typicalMistakes: [
      {
        mistake: 'Kinder laufen alle gleichzeitig zum Ballträger (Rudelbildung).',
        correctionTip: 'DHB-Praxistipp: „Spielfeld einfrieren“. Kinder stoppen lassen und Lücken im Raum aufzeigen.'
      },
      {
        mistake: 'Auf der Matte sitzender Spieler wird angespielt, wenn er gedeckt ist.',
        correctionTip: 'Erst anspielen, wenn der Spieler sich frei auf die Matte gesetzt hat.'
      }
    ],
    officialSource: 'DHB C-Trainer-Ausbildung / Arbeitsblatt 2 (E-Jugend)',
    recommendedAgeGroup: 'E- & D-Jugend'
  },
  {
    id: 'ex-dhb-e2',
    title: 'Koordinationsläufe mit Schlagwürfen (3 Bahnen)',
    shortDesc: 'Aus dem DHB-Lehrgang: 3 differenzierte Bahnen (Reifen, Bänke, Baustellenband) mit anschließendem Torabschluss.',
    category: 'wurftechnik',
    court: 'one_goal',
    difficulty: 'basis',
    minPlayers: 6,
    maxPlayers: 18,
    recommendedPlayers: 12,
    durationMinutes: 25,
    intensity: 'spielform',
    intensityScore: 3,
    description: '3 Koordinationsbahnen nebeneinander aufbauen, die alle mit einem Torwurf abgeschlossen werden: Bahn 1 (Sprünge durch 6 Reifen, Arme vor/hoch strecken, Doppelpass mit Trainer, Wurf), Bahn 2 (Sprungvariationen an Bänken, Prellen, Schlagwurf), Bahn 3 (Gasse mit Baustellenband, Pass, Lauftäuschung am Hütchen, Rückpass, Torwurf).',
    setupInstructions: [
      'Bahn 1: 6 Reifen in Reihe, Torabschluss nach Doppelpass.',
      'Bahn 2: Langbank längs, Prellstrecke, Schlagwurf aus 7m.',
      'Bahn 3: Baustellenband als Korridor gespannt, Slalomhütchen, Lauftäuschung.',
      'Torwart im Tor oder Zielplanen anbringen.'
    ],
    coachingPoints: [
      'Kindgerechtes Vormachen: Ein Kind die Bahn vormachen lassen (DHB-Handout).',
      'Lange Ausholbewegung beim Schlagwurf („Ellenbogen auf Schulterhöhe").',
      'Flüssiger Übergang von der Koordinationsaufgabe in die Wurfbewegung.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'B1', x: 20, y: 70 },
        { id: 'p2', role: 'attack', label: 'B2', x: 50, y: 70 },
        { id: 'p3', role: 'attack', label: 'B3', x: 80, y: 70 },
        { id: 'p4', role: 'gk', label: 'TW', x: 50, y: 6 }
      ],
      paths: [
        { id: 't1', fromX: 20, fromY: 70, toX: 30, toY: 30, type: 'run' },
        { id: 't2', fromX: 50, fromY: 70, toX: 50, toY: 30, type: 'dribble' },
        { id: 't3', fromX: 80, fromY: 70, toX: 70, toY: 30, type: 'run' },
        { id: 't4', fromX: 50, fromY: 30, toX: 50, toY: 8, type: 'shot' }
      ],
      ballPosition: { x: 50, y: 70 }
    },
    simplificationTips: [
      'Aufgabe ohne Doppelpass durchführen (direkter Wurf nach der Bahn).',
      'Abstand zum Tor verringern (Wurf aus 5m).'
    ],
    progressionTips: [
      'Wettkampfform: Welches Bahn-Team erzielt in 4 Minuten die meisten Treffer?',
      'Zusatzaufgaben: Zielwurf auf Pylonen, die auf der Latte platziert sind.'
    ],
    typicalMistakes: [
      {
        mistake: 'Mangelnde Ausholbewegung beim Schlagwurf („Schieben“ statt Werfen).',
        correctionTip: 'DHB-Tipp zur Selbstkorrektur: „Versucht flach von oben nach unten auf die Torlinie zu werfen!“'
      }
    ],
    officialSource: 'DHB C-Trainer-Ausbildung / Arbeitsblatt 2 (E-Jugend Hauptteil 1)',
    recommendedAgeGroup: 'Minis bis D-Jugend'
  },
  {
    id: 'ex-dhb-e4',
    title: 'Überzahl-Handball (6 gegen 2 bis 6 gegen 6)',
    shortDesc: 'Aus dem DHB-Lehrgang: Progressiver Überzahlangriff bei offensivem Verteidigen im Tiefenraum & Rundlaufparcours.',
    category: 'angriff_1v1',
    court: 'full',
    difficulty: 'fortgeschritten',
    minPlayers: 12,
    maxPlayers: 22,
    recommendedPlayers: 16,
    durationMinutes: 25,
    intensity: 'hochintensiv',
    intensityScore: 4,
    description: '4 Mannschaften bilden. Außerhalb des Spielfelds einen Rundlaufparcours mit Bänken und Turnmatten aufbauen. Jeweils 2 Teams spielen Handball, die anderen absolvieren den Parcours. Team A führt 5 Angriffe hintereinander durch. Bei jedem neuen Angriff kommt ein weiterer Verteidiger hinzu: 6:2, 6:3, 6:4, 6:5 und schließlich 6:6.',
    setupInstructions: [
      'Volles Hallenfeld nutzen.',
      'Parcours an den Außenlinien mit Matten, Bänken und Hütchen aufbauen.',
      'Abwehr muss weit vor der Freiwurflinie im Tiefenraum offensiv decken!',
      'Nach 5 Angriffen Durchwechseln der Teams.'
    ],
    coachingPoints: [
      'Überzahlsituation sofort erkennen und freien Mitspieler anspielen.',
      'Keine Dribblings in Überzahl – Ball laufen lassen!',
      'Offensives Stören der Abwehrspieler im freien Raum.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'attack', label: 'A1', x: 25, y: 55 },
        { id: 'p2', role: 'attack', label: 'A2', x: 45, y: 50, hasBall: true },
        { id: 'p3', role: 'attack', label: 'A3', x: 65, y: 55 },
        { id: 'p4', role: 'attack', label: 'A4', x: 85, y: 50 },
        { id: 'p5', role: 'defense', label: 'B1', x: 40, y: 30 },
        { id: 'p6', role: 'defense', label: 'B2', x: 60, y: 30 },
        { id: 'p7', role: 'gk', label: 'TW', x: 50, y: 6 }
      ],
      paths: [
        { id: 't1', fromX: 45, fromY: 50, toX: 85, toY: 50, type: 'pass' },
        { id: 't2', fromX: 85, fromY: 50, toX: 52, toY: 8, type: 'shot' }
      ],
      ballPosition: { x: 45, y: 50 }
    },
    simplificationTips: [
      'Verteidiger dürfen erst ab der 9m-Freiwurflinie angreifen.',
      'Maximal 6 gegen 4 spielen lassen.'
    ],
    progressionTips: [
      'Zeitlimit von 10 Sekunden pro Angriff vorgeben.',
      'Tor zählt nur, wenn alle Angreifer den Ball mindestens einmal berührt haben.'
    ],
    typicalMistakes: [
      {
        mistake: 'Angreifer verheddern sich im 1-gegen-1 trotz klarer Überzahl.',
        correctionTip: 'Traineranweisung: „Kopf hoch! Wo steht der freie Mann? Maximal 1 Prellschlag!“'
      }
    ],
    officialSource: 'DHB C-Trainer-Ausbildung / Arbeitsblatt 2 (E-Jugend Abschluss)',
    recommendedAgeGroup: 'E- bis C-Jugend'
  },
  {
    id: 'ex-dhb-m1',
    title: 'Schildkröten einfangen (Kooperation & Fangspiel)',
    shortDesc: 'Aus dem DHB-Lehrgang: Kindgerechtes Einstiegsspiel für Minis zur Förderung von Schnelligkeit, Wendigkeit und Teamwork.',
    category: 'athletik',
    court: 'half',
    difficulty: 'basis',
    minPlayers: 8,
    maxPlayers: 20,
    recommendedPlayers: 14,
    durationMinutes: 15,
    intensity: 'spielform',
    intensityScore: 3,
    description: '6 „Tierpfleger“ haben ein Leibchen und sind zuständig für das Schildkrötenrevier (= Weichböden mit Schildkrötensymbol). Ihre Aufgabe ist es, die geflohenen Schildkröten (andere Kinder) einzufangen. Wird eine Schildkröte abgeworfen, legt sie sich steif auf den Bauch. Die Tierpfleger müssen sie gemeinsam in das Revier tragen.',
    setupInstructions: [
      'Weichbodenmatte als Schildkrötenrevier markieren.',
      '6 Fänger mit Markierungshemden ausstatten.',
      'Spielfeld 20x20m begrenzen.',
      'Drei Durchgänge, sodass jedes Team einmal Tierpfleger ist.'
    ],
    coachingPoints: [
      'Bildhafte, kindgerechte Sprache benutzen (DHB-Grundregel).',
      'Teamwork beim Tragen der gefangenen Kinder: Vorsichtig und gemeinsam heben.',
      'Kreative Lösungen der Kinder beim Tragen loben.'
    ],
    tacticalCourt: {
      players: [
        { id: 'p1', role: 'defense', label: 'T1', x: 25, y: 30 },
        { id: 'p2', role: 'defense', label: 'T2', x: 45, y: 40 },
        { id: 'p3', role: 'defense', label: 'T3', x: 75, y: 35 },
        { id: 'p4', role: 'attack', label: 'S1', x: 30, y: 60 },
        { id: 'p5', role: 'attack', label: 'S2', x: 60, y: 65 }
      ],
      paths: [
        { id: 't1', fromX: 25, fromY: 30, toX: 30, toY: 60, type: 'run' }
      ]
    },
    simplificationTips: [
      'Abgeschlagene Kinder dürfen selbst ins Revier krabbeln.',
      'Mehr Tierpfleger einsetzen.'
    ],
    progressionTips: [
      'Zeitstopp: Welches Tierpfleger-Team fängt alle Schildkröten in kürzester Zeit?',
      'Prellender Ball für die Schildkröten hinzufügen.'
    ],
    typicalMistakes: [
      {
        mistake: 'Fänger zerren unkoordiniert an einem Kind.',
        correctionTip: '„Erst absprechen: Wer nimmt die Arme, wer die Beine? Eins, zwei, hoch!“'
      }
    ],
    officialSource: 'DHB C-Trainer-Ausbildung / Arbeitsblatt 1 (Spielstunde für die Minis)',
    recommendedAgeGroup: 'Minis & F-Jugend'
  }
];

export const DHB_METHODOLOGY_GUIDELINES = {
  title: 'DHB-Handout: Methodisches Handwerkszeug für Trainer',
  source: 'Deutscher Handballbund (DHB C-Trainer-Ausbildung C2 / Arbeitsblatt 1)',
  sections: [
    {
      title: '1. Ansagen & Erklären',
      rules: [
        'Begegnet den Kindern auf Augenhöhe, wenn ihr mit ihnen sprecht.',
        'Haltet stets Blickkontakt zu den Kindern.',
        'Wartet ab, bis alle Kinder ruhig sind und sich auf euch konzentrieren.',
        'Wählt eine bildhafte, kindgerechte Sprache.'
      ]
    },
    {
      title: '2. Vormachen',
      rules: [
        'Lasst grundsätzlich die Kinder Bewegungsabläufe vormachen! Kinder lernen besser durch Abschauen von Gleichaltrigen mit kindgerechten Körperproportionen.',
        'Achtung: Macht der Trainer selbst vor, ist die Bewegung für Kinder oft zu perfekt und differenziert.',
        'Kinder lernen durch das Beobachten von Unterschieden (z. B. Schlagwurf-Ausführungen vergleichen, ohne bloßzustellen).',
        'Nehmt von Zeit zu Zeit Kinder mit Video auf, damit sie sich selbst beobachten können.'
      ]
    },
    {
      title: '3. Fehler erkennen & korrigieren beim Spielen',
      rules: [
        'Kinder sind keine Marionetten! Spielaktionen nicht fortlaufend kommentieren oder permanent reglementieren.',
        'Grundsatz: Kindern Freiräume zum eigenen, kreativen Spielen lassen!',
        'Praxistipp: Spielsituationen „einfrieren“ – Spiel unterbrechen, alle nehmen ihre Positionen wieder ein, und die Kinder zuerst selbst Lösungen finden lassen.'
      ]
    },
    {
      title: '4. Fehler korrigieren beim Üben',
      rules: [
        'Sprecht immer nur EINEN Hauptfehler an! Klare Prioritäten setzen.',
        'Zeitfaktor: Rückmeldung innerhalb weniger Sekunden geben, bevor das Bewegungsgefühl erlischt.',
        'Vermeidet pauschale Wertungen (gut/schlecht) – gebt genaue Bewegungshinweise.',
        'Aufgaben so stellen, dass sich Kinder selbst korrigieren (z. B. „Versucht flach zu werfen“ für lange Ausholbewegung).'
      ]
    },
    {
      title: '5. Grundregeln der Trainersprache',
      rules: [
        'Positive Formulierungen benutzen: Sagen, was gemeint ist – nicht, was NICHT gemeint ist.',
        'Direkte, prägnante Anweisungen statt weicher Floskeln.',
        'Merksatz: Kinder machen keine Fehler, sondern sammeln wertvolle Bewegungserfahrungen!'
      ]
    }
  ],
  parentingChecklist: {
    title: '7 Schritte zu einer konstruktiven Elternarbeit',
    source: 'Deutsche Sporthochschule Köln (Valeria Eckardt)',
    steps: [
      { step: 'Perspektive', desc: 'Eltern als wertvolle Ressource und Hauptakteur im Nachwuchssport betrachten.' },
      { step: 'Erwartungen', desc: 'Zu Saisonbeginn transparent kommunizieren, welche Rolle Eltern haben und wie sie unterstützen können.' },
      { step: 'Kommunikation', desc: 'Regelmäßige, offene Gesprächsangebote schaffen, um Frustrationen vorzubeugen.' },
      { step: 'Transparenz', desc: 'Trainingsphilosophie, Werte, Normen und sportliche Entscheidungen nachvollziehbar darlegen.' },
      { step: 'Beziehung', desc: 'Über den Sport hinaus ehrliches Interesse zeigen und offen mit der Entwicklung des Kindes umgehen.' },
      { step: 'Grenzen', desc: 'Professionelle Distanz wahren und respektvoll Grenzen aufzeigen, wenn Eltern übergriffig werden.' },
      { step: 'Feedback', desc: 'Am Saisonende anonyme oder persönliche Feedback-Möglichkeiten für Eltern bereitstellen.' }
    ]
  }
};


export const MOCK_TRAINING_SESSIONS: TrainingSession[] = [
  {
    id: 'session-today',
    title: 'Match-Vorbereitung: Tempospiel & 6:0 Feinjustierung',
    date: '2026-10-26',
    time: '19:30 - 21:00',
    court: 'full',
    location: 'Kreissporthalle 1, Westfalen',
    exercises: [MOCK_EXERCISES[2], MOCK_EXERCISES[0], MOCK_EXERCISES[1]],
    totalDurationMinutes: 85,
    calculatedLoadScore: 3.4,
    loadCategory: 'spielform',
    targetFocus: ['abwehr', 'kleingruppe', 'tempospiel'],
    notes: 'Achtung: Spiel in 2 Tagen! Belastung in der 2. Hälfte dosieren, Fokus auf Automatismen.',
    status: 'planned'
  },
  {
    id: 'session-past-1',
    title: 'Offensivpower: 1-gegen-1 & Wurftechnik',
    date: '2026-10-23',
    time: '19:30 - 21:00',
    court: 'half',
    location: 'Kreissporthalle 1, Westfalen',
    exercises: [MOCK_EXERCISES[3], MOCK_EXERCISES[4]],
    totalDurationMinutes: 75,
    calculatedLoadScore: 4.2,
    loadCategory: 'hochintensiv',
    targetFocus: ['angriff_1v1', 'torwart'],
    notes: 'Sehr gute Intensität bei den Rückraumwürfen. Hohe Quote bei Jan & Timon.',
    status: 'completed'
  }
];

export const DIAGNOSTIC_TEST_GUIDES: DiagnosticTestGuide[] = [
  {
    id: 'cooperMeters',
    name: 'Cooper Test (12-Minuten-Lauf)',
    shortName: 'Cooper Test',
    unit: 'm',
    targetAbility: 'Aerobe Grundlagenausdauer (Regenerationsfähigkeit über 60 Min Spielzeit)',
    equipment: '400m-Laufbahn (oder abgestecktes Hallen-/Rasen-Viereck), Stoppuhr, Hütchen alle 50 m',
    executionProtocol: [
      '10 Minuten lockeres Einlaufen und dynamisches Dehnen.',
      'Alle Spieler starten gleichzeitig auf Pfiff und laufen 12 Minuten so weit wie möglich (gleichmäßiges Tempo anstreben).',
      'Nach exakt 12:00 Minuten ertönt das Schlusssignal – Spieler bleiben an ihrer Position stehen bzw. merken sich das letzte Hütchen.',
      'Trainer notiert die gelaufenen Runden plus Reststrecke in Metern.'
    ],
    standardizationTips: 'Immer auf demselben Untergrund (Tartanbahn oder gleiche Halle) und zur gleichen Tageszeit ohne direkte Vorbelastung testen.',
    qualityCriteria: {
      objectivity: 'Sehr hoch — durch festes Zeitfenster (12 Min) und markierte 50m-Sektoren entsteht kaum Ermessensspielraum.',
      reliability: 'Hoch (r ≈ 0,90) bei eingewiesenen Spielern; Pacing-Fehler beim ersten Test durch Proberunde minimieren.',
      validityHandball: 'Mittel-Hoch — misst primär die aerobe Kapazität (VO2max-Basis). Im Handball wichtig für schnelle Erholung zwischen intensiven Phasen.'
    },
    benchmarks: {
      basis: '2.400 – 2.700 m',
      oberliga: '2.800 – 3.100 m',
      top: '> 3.200 m'
    }
  },
  {
    id: 'piepTestLevel',
    name: 'Piep-Test (20m Multi-Stage Shuttle Run)',
    shortName: 'Piep-Test',
    unit: 'Level',
    targetAbility: 'Handballspezifische Intervallausdauer & Abstopp-/Antrittsökonomie',
    equipment: '20m Strecke in der Halle, Hütchen/Linien, Bluetooth-Lautsprecher mit standardisierter Beep-Test-Audio',
    executionProtocol: [
      'Zwei parallele Linien exakt im Abstand von 20 Metern abmessen.',
      'Audio-Track starten: Spieler laufen im Takt von Linie zu Linie; mindestens ein Fuß muss beim Signalton die Linie berühren.',
      'Startgeschwindigkeit 8,5 km/h (Level 1), jede Minute Erhöhung um 0,5 km/h.',
      'Verpasst ein Spieler die Linie zweimal in Folge rechtzeitig, ist der Test beendet; letztes komplett geschafftes Level (z. B. 11.4) wird notiert.'
    ],
    standardizationTips: 'Keine fliegenden Wenden vor dem Piepton erlauben – ein Fuß muss die 20m-Marke berühren. Hallenschuhe mit gutem Grip vorschreiben.',
    qualityCriteria: {
      objectivity: 'Sehr hoch — der standardisierte Audio-Taktgeber schließt Tempo-Einflüsse durch den Trainer aus.',
      reliability: 'Sehr hoch (r > 0,92) in der Sporthalle bei gleichen Bodenverhältnissen.',
      validityHandball: 'Sehr hoch — durch ständiges Abbremsen, Drehen (180°) und erneutes Beschleunigen extrem nah an der realen Handball-Spielbelastung.'
    },
    benchmarks: {
      basis: 'Level 8.5 – 10.0',
      oberliga: 'Level 10.5 – 12.2',
      top: '> Level 12.5'
    }
  },
  {
    id: 'sprint20m',
    name: '20-Meter-Sprint',
    shortName: '20m Sprint',
    unit: 's',
    targetAbility: 'Antrittsschnelligkeit & Beschleunigung (1. Welle Gegenstoß & Durchbruch)',
    equipment: 'Maßband, 4 Hütchen (Start, Ziel + 5m Auslauf), Stoppuhr (oder Smartphone-Timing-App)',
    executionProtocol: [
      '20m Strecke gerade in der Halle markieren; 5m hinter der Ziellinie Auslaufzone lassen.',
      'Spieler startet aus dem ruhenden Hochstart (vorderer Fuß knapp hinter der Startlinie, kein Wippen).',
      'Zeitnahme beginnt bei erster sichtbarer Bewegung (oder auf Kommando bei gleicher Methode für alle) und endet beim Überqueren der 20m-Linie.',
      '2–3 gewertete Versuche mit mind. 3 Minuten vollständiger Pause; bester Wert zählt.'
    ],
    standardizationTips: 'Bei Handstoppung sollte immer derselbe Zeitnehmer auf Höhe der Ziellinie stehen und bei der ersten Bewegung des Spielers drücken (vermeidet Reaktionszeit-Verzerrung beim Startpfiff).',
    qualityCriteria: {
      objectivity: 'Mittel-Hoch bei Handstoppung (Ablesefehler ±0,15 s), Sehr hoch bei Video-/App- oder Lichtschrankenmessung.',
      reliability: 'Hoch bei 2–3 Versuchen mit voller Erholung und identischem Startkommando.',
      validityHandball: 'Sehr hoch — 20m entspricht exakt der relevanten Beschleunigungsdistanz im Tempospiel und Gegenstoß.'
    },
    benchmarks: {
      basis: '3,25 – 3,05 s',
      oberliga: '3,04 – 2,85 s',
      top: '< 2,82 s'
    }
  },
  {
    id: 'standweitsprung',
    name: 'Standweitsprung',
    shortName: 'Standweitsprung',
    unit: 'cm',
    targetAbility: 'Horizontale Explosiv- & Schnellkraft der Beinmuskulatur (Absprung & Antritt)',
    equipment: 'Maßband, Kreppband/Startlinie, rutschfester Hallenboden oder dünne Turnmatte',
    executionProtocol: [
      'Beide Fußspitzen stehen parallel direkt hinter der Startlinie (kein Übertreten).',
      'Ausholen durch Armschwung und Beugen der Knie, danach beidbeiniger, maximaler Absprung nach vorne.',
      'Beidbeinige Landung ohne Nach-hinten-Greifen oder Sturz nach hinten.',
      'Gemessen wird der Abstand von der Startlinie bis zur hintersten Ferse (in cm). Bester aus 3 Versuchen.'
    ],
    standardizationTips: 'Landung muss stabil gestanden werden. Kein Zwischenhüpfer vor dem Absprung zulässig.',
    qualityCriteria: {
      objectivity: 'Sehr hoch — klares Maßband-Ergebnis an der hintersten Ferse ohne subjektive Bewertung.',
      reliability: 'Sehr hoch (r ≈ 0,94) durch einfache Bewegungsstruktur und 3 Versuche.',
      validityHandball: 'Hoch — starker Zusammenhang mit Sprungkraft beim Sprungwurf sowie der ersten Explosiv-Beschleunigung im 1-gegen-1.'
    },
    benchmarks: {
      basis: '210 – 235 cm',
      oberliga: '236 – 260 cm',
      top: '> 265 cm'
    }
  },
  {
    id: 'bankdrueckenKg',
    name: 'Bankdrücken (Kraftniveau Oberkörper)',
    shortName: 'Bankdrücken',
    unit: 'kg (1RM)',
    targetAbility: 'Oberkörper-Maximalkraft & Druckstabilität (Zweikampf, Sperre & Wurfbasis)',
    equipment: 'Flachbank, Langhantel mit Gewichtsscheiben, Sicherheitsablagen / 1–2 Spotter',
    executionProtocol: [
      'Gründliches spezifisches Aufwärmen (2 leichte Sätze ohne Ermüdung).',
      'Im Amateur- & Jugendbereich empfiehlt sich aus Sicherheitsgründen ein 3–8 Wiederholungs-Maximum (Submaximaltest) statt direktem 1RM-Test.',
      'Saubere Ausführung: Schulterblätter auf Bank, Füße fest am Boden, kontrolliert bis zur Brust absenken, explosiv hochdrücken.',
      'Über die Brzycki-Formel wird das theoretische 1RM in kg errechnet — so bleibt die Leistung über die Saison exakt vergleichbar.'
    ],
    standardizationTips: 'Kein Abprallenlassen von der Brust; Gesäß bleibt während der gesamten Wiederholung auf der Bank. Im Jugendbereich (U15) durch Liegestütz-/Medizinballtest ersetzen.',
    qualityCriteria: {
      objectivity: 'Hoch bei klar definierten Bewegungsregeln (Brustberührung, kein Abfedern).',
      reliability: 'Sehr hoch (r > 0,95) bei standardisierter Griffbreite und Errechnung über 3–6 Wdh.',
      validityHandball: 'Mittel-Hoch — bildet das physische Fundament für Abwehr-Festmachen, Sperren am Kreis und Verletzungsprophylaxe der Schulter ab.'
    },
    benchmarks: {
      basis: '60 – 78 kg (1RM)',
      oberliga: '80 – 98 kg (1RM)',
      top: '> 102 kg (1RM)'
    }
  },
  {
    id: 'burpees1Min',
    name: 'Burpees in 1 Minute',
    shortName: 'Burpees (1 Min)',
    unit: 'Wdh.',
    targetAbility: 'Ganzkörper-Kraftausdauer, Laktattoleranz & schnelle Umschalt-Agilität',
    equipment: 'Stoppuhr, rutschfester Hallenboden (kein weiteres Material nötig)',
    executionProtocol: [
      'Aufrechtes Stehen in Ausgangsposition. Start auf Kommando „Los“ und gleichzeitiger Start der 60-Sekunden-Uhr.',
      'Sauberer Ablauf pro Wiederholung: Aus dem Stand in die Hocke, Beine nach hinten in saubere Liegestützposition, Brust kurz zum Boden (oder sauberer Plank-Stop), Beine wieder anhocken, Strecksprung mit Klatschen über Kopf.',
      'Gezählt werden nur technisch saubere Wiederholungen innerhalb von 60 Sekunden.'
    ],
    standardizationTips: 'Partnerzählung im Zweierteam spart Trainerzeit: Ein Spieler zählt laut und kontrolliert die Streckung beim Sprung sowie die saubere Liegestütz-Position.',
    qualityCriteria: {
      objectivity: 'Mittel-Hoch — erfordert klare Ansage durch den Trainer, wann eine Wiederholung als sauber gilt (z. B. voller Strecksprung).',
      reliability: 'Hoch bei strikter Bewegungsdefinition und einheitlicher Partner-Kontrolle.',
      validityHandball: 'Hoch — simuliert die komplexe Ganzkörperermüdung nach intensivem 6:0-Abwehrkampf mit sofortigem Boden-Aufstehen und Rückzugssprint.'
    },
    benchmarks: {
      basis: '22 – 28 Wdh.',
      oberliga: '29 – 36 Wdh.',
      top: '> 37 Wdh.'
    }
  }
];

export const MOCK_DIAGNOSTICS: PlayerDiagnosticRecord[] = [
  {
    id: 'diag-1',
    playerId: 'user-player-1',
    playerName: 'Jan Kowalski',
    position: 'RL',
    testDate: '2026-08-15',
    testType: 'pre_season',
    metrics: {
      cooperMeters: 2860,
      piepTestLevel: 11.4,
      sprint20m: 2.94,
      standweitsprung: 254,
      bankdrueckenKg: 87.5,
      burpees1Min: 32
    },
    categoryScores: {
      grundlagenausdauer: 71,
      spielausdauer: 75,
      schnelligkeit: 79,
      sprungkraft: 80,
      oberkoerperkraft: 72,
      kraftausdauer: 73
    },
    coachNotes: 'Sehr solide Basis im Antritt und Standweitsprung. Bankdrücken und Burpee-Laktattoleranz bieten noch Potenzial für die Rückraum-Zweikämpfe.'
  },
  {
    id: 'diag-1-mid',
    playerId: 'user-player-1',
    playerName: 'Jan Kowalski',
    position: 'RL',
    testDate: '2026-10-18',
    testType: 'mid_season',
    metrics: {
      cooperMeters: 3020,
      piepTestLevel: 12.1,
      sprint20m: 2.86,
      standweitsprung: 263,
      bankdrueckenKg: 95.0,
      burpees1Min: 36
    },
    categoryScores: {
      grundlagenausdauer: 81,
      spielausdauer: 84,
      schnelligkeit: 88,
      sprungkraft: 89,
      oberkoerperkraft: 81,
      kraftausdauer: 87
    },
    coachNotes: 'Deutliche Zuwächse in allen 6 Feldtests nach 8 Wochen Vorbereitung (+160m im Cooper, +7,5 kg Bankdrücken, +4 Burpees). Topfit für die englischen Wochen.'
  },
  {
    id: 'diag-2',
    playerId: 'user-player-2',
    playerName: 'Lukas Bauer',
    position: 'TW',
    testDate: '2026-08-15',
    testType: 'pre_season',
    metrics: {
      cooperMeters: 2680,
      piepTestLevel: 10.2,
      sprint20m: 3.12,
      standweitsprung: 242,
      bankdrueckenKg: 82.5,
      burpees1Min: 30
    },
    categoryScores: {
      grundlagenausdauer: 59,
      spielausdauer: 61,
      schnelligkeit: 59,
      sprungkraft: 69,
      oberkoerperkraft: 66,
      kraftausdauer: 67
    },
    coachNotes: 'Als Torhüter gute Schnellkraft im Standweitsprung und stabile Rumpf-/Kraftausdauer bei den Burpees.'
  },
  {
    id: 'diag-3',
    playerId: 'user-player-3',
    playerName: 'Felix Meier',
    position: 'KM',
    testDate: '2026-08-15',
    testType: 'pre_season',
    metrics: {
      cooperMeters: 2740,
      piepTestLevel: 10.8,
      sprint20m: 3.05,
      standweitsprung: 246,
      bankdrueckenKg: 102.5,
      burpees1Min: 31
    },
    categoryScores: {
      grundlagenausdauer: 63,
      spielausdauer: 68,
      schnelligkeit: 67,
      sprungkraft: 72,
      oberkoerperkraft: 91,
      kraftausdauer: 70
    },
    coachNotes: 'Stärkster Oberkörper im Kader (102,5 kg Bankdrücken) — ideal für Sperren und Innenblock. Im 20m-Antritt arbeiten wir weiter am ersten Schritt.'
  },
  {
    id: 'diag-4',
    playerId: 'user-player-4',
    playerName: 'Timon Richter',
    position: 'RM',
    testDate: '2026-08-15',
    testType: 'pre_season',
    metrics: {
      cooperMeters: 3110,
      piepTestLevel: 12.4,
      sprint20m: 2.88,
      standweitsprung: 251,
      bankdrueckenKg: 77.5,
      burpees1Min: 37
    },
    categoryScores: {
      grundlagenausdauer: 87,
      spielausdauer: 87,
      schnelligkeit: 86,
      sprungkraft: 77,
      oberkoerperkraft: 59,
      kraftausdauer: 90
    },
    coachNotes: 'Ausdauer- und Tempomotor des Teams (Level 12.4 im Piep-Test, 37 Burpees). Gezieltes Oberkörper-Krafttraining 2x/Woche empfohlen.'
  }
];

export const MOCK_RPE_FEEDBACK: PlayerRpeFeedback[] = [
  {
    id: 'rpe-1',
    trainingSessionId: 'session-past-1',
    trainingTitle: 'Offensivpower: 1-gegen-1 & Wurftechnik',
    trainingDate: '2026-10-23',
    playerId: 'user-player-1',
    playerName: 'Jan Kowalski',
    rpeScore: 8,
    sorenessLocation: 'schulter',
    sleepQuality: 4,
    fatigueLevel: 4,
    playerNotes: 'Wurfhand-Schulter zieht etwas nach den vielen 9m-Abschlüssen. Eisbeutel genutzt.',
    submittedAt: '2026-10-23T21:45:00Z'
  },
  {
    id: 'rpe-2',
    trainingSessionId: 'session-past-1',
    trainingTitle: 'Offensivpower: 1-gegen-1 & Wurftechnik',
    trainingDate: '2026-10-23',
    playerId: 'user-player-2',
    playerName: 'Lukas Bauer',
    rpeScore: 6,
    sorenessLocation: 'keine',
    sleepQuality: 5,
    fatigueLevel: 3,
    playerNotes: 'Gutes Gefühl im Tor, viele Bälle pariert.',
    submittedAt: '2026-10-23T21:30:00Z'
  },
  {
    id: 'rpe-3',
    trainingSessionId: 'session-past-1',
    trainingTitle: 'Offensivpower: 1-gegen-1 & Wurftechnik',
    trainingDate: '2026-10-23',
    playerId: 'user-player-3',
    playerName: 'Felix Meier',
    rpeScore: 7,
    sorenessLocation: 'beine',
    sleepQuality: 4,
    fatigueLevel: 4,
    playerNotes: 'Konditionell anspruchsvoll, Oberschenkel brennen.',
    submittedAt: '2026-10-23T22:05:00Z'
  }
];

export const MOCK_CALENDAR_EVENTS: CalendarEvent[] = [
  {
    id: 'evt-1',
    title: 'Mannschaftstraining & Taktikfeinschliff',
    type: 'training',
    date: '2026-10-26',
    time: '19:30 - 21:00',
    meetingTime: '19:15',
    location: 'Kreissporthalle 1',
    address: 'Am Sportpark 4, 48149 Münster',
    notes: 'Bitte mitbringen: Beide Trikotsätze (Grün & Weiß), Hallenschuhe mit sauberer Sohle.',
    linkedTrainingSessionId: 'session-today',
    attendeesCount: { yes: 13, no: 2, maybe: 1 },
    attendees: [
      { playerId: 'user-player-1', playerName: 'Jan Kowalski (#7 · RL)', status: 'yes', updatedAt: '2026-10-24T10:15:00Z' },
      { playerId: 'user-player-2', playerName: 'Lukas Bauer (#1 · TW)', status: 'yes', updatedAt: '2026-10-24T11:00:00Z' },
      { playerId: 'user-player-3', playerName: 'Felix Meier (#14 · KM)', status: 'yes', updatedAt: '2026-10-24T11:30:00Z' },
      { playerId: 'user-player-4', playerName: 'Timon Richter (#9 · RM)', status: 'yes', updatedAt: '2026-10-24T12:10:00Z' },
      { playerId: 'squad-5', playerName: 'Jonas Weber (#3 · LA)', status: 'yes', updatedAt: '2026-10-24T12:40:00Z' },
      { playerId: 'squad-6', playerName: 'Niklas Hartmann (#11 · RR)', status: 'yes', updatedAt: '2026-10-24T13:05:00Z' },
      { playerId: 'squad-7', playerName: 'Moritz Becker (#5 · RA)', status: 'yes', updatedAt: '2026-10-24T14:20:00Z' },
      { playerId: 'squad-8', playerName: 'Tobias Schäfer (#12 · TW)', status: 'yes', updatedAt: '2026-10-24T15:00:00Z' },
      { playerId: 'squad-9', playerName: 'Paul Hoffmann (#4 · RL)', status: 'yes', updatedAt: '2026-10-24T15:45:00Z' },
      { playerId: 'squad-10', playerName: 'Maximilian Koch (#21 · KM)', status: 'yes', updatedAt: '2026-10-24T16:12:00Z' },
      { playerId: 'squad-11', playerName: 'Lennart Braun (#17 · LA)', status: 'yes', updatedAt: '2026-10-24T17:00:00Z' },
      { playerId: 'squad-12', playerName: 'Sven Krüger (#8 · RM)', status: 'yes', updatedAt: '2026-10-24T18:10:00Z' },
      { playerId: 'squad-13', playerName: 'Fabian Neumann (#23 · RR)', status: 'yes', updatedAt: '2026-10-24T18:45:00Z' },
      { playerId: 'squad-14', playerName: 'Hendrik Wolf (#15 · RA)', status: 'no', reason: 'Beruflich verhindert', updatedAt: '2026-10-24T09:20:00Z' },
      { playerId: 'squad-15', playerName: 'Daniel Zimmermann (#6 · RL)', status: 'no', reason: 'Leichte Zerrung Wade', updatedAt: '2026-10-24T16:30:00Z' },
      { playerId: 'squad-16', playerName: 'Patrick Klein (#19 · KM)', status: 'maybe', reason: 'Klärung Spätschicht', updatedAt: '2026-10-24T19:00:00Z' }
    ],
    userRsvp: 'yes'
  },
  {
    id: 'evt-2',
    title: 'Meisterschaftsspiel: HSG Nordhorn-Lingen II (Heim)',
    type: 'game',
    date: '2026-10-28',
    time: '19:00',
    meetingTime: '17:45',
    location: 'Halle Berg Fidel',
    address: 'Robert-Bosch-Straße 10, 48153 Münster',
    opponent: 'HSG Nordhorn-Lingen II',
    isHomeGame: true,
    notes: 'Kader wird am Donnerstag bekanntgegeben. Treffen pünktlich zur Videoanalyse.',
    attendeesCount: { yes: 14, no: 1, maybe: 1 },
    attendees: [
      { playerId: 'user-player-1', playerName: 'Jan Kowalski (#7 · RL)', status: 'yes', updatedAt: '2026-10-24T10:15:00Z' },
      { playerId: 'user-player-2', playerName: 'Lukas Bauer (#1 · TW)', status: 'yes', updatedAt: '2026-10-24T11:00:00Z' },
      { playerId: 'user-player-3', playerName: 'Felix Meier (#14 · KM)', status: 'yes', updatedAt: '2026-10-24T11:30:00Z' },
      { playerId: 'user-player-4', playerName: 'Timon Richter (#9 · RM)', status: 'yes', updatedAt: '2026-10-24T12:10:00Z' },
      { playerId: 'squad-5', playerName: 'Jonas Weber (#3 · LA)', status: 'yes', updatedAt: '2026-10-24T12:40:00Z' },
      { playerId: 'squad-6', playerName: 'Niklas Hartmann (#11 · RR)', status: 'yes', updatedAt: '2026-10-24T13:05:00Z' },
      { playerId: 'squad-7', playerName: 'Moritz Becker (#5 · RA)', status: 'yes', updatedAt: '2026-10-24T14:20:00Z' },
      { playerId: 'squad-8', playerName: 'Tobias Schäfer (#12 · TW)', status: 'yes', updatedAt: '2026-10-24T15:00:00Z' },
      { playerId: 'squad-9', playerName: 'Paul Hoffmann (#4 · RL)', status: 'yes', updatedAt: '2026-10-24T15:45:00Z' },
      { playerId: 'squad-10', playerName: 'Maximilian Koch (#21 · KM)', status: 'yes', updatedAt: '2026-10-24T16:12:00Z' },
      { playerId: 'squad-11', playerName: 'Lennart Braun (#17 · LA)', status: 'yes', updatedAt: '2026-10-24T17:00:00Z' },
      { playerId: 'squad-12', playerName: 'Sven Krüger (#8 · RM)', status: 'yes', updatedAt: '2026-10-24T18:10:00Z' },
      { playerId: 'squad-13', playerName: 'Fabian Neumann (#23 · RR)', status: 'yes', updatedAt: '2026-10-24T18:45:00Z' },
      { playerId: 'squad-14', playerName: 'Hendrik Wolf (#15 · RA)', status: 'yes', updatedAt: '2026-10-24T19:10:00Z' },
      { playerId: 'squad-15', playerName: 'Daniel Zimmermann (#6 · RL)', status: 'no', reason: 'Aufbautraining nach Zerrung', updatedAt: '2026-10-24T16:30:00Z' },
      { playerId: 'squad-16', playerName: 'Patrick Klein (#19 · KM)', status: 'maybe', reason: 'Prüfungsvorbereitung', updatedAt: '2026-10-24T19:00:00Z' }
    ],
    userRsvp: 'yes'
  },
  {
    id: 'evt-3',
    title: 'Auswärtsspiel: TV Emsdetten II',
    type: 'game',
    date: '2026-11-04',
    time: '18:00',
    meetingTime: '16:00 (Busabfahrt)',
    location: 'Euregiohalle Emsdetten',
    address: 'Elsa-Brändström-Straße 12, 48282 Emsdetten',
    opponent: 'TV Emsdetten II',
    isHomeGame: false,
    notes: 'Fahrdienst Bus 1 und Bus 2 organisiert. Snack-Verpflegung eingeteilt.',
    attendeesCount: { yes: 12, no: 3, maybe: 1 },
    attendees: [
      { playerId: 'user-player-2', playerName: 'Lukas Bauer (#1 · TW)', status: 'yes', updatedAt: '2026-10-24T11:00:00Z' },
      { playerId: 'user-player-3', playerName: 'Felix Meier (#14 · KM)', status: 'yes', updatedAt: '2026-10-24T11:30:00Z' },
      { playerId: 'user-player-4', playerName: 'Timon Richter (#9 · RM)', status: 'yes', updatedAt: '2026-10-24T12:10:00Z' },
      { playerId: 'squad-5', playerName: 'Jonas Weber (#3 · LA)', status: 'yes', updatedAt: '2026-10-24T12:40:00Z' },
      { playerId: 'squad-6', playerName: 'Niklas Hartmann (#11 · RR)', status: 'yes', updatedAt: '2026-10-24T13:05:00Z' },
      { playerId: 'squad-7', playerName: 'Moritz Becker (#5 · RA)', status: 'yes', updatedAt: '2026-10-24T14:20:00Z' },
      { playerId: 'squad-8', playerName: 'Tobias Schäfer (#12 · TW)', status: 'yes', updatedAt: '2026-10-24T15:00:00Z' },
      { playerId: 'squad-9', playerName: 'Paul Hoffmann (#4 · RL)', status: 'yes', updatedAt: '2026-10-24T15:45:00Z' },
      { playerId: 'squad-10', playerName: 'Maximilian Koch (#21 · KM)', status: 'yes', updatedAt: '2026-10-24T16:12:00Z' },
      { playerId: 'squad-11', playerName: 'Lennart Braun (#17 · LA)', status: 'yes', updatedAt: '2026-10-24T17:00:00Z' },
      { playerId: 'squad-12', playerName: 'Sven Krüger (#8 · RM)', status: 'yes', updatedAt: '2026-10-24T18:10:00Z' },
      { playerId: 'squad-13', playerName: 'Fabian Neumann (#23 · RR)', status: 'yes', updatedAt: '2026-10-24T18:45:00Z' },
      { playerId: 'squad-14', playerName: 'Hendrik Wolf (#15 · RA)', status: 'no', reason: 'Familienfeier', updatedAt: '2026-10-24T09:20:00Z' },
      { playerId: 'squad-15', playerName: 'Daniel Zimmermann (#6 · RL)', status: 'no', reason: 'Urlaub', updatedAt: '2026-10-24T16:30:00Z' },
      { playerId: 'squad-16', playerName: 'Patrick Klein (#19 · KM)', status: 'no', reason: 'Arbeit', updatedAt: '2026-10-24T19:00:00Z' },
      { playerId: 'user-player-1', playerName: 'Jan Kowalski (#7 · RL)', status: 'unanswered', updatedAt: '2026-10-24T10:15:00Z' }
    ],
    userRsvp: 'unanswered'
  }
];

export const MOCK_TEAM_TASKS: TeamTask[] = [
  {
    id: 'task-1',
    type: 'trikotwaesche',
    title: 'Trikotwäsche (Grüner Heim-Satz)',
    description: 'Trikots nach dem Spiel bei max. 30°C ohne Weichspüler waschen, trocken zum nächsten Training mitbringen.',
    assignedPlayerId: 'user-player-1',
    assignedPlayerName: 'Jan Kowalski (#7)',
    dueDate: '2026-10-30',
    eventDate: '2026-10-28',
    isCompleted: false,
    rotationNote: 'Nächster in Rotation: Felix Meier (#14)'
  },
  {
    id: 'task-2',
    type: 'kampfgericht',
    title: 'Zeitnehmer & Sekretär (Jugend-Vorspiel)',
    description: 'Elektronischer Spielbericht (nuLiga / Phoenix) vor Anpfiff der B-Jugend vorbereiten.',
    assignedPlayerId: 'user-player-4',
    assignedPlayerName: 'Timon Richter (#9)',
    dueDate: '2026-10-28',
    eventDate: '2026-10-28',
    isCompleted: true,
    rotationNote: 'Abgeschlossen für B-Jugend Vorspiel'
  },
  {
    id: 'task-3',
    type: 'fahrdienst',
    title: 'Fahrdienst Bus 1 (Auswärts Emsdetten)',
    description: 'Vereinsbus ab Sporthalle steuern, 8 Spieler befördern. Führerschein Klasse B.',
    assignedPlayerId: 'user-player-3',
    assignedPlayerName: 'Felix Meier (#14)',
    dueDate: '2026-11-04',
    eventDate: '2026-11-04',
    isCompleted: false,
    rotationNote: 'Zweitfahrer: Lukas Bauer'
  },
  {
    id: 'task-4',
    type: 'verpflegung',
    title: 'Obst & isotonische Getränke',
    description: '2 Kisten Bananen/Äpfel und Wasser/Isotonische Pulver für die Halbzeitpause bereitstellen.',
    assignedPlayerId: 'user-player-2',
    assignedPlayerName: 'Lukas Bauer (#1)',
    dueDate: '2026-10-28',
    eventDate: '2026-10-28',
    isCompleted: false,
    rotationNote: 'Erledigung vor dem Warm-up'
  }
];
