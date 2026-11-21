import React, { useState, useCallback } from 'react';
import LandingPage from './components/LandingPage';
import NavbarPill from './components/NavbarPill';
import BoardCanvas from './components/BoardCanvas';
import FloatingToolbar from './components/FloatingToolbar';
import MindMapView from './components/MindMapView';
import ExerciseView from './components/ExerciseView';
import MemoryMindMapView from './components/MemoryMindMapView';
import MemoryExerciseView from './components/MemoryExerciseView';

const MINDMAP_DEFAULT_TRANSFORM = { x: 30, y: 25, scale: 0.58 };
const EXERCISE_DEFAULT_TRANSFORM = { x: 40, y: 20, scale: 0.92 };

type Page = 'landing' | 'deadlock' | 'memory';

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('landing');
  const [activeTab, setActiveTab] = useState<'mindmap' | 'exercises'>('mindmap');
  const [highlighterActive, setHighlighterActive] = useState(false);
  const [highlighterColor, setHighlighterColor] = useState('#facc15');
  const [highlighterSize, setHighlighterSize] = useState(24);
  const [clearTrigger, setClearTrigger] = useState(0);
  const [transform, setTransform] = useState(MINDMAP_DEFAULT_TRANSFORM);

  const handleTabChange = useCallback((tab: 'mindmap' | 'exercises') => {
    setActiveTab(tab);
    if (tab === 'mindmap') {
      setTransform(MINDMAP_DEFAULT_TRANSFORM);
    } else {
      const availableWidth = window.innerWidth;
      const targetWidth = 1100 * EXERCISE_DEFAULT_TRANSFORM.scale;
      const centeredX = Math.max((availableWidth - targetWidth) / 2, 20);
      setTransform({ x: centeredX, y: 20, scale: EXERCISE_DEFAULT_TRANSFORM.scale });
    }
  }, []);

  const handleClearInk = useCallback(() => {
    setClearTrigger((prev) => prev + 1);
  }, []);

  const handleFitToScreen = useCallback(() => {
    if (activeTab === 'mindmap') {
      const scaleX = window.innerWidth / 3650;
      const scaleY = window.innerHeight / 2250;
      const scale = Math.min(scaleX, scaleY, 0.75);
      setTransform({ x: 20, y: 20, scale: Math.max(scale, 0.25) });
    } else {
      setTransform({
        x: Math.max((window.innerWidth - 1100 * 0.9) / 2, 20),
        y: 20,
        scale: 0.9,
      });
    }
  }, [activeTab]);

  const handleSelectMaterial = useCallback((material: 'deadlock' | 'memory') => {
    setCurrentPage(material);
    setActiveTab('mindmap');
    setTransform(MINDMAP_DEFAULT_TRANSFORM);
    setHighlighterActive(false);
    setClearTrigger(0);
  }, []);

  const handleBack = useCallback(() => {
    setCurrentPage('landing');
    setActiveTab('mindmap');
    setTransform(MINDMAP_DEFAULT_TRANSFORM);
    setHighlighterActive(false);
  }, []);

  // Landing page
  if (currentPage === 'landing') {
    return <LandingPage onSelectMaterial={handleSelectMaterial} />;
  }

  // Material label for navbar
  const materialLabel =
    currentPage === 'deadlock' ? 'Deadlock Board' : 'Memori Board';

  // Determine which content to render
  const renderContent = () => {
    if (currentPage === 'deadlock') {
      return activeTab === 'mindmap' ? <MindMapView /> : <ExerciseView />;
    }
    return activeTab === 'mindmap' ? <MemoryMindMapView /> : <MemoryExerciseView />;
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-gray-50 select-none">
      {/* Top Floating Pill Navigation */}
      <NavbarPill
        activeTab={activeTab}
        onTabChange={handleTabChange}
        materialLabel={materialLabel}
        onBack={handleBack}
      />

      {/* Floating Toolbar (Highlighter & Zoom Controls) */}
      <FloatingToolbar
        highlighterActive={highlighterActive}
        highlighterColor={highlighterColor}
        highlighterSize={highlighterSize}
        onSetHighlighter={setHighlighterActive}
        onColorChange={setHighlighterColor}
        onSizeChange={setHighlighterSize}
        onClearInk={handleClearInk}
      />

      {/* Miro-Style Pan & Zoom Canvas with integrated native GPU-accelerated Highlighter */}
      <BoardCanvas
        highlighterActive={highlighterActive}
        highlighterColor={highlighterColor}
        highlighterSize={highlighterSize}
        clearTrigger={clearTrigger}
        transform={transform}
        onTransformChange={setTransform}
        onFitToScreen={handleFitToScreen}
      >
        {renderContent()}
      </BoardCanvas>
    </div>
  );
};

export default App;
