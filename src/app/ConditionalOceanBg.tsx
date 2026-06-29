"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export default function ConditionalOceanBg() {
  const [isPremium, setIsPremium] = useState(false);
  const pathname = usePathname();

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

  // 🚀 PERFORMANCE: Skip heavy animations on login/landing pages
  const isLightPage = pathname === '/' || 
                       pathname?.includes('/login') || 
                       pathname?.includes('/welcome') ||
                       pathname?.includes('/kid-selector');

  if (isLightPage) {
    // Simple gradient background without animations for login pages
    return (
      <div className="ocean-bg" style={{ animation: 'none' }}>
        {/* No ripples on login/light pages for better performance */}
      </div>
    );
  }

  return (
    <div className="ocean-bg">
      {/* Ripples - only on main app pages */}
      <div className="ripple" style={{top: '20%', left: '30%', width: 120, height: 120, animationDelay: '0s'}}></div>
      <div className="ripple" style={{top: '60%', left: '60%', width: 180, height: 180, animationDelay: '1.5s'}}></div>
      <div className="ripple" style={{top: '40%', left: '70%', width: 90, height: 90, animationDelay: '2.5s'}}></div>
      <div className="ripple" style={{top: '75%', left: '20%', width: 150, height: 150, animationDelay: '3s'}}></div>
    </div>
  );
}
