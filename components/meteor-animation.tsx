'use client';

import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface MeteorProps {
  starPosition: { x: number; y: number };
  color: string;
  onComplete: () => void;
}

export function Meteor({ starPosition, color, onComplete }: MeteorProps) {
  // Random starting position (from top edges)
  const [startPos] = useState(() => {
    const side = Math.random() > 0.5 ? 'top' : 'left';
    if (side === 'top') {
      return { x: Math.random() * 100, y: -5 };
    } else {
      return { x: -5, y: Math.random() * 50 };
    }
  });

  return (
    <motion.div
      className="absolute pointer-events-none z-40"
      initial={{
        left: `${startPos.x}%`,
        top: `${startPos.y}%`,
        opacity: 0,
      }}
      animate={{
        left: `${starPosition.x}%`,
        top: `${starPosition.y}%`,
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 1.5,
        ease: [0.22, 1, 0.36, 1],
        opacity: {
          times: [0, 0.1, 0.8, 1],
        },
      }}
      onAnimationComplete={onComplete}
    >
      {/* Meteor head */}
      <div
        className="w-3 h-3 rounded-full"
        style={{
          backgroundColor: color,
          boxShadow: `0 0 20px ${color}, 0 0 40px ${color}`,
        }}
      />
      
      {/* Meteor tail */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2"
        style={{
          right: '100%',
          width: '60px',
          height: '2px',
          background: `linear-gradient(to left, ${color}, transparent)`,
          boxShadow: `0 0 10px ${color}`,
        }}
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{ 
          scaleX: [0, 1, 1, 0],
          opacity: [0, 1, 1, 0],
        }}
        transition={{
          duration: 1.5,
          times: [0, 0.2, 0.8, 1],
        }}
      />

      {/* Sparkle particles */}
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-white"
          style={{
            left: '50%',
            top: '50%',
          }}
          initial={{ scale: 0, opacity: 0 }}
          animate={{
            x: (Math.random() - 0.5) * 30,
            y: (Math.random() - 0.5) * 30,
            scale: [0, 1, 0],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: 0.8,
            delay: 1 + i * 0.05,
            ease: 'easeOut',
          }}
        />
      ))}
    </motion.div>
  );
}

interface MeteorShowerProps {
  newStars: Array<{
    id: string;
    posX: number;
    posY: number;
    theme: string;
  }>;
  onComplete: (starId: string) => void;
}

export function MeteorShower({ newStars, onComplete }: MeteorShowerProps) {
  const themeColors: Record<string, string> = {
    CRUSH: '#ec4899',
    FIRST_LOVE: '#f9a8d4',
    UNSENT_APOLOGY: '#93c5fd',
    LONG_DISTANCE: '#fbbf24',
    SECRET_ADMIRER: '#a78bfa',
    MOVING_ON: '#86efac',
    WHAT_IF: '#fcd34d',
    GRATITUDE: '#fb923c',
  };

  return (
    <>
      {newStars.map((star) => (
        <Meteor
          key={star.id}
          starPosition={{ x: star.posX, y: star.posY }}
          color={themeColors[star.theme] || '#ffffff'}
          onComplete={() => onComplete(star.id)}
        />
      ))}
    </>
  );
}
