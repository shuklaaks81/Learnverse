"use client";

import { useEffect, useState } from 'react';

export function SafeModeManager({ children }: { children: React.ReactNode }) {
  const [safeMode, setSafeMode] = useState(false);
  const [disabledComponents, setDisabledComponents] = useState<string[]>([]);
  const [reEnablingProgress, setReEnablingProgress] = useState(0);
  const [showBanner, setShowBanner] = useState(false);

  const exitSafeMode = () => {
    console.log('🎉 SAFE MODE EXITED - All components re-enabled!');
    localStorage.removeItem('app_safe_mode');
    localStorage.removeItem('disabled_components');
    setSafeMode(false);
    setTimeout(() => setShowBanner(false), 3000);
  };

  const startGradualReEnable = (components: string[]) => {
    if (components.length === 0) {
      exitSafeMode();
      return;
    }

    const totalTime = 30000; // 30 seconds
    const intervalTime = totalTime / components.length;
    let currentIndex = 0;

    const reEnableInterval = setInterval(() => {
      if (currentIndex >= components.length) {
        clearInterval(reEnableInterval);
        exitSafeMode();
        return;
      }

      const component = components[currentIndex];
      console.log(`✅ Re-enabling component: ${component}`);
      
      // Remove from disabled list
      setDisabledComponents(prev => prev.filter(c => c !== component));
      
      // Update progress
      const progress = ((currentIndex + 1) / components.length) * 100;
      setReEnablingProgress(progress);
      
      currentIndex++;
    }, intervalTime);
  };

  useEffect(() => {
    // Check if app is in safe mode
    const safeModeFlag = localStorage.getItem('app_safe_mode');
    const disabled = localStorage.getItem('disabled_components');
    
    if (safeModeFlag === 'true') {
      setSafeMode(true);
      setShowBanner(true);
      
      if (disabled) {
        try {
          const components = JSON.parse(disabled);
          setDisabledComponents(components);
          console.log('🛡️ SAFE MODE ACTIVE - Disabled components:', components);
          
          // Gradually re-enable components over 30 seconds
          startGradualReEnable(components);
        } catch (e) {
          console.error('Failed to parse disabled components:', e);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
      {children}
      
      {/* Safe Mode Banner */}
      {showBanner && safeMode && (
        <div className="fixed top-0 left-0 right-0 z-[99999] bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 shadow-2xl animate-slideDown">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-4xl animate-spin">🛡️</div>
                <div>
                  <div className="font-black text-xl">SAFE MODE ACTIVE</div>
                  <div className="text-sm opacity-90">
                    App Replenisher detected lag - {disabledComponents.length} components disabled
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-bold text-2xl">{Math.round(reEnablingProgress)}%</div>
                <div className="text-xs opacity-90">Re-enabling...</div>
              </div>
            </div>
            
            {/* Progress bar */}
            <div className="mt-3 bg-white/20 rounded-full h-3 overflow-hidden">
              <div 
                className="bg-white h-full transition-all duration-1000 ease-linear"
                style={{ width: `${reEnablingProgress}%` }}
              />
            </div>
            
            {/* Disabled components list */}
            <div className="mt-3 flex flex-wrap gap-2">
              {disabledComponents.map(comp => (
                <div 
                  key={comp}
                  className="bg-black/30 px-3 py-1 rounded-full text-xs font-bold border border-white/30"
                >
                  🚫 {comp}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      
      {/* Success banner when exiting safe mode */}
      {showBanner && !safeMode && (
        <div className="fixed top-0 left-0 right-0 z-[99999] bg-gradient-to-r from-green-500 to-emerald-500 text-white py-6 px-6 shadow-2xl animate-slideDown">
          <div className="max-w-7xl mx-auto text-center">
            <div className="text-6xl mb-2">🎉</div>
            <div className="font-black text-2xl mb-1">SAFE MODE EXITED!</div>
            <div className="text-sm opacity-90">All components successfully re-enabled</div>
          </div>
        </div>
      )}
    </>
  );
}
