"use client";
import React, { createContext, useContext, useState, useRef, useEffect } from "react";

// Types for secret event stages
const stages = [
  "idle","waiting","quirky","glitch","film","skull","whiteout","normal","rampage1","whiteout2","buzz","rampage2","reveal"
] as const;
type SecretStage = typeof stages[number] | null;

interface SecretEventContextType {
  showSecret: boolean;
  setShowSecret: (v: boolean) => void;
  secretStage: SecretStage;
  setSecretStage: (v: SecretStage) => void;
  waitingSeconds: number;
  triggerSecret: () => void;
}

const SecretEventContext = createContext<SecretEventContextType | undefined>(undefined);

export function useSecretEvent() {
  const ctx = useContext(SecretEventContext);
  if (!ctx) throw new Error("useSecretEvent must be used within SecretEventProvider");
  return ctx;
}

// Secret key listener for replaying intro
if (typeof window !== 'undefined') {
  window.addEventListener('keydown', (e) => {
    // Don't trigger if user is typing in an input/textarea
    const target = e.target as HTMLElement;
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
      return;
    }
    
    // Press 'I' for Intro replay
    if (e.key === 'i' || e.key === 'I') {
      localStorage.removeItem('introDone');
      window.location.reload();
    }
  });
}

export const SecretEventProvider = ({ children }: { children: React.ReactNode }) => {
  const [showSecret, setShowSecret] = useState(false);
  const [secretStage, setSecretStage] = useState<SecretStage>(null);
  const [waitingSeconds, setWaitingSeconds] = useState(120);
  const secretTimeouts = useRef<number[]>([]);

  // Helper: clear all timeouts
  const clearSecretTimeouts = () => {
    secretTimeouts.current.forEach((t) => clearTimeout(t));
    secretTimeouts.current = [];
  };

  // Sequence controller
  useEffect(() => {
    if (!secretStage) return;
    clearSecretTimeouts();
    if (secretStage === "waiting") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("quirky"), 2 * 60 * 1000));
    } else if (secretStage === "quirky") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("glitch"), 60 * 1000));
    } else if (secretStage === "glitch") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("film"), 60 * 1000));
    } else if (secretStage === "film") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("skull"), 60 * 1000));
    } else if (secretStage === "skull") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("whiteout"), 5000));
    } else if (secretStage === "whiteout") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("normal"), 10000));
    } else if (secretStage === "normal") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("rampage1"), 30000));
    } else if (secretStage === "rampage1") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("whiteout2"), 30000));
    } else if (secretStage === "whiteout2") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("buzz"), 5000));
    } else if (secretStage === "buzz") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("rampage2"), 10000));
    } else if (secretStage === "rampage2") {
      secretTimeouts.current.push(window.setTimeout(() => setSecretStage("reveal"), 20000));
    }
    return clearSecretTimeouts;
  }, [secretStage]);

  // Countdown timer for waiting stage
  useEffect(() => {
    if (secretStage === "waiting") {
      setWaitingSeconds(120);
      const interval = setInterval(() => {
        setWaitingSeconds((s) => {
          if (s <= 1) {
            clearInterval(interval);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [secretStage]);

  // Global CSS class for each stage
  useEffect(() => {
    document.body.classList.remove(
      ...stages.map((s) => `secret-${s}`)
    );
    if (secretStage) document.body.classList.add(`secret-${secretStage}`);
    return () => {
      if (secretStage) document.body.classList.remove(`secret-${secretStage}`);
    };
  }, [secretStage]);

  // Trigger function for testing
  const triggerSecret = () => {
    setShowSecret(true);
    setSecretStage("waiting");
  };

  return (
    <SecretEventContext.Provider value={{ showSecret, setShowSecret, secretStage, setSecretStage, waitingSeconds, triggerSecret }}>
      {/* Overlay and event UI rendered globally */}
      {showSecret && (
        <>
          <div className={`fixed inset-0 z-[1000] pointer-events-none transition-all duration-1000 ${secretStage === 'whiteout' || secretStage === 'whiteout2' ? 'bg-white' : 'bg-transparent'}`} />
          {secretStage === 'waiting' && (
            <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[1100] bg-black bg-opacity-80 px-8 py-4 rounded-2xl shadow-2xl border-4 border-fuchsia-400 text-center">
              <div className="text-2xl text-fuchsia-200 font-bold mb-1">Secret Event Starting In...</div>
              <div className="text-5xl text-yellow-300 font-extrabold tracking-widest">{Math.floor(waitingSeconds/60)}:{(waitingSeconds%60).toString().padStart(2,'0')}</div>
            </div>
          )}
          {secretStage === 'skull' && (
            <div className="fixed inset-0 z-[1010] flex items-center justify-center bg-black bg-opacity-90 animate-pulse">
              <div className="text-[10vw] text-white animate-flash">💀</div>
            </div>
          )}
          {secretStage === 'film' && (
            <div className="fixed inset-0 z-[1010] pointer-events-none" style={{mixBlendMode:'multiply',background:'rgba(60,40,20,0.7)',filter:'grayscale(1) sepia(1) blur(1px)'}}>
              <div className="absolute inset-0 w-full h-full animate-filmgrain"/>
            </div>
          )}
          {secretStage === 'reveal' && (
            <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-gradient-to-br from-black via-fuchsia-900 to-yellow-100 animate-secretfade">
              <div className="p-12 rounded-3xl shadow-2xl border-8 border-fuchsia-500 text-center max-w-2xl bg-black bg-opacity-80">
                <div className="text-7xl mb-6 animate-bounce">🦄✨🔑</div>
                <h2 className="text-4xl font-extrabold text-fuchsia-300 mb-4">THE BIGGEST SECRET OF ALL TIME</h2>
                <p className="text-2xl text-yellow-200 mb-6">You have truly gone above and beyond.<br/>Welcome to the inner circle of Learnverse.<br/><span className="text-pink-300 font-bold">(You are now a legend!)</span></p>
                <div className="text-5xl mb-6 animate-spin">🔓</div>
                <button
                  className="mt-2 px-8 py-4 bg-gradient-to-r from-fuchsia-600 to-yellow-400 text-black font-extrabold rounded-2xl shadow-lg hover:scale-105 transition-all text-2xl"
                  onClick={() => { setShowSecret(false); setSecretStage(null); clearSecretTimeouts(); }}
                >Close</button>
              </div>
            </div>
          )}
        </>
      )}
      {children}
    </SecretEventContext.Provider>
  );
};
