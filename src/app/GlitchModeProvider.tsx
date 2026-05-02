'use client';

import { useEffect, useState } from 'react';

export default function GlitchModeProvider({ children }: { children: React.ReactNode }) {
  const [glitchMode, setGlitchMode] = useState(false);
  const [shiftPressed, setShiftPressed] = useState(false);
  const [lastToggle, setLastToggle] = useState(0);

  useEffect(() => {
    // Check if glitch mode is already on
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('glitchMode');
      if (saved === 'true') {
        setGlitchMode(true);
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Track shift key
      if (e.key === 'Shift') {
        setShiftPressed(true);
      }
      
      // SHIFT + G = GLITCH MODE! (with 2 second cooldown to prevent Mac destruction!)
      if (e.shiftKey && e.key === 'G') {
        e.preventDefault();
        
        // Check cooldown (2 seconds)
        const now = Date.now();
        if (now - lastToggle < 2000) {
          console.log('⏳ Cooldown active! Wait before toggling again...');
          return;
        }
        
        setLastToggle(now);
        const newMode = !glitchMode;
        setGlitchMode(newMode);
        localStorage.setItem('glitchMode', String(newMode));
        
        // Play chaos sound (but only once!)
        if (typeof window !== 'undefined') {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          
          // Crazy glitch sound
          for (let i = 0; i < 5; i++) {
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.value = Math.random() * 1000 + 200;
            oscillator.type = 'sawtooth';
            gainNode.gain.value = 0.1;
            
            oscillator.start(audioContext.currentTime + i * 0.05);
            oscillator.stop(audioContext.currentTime + i * 0.05 + 0.1);
          }
        }
        
        console.log(newMode ? '💥 GLITCH MODE ACTIVATED! 💥' : '✅ Normal mode restored');
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setShiftPressed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [shiftPressed, glitchMode, lastToggle]);

  return (
    <>
      {glitchMode && (
        <style jsx global>{`
          /* 🔥 CHAOS MODE ACTIVATED 🔥 */
          
          * {
            animation: glitchShake 0.3s infinite !important;
          }
          
          body {
            filter: hue-rotate(${Math.random() * 360}deg) !important;
          }
          
          /* Random rotations */
          h1, h2, h3 {
            transform: rotate(${Math.random() * 10 - 5}deg) !important;
            display: inline-block !important;
          }
          
          /* Buttons go crazy */
          button {
            transform: rotate(${Math.random() * 20 - 10}deg) scale(${0.8 + Math.random() * 0.4}) !important;
            position: relative !important;
            left: ${Math.random() * 20 - 10}px !important;
            top: ${Math.random() * 20 - 10}px !important;
          }
          
          /* Text chaos */
          p {
            transform: skew(${Math.random() * 10 - 5}deg) !important;
            letter-spacing: ${Math.random() * 5}px !important;
          }
          
          /* Random colors */
          div {
            border: ${Math.random() > 0.7 ? '2px dashed red' : 'none'} !important;
          }
          
          /* Images go wild */
          img, svg {
            transform: rotate(${Math.random() * 360}deg) scale(${0.5 + Math.random()}) !important;
            filter: invert(${Math.random() > 0.5 ? 1 : 0}) !important;
          }
          
          /* Overlap everything */
          * {
            z-index: ${Math.floor(Math.random() * 100)} !important;
          }
          
          /* Comic Sans for ultimate chaos */
          * {
            font-family: 'Comic Sans MS', cursive, sans-serif !important;
          }
          
          /* Random text directions */
          span {
            display: inline-block !important;
            transform: rotate(${Math.random() * 180 - 90}deg) !important;
          }
          
          /* Upside down sections */
          section:nth-child(odd) {
            transform: scaleY(-1) !important;
          }
          
          /* Crazy animations */
          @keyframes glitchShake {
            0% { transform: translate(0, 0); }
            25% { transform: translate(-2px, 2px); }
            50% { transform: translate(2px, -2px); }
            75% { transform: translate(-2px, -2px); }
            100% { transform: translate(2px, 2px); }
          }
          
          @keyframes colorShift {
            0% { filter: hue-rotate(0deg); }
            100% { filter: hue-rotate(360deg); }
          }
          
          /* Background chaos */
          body::before {
            content: '💥 ERROR ERROR ERROR 💥';
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            font-size: 3rem;
            color: red;
            opacity: 0.1;
            z-index: 9999;
            pointer-events: none;
            animation: colorShift 2s infinite;
          }
          
          /* Random positions */
          a {
            position: relative !important;
            left: ${Math.random() * 30 - 15}px !important;
            top: ${Math.random() * 30 - 15}px !important;
          }
          
          /* Text overflow chaos */
          * {
            overflow: visible !important;
          }
          
          /* Backwards text */
          label {
            display: inline-block !important;
            transform: scaleX(-1) !important;
          }
          
          /* Grid goes diagonal */
          .grid {
            transform: rotate(15deg) !important;
          }
          
          /* Flex gets confused */
          .flex {
            flex-direction: ${Math.random() > 0.5 ? 'column-reverse' : 'row-reverse'} !important;
          }
        `}</style>
      )}
      {children}
    </>
  );
}
