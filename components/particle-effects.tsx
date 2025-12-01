'use client';

import { motion } from 'framer-motion';
import { useMemo } from 'react';

interface StarParticle {
  id: number;
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

export function AmbientParticles() {
  // Generate random particles
  const particles = useMemo(() => {
    return Array.from({ length: 100 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2 + 0.5,
      duration: 2 + Math.random() * 4,
      delay: Math.random() * 3,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
          }}
          animate={{
            opacity: [0.05, 0.3, 0.05],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

interface HoverParticlesProps {
  x: number;
  y: number;
  color: string;
}

export function HoverParticles({ x, y, color }: HoverParticlesProps) {
  const particles = useMemo(() => {
    return Array.from({ length: 8 }, (_, i) => ({
      id: i,
      angle: (i / 8) * Math.PI * 2,
      distance: 30 + Math.random() * 20,
      size: Math.random() * 3 + 1,
      duration: 1 + Math.random() * 0.5,
    }));
  }, []);

  return (
    <div
      className="absolute pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
      }}
    >
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full"
          style={{
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            backgroundColor: color,
            boxShadow: `0 0 ${particle.size * 3}px ${color}`,
          }}
          initial={{
            x: 0,
            y: 0,
            opacity: 0,
            scale: 0,
          }}
          animate={{
            x: Math.cos(particle.angle) * particle.distance,
            y: Math.sin(particle.angle) * particle.distance,
            opacity: [0, 0.8, 0],
            scale: [0, 1, 0.5],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            ease: 'easeOut',
          }}
        />
      ))}
    </div>
  );
}

export function FloatingMotes() {
  const motes = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 100 + Math.random() * 20,
      size: Math.random() * 3 + 1,
      duration: 15 + Math.random() * 10,
      delay: Math.random() * 5,
      drift: (Math.random() - 0.5) * 10,
    }));
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {motes.map((mote) => (
        <motion.div
          key={mote.id}
          className="absolute rounded-full bg-purple-400/20"
          style={{
            left: `${mote.x}%`,
            top: `${mote.y}%`,
            width: `${mote.size}px`,
            height: `${mote.size}px`,
            boxShadow: `0 0 ${mote.size * 2}px rgba(168, 85, 247, 0.3)`,
          }}
          animate={{
            y: [0, -120],
            x: [0, mote.drift],
            opacity: [0, 0.6, 0.6, 0],
            scale: [0.5, 1, 1, 0.5],
          }}
          transition={{
            duration: mote.duration,
            repeat: Infinity,
            delay: mote.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}
