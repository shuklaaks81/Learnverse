"use client";

/**
 * TourIndicator Component
 * 
 * Shows a small badge when the onboarding tour is active
 * Helps users know they're in tutorial mode
 */

interface TourIndicatorProps {
  message?: string;
  isPremium?: boolean;
}

export function TourIndicator({ message = "Tour Active", isPremium = false }: TourIndicatorProps) {
  return (
    <div className="fixed top-4 right-4 z-[9999] animate-float">
      <div className={`flex items-center gap-2 px-4 py-2 rounded-full shadow-2xl ${
        isPremium 
          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 border-2 border-cyan-400 shadow-[0_0_20px_rgba(0,255,255,0.5)]'
          : 'bg-gradient-to-r from-purple-500 to-pink-500 border-2 border-white'
      }`}>
        <span className="animate-pulse text-2xl">🎯</span>
        <span className="text-white font-bold text-sm">{message}</span>
      </div>
      
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
