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
      className={`group relative ${
        isSpaceMode
          ? 'bg-purple-900/20 backdrop-blur-xl border-2 border-purple-400/40'
          : isRealisticMode
          ? 'bg-white/10 backdrop-blur-xl border-2 border-white/30'
          : `${gradient} border-2 border-white/20`
      } rounded-2xl p-6 cursor-pointer transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden`}
      style={{
        transform: 'translateZ(0)',
        ...(isSpaceMode ? {
          boxShadow: '0 10px 40px rgba(168, 85, 247, 0.4), 0 2px 10px rgba(0,0,0,0.3), inset 0 0 60px rgba(139, 92, 246, 0.1)',
        } : isRealisticMode ? {
          boxShadow: '0 10px 40px rgba(31, 38, 135, 0.3), 0 4px 12px rgba(0, 0, 0, 0.25)',
        } : {
          boxShadow: '0 10px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)',
        })
      }}
      onMouseEnter={(e) => {
        const card = e.currentTarget;
        card.style.transform = 'translateY(-8px) translateZ(30px) rotateX(2deg)';
        card.style.boxShadow = isSpaceMode 
          ? '0 20px 60px rgba(168, 85, 247, 0.6), 0 10px 20px rgba(0,0,0,0.4), inset 0 0 80px rgba(139, 92, 246, 0.2)'
          : isRealisticMode
          ? '0 20px 60px rgba(31, 38, 135, 0.5), 0 10px 25px rgba(0, 0, 0, 0.35)'
          : '0 20px 50px rgba(0,0,0,0.4), 0 10px 20px rgba(0,0,0,0.3)';
      }}
      onMouseLeave={(e) => {
        const card = e.currentTarget;
        card.style.transform = 'translateY(0) translateZ(0) rotateX(0deg)';
        card.style.boxShadow = isSpaceMode
          ? '0 10px 40px rgba(168, 85, 247, 0.4), 0 2px 10px rgba(0,0,0,0.3), inset 0 0 60px rgba(139, 92, 246, 0.1)'
          : isRealisticMode
          ? '0 10px 40px rgba(31, 38, 135, 0.3), 0 4px 12px rgba(0, 0, 0, 0.25)'
          : '0 10px 30px rgba(0,0,0,0.3), 0 2px 8px rgba(0,0,0,0.2)';
      }}
    >
      {/* Premium gradient overlay */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
        <div className={`absolute inset-0 ${
          isSpaceMode 
            ? 'bg-gradient-to-br from-purple-400/20 via-transparent to-pink-400/20'
            : isRealisticMode
            ? 'bg-gradient-to-br from-white/15 via-transparent to-white/10'
            : 'bg-gradient-to-br from-white/10 via-transparent to-white/5'
        }`} />
      </div>

      {/* Animated shine effect */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-r ${
          isSpaceMode ? 'from-transparent via-purple-300/30 to-transparent' :
          isRealisticMode ? 'from-transparent via-white/40 to-transparent' :
          'from-transparent via-white/30 to-transparent'
        } translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000`} />
      </div>
      
      <span 
        className={`relative z-10 text-5xl mb-3 transition-all duration-500 group-hover:scale-110 group-hover:-translate-y-1 ${
          isSpaceMode ? 'drop-shadow-[0_0_12px_rgba(168,85,247,0.6)]' :
          isRealisticMode ? 'drop-shadow-[0_4px_8px_rgba(0,0,0,0.3)]' : 
          'drop-shadow-[0_4px_6px_rgba(0,0,0,0.3)]'
        }`}
        style={{
          filter: isSpaceMode 
            ? 'drop-shadow(0 0 12px rgba(168,85,247,0.6)) drop-shadow(0 5px 10px rgba(0,0,0,0.4))'
            : isRealisticMode
            ? 'drop-shadow(0 4px 8px rgba(0,0,0,0.3)) drop-shadow(0 8px 16px rgba(0,0,0,0.2))'
            : 'drop-shadow(0 4px 6px rgba(0,0,0,0.3)) drop-shadow(0 8px 12px rgba(0,0,0,0.2))'
        }}
      >{emoji}</span>
      
      <h3 className={`relative z-10 text-xl font-bold mb-2 transition-all duration-300 ${
        isSpaceMode ? 'text-white drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]' :
        isRealisticMode ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]' : 
        'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.4)]'
      }`}
        style={{
          textShadow: isSpaceMode
            ? '0 0 8px rgba(168,85,247,0.8), 0 2px 4px rgba(0,0,0,0.5)'
            : isRealisticMode
            ? '0 2px 4px rgba(0,0,0,0.3), 0 4px 8px rgba(0,0,0,0.2)'
            : '0 2px 4px rgba(0,0,0,0.4), 0 4px 8px rgba(0,0,0,0.3)'
        }}
      >{title}</h3>
      
      <p className="relative z-10 text-sm text-white/90 transition-all duration-300"
         style={{
           textShadow: '0 1px 2px rgba(0,0,0,0.3)'
         }}
      >{description}</p>
      
      {/* Inner glow border effect */}
      <div className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
        isSpaceMode 
          ? 'shadow-[inset_0_0_20px_rgba(168,85,247,0.4)]' 
          : isRealisticMode
          ? 'shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]'
          : 'shadow-[inset_0_0_20px_rgba(255,255,255,0.15)]'
      }`} />
    </div>
  );
});
