'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import StarCanvas from '@/components/star-canvas';
import StarForm, { StarFormData } from '@/components/star-form';
import StarModal from '@/components/star-modal';
import { THEMES } from '@/lib/constants';

interface Star {
  id: string;
  message: string;
  theme: string;
  posX: number;
  posY: number;
  brightness: number;
  createdAt: string;
  hasTwin: boolean;
  twinLink?: {
    id: string;
    posX: number;
    posY: number;
  } | null;
}

export default function ConstellationPage() {
  const [showForm, setShowForm] = useState(false);
  const [selectedStar, setSelectedStar] = useState<Star | null>(null);
  const [themeFilter, setThemeFilter] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch stars
  const { data: starsData, isLoading } = useQuery({
    queryKey: ['stars', themeFilter],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (themeFilter) params.append('theme', themeFilter);
      
      const res = await fetch(`/api/stars?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch stars');
      return res.json();
    },
    refetchInterval: 10000, // Refetch every 10 seconds for live updates
  });

  const stars: Star[] = starsData?.stars || [];

  // Create star mutation
  const createStarMutation = useMutation({
    mutationFn: async (data: StarFormData) => {
      const res = await fetch('/api/stars', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to create star');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stars'] });
    },
  });

  // React to star mutation
  const reactMutation = useMutation({
    mutationFn: async (starId: string) => {
      const res = await fetch(`/api/stars/${starId}/react`, {
        method: 'POST',
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to react');
      }
      
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['stars'] });
      setSelectedStar(null);
    },
  });

  const handleCreateStar = async (data: StarFormData) => {
    await createStarMutation.mutateAsync(data);
  };

  const handleReact = async (starId: string) => {
    await reactMutation.mutateAsync(starId);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-purple-950">
      {/* Header */}
      <header className="relative z-10 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                ⭐ Love Constellations
              </h1>
              <p className="text-slate-400 text-sm">
                Anonymous messages that become stars
              </p>
            </div>
            
            <button
              onClick={() => setShowForm(true)}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-semibold rounded-lg transition-all shadow-lg shadow-purple-500/20"
            >
              ✨ Write a Star
            </button>
          </div>
        </div>
      </header>

      {/* Theme Filter */}
      <div className="relative z-10 border-b border-slate-800/50 bg-slate-950/60 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <button
              onClick={() => setThemeFilter(null)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                themeFilter === null
                  ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                  : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
              }`}
            >
              🌌 All Themes
            </button>
            
            {THEMES.map((theme) => (
              <button
                key={theme.value}
                onClick={() => setThemeFilter(theme.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
                  themeFilter === theme.value
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-500/30'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                {theme.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Star Field */}
      <div className="relative flex-1" style={{ height: 'calc(100vh - 180px)' }}>
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-lg">Loading constellation...</div>
          </div>
        ) : (
          <>
            {/* Ambient stars background */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 50 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 bg-white rounded-full opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    opacity: [0.1, 0.5, 0.1],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 2,
                  }}
                />
              ))}
            </div>

            {/* Interactive star canvas */}
            <StarCanvas
              stars={stars.map(star => ({
                ...star,
                createdAt: new Date(star.createdAt),
              }))}
              onStarClick={(star) => setSelectedStar({
                ...star,
                createdAt: star.createdAt.toISOString(),
              })}
            />

            {/* Star count */}
            <div className="absolute bottom-4 left-4 px-4 py-2 bg-slate-950/80 backdrop-blur-sm border border-slate-700/50 rounded-lg text-slate-300 text-sm">
              ✨ {stars.length} stars in the sky
            </div>
          </>
        )}
      </div>

      {/* Modals */}
      {showForm && (
        <StarForm
          onSubmit={handleCreateStar}
          onClose={() => setShowForm(false)}
        />
      )}

      {selectedStar && (
        <StarModal
          star={{
            ...selectedStar,
            createdAt: new Date(selectedStar.createdAt),
          }}
          onClose={() => setSelectedStar(null)}
          onReact={handleReact}
        />
      )}
    </div>
  );
}
