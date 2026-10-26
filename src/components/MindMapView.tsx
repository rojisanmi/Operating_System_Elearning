import React, { useState } from 'react';
import { nodeDescriptions } from '../data/mindmapData';

/* ═══════════════════════════════════════════════════════════════
   MindMapView – Full visual recreation of the Deadlock Mind Map
   - Perfectly connected RAG diagrams (arrows directly touch process circles)
   - Proper captions above and below each arrow
   - Balanced, cohesive layout with "3 Pendekatan Deadlock" closely linked
   Canvas Dimensions: 3600 x 1650 px
   ═══════════════════════════════════════════════════════════════ */

interface NodeProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  borderColor?: string;
  bgColor?: string;
  textColor?: string;
  shape?: 'oval' | 'rect' | 'rounded';
  fontSize?: number;
  selected: boolean;
  onClick: () => void;
}

const MindMapNodeItem: React.FC<NodeProps> = ({
  id,
  x,
  y,
  width,
  height,
  label,
  sublabel,
  borderColor = '#1e293b',
  bgColor = '#ffffff',
  textColor = '#0f172a',
  shape = 'rounded',
  fontSize = 14,
  selected,
  onClick,
}) => {
  const desc = nodeDescriptions[id];
  const [hovered, setHovered] = useState(false);

  const roundedClass =
    shape === 'oval'
      ? 'rounded-full'
      : shape === 'rounded'
      ? 'rounded-2xl'
      : 'rounded-xl';

  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width,
        height,
      }}
      className="z-10 group"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={`w-full h-full flex flex-col items-center justify-center border-2 cursor-pointer transition-all duration-200 select-none shadow-sm ${roundedClass} ${
          selected
            ? 'ring-4 ring-blue-500/40 ring-offset-2 scale-105 shadow-lg'
            : 'hover:scale-[1.02] hover:shadow-md'
        }`}
        style={{
          borderColor,
          backgroundColor: bgColor,
          color: textColor,
          fontSize,
        }}
      >
        <span className="font-extrabold text-center leading-tight px-3">{label}</span>
        {sublabel && (
          <span
            className="text-center leading-tight px-3 opacity-90 font-medium"
            style={{ fontSize: fontSize - 2 }}
          >
            {sublabel}
          </span>
        )}
      </div>

      {/* Tooltip on hover */}
      {hovered && desc && (
        <div
          className="absolute z-50 bg-gray-950 text-white text-xs rounded-2xl px-4 py-3 shadow-2xl border border-gray-700 pointer-events-none transition-all duration-200"
          style={{
            left: '50%',
            bottom: 'calc(100% + 10px)',
            transform: 'translateX(-50%)',
            minWidth: 280,
            maxWidth: 340,
          }}
        >
          <div className="font-bold text-amber-300 mb-1 flex items-center gap-1.5">
            <span>💡</span> {label}
          </div>
          {desc.map((line, i) => (
            <p key={i} className={i > 0 ? 'mt-1 text-gray-300' : 'text-gray-300'}>
              {line}
            </p>
          ))}
        </div>
      )}
    </div>
  );
};

// ── Horizontal Curved Path (Left-to-Right smooth S-curve) ──
const HorizontalCurvedPath: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  dashed?: boolean;
  arrowId?: string;
  strokeWidth?: number;
}> = ({
  x1,
  y1,
  x2,
  y2,
  color = '#64748b',
  dashed = true,
  arrowId = 'arrow',
  strokeWidth = 2,
}) => {
  const dx = x2 - x1;
  const cx1 = x1 + dx * 0.5;
  const cy1 = y1;
  const cx2 = x1 + dx * 0.5;
  const cy2 = y2;
  const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? '6,4' : 'none'}
      markerEnd={arrowId ? `url(#${arrowId})` : undefined}
    />
  );
};

// ── Vertical Curved Path (Top-to-Bottom fanning S-curve) ──
const VerticalCurvedPath: React.FC<{
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  dashed?: boolean;
  arrowId?: string;
  strokeWidth?: number;
}> = ({
  x1,
  y1,
  x2,
  y2,
  color = '#64748b',
  dashed = true,
  arrowId = 'arrow',
  strokeWidth = 2,
}) => {
  const dy = y2 - y1;
  const cx1 = x1;
  const cy1 = y1 + dy * 0.5;
  const cx2 = x2;
  const cy2 = y2 - dy * 0.5;
  const d = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;

  return (
    <path
      d={d}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeDasharray={dashed ? '6,4' : 'none'}
      markerEnd={arrowId ? `url(#${arrowId})` : undefined}
    />
  );
};

export const MindMapView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const toggleSelect = (id: string) => {
    setSelectedNode(selectedNode === id ? null : id);
  };

  return (
    <div
      className="relative select-none"
      style={{ width: 3600, height: 1650 }}
    >
      {/* ═══════════════════════════════════════════════════════
          SVG CONNECTORS & ARROWS LAYER
          ═══════════════════════════════════════════════════════ */}
      <svg
        className="absolute inset-0 pointer-events-none"
        width={3600}
        height={1650}
        style={{ overflow: 'visible' }}
      >
        <defs>
          <marker id="arrow" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#64748b" />
          </marker>
          <marker id="arrow-blue" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#3b82f6" />
          </marker>
          <marker id="arrow-red" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#ef4444" />
          </marker>
          <marker id="arrow-gold" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#d97706" />
          </marker>
          <marker id="arrow-purple" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#7c3aed" />
          </marker>
          <marker id="arrow-green" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#059669" />
          </marker>
          <marker id="arrow-orange" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#f97316" />
          </marker>
          <marker id="arrow-black" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6" fill="#0f172a" />
          </marker>

          {/* Special precise RAG markers that land exactly on node edges */}
          <marker id="rag-arr-green" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L6,3.5 L0,7" fill="#16a34a" />
          </marker>
          <marker id="rag-arr-red" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L6,3.5 L0,7" fill="#dc2626" />
          </marker>
          <marker id="rag-arr-purple" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L6,3.5 L0,7" fill="#7c3aed" />
          </marker>
          <marker id="rag-arr-black" markerWidth="7" markerHeight="7" refX="6" refY="3.5" orient="auto">
            <path d="M0,0 L6,3.5 L0,7" fill="#374151" />
          </marker>
        </defs>

        {/* ── 1. Proses Cycle Loop (Left) ── */}
        <line x1="200" y1="525" x2="200" y2="595" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-blue)" />
        <line x1="150" y1="639" x2="95" y2="715" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-blue)" />
        <line x1="180" y1="737" x2="220" y2="737" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-blue)" />
        <line x1="305" y1="715" x2="250" y2="639" stroke="#3b82f6" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-blue)" />

        {/* ── 2. Proses -> Deadlock (Red dashed) ── */}
        <line x1="280" y1="500" x2="680" y2="500" stroke="#ef4444" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#arrow-red)" />

        {/* ── 3. Deadlock -> RAG (Straight Up) ── */}
        <line x1="770" y1="470" x2="770" y2="355" stroke="#0f172a" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#arrow-black)" />
        {/* RAG box up to Pill label */}
        <line x1="770" y1="305" x2="770" y2="265" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,4" />
        {/* Pill label up to RAG Card */}
        <line x1="770" y1="235" x2="770" y2="200" stroke="#3b82f6" strokeWidth={2} strokeDasharray="4,4" />

        {/* ── 4. Deadlock -> Kondisi (Straight Down) ── */}
        <line x1="770" y1="530" x2="770" y2="670" stroke="#0f172a" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#arrow-black)" />

        {/* ── 5. Kondisi -> 4 Conditions (Waterfall Fanning Downwards) ── */}
        <VerticalCurvedPath x1={720} y1={718} x2={160} y2={840} color="#3b82f6" arrowId="arrow-blue" />
        <VerticalCurvedPath x1={750} y1={718} x2={440} y2={840} color="#f97316" arrowId="arrow-orange" />
        <VerticalCurvedPath x1={780} y1={718} x2={720} y2={840} color="#ef4444" arrowId="arrow-red" />
        <VerticalCurvedPath x1={810} y1={718} x2={1060} y2={840} color="#7c3aed" arrowId="arrow-purple" />

        {/* Solid black arrow from grey box right edge into Circular Wait */}
        <line x1="910" y1="862" x2="960" y2="862" stroke="#0f172a" strokeWidth={2.5} markerEnd="url(#arrow-black)" />

        {/* Connectors from condition descriptions down to illustration cards */}
        <line x1="160" y1="955" x2="160" y2="1050" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5,5" markerEnd="url(#arrow-blue)" />
        <line x1="440" y1="955" x2="440" y2="1050" stroke="#f97316" strokeWidth={2} strokeDasharray="5,5" markerEnd="url(#arrow-orange)" />
        <line x1="720" y1="955" x2="720" y2="1050" stroke="#ef4444" strokeWidth={2} strokeDasharray="5,5" markerEnd="url(#arrow-red)" />
        <line x1="1060" y1="955" x2="1060" y2="1050" stroke="#7c3aed" strokeWidth={2} strokeDasharray="5,5" markerEnd="url(#arrow-purple)" />

        {/* ── 6. Deadlock -> Metode Penanganan (Proportional & Connected Highway) ── */}
        <line x1="860" y1="500" x2="1280" y2="500" stroke="#0f172a" strokeWidth={3} strokeDasharray="6,4" markerEnd="url(#arrow-black)" />

        {/* ── 7. Metode Penanganan -> 3 Methods (Fanning Out Right) ── */}
        <HorizontalCurvedPath x1={1510} y1={485} x2={1720} y2={254} color="#d97706" arrowId="arrow-gold" />
        <HorizontalCurvedPath x1={1510} y1={500} x2={1720} y2={644} color="#7c3aed" arrowId="arrow-purple" />
        <HorizontalCurvedPath x1={1510} y1={515} x2={1720} y2={1274} color="#059669" arrowId="arrow-green" />

        {/* ── 8. Prevention Branches (Tier 1) ── */}
        <HorizontalCurvedPath x1={1920} y1={245} x2={2060} y2={151} color="#d97706" arrowId="arrow-gold" />
        <HorizontalCurvedPath x1={1920} y1={265} x2={2060} y2={391} color="#d97706" arrowId="arrow-gold" />

        {/* Indirect -> ME, HW, NP */}
        <HorizontalCurvedPath x1={2200} y1={140} x2={2320} y2={75} color="#16a34a" arrowId="arrow-green" />
        <line x1="2200" y1="151" x2="2320" y2="151" stroke="#f97316" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-orange)" />
        <HorizontalCurvedPath x1={2200} y1={162} x2={2320} y2={225} color="#ef4444" arrowId="arrow-red" />

        {/* Arrow to OS Preemption Diagram */}
        <line x1="2890" y1="230" x2="2930" y2="230" stroke="#ef4444" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-red)" />

        {/* Direct -> Circular Wait */}
        <line x1="2200" y1="391" x2="2320" y2="391" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-purple)" />
        {/* Arrow to Resource Ordering Diagram */}
        <line x1="2890" y1="391" x2="2930" y2="391" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-purple)" />

        {/* ── 9. Avoidance Branches (Tier 2) ── */}
        <HorizontalCurvedPath x1={1920} y1={635} x2={2060} y2={592} color="#2563eb" arrowId="arrow-blue" />
        <HorizontalCurvedPath x1={1920} y1={655} x2={2060} y2={812} color="#2563eb" arrowId="arrow-blue" />

        {/* PID -> Formula */}
        <line x1="2340" y1="592" x2="2460" y2="592" stroke="#2563eb" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-blue)" />
        {/* Formula -> Comparison Diagram */}
        <line x1="2800" y1="592" x2="2850" y2="592" stroke="#2563eb" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-blue)" />

        {/* RAD -> Banker's Algorithm */}
        <line x1="2340" y1="812" x2="2460" y2="812" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-purple)" />

        {/* Banker's -> Safe & Unsafe */}
        <HorizontalCurvedPath x1={2660} y1={802} x2={2740} y2={775} color="#16a34a" arrowId="arrow-green" />
        <HorizontalCurvedPath x1={2660} y1={822} x2={2740} y2={845} color="#ef4444" arrowId="arrow-red" />

        {/* Banker's Algorithm DOWN to Istilah Matriks Card */}
        <line x1="2560" y1="834" x2="2560" y2="890" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-purple)" />
        {/* Istilah Matriks RIGHT to Ketika Terjadi Request Card */}
        <line x1="2700" y1="975" x2="2740" y2="975" stroke="#7c3aed" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-purple)" />

        {/* ── 10. Detection Branches (Tier 3) ── */}
        <line x1="1920" y1="1274" x2="2060" y2="1274" stroke="#059669" strokeWidth={2.5} strokeDasharray="6,4" markerEnd="url(#arrow-green)" />
        {/* Routine check banner down to Strategi card */}
        <line x1="2285" y1="1315" x2="2285" y2="1360" stroke="#059669" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-green)" />
        {/* Strategi card right to Istilah card */}
        <line x1="2510" y1="1435" x2="2560" y2="1435" stroke="#059669" strokeWidth={2} strokeDasharray="6,4" markerEnd="url(#arrow-green)" />
      </svg>

      {/* ═══════════════════════════════════════════════════════
          HTML INTERACTIVE NODES & DIAGRAMS
          ═══════════════════════════════════════════════════════ */}

      {/* ── ZONE 1: Konsep Dasar Proses & Deadlock (Kiri) ── */}

      {/* Node: Proses */}
      <MindMapNodeItem
        id="proses"
        x={120}
        y={475}
        width={160}
        height={50}
        label="Proses"
        shape="oval"
        fontSize={16}
        selected={selectedNode === 'proses'}
        onClick={() => toggleSelect('proses')}
      />

      {/* Blue Cycle Nodes below Proses */}
      <MindMapNodeItem
        id="request-resource"
        x={110}
        y={595}
        width={180}
        height={44}
        label="Request resource"
        borderColor="#3b82f6"
        bgColor="#eff6ff"
        textColor="#1e40af"
        fontSize={13}
        selected={selectedNode === 'request-resource'}
        onClick={() => toggleSelect('request-resource')}
      />
      <MindMapNodeItem
        id="gunakan-resource"
        x={10}
        y={715}
        width={170}
        height={44}
        label="Gunakan resource"
        borderColor="#3b82f6"
        bgColor="#eff6ff"
        textColor="#1e40af"
        fontSize={13}
        selected={selectedNode === 'gunakan-resource'}
        onClick={() => toggleSelect('gunakan-resource')}
      />
      <MindMapNodeItem
        id="lepas-resource"
        x={220}
        y={715}
        width={170}
        height={44}
        label="Lepas resource"
        borderColor="#3b82f6"
        bgColor="#eff6ff"
        textColor="#1e40af"
        fontSize={13}
        selected={selectedNode === 'lepas-resource'}
        onClick={() => toggleSelect('lepas-resource')}
      />

      {/* Red connection label: Proses -> Deadlock (Clearance above line) */}
      <div
        className="absolute text-center text-xs font-bold text-red-600 leading-tight bg-white px-3.5 py-2 rounded-xl border border-red-200 shadow-xs"
        style={{ left: 310, top: 435, width: 330 }}
      >
        Apabila beberapa proses saling terblokir
        <br />
        karena menunggu ketersediaan resource...
      </div>

      {/* Node: Deadlock (Center Pivot) */}
      <MindMapNodeItem
        id="deadlock"
        x={680}
        y={470}
        width={180}
        height={60}
        label="Deadlock"
        shape="oval"
        fontSize={22}
        borderColor="#0f172a"
        selected={selectedNode === 'deadlock'}
        onClick={() => toggleSelect('deadlock')}
      />

      {/* ── ZONE 2: RAG & Kondisi Deadlock (Atas & Bawah) ── */}

      {/* 1. Main RAG Visual Diagram Card (With perfectly touching arrows and captions above/below) */}
      <div
        className="absolute bg-white border-2 border-blue-400 rounded-3xl p-4 shadow-md"
        style={{ left: 500, top: 30, width: 540, height: 170 }}
      >
        <svg className="w-full h-full" viewBox="0 0 510 140">
          {/* R1 Rectangle: x=25, y=30, w=54, h=70 */}
          <rect x="25" y="30" width="54" height="70" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
          <text x="52" y="56" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="14">R1</text>
          <circle cx="52" cy="84" r="5" fill="#dc2626" />

          {/* P1 Circle: cx=255, cy=65, r=26 */}
          <circle cx="255" cy="65" r="26" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" />
          <text x="255" y="71" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="16">P1</text>

          {/* R2 Rectangle: x=425, y=30, w=64, h=70 */}
          <rect x="425" y="30" width="64" height="70" rx="8" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
          <text x="457" y="56" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="14">R2</text>
          <circle cx="445" cy="84" r="5" fill="#dc2626" />
          <circle cx="469" cy="84" r="5" fill="#dc2626" />

          {/* Arrow 1: P1 -> R1 (Request). Starts at left edge of P1 (229, 65) to right edge of R1 (79, 65) */}
          <line x1="229" y1="65" x2="79" y2="65" stroke="#16a34a" strokeWidth="2" strokeDasharray="5,4" markerEnd="url(#rag-arr-green)" />
          {/* Captions cleanly above and below arrow 1 */}
          <text x="154" y="48" textAnchor="middle" fill="#15803d" fontWeight="800" fontSize="11">R1 is requested by P1</text>
          <text x="154" y="85" textAnchor="middle" fill="#16a34a" fontStyle="italic" fontWeight="600" fontSize="10">P1 wants R1</text>

          {/* Arrow 2: R2 -> P1 (Assignment). Starts at R2 dot (445, 65) to right edge of P1 (281, 65) */}
          <line x1="445" y1="65" x2="281" y2="65" stroke="#dc2626" strokeWidth="2" strokeDasharray="5,4" markerEnd="url(#rag-arr-red)" />
          {/* Captions cleanly above and below arrow 2 */}
          <text x="363" y="48" textAnchor="middle" fill="#b91c1c" fontWeight="800" fontSize="11">R2 is assigned to P1</text>
          <text x="363" y="85" textAnchor="middle" fill="#dc2626" fontStyle="italic" fontWeight="600" fontSize="10">P1 holds 1 instance of R2</text>
        </svg>
      </div>

      {/* RAG descriptive label pill (Centered between Card and Box) */}
      <div
        className="absolute bg-blue-50 border border-blue-200 rounded-full px-4 py-1 text-center text-xs text-blue-700 font-bold shadow-xs"
        style={{ left: 535, top: 225, width: 470 }}
      >
        Grafik berarah yang menggambarkan status resource dan proses
      </div>

      {/* Resource Allocation Graph Box */}
      <MindMapNodeItem
        id="rag"
        x={620}
        y={305}
        width={300}
        height={50}
        label="Resource Allocation Graph"
        shape="rect"
        fontSize={15}
        selected={selectedNode === 'rag'}
        onClick={() => toggleSelect('rag')}
      />

      {/* Title: Kondisi yang Menyebabkan Deadlock */}
      <MindMapNodeItem
        id="kondisi-deadlock"
        x={610}
        y={670}
        width={320}
        height={48}
        label="Kondisi yang Menyebabkan Deadlock"
        shape="rect"
        fontSize={14}
        selected={selectedNode === 'kondisi-deadlock'}
        onClick={() => toggleSelect('kondisi-deadlock')}
      />

      {/* Enclosing Grey Boundary Box for Conditions 1, 2, 3 */}
      <div
        className="absolute border-2 border-dashed border-gray-400 rounded-3xl bg-gray-50/50 p-4"
        style={{ left: 40, top: 815, width: 880, height: 185 }}
      >
        {/* Bottom-left badge inside grey box (faithful to lecture notes) */}
        <div className="absolute bottom-2.5 left-5 bg-white px-3.5 py-0.5 border border-gray-300 rounded-full text-xs font-bold text-gray-500 italic shadow-xs">
          Mungkin menyebabkan deadlock, mungkin tidak
        </div>
      </div>

      {/* ── Condition 1: Mutual Exclusion ── */}
      <MindMapNodeItem
        id="mutual-exclusion"
        x={60}
        y={840}
        width={200}
        height={42}
        label="1. Mutual Exclusion"
        borderColor="#3b82f6"
        bgColor="#eff6ff"
        textColor="#1e3a8a"
        selected={selectedNode === 'mutual-exclusion'}
        onClick={() => toggleSelect('mutual-exclusion')}
      />
      <div
        className="absolute text-center text-xs text-gray-600 leading-tight font-medium"
        style={{ left: 40, top: 892, width: 240 }}
      >
        1 resource hanya boleh dipakai
        <br />
        oleh sebuah proses pada 1 waktu
      </div>

      {/* ── Condition 2: Hold and Wait ── */}
      <MindMapNodeItem
        id="hold-and-wait"
        x={340}
        y={840}
        width={200}
        height={42}
        label="2. Hold and Wait"
        borderColor="#f97316"
        bgColor="#fff7ed"
        textColor="#9a3412"
        selected={selectedNode === 'hold-and-wait'}
        onClick={() => toggleSelect('hold-and-wait')}
      />
      <div
        className="absolute text-center text-xs text-gray-600 leading-tight font-medium"
        style={{ left: 320, top: 892, width: 240 }}
      >
        Process dapat menggunakan proses
        <br />
        sambil menunggu resource dilepas
      </div>

      {/* ── Condition 3: No Preemption ── */}
      <MindMapNodeItem
        id="no-preemption"
        x={620}
        y={840}
        width={200}
        height={42}
        label="3. No Preemption"
        borderColor="#ef4444"
        bgColor="#fef2f2"
        textColor="#991b1b"
        selected={selectedNode === 'no-preemption'}
        onClick={() => toggleSelect('no-preemption')}
      />
      <div
        className="absolute text-center text-xs text-gray-600 leading-tight font-medium"
        style={{ left: 600, top: 892, width: 240 }}
      >
        Resource yang sedang digunakan
        <br />
        oleh proses tidak bisa direbut
      </div>

      {/* ── Condition 4: Circular Wait (Outside grey box, clearly separated!) ── */}
      <MindMapNodeItem
        id="circular-wait"
        x={960}
        y={840}
        width={200}
        height={42}
        label="4. Circular Wait"
        borderColor="#7c3aed"
        bgColor="#f5f3ff"
        textColor="#5b21b6"
        selected={selectedNode === 'circular-wait'}
        onClick={() => toggleSelect('circular-wait')}
      />
      <div
        className="absolute text-center text-xs text-gray-600 leading-tight font-medium"
        style={{ left: 940, top: 892, width: 240 }}
      >
        Setiap proses memegang resource
        <br />
        yang dibutuhkan proses selanjutnya
      </div>

      {/* ── 4 Illustration Cards (With EXACT RAG vector arrows touching circles) ── */}

      {/* Illustration 1: Mutual Exclusion */}
      <div
        className="absolute bg-white border border-blue-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between"
        style={{ left: 30, top: 1050, width: 280, height: 230 }}
      >
        <div className="text-[11px] font-bold text-blue-900 border-b border-gray-100 pb-1">
          Ilustrasi Mutual Exclusion
        </div>
        <div className="relative w-full h-[135px]">
          <svg className="w-full h-full" viewBox="0 0 260 120">
            {/* P1 Circle: cx=35, cy=55, r=22 */}
            <circle cx="35" cy="55" r="22" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" />
            <text x="35" y="60" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="13">P1</text>

            {/* R1 Square: x=110, y=35, w=40, h=40 */}
            <rect x="110" y="35" width="40" height="40" rx="6" fill="#fef2f2" stroke="#dc2626" strokeWidth="2" />
            <text x="130" y="60" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="13">R1</text>

            {/* P2 Circle: cx=225, cy=55, r=22 */}
            <circle cx="225" cy="55" r="22" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2.5" />
            <text x="225" y="60" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="13">P2</text>

            {/* Arrow R1 -> P1: touches right edge of P1 circle (57, 55) */}
            <line x1="110" y1="55" x2="57" y2="55" stroke="#16a34a" strokeWidth="1.75" markerEnd="url(#rag-arr-green)" />
            <text x="83" y="42" textAnchor="middle" fill="#15803d" fontWeight="800" fontSize="7.5">R1 assigned to P1</text>
            <text x="83" y="70" textAnchor="middle" fill="#16a34a" fontStyle="italic" fontWeight="600" fontSize="7">P1 holds R1</text>

            {/* Arrow P2 -> R1: touches right border of R1 square (150, 55) from left edge of P2 (203, 55) */}
            <line x1="203" y1="55" x2="150" y2="55" stroke="#dc2626" strokeWidth="1.75" markerEnd="url(#rag-arr-red)" />
            <text x="176" y="42" textAnchor="middle" fill="#b91c1c" fontWeight="800" fontSize="7.5">P2 wants R1</text>
            <text x="176" y="70" textAnchor="middle" fill="#dc2626" fontStyle="italic" fontWeight="600" fontSize="7">Cannot share</text>
          </svg>
        </div>
        <div className="bg-rose-50 border border-rose-200 rounded-xl p-1.5 text-center text-[11px] font-bold text-rose-700">
          ⚠️ R1 tidak dapat di-share!
        </div>
      </div>

      {/* Illustration 2: Hold and Wait */}
      <div
        className="absolute bg-white border border-orange-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between"
        style={{ left: 330, top: 1050, width: 300, height: 230 }}
      >
        <div className="text-[11px] font-bold text-orange-900 border-b border-gray-100 pb-1">
          Ilustrasi Hold and Wait
        </div>
        <div className="relative w-full h-[140px]">
          <svg className="w-full h-full" viewBox="0 0 280 135">
            {/* R1: x=10, y=25, w=34, h=34 */}
            <rect x="10" y="25" width="34" height="34" rx="5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.75" />
            <text x="27" y="47" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="11">R1</text>

            {/* P1: cx=90, cy=42, r=18 */}
            <circle cx="90" cy="42" r="18" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
            <text x="90" y="46" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="11">P1</text>

            {/* R2: x=73, y=95, w=34, h=34 (below P1) */}
            <rect x="73" y="95" width="34" height="34" rx="5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.75" />
            <text x="90" y="117" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="11">R2</text>

            {/* R3: x=170, y=25, w=34, h=34 */}
            <rect x="170" y="25" width="34" height="34" rx="5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.75" />
            <text x="187" y="47" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="11">R3</text>

            {/* P2: cx=255, cy=42, r=18 */}
            <circle cx="255" cy="42" r="18" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
            <text x="255" y="46" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="11">P2</text>

            {/* Arrow R1 -> P1: touches left edge of P1 (72, 42) */}
            <line x1="44" y1="42" x2="72" y2="42" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#rag-arr-green)" />

            {/* Arrow R2 -> P1: touches bottom edge of P1 (90, 60) */}
            <line x1="90" y1="95" x2="90" y2="60" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#rag-arr-green)" />
            <text x="55" y="80" textAnchor="end" fill="#15803d" fontWeight="700" fontSize="7.5">R1 & R2 hold</text>

            {/* Arrow P1 -> R3: starts at right edge of P1 (108, 42) to (170, 42) */}
            <line x1="108" y1="42" x2="170" y2="42" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#rag-arr-red)" />
            <text x="139" y="32" textAnchor="middle" fill="#b91c1c" fontWeight="800" fontSize="7.5">P1 waits R3</text>
            <text x="139" y="55" textAnchor="middle" fill="#dc2626" fontStyle="italic" fontWeight="600" fontSize="6.5">won't release</text>

            {/* Arrow R3 -> P2: from (204, 42) to left edge of P2 (237, 42) */}
            <line x1="204" y1="42" x2="237" y2="42" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#rag-arr-green)" />
            <text x="220" y="32" textAnchor="middle" fill="#15803d" fontWeight="800" fontSize="7.5">R3 to P2</text>
          </svg>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-1.5 text-center text-[10px] font-bold text-orange-800 leading-tight">
          P1 pegang R1 & R2, tunggu R3 tanpa lepas resource!
        </div>
      </div>

      {/* Illustration 3: No Preemption */}
      <div
        className="absolute bg-white border border-red-200 rounded-2xl p-3 shadow-sm flex flex-col justify-between"
        style={{ left: 650, top: 1050, width: 270, height: 230 }}
      >
        <div className="text-[11px] font-bold text-red-900 border-b border-gray-100 pb-1">
          Ilustrasi No Preemption
        </div>
        <div className="relative w-full h-[140px]">
          <svg className="w-full h-full" viewBox="0 0 250 135">
            {/* P1: cx=65, cy=35, r=18 */}
            <circle cx="65" cy="35" r="18" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
            <text x="65" y="39" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="11">P1</text>

            {/* R1: x=190, y=17, w=36, h=36 */}
            <rect x="190" y="17" width="36" height="36" rx="5" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.75" />
            <text x="208" y="39" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="11">R1</text>

            {/* Arrow R1 -> P1: from (190, 35) to right edge of P1 (83, 35) */}
            <line x1="190" y1="35" x2="83" y2="35" stroke="#16a34a" strokeWidth="1.75" markerEnd="url(#rag-arr-green)" />
            <text x="136" y="24" textAnchor="middle" fill="#15803d" fontWeight="800" fontSize="8">R1 assigned to P1</text>
            <text x="136" y="47" textAnchor="middle" fill="#16a34a" fontStyle="italic" fontWeight="600" fontSize="7.5">P1 holds R1</text>

            {/* OS Triangle: center (50, 105) */}
            <polygon points="50,90 30,120 70,120" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.75" />
            <text x="50" y="113" textAnchor="middle" fill="#6d28d9" fontWeight="900" fontSize="9.5">OS</text>

            {/* Line from OS up towards R1->P1 */}
            <path d="M 70 105 L 140 105 L 140 50" fill="none" stroke="#7c3aed" strokeWidth="1.75" markerEnd="url(#rag-arr-purple)" />
            <text x="105" y="99" textAnchor="middle" fill="#b91c1c" fontWeight="800" fontSize="8">OS cannot interrupt</text>
            {/* Big Red X next to arrow */}
            <text x="150" y="58" fill="#dc2626" fontWeight="900" fontSize="16">✗</text>
          </svg>
        </div>
        <div className="bg-red-50 border border-red-200 rounded-xl p-1.5 text-center text-[10px] font-bold text-red-700">
          OS tidak bisa merebut paksa resource!
        </div>
      </div>

      {/* Illustration 4: Circular Wait */}
      <div
        className="absolute bg-white border-2 border-purple-300 rounded-2xl p-3 shadow-sm flex flex-col justify-between"
        style={{ left: 940, top: 1050, width: 280, height: 230 }}
      >
        <div className="text-[11px] font-bold text-purple-900 border-b border-gray-100 pb-1">
          Ilustrasi Circular Wait
        </div>
        <div className="relative w-full h-[140px]">
          <svg className="w-full h-full" viewBox="0 0 260 135">
            {/* P1: cx=130, cy=25, r=16 */}
            <circle cx="130" cy="25" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.75" />
            <text x="130" y="29" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P1</text>

            {/* R2: x=25, y=52, w=30, h=30 */}
            <rect x="25" y="52" width="30" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
            <text x="40" y="70" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">R2</text>

            {/* P2: cx=130, cy=110, r=16 */}
            <circle cx="130" cy="110" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="1.75" />
            <text x="130" y="114" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P2</text>

            {/* R1: x=205, y=52, w=30, h=30 */}
            <rect x="205" y="52" width="30" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
            <text x="220" y="70" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">R1</text>

            {/* Curve 1: P1 -> R2 (Request). Starts at left of P1 (114, 25) to top of R2 (40, 52) */}
            <path d="M 114 25 C 65 25, 40 35, 40 52" fill="none" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#rag-arr-red)" />
            <text x="75" y="42" fill="#b91c1c" fontWeight="800" fontSize="7">P1 req R2</text>

            {/* Curve 2: R2 -> P2 (Assignment). Starts at bottom of R2 (40, 82) to left of P2 (114, 110) */}
            <path d="M 40 82 C 40 100, 75 110, 114 110" fill="none" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#rag-arr-green)" />
            <text x="75" y="98" fill="#15803d" fontWeight="800" fontSize="7">P2 holds R2</text>

            {/* Curve 3: P2 -> R1 (Request). Starts at right of P2 (146, 110) to bottom of R1 (220, 82) */}
            <path d="M 146 110 C 185 110, 220 100, 220 82" fill="none" stroke="#dc2626" strokeWidth="1.5" markerEnd="url(#rag-arr-red)" />
            <text x="185" y="98" fill="#b91c1c" fontWeight="800" fontSize="7">P2 req R1</text>

            {/* Curve 4: R1 -> P1 (Assignment). Starts at top of R1 (220, 52) to right of P1 (146, 25) */}
            <path d="M 220 52 C 220 35, 185 25, 146 25" fill="none" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#rag-arr-green)" />
            <text x="185" y="42" fill="#15803d" fontWeight="800" fontSize="7">P1 holds R1</text>
          </svg>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-1 text-center text-[10px] font-bold text-purple-800">
          Siklus tertutup (Pasti Deadlock!)
        </div>
      </div>

      {/* ── ZONE 3: Metode Penanganan (Proportional Highway & Cohesive Distance) ── */}

      {/* Middle Label on the Deadlock -> Metode Highway Line */}
      <div
        className="absolute bg-white px-3.5 py-1.5 rounded-full border border-gray-300 text-xs font-bold text-gray-700 shadow-xs text-center z-20"
        style={{ left: 910, top: 483, width: 320 }}
      >
        3 Pendekatan Penanganan Deadlock
      </div>

      {/* Metode Penanganan Header Box (Balanced spacing right after highway) */}
      <MindMapNodeItem
        id="metode-penanganan"
        x={1280}
        y={470}
        width={230}
        height={60}
        label="Metode Penanganan"
        shape="rect"
        fontSize={17}
        selected={selectedNode === 'metode-penanganan'}
        onClick={() => toggleSelect('metode-penanganan')}
      />

      {/* ═══════════════════════════════════════════════════════
          TIER 1: 3.1. Prevention (Top: y = 30 to 480)
          ═══════════════════════════════════════════════════════ */}
      <MindMapNodeItem
        id="prevention"
        x={1720}
        y={230}
        width={200}
        height={48}
        label="1. Prevention"
        borderColor="#d97706"
        bgColor="#fffbeb"
        textColor="#92400e"
        selected={selectedNode === 'prevention'}
        onClick={() => toggleSelect('prevention')}
      />
      <div
        className="absolute text-xs text-amber-800 font-bold italic"
        style={{ left: 1720, top: 285, width: 200 }}
      >
        Dilakukan saat
        <br />
        perancangan proses
      </div>

      {/* Prevention: Indirect */}
      <div
        className="absolute text-[11px] text-gray-600 font-medium max-w-[280px] leading-tight"
        style={{ left: 2040, top: 85 }}
      >
        Mengusahakan agar <b>salah satu</b> dari tiga kondisi berikut dihilangkan.
        <br />
        <span className="italic text-gray-500">Gimana cara menghilangkannya?</span>
      </div>
      <MindMapNodeItem
        id="indirect"
        x={2060}
        y={130}
        width={140}
        height={42}
        label="Indirect"
        borderColor="#d97706"
        bgColor="#fffbeb"
        textColor="#92400e"
        fontSize={13}
        selected={selectedNode === 'indirect'}
        onClick={() => toggleSelect('indirect')}
      />

      {/* Indirect: 1. ME */}
      <MindMapNodeItem
        id="prev-mutual"
        x={2320}
        y={55}
        width={190}
        height={40}
        label="1. Mutual Exclusion"
        borderColor="#16a34a"
        bgColor="#f0fdf4"
        textColor="#166534"
        fontSize={12}
        selected={selectedNode === 'prev-mutual'}
        onClick={() => toggleSelect('prev-mutual')}
      />
      <div
        className="absolute text-xs text-green-800 leading-snug bg-green-50 border border-green-200 rounded-xl p-2.5 shadow-xs flex items-center"
        style={{ left: 2540, top: 48, width: 360, height: 54 }}
      >
        <span><b>Tidak bisa dihilangkan</b> jika resource bersifat protected; hanya dapat dikelola oleh OS itu sendiri.</span>
      </div>

      {/* Indirect: 2. Hold and Wait */}
      <MindMapNodeItem
        id="prev-hold"
        x={2320}
        y={131}
        width={190}
        height={40}
        label="2. Hold and Wait"
        borderColor="#f97316"
        bgColor="#fff7ed"
        textColor="#9a3412"
        fontSize={12}
        selected={selectedNode === 'prev-hold'}
        onClick={() => toggleSelect('prev-hold')}
      />
      <div
        className="absolute text-xs text-orange-900 leading-snug bg-orange-50 border border-orange-200 rounded-xl p-2.5 shadow-xs flex items-center"
        style={{ left: 2540, top: 124, width: 360, height: 54 }}
      >
        <span><b>Memblokir</b> setiap proses yang resourcenya <span className="underline font-bold">belum lengkap</span>; hanya memperbolehkan eksekusi jika sudah dapat semua.</span>
      </div>

      {/* Indirect: 3. No Preemption */}
      <MindMapNodeItem
        id="prev-nopre"
        x={2320}
        y={205}
        width={190}
        height={40}
        label="3. No Preemption"
        borderColor="#ef4444"
        bgColor="#fef2f2"
        textColor="#991b1b"
        fontSize={12}
        selected={selectedNode === 'prev-nopre'}
        onClick={() => toggleSelect('prev-nopre')}
      />
      <div
        className="absolute text-xs text-red-900 leading-snug bg-red-50 border border-red-200 rounded-xl p-3 space-y-1 shadow-xs"
        style={{ left: 2540, top: 198, width: 360, height: 75 }}
      >
        <div>
          <b>• Tetap tidak boleh disela:</b> jika butuh resource lain dan tak dapat akses, maka proses harus lepas resource yang dimiliki.
        </div>
        <div className="text-purple-900 font-semibold text-[11px]">
          <b>• Boleh disela oleh OS:</b> proses running bisa di-stop agar melepas resource.
        </div>
      </div>

      {/* Prevention Diagram (OS Interruption) on right (With exact RAG touching circles) */}
      <div
        className="absolute bg-white border-2 border-red-200 rounded-2xl p-3 shadow-sm"
        style={{ left: 2930, top: 105, width: 340, height: 165 }}
      >
        <div className="text-[11px] font-bold text-red-900 mb-1 border-b border-gray-100 pb-1">
          Intervensi Preemption OS
        </div>
        <svg className="w-full h-[120px]" viewBox="0 0 310 110">
          {/* P1: cx=35, cy=80, r=16 */}
          <circle cx="35" cy="80" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          <text x="35" y="84" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P1</text>

          {/* R1: x=80, y=64, w=32, h=32 */}
          <rect x="80" y="64" width="32" height="32" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="96" y="84" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">R1</text>

          {/* R1 -> P1: touches right edge of P1 (51, 80) */}
          <line x1="80" y1="80" x2="51" y2="80" stroke="#16a34a" strokeWidth="1.5" markerEnd="url(#rag-arr-green)" />

          {/* R2: x=145, y=20, w=32, h=32 */}
          <rect x="145" y="20" width="32" height="32" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="161" y="40" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">R2</text>

          {/* P1 -> R2 (Denied with Red X): curve from (35, 64) up to (145, 36) */}
          <path d="M 35 64 C 35 36, 100 36, 145 36" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
          <text x="85" y="45" fill="#dc2626" fontWeight="900" fontSize="16">✗</text>

          {/* P2: cx=245, cy=36, r=16 */}
          <circle cx="245" cy="36" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          <text x="245" y="40" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P2</text>

          {/* R2 -> P2: touches left edge of P2 (229, 36) */}
          <line x1="177" y1="36" x2="229" y2="36" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />

          {/* OS Triangle: centered at (195, 12) */}
          <polygon points="195,2 180,22 210,22" fill="#f5f3ff" stroke="#7c3aed" strokeWidth="1.5" />
          <text x="195" y="16" textAnchor="middle" fill="#6d28d9" fontWeight="900" fontSize="8.5">OS</text>
          <line x1="195" y1="22" x2="195" y2="36" stroke="#7c3aed" strokeWidth="1.5" />

          <text x="155" y="102" textAnchor="middle" fill="#6d28d9" fontWeight="700" fontSize="9">OS dapat menyela & menghentikan proses</text>
        </svg>
      </div>

      {/* Prevention: Direct */}
      <MindMapNodeItem
        id="direct"
        x={2060}
        y={370}
        width={140}
        height={42}
        label="Direct"
        borderColor="#d97706"
        bgColor="#fffbeb"
        textColor="#92400e"
        fontSize={13}
        selected={selectedNode === 'direct'}
        onClick={() => toggleSelect('direct')}
      />

      {/* Direct: 4. Circular Wait */}
      <MindMapNodeItem
        id="prev-circular"
        x={2320}
        y={370}
        width={190}
        height={42}
        label="4. Circular Wait"
        borderColor="#7c3aed"
        bgColor="#f5f3ff"
        textColor="#5b21b6"
        fontSize={12}
        selected={selectedNode === 'prev-circular'}
        onClick={() => toggleSelect('prev-circular')}
      />
      <div
        className="absolute text-xs text-purple-900 leading-snug bg-purple-50 border border-purple-200 rounded-xl p-3 shadow-xs flex items-center"
        style={{ left: 2540, top: 362, width: 360, height: 58 }}
      >
        <span><b>Memberikan indeks terurut</b> kepada setiap resource; proses harus menggunakan resource dengan indeks terkecil dahulu secara berurutan.</span>
      </div>

      {/* Prevention Diagram (Resource Ordering) on right */}
      <div
        className="absolute bg-white border-2 border-purple-200 rounded-2xl p-3 shadow-sm"
        style={{ left: 2930, top: 330, width: 340, height: 140 }}
      >
        <div className="text-[11px] font-bold text-purple-900 mb-1 border-b border-gray-100 pb-1">
          Penomoran Indeks Terurut
        </div>
        <svg className="w-full h-[100px]" viewBox="0 0 310 95">
          {/* P1: cx=35, cy=70, r=16 */}
          <circle cx="35" cy="70" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          <text x="35" y="74" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P1</text>

          {/* R1 (index 1): x=85, y=54, w=30, h=30 */}
          <rect x="85" y="54" width="30" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="100" y="73" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">R1</text>

          {/* R1 -> P1: touches right edge of P1 (51, 70) */}
          <line x1="85" y1="70" x2="51" y2="70" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />

          {/* R2 (index 2): x=85, y=10, w=30, h=30 */}
          <rect x="85" y="10" width="30" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
          <text x="100" y="29" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="10">R2</text>

          {/* P1 -> R2: touches left edge of R2 (85, 25) */}
          <path d="M 35 54 C 35 25, 60 25, 85 25" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />

          {/* P2: cx=220, cy=25, r=16 */}
          <circle cx="220" cy="25" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
          <text x="220" y="29" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P2</text>

          {/* P2 -> R2 (Ditolak / Out of order): dashed line with Red X */}
          <line x1="204" y1="25" x2="115" y2="25" stroke="#dc2626" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#rag-arr-red)" />
          <text x="155" y="20" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="15">✗</text>

          {/* P2 -> R1 (Diizinkan / In order): dashed curve with Green Checkmark */}
          <path d="M 215 38 C 205 70, 160 70, 115 70" fill="none" stroke="#16a34a" strokeWidth="1.5" strokeDasharray="4,3" markerEnd="url(#rag-arr-green)" />
          <text x="165" y="62" textAnchor="middle" fill="#16a34a" fontWeight="900" fontSize="15">✓</text>
        </svg>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TIER 2: 3.2. Avoidance (Middle: y = 515 to 1120)
          ═══════════════════════════════════════════════════════ */}
      <MindMapNodeItem
        id="avoidance"
        x={1720}
        y={620}
        width={200}
        height={48}
        label="2. Avoidance"
        borderColor="#7c3aed"
        bgColor="#f5f3ff"
        textColor="#5b21b6"
        selected={selectedNode === 'avoidance'}
        onClick={() => toggleSelect('avoidance')}
      />
      <div
        className="absolute text-xs text-purple-800 font-bold italic"
        style={{ left: 1720, top: 675, width: 200 }}
      >
        Dilakukan saat
        <br />
        eksekusi proses
      </div>

      {/* Avoidance: PID */}
      <MindMapNodeItem
        id="pid"
        x={2060}
        y={570}
        width={280}
        height={44}
        label="Process Initiation Denial (PID)"
        borderColor="#2563eb"
        bgColor="#eff6ff"
        textColor="#1e40af"
        fontSize={13}
        selected={selectedNode === 'pid'}
        onClick={() => toggleSelect('pid')}
      />
      {/* Label on line PID -> Formula */}
      <div
        className="absolute text-xs text-blue-700 font-bold italic text-center"
        style={{ left: 2320, top: 567, width: 150 }}
      >
        Ketika ada proses baru
      </div>

      {/* PID Formula Card */}
      <div
        className="absolute bg-white border-2 border-blue-300 rounded-3xl p-4 shadow-sm"
        style={{ left: 2460, top: 530, width: 340, height: 125 }}
      >
        <div className="text-base font-serif italic font-black text-center text-gray-900 tracking-wider">
          R<sub>j</sub> ≥ C<sub>(n+1)j</sub> + &Sigma; C<sub>ij</sub>{' '}
          <span className="text-xs font-sans not-italic text-purple-700 font-bold ml-1.5">
            untuk semua j
          </span>
        </div>
        <div className="flex justify-between mt-2.5 text-[10px] border-t border-gray-100 pt-2 font-medium">
          <div className="text-red-600 max-w-[140px] leading-tight">
            &uarr; C<sub>(n+1)j</sub>: klaim baru
          </div>
          <div className="text-blue-700 max-w-[150px] leading-tight text-right">
            &uarr; &Sigma; C<sub>ij</sub>: klaim sebelumnya
          </div>
        </div>
      </div>

      {/* PID Comparison Diagram Frame (t=0 vs t=1) - WITH FULL RAG GRAPH! */}
      <div
        className="absolute bg-white border-2 border-gray-300 rounded-3xl p-4 shadow-sm"
        style={{ left: 2850, top: 505, width: 560, height: 235 }}
      >
        <div className="grid grid-cols-2 gap-3 divide-x divide-gray-200">
          {/* Panel t=0 */}
          <div className="pr-2">
            <div className="text-xs font-mono text-gray-500 font-bold mb-1 flex items-center justify-between">
              <span>t = 0 (Aman)</span>
              <span className="text-green-700 text-[10px] font-bold">P1, P2 aktif</span>
            </div>
            <svg className="w-full h-[140px]" viewBox="0 0 250 140">
              {/* P1: cx=45, cy=55, r=16 */}
              <circle cx="45" cy="55" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="45" y="59" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P1</text>

              {/* R1: x=105, y=10, w=30, h=30 */}
              <rect x="105" y="10" width="30" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="120" y="27" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="9">R1</text>
              <circle cx="120" cy="34" r="3" fill="#dc2626" />

              {/* P2: cx=165, cy=60, r=16 */}
              <circle cx="165" cy="60" r="16" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="165" y="64" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="10">P2</text>

              {/* R3: x=210, y=20, w=30, h=30 */}
              <rect x="210" y="20" width="30" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="225" y="37" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="9">R3</text>
              <circle cx="225" cy="44" r="3" fill="#dc2626" />

              {/* R2: x=75, y=95, w=36, h=30 */}
              <rect x="75" y="95" width="36" height="30" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="93" y="112" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="9">R2</text>
              <circle cx="86" cy="119" r="2.5" fill="#dc2626" />
              <circle cx="100" cy="119" r="2.5" fill="#dc2626" />

              {/* P1 -> R1: curve touches circle P1 (45, 39) */}
              <path d="M 45 39 C 45 20, 75 15, 105 25" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              {/* R1 -> P2: curve touches circle P2 (152, 50) */}
              <path d="M 120 40 C 120 55, 140 50, 150 54" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              {/* P2 -> R3: curve touches circle P2 (177, 50) */}
              <path d="M 177 50 C 190 40, 200 35, 210 35" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              {/* R2 -> P1: touches bottom of P1 (45, 71) */}
              <path d="M 86 95 C 80 80, 55 80, 48 71" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              {/* R2 -> P2: touches bottom of P2 (165, 76) */}
              <path d="M 100 110 C 130 110, 155 95, 163 76" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
            </svg>
            <div className="text-[10px] text-green-700 font-bold text-center">Resource cukup memenuhi klaim</div>
          </div>

          {/* Panel t=1 */}
          <div className="pl-3">
            <div className="text-xs font-mono text-gray-500 font-bold mb-1 flex items-center justify-between">
              <span>t = 1 (P3 Masuk)</span>
              <span className="text-rose-600 text-[10px] font-bold">Unsafe / Ditolak</span>
            </div>
            <svg className="w-full h-[140px]" viewBox="0 0 260 140">
              {/* Same graph plus P3 */}
              <circle cx="45" cy="55" r="15" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="45" y="59" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="9">P1</text>

              <rect x="105" y="10" width="28" height="28" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="119" y="27" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="9">R1</text>
              <circle cx="119" cy="33" r="2.5" fill="#dc2626" />

              <circle cx="160" cy="60" r="15" fill="#f0fdf4" stroke="#16a34a" strokeWidth="2" />
              <text x="160" y="64" textAnchor="middle" fill="#166534" fontWeight="900" fontSize="9">P2</text>

              <rect x="205" y="15" width="28" height="28" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="219" y="32" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="9">R3</text>
              <circle cx="219" cy="38" r="2.5" fill="#dc2626" />

              <rect x="75" y="95" width="34" height="28" rx="4" fill="#fef2f2" stroke="#dc2626" strokeWidth="1.5" />
              <text x="92" y="112" textAnchor="middle" fill="#dc2626" fontWeight="900" fontSize="9">R2</text>
              <circle cx="85" cy="117" r="2.5" fill="#dc2626" />
              <circle cx="99" cy="117" r="2.5" fill="#dc2626" />

              {/* P3 added at right */}
              <circle cx="219" cy="85" r="15" fill="#eff6ff" stroke="#2563eb" strokeWidth="2" />
              <text x="219" y="89" textAnchor="middle" fill="#1e40af" fontWeight="900" fontSize="9">P3</text>

              {/* R3 -> P3: touches top of circle P3 (219, 70) */}
              <line x1="219" y1="43" x2="219" y2="70" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />

              {/* P3 -> R2: long sweeping curve from bottom of P3 (219, 100) to R2 (92, 123) */}
              <path d="M 219 100 C 219 135, 130 135, 95 123" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />

              {/* Internal edges */}
              <path d="M 45 40 C 45 20, 75 15, 105 24" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              <path d="M 119 38 C 119 50, 135 50, 146 54" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              <path d="M 172 50 C 185 40, 195 32, 205 32" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              <path d="M 85 95 C 80 80, 55 80, 48 70" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
              <path d="M 99 110 C 125 110, 150 95, 158 75" fill="none" stroke="#374151" strokeWidth="1.5" markerEnd="url(#rag-arr-black)" />
            </svg>
            <div className="mt-0.5 font-mono text-[10px] font-bold text-gray-900 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200 text-center">
              R ≥ P3 + (P1+P2) → 2 ≥ 3 <span className="text-rose-600 font-black">FALSE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Avoidance: RAD */}
      <MindMapNodeItem
        id="rad"
        x={2060}
        y={790}
        width={280}
        height={44}
        label="Resource Allocation Denial (RAD)"
        borderColor="#2563eb"
        bgColor="#eff6ff"
        textColor="#1e40af"
        fontSize={13}
        selected={selectedNode === 'rad'}
        onClick={() => toggleSelect('rad')}
      />
      {/* Label on line RAD -> Banker's */}
      <div
        className="absolute text-xs text-purple-800 font-bold italic text-center"
        style={{ left: 2320, top: 787, width: 150 }}
      >
        Ketika butuh resource
      </div>

      {/* Banker's Algorithm */}
      <MindMapNodeItem
        id="bankers"
        x={2460}
        y={790}
        width={200}
        height={44}
        label="Banker's Algorithm"
        borderColor="#7c3aed"
        bgColor="#f5f3ff"
        textColor="#5b21b6"
        fontSize={14}
        selected={selectedNode === 'bankers'}
        onClick={() => toggleSelect('bankers')}
      />

      {/* States: Safe & Unsafe */}
      <MindMapNodeItem
        id="state-safe"
        x={2740}
        y={755}
        width={150}
        height={40}
        label="State 1: Safe"
        borderColor="#16a34a"
        bgColor="#f0fdf4"
        textColor="#166534"
        fontSize={13}
        selected={selectedNode === 'state-safe'}
        onClick={() => toggleSelect('state-safe')}
      />
      <div
        className="absolute text-xs text-green-800 font-bold"
        style={{ left: 2905, top: 767, width: 320 }}
      >
        Seluruh proses dapat dieksekusi hingga selesai.
      </div>

      <MindMapNodeItem
        id="state-unsafe"
        x={2740}
        y={825}
        width={150}
        height={40}
        label="State 2: Unsafe"
        borderColor="#ef4444"
        bgColor="#fef2f2"
        textColor="#991b1b"
        fontSize={13}
        selected={selectedNode === 'state-unsafe'}
        onClick={() => toggleSelect('state-unsafe')}
      />
      <div
        className="absolute text-xs text-red-800 font-bold"
        style={{ left: 2905, top: 837, width: 320 }}
      >
        Terdapat proses yang tidak dapat dieksekusi.
      </div>

      {/* Istilah Card (Avoidance) below Banker's */}
      <div
        className="absolute bg-white border border-gray-200 rounded-3xl p-4 shadow-sm"
        style={{ left: 2460, top: 890, width: 240, height: 175 }}
      >
        <div className="font-bold text-xs text-gray-900 mb-1.5 uppercase tracking-wider">
          Istilah Matriks:
        </div>
        <div className="text-xs space-y-1 text-gray-700 font-mono">
          <div><b>A</b> = Allocation Matrix</div>
          <div><b>C</b> = Maximum Demand</div>
          <div><b>C - A</b> = Still Needs</div>
          <div><b>R</b> = Initial Available Res.</div>
          <div><b>V</b> = Available Vector</div>
        </div>
      </div>

      {/* "Ketika terjadi Request Resource?" Card */}
      <div
        className="absolute bg-white border-2 border-purple-300 rounded-3xl p-4 shadow-sm"
        style={{ left: 2740, top: 890, width: 440, height: 175 }}
      >
        <div className="font-bold text-xs text-purple-900 mb-1.5 uppercase tracking-wider">
          Ketika terjadi Request Resource?
        </div>
        <ol className="text-xs text-gray-700 space-y-1 list-decimal list-inside font-medium leading-relaxed">
          <li>Jika Request ≤ Needs, lanjut ke langkah 2.</li>
          <li>Jika Request ≤ Initial Available Vector, lanjut langkah 3.</li>
          <li>
            Ubah data matriks sementara:
            <ul className="list-disc list-inside ml-3 text-[11px] text-purple-900 font-semibold mt-0.5 space-y-0.5">
              <li>Allocation += Request</li>
              <li>Needs -= Request</li>
              <li>Initial Available Vector -= Request</li>
            </ul>
          </li>
        </ol>
      </div>

      {/* ═══════════════════════════════════════════════════════
          TIER 3: 3.3. Detection (Bottom: y = 1220 to 1600)
          ═══════════════════════════════════════════════════════ */}
      <MindMapNodeItem
        id="detection"
        x={1720}
        y={1250}
        width={200}
        height={48}
        label="3. Detection"
        borderColor="#059669"
        bgColor="#ecfdf5"
        textColor="#065f46"
        selected={selectedNode === 'detection'}
        onClick={() => toggleSelect('detection')}
      />
      <div
        className="absolute text-xs text-emerald-800 font-bold italic"
        style={{ left: 1720, top: 1305, width: 200 }}
      >
        Dilakukan saat
        <br />
        eksekusi proses
      </div>

      {/* Detection routine checking banner */}
      <div
        className="absolute text-xs text-emerald-950 font-medium leading-relaxed bg-emerald-50/80 border border-emerald-300 rounded-2xl p-3.5 shadow-xs"
        style={{ left: 2060, top: 1230, width: 450, height: 85 }}
      >
        Setiap proses dapat terus melakukan request resource selama tersedia.
        <br />
        OS akan melakukan <b>pengecekan secara rutin</b> untuk mendeteksi terjadinya deadlock.
      </div>

      {/* Detection Strategi Card */}
      <div
        className="absolute bg-white border-2 border-emerald-400 rounded-3xl p-4 shadow-sm"
        style={{ left: 2060, top: 1360, width: 450, height: 145 }}
      >
        <div className="font-bold text-xs text-emerald-900 mb-1 uppercase tracking-wider">
          Strategi Deteksi:
        </div>
        <div className="text-sm text-emerald-950 font-bold leading-relaxed">
          Cari proses dengan resource request (Q) ≤ jumlah resource available (W).
        </div>
        <div className="text-xs text-rose-700 font-semibold mt-2 bg-rose-50 border border-rose-200 rounded-xl px-3 py-1.5">
          Proses yang tidak bertanda (unmarked) → mengalami Deadlock!
        </div>
      </div>

      {/* Detection Istilah Card */}
      <div
        className="absolute bg-white border border-gray-200 rounded-3xl p-4 shadow-sm"
        style={{ left: 2560, top: 1340, width: 280, height: 185 }}
      >
        <div className="font-bold text-xs text-gray-900 mb-1.5 uppercase tracking-wider">
          Istilah Deteksi:
        </div>
        <div className="text-xs space-y-1.5 text-gray-700 font-mono">
          <div><b>A</b> = Allocation Matrix</div>
          <div className="line-through text-red-500 font-black">
            C = Maximum Demand
          </div>
          <div><b>Q</b> = Request Matrix</div>
          <div><b>R</b> = Resource Vector</div>
          <div><b>W</b> = Available Vector</div>
        </div>
      </div>
    </div>
  );
};

export default MindMapView;
