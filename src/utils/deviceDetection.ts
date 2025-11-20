'use client';

import { useState, useEffect } from 'react';

export interface DeviceInfo {
  type: 'mobile' | 'tablet' | 'desktop';
  hasKeyboard: boolean;
  screenSize: 'small' | 'medium' | 'large';
  touchSupport: boolean;
}

export function useDeviceDetection(): DeviceInfo {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    type: 'desktop',
    hasKeyboard: true,
    screenSize: 'large',
    touchSupport: false
  });

  useEffect(() => {
    const detectDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
      
      // Detect device type - special handling for iPad
      let deviceType: 'mobile' | 'tablet' | 'desktop' = 'desktop';
      
      // iPad detection (iOS 13+ reports as Mac, so check for touch + Mac)
      const isIPad = (/ipad/.test(userAgent)) || 
                     (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) ||
                     (/macintosh/.test(userAgent) && hasTouchScreen);
      
      if (isIPad) {
        deviceType = 'tablet';
      } else if (/mobile|android|iphone|ipod/.test(userAgent)) {
        deviceType = 'mobile';
      } else if (/tablet/.test(userAgent) || (hasTouchScreen && width >= 768 && width < 1024)) {
        deviceType = 'tablet';
      }
      
      // Detect screen size
      let screenSize: 'small' | 'medium' | 'large' = 'large';
      if (width < 768) {
        screenSize = 'small';
      } else if (width < 1024) {
        screenSize = 'medium';
      }
      
      // iPad can have keyboard (with keyboard case), but most don't
      // Desktop has keyboard, mobile/phone doesn't
      const hasKeyboard = deviceType === 'desktop' || (isIPad && width >= 1024);
      
      setDeviceInfo({
        type: deviceType,
        hasKeyboard,
        screenSize,
        touchSupport: hasTouchScreen
      });
      
      // Save to localStorage
      localStorage.setItem('deviceInfo', JSON.stringify({
        type: deviceType,
        hasKeyboard,
        screenSize,
        touchSupport: hasTouchScreen
      }));
    };
    
    // Detect on mount
    detectDevice();
    
    // Detect on resize
    window.addEventListener('resize', detectDevice);
    
    return () => window.removeEventListener('resize', detectDevice);
  }, []);
  
  return deviceInfo;
}

export function getStoredDeviceInfo(): DeviceInfo | null {
  if (typeof window === 'undefined') return null;
  
  const stored = localStorage.getItem('deviceInfo');
  if (stored) {
    return JSON.parse(stored);
  }
  return null;
}

// Keyboard shortcuts hook
export function useKeyboardShortcuts(callbacks: { [key: string]: () => void }) {
  useEffect(() => {
    const deviceInfo = getStoredDeviceInfo();
    if (!deviceInfo?.hasKeyboard) return;
    
    const handleKeyPress = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      
      if (callbacks[key]) {
        e.preventDefault();
        callbacks[key]();
      }
    };
    
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [callbacks]);
}
