import React, { useRef, useEffect, useCallback } from 'react';

interface HighlighterCanvasProps {
  active: boolean;
  color: string;
  size: number;
  clearTrigger: number;
  onPanStart?: (e: React.MouseEvent) => void;
  width?: number;
  height?: number;
}

export const HighlighterCanvas: React.FC<HighlighterCanvasProps> = ({
  active,
  color,
  size,
  clearTrigger,
  onPanStart,
  width = 3600,
  height = 2200,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const lastPoint = useRef<{ x: number; y: number } | null>(null);

  // Clear canvas whenever clearTrigger increments
  useEffect(() => {
    if (clearTrigger > 0) {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [clearTrigger]);

  // Convert client viewport coordinates to exact canvas pixel coordinates
  const getCanvasCoords = useCallback((clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * canvas.width;
    const y = ((clientY - rect.top) / rect.height) * canvas.height;
    return { x, y };
  }, []);

  const startDrawing = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isDrawing.current = true;
    const pt = getCanvasCoords(clientX, clientY);
    lastPoint.current = pt;

    // Draw initial dot
    ctx.save();
    ctx.beginPath();
    ctx.arc(pt.x, pt.y, size / 2, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.globalAlpha = 0.38;
    ctx.fill();
    ctx.restore();
  };

  const drawSegment = (clientX: number, clientY: number) => {
    if (!isDrawing.current || !lastPoint.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPt = getCanvasCoords(clientX, clientY);

    ctx.save();
    ctx.beginPath();
    ctx.strokeStyle = color;
    ctx.lineWidth = size;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.globalAlpha = 0.38;
    ctx.moveTo(lastPoint.current.x, lastPoint.current.y);
    ctx.lineTo(currentPt.x, currentPt.y);
    ctx.stroke();
    ctx.restore();

    lastPoint.current = currentPt;
  };

  const stopDrawing = () => {
    isDrawing.current = false;
    lastPoint.current = null;
  };

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    // Right click: forward to pan the board!
    if (e.button === 2) {
      onPanStart?.(e);
      return;
    }
    // Left click: draw!
    if (e.button === 0 && active) {
      e.preventDefault();
      startDrawing(e.clientX, e.clientY);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDrawing.current && active) {
      e.preventDefault();
      drawSegment(e.clientX, e.clientY);
    }
  };

  // Touch event handlers for mobile/tablet drawing
  const handleTouchStart = (e: React.TouchEvent) => {
    if (!active) return;
    if (e.touches.length === 1) {
      e.preventDefault();
      const t = e.touches[0];
      startDrawing(t.clientX, t.clientY);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!active || !isDrawing.current) return;
    if (e.touches.length === 1) {
      e.preventDefault();
      const t = e.touches[0];
      drawSegment(t.clientX, t.clientY);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        touchAction: active ? 'none' : 'auto',
      }}
      className={`select-none ${
        active ? 'pointer-events-auto cursor-crosshair z-40' : 'pointer-events-none z-40'
      }`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={stopDrawing}
    />
  );
};

export default HighlighterCanvas;
