'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function LiveVisitorCount() {
  const [visitorCount, setVisitorCount] = useState<number>(1);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Generate a unique session ID
    const sessionId = `session-${Date.now()}-${Math.random()}`;
    
    // Show indicator after a brief delay
    setTimeout(() => setIsVisible(true), 500);

    // Heartbeat to update presence
    const sendHeartbeat = async () => {
      try {
        const res = await fetch('/api/presence', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sessionId }),
        });
        
        if (res.ok) {
          const data = await res.json();
          setVisitorCount(data.count || 1);
        }
      } catch (error) {
        console.error('Failed to update presence:', error);
      }
    };

    // Send initial heartbeat
    sendHeartbeat();

    // Send heartbeat every 30 seconds
    const interval = setInterval(sendHeartbeat, 30000);

    // Cleanup on unmount
    return () => {
      clearInterval(interval);
      
      // Send final heartbeat to remove presence
      fetch('/api/presence', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId }),
      }).catch(() => {
        // Ignore errors on cleanup
      });
    };
  }, []);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="px-4 py-2 bg-slate-950/90 backdrop-blur-sm border border-purple-500/30 rounded-full shadow-lg shadow-purple-500/10">
            <div className="flex items-center gap-2">
              {/* Pulsing dot indicator */}
              <motion.div
                className="w-2 h-2 bg-green-400 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [1, 0.7, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              />
              
              <span className="text-sm text-slate-300">
                <motion.span
                  key={visitorCount}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="font-semibold text-white"
                >
                  {visitorCount}
                </motion.span>
                {' '}
                {visitorCount === 1 ? 'stargazer' : 'stargazers'} online
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
