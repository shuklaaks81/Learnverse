/**
 * FeatureCard Component
 * 
 * Displays a single feature card with:
 * - Icon/emoji
 * - Title and description
 * - Gradient background
 * - Hover animation
 * - Click handler for navigation
 * 
 * Optimized with React.memo to prevent unnecessary re-renders
 */

import { memo } from 'react';

export interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
  isRealisticMode?: boolean;
  isSpaceMode?: boolean;
}

export const FeatureCard = memo(function FeatureCard({
  emoji,
  title,
  description,
  gradient,
  onClick,
  isRealisticMode = false,
  isSpaceMode = false,
}: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={`relative ${
        isSpaceMode
          ? 'bg-purple-900/20 backdrop-blur-xl border-2 border-purple-400/40 shadow-[0_0_40px_rgba(168,85,247,0.4)]'
          : isRealisticMode
          ? 'bg-white/10 backdrop-blur-xl border-2 border-white/30 shadow-[0_8px_32px_rgba(31,38,135,0.37)]'
          : `${gradient} border-2 border-white/20 shadow-lg`
      } rounded-2xl p-6 cursor-pointer hover:scale-105 hover:shadow-2xl transition-all duration-300 flex flex-col items-center justify-center text-center overflow-hidden`}
      style={isSpaceMode ? {
        boxShadow: '0 0 40px rgba(168, 85, 247, 0.4), inset 0 0 60px rgba(139, 92, 246, 0.1)',
        transform: 'translateZ(20px)',
      } : isRealisticMode ? {
        boxShadow: '0 8px 32px rgba(31, 38, 135, 0.37), 0 4px 12px rgba(0, 0, 0, 0.2)',
        transform: 'translateZ(20px)',
      } : {}}
    >
      <span 
        className={`text-5xl mb-3 transition-all duration-300 ${
          isSpaceMode ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]' :
          isRealisticMode ? 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]' : ''
        }`}
      >{emoji}</span>
      <h3 className={`text-xl font-bold mb-2 ${
        isSpaceMode ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' :
        isRealisticMode ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 'text-white'
      }`}>{title}</h3>
      <p className="text-sm text-white/90">{description}</p>
      
      {/* Glass shine effect */}
      {(isRealisticMode || isSpaceMode) && (
        <div className={`absolute inset-0 rounded-2xl ${
          isSpaceMode 
            ? 'bg-gradient-to-br from-purple-400/10 via-transparent to-pink-400/10' 
            : 'bg-gradient-to-br from-white/10 via-transparent to-white/5'
        } pointer-events-none`} />
      )}
    </div>
  );
});
