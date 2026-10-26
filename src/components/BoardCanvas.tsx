import React, { useRef, useState, useCallback, useEffect } from 'react';
import HighlighterCanvas from './HighlighterCanvas';

interface BoardCanvasProps {
  children: React.ReactNode;
  highlighterActive: boolean;
  highlighterColor: string;
  highlighterSize: number;
  clearTrigger: number;
  transform: { x: number; y: number; scale: number };
  onTransformChange: (transform: { x: number; y: number; scale: number }) => void;
  onFitToScreen?: () => void;
}

export const BoardCanvas: React.FC<BoardCanvasProps> = ({
  children,
  highlighterActive,
  highlighterColor,
  highlighterSize,
  clearTrigger,
  transform,
  onTransformChange,
  onFitToScreen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const lastTouchDistance = useRef<number | null>(null);
  const lastTouchCenter = useRef<{ x: number; y: number } | null>(null);

  const startPan = useCallback(
    (e: React.MouseEvent) => {
      setIsPanning(true);
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y });
    },
    [transform]
  );

  // Mouse pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Right click button 2: pan anywhere!
      if (e.button === 2) {
        e.preventDefault();
        startPan(e);
        return;
      }
      // Left click button 0: pan only when clicking on canvas background directly
      if (
        e.button === 0 &&
        !highlighterActive &&
        (e.target as HTMLElement).tagName === 'DIV' &&
        (e.target as HTMLElement).classList.contains('dot-grid')
      ) {
        e.preventDefault();
        startPan(e);
      }
    },
    [highlighterActive, startPan]
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isPanning) {
        e.preventDefault();
        onTransformChange({
          ...transform,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        });
      }
    },
    [isPanning, panStart, transform, onTransformChange]
  );

  const handleMouseUp = useCallback(() => {
    setIsPanning(false);
  }, []);

  // Scroll wheel zoom centered on cursor
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.9 : 1.1;
      const newScale = Math.min(Math.max(transform.scale * delta, 0.15), 3.5);
      const rect = containerRef.current!.getBoundingClientRect();
      const cx = e.clientX - rect.left;
      const cy = e.clientY - rect.top;
      const newX = cx - (cx - transform.x) * (newScale / transform.scale);
      const newY = cy - (cy - transform.y) * (newScale / transform.scale);
      onTransformChange({ x: newX, y: newY, scale: newScale });
    },
    [transform, onTransformChange]
  );

  // Touch handlers for mobile
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (highlighterActive) return;
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastTouchDistance.current = Math.sqrt(dx * dx + dy * dy);
        lastTouchCenter.current = {
          x: (e.touches[0].clientX + e.touches[1].clientX) / 2,
          y: (e.touches[0].clientY + e.touches[1].clientY) / 2,
        };
      } else if (e.touches.length === 1) {
        setIsPanning(true);
        setPanStart({
          x: e.touches[0].clientX - transform.x,
          y: e.touches[0].clientY - transform.y,
        });
      }
    },
    [highlighterActive, transform]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (highlighterActive) return;
      if (e.touches.length === 2 && lastTouchDistance.current !== null) {
        e.preventDefault();
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const delta = dist / lastTouchDistance.current;
        const newScale = Math.min(Math.max(transform.scale * delta, 0.15), 3.5);
        const cx = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        const cy = (e.touches[0].clientY + e.touches[1].clientY) / 2;

        const panDx = lastTouchCenter.current ? cx - lastTouchCenter.current.x : 0;
        const panDy = lastTouchCenter.current ? cy - lastTouchCenter.current.y : 0;

        const rect = containerRef.current!.getBoundingClientRect();
        const relCx = cx - rect.left;
        const relCy = cy - rect.top;
        const newX = relCx - (relCx - transform.x) * (newScale / transform.scale) + panDx;
        const newY = relCy - (relCy - transform.y) * (newScale / transform.scale) + panDy;

        onTransformChange({ x: newX, y: newY, scale: newScale });
        lastTouchDistance.current = dist;
        lastTouchCenter.current = { x: cx, y: cy };
      } else if (e.touches.length === 1 && isPanning) {
        onTransformChange({
          ...transform,
          x: e.touches[0].clientX - panStart.x,
          y: e.touches[0].clientY - panStart.y,
        });
      }
    },
    [highlighterActive, transform, isPanning, panStart, onTransformChange]
  );

  const handleTouchEnd = useCallback(() => {
    setIsPanning(false);
    lastTouchDistance.current = null;
    lastTouchCenter.current = null;
  }, []);

  // Prevent browser context menu on canvas
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => e.preventDefault();
    el.addEventListener('contextmenu', handler);
    return () => el.removeEventListener('contextmenu', handler);
  }, []);

  // Zoom controls
  const zoomIn = () => {
    const newScale = Math.min(transform.scale * 1.25, 3.5);
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    onTransformChange({
      x: cx - (cx - transform.x) * (newScale / transform.scale),
      y: cy - (cy - transform.y) * (newScale / transform.scale),
      scale: newScale,
    });
  };

  const zoomOut = () => {
    const newScale = Math.max(transform.scale * 0.8, 0.15);
    const rect = containerRef.current!.getBoundingClientRect();
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    onTransformChange({
      x: cx - (cx - transform.x) * (newScale / transform.scale),
      y: cy - (cy - transform.y) * (newScale / transform.scale),
      scale: newScale,
    });
  };

  return (
    <div
      ref={containerRef}
      className={`w-full h-screen overflow-hidden dot-grid bg-gray-50 select-none ${
        isPanning ? 'cursor-grabbing' : highlighterActive ? 'cursor-crosshair' : 'cursor-grab'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Zoom controls floating widget */}
      <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-center gap-1.5 bg-white/90 backdrop-blur-md border border-gray-200/80 rounded-2xl p-1.5 shadow-lg shadow-black/5">
        <button
          onClick={zoomIn}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-base font-bold cursor-pointer"
          title="Zoom In"
        >
          +
        </button>
        <button
          onClick={zoomOut}
          className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors text-base font-bold cursor-pointer"
          title="Zoom Out"
        >
          −
        </button>
        {onFitToScreen && (
          <button
            onClick={onFitToScreen}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors cursor-pointer"
            title="Fit to Screen"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5"
              />
            </svg>
          </button>
        )}
        <div className="text-center text-[10px] font-mono font-semibold text-gray-400 px-1 py-0.5">
          {Math.round(transform.scale * 100)}%
        </div>
      </div>

      {/* Transformed Miro-style canvas container */}
      <div
        style={{
          transform: `translate(${transform.x}px, ${transform.y}px) scale(${transform.scale})`,
          transformOrigin: '0 0',
          willChange: 'transform',
        }}
        className="relative"
      >
        {children}
        {/* Native incremental 2D highlighter canvas - hardware accelerated with CSS transform */}
        <HighlighterCanvas
          active={highlighterActive}
          color={highlighterColor}
          size={highlighterSize}
          clearTrigger={clearTrigger}
          onPanStart={startPan}
          width={3800}
          height={1800}
        />
      </div>
    </div>
  );
};

export default BoardCanvas;
