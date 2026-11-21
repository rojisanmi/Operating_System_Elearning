import React from 'react';

interface LandingPageProps {
  onSelectMaterial: (material: 'deadlock' | 'memory') => void;
}

const materials = [
  {
    id: 'deadlock' as const,
    icon: '🔒',
    title: 'Deadlock',
    description:
      'Mind Map & Latihan Soal Deadlock (Avoidance, Detection, Dining Philosopher)',
    accent: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      hoverBorder: 'hover:border-blue-400',
      hoverShadow: 'hover:shadow-blue-200/50',
      iconBg: 'bg-blue-100',
      titleColor: 'text-blue-950',
      descColor: 'text-blue-800',
      badgeBg: 'bg-blue-600',
      arrowColor: 'text-blue-500',
    },
  },
  {
    id: 'memory' as const,
    icon: '🧠',
    title: 'Manajemen Memori & Virtual Memori',
    description:
      'Mind Map & Latihan Soal Paging Sederhana, Segmentasi Sederhana, Virtual Memori',
    accent: {
      bg: 'bg-emerald-50',
      border: 'border-emerald-200',
      hoverBorder: 'hover:border-emerald-400',
      hoverShadow: 'hover:shadow-emerald-200/50',
      iconBg: 'bg-emerald-100',
      titleColor: 'text-emerald-950',
      descColor: 'text-emerald-800',
      badgeBg: 'bg-emerald-600',
      arrowColor: 'text-emerald-500',
    },
  },
];

export const LandingPage: React.FC<LandingPageProps> = ({
  onSelectMaterial,
}) => {
  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50 dot-grid flex items-center justify-center select-none">
      {/* Centered content container */}
      <div className="flex flex-col items-center gap-10 px-6 max-w-3xl w-full">
        {/* Logo & Header */}
        <div className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <img
              src="/favicon.svg"
              alt="Sisop Logo"
              className="w-12 h-12 rounded-2xl shadow-md select-none pointer-events-none"
            />
            <div>
              <h1 className="text-3xl font-black text-gray-900 tracking-tight leading-none">
                Responsi Sisop
              </h1>
              <p className="text-xs text-gray-500 font-semibold mt-0.5 tracking-wide uppercase">
                Interactive Study Board
              </p>
            </div>
          </div>
          <p className="text-sm text-gray-600 font-medium mt-2">
            Pilih materi yang ingin dipelajari
          </p>
        </div>

        {/* Material cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full">
          {materials.map((mat) => (
            <button
              key={mat.id}
              onClick={() => onSelectMaterial(mat.id)}
              className={`group relative flex flex-col items-start gap-4 p-6 rounded-3xl border-2 ${mat.accent.bg} ${mat.accent.border} ${mat.accent.hoverBorder} ${mat.accent.hoverShadow} shadow-sm hover:shadow-xl transition-all duration-300 cursor-pointer hover:scale-[1.02] active:scale-[0.99] text-left`}
            >
              {/* Badge */}
              <div
                className={`${mat.accent.badgeBg} text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-wider`}
              >
                Materi
              </div>

              {/* Icon + Title */}
              <div className="flex items-center gap-3">
                <div
                  className={`w-12 h-12 ${mat.accent.iconBg} rounded-2xl flex items-center justify-center text-2xl shadow-xs`}
                >
                  {mat.icon}
                </div>
                <h2
                  className={`text-lg font-extrabold ${mat.accent.titleColor} leading-tight`}
                >
                  {mat.title}
                </h2>
              </div>

              {/* Description */}
              <p
                className={`text-xs ${mat.accent.descColor} leading-relaxed font-medium`}
              >
                {mat.description}
              </p>

              {/* Arrow indicator */}
              <div
                className={`absolute bottom-5 right-5 ${mat.accent.arrowColor} opacity-50 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300`}
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </div>
            </button>
          ))}
        </div>

        {/* Footer */}
        <p className="text-[11px] text-gray-400 font-medium">
          Sistem Operasi — Interactive Study Board
        </p>
      </div>
    </div>
  );
};

export default LandingPage;
