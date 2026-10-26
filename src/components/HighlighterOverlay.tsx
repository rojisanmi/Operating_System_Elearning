import React, { useRef, useCallback, useEffect, useState } from 'react';

interface HighlighterOverlayProps {
  active: boolean;
  color: string;
  transform: { x: number; y: number; scale: number };
  clearTrigger: number;
}

interface Stroke {
  points: { x: number; y: number }[];
  color: string;
  width: number;
}

export const HighlighterOverlay: React.FC<HighlighterOverlayProps> = ({
  active,
  color,
  transform,
  clearTrigger,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [strokes, setStrokes] = useState<Stroke[]>([]);
  const currentStroke = useRef<Stroke | null>(null);
  const isDrawing = useRef(false);
  const animFrameId = useRef<number | null>(null);

  // Clear ink when clearTrigger increments
  useEffect(() => {
    if (clearTrigger > 0) {
      setStrokes([]);
      currentStroke.current = null;
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  }, [clearTrigger]);

  // Redraw all strokes transformed to canvas viewport
  const redraw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.save();
    ctx.translate(transform.x, transform.y);
    ctx.scale(transform.scale, transform.scale);

    const allStrokes = [...strokes];
    if (currentStroke.current) allStrokes.push(currentStroke.current);

    for (const stroke of allStrokes) {
      if (stroke.points.length < 2) continue;
      ctx.beginPath();
      ctx.strokeStyle = stroke.color;
      ctx.lineWidth = stroke.width;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.globalAlpha = 0.42;
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);
      for (let i = 1; i < stroke.points.length; i++) {
        ctx.lineTo(stroke.points[i].x, stroke.points[i].y);
      }
      ctx.stroke();
    }
    ctx.restore();
  }, [strokes, transform]);

  // Sync canvas size with window
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      redraw();
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [redraw]);

  useEffect(() => {
    redraw();
  }, [strokes, transform, redraw]);

  const getWorldPoint = useCallback(
    (clientX: number, clientY: number) => ({
      x: (clientX - transform.x) / transform.scale,
      y: (clientY - transform.y) / transform.scale,
    }),
    [transform]
  );

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      // ONLY draw on left click (button 0). Ignore right click so user can right-click pan!
      if (!active || e.button !== 0) return;
      e.preventDefault();
      isDrawing.current = true;
      const point = getWorldPoint(e.clientX, e.clientY);
      currentStroke.current = {
        points: [point, point],
        color,
        width: 24 / transform.scale,
      };
      redraw();
    },
    [active, color, transform.scale, getWorldPoint, redraw]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDrawing.current || !currentStroke.current) return;
      e.preventDefault();
      const point = getWorldPoint(e.clientX, e.clientY);
      currentStroke.current.points.push(point);

      if (animFrameId.current) cancelAnimationFrame(animFrameId.current);
      animFrameId.current = requestAnimationFrame(redraw);
    },
    [redraw, getWorldPoint]
  );

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0 && isDrawing.current) return;
      if (!isDrawing.current || !currentStroke.current) return;
      isDrawing.current = false;
      if (currentStroke.current.points.length > 1) {
        setStrokes((prev) => [...prev, currentStroke.current!]);
      }
      currentStroke.current = null;
      redraw();
    },
    [redraw]
  );

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 z-[60] select-none ${
        active ? 'pointer-events-auto cursor-crosshair' : 'pointer-events-none'
      }`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: 'none' }}
    />
  );
};

export default HighlighterOverlay;
