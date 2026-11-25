import React, { useState } from 'react';
import { TacticalCourtData, TacticalPlayer, CourtType } from '../types';

interface TacticalCourtViewProps {
  data: TacticalCourtData;
  courtType?: CourtType;
  interactive?: boolean;
  onPlayersChange?: (players: TacticalPlayer[]) => void;
}

export const TacticalCourtView: React.FC<TacticalCourtViewProps> = ({
  data,
  courtType = 'half',
  interactive = true,
  onPlayersChange
}) => {
  const [players, setPlayers] = useState<TacticalPlayer[]>(data.players);
  const [activePlayerId, setActivePlayerId] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Sync if prop changes
  React.useEffect(() => {
    setPlayers(data.players);
  }, [data]);

  const handlePointerDown = (id: string, e: React.PointerEvent) => {
    if (!interactive) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setActivePlayerId(id);
    setIsDragging(true);
  };

  const handlePointerMove = (e: React.PointerEvent<SVGSVGElement>) => {
    if (!isDragging || !activePlayerId || !interactive) return;
    const svgRect = e.currentTarget.getBoundingClientRect();
    const xPct = Math.max(5, Math.min(95, ((e.clientX - svgRect.left) / svgRect.width) * 100));
    const yPct = Math.max(5, Math.min(95, ((e.clientY - svgRect.top) / svgRect.height) * 100));

    setPlayers(prev => {
      const next = prev.map(p => p.id === activePlayerId ? { ...p, x: Number(xPct.toFixed(1)), y: Number(yPct.toFixed(1)) } : p);
      if (onPlayersChange) onPlayersChange(next);
      return next;
    });
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setActivePlayerId(null);
  };

  const resetPositions = () => {
    setPlayers(data.players);
    if (onPlayersChange) onPlayersChange(data.players);
  };

  const isFullCourt = courtType === 'full';

  return (
    <div className="relative w-full overflow-hidden rounded-xl border border-slate-700/60 bg-[#16213e] shadow-inner select-none">
      {/* Top micro toolbar */}
      <div className="absolute top-2 right-2 z-10 flex items-center gap-2 bg-slate-900/80 backdrop-blur-sm px-2.5 py-1 rounded text-xs text-slate-300">
        <span className="text-[11px] text-slate-400">
          {isFullCourt ? 'Vollfeld (40x20m)' : courtType === 'one_goal' ? 'Torwurfzone (1 Tor)' : 'Halbfeld (20x20m)'}
        </span>
        {interactive && (
          <button 
            type="button"
            onClick={resetPositions}
            className="hover:text-white transition-colors underline decoration-slate-600 underline-offset-2"
          >
            Reset
          </button>
        )}
      </div>

      <svg
        viewBox={isFullCourt ? "0 0 1000 600" : "0 0 800 650"}
        className="w-full h-auto cursor-crosshair touch-none"
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <defs>
          {/* Parquet Floor Pattern */}
          <linearGradient id="floorGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
          <linearGradient id="creaseGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#1d4ed8" stopOpacity="0.35" />
            <stop offset="100%" stopColor="#2563eb" stopOpacity="0.15" />
          </linearGradient>
          {/* Arrowhead markers */}
          <marker id="arrowRun" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#38bdf8" />
          </marker>
          <marker id="arrowPass" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#fbbf24" />
          </marker>
          <marker id="arrowShot" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L8,3 z" fill="#ef4444" />
          </marker>
        </defs>

        {/* Court Parquet Background */}
        <rect width="100%" height="100%" fill="url(#floorGrad)" />

        {isFullCourt ? (
          /* FULL COURT (1000 x 600) */
          <g id="fullCourtLines">
            {/* Outer boundary */}
            <rect x="50" y="40" width="900" height="520" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            {/* Center line */}
            <line x1="500" y1="40" x2="500" y2="560" stroke="#e2e8f0" strokeWidth="2.5" />
            <circle cx="500" cy="300" r="45" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="6,6" />

            {/* Left Goal & 6m Crease */}
            <rect x="25" y="255" width="25" height="90" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <path 
              d="M 50,160 L 150,160 A 140,140 0 0 1 150,440 L 50,440 Z" 
              fill="url(#creaseGrad)" 
              stroke="#e2e8f0" 
              strokeWidth="2.5" 
            />
            {/* 7m penalty mark */}
            <line x1="190" y1="290" x2="190" y2="310" stroke="#ffffff" strokeWidth="3" />
            {/* 9m Free throw line */}
            <path 
              d="M 50,110 L 210,110 A 190,190 0 0 1 210,490 L 50,490" 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
            />

            {/* Right Goal & 6m Crease */}
            <rect x="950" y="255" width="25" height="90" fill="#dc2626" stroke="#ffffff" strokeWidth="2" />
            <path 
              d="M 950,160 L 850,160 A 140,140 0 0 0 850,440 L 950,440 Z" 
              fill="url(#creaseGrad)" 
              stroke="#e2e8f0" 
              strokeWidth="2.5" 
            />
            {/* 7m penalty mark */}
            <line x1="810" y1="290" x2="810" y2="310" stroke="#ffffff" strokeWidth="3" />
            {/* 9m Free throw line */}
            <path 
              d="M 950,110 L 790,110 A 190,190 0 0 0 790,490 L 950,490" 
              fill="none" 
              stroke="#94a3b8" 
              strokeWidth="2" 
              strokeDasharray="8,8" 
            />
          </g>
        ) : (
          /* HALF COURT (800 x 650) - Looking at Goal at Top */
          <g id="halfCourtLines">
            {/* Outer sideline and goal line */}
            <rect x="50" y="40" width="700" height="570" fill="none" stroke="#e2e8f0" strokeWidth="3" />
            {/* Center line at bottom */}
            <line x1="50" y1="610" x2="750" y2="610" stroke="#e2e8f0" strokeWidth="3" />

            {/* Goal Post (Top Center) */}
            <rect x="340" y="18" width="120" height="22" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
            {/* Goal Netting pattern */}
            <line x1="360" y1="18" x2="360" y2="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="380" y1="18" x2="380" y2="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="400" y1="18" x2="400" y2="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="420" y1="18" x2="420" y2="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />
            <line x1="440" y1="18" x2="440" y2="40" stroke="#ffffff" strokeWidth="1" strokeDasharray="3,3" />

            {/* 4m Goalkeeper Line */}
            <line x1="385" y1="105" x2="415" y2="105" stroke="#ffffff" strokeWidth="2" />
            <text x="420" y="108" fill="#94a3b8" fontSize="10" fontFamily="sans-serif">4m</text>

            {/* 6m Goal Area (Torraum) */}
            {/* Standard: 3m straight in front of goal + quarter arcs with radius 6m */}
            <path
              d="M 230,40 A 155,155 0 0 1 340,175 L 460,175 A 155,155 0 0 1 570,40 Z"
              fill="url(#creaseGrad)"
              stroke="#60a5fa"
              strokeWidth="2.5"
            />
            <text x="400" y="160" textAnchor="middle" fill="#93c5fd" fontSize="11" fontWeight="600" opacity="0.6">6m Kreis</text>

            {/* 7m Penalty Mark */}
            <line x1="385" y1="205" x2="415" y2="205" stroke="#fbbf24" strokeWidth="3" />
            <text x="425" y="209" fill="#fbbf24" fontSize="10" fontFamily="sans-serif">7m</text>

            {/* 9m Free Throw Line (Gestrichelter Freiwurfkreis) */}
            <path
              d="M 160,40 A 240,240 0 0 1 320,265 L 480,265 A 240,240 0 0 1 640,40"
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="2.5"
              strokeDasharray="9,8"
            />
            <text x="400" y="285" textAnchor="middle" fill="#94a3b8" fontSize="11" fontWeight="500">9m Freiwurflinie</text>

            {/* Center court indicator */}
            <path d="M 360,610 A 40,40 0 0 1 440,610" fill="none" stroke="#e2e8f0" strokeWidth="2" strokeDasharray="5,5" />
          </g>
        )}

        {/* TACTICAL PATHS / VECTORS */}
        {data.paths.map((p) => {
          const width = isFullCourt ? 1000 : 800;
          const height = isFullCourt ? 600 : 650;
          const x1 = (p.fromX / 100) * width;
          const y1 = (p.fromY / 100) * height;
          const x2 = (p.toX / 100) * width;
          const y2 = (p.toY / 100) * height;

          let strokeColor = '#38bdf8';
          let markerEnd = 'url(#arrowRun)';
          let strokeDash = 'none';

          if (p.type === 'pass') {
            strokeColor = '#fbbf24';
            markerEnd = 'url(#arrowPass)';
            strokeDash = '5,5';
          } else if (p.type === 'shot') {
            strokeColor = '#ef4444';
            markerEnd = 'url(#arrowShot)';
            strokeDash = 'none';
          } else if (p.type === 'dribble') {
            strokeColor = '#34d399';
            markerEnd = 'url(#arrowRun)';
            strokeDash = '3,3';
          }

          return (
            <g key={p.id} className="pointer-events-none">
              <line
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke={strokeColor}
                strokeWidth={p.type === 'shot' ? 3.5 : 2.5}
                strokeDasharray={strokeDash}
                markerEnd={markerEnd}
                opacity={0.85}
              />
            </g>
          );
        })}

        {/* PLAYERS ON COURT */}
        {players.map((player) => {
          const width = isFullCourt ? 1000 : 800;
          const height = isFullCourt ? 600 : 650;
          const cx = (player.x / 100) * width;
          const cy = (player.y / 100) * height;

          let fillColor = '#2563eb'; // blue attack
          let textColor = '#ffffff';
          let roleLabel = 'Angriff';

          if (player.role === 'defense') {
            fillColor = '#dc2626'; // red defense
            roleLabel = 'Abwehr';
          } else if (player.role === 'gk') {
            fillColor = '#10b981'; // green keeper
            roleLabel = 'Torwart';
          } else if (player.role === 'pivot') {
            fillColor = '#8b5cf6'; // purple pivot
            roleLabel = 'Kreisläufer';
          }

          const isSelected = activePlayerId === player.id;

          return (
            <g
              key={player.id}
              transform={`translate(${cx}, ${cy})`}
              className={interactive ? 'cursor-grab active:cursor-grabbing transition-transform' : ''}
              onPointerDown={(e) => handlePointerDown(player.id, e)}
            >
              {/* Pulse / halo when dragging */}
              {isSelected && (
                <circle r="26" fill={fillColor} opacity="0.3" className="animate-ping" />
              )}
              {/* Outer shadow/ring */}
              <circle
                r="18"
                fill={fillColor}
                stroke="#ffffff"
                strokeWidth={isSelected ? 3 : 2}
                className="drop-shadow-md"
              />
              {/* Label inside circle (e.g. RM, HL, TW) */}
              <text
                textAnchor="middle"
                dy=".35em"
                fill={textColor}
                fontSize="11"
                fontWeight="700"
                fontFamily="sans-serif"
                className="pointer-events-none select-none"
              >
                {player.label}
              </text>

              {/* Handball Ball indicator if player has ball */}
              {player.hasBall && (
                <g transform="translate(13, -13)">
                  <circle r="6" fill="#f97316" stroke="#ffffff" strokeWidth="1.5" />
                  <path d="M -3,-3 L 3,3 M -3,3 L 3,-3" stroke="#ffffff" strokeWidth="0.8" />
                </g>
              )}
            </g>
          );
        })}
      </svg>

      {/* Legend below court */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-2 bg-slate-900/90 border-t border-slate-800 text-xs text-slate-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-blue-600 inline-block"></span>
            <span>Angriff</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-red-600 inline-block"></span>
            <span>Abwehr</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-600 inline-block"></span>
            <span>Torhüter</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-600 inline-block"></span>
            <span>Kreis (KM)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>Ball</span>
          </div>
        </div>
        <div className="flex items-center gap-3 text-slate-400">
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-yellow-400 inline-block border-t border-dashed"></span>
            <span>Pass</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-sky-400 inline-block"></span>
            <span>Laufweg</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="w-4 h-0.5 bg-red-500 inline-block"></span>
            <span>Torwurf</span>
          </span>
        </div>
      </div>
    </div>
  );
};
