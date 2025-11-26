'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSoundEffects } from '@/utils/soundEffects';
import { useDeviceDetection } from '@/utils/deviceDetection';

export default function KidLogin() {
  const [kidId, setKidId] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const soundEffects = useSoundEffects();
  const deviceInfo = useDeviceDetection();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    soundEffects?.playClick();
    
    if (kidId.trim() === '') {
      setError('Please enter your Kid ID');
      soundEffects?.playWrong();
      return;
    }

    // Check if Kid ID exists in localStorage
    const existingKids = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
    const kid = existingKids.find((k: any) => k.kidId === kidId);

    if (kid) {
      // Kid ID found - log them in
      localStorage.setItem('currentKid', JSON.stringify(kid));
      soundEffects?.playCorrect();
      setTimeout(() => {
        router.push('/kid'); // Redirect to dashboard/home
      }, 500);
    } else {
      // Kid ID not found
      setError('Kid ID not found. Please check your ID or create a new account.');
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
      if (e.key === 'Enter' && kidId.trim() !== '') {
        handleSubmit(e as any);
      }
    };

    if (deviceInfo.hasKeyboard) {
      window.addEventListener('keypress', handleKeyPress);
      return () => window.removeEventListener('keypress', handleKeyPress);
    }
  }, [kidId, deviceInfo.hasKeyboard, handleSubmit]);

  const containerMaxWidth = deviceInfo.screenSize === 'large' ? 'max-w-2xl' : 'max-w-md';

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center p-4">
      <div className={`${containerMaxWidth} w-full bg-white rounded-3xl shadow-2xl p-8`}>
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Welcome Back! 👋</h1>
          <p className="text-gray-600">Enter your Kid ID to continue learning</p>
        </div>

        {/* Device info */}
        <div className="mb-6 text-center text-sm text-gray-500">
          {deviceInfo.type === 'desktop' ? '🖥️ Desktop Mode' : 
           deviceInfo.type === 'tablet' ? '📱 iPad/Tablet Mode' : 
           '📱 Mobile Mode'}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-gray-700 font-semibold mb-2" htmlFor="kidId">
              Kid ID
            </label>
            <input
              id="kidId"
              type="text"
              value={kidId}
              onChange={(e) => {
                setKidId(e.target.value);
                setError('');
              }}
              placeholder="Enter your Kid ID (e.g., Alex123456)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:outline-none focus:border-orange-400 text-lg"
              autoFocus
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
