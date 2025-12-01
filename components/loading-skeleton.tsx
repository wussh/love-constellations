'use client';

import { motion } from 'framer-motion';

export function StarCanvasSkeleton() {
  return (
    <div className="relative h-[calc(100vh-6rem)] bg-gradient-to-b from-slate-950 via-purple-950/20 to-slate-950">
      {/* Animated shimmer effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/5 to-transparent animate-shimmer" />
      
      {/* Pulsing stars */}
      <div className="absolute inset-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-slate-700 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.3, 0.6, 0.3],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>

      {/* Loading text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="text-4xl mb-4">✨</div>
          <div className="text-slate-400 text-lg">Loading constellation...</div>
        </motion.div>
      </div>
    </div>
  );
}

export function StarListSkeleton() {
  return (
    <div className="space-y-4 p-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-800/30 rounded-lg p-4 border border-slate-700/50 animate-pulse"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="h-6 w-24 bg-slate-700 rounded-full" />
            <div className="h-6 w-16 bg-slate-700 rounded-full" />
          </div>
          <div className="space-y-2">
            <div className="h-4 bg-slate-700 rounded w-full" />
            <div className="h-4 bg-slate-700 rounded w-5/6" />
            <div className="h-4 bg-slate-700 rounded w-4/6" />
          </div>
          <div className="mt-3 flex items-center gap-4">
            <div className="h-4 w-20 bg-slate-700 rounded" />
            <div className="h-4 w-24 bg-slate-700 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
