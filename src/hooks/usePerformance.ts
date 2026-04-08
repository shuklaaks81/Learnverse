"use client";

import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * 🚀 PERFORMANCE OPTIMIZATION SYSTEM 🚀
 * 
 * Real-time FPS monitoring and adaptive quality settings
 * Automatically reduces animations and effects when lag is detected
 * 
 * Features:
 * - FPS tracking
 * - Automatic quality adjustment
 * - Manual performance modes (Low/Medium/High/Auto)
 * - Smart object pooling
 * - Animation throttling
 */

export type PerformanceMode = 'low' | 'medium' | 'high' | 'auto';

export interface PerformanceSettings {
  mode: PerformanceMode;
  currentQuality: 'low' | 'medium' | 'high';
  fps: number;
  starCount: number;
  objectCount: number;
  enableBlur: boolean;
  enableShadows: boolean;
  enableParticles: boolean;
  animationSpeed: number;
}

const FPS_SAMPLE_SIZE = 60; // Track last 60 frames (1 second at 60fps)
const LOW_FPS_THRESHOLD = 30;
const MEDIUM_FPS_THRESHOLD = 45;

export function usePerformance() {
  const [mode, setMode] = useState<PerformanceMode>('auto');
  const [currentQuality, setCurrentQuality] = useState<'low' | 'medium' | 'high'>('high');
  const [fps, setFps] = useState(60);
  
  const frameTimesRef = useRef<number[]>([]);
  const lastFrameTimeRef = useRef(performance.now());
  const rafIdRef = useRef<number | undefined>(undefined);

  // Load saved performance mode
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMode = localStorage.getItem('performanceMode') as PerformanceMode;
      if (savedMode) {
        setMode(savedMode);
        if (savedMode !== 'auto') {
          setCurrentQuality(savedMode === 'low' ? 'low' : savedMode === 'medium' ? 'medium' : 'high');
        }
      }
    }
  }, []);

  // FPS monitoring
  const measureFPS = useCallback(() => {
    const now = performance.now();
    const delta = now - lastFrameTimeRef.current;
    lastFrameTimeRef.current = now;

    // Add frame time to array
    frameTimesRef.current.push(delta);
    if (frameTimesRef.current.length > FPS_SAMPLE_SIZE) {
      frameTimesRef.current.shift();
    }

    // Calculate average FPS
    if (frameTimesRef.current.length >= 30) { // Need at least 30 samples
      const avgFrameTime = frameTimesRef.current.reduce((a, b) => a + b, 0) / frameTimesRef.current.length;
      const currentFps = Math.round(1000 / avgFrameTime);
      setFps(currentFps);

      // Auto-adjust quality based on FPS
      if (mode === 'auto') {
        if (currentFps < LOW_FPS_THRESHOLD && currentQuality !== 'low') {
          console.log('🔽 Performance: Switching to LOW quality (FPS:', currentFps, ')');
          setCurrentQuality('low');
        } else if (currentFps >= LOW_FPS_THRESHOLD && currentFps < MEDIUM_FPS_THRESHOLD && currentQuality !== 'medium') {
          console.log('🔽 Performance: Switching to MEDIUM quality (FPS:', currentFps, ')');
          setCurrentQuality('medium');
        } else if (currentFps >= MEDIUM_FPS_THRESHOLD && currentQuality !== 'high') {
          console.log('🔼 Performance: Switching to HIGH quality (FPS:', currentFps, ')');
          setCurrentQuality('high');
        }
      }
    }

    rafIdRef.current = requestAnimationFrame(measureFPS);
  }, [mode, currentQuality]);

  // Start FPS monitoring
  useEffect(() => {
    rafIdRef.current = requestAnimationFrame(measureFPS);
    return () => {
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [measureFPS]);

  // Change performance mode
  const changeMode = useCallback((newMode: PerformanceMode) => {
    setMode(newMode);
    localStorage.setItem('performanceMode', newMode);

    // Set quality immediately for manual modes
    if (newMode !== 'auto') {
      const quality = newMode === 'low' ? 'low' : newMode === 'medium' ? 'medium' : 'high';
      setCurrentQuality(quality);
      console.log('⚙️ Performance: Manual mode set to', newMode.toUpperCase());
    } else {
      console.log('🤖 Performance: Auto mode enabled');
    }
  }, []);

  // Get quality-based settings
  const settings: PerformanceSettings = {
    mode,
    currentQuality,
    fps,
    // Adjust counts based on quality
    starCount: currentQuality === 'low' ? 50 : currentQuality === 'medium' ? 100 : 200,
    objectCount: currentQuality === 'low' ? 5 : currentQuality === 'medium' ? 8 : 11,
    enableBlur: currentQuality !== 'low',
    enableShadows: currentQuality === 'high',
    enableParticles: currentQuality !== 'low',
    animationSpeed: currentQuality === 'low' ? 1.5 : currentQuality === 'medium' ? 1.2 : 1,
  };

  return {
    settings,
    changeMode,
  };
}
