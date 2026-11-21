import React, { useState } from 'react';
import {
  pagingSoal1,
  pagingSoal2,
  segmentationSoal,
  virtualMemorySoal,
} from '../data/memoryExercisesData';

// ── Small input cell with validation states (without leaking answers) ──
const InputField: React.FC<{
  label: string;
  value: string;
  onChange: (v: string) => void;
  correctValue?: string | number;
  checked: boolean;
  placeholder?: string;
  helperText?: string;
  width?: string;
}> = ({
  label,
  value,
  onChange,
  correctValue,
  checked,
  placeholder,
  helperText,
  width = 'w-full',
}) => {
    const normVal = value.trim().replace(/\s+/g, '');
    const normCorrect = correctValue !== undefined ? String(correctValue).trim().replace(/\s+/g, '') : '';
    const isCorrect = checked && normCorrect !== '' && normVal.toLowerCase() === normCorrect.toLowerCase();
    const isIncorrect = checked && normCorrect !== '' && normVal.toLowerCase() !== normCorrect.toLowerCase();

    return (
      <div className={`flex flex-col gap-1 ${width}`}>
        <label className="text-xs font-bold text-gray-700">{label}</label>
        <div className="relative">
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            className={`w-full h-10 px-3 py-2 border rounded-xl text-sm font-mono font-bold transition-all focus:outline-none focus:ring-2 ${isCorrect
                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-2 ring-emerald-300'
                : isIncorrect
                  ? 'bg-rose-50 border-rose-500 text-rose-950 ring-2 ring-rose-300'
                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 hover:border-gray-400'
              }`}
          />
          {isCorrect && (
            <span className="absolute right-3 top-2.5 text-emerald-600 font-extrabold text-xs">
              ✓ Benar
            </span>
          )}
        </div>
        {isIncorrect && (
          <span className="text-[11px] font-bold text-rose-600">
            ✗ Jawaban belum tepat, silakan periksa kembali
          </span>
        )}
        {helperText && !isIncorrect && (
          <span className="text-[10px] text-gray-500">{helperText}</span>
        )}
      </div>
    );
  };

// ── Solution steps panel (Kotretan Dosen) ──
const SolutionPanel: React.FC<{
  steps: { title: string; explanation: string }[];
  visible: boolean;
}> = ({ steps, visible }) => {
  if (!visible) return null;

  return (
    <div className="mt-6 bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-300 rounded-3xl p-6 shadow-sm animate-in fade-in duration-300">
      <h4 className="text-base font-bold text-amber-900 mb-4 flex items-center gap-2">
        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
          />
        </svg>
        Langkah Penyelesaian Lengkap (Kotretan Dosen)
      </h4>
      <div className="space-y-4">
        {steps.map((s, idx) => (
          <div key={idx} className="bg-white/80 p-4 rounded-2xl border border-amber-200">
            <div className="font-extrabold text-xs text-amber-950 mb-1 flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center text-[10px] font-black">
                {idx + 1}
              </span>
              {s.title}
            </div>
            <p className="text-xs text-gray-800 whitespace-pre-line leading-relaxed font-sans ml-7">
              {s.explanation}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Types for interactive simulation grid in Soal 4 ──
type AlgoKey = 'optimal' | 'lru' | 'fifo' | 'clock';

interface AlgoSimState {
  grid: string[][]; // 3 rows x 12 cols
  faults: string[]; // 12 cols
  fr: string;
  hr: string;
  checked: boolean;
  showSolution: boolean;
}

const createInitialAlgoState = (): AlgoSimState => ({
  grid: [Array(12).fill(''), Array(12).fill(''), Array(12).fill('')],
  faults: Array(12).fill(''),
  fr: '',
  hr: '',
  checked: false,
  showSolution: false,
});

export const MemoryExerciseView: React.FC = () => {
  const [selectedTab, setSelectedTab] = useState<'soal1' | 'soal2' | 'soal3' | 'soal4'>('soal1');

  // ── States for Soal 1 ──
  const [s1Binary, setS1Binary] = useState('');
  const [s1OffsetBits, setS1OffsetBits] = useState('');
  const [s1PageBits, setS1PageBits] = useState('');
  const [s1PageNum, setS1PageNum] = useState('');
  const [s1OffsetVal, setS1OffsetVal] = useState('');
  const [s1Checked, setS1Checked] = useState(false);
  const [s1ShowSolution, setS1ShowSolution] = useState(false);

  // ── States for Soal 2 ──
  const [s2AddrBits, setS2AddrBits] = useState('');
  const [s2Binary, setS2Binary] = useState('');
  const [s2OffsetBits, setS2OffsetBits] = useState('');
  const [s2PageBits, setS2PageBits] = useState('');
  const [s2PageNum, setS2PageNum] = useState('');
  const [s2FrameNum, setS2FrameNum] = useState('');
  const [s2OffsetVal, setS2OffsetVal] = useState('');
  const [s2PhysicalDec, setS2PhysicalDec] = useState('');
  const [s2Checked, setS2Checked] = useState(false);
  const [s2ShowSolution, setS2ShowSolution] = useState(false);

  // ── States for Soal 3 ──
  const [s3OffsetBits, setS3OffsetBits] = useState('');
  const [s3SegBits, setS3SegBits] = useState('');
  const [s3TotalSegs, setS3TotalSegs] = useState('');
  const [s3SegNum, setS3SegNum] = useState('');
  const [s3OffsetBin, setS3OffsetBin] = useState('');
  const [s3Valid, setS3Valid] = useState('');
  const [s3PhysBin, setS3PhysBin] = useState('');
  const [s3Checked, setS3Checked] = useState(false);
  const [s3ShowSolution, setS3ShowSolution] = useState(false);

  // ── States for Soal 4 (Virtual Memory Interactive Simulation) ──
  const [vmAlgorithm, setVmAlgorithm] = useState<AlgoKey>('optimal');
  const [simStates, setSimStates] = useState<Record<AlgoKey, AlgoSimState>>({
    optimal: createInitialAlgoState(),
    lru: createInitialAlgoState(),
    fifo: createInitialAlgoState(),
    clock: createInitialAlgoState(),
  });

  const activeVm = virtualMemorySoal.algorithms[vmAlgorithm];
  const activeSim = simStates[vmAlgorithm];

  // Helper to update active algorithm state
  const updateActiveSim = (updater: (prev: AlgoSimState) => AlgoSimState) => {
    setSimStates((prev) => ({
      ...prev,
      [vmAlgorithm]: updater(prev[vmAlgorithm]),
    }));
  };

  const handleCellChange = (rowIndex: number, colIndex: number, val: string) => {
    updateActiveSim((prev) => {
      const newGrid = prev.grid.map((row, r) =>
        r === rowIndex ? row.map((cVal, c) => (c === colIndex ? val : cVal)) : row
      );
      return { ...prev, grid: newGrid };
    });
  };

  const handleFaultChange = (colIndex: number, val: string) => {
    updateActiveSim((prev) => {
      const newFaults = prev.faults.map((fVal, c) => (c === colIndex ? val : fVal));
      return { ...prev, faults: newFaults };
    });
  };

  // Helper to validate a frame cell against key
  const isCellCorrect = (userVal: string, expectedVal: string | number | null): boolean => {
    const norm = userVal.trim().toLowerCase();
    if (expectedVal === null) {
      return norm === '-' || norm === '';
    }
    const exp = String(expectedVal).trim().toLowerCase();
    return norm === exp;
  };

  // Helper to validate a fault cell against key
  const isFaultCorrect = (userVal: string, isFault: boolean): boolean => {
    const norm = userVal.trim().toUpperCase();
    if (isFault) {
      return norm === 'F';
    } else {
      return norm === '-' || norm === '' || norm === '•';
    }
  };

  // Check if everything in the active simulation is correct
  const checkSimAllCorrect = (): boolean => {
    // 1. Grid
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 12; c++) {
        if (!isCellCorrect(activeSim.grid[r][c], activeVm.grid[r][c])) return false;
      }
    }
    // 2. Faults
    for (let c = 0; c < 12; c++) {
      if (!isFaultCorrect(activeSim.faults[c], activeVm.faults[c])) return false;
    }
    // 3. FR & HR
    const normFR = activeSim.fr.trim().replace(/\s+/g, '');
    const correctFR = activeVm.faultRatio.trim().replace(/\s+/g, '');
    if (normFR !== correctFR) return false;

    const normHR = activeSim.hr.trim().replace(/\s+/g, '');
    const correctHR = activeVm.hitRatio.trim().replace(/\s+/g, '');
    if (normHR !== correctHR) return false;

    return true;
  };

  return (
    <div className="min-w-[940px] max-w-[1240px] mx-auto py-24 px-8 select-none">
      {/* Title & Subtitle */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-gray-900 tracking-tight flex items-center justify-center gap-2">
          <span>📝</span> Modul Latihan Soal Manajemen & Virtual Memori
        </h2>
        <p className="text-gray-500 text-sm mt-1">
          Lengkapi langkah konversi alamat logika, pemetaan page/segment table, validasi batas memori, dan simulasi page replacement.
        </p>
      </div>

      {/* Main Tab Switcher */}
      <div className="flex gap-2.5 mb-8 justify-center flex-wrap">
        <button
          onClick={() => setSelectedTab('soal1')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${selectedTab === 'soal1'
              ? 'bg-gray-900 text-white shadow-md scale-105'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
          📄 Soal 1: Paging Sederhana
        </button>
        <button
          onClick={() => setSelectedTab('soal2')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${selectedTab === 'soal2'
              ? 'bg-gray-900 text-white shadow-md scale-105'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
          🗂️ Soal 2: Paging & Alamat Fisik
        </button>
        <button
          onClick={() => setSelectedTab('soal3')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${selectedTab === 'soal3'
              ? 'bg-gray-900 text-white shadow-md scale-105'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
          📐 Soal 3: Segmentasi Sederhana
        </button>
        <button
          onClick={() => setSelectedTab('soal4')}
          className={`px-5 py-2.5 rounded-2xl text-sm font-bold transition-all duration-200 cursor-pointer ${selectedTab === 'soal4'
              ? 'bg-gray-900 text-white shadow-md scale-105'
              : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
        >
          ⏰ Soal 4: Simulasi Page Replacement
        </button>
      </div>

      {/* ═══════════════════════════════════════════════════════
          SOAL 1: PAGING SEDERHANA
          ═══════════════════════════════════════════════════════ */}
      {selectedTab === 'soal1' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 font-extrabold text-xs uppercase tracking-wider">
              Latihan Soal 1
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-2">{pagingSoal1.title}</h3>
            <p className="text-sm font-bold text-emerald-700">{pagingSoal1.subtitle}</p>
            <div className="mt-3 p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200 text-xs text-emerald-950 font-medium leading-relaxed">
              <b>Soal:</b> {pagingSoal1.description}
            </div>
          </div>

          {/* Interactive Input Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="1. Alamat Logika 2050 dalam Biner 16-Bit:"
              placeholder="Contoh: 0000 1000 0000 0010"
              value={s1Binary}
              onChange={setS1Binary}
              correctValue="0000100000000010"
              checked={s1Checked}
              helperText="Petunjuk: Konversikan desimal 2050 ke format 16-bit biner (boleh dengan spasi)"
            />

            <InputField
              label="2. Panjang Bit Offset (Ukuran Page 2 KB):"
              placeholder="Contoh: 11"
              value={s1OffsetBits}
              onChange={setS1OffsetBits}
              correctValue={11}
              checked={s1Checked}
              helperText="Petunjuk: Hitung dari ukuran page (2 KB) = 2^N Byte untuk mencari jumlah bit offset"
            />

            <InputField
              label="3. Panjang Bit No. Page:"
              placeholder="Contoh: 5"
              value={s1PageBits}
              onChange={setS1PageBits}
              correctValue={5}
              checked={s1Checked}
              helperText="Petunjuk: Bit No. Page = Total Bit Alamat Logika (16 bit) − Bit Offset"
            />

            <InputField
              label="4. Nomor Page (Nilai Desimal):"
              placeholder="Contoh: 1"
              value={s1PageNum}
              onChange={setS1PageNum}
              correctValue={1}
              checked={s1Checked}
              helperText="Petunjuk: Ambil bit No. Page terdepan dari biner lalu konversikan ke nilai desimal"
            />

            <InputField
              label="5. Nilai Offset (Nilai Desimal):"
              placeholder="Contoh: 2"
              value={s1OffsetVal}
              onChange={setS1OffsetVal}
              correctValue={2}
              checked={s1Checked}
              helperText="Petunjuk: Ambil sisa bit offset di bagian belakang lalu konversikan ke nilai desimal"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => setS1Checked(true)}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ✓ Periksa Jawaban
            </button>
            <button
              onClick={() => {
                setS1Binary('');
                setS1OffsetBits('');
                setS1PageBits('');
                setS1PageNum('');
                setS1OffsetVal('');
                setS1Checked(false);
                setS1ShowSolution(false);
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ↺ Reset Soal
            </button>
            <button
              onClick={() => {
                setS1Binary('0000 1000 0000 0010');
                setS1OffsetBits('11');
                setS1PageBits('5');
                setS1PageNum('1');
                setS1OffsetVal('2');
                setS1Checked(true);
                setS1ShowSolution(true);
              }}
              className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ★ Tampilkan Kunci Jawaban
            </button>
            {s1Checked && (
              <button
                onClick={() => setS1ShowSolution(!s1ShowSolution)}
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {s1ShowSolution ? '▲ Sembunyikan Kotretan' : '▼ Lihat Kotretan Langkah Penyelesaian'}
              </button>
            )}
          </div>

          <SolutionPanel steps={pagingSoal1.steps} visible={s1Checked && s1ShowSolution} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SOAL 2: PAGING & ALAMAT FISIK DENGAN PAGE TABLE
          ═══════════════════════════════════════════════════════ */}
      {selectedTab === 'soal2' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-900 font-extrabold text-xs uppercase tracking-wider">
              Latihan Soal 2
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-2">{pagingSoal2.title}</h3>
            <p className="text-sm font-bold text-blue-700">{pagingSoal2.subtitle}</p>
            <div className="mt-3 p-4 bg-blue-50/60 rounded-2xl border border-blue-200 text-xs text-blue-950 font-medium leading-relaxed">
              <b>Soal:</b> {pagingSoal2.description}
            </div>
          </div>

          {/* Given Page Table Table */}
          <div className="overflow-x-auto">
            <div className="text-xs font-bold text-gray-700 mb-1.5">Tabel Page Table yang Diberikan:</div>
            <table className="border-collapse border border-gray-200 text-xs w-64 rounded-xl overflow-hidden font-mono text-center">
              <thead>
                <tr className="bg-slate-100 font-bold text-gray-800">
                  <th className="py-1.5 px-3 border border-gray-200">Page</th>
                  <th className="py-1.5 px-3 border border-gray-200">Frame</th>
                </tr>
              </thead>
              <tbody>
                {pagingSoal2.given.pageTable?.map((row) => (
                  <tr key={row.page} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 border border-gray-200 font-bold">{row.page}</td>
                    <td className="py-1.5 px-3 border border-gray-200 text-blue-700 font-bold">
                      {row.frameBinary} ({row.frame})
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Input Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="1. Pengalamatan Bit Sistem (Memori 64 KB):"
              placeholder="Contoh: 16"
              value={s2AddrBits}
              onChange={setS2AddrBits}
              correctValue={16}
              checked={s2Checked}
              helperText="Petunjuk: Hitung kapasitas memori (64 KB) dalam bentuk 2^N Byte untuk mencari total bit alamat"
            />

            <InputField
              label="2. Alamat Logika 2050 dalam Biner 16-Bit:"
              placeholder="Contoh: 0000 1000 0000 0010"
              value={s2Binary}
              onChange={setS2Binary}
              correctValue="0000100000000010"
              checked={s2Checked}
              helperText="Petunjuk: Konversikan desimal 2050 ke format 16-bit biner"
            />

            <InputField
              label="3. Panjang Bit Offset (Ukuran Page 4 KB):"
              placeholder="Contoh: 12"
              value={s2OffsetBits}
              onChange={setS2OffsetBits}
              correctValue={12}
              checked={s2Checked}
              helperText="Petunjuk: Hitung ukuran page (4 KB) dalam bentuk 2^N Byte untuk mencari bit offset"
            />

            <InputField
              label="4. Panjang Bit No. Page:"
              placeholder="Contoh: 4"
              value={s2PageBits}
              onChange={setS2PageBits}
              correctValue={4}
              checked={s2Checked}
              helperText="Petunjuk: Bit No. Page = Total Bit Sistem − Panjang Bit Offset"
            />

            <InputField
              label="5. Nomor Page (Desimal):"
              placeholder="Contoh: 0"
              value={s2PageNum}
              onChange={setS2PageNum}
              correctValue={0}
              checked={s2Checked}
              helperText="Petunjuk: Ambil bit No. Page terdepan dari biner lalu konversikan ke desimal"
            />

            <InputField
              label="6. Frame Hasil Lookup Page 0:"
              placeholder="Contoh: 6 atau 00110"
              value={s2FrameNum}
              onChange={setS2FrameNum}
              correctValue={6}
              checked={s2Checked}
              helperText="Petunjuk: Cari nomor page tersebut pada tabel Page Table untuk mendapatkan nomor frame-nya"
            />

            <InputField
              label="7. Nilai Offset (Desimal):"
              placeholder="Contoh: 2050"
              value={s2OffsetVal}
              onChange={setS2OffsetVal}
              correctValue={2050}
              checked={s2Checked}
              helperText="Petunjuk: Ambil sisa bit offset dan konversikan nilainya ke desimal"
            />

            <InputField
              label="8. Alamat Fisik Hasil Akhir (Desimal):"
              placeholder="Contoh: 26626"
              value={s2PhysicalDec}
              onChange={setS2PhysicalDec}
              correctValue={26626}
              checked={s2Checked}
              helperText="Petunjuk: Alamat Fisik = (Nomor Frame × Ukuran Page) + Nilai Offset"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => setS2Checked(true)}
              className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ✓ Periksa Jawaban
            </button>
            <button
              onClick={() => {
                setS2AddrBits('');
                setS2Binary('');
                setS2OffsetBits('');
                setS2PageBits('');
                setS2PageNum('');
                setS2FrameNum('');
                setS2OffsetVal('');
                setS2PhysicalDec('');
                setS2Checked(false);
                setS2ShowSolution(false);
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ↺ Reset Soal
            </button>
            <button
              onClick={() => {
                setS2AddrBits('16');
                setS2Binary('0000 1000 0000 0010');
                setS2OffsetBits('12');
                setS2PageBits('4');
                setS2PageNum('0');
                setS2FrameNum('6');
                setS2OffsetVal('2050');
                setS2PhysicalDec('26626');
                setS2Checked(true);
                setS2ShowSolution(true);
              }}
              className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ★ Tampilkan Kunci Jawaban
            </button>
            {s2Checked && (
              <button
                onClick={() => setS2ShowSolution(!s2ShowSolution)}
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {s2ShowSolution ? '▲ Sembunyikan Kotretan' : '▼ Lihat Kotretan Langkah Penyelesaian'}
              </button>
            )}
          </div>

          <SolutionPanel steps={pagingSoal2.steps} visible={s2Checked && s2ShowSolution} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SOAL 3: SEGMENTASI SEDERHANA
          ═══════════════════════════════════════════════════════ */}
      {selectedTab === 'soal3' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="px-3 py-1 rounded-full bg-amber-100 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
              Latihan Soal 3
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-2">{segmentationSoal.title}</h3>
            <p className="text-sm font-bold text-amber-700">{segmentationSoal.subtitle}</p>
            <div className="mt-3 p-4 bg-amber-50/60 rounded-2xl border border-amber-200 text-xs text-amber-950 font-medium leading-relaxed">
              <b>Soal:</b> {segmentationSoal.description}
            </div>
          </div>

          {/* Given Segment Table */}
          <div className="overflow-x-auto">
            <div className="text-xs font-bold text-gray-700 mb-1.5">Segment Table yang Diberikan:</div>
            <table className="border-collapse border border-gray-200 text-xs w-full max-w-lg rounded-xl overflow-hidden font-mono text-center">
              <thead>
                <tr className="bg-slate-100 font-bold text-gray-800">
                  <th className="py-1.5 px-3 border border-gray-200">S</th>
                  <th className="py-1.5 px-3 border border-gray-200 text-purple-700">Length (12 Bit)</th>
                  <th className="py-1.5 px-3 border border-gray-200 text-blue-700">Base (16 Bit)</th>
                </tr>
              </thead>
              <tbody>
                {segmentationSoal.given.segmentTable.map((row) => (
                  <tr key={row.segment} className="hover:bg-slate-50">
                    <td className="py-1.5 px-3 border border-gray-200 font-bold">{row.segment}</td>
                    <td className="py-1.5 px-3 border border-gray-200 text-purple-800 font-bold">
                      {row.lengthBinary} ({row.lengthDecimal})
                    </td>
                    <td className="py-1.5 px-3 border border-gray-200 text-blue-800 font-bold">
                      {row.baseBinary}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Sub-pertanyaan Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="a.1. Panjang Bit Offset (Sesuai Kolom Length):"
              placeholder="Contoh: 12"
              value={s3OffsetBits}
              onChange={setS3OffsetBits}
              correctValue={12}
              checked={s3Checked}
              helperText="Petunjuk: Hitung banyaknya digit biner pada kolom Length di tabel"
            />

            <InputField
              label="a.2. Panjang Bit No. Segmen (16 - Offset):"
              placeholder="Contoh: 4"
              value={s3SegBits}
              onChange={setS3SegBits}
              correctValue={4}
              checked={s3Checked}
              helperText="Petunjuk: Bit No. Segmen = Total Bit Alamat Sistem (16 bit) − Bit Offset (Length)"
            />

            <InputField
              label="a.3. Banyaknya Segmen yang Terbentuk (2^x):"
              placeholder="Contoh: 16"
              value={s3TotalSegs}
              onChange={setS3TotalSegs}
              correctValue={16}
              checked={s3Checked}
              helperText="Petunjuk: Banyaknya segmen yang dapat dibentuk = 2^(Bit No. Segmen)"
            />

            <InputField
              label="b. Nomor Segmen untuk Alamat 875:"
              placeholder="Contoh: 0"
              value={s3SegNum}
              onChange={setS3SegNum}
              correctValue={0}
              checked={s3Checked}
              helperText="Petunjuk: Tuliskan alamat 875 dalam format 16-bit biner lalu ambil bit segmen terdepan"
            />

            <InputField
              label="c. Nilai Offset dalam Biner (12 Bit):"
              placeholder="Contoh: 0011 0110 1011"
              value={s3OffsetBin}
              onChange={setS3OffsetBin}
              correctValue="001101101011"
              checked={s3Checked}
              helperText="Petunjuk: Tuliskan digit biner dari bit offset (12 bit sisa di belakang)"
            />

            <InputField
              label="d.1. Validitas Segmen (Ketik: Valid / Invalid):"
              placeholder="Valid"
              value={s3Valid}
              onChange={setS3Valid}
              correctValue="Valid"
              checked={s3Checked}
              helperText="Petunjuk: Bandingkan nilai Offset dengan kolom Length pada segmen terkait (Valid jika Offset < Length)"
            />

            <div className="md:col-span-2">
              <InputField
                label="d.2. Alamat Fisik Biner (Base + Offset):"
                placeholder="Contoh: 0011 1100 0000 1110"
                value={s3PhysBin}
                onChange={setS3PhysBin}
                correctValue="0011110000001110"
                checked={s3Checked}
                helperText="Petunjuk: Alamat Fisik = Base Segmen + Offset (lakukan penjumlahan biner 16-bit)"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => setS3Checked(true)}
              className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ✓ Periksa Jawaban
            </button>
            <button
              onClick={() => {
                setS3OffsetBits('');
                setS3SegBits('');
                setS3TotalSegs('');
                setS3SegNum('');
                setS3OffsetBin('');
                setS3Valid('');
                setS3PhysBin('');
                setS3Checked(false);
                setS3ShowSolution(false);
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ↺ Reset Soal
            </button>
            <button
              onClick={() => {
                setS3OffsetBits('12');
                setS3SegBits('4');
                setS3TotalSegs('16');
                setS3SegNum('0');
                setS3OffsetBin('0011 0110 1011');
                setS3Valid('Valid');
                setS3PhysBin('0011 1100 0000 1110');
                setS3Checked(true);
                setS3ShowSolution(true);
              }}
              className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ★ Tampilkan Kunci Jawaban
            </button>
            {s3Checked && (
              <button
                onClick={() => setS3ShowSolution(!s3ShowSolution)}
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {s3ShowSolution ? '▲ Sembunyikan Kotretan' : '▼ Lihat Kotretan Langkah Penyelesaian'}
              </button>
            )}
          </div>

          <SolutionPanel steps={segmentationSoal.steps} visible={s3Checked && s3ShowSolution} />
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════
          SOAL 4: SIMULASI VIRTUAL MEMORI (INTERAKTIF & EDITABLE)
          ═══════════════════════════════════════════════════════ */}
      {selectedTab === 'soal4' && (
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-gray-200/90 shadow-xl space-y-6">
          <div className="border-b border-gray-100 pb-4">
            <span className="px-3 py-1 rounded-full bg-purple-100 text-purple-900 font-extrabold text-xs uppercase tracking-wider">
              Latihan Soal 4
            </span>
            <h3 className="text-xl font-black text-gray-900 mt-2">{virtualMemorySoal.title}</h3>
            <p className="text-sm font-bold text-purple-700">{virtualMemorySoal.subtitle}</p>
            <div className="mt-3 p-4 bg-purple-50/60 rounded-2xl border border-purple-200 text-xs text-purple-950 font-medium leading-relaxed">
              <b>Soal:</b> {virtualMemorySoal.description}
            </div>
          </div>

          {/* Algorithm Sub-Tabs */}
          <div className="flex gap-2 border-b border-gray-200 pb-3 flex-wrap">
            {(['optimal', 'lru', 'fifo', 'clock'] as const).map((algoKey) => (
              <button
                key={algoKey}
                onClick={() => setVmAlgorithm(algoKey)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${vmAlgorithm === algoKey
                    ? 'bg-purple-700 text-white shadow-sm'
                    : 'bg-purple-50 text-purple-800 hover:bg-purple-100'
                  }`}
              >
                {virtualMemorySoal.algorithms[algoKey].name}
              </button>
            ))}
          </div>

          {/* User Instructions Banner for Interactive Simulation */}
          <div className="p-4 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-950 space-y-1">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <span>💡</span> Petunjuk Pengisian Tabel Eksekusi:
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-900/90">
              <li>Ketik nomor page pada baris <b>Frame 0</b>, <b>Frame 1</b>, dan <b>Frame 2</b> untuk setiap kolom langkah.</li>
              <li>Untuk sel frame yang masih <b>KOSONG</b> (sebelum ada page yang masuk), ketik tanda strip <b>"-"</b>.</li>
              <li>Pada baris <b>Fault (F)</b>, ketik huruf <b>"F"</b> jika terjadi penggantian/replacement fault, atau ketik <b>"-"</b> bila hit (tidak fault).</li>
              <li>Setelah melengkapi tabel, isikan nilai <b>Fault Ratio (FR)</b> dan <b>Hit Ratio (HR)</b> dalam bentuk pecahan (misal: 3/12).</li>
            </ul>
          </div>

          {/* Interactive Editable Simulation Grid */}
          <div className="overflow-x-auto">
            <div className="text-xs font-bold text-gray-700 mb-2 flex items-center justify-between">
              <span>Tabel Eksekusi Page Frame (Kapasitas: 3 Frame):</span>
              <span className="text-[11px] font-mono font-bold text-purple-700">
                Algoritma Aktif: {activeVm.name}
              </span>
            </div>

            <table className="border-collapse border border-gray-300 text-xs w-full text-center font-mono">
              <thead>
                <tr className="bg-slate-100 font-bold text-gray-800">
                  <th className="py-2.5 px-3 border border-gray-300 text-left w-24">PAS</th>
                  {virtualMemorySoal.given.pas.map((p, i) => (
                    <th
                      key={i}
                      className="py-2.5 px-1 border border-gray-300 text-purple-900 bg-purple-50/70 font-black text-sm"
                    >
                      {p}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {/* Pointer Row if Clock Policy */}
                {vmAlgorithm === 'clock' && (
                  <tr className="bg-amber-50/60 text-[10px]">
                    <td className="py-1.5 px-3 border border-gray-300 text-left font-bold text-amber-900">
                      Pointer
                    </td>
                    {virtualMemorySoal.algorithms.clock.pointers.map((pt, i) => (
                      <td key={i} className="py-1.5 px-1 border border-gray-300 font-black text-amber-700">
                        {pt !== null ? `F${pt}→` : '-'}
                      </td>
                    ))}
                  </tr>
                )}

                {/* Frame Rows 0, 1, 2 (Editable Inputs) */}
                {[0, 1, 2].map((fIdx) => (
                  <tr key={fIdx} className="hover:bg-slate-50">
                    <td className="py-2 px-3 border border-gray-300 text-left font-bold text-gray-700 bg-gray-50">
                      Frame {fIdx}
                    </td>
                    {Array.from({ length: 12 }).map((_, stepIdx) => {
                      const userVal = activeSim.grid[fIdx][stepIdx];
                      const expectedVal = activeVm.grid[fIdx][stepIdx];
                      const isCorrect = activeSim.checked && isCellCorrect(userVal, expectedVal);
                      const isIncorrect = activeSim.checked && !isCellCorrect(userVal, expectedVal);

                      return (
                        <td key={stepIdx} className="p-1 border border-gray-300">
                          <input
                            type="text"
                            value={userVal}
                            onChange={(e) => handleCellChange(fIdx, stepIdx, e.target.value)}
                            placeholder="-"
                            className={`w-9 h-8 sm:w-10 sm:h-9 text-center font-mono font-bold text-xs rounded-lg border transition-all focus:outline-none focus:ring-2 ${isCorrect
                                ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-300'
                                : isIncorrect
                                  ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-300'
                                  : 'bg-white border-gray-300 text-gray-900 focus:ring-blue-500 hover:border-gray-400'
                              }`}
                          />
                        </td>
                      );
                    })}
                  </tr>
                ))}

                {/* Fault Row (Editable Inputs) */}
                <tr className="bg-rose-50/50">
                  <td className="py-2 px-3 border border-gray-300 text-left font-bold text-rose-800 bg-rose-50/70">
                    Fault (F)
                  </td>
                  {Array.from({ length: 12 }).map((_, stepIdx) => {
                    const userVal = activeSim.faults[stepIdx];
                    const expectedFault = activeVm.faults[stepIdx];
                    const isCorrect = activeSim.checked && isFaultCorrect(userVal, expectedFault);
                    const isIncorrect = activeSim.checked && !isFaultCorrect(userVal, expectedFault);

                    return (
                      <td key={stepIdx} className="p-1 border border-gray-300">
                        <input
                          type="text"
                          value={userVal}
                          onChange={(e) => handleFaultChange(stepIdx, e.target.value)}
                          placeholder="-"
                          className={`w-9 h-8 sm:w-10 sm:h-9 text-center font-mono font-black text-xs rounded-lg border transition-all focus:outline-none focus:ring-2 ${isCorrect
                              ? 'bg-emerald-50 border-emerald-500 text-emerald-950 ring-1 ring-emerald-300'
                              : isIncorrect
                                ? 'bg-rose-50 border-rose-500 text-rose-950 ring-1 ring-rose-300'
                                : 'bg-white border-rose-200 text-gray-900 focus:ring-rose-500 hover:border-rose-300'
                            }`}
                        />
                      </td>
                    );
                  })}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Ratio Inputs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-2">
            <InputField
              label={`Fault Ratio (FR) untuk ${activeVm.name}:`}
              placeholder="Contoh: 3/12 atau 3 / 12"
              value={activeSim.fr}
              onChange={(val) => updateActiveSim((prev) => ({ ...prev, fr: val }))}
              correctValue={activeVm.faultRatio}
              checked={activeSim.checked}
              helperText="Petunjuk: Fault Ratio = Jumlah Fault (F) / Total Panjang Page Address Stream"
            />

            <InputField
              label={`Hit Ratio (HR) untuk ${activeVm.name}:`}
              placeholder="Contoh: 9/12 atau 9 / 12"
              value={activeSim.hr}
              onChange={(val) => updateActiveSim((prev) => ({ ...prev, hr: val }))}
              correctValue={activeVm.hitRatio}
              checked={activeSim.checked}
              helperText="Petunjuk: Hit Ratio = (Total Stream − Jumlah Fault) / Total Stream"
            />
          </div>

          {/* Validation Feedback Banner */}
          {activeSim.checked && (
            <div
              className={`p-4 rounded-2xl text-xs font-bold flex items-center gap-2 border ${checkSimAllCorrect()
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  : 'bg-rose-50 border-rose-300 text-rose-900'
                }`}
            >
              {checkSimAllCorrect() ? (
                <>
                  <span>🎉</span>
                  <span>Luar biasa! Seluruh tabel eksekusi, penandaan fault, dan rasio (FR/HR) terisi dengan tepat!</span>
                </>
              ) : (
                <>
                  <span>⚠️</span>
                  <span>Ada beberapa sel tabel atau rasio yang belum tepat (ditandai warna merah). Silakan periksa kembali perhitungan Anda.</span>
                </>
              )}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap items-center pt-4 border-t border-gray-100">
            <button
              onClick={() => updateActiveSim((prev) => ({ ...prev, checked: true }))}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-sm shadow-sm hover:shadow-md transition-all active:scale-95 cursor-pointer"
            >
              ✓ Periksa Jawaban
            </button>
            <button
              onClick={() => {
                updateActiveSim(() => createInitialAlgoState());
              }}
              className="px-5 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ↺ Reset Soal
            </button>
            <button
              onClick={() => {
                // Populate full key for this algorithm
                const filledGrid = activeVm.grid.map((row) =>
                  row.map((cell) => (cell === null ? '-' : String(cell)))
                );
                const filledFaults = activeVm.faults.map((f) => (f ? 'F' : '-'));
                updateActiveSim((prev) => ({
                  ...prev,
                  grid: filledGrid,
                  faults: filledFaults,
                  fr: activeVm.faultRatio,
                  hr: activeVm.hitRatio,
                  checked: true,
                  showSolution: true,
                }));
              }}
              className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
            >
              ★ Tampilkan Kunci Jawaban
            </button>
            {activeSim.checked && (
              <button
                onClick={() =>
                  updateActiveSim((prev) => ({ ...prev, showSolution: !prev.showSolution }))
                }
                className="px-5 py-2.5 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-xl font-bold text-sm transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                {activeSim.showSolution ? '▲ Sembunyikan Penjelasan' : '▼ Lihat Analisis Tracing Lengkap'}
              </button>
            )}
          </div>

          {/* Explanation Banner */}
          {activeSim.checked && activeSim.showSolution && (
            <div className="mt-4 p-5 bg-gradient-to-r from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl text-xs text-purple-950 leading-relaxed font-sans shadow-sm">
              <div className="font-bold text-purple-900 mb-1 flex items-center gap-1.5">
                <span>💡</span> Analisis Tracing {activeVm.name}:
              </div>
              <p>{activeVm.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MemoryExerciseView;
