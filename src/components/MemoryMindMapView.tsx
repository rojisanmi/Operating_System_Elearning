import React from 'react';

export const MemoryMindMapView: React.FC = () => {
  // Canvas width & height displaying both diagrams side-by-side
  const canvasWidth = 3700;
  const canvasHeight = 1200;

  return (
    <div className="relative select-none" style={{ width: canvasWidth, height: canvasHeight }}>
      {/* ══════════════════════════════════════════════════════════════
          DIAGRAM 1: MANAJEMEN MEMORI (PAGING & SEGMENTASI)
          (100% REPLIKA mindmap_manajemen_memori.png)
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute"
        style={{
          left: 0,
          top: 60,
            width: 1800,
            height: 1050,
          }}
        >
          {/* SVG Connector lines for Diagram 1 */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={1800}
            height={1050}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker id="arr-green" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7" fill="#16a34a" />
              </marker>
              <marker id="arr-gray" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7" fill="#64748b" />
              </marker>
              <marker id="arr-amber" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7" fill="#d97706" />
              </marker>
            </defs>

            {/* Root -> Paging Sederhana (green curve) */}
            <path
              d="M 850 65 C 850 120, 350 120, 350 160"
              fill="none"
              stroke="#16a34a"
              strokeWidth={3}
            />

            {/* Root -> Segmentasi Sederhana (yellow curve) */}
            <path
              d="M 950 65 C 950 120, 1290 120, 1290 160"
              fill="none"
              stroke="#eab308"
              strokeWidth={3}
            />

            {/* Dashed connector between Paging & Segmentasi */}
            <line
              x1="450"
              y1="180"
              x2="1200"
              y2="180"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="6,6"
            />

            {/* ── Left side (Paging) SVG connections ── */}
            {/* CPU to Menghasilkan arrow */}
            <path
              d="M 205 315 L 205 355 L 255 355"
              fill="none"
              stroke="#64748b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* No. Page straight down to Page Table */}
            <line
              x1="325"
              y1="412"
              x2="325"
              y2="475"
              stroke="#1e293b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Page Table down to No. Frame */}
            <line
              x1="325"
              y1="595"
              x2="325"
              y2="650"
              stroke="#1e293b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Offset straight down to Alamat Fisik Offset */}
            <line
              x1="465"
              y1="412"
              x2="465"
              y2="650"
              stroke="#64748b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* ── Right side (Segmentasi) SVG connections ── */}
            {/* Curly bracket over Alamat Logika box: (1070, 335) to (1350, 335) */}
            <path
              d="M 1070 335 C 1070 315, 1205 325, 1210 295 C 1215 325, 1350 315, 1350 335"
              fill="none"
              stroke="#475569"
              strokeWidth={1.5}
            />

            {/* Dashed curved arrow from No. Segmen to Banyaknya segment = 2^x */}
            <path
              d="M 1115 375 C 1115 440, 1060 445, 1010 445"
              fill="none"
              stroke="#64748b"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              markerEnd="url(#arr-gray)"
            />

            {/* No. Segmen straight down to Segment Table */}
            <line
              x1="1115"
              y1="375"
              x2="1115"
              y2="495"
              stroke="#1e293b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Segment Table right to Length box */}
            <line
              x1="1160"
              y1="550"
              x2="1210"
              y2="550"
              stroke="#1e293b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Upper Offset curve down into comparison Offset box */}
            <path
              d="M 1255 375 C 1255 450, 1460 460, 1460 535"
              fill="none"
              stroke="#64748b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Length >= Offset validation branch down to Base */}
            <path
              d="M 1375 565 C 1375 640, 1240 670, 1160 670"
              fill="none"
              stroke="#64748b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Segment Table straight down to Base */}
            <line
              x1="1115"
              y1="615"
              x2="1115"
              y2="655"
              stroke="#1e293b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />

            {/* Upper Offset curve down into lower Offset box */}
            <path
              d="M 1460 570 C 1460 680, 1300 725, 1160 725"
              fill="none"
              stroke="#64748b"
              strokeWidth={2}
              markerEnd="url(#arr-gray)"
            />
          </svg>

          {/* ── ROOT NODE ── */}
          <div
            className="absolute rounded-full border-2 border-black bg-white flex items-center justify-center font-bold text-gray-900 shadow-sm"
            style={{ left: 780, top: 20, width: 240, height: 50, fontSize: 16 }}
          >
            Manajemen Memori
          </div>

          {/* Dashed line caption */}
          <div
            className="absolute text-center text-xs text-gray-600 font-medium leading-tight"
            style={{ left: 680, top: 155, width: 340 }}
          >
            Memecah proses menjadi bagian-bagian kecil yang disimpan secara terpisah dan mungkin tidak berurut
          </div>

          {/* ── LEFT BRANCH: PAGING SEDERHANA ── */}
          <div
            className="absolute rounded-md border-2 border-black bg-white flex items-center justify-center font-bold text-gray-900 text-sm shadow-sm"
            style={{ left: 260, top: 158, width: 180, height: 42 }}
          >
            Paging Sederhana
          </div>

          {/* CPU Box */}
          <div
            className="absolute rounded-md border-2 border-orange-400 bg-white flex items-center justify-center font-bold text-gray-900 text-sm shadow-xs"
            style={{ left: 160, top: 265, width: 90, height: 50 }}
          >
            CPU
          </div>

          {/* 1. Informasi Memori -> Pengalamatan Bit */}
          <div className="absolute text-xs font-bold text-emerald-700" style={{ left: 275, top: 282 }}>
            1. Informasi Memori -&gt; Pengalamatan Bit
          </div>

          {/* Label Menghasilkan */}
          <div className="absolute text-[11px] text-gray-600 font-semibold" style={{ left: 120, top: 348 }}>
            Menghasilkan
          </div>

          {/* 2. Merubah Alamat Logika dari Desimal Menjadi Biner */}
          <div
            className="absolute text-[11px] font-bold text-emerald-700 leading-tight"
            style={{ left: 5, top: 375, width: 170 }}
          >
            2. Merubah Alamat Logika dari Desimal Menjadi Biner
          </div>

          <div className="absolute text-xs font-semibold text-gray-700" style={{ left: 180, top: 388 }}>
            Alamat Logika =
          </div>

          {/* 3. Cari Panjang Bit No. Page dan Panjang Bit Offset */}
          <div
            className="absolute text-xs font-bold text-emerald-700 text-center"
            style={{ left: 260, top: 342, width: 280 }}
          >
            3. Cari Panjang Bit No. Page dan Panjang Bit Offset
          </div>

          {/* Alamat Logika Split Box (Paging) */}
          <div className="absolute flex" style={{ left: 280, top: 380, width: 280, height: 32 }}>
            <div className="w-[90px] h-full border border-blue-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800">
              No. Page
            </div>
            <div className="w-[190px] h-full border border-red-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800">
              Offset / Ukuran Page
            </div>
          </div>

          {/* 4. Memisahkan Alamat Logika */}
          <div
            className="absolute text-xs font-bold text-emerald-700 leading-tight"
            style={{ left: 580, top: 378, width: 200 }}
          >
            4. Memisahkan Alamat Logika dalam bentuk biner ke No. Page + Offset
          </div>

          {/* 5. Cari No. Frame Sesuai dengan No. Page */}
          <div
            className="absolute text-xs font-bold text-emerald-700 leading-tight text-right"
            style={{ left: 80, top: 510, width: 180 }}
          >
            5. Cari No. Frame Sesuai dengan No. Page yang tersedia pada tabel
          </div>

          {/* Page Table Box */}
          <div
            className="absolute border border-blue-500 bg-white flex items-center justify-center font-bold text-gray-800 text-xs shadow-xs"
            style={{ left: 280, top: 475, width: 90, height: 120 }}
          >
            Page Table
          </div>

          {/* Alamat Fisik label */}
          <div className="absolute text-xs font-semibold text-gray-700" style={{ left: 190, top: 658 }}>
            Alamat Fisik =
          </div>

          {/* Alamat Fisik Split Box (Paging) */}
          <div className="absolute flex" style={{ left: 280, top: 650, width: 280, height: 32 }}>
            <div className="w-[90px] h-full border border-green-600 bg-white flex items-center justify-center text-xs font-bold text-gray-800">
              No. Frame
            </div>
            <div className="w-[190px] h-full border border-red-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800">
              Offset / Ukuran Page
            </div>
          </div>

          {/* 6. Replace No. Page dengan No. Frame */}
          <div
            className="absolute text-xs font-bold text-emerald-700 text-center leading-tight"
            style={{ left: 260, top: 695, width: 320 }}
          >
            6. Replace No. Page dengan No. Frame lalu tambahkan Offset yg sudah ada
          </div>

          {/* ── RIGHT BRANCH: SEGMENTASI SEDERHANA ── */}
          <div
            className="absolute rounded-md border-2 border-amber-400 bg-white flex items-center justify-center font-bold text-gray-900 text-sm shadow-sm"
            style={{ left: 1200, top: 158, width: 180, height: 42 }}
          >
            Segmentasi Sederhana
          </div>

          {/* 1. Pengalamatan Bit = Panjang Bit Base */}
          <div className="absolute text-xs font-bold text-amber-700" style={{ left: 1110, top: 268 }}>
            1. Pengalamatan Bit = Panjang Bit Base
          </div>

          {/* 3. Cari Panjang Bit Segment dan Panjang Bit Offset */}
          <div
            className="absolute text-xs font-bold text-amber-700 leading-tight"
            style={{ left: 1410, top: 250, width: 220 }}
          >
            3. Cari Panjang Bit Segment dan Panjang Bit Offset
            <br />
            <span className="font-semibold text-amber-600">Panjang Bit Offset = Panjang Bit Length</span>
          </div>

          {/* 2. Merubah Alamat Logika dari Desimal Menjadi Biner */}
          <div
            className="absolute text-[11px] font-bold text-amber-700 leading-tight text-right"
            style={{ left: 870, top: 295, width: 180 }}
          >
            2. Merubah Alamat Logika dari Desimal Menjadi Biner
          </div>

          <div className="absolute text-xs font-semibold text-gray-700" style={{ left: 960, top: 348 }}>
            Alamat Logika =
          </div>

          {/* Alamat Logika Split Box (Segmentasi) */}
          <div className="absolute flex" style={{ left: 1070, top: 340, width: 280, height: 32 }}>
            <div className="w-[90px] h-full border border-blue-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800">
              No. Segmen
            </div>
            <div className="w-[190px] h-full border border-red-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800">
              Offset
            </div>
          </div>

          {/* 4. Pisahin Alamat Logika */}
          <div
            className="absolute text-xs font-bold text-amber-700 leading-tight"
            style={{ left: 1370, top: 338, width: 200 }}
          >
            4. Pisahin Alamat Logika dalam bentuk biner sesuai panjang bit Segment + Offset
          </div>

          {/* Banyaknya segment = 2^x */}
          <div
            className="absolute text-xs font-bold text-gray-700 leading-tight"
            style={{ left: 880, top: 435, width: 170 }}
          >
            Banyaknya segment = 2^x
            <br />
            <span className="text-gray-500 font-medium">x = panjang bit segment</span>
          </div>

          {/* 4. Cari Length Berdasarkan No. Segment */}
          <div
            className="absolute text-xs font-bold text-amber-700 leading-tight text-right"
            style={{ left: 880, top: 535, width: 170 }}
          >
            4. Cari Length Berdasarkan No. Segment yang didapatkan
          </div>

          {/* Segment Table Box */}
          <div
            className="absolute border border-blue-500 bg-white flex items-center justify-center font-bold text-gray-800 text-xs shadow-xs"
            style={{ left: 1070, top: 495, width: 90, height: 120 }}
          >
            Segment Table
          </div>

          {/* Length Box */}
          <div
            className="absolute border border-amber-400 bg-white flex items-center justify-center text-xs font-bold text-gray-800"
            style={{ left: 1210, top: 535, width: 150, height: 30 }}
          >
            Length
          </div>

          {/* Comparison >= */}
          <div className="absolute text-base font-black text-gray-700" style={{ left: 1370, top: 540 }}>
            ≥
          </div>

          {/* Offset Box (Comparison) */}
          <div
            className="absolute border border-red-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800"
            style={{ left: 1395, top: 535, width: 140, height: 30 }}
          >
            Offset
          </div>

          {/* 5. Jika Panjang Length Lebih Besar dari Offset */}
          <div
            className="absolute text-xs font-bold text-amber-700 leading-tight"
            style={{ left: 1555, top: 520, width: 200 }}
          >
            5. Jika Panjang Length Lebih Besar dari Offset maka Segmen tersebut adalah valid dan dapat dihitung alamat fisiknya
          </div>

          {/* Label: Jika Valid Maka */}
          <div className="absolute text-[11px] font-bold text-gray-600" style={{ left: 1240, top: 650 }}>
            Jika Valid Maka
          </div>

          {/* 6. Tambahkan Base pada No. Segmen */}
          <div
            className="absolute text-xs font-bold text-amber-700 leading-tight text-right"
            style={{ left: 880, top: 660, width: 170 }}
          >
            6. Tambahkan Base pada No. Segmen awal dengan offset alamat logika
          </div>

          {/* Base box */}
          <div
            className="absolute border border-blue-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800"
            style={{ left: 1070, top: 655, width: 90, height: 28 }}
          >
            Base
          </div>

          <div className="absolute font-bold text-gray-800 text-sm" style={{ left: 1110, top: 686 }}>
            +
          </div>

          {/* Offset box (Calculation) */}
          <div
            className="absolute border border-red-500 bg-white flex items-center justify-center text-xs font-bold text-gray-800"
            style={{ left: 1070, top: 710, width: 90, height: 28 }}
          >
            Offset
          </div>

          <div className="absolute font-bold text-gray-800 text-sm" style={{ left: 1110, top: 742 }}>
            =
          </div>

          {/* Alamat Fisik box */}
          <div
            className="absolute border border-amber-400 bg-white flex items-center justify-center text-xs font-bold text-gray-800"
            style={{ left: 1060, top: 765, width: 110, height: 28 }}
          >
            Alamat Fisik
          </div>
        </div>

      {/* ══════════════════════════════════════════════════════════════
          DIAGRAM 2: VIRTUAL MEMORI
          (100% REPLIKA mindmap_virtual_memori.png)
          ══════════════════════════════════════════════════════════════ */}
      <div
        className="absolute"
        style={{
          left: 1880,
          top: 60,
          width: 1800,
          height: 1100,
        }}
      >
          {/* SVG Connector lines for Virtual Memory */}
          <svg
            className="absolute inset-0 pointer-events-none"
            width={1800}
            height={1100}
            style={{ overflow: 'visible' }}
          >
            <defs>
              <marker id="vm-arr-purple" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7" fill="#7c3aed" />
              </marker>
              <marker id="vm-arr-orange" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                <path d="M0,0 L6,3.5 L0,7" fill="#ea580c" />
              </marker>
            </defs>

            {/* Root -> Fetch Policy (brown curve) */}
            <path
              d="M 330 65 C 330 140, 150 140, 150 220"
              fill="none"
              stroke="#b45309"
              strokeWidth={2.5}
            />

            {/* Root -> Placement Policy (yellow curve) */}
            <path
              d="M 410 65 C 410 140, 410 140, 410 220"
              fill="none"
              stroke="#eab308"
              strokeWidth={2.5}
            />

            {/* Root -> Replacement Policy (blue curve) */}
            <path
              d="M 480 65 C 480 140, 690 140, 690 220"
              fill="none"
              stroke="#2563eb"
              strokeWidth={2.5}
            />

            {/* Replacement Policy dashed right connector */}
            <line
              x1="780"
              y1="240"
              x2="850"
              y2="240"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />

            {/* Dashed connector from Replacement Definition to Istilah Box */}
            <line
              x1="1080"
              y1="248"
              x2="1280"
              y2="248"
              stroke="#94a3b8"
              strokeWidth={1.5}
              strokeDasharray="4,4"
            />

            {/* ── 4 branches fanning down from Replacement Policy ── */}
            {/* 1. to Optimal */}
            <path
              d="M 690 260 C 690 350, 325 350, 325 435"
              fill="none"
              stroke="#16a34a"
              strokeWidth={2}
            />
            {/* 2. to LRU */}
            <path
              d="M 690 260 C 690 350, 560 350, 560 435"
              fill="none"
              stroke="#ea580c"
              strokeWidth={2}
            />
            {/* 3. to FIFO */}
            <path
              d="M 690 260 C 690 350, 800 350, 800 435"
              fill="none"
              stroke="#dc2626"
              strokeWidth={2}
            />
            {/* 4. to Clock Policy */}
            <path
              d="M 690 260 C 690 350, 1045 350, 1045 435"
              fill="none"
              stroke="#7c3aed"
              strokeWidth={2}
            />

            {/* Dashed connectors under Optimal */}
            <line x1="325" y1="477" x2="325" y2="505" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1="325" y1="565" x2="325" y2="595" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1="325" y1="620" x2="325" y2="650" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1="325" y1="755" x2="325" y2="785" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />

            {/* Dashed connectors under LRU */}
            <line x1="560" y1="477" x2="560" y2="505" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1="560" y1="550" x2="560" y2="580" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1="560" y1="605" x2="560" y2="625" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />

            {/* Dashed connectors under FIFO */}
            <line x1="800" y1="477" x2="800" y2="505" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />
            <line x1="800" y1="550" x2="800" y2="580" stroke="#94a3b8" strokeWidth={1.5} strokeDasharray="3,3" />

            {/* Dashed line from Clock Policy to step 1 */}
            <line
              x1="1120"
              y1="456"
              x2="1190"
              y2="456"
              stroke="#7c3aed"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              markerEnd="url(#vm-arr-purple)"
            />

            {/* Clock Step 1 to Step 2 */}
            <line
              x1="1285"
              y1="488"
              x2="1285"
              y2="515"
              stroke="#7c3aed"
              strokeWidth={1.5}
              markerEnd="url(#vm-arr-purple)"
            />

            {/* Clock Step 2 to Step 3 */}
            <line
              x1="1285"
              y1="580"
              x2="1285"
              y2="605"
              stroke="#7c3aed"
              strokeWidth={1.5}
              markerEnd="url(#vm-arr-purple)"
            />

            {/* Clock Step 3 dashed line right to Step 4 */}
            <line
              x1="1380"
              y1="622"
              x2="1420"
              y2="622"
              stroke="#ea580c"
              strokeWidth={1.5}
              strokeDasharray="4,4"
              markerEnd="url(#vm-arr-orange)"
            />

            {/* Clock Step 4 down to Step 5 */}
            <line
              x1="1530"
              y1="650"
              x2="1530"
              y2="685"
              stroke="#ea580c"
              strokeWidth={1.5}
              markerEnd="url(#vm-arr-orange)"
            />
          </svg>

          {/* ── ROOT NODE ── */}
          <div
            className="absolute rounded-full border-2 border-black bg-white flex items-center justify-center font-bold text-gray-900 shadow-sm"
            style={{ left: 300, top: 20, width: 220, height: 50, fontSize: 16 }}
          >
            Virtual Memori
          </div>

          {/* ── 3 MAIN POLICIES ── */}
          {/* 1. Fetch Policy */}
          <div
            className="absolute rounded-md border-2 border-amber-900 bg-white flex items-center justify-center font-bold text-gray-900 text-sm shadow-xs"
            style={{ left: 60, top: 220, width: 180, height: 42 }}
          >
            Fetch Policy
          </div>

          {/* 2. Placement Policy */}
          <div
            className="absolute rounded-md border-2 border-amber-400 bg-white flex items-center justify-center font-bold text-gray-900 text-sm shadow-xs"
            style={{ left: 320, top: 220, width: 180, height: 42 }}
          >
            Placement Policy
          </div>

          {/* 3. Replacement Policy */}
          <div
            className="absolute rounded-md border-2 border-blue-500 bg-white flex items-center justify-center font-bold text-gray-900 text-sm shadow-xs"
            style={{ left: 600, top: 220, width: 180, height: 42 }}
          >
            Replacement Policy
          </div>

          {/* Replacement Policy Definition */}
          <div
            className="absolute text-xs text-gray-600 font-medium leading-tight"
            style={{ left: 860, top: 232, width: 220 }}
          >
            Memilih page mana yang bisa ditimpa / digantikan dengan page lain atau harus dikeluarkan dari memori
          </div>

          {/* ── TOP-RIGHT: PAGE FRAME GRID & ISTILAH (REPLIKA PERSIS LAMPIRAN) ── */}
          <div className="absolute" style={{ left: 1140, top: 20, width: 620, height: 380 }}>
            {/* Dedicated SVG for brackets & arrows */}
            <svg
              className="absolute inset-0 pointer-events-none"
              width={620}
              height={380}
              style={{ overflow: 'visible' }}
            >
              <defs>
                <marker id="tr-arr-orange-down" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L6,3.5 L0,7" fill="#ea580c" />
                </marker>
                <marker id="tr-arr-orange-right" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L6,3.5 L0,7" fill="#ea580c" />
                </marker>
                <marker id="tr-arr-gray-up" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto">
                  <path d="M0,0 L6,3.5 L0,7" fill="#94a3b8" />
                </marker>
              </defs>

              {/* 3 Arched orange dashed arrows over numbers */}
              <path
                d="M 95 10 C 115 -2, 155 -2, 171 20"
                fill="none"
                stroke="#ea580c"
                strokeWidth={1.5}
                strokeDasharray="3,3"
                markerEnd="url(#tr-arr-orange-down)"
              />
              <path
                d="M 110 7 C 135 -5, 178 -5, 193 20"
                fill="none"
                stroke="#ea580c"
                strokeWidth={1.5}
                strokeDasharray="3,3"
                markerEnd="url(#tr-arr-orange-down)"
              />
              <path
                d="M 125 4 C 155 -8, 200 -8, 215 20"
                fill="none"
                stroke="#ea580c"
                strokeWidth={1.5}
                strokeDasharray="3,3"
                markerEnd="url(#tr-arr-orange-down)"
              />

              {/* Inner Bracket: 1 page frame (spans row 1: y=48 to 70) */}
              <line x1="155" y1="48" x2="148" y2="48" stroke="#000" strokeWidth={1.5} />
              <line x1="148" y1="48" x2="148" y2="70" stroke="#000" strokeWidth={1.5} />
              <line x1="148" y1="70" x2="155" y2="70" stroke="#000" strokeWidth={1.5} />

              {/* Outer Bracket: 3 page frame (spans rows 1-3: y=48 to 114) */}
              <line x1="67" y1="48" x2="60" y2="48" stroke="#000" strokeWidth={1.5} />
              <line x1="60" y1="48" x2="60" y2="114" stroke="#000" strokeWidth={1.5} />
              <line x1="60" y1="114" x2="67" y2="114" stroke="#000" strokeWidth={1.5} />

              {/* Curved orange dashed arrow from 3 page frame bracket down-right to note */}
              <path
                d="M 60 114 C 60 142, 90 148, 130 148"
                fill="none"
                stroke="#ea580c"
                strokeWidth={1.5}
                strokeDasharray="4,4"
                markerEnd="url(#tr-arr-orange-right)"
              />

              {/* Vertical dashed gray arrow pointing UP from Istilah box to bullet note */}
              <line
                x1="285"
                y1="182"
                x2="285"
                y2="162"
                stroke="#94a3b8"
                strokeWidth={1.5}
                strokeDasharray="4,4"
                markerEnd="url(#tr-arr-gray-up)"
              />
            </svg>

            {/* Header: Urutan Page Masuk (tulis di luar tabel) in Orange */}
            <div
              className="absolute text-right leading-tight select-none"
              style={{ left: 0, top: 14, width: 150 }}
            >
              <div className="text-xs font-bold text-orange-600">Urutan Page Masuk</div>
              <div className="text-[10.5px] text-orange-500 font-medium">(tulis di luar tabel)</div>
            </div>

            {/* Stream numbers above grid */}
            <div
              className="absolute flex items-center font-mono font-bold text-sm text-gray-800 select-none"
              style={{ left: 160, top: 26 }}
            >
              <span className="w-[22px] text-center">2</span>
              <span className="w-[22px] text-center">3</span>
              <span className="w-[22px] text-center">2</span>
              <span className="ml-2 font-sans font-normal text-xs text-gray-600">dst.</span>
            </div>

            {/* Label: 1 page frame */}
            <div
              className="absolute text-[11px] font-medium text-gray-800 text-right select-none"
              style={{ left: 65, top: 51, width: 78 }}
            >
              1 page frame
            </div>

            {/* Label: 3 page frame */}
            <div
              className="absolute text-[11px] font-medium text-gray-800 text-right select-none"
              style={{ left: -22, top: 72, width: 77 }}
            >
              3 page frame
            </div>

            {/* The 3 x 16 Grid Table with crisp black borders */}
            <table
              className="absolute border-collapse bg-white"
              style={{ left: 160, top: 48 }}
            >
              <tbody>
                {[0, 1, 2].map((r) => (
                  <tr key={r}>
                    {Array.from({ length: 16 }).map((_, c) => (
                      <td
                        key={c}
                        className="border border-black bg-white"
                        style={{ width: 22, height: 22, minWidth: 22, maxWidth: 22 }}
                      />
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Bullet note: jumlah page frame mungkin lebih dari contoh di atas */}
            <div
              className="absolute text-[11px] text-gray-800 leading-snug font-normal select-none"
              style={{ left: 140, top: 136, width: 440 }}
            >
              • jumlah page frame mungkin lebih dari contoh di atas,
              <br />
              &nbsp;&nbsp;perhatikan apa yg disebutkan di soal :-)
            </div>

            {/* Istilah Box with light purple / lavender border */}
            <div
              className="absolute border border-purple-300 rounded-sm bg-white p-3 shadow-xs select-none"
              style={{ left: 140, top: 182, width: 330 }}
            >
              <div className="text-xs font-bold text-gray-900 mb-1">Istilah:</div>
              <div className="text-[11px] text-gray-800 space-y-1 font-normal leading-snug">
                <div>- <b>Page Address Stream</b> = urutan page yang masuk</div>
                <div>- <b>Page Frame</b> = tempat page disimpan</div>
                <div>- <b>Fault</b> = ketika terjadi penggantian page</div>
                <div>- <b>Fault Ratio</b> = rasio terjadinya fault</div>
                <div>- <b>Hit Ratio</b> = Page Address Stream - Fault</div>
              </div>
            </div>
          </div>

          {/* ── 4 REPLACEMENT ALGORITHMS ── */}

          {/* 1. OPTIMAL */}
          <div
            className="absolute rounded-md border-2 border-green-600 bg-white flex items-center justify-center font-bold text-gray-900 text-xs shadow-xs"
            style={{ left: 250, top: 435, width: 150, height: 42 }}
          >
            Optimal
          </div>
          <div
            className="absolute text-[11px] text-gray-700 font-medium text-center leading-tight"
            style={{ left: 230, top: 505, width: 190 }}
          >
            Mereplace page yang mungkin ga akan dipake lagi
            <br />
            <span className="font-bold">OR</span>
            <br />
            dipake lagi tapi masih lama
          </div>
          <div
            className="absolute text-xs font-black text-emerald-800 text-center"
            style={{ left: 260, top: 600, width: 130 }}
          >
            Cek ke KANAN
          </div>
          {/* Optimal Box */}
          <div
            className="absolute border border-gray-300 bg-white rounded-md p-2.5 text-xs flex flex-col justify-center space-y-2 shadow-xs"
            style={{ left: 245, top: 650, width: 160, height: 105 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-black text-sm">✓</span>
              <span className="text-[11px] text-gray-800 leading-tight">Page fault paling sedikit</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-black text-sm">✗</span>
              <span className="text-[11px] text-gray-800 leading-tight">Tidak mungkin diimplementasikan</span>
            </div>
          </div>
          <div
            className="absolute text-[11px] text-gray-600 text-center"
            style={{ left: 245, top: 785, width: 160 }}
          >
            Hanya digunakan sebagai <span className="font-bold text-emerald-700 underline">acuan</span>
          </div>

          {/* 2. LEAST RECENTLY USED (LRU) */}
          <div
            className="absolute rounded-md border-2 border-orange-400 bg-white flex items-center justify-center font-bold text-gray-900 text-xs shadow-xs"
            style={{ left: 475, top: 435, width: 170, height: 42 }}
          >
            Least Recently used (LRU)
          </div>
          <div
            className="absolute text-[11px] text-gray-700 font-medium text-center leading-tight"
            style={{ left: 465, top: 505, width: 190 }}
          >
            Mereplace page yang paling lama <span className="font-bold text-gray-900">tidak dipakai</span>
          </div>
          <div
            className="absolute text-xs font-black text-orange-700 text-center"
            style={{ left: 495, top: 580, width: 130 }}
          >
            Cek ke KIRI
          </div>
          {/* LRU Box */}
          <div
            className="absolute border border-gray-300 bg-white rounded-md p-2.5 text-xs flex flex-col justify-center space-y-2 shadow-xs"
            style={{ left: 470, top: 625, width: 180, height: 130 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-black text-sm">✓</span>
              <span className="text-[11px] text-gray-800 leading-tight">Performa hampir sama dengan optimal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-black text-sm">✗</span>
              <span className="text-[11px] text-gray-800 leading-tight">Sulit diimplementasikan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-black text-sm">✗</span>
              <span className="text-[11px] text-gray-800 leading-tight">Overhead tinggi</span>
            </div>
          </div>

          {/* 3. FIRST-IN-FIRST-OUT (FIFO) */}
          <div
            className="absolute rounded-md border-2 border-red-500 bg-white flex items-center justify-center font-bold text-gray-900 text-xs shadow-xs"
            style={{ left: 715, top: 435, width: 170, height: 42 }}
          >
            First-In-First-Out (FIFO)
          </div>
          <div
            className="absolute text-[11px] text-gray-700 font-medium text-center leading-tight"
            style={{ left: 705, top: 505, width: 190 }}
          >
            Mereplace page yang paling lama <span className="font-bold text-gray-900">berada di memori</span>
          </div>
          {/* FIFO Box */}
          <div
            className="absolute border border-gray-300 bg-white rounded-md p-2.5 text-xs flex flex-col justify-center space-y-2.5 shadow-xs"
            style={{ left: 720, top: 580, width: 160, height: 95 }}
          >
            <div className="flex items-center gap-2">
              <span className="text-emerald-600 font-black text-sm">✓</span>
              <span className="text-[11px] text-gray-800 leading-tight">Mudah diimplementasikan</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-rose-600 font-black text-sm">✗</span>
              <span className="text-[11px] text-gray-800 leading-tight">Page fault tinggi</span>
            </div>
          </div>

          {/* 4. CLOCK POLICY 1 BIT */}
          <div
            className="absolute rounded-md border-2 border-purple-500 bg-white flex items-center justify-center font-bold text-gray-900 text-xs shadow-xs"
            style={{ left: 965, top: 435, width: 160, height: 42 }}
          >
            Clock Policy 1 bit
          </div>

          {/* Clock Policy Istilah */}
          <div
            className="absolute text-[11px] text-gray-800 leading-tight space-y-0.5"
            style={{ left: 965, top: 520, width: 180 }}
          >
            <div className="font-bold text-gray-900">Istilah:</div>
            <div>• <b>Bit Use</b></div>
            <div className="pl-3">a. Nilai 1 = (*)</div>
            <div className="pl-3">b. Nilai 0 = ( )</div>
            <div>• <b>Pointer (→)</b></div>
          </div>

          {/* Clock Step 1 */}
          <div
            className="absolute border border-purple-300 bg-white rounded-md p-2 text-[10.5px] text-gray-800 leading-snug"
            style={{ left: 1190, top: 435, width: 190, height: 52 }}
          >
            Pointer pada inisiasinya mengarahkan ke frame yang dapat diisi oleh page baru
          </div>

          {/* Clock Step 2 */}
          <div
            className="absolute border border-purple-300 bg-white rounded-md p-2 text-[10.5px] text-gray-800 leading-snug"
            style={{ left: 1190, top: 515, width: 190, height: 65 }}
          >
            Ketika page pertama kali masuk, nilai bit use = 1 yang dilambangkan dengan asterisk (*) di belakang angka page
          </div>

          {/* Clock Step 3 */}
          <div
            className="absolute border border-purple-300 bg-white rounded-md p-2 text-[10.5px] text-gray-800 leading-snug text-center"
            style={{ left: 1190, top: 605, width: 190, height: 40 }}
          >
            Page bisa di-replace ketika bit use-nya bernilai nol
          </div>

          {/* Clock Step 4 */}
          <div
            className="absolute border border-orange-300 bg-white rounded-md p-2 text-[10.5px] text-gray-800 leading-snug"
            style={{ left: 1420, top: 595, width: 220, height: 55 }}
          >
            Pointer akan melakukan tracing ke setiap frame untuk mencari page dengan bit use nol (tanpa asterisk)
          </div>

          {/* Clock Step 5 */}
          <div
            className="absolute border border-orange-300 bg-white rounded-md p-2.5 text-[10.5px] text-gray-800 leading-snug"
            style={{ left: 1420, top: 685, width: 220, height: 85 }}
          >
            Jika belum ketemu page dengan bit use nol dan ketemunya justru page dengan bit use 1, maka bit use-nya berubah menjadi nol dan proses tracing berlanjut
          </div>
        </div>
    </div>
  );
};

export default MemoryMindMapView;
