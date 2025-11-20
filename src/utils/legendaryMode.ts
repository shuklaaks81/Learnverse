'use client';

import { useEffect, useState } from 'react';

export function useLegendaryMode() {
  const [isLegendary, setIsLegendary] = useState(false);

  useEffect(() => {
    const legendary = localStorage.getItem('legendaryMode') === 'true';
    setIsLegendary(legendary);
  }, []);

  return isLegendary;
}

export function getLegendaryStyles() {
  const isLegendary = typeof window !== 'undefined' && localStorage.getItem('legendaryMode') === 'true';
  
  if (!isLegendary) {
    return {
      background: 'bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300',
      card: 'bg-white',
      text: 'text-gray-800',
      accent: 'text-orange-600',
      button: 'bg-gradient-to-r from-orange-400 to-pink-400'
    };
  }

  // 🔮 LEGENDARY CYBERPUNK THEME
  return {
    background: 'bg-gradient-to-br from-purple-900 via-black to-cyan-900',
    card: 'bg-gradient-to-br from-purple-800/50 via-pink-900/50 to-cyan-900/50 backdrop-blur-xl border-2 border-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.5)]',
    text: 'text-cyan-300',
    accent: 'text-pink-400',
    button: 'bg-gradient-to-r from-purple-600 via-pink-500 to-cyan-500 shadow-[0_0_20px_rgba(236,72,153,0.6)]'
  };
}
