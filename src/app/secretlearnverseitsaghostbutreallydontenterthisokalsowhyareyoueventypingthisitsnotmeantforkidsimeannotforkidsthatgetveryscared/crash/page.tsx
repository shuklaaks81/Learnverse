"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CrashPage() {
  const router = useRouter();
  const [showRestore, setShowRestore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [crashText, setCrashText] = useState('CRITICAL ERROR');

  useEffect(() => {
    // Creepy text changes
    const textInterval = setInterval(() => {
      const texts = [
        'CRITICAL ERROR',
        'ALL DATA LOST',
        'CANNOT RECOVER',
        'SYSTEM CORRUPTED',
        '404 NOT FOUND',
        'MEMORY WIPED',
        'FATAL EXCEPTION'
      ];
      setCrashText(texts[Math.floor(Math.random() * texts.length)]);
    }, 2000);

    // Show restore button after 5 seconds
    setTimeout(() => {
      setShowRestore(true);
    }, 5000);

    return () => clearInterval(textInterval);
  }, []);

  const handleRestore = () => {
    setLoading(true);
    
    if (typeof window !== 'undefined') {
      // Get the ghost backup
      const backupData = localStorage.getItem('__ghost_backup__');
      
      if (backupData) {
        try {
          const backup = JSON.parse(backupData);
          
          // Restore all the data
          if (backup.currentKid) {
            localStorage.setItem('currentKid', backup.currentKid);
          }
          if (backup.kidAccounts) {
            localStorage.setItem('kidAccounts', backup.kidAccounts);
          }
          if (backup.aiBuddies) {
            localStorage.setItem('aiBuddies', backup.aiBuddies);
          }
          
          // Restore custom pages and other data
          Object.entries(backup.customPages).forEach(([key, value]) => {
            localStorage.setItem(key, value as string);
          });
          
          // Remove the ghost backup
          localStorage.removeItem('__ghost_backup__');
          
          // Wait a moment for dramatic effect
          setTimeout(() => {
            router.push('/kid');
          }, 2000);
        } catch (error) {
          console.error('Restore failed:', error);
          router.push('/kid');
        }
      } else {
        // No backup found, just go back
        router.push('/kid');
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 relative overflow-hidden">
      {/* Red glitch overlay */}
      <div className="fixed inset-0 bg-red-900 opacity-20 animate-pulse" />
      
      {/* Static lines */}
      <div className="fixed inset-0 pointer-events-none opacity-10">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-full h-px bg-white"
            style={{
              top: `${i * 5}%`,
              animation: `glitchLine ${0.5 + Math.random()}s infinite`
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-3xl w-full text-center">
        {/* Skull or error symbol */}
        <div className="text-9xl mb-8 animate-pulse">
          💀
        </div>

        {/* Glitching error text */}
        <h1 
          className="text-6xl md:text-8xl font-bold mb-6 animate-pulse"
          style={{
            textShadow: '5px 5px 15px rgba(255,0,0,0.8), -5px -5px 15px rgba(255,0,0,0.5)',
            animation: 'glitchText 0.5s infinite'
          }}
        >
          {crashText}
        </h1>

        <div className="space-y-4 text-xl md:text-2xl text-red-400 mb-12">
          <p className="animate-pulse">⚠️ The system has encountered a fatal error ⚠️</p>
          <p className="text-lg text-gray-400">All accounts have been deleted...</p>
          <p className="text-lg text-gray-400">All progress has been lost...</p>
          <p className="text-lg text-gray-400">Everything is gone...</p>
        </div>

        {/* Fake error code */}
        <div className="bg-red-950 border-2 border-red-600 p-6 rounded-lg mb-8 font-mono text-left text-sm">
          <p className="text-red-400">Error Code: 0xGH057</p>
          <p className="text-red-400">Memory: CORRUPTED</p>
          <p className="text-red-400">Accounts: 0 found</p>
          <p className="text-red-400">Data: UNRECOVERABLE</p>
          <p className="text-gray-500 mt-4">at ghostDimension.corrupt()</p>
          <p className="text-gray-500">at shadowRealm.destroy()</p>
          <p className="text-gray-500">at learnverse.obliterate()</p>
        </div>

        {showRestore && (
          <div className="animate-fade-in">
            <p className="text-sm text-gray-500 mb-4 animate-pulse">
              ...or is it? 👁️
            </p>
            <button
              onClick={handleRestore}
              disabled={loading}
              className="px-8 py-4 bg-purple-600 text-white rounded-lg text-xl font-bold hover:bg-purple-700 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Restoring Reality... 🌀' : 'Try to Log Back In... 👻'}
            </button>
            <p className="text-xs text-gray-600 mt-4">
              (What's the worst that could happen?)
            </p>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes glitchLine {
          0%, 100% { 
            transform: translateX(0); 
            opacity: 0.1;
          }
          50% { 
            transform: translateX(100%); 
            opacity: 0.3;
          }
        }
        @keyframes glitchText {
          0% {
            transform: translate(0);
          }
          20% {
            transform: translate(-3px, 3px);
          }
          40% {
            transform: translate(-3px, -3px);
          }
          60% {
            transform: translate(3px, 3px);
          }
          80% {
            transform: translate(3px, -3px);
          }
          100% {
            transform: translate(0);
          }
        }
        .animate-fade-in {
          animation: fadeIn 1s ease-in;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
