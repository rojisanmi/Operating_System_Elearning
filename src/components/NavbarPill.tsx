import React from 'react';

interface NavbarPillProps {
  activeTab: 'mindmap' | 'exercises';
  onTabChange: (tab: 'mindmap' | 'exercises') => void;
}

export const NavbarPill: React.FC<NavbarPillProps> = ({ activeTab, onTabChange }) => {
  return (
    <header className="fixed top-5 left-1/2 -translate-x-1/2 z-[100] select-none">
      <div className="flex items-center gap-3 bg-white/85 backdrop-blur-2xl border border-gray-200/90 rounded-full px-3 py-1.5 shadow-xl shadow-black/8">
        {/* Brand / Logo badge */}
        <div className="flex items-center gap-1.5 pl-2 pr-1 border-r border-gray-200">
          <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-black text-[11px] shadow-xs">
            RS
          </div>
          <span className="font-extrabold text-xs tracking-tight text-gray-900 hidden sm:inline">
            Responsi Sisop
          </span>
          <span className="bg-blue-50 text-blue-700 text-[10px] font-extrabold px-1.5 py-0.5 rounded-md border border-blue-200/60 ml-0.5">
            Deadlock Board
          </span>
        </div>

        {/* Tab switch buttons */}
        <nav className="flex items-center gap-1">
          <button
            onClick={() => onTabChange('mindmap')}
            className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-out cursor-pointer ${
              activeTab === 'mindmap'
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
                />
              </svg>
              Mind Map
            </span>
          </button>

          <button
            onClick={() => onTabChange('exercises')}
            className={`relative px-4 py-1.5 rounded-full text-xs font-bold transition-all duration-300 ease-out cursor-pointer ${
              activeTab === 'exercises'
                ? 'bg-gray-900 text-white shadow-md'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100/80'
            }`}
          >
            <span className="relative z-10 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
              </svg>
              Latihan Soal
            </span>
          </button>
        </nav>
      </div>
    </header>
  );
};

export default NavbarPill;
