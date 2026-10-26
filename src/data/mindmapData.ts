// ============================================================
// mindmapData.ts — Structure for the Deadlock mind map
// ============================================================

export interface MindMapNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  sublabel?: string;
  type: 'oval' | 'rect' | 'rect-rounded' | 'diamond' | 'triangle' | 'group';
  borderColor: string;
  bgColor: string;
  textColor: string;
  fontSize?: number;
  children?: string[];
}

export interface MindMapEdge {
  id: string;
  from: string;
  to: string;
  style: 'solid' | 'dashed';
  color: string;
  label?: string;
  labelColor?: string;
  curved?: boolean;
}

// Node positions are in canvas coordinates
export const mindmapNodes: MindMapNode[] = [
  // ── Center: Proses & Deadlock ────────────────
  {
    id: 'proses',
    x: 150, y: 550,
    width: 140, height: 50,
    label: 'Proses',
    type: 'oval',
    borderColor: '#000',
    bgColor: '#fff',
    textColor: '#000',
    fontSize: 16,
  },
  {
    id: 'request-resource',
    x: 80, y: 660,
    width: 160, height: 40,
    label: 'Request resource',
    type: 'rect',
    borderColor: '#3b82f6',
    bgColor: '#eff6ff',
    textColor: '#1e40af',
    fontSize: 13,
  },
  {
    id: 'gunakan-resource',
    x: 40, y: 740,
    width: 170, height: 40,
    label: 'Gunakan resource',
    type: 'rect',
    borderColor: '#3b82f6',
    bgColor: '#eff6ff',
    textColor: '#1e40af',
    fontSize: 13,
  },
  {
    id: 'lepas-resource',
    x: 220, y: 740,
    width: 160, height: 40,
    label: 'Lepas resource',
    type: 'rect',
    borderColor: '#3b82f6',
    bgColor: '#eff6ff',
    textColor: '#1e40af',
    fontSize: 13,
  },

  // ── Deadlock (center) ──────────────────────
  {
    id: 'deadlock',
    x: 620, y: 550,
    width: 160, height: 55,
    label: 'Deadlock',
    type: 'oval',
    borderColor: '#000',
    bgColor: '#fff',
    textColor: '#000',
    fontSize: 18,
  },

  // ── Resource Allocation Graph (above) ──────
  {
    id: 'rag',
    x: 560, y: 310,
    width: 280, height: 50,
    label: 'Resource Allocation Graph',
    type: 'rect',
    borderColor: '#000',
    bgColor: '#fff',
    textColor: '#000',
    fontSize: 15,
  },

  // ── Kondisi yang Menyebabkan Deadlock (below) ──
  {
    id: 'kondisi-deadlock',
    x: 480, y: 750,
    width: 280, height: 55,
    label: 'Kondisi yang',
    sublabel: 'Menyebabkan Deadlock',
    type: 'rect',
    borderColor: '#000',
    bgColor: '#fff',
    textColor: '#000',
    fontSize: 15,
  },

  // ── 4 Conditions ───────────────────────────
  {
    id: 'mutual-exclusion',
    x: 330, y: 910,
    width: 200, height: 45,
    label: '1. Mutual Exclusion',
    type: 'rect-rounded',
    borderColor: '#3b82f6',
    bgColor: '#eff6ff',
    textColor: '#1e3a8a',
    fontSize: 14,
  },
  {
    id: 'hold-and-wait',
    x: 540, y: 910,
    width: 180, height: 45,
    label: '2. Hold and Wait',
    type: 'rect-rounded',
    borderColor: '#f97316',
    bgColor: '#fff7ed',
    textColor: '#9a3412',
    fontSize: 14,
  },
  {
    id: 'no-preemption',
    x: 730, y: 910,
    width: 190, height: 45,
    label: '3. No Preemption',
    type: 'rect-rounded',
    borderColor: '#ef4444',
    bgColor: '#fef2f2',
    textColor: '#991b1b',
    fontSize: 14,
  },
  {
    id: 'circular-wait',
    x: 940, y: 910,
    width: 180, height: 45,
    label: '4. Circular Wait',
    type: 'rect-rounded',
    borderColor: '#8b5cf6',
    bgColor: '#f5f3ff',
    textColor: '#5b21b6',
    fontSize: 14,
  },

  // ── Metode Penanganan (right) ──────────────
  {
    id: 'metode-penanganan',
    x: 1050, y: 550,
    width: 230, height: 50,
    label: 'Metode Penanganan',
    type: 'rect',
    borderColor: '#000',
    bgColor: '#fff',
    textColor: '#000',
    fontSize: 16,
  },

  // ── 3 Handling methods ─────────────────────
  {
    id: 'prevention',
    x: 1400, y: 350,
    width: 170, height: 45,
    label: '1. Prevention',
    type: 'rect-rounded',
    borderColor: '#d97706',
    bgColor: '#fffbeb',
    textColor: '#92400e',
    fontSize: 14,
  },
  {
    id: 'avoidance',
    x: 1400, y: 550,
    width: 170, height: 45,
    label: '2. Avoidance',
    type: 'rect-rounded',
    borderColor: '#7c3aed',
    bgColor: '#f5f3ff',
    textColor: '#5b21b6',
    fontSize: 14,
  },
  {
    id: 'detection',
    x: 1400, y: 730,
    width: 170, height: 45,
    label: '3. Detection',
    type: 'rect-rounded',
    borderColor: '#059669',
    bgColor: '#ecfdf5',
    textColor: '#065f46',
    fontSize: 14,
  },

  // ── Prevention sub-branches ────────────────
  {
    id: 'indirect',
    x: 1650, y: 200,
    width: 130, height: 40,
    label: 'Indirect',
    type: 'rect-rounded',
    borderColor: '#d97706',
    bgColor: '#fffbeb',
    textColor: '#92400e',
    fontSize: 13,
  },
  {
    id: 'direct',
    x: 1650, y: 460,
    width: 130, height: 40,
    label: 'Direct',
    type: 'rect-rounded',
    borderColor: '#d97706',
    bgColor: '#fffbeb',
    textColor: '#92400e',
    fontSize: 13,
  },

  // ── Indirect conditions ────────────────────
  {
    id: 'prev-mutual',
    x: 1860, y: 100,
    width: 200, height: 40,
    label: '1. Mutual Exclusion',
    type: 'rect-rounded',
    borderColor: '#16a34a',
    bgColor: '#f0fdf4',
    textColor: '#166534',
    fontSize: 12,
  },
  {
    id: 'prev-hold',
    x: 1860, y: 180,
    width: 200, height: 40,
    label: '2. Hold and Wait',
    type: 'rect-rounded',
    borderColor: '#f97316',
    bgColor: '#fff7ed',
    textColor: '#9a3412',
    fontSize: 12,
  },
  {
    id: 'prev-nopre',
    x: 1860, y: 260,
    width: 200, height: 40,
    label: '3. No Preemption',
    type: 'rect-rounded',
    borderColor: '#ef4444',
    bgColor: '#fef2f2',
    textColor: '#991b1b',
    fontSize: 12,
  },

  // Direct → Circular Wait
  {
    id: 'prev-circular',
    x: 1860, y: 460,
    width: 200, height: 40,
    label: '4. Circular Wait',
    type: 'rect-rounded',
    borderColor: '#8b5cf6',
    bgColor: '#f5f3ff',
    textColor: '#5b21b6',
    fontSize: 12,
  },

  // ── Avoidance sub-branches ─────────────────
  {
    id: 'pid',
    x: 1650, y: 520,
    width: 250, height: 40,
    label: 'Process Initiation Denial (PID)',
    type: 'rect-rounded',
    borderColor: '#2563eb',
    bgColor: '#eff6ff',
    textColor: '#1e40af',
    fontSize: 12,
  },
  {
    id: 'rad',
    x: 1650, y: 600,
    width: 270, height: 40,
    label: 'Resource Allocation Denial (RAD)',
    type: 'rect-rounded',
    borderColor: '#2563eb',
    bgColor: '#eff6ff',
    textColor: '#1e40af',
    fontSize: 12,
  },

  // ── Banker's Algorithm ─────────────────────
  {
    id: 'bankers',
    x: 1990, y: 600,
    width: 200, height: 40,
    label: "Banker's Algorithm",
    type: 'rect-rounded',
    borderColor: '#7c3aed',
    bgColor: '#f5f3ff',
    textColor: '#5b21b6',
    fontSize: 13,
  },
  {
    id: 'state-safe',
    x: 2250, y: 570,
    width: 150, height: 35,
    label: 'State 1: Safe',
    type: 'rect-rounded',
    borderColor: '#16a34a',
    bgColor: '#f0fdf4',
    textColor: '#166534',
    fontSize: 12,
  },
  {
    id: 'state-unsafe',
    x: 2250, y: 640,
    width: 150, height: 35,
    label: 'State 2: Unsafe',
    type: 'rect-rounded',
    borderColor: '#ef4444',
    bgColor: '#fef2f2',
    textColor: '#991b1b',
    fontSize: 12,
  },

  // ── Detection sub-branches ─────────────────
  {
    id: 'detection-strategy',
    x: 1650, y: 730,
    width: 140, height: 40,
    label: 'Strategi',
    type: 'rect-rounded',
    borderColor: '#059669',
    bgColor: '#ecfdf5',
    textColor: '#065f46',
    fontSize: 13,
  },
];

export const mindmapEdges: MindMapEdge[] = [
  // Proses cycle
  { id: 'e-proses-request', from: 'proses', to: 'request-resource', style: 'dashed', color: '#3b82f6' },
  { id: 'e-request-gunakan', from: 'request-resource', to: 'gunakan-resource', style: 'dashed', color: '#3b82f6' },
  { id: 'e-gunakan-lepas', from: 'gunakan-resource', to: 'lepas-resource', style: 'dashed', color: '#3b82f6' },
  { id: 'e-lepas-request', from: 'lepas-resource', to: 'request-resource', style: 'dashed', color: '#3b82f6' },

  // Proses → Deadlock
  { id: 'e-proses-deadlock', from: 'proses', to: 'deadlock', style: 'dashed', color: '#ef4444',
    label: 'Apabila beberapa proses saling terblokir\nkarena menunggu ketersediaan resource...',
    labelColor: '#ef4444' },

  // Deadlock → RAG
  { id: 'e-deadlock-rag', from: 'deadlock', to: 'rag', style: 'dashed', color: '#000' },

  // Deadlock → Kondisi
  { id: 'e-deadlock-kondisi', from: 'deadlock', to: 'kondisi-deadlock', style: 'dashed', color: '#000' },

  // Deadlock → Metode
  { id: 'e-deadlock-metode', from: 'deadlock', to: 'metode-penanganan', style: 'dashed', color: '#000' },

  // Kondisi → 4 conditions
  { id: 'e-kondisi-me', from: 'kondisi-deadlock', to: 'mutual-exclusion', style: 'dashed', color: '#3b82f6' },
  { id: 'e-kondisi-hw', from: 'kondisi-deadlock', to: 'hold-and-wait', style: 'dashed', color: '#f97316' },
  { id: 'e-kondisi-np', from: 'kondisi-deadlock', to: 'no-preemption', style: 'dashed', color: '#ef4444' },
  { id: 'e-kondisi-cw', from: 'kondisi-deadlock', to: 'circular-wait', style: 'dashed', color: '#8b5cf6' },

  // Metode → 3 methods
  { id: 'e-metode-prev', from: 'metode-penanganan', to: 'prevention', style: 'dashed', color: '#d97706' },
  { id: 'e-metode-avoid', from: 'metode-penanganan', to: 'avoidance', style: 'dashed', color: '#7c3aed' },
  { id: 'e-metode-detect', from: 'metode-penanganan', to: 'detection', style: 'dashed', color: '#059669' },

  // Prevention sub
  { id: 'e-prev-indirect', from: 'prevention', to: 'indirect', style: 'dashed', color: '#d97706' },
  { id: 'e-prev-direct', from: 'prevention', to: 'direct', style: 'dashed', color: '#d97706' },

  // Indirect → conditions
  { id: 'e-ind-me', from: 'indirect', to: 'prev-mutual', style: 'dashed', color: '#16a34a' },
  { id: 'e-ind-hw', from: 'indirect', to: 'prev-hold', style: 'dashed', color: '#f97316' },
  { id: 'e-ind-np', from: 'indirect', to: 'prev-nopre', style: 'dashed', color: '#ef4444' },

  // Direct → Circular Wait
  { id: 'e-dir-cw', from: 'direct', to: 'prev-circular', style: 'dashed', color: '#8b5cf6' },

  // Avoidance sub
  { id: 'e-avoid-pid', from: 'avoidance', to: 'pid', style: 'dashed', color: '#2563eb' },
  { id: 'e-avoid-rad', from: 'avoidance', to: 'rad', style: 'dashed', color: '#2563eb' },

  // RAD → Banker's
  { id: 'e-rad-bankers', from: 'rad', to: 'bankers', style: 'dashed', color: '#7c3aed' },

  // Banker's → States
  { id: 'e-bankers-safe', from: 'bankers', to: 'state-safe', style: 'dashed', color: '#16a34a' },
  { id: 'e-bankers-unsafe', from: 'bankers', to: 'state-unsafe', style: 'dashed', color: '#ef4444' },

  // Detection sub
  { id: 'e-detect-strategy', from: 'detection', to: 'detection-strategy', style: 'dashed', color: '#059669' },
];

// ── Detailed descriptions for each node (shown on click/hover) ──
export const nodeDescriptions: Record<string, string[]> = {
  'rag': [
    'Grafik berarah yang menggambarkan status resource dan proses.',
    'Resource (kotak) → Proses (lingkaran): Assignment edge',
    'Proses → Resource: Request edge',
  ],
  'mutual-exclusion': [
    '1 resource hanya boleh dipakai oleh sebuah proses pada 1 waktu.',
    'Contoh: R1 assigned to P1, P2 wants R1 → R1 cannot be shared.',
  ],
  'hold-and-wait': [
    'Process dapat menggunakan suatu resource sambil menunggu resource yang lain dilepas.',
    'Contoh: P1 holds R1 & R2, waiting for R3 yang dipegang P2.',
  ],
  'no-preemption': [
    'Resource yang sedang digunakan oleh suatu process tidak bisa direbut.',
    'OS cannot interrupt — tanda silang merah (X).',
  ],
  'circular-wait': [
    'Setiap proses memegang setidaknya satu resource yang dibutuhkan oleh proses selanjutnya.',
    'Contoh: P1→R2→P2→R1→P1 (siklus melingkar).',
  ],
  'prevention': [
    'Dilakukan saat perancangan proses.',
    'Mengusahakan agar salah satu dari kondisi deadlock dihilangkan.',
  ],
  'indirect': [
    'Mengusahakan agar salah satu dari tiga kondisi berikut dihilangkan:',
    '1. Mutual Exclusion, 2. Hold and Wait, 3. No Preemption',
  ],
  'direct': [
    'Menghilangkan kondisi Circular Wait.',
    'Memberikan indeks terurut kepada setiap resource; proses harus menggunakan resource dengan indeks terkecil dahulu.',
  ],
  'prev-mutual': [
    'Tidak bisa dihilangkan jika resource bersifat protected;',
    'hanya dapat dikelola oleh OS itu sendiri.',
  ],
  'prev-hold': [
    'Memblokir setiap proses yang resourcenya belum lengkap;',
    'hanya memperbolehkan eksekusi proses jika sudah dapat semua resourcenya.',
  ],
  'prev-nopre': [
    'Tetap tidak boleh disela; jika proses sudah memiliki resource tapi masih butuh resource lain, harus lepas resource yang sudah dimiliki.',
    'Boleh disela oleh OS; proses running bisa di-stop agar melepas resource. *hanya jika prioritas setiap prosesnya berbeda.',
  ],
  'prev-circular': [
    'Memberikan indeks terurut kepada setiap resource;',
    'proses harus menggunakan resource dengan indeks terkecil dahulu.',
  ],
  'avoidance': [
    'Dilakukan saat eksekusi proses.',
    'Menggunakan informasi tambahan untuk menghindari deadlock.',
  ],
  'pid': [
    'Process Initiation Denial — Ketika ada proses baru.',
    'Rumus: Rⱼ ≥ C₍ₙ₊₁₎ⱼ + Σ Cᵢⱼ untuk semua j',
    'Cek apakah total resource mencukupi jika proses baru ditambahkan.',
  ],
  'rad': [
    'Resource Allocation Denial — Ketika suatu proses membutuhkan resource tambahan.',
    "Menggunakan Banker's Algorithm.",
  ],
  'bankers': [
    "Banker's Algorithm memeriksa apakah state SAFE atau UNSAFE.",
    'Istilah: A=Allocation, C=Max Demand, C-A=Still Needs, R=Initial Available, V=Available',
    'Ketika Request: 1) Request≤Needs, 2) Request≤Available, 3) Update matrices.',
  ],
  'state-safe': [
    'Seluruh proses dapat dieksekusi hingga selesai.',
  ],
  'state-unsafe': [
    'Terdapat satu proses atau lebih yang tidak dapat dieksekusi.',
  ],
  'detection': [
    'Dilakukan saat eksekusi proses.',
    'Setiap proses dapat terus melakukan request resource selama tersedia.',
    'OS melakukan pengecekan secara rutin untuk mendeteksi terjadinya deadlock.',
  ],
  'detection-strategy': [
    'Strategi: Cari proses dengan resource request (Q) ≤ jumlah resource available (W).',
    'Istilah: A=Allocation, Q=Request, R=Resource Vector, W=Available',
    'Proses yang unmarked → terjadi deadlock.',
  ],
  'kondisi-deadlock': [
    'Keempat kondisi ini HARUS terpenuhi secara bersamaan agar deadlock terjadi.',
    'Kondisi 1-3 mungkin menyebabkan deadlock, mungkin tidak.',
    'Kondisi 4 (Circular Wait) yang menjamin terjadinya deadlock.',
  ],
};

// ── RAG Diagram data ─────────────────────────────────────────
export interface RAGElement {
  type: 'resource' | 'process';
  id: string;
  label: string;
  x: number;
  y: number;
  instances?: number; // for resources
}

export interface RAGArrow {
  from: string;
  to: string;
  label: string;
  style: 'request' | 'assignment';
}

export const ragDiagram = {
  elements: [
    { type: 'resource' as const, id: 'r1', label: 'R1', x: 50, y: 30, instances: 1 },
    { type: 'process' as const, id: 'p1', label: 'P1', x: 180, y: 30 },
    { type: 'resource' as const, id: 'r2', label: 'R2', x: 310, y: 30, instances: 2 },
  ],
  arrows: [
    { from: 'p1', to: 'r1', label: 'R1 is requested by P1\nP1 wants R1', style: 'request' as const },
    { from: 'r2', to: 'p1', label: 'R2 is assigned to P1\nP1 holds 1 instance of R2', style: 'assignment' as const },
  ],
};
