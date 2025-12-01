'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { THEMES } from '@/lib/constants';

interface StarFormProps {
  onSubmit: (data: StarFormData) => Promise<void>;
  onClose: () => void;
}

export interface StarFormData {
  message: string;
  theme: string;
  initials?: string;
  birthMonth?: string;
}

export default function StarForm({ onSubmit, onClose }: StarFormProps) {
  const [message, setMessage] = useState('');
  const [theme, setTheme] = useState('');
  const [initials, setInitials] = useState('');
  const [birthMonth, setBirthMonth] = useState('');
  const [showSecretCode, setShowSecretCode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, isSubmitting]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!message || !theme) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    if (message.length < 10 || message.length > 500) {
      toast.error('Message must be between 10 and 500 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        message,
        theme,
        initials: showSecretCode && initials ? initials : undefined,
        birthMonth: showSecretCode && birthMonth ? birthMonth : undefined,
      });
      
      toast.success('✨ Your star has been created!');
      
      // Reset form
      setMessage('');
      setTheme('');
      setInitials('');
      setBirthMonth('');
      onClose();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : 'Failed to create star';
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
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
        aria-labelledby="star-form-title"
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-2xl bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl border border-slate-700/50 shadow-2xl p-8"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Close form"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="mb-6">
            <h2 id="star-form-title" className="text-3xl font-bold text-white mb-2">
              ✨ Write Your Star
            </h2>
            <p className="text-slate-400">
              Share your unsent love message with the universe
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Message */}
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-slate-300 mb-2">
                Your Message *
              </label>
              <textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write what your heart couldn't say..."
                rows={5}
                maxLength={500}
                className="w-full px-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              />
              <div className="mt-1 text-sm text-slate-400 text-right">
                {message.length}/500
              </div>
            </div>

            {/* Theme */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-3">
                Theme *
              </label>
              <div className="grid grid-cols-2 gap-3">
                {THEMES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTheme(t.value)}
                    className={`p-4 rounded-lg border transition-all text-left ${
                      theme === t.value
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                        : 'border-slate-600 bg-slate-800/30 hover:border-slate-500'
                    }`}
                  >
                    <div className="text-lg mb-1">{t.label}</div>
                    <div className="text-xs text-slate-400">{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Secret Code (Optional) */}
            <div>
              <button
                type="button"
                onClick={() => setShowSecretCode(!showSecretCode)}
                className="flex items-center gap-2 text-sm text-purple-400 hover:text-purple-300 transition-colors mb-3"
              >
                <span>{showSecretCode ? '▼' : '▶'}</span>
                <span>Add Secret Code (Twin Star Match)</span>
              </button>
              
              <AnimatePresence>
                {showSecretCode && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="space-y-3 overflow-hidden"
                  >
                    <p className="text-sm text-slate-400">
                      If someone else posts with the same initials and birth month, your stars will be connected ✨
                    </p>
                    <div className="flex gap-3">
                      <div className="flex-1">
                        <label htmlFor="initials" className="block text-xs text-slate-400 mb-1">
                          Initials
                        </label>
                        <input
                          type="text"
                          id="initials"
                          value={initials}
                          onChange={(e) => setInitials(e.target.value.toUpperCase())}
                          placeholder="DA"
                          maxLength={4}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                      </div>
                      <div className="flex-1">
                        <label htmlFor="birthMonth" className="block text-xs text-slate-400 mb-1">
                          Birth Month
                        </label>
                        <select
                          id="birthMonth"
                          value={birthMonth}
                          onChange={(e) => setBirthMonth(e.target.value)}
                          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
                        >
                          <option value="">Select</option>
                          {Array.from({ length: 12 }, (_, i) => {
                            const month = (i + 1).toString().padStart(2, '0');
                            return (
                              <option key={month} value={month}>
                                {new Date(2000, i).toLocaleString('default', { month: 'long' })}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            {error && (
              <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm">
                {error}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 disabled:from-slate-600 disabled:to-slate-700 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
            >
              {isSubmitting ? 'Creating Star...' : '✨ Create Star'}
            </button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
