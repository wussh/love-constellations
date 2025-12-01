'use client';

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
}

interface StarModalProps {
  star: Star | null;
  onClose: () => void;
  onReact: (starId: string) => Promise<void>;
}

export default function StarModal({ star, onClose, onReact }: StarModalProps) {
  if (!star) return null;

  const theme = THEMES.find((t) => t.value === star.theme);
  
  const handleReact = async () => {
    try {
      await onReact(star.id);
    } catch (error) {
      console.error('Failed to react:', error);
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9, y: 20, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.9, y: 20, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-lg bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-700/50 shadow-2xl p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Theme badge */}
          <div className="mb-4">
            <span className="inline-block px-4 py-2 bg-purple-500/20 border border-purple-500/50 rounded-full text-purple-300 text-sm font-medium">
              {theme?.label || star.theme}
            </span>
          </div>

          {/* Message */}
          <div className="mb-6">
            <p className="text-lg text-white leading-relaxed">
              "{star.message}"
            </p>
          </div>

          {/* Twin star badge */}
          {star.hasTwin && (
            <div className="mb-6 p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg">
              <div className="flex items-center gap-2 text-purple-300">
                <span className="text-xl">✨</span>
                <span className="text-sm font-medium">Twin Star Found</span>
              </div>
              <p className="text-xs text-slate-400 mt-1">
                This message shares a secret connection with another star
              </p>
            </div>
          )}

          {/* Stats and actions */}
          <div className="flex items-center justify-between pt-6 border-t border-slate-700/50">
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{star.brightness} reactions</span>
              </div>
              <div>
                {new Date(star.createdAt).toLocaleDateString()}
              </div>
            </div>

            <button
              onClick={handleReact}
              className="px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/20"
            >
              React ❤️
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
