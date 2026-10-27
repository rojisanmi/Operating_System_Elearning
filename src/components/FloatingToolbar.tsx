import React, { useState } from 'react';

interface FloatingToolbarProps {
  highlighterActive: boolean;
  highlighterColor: string;
  highlighterSize: number;
  onSetHighlighter: (active: boolean) => void;
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onClearInk: () => void;
}

const COLORS = [
  { name: 'Kuning Stabilo', value: '#facc15', ring: 'ring-yellow-400' },
  { name: 'Hijau Neon', value: '#4ade80', ring: 'ring-green-400' },
  { name: 'Pink Merah Muda', value: '#f472b6', ring: 'ring-pink-400' },
  { name: 'Biru Muda', value: '#60a5fa', ring: 'ring-blue-400' },
  { name: 'Ungu Muda', value: '#a78bfa', ring: 'ring-purple-400' },
];

const SIZES = [
  { label: 'Kecil', value: 14, iconSize: 6 },
  { label: 'Sedang', value: 24, iconSize: 10 },
  { label: 'Tebal', value: 40, iconSize: 16 },
];

export const FloatingToolbar: React.FC<FloatingToolbarProps> = ({
  highlighterActive,
  highlighterColor,
  highlighterSize,
  onSetHighlighter,
  onColorChange,
  onSizeChange,
  onClearInk,
}) => {
  const [paletteOpen, setPaletteOpen] = useState(false);

  return (
    <div
      className="fixed bottom-6 left-6 flex flex-col gap-2 items-start select-none pointer-events-auto"
      style={{ zIndex: 9999 }}
    >
      {/* Mode hint indicator when highlighter is active */}
      {highlighterActive && (
        <div className="bg-amber-500/95 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1.5 rounded-full shadow-lg flex items-center gap-2 border border-amber-300 animate-in fade-in slide-in-from-bottom-2">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>Mode Stabilo Aktif</span>
          <span className="text-amber-100 font-normal text-[11px]">
            (Klik kiri = coret, Klik kanan = geser)
          </span>
        </div>
      )}

      {/* Color & Size settings popover */}
      {paletteOpen && highlighterActive && (
        <div className="bg-white/95 backdrop-blur-xl border border-gray-200 rounded-3xl p-3 shadow-xl flex flex-col gap-3 animate-in zoom-in-95 duration-150">
          {/* Colors row */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 w-12">Warna:</span>
            <div className="flex items-center gap-2">
              {COLORS.map((c) => (
                <button
                  key={c.value}
                  onClick={() => onColorChange(c.value)}
                  className={`w-7 h-7 rounded-full transition-all duration-150 cursor-pointer ${
                    highlighterColor === c.value
                      ? `ring-3 ${c.ring} ring-offset-2 scale-115 shadow-sm`
                      : 'hover:scale-110 hover:shadow-xs'
                  }`}
                  style={{ backgroundColor: c.value }}
                  title={c.name}
                />
              ))}
            </div>
          </div>

          <div className="h-px bg-gray-100" />

          {/* Sizes row */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-gray-500 w-12">Ukuran:</span>
            <div className="flex items-center gap-1.5">
              {SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => onSizeChange(s.value)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    highlighterSize === s.value
                      ? 'bg-gray-900 text-white shadow-xs'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  title={`Ukuran ${s.label} (${s.value}px)`}
                >
                  <span
                    className="rounded-full inline-block"
                    style={{
                      width: s.iconSize,
                      height: s.iconSize,
                      backgroundColor: highlighterSize === s.value ? highlighterColor : '#94a3b8',
                    }}
                  />
                  <span>{s.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main floating control pill */}
      <div className="flex items-center gap-1.5 bg-white/90 backdrop-blur-xl border border-gray-200/90 rounded-2xl p-1.5 shadow-xl shadow-black/8">
        {/* Select & Pan mode button */}
        <button
          onClick={() => {
            onSetHighlighter(false);
            setPaletteOpen(false);
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-1.5 text-xs font-bold transition-all cursor-pointer ${
            !highlighterActive
              ? 'bg-gray-900 text-white shadow-sm'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Mode Kursor Panah (Pilih Elemen & Geser Kanvas)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
            />
          </svg>
          <span>Pilih</span>
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Highlighter pen button */}
        <button
          onClick={() => {
            if (!highlighterActive) {
              onSetHighlighter(true);
              setPaletteOpen(true);
            } else {
              setPaletteOpen(!paletteOpen);
            }
          }}
          className={`px-3.5 py-2 rounded-xl flex items-center gap-2 text-xs font-bold transition-all cursor-pointer relative ${
            highlighterActive
              ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
          title="Mode Stabilo (Pengaturan Warna & Ukuran)"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="m9 11-6 6v3h9l3-3m-6-6 7.5-7.5a2.121 2.121 0 0 1 3 3L13 13m-4-2 2 2"
            />
          </svg>
          <span>Stabilo</span>
          <span
            className="w-3.5 h-3.5 rounded-full border border-black/20 shadow-xs"
            style={{ backgroundColor: highlighterColor }}
          />
        </button>

        <div className="w-px h-5 bg-gray-200" />

        {/* Clear Ink button */}
        <button
          onClick={onClearInk}
          className="px-3 py-2 rounded-xl flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
          title="Bersihkan Semua Coretan Stabilo"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
          <span>Hapus Ink</span>
        </button>
      </div>
    </div>
  );
};

export default FloatingToolbar;
