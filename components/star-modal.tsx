'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
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
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);
  
  const handleReact = async () => {
    try {
      await onReact(star.id);
      toast.success('❤️ Reaction added!');
    } catch (error) {
      console.error('Failed to react:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to add reaction');
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
        role="dialog"
        aria-modal="true"
        aria-labelledby="star-modal-title"
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
            aria-label="Close modal"
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
            <p id="star-modal-title" className="text-lg text-white leading-relaxed">
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
          <div className="space-y-4 pt-6 border-t border-slate-700/50">
            {/* Stats row */}
            <div className="flex items-center gap-4 text-sm text-slate-400">
              <div className="flex items-center gap-1">
                <span>❤️</span>
                <span>{star.brightness} reactions</span>
              </div>
              <div>
                {new Date(star.createdAt).toLocaleDateString()}
              </div>
            </div>

            {/* Actions row */}
            <div className="flex items-center gap-3">
              <button
                onClick={handleReact}
                className="flex-1 px-6 py-2 bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white font-medium rounded-lg transition-all shadow-lg shadow-purple-500/20"
                aria-label={`React to this star. Current reactions: ${star.brightness}`}
              >
                React ❤️
              </button>
              
              <button
                onClick={() => {
                  const url = `${window.location.origin}?star=${star.id}`;
                  navigator.clipboard.writeText(url);
                  toast.success('Link copied to clipboard!');
                }}
                className="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-lg transition-all border border-slate-600"
                aria-label="Share this star"
                title="Copy link to this star"
              >
                🔗 Share
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
