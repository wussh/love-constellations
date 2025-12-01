'use client';

import { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { THEMES } from '@/lib/constants';

interface Star {
  id: string;
  message: string;
  theme: string;
  posX: number;
  posY: number;
  brightness: number;
  createdAt: Date;
  hasTwin: boolean;
  twinLink?: {
    id: string;
    posX: number;
    posY: number;
  } | null;
}

interface StarCanvasProps {
  stars: Star[];
  onStarClick: (star: Star) => void;
}

export default function StarCanvas({ stars, onStarClick }: StarCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredStar, setHoveredStar] = useState<Star | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  // Update canvas dimensions
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const parent = canvasRef.current.parentElement;
        if (parent) {
          setDimensions({
            width: parent.clientWidth,
            height: parent.clientHeight,
          });
        }
      }
    };

    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Draw stars and twin links
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = dimensions.width;
    canvas.height = dimensions.height;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw twin links first (behind stars)
    stars.forEach((star) => {
      if (star.hasTwin && star.twinLink) {
        const x1 = (star.posX / 100) * canvas.width;
        const y1 = (star.posY / 100) * canvas.height;
        const x2 = (star.twinLink.posX / 100) * canvas.width;
        const y2 = (star.twinLink.posY / 100) * canvas.height;

        // Draw glowing line
        ctx.save();
        ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)'; // Purple glow
        ctx.lineWidth = 2;
        ctx.shadowBlur = 20;
        ctx.shadowColor = 'rgba(147, 51, 234, 0.8)';
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
        ctx.restore();
      }
    });

    // Draw stars
    stars.forEach((star) => {
      const x = (star.posX / 100) * canvas.width;
      const y = (star.posY / 100) * canvas.height;
      
      // Calculate star size based on brightness (likes)
      const baseSize = 3;
      const size = baseSize + Math.min(star.brightness * 0.5, 8);
      
      // Determine color based on theme
      const themeColors: Record<string, string> = {
        CRUSH: '#ec4899', // Pink
        FIRST_LOVE: '#f9a8d4', // Light pink
        UNSENT_APOLOGY: '#93c5fd', // Blue
        LONG_DISTANCE: '#fbbf24', // Amber
        SECRET_ADMIRER: '#a78bfa', // Purple
        MOVING_ON: '#86efac', // Green
        WHAT_IF: '#fcd34d', // Yellow
        GRATITUDE: '#fb923c', // Orange
      };
      
      const color = themeColors[star.theme] || '#ffffff';
      const isHovered = hoveredStar?.id === star.id;
      
      // Draw glow
      ctx.save();
      ctx.shadowBlur = isHovered ? 30 : 15;
      ctx.shadowColor = color;
      
      // Draw star
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
      
      // Add sparkle effect for hovered star
      if (isHovered) {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      
      ctx.restore();
    });
  }, [stars, hoveredStar, dimensions]);

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Find clicked star (within 2% radius)
    const clickedStar = stars.find((star) => {
      const distance = Math.sqrt(
        Math.pow(star.posX - x, 2) + Math.pow(star.posY - y, 2)
      );
      return distance < 2;
    });

    if (clickedStar) {
      onStarClick(clickedStar);
    }
  };

  // Handle hover
  const handleCanvasMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    // Find hovered star
    const hovered = stars.find((star) => {
      const distance = Math.sqrt(
        Math.pow(star.posX - x, 2) + Math.pow(star.posY - y, 2)
      );
      return distance < 2;
    });

    setHoveredStar(hovered || null);
    
    if (hovered) {
      setTooltipPosition({
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const theme = hoveredStar ? THEMES.find(t => t.value === hoveredStar.theme) : null;

  return (
    <>
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onMouseMove={handleCanvasMove}
        onMouseLeave={() => setHoveredStar(null)}
        className="absolute inset-0 w-full h-full cursor-pointer"
        style={{ background: 'transparent' }}
      />
      
      {/* Tooltip */}
      <AnimatePresence>
        {hoveredStar && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.15 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: tooltipPosition.x + 10,
              top: tooltipPosition.y + 10,
            }}
          >
            <div className="bg-slate-900/95 backdrop-blur-sm border border-slate-700/50 rounded-lg p-3 shadow-xl max-w-xs">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-purple-400">
                  {theme?.label || hoveredStar.theme}
                </span>
                {hoveredStar.hasTwin && (
                  <span className="text-purple-300 text-xs">✨ Twin</span>
                )}
              </div>
              <p className="text-sm text-white line-clamp-2 mb-2">
                {hoveredStar.message}
              </p>
              <div className="flex items-center gap-3 text-xs text-slate-400">
                <span>❤️ {hoveredStar.brightness}</span>
                <span>•</span>
                <span>{new Date(hoveredStar.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-xs text-slate-500 mt-2">
                Click to read more
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
