"use client";

import { useState } from 'react';
import { usePerformance, PerformanceMode } from '@/hooks/usePerformance';

/**
 * 🎮 PERFORMANCE INDICATOR 🎮
 * 
 * Shows current FPS and quality settings
 * Allows manual performance mode switching
 */

export function PerformanceIndicator() {
  const [isExpanded, setIsExpanded] = useState(false);
  const { settings, changeMode } = usePerformance();

  const getFPSColor = () => {
    if (settings.fps >= 45) return 'text-green-400';
    if (settings.fps >= 30) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getQualityColor = () => {
    if (settings.currentQuality === 'high') return 'bg-gradient-to-r from-green-500 to-emerald-500';
    if (settings.currentQuality === 'medium') return 'bg-gradient-to-r from-yellow-500 to-orange-500';
    return 'bg-gradient-to-r from-red-500 to-pink-500';
  };

  const getQualityEmoji = () => {
    if (settings.currentQuality === 'high') return '⚡';
    if (settings.currentQuality === 'medium') return '⚙️';
    return '🐢';
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Collapsed View */}
      {!isExpanded && (
        <button
          onClick={() => setIsExpanded(true)}
          className="bg-black/60 backdrop-blur-xl border-2 border-white/20 rounded-2xl px-4 py-3 text-white font-bold shadow-lg hover:scale-105 transition-all duration-300"
        >
          <div className="flex items-center gap-2">
            <span className="text-2xl">{getQualityEmoji()}</span>
            <div className="flex flex-col items-start">
              <span className={`text-xs ${getFPSColor()}`}>{settings.fps} FPS</span>
              <span className="text-[10px] text-white/70">{settings.currentQuality.toUpperCase()}</span>
            </div>
          </div>
        </button>
      )}

      {/* Expanded View */}
      {isExpanded && (
        <div className="bg-black/80 backdrop-blur-2xl border-2 border-white/30 rounded-3xl p-6 text-white shadow-2xl min-w-[280px] animate-slide-up">
          {/* Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <span>🎮</span>
              Performance
            </h3>
            <button
              onClick={() => setIsExpanded(false)}
              className="text-white/60 hover:text-white text-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* FPS Display */}
          <div className="bg-white/10 rounded-xl p-4 mb-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-white/70">Frames Per Second</span>
              <span className={`text-2xl font-bold ${getFPSColor()}`}>{settings.fps}</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-2 overflow-hidden">
              <div
                className={`h-full ${settings.fps >= 45 ? 'bg-green-400' : settings.fps >= 30 ? 'bg-yellow-400' : 'bg-red-400'} transition-all duration-300`}
                style={{ width: `${Math.min((settings.fps / 60) * 100, 100)}%` }}
              />
            </div>
          </div>

          {/* Current Quality */}
          <div className="mb-4">
            <div className="text-sm text-white/70 mb-2">Current Quality</div>
            <div className={`${getQualityColor()} rounded-xl p-3 text-center font-bold`}>
              <span className="text-2xl mr-2">{getQualityEmoji()}</span>
              {settings.currentQuality.toUpperCase()}
              {settings.mode === 'auto' && ' (Auto)'}
            </div>
          </div>

          {/* Performance Stats */}
          <div className="bg-white/10 rounded-xl p-3 mb-4 text-xs space-y-1">
            <div className="flex justify-between">
              <span className="text-white/70">Stars:</span>
              <span className="font-bold">{settings.starCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Objects:</span>
              <span className="font-bold">{settings.objectCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Blur Effects:</span>
              <span className="font-bold">{settings.enableBlur ? '✅' : '❌'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/70">Shadows:</span>
              <span className="font-bold">{settings.enableShadows ? '✅' : '❌'}</span>
            </div>
          </div>

          {/* Mode Selection */}
          <div className="space-y-2">
            <div className="text-sm text-white/70 mb-2">Performance Mode</div>
            
            <button
              onClick={() => changeMode('auto')}
              className={`w-full py-2 px-4 rounded-xl font-bold transition-all duration-300 ${
                settings.mode === 'auto'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-500 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              🤖 Auto (Recommended)
            </button>

            <button
              onClick={() => changeMode('high')}
              className={`w-full py-2 px-4 rounded-xl font-bold transition-all duration-300 ${
                settings.mode === 'high'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              ⚡ High Quality
            </button>

            <button
              onClick={() => changeMode('medium')}
              className={`w-full py-2 px-4 rounded-xl font-bold transition-all duration-300 ${
                settings.mode === 'medium'
                  ? 'bg-gradient-to-r from-yellow-500 to-orange-500 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              ⚙️ Medium Quality
            </button>

            <button
              onClick={() => changeMode('low')}
              className={`w-full py-2 px-4 rounded-xl font-bold transition-all duration-300 ${
                settings.mode === 'low'
                  ? 'bg-gradient-to-r from-red-500 to-pink-500 shadow-lg scale-105'
                  : 'bg-white/10 hover:bg-white/20'
              }`}
            >
              🐢 Low Quality (Best Performance)
            </button>
          </div>

          {/* Info Text */}
          <div className="mt-4 text-[10px] text-white/50 text-center">
            {settings.mode === 'auto' && '🤖 Auto mode adjusts quality based on FPS'}
            {settings.mode !== 'auto' && '💡 Switch to Auto for best experience'}
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}
