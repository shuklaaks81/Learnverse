"use client";

import { useEffect, useState } from 'react';
import { performanceMonitor, PerformanceStats } from '@/utils/performanceMonitor';

export function PerformanceManager({ children }: { children: React.ReactNode }) {
  const [stats, setStats] = useState<PerformanceStats | null>(null);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');

  useEffect(() => {
    // Check if anti-lag is enabled
    const checkSettings = () => {
      const settings = localStorage.getItem('parentSettings');
      if (settings) {
        try {
          const parsed = JSON.parse(settings);
          if (parsed.performance?.antiLag) {
            performanceMonitor.setEnabled(true);
          }
        } catch (e) {
          // Ignore
        }
      }
    };

    checkSettings();

    // Subscribe to performance updates
    const unsubscribe = performanceMonitor.subscribe((newStats) => {
      setStats(newStats);
      
      // Apply performance mode class to body
      if (typeof document !== 'undefined') {
        document.body.classList.remove(
          'perf-normal',
          'perf-simplified',
          'perf-overdrive',
          'perf-emergency',
          'perf-nuclear'
        );
        document.body.classList.add(`perf-${newStats.mode}`);
      }
    });

    // Listen for mode changes
    const handleModeChange = (event: CustomEvent) => {
      const { mode, fps } = event.detail;
      
      let message = '';
      if (mode === 'replenish') {
        message = `🔄 APP REPLENISHER ACTIVE! REBUILDING... (${Math.round(fps)} FPS)`;
      } else if (mode === 'restart') {
        message = `💀 RESTART MODE! LAG TOO STRONG! (${Math.round(fps)} FPS)`;
      } else if (mode === 'emergency') {
        message = `🚨 EMERGENCY MODE ACTIVATED! (${Math.round(fps)} FPS)`;
      } else if (mode === 'nuclear') {
        message = `☢️ NUCLEAR ANTI-LAG! DESTROYING EVERYTHING! (${Math.round(fps)} FPS)`;
      } else if (mode === 'simplified') {
        message = `⚡ Performance mode: Simplified (${Math.round(fps)} FPS)`;
      } else if (mode === 'overdrive') {
        message = `🔥 Performance mode: Overdrive (${Math.round(fps)} FPS)`;
      } else if (mode === 'normal') {
        message = `✅ Performance restored (${Math.round(fps)} FPS)`;
      }
      
      if (message) {
        setNotificationMessage(message);
        setShowNotification(true);
        setTimeout(() => setShowNotification(false), mode === 'nuclear' || mode === 'emergency' || mode === 'restart' || mode === 'replenish' ? 6000 : 4000);
      }
    };

    window.addEventListener('performanceModeChange', handleModeChange as EventListener);

    return () => {
      unsubscribe();
      window.removeEventListener('performanceModeChange', handleModeChange as EventListener);
    };
  }, []);

  return (
    <>
      {children}
      
      {/* Performance mode notification */}
      {showNotification && (
        <div className="fixed top-4 right-4 z-[9999] animate-slideInRight">
          <div className={`px-6 py-4 rounded-2xl shadow-2xl border-2 font-bold text-white ${
            stats?.mode === 'replenish'
              ? 'bg-gradient-to-r from-cyan-600 to-blue-600 border-cyan-400 animate-pulse'
              : stats?.mode === 'restart'
              ? 'bg-black border-red-600 animate-pulse text-5xl'
              : stats?.mode === 'nuclear'
              ? 'bg-black border-red-600 animate-pulse'
              : stats?.mode === 'emergency'
              ? 'bg-purple-900 border-purple-600 animate-pulse'
              : stats?.mode === 'overdrive' 
              ? 'bg-red-600 border-red-400' 
              : stats?.mode === 'simplified'
              ? 'bg-orange-600 border-orange-400'
              : 'bg-green-600 border-green-400'
          }`}>
            {notificationMessage}
          </div>
        </div>
      )}

      {/* FPS counter (optional, only in dev mode) */}
      {process.env.NODE_ENV === 'development' && stats?.isMonitoring && (
        <div className="fixed bottom-4 right-4 z-[9999] bg-black/80 text-white px-4 py-2 rounded-lg text-sm font-mono">
          <div>FPS: {stats.currentFPS}</div>
          <div>Avg: {Math.round(stats.averageFPS)}</div>
          <div>Mode: {stats.mode}</div>
        </div>
      )}

      <style jsx global>{`
        /* Performance mode styles */
        
        /* NORMAL mode - full features */
        body.perf-normal {
          /* All features enabled */
        }
        
        /* SIMPLIFIED mode - reduced animations */
        body.perf-simplified {
          /* Disable heavy animations */
          animation-duration: 0.5s !important;
        }
        
        body.perf-simplified * {
          animation-duration: 0.5s !important;
        }
        
        body.perf-simplified [class*="animate-gradient"] {
          animation: none !important;
        }
        
        body.perf-simplified [class*="animate-spin"] {
          animation: none !important;
        }
        
        body.perf-simplified .blur-3xl {
          filter: none !important;
        }
        
        body.perf-simplified .backdrop-blur {
          backdrop-filter: none !important;
        }
        
        /* OVERDRIVE mode - minimal features */
        body.perf-overdrive * {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
        
        body.perf-overdrive [class*="shadow"] {
          box-shadow: none !important;
        }
        
        body.perf-overdrive [class*="blur"] {
          filter: none !important;
        }
        
        body.perf-overdrive .backdrop-blur {
          backdrop-filter: none !important;
        }
        
        body.perf-overdrive [class*="gradient"] {
          background: #6366f1 !important;
        }
        
        /* EMERGENCY mode - aggressive optimization */
        body.perf-emergency * {
          animation: none !important;
          transition: none !important;
          transform: none !important;
        }
        
        body.perf-emergency {
          background: #1a1a1a !important;
        }
        
        /* NUCLEAR mode - handled by performanceMonitor.ts directly */
        /* Nuclear mode injects its own stylesheet to override everything */
        
        /* Notification animations */
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slideInRight {
          animation: slideInRight 0.3s ease-out;
        }
      `}</style>
    </>
  );
}
