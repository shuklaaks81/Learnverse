"use client";

import { useEffect, useState } from "react";

export default function ConditionalOceanBg() {
  const [isPremium, setIsPremium] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('learnverseVersion') || 'original';
      setIsPremium(version === 'premium');
      
      // Listen for version changes
      const handleStorageChange = () => {
        const version = localStorage.getItem('learnverseVersion') || 'original';
        setIsPremium(version === 'premium');
      };
      
      window.addEventListener('storage', handleStorageChange);
      return () => window.removeEventListener('storage', handleStorageChange);
    }
  }, []);

  // Don't show ocean background in premium mode
  if (isPremium) {
    return null;
  }

  return (
    <div className="ocean-bg">
      {/* Ripples */}
      <div className="ripple" style={{top: '20%', left: '30%', width: 120, height: 120, animationDelay: '0s'}}></div>
      <div className="ripple" style={{top: '60%', left: '60%', width: 180, height: 180, animationDelay: '1.5s'}}></div>
      <div className="ripple" style={{top: '40%', left: '70%', width: 90, height: 90, animationDelay: '2.5s'}}></div>
      <div className="ripple" style={{top: '75%', left: '20%', width: 150, height: 150, animationDelay: '3s'}}></div>
    </div>
  );
}
