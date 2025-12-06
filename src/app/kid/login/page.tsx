'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSoundEffects } from '@/utils/soundEffects';
import { useDeviceDetection } from '@/utils/deviceDetection';

export default function KidLogin() {
  const [familyName, setFamilyName] = useState('');
  const [kidName, setKidName] = useState('');
  const [error, setError] = useState('');
  const [isPremium, setIsPremium] = useState(false);
  const router = useRouter();
  const soundEffects = useSoundEffects();
  const deviceInfo = useDeviceDetection();

  // Check if Premium version is selected
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const version = localStorage.getItem('learnverseVersion') || 'original';
      setIsPremium(version === 'premium');
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects?.playClick();
    
    if (familyName.trim() === '' || kidName.trim() === '') {
      setError('Please enter both Family Name and Your Name');
      soundEffects?.playWrong();
      return;
    }

    // Check if account exists in localStorage
    const existingKids = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    const kid = existingKids.find((k: any) => 
      k.familyName?.toLowerCase() === familyName.trim().toLowerCase() && 
      k.name.toLowerCase() === kidName.trim().toLowerCase()
    );

    if (kid) {
      // Account found - log them in
      localStorage.setItem('currentKid', JSON.stringify(kid));
      soundEffects?.playCorrect();
      setTimeout(() => {
        router.push('/kid'); // Redirect to dashboard/home
      }, 500);
    } else {
      // Account not found
      setError('Account not found. Please check your Family Name and Name.');
      soundEffects?.playWrong();
    }
  };

  const handleCreateAccount = () => {
    soundEffects?.playClick();
    router.push('/kid');
  };

  // Handle Enter key
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'Enter' && familyName.trim() !== '' && kidName.trim() !== '') {
        handleSubmit(e as any);
      }
    };

    if (deviceInfo.hasKeyboard) {
      window.addEventListener('keypress', handleKeyPress);
      return () => window.removeEventListener('keypress', handleKeyPress);
    }
  }, [familyName, kidName, deviceInfo.hasKeyboard, handleSubmit]);

  const containerMaxWidth = deviceInfo.screenSize === 'large' ? 'max-w-2xl' : 'max-w-md';

  // PREMIUM FUTURISTIC LOGIN! 🚀✨
  if (isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden flex items-center justify-center p-4">
        {/* Animated Galaxy Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900 via-blue-900 to-black">
          {/* Moving stars */}
          {[...Array(100)].map((_, i) => (
            <div
              key={i}
              className="absolute bg-white rounded-full animate-twinkle"
              style={{
                width: Math.random() * 3 + 1 + 'px',
                height: Math.random() * 3 + 1 + 'px',
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 3 + 's',
                animationDuration: Math.random() * 2 + 2 + 's'
              }}
            />
          ))}
          {/* Floating particles */}
          {[...Array(20)].map((_, i) => (
            <div
              key={`particle-${i}`}
              className="absolute rounded-full animate-float-particle"
              style={{
                width: Math.random() * 20 + 10 + 'px',
                height: Math.random() * 20 + 10 + 'px',
                background: `radial-gradient(circle, ${['#f0f', '#0ff', '#ff0', '#0f0'][Math.floor(Math.random() * 4)]}88, transparent)`,
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 10 + 10 + 's'
              }}
            />
          ))}
          {/* Nebula effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full bg-gradient-radial from-purple-500/30 via-blue-500/20 to-transparent animate-pulse-slow" />
        </div>

        {/* Glassmorphism Login Card */}
        <div className={`${containerMaxWidth} w-full relative z-10`}>
          <div className="relative bg-white/10 backdrop-blur-2xl rounded-3xl border-4 border-white/20 shadow-[0_0_80px_rgba(128,0,255,0.5)] p-8 overflow-hidden animate-card-appear">
            {/* Holographic overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 pointer-events-none animate-hologram" />
            
            {/* Glowing corners */}
            <div className="absolute top-0 left-0 w-20 h-20 bg-gradient-radial from-cyan-400/50 to-transparent animate-pulse" />
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-radial from-pink-400/50 to-transparent animate-pulse" style={{animationDelay: '0.5s'}} />
            <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-radial from-yellow-400/50 to-transparent animate-pulse" style={{animationDelay: '1s'}} />
            <div className="absolute bottom-0 right-0 w-20 h-20 bg-gradient-radial from-green-400/50 to-transparent animate-pulse" style={{animationDelay: '1.5s'}} />

            <div className="relative z-10">
              <div className="text-center mb-8">
                <h1 className="text-5xl font-bold mb-2 bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-glow-text">
                  Welcome Back! 🚀
                </h1>
                <p className="text-cyan-200 text-lg font-semibold">Enter your Family Name and Name</p>
              </div>

              {/* Device info */}
              <div className="mb-6 text-center text-sm text-purple-300 font-semibold">
                {deviceInfo.type === 'desktop' ? '🖥️ Desktop Mode' : 
                 deviceInfo.type === 'tablet' ? '📱 iPad/Tablet Mode' : 
                 '📱 Mobile Mode'}
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-pink-300 font-bold mb-3 text-lg drop-shadow-glow" htmlFor="familyName">
                    👨‍👩‍👧‍👦 Family Name
                  </label>
                  <input
                    id="familyName"
                    type="text"
                    value={familyName}
                    onChange={(e) => {
                      setFamilyName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your Family Name"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-pink-400/50 rounded-2xl text-white placeholder-cyan-300 focus:outline-none focus:border-pink-400 focus:shadow-[0_0_30px_rgba(255,0,255,0.5)] text-lg transition-all duration-300"
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-cyan-300 font-bold mb-3 text-lg drop-shadow-glow" htmlFor="kidName">
                    ✨ Your Name
                  </label>
                  <input
                    id="kidName"
                    type="text"
                    value={kidName}
                    onChange={(e) => {
                      setKidName(e.target.value);
                      setError('');
                    }}
                    placeholder="Enter your name (e.g., Alex)"
                    className="w-full px-6 py-4 bg-white/10 backdrop-blur-xl border-2 border-cyan-400/50 rounded-2xl text-white placeholder-purple-300 focus:outline-none focus:border-cyan-400 focus:shadow-[0_0_30px_rgba(0,255,255,0.5)] text-lg transition-all duration-300"
                  />
                  {error && (
                    <p className="mt-2 text-pink-400 text-sm font-bold animate-shake">{error}</p>
                  )}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-cyan-500 via-purple-500 to-pink-500 text-white font-bold py-5 rounded-2xl hover:shadow-[0_0_50px_rgba(128,0,255,0.8)] transition-all duration-300 hover:scale-105 text-xl border-2 border-white/30 animate-button-glow"
                >
                  {deviceInfo.hasKeyboard ? '🚀 LOGIN (Press Enter)' : '🚀 LOGIN'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-purple-200 mb-3 font-semibold">Don&apos;t have a Kid ID yet?</p>
                <button
                  onClick={handleCreateAccount}
                  className="text-cyan-400 font-bold hover:text-pink-400 underline transition-colors duration-300 text-lg hover:scale-110 inline-block"
                >
                  Create New Account ✨
                </button>
              </div>

              {/* Keyboard shortcuts hint */}
              {deviceInfo.hasKeyboard && (
                <div className="mt-6 text-center text-xs text-purple-400 font-semibold animate-pulse">
                  ⌨️ Press Enter to login
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NORMAL VERSION
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center p-4">
      <div className={`${containerMaxWidth} w-full bg-white rounded-3xl shadow-2xl p-8`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-600">Enter your Family Name and Name</p>
        </div>

        {/* Device info */}
        <div className="mb-6 text-center text-sm text-gray-500">
          {deviceInfo.type === 'desktop' ? '🖥️ Desktop Mode' : 
           deviceInfo.type === 'tablet' ? '📱 iPad/Tablet Mode' : 
           '📱 Mobile Mode'}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="familyName">
              👨‍👩‍👧‍👦 Family Name
            </label>
            <input
              id="familyName"
              type="text"
              value={familyName}
              onChange={(e) => {
                setFamilyName(e.target.value);
                setError('');
              }}
              placeholder="Enter your Family Name"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-pink-400 text-lg"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="kidName">
              ✨ Your Name
            </label>
            <input
              id="kidName"
              type="text"
              value={kidName}
              onChange={(e) => {
                setKidName(e.target.value);
                setError('');
              }}
              placeholder="Enter your name (e.g., Alex)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-400 text-lg"
            />
            {error && (
              <p className="mt-2 text-red-500 text-sm">{error}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-orange-400 to-pink-400 text-white font-bold py-4 rounded-xl hover:shadow-lg transition-all duration-200 hover:scale-105 text-lg"
          >
            {deviceInfo.hasKeyboard ? '🚀 Login (Press Enter)' : '🚀 Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600 mb-3">Don&apos;t have a Kid ID yet?</p>
          <button
            onClick={handleCreateAccount}
            className="text-orange-500 font-semibold hover:text-orange-600 underline"
          >
            Create New Account
          </button>
        </div>

        {/* Keyboard shortcuts hint */}
        {deviceInfo.hasKeyboard && (
          <div className="mt-6 text-center text-xs text-gray-400">
            ⌨️ Press Enter to login
          </div>
        )}
      </div>
    </div>
  );
}
