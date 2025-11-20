"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function VoiceSetup() {
  const router = useRouter();
  const [useOwnVoice, setUseOwnVoice] = useState<boolean | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecorded, setHasRecorded] = useState(false);

  const handleUseDefaultVoice = () => {
    localStorage.setItem('buddyVoice', 'default');
    alert('✅ Got it! Your buddy will use the default voice!');
    router.push('/kid/name-setup');
  };

  const startRecording = () => {
    // In a real app, you'd use MediaRecorder API here
    setIsRecording(true);
    
    // Simulate recording for 3 seconds
    setTimeout(() => {
      setIsRecording(false);
      setHasRecorded(true);
      alert('🎤 Recording complete! Your voice sounds great!');
    }, 3000);
  };

  const saveVoiceRecording = () => {
    localStorage.setItem('buddyVoice', 'custom');
    alert('✨ Perfect! Your buddy will use your voice!');
    router.push('/kid/name-setup');
  };

  if (useOwnVoice === null) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient">
        <style jsx>{`
          @keyframes gradient {
            0%, 100% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
          }
          .animate-gradient {
            background-size: 200% 200%;
            animation: gradient 10s ease infinite;
          }
        `}</style>

        <div className="w-full max-w-5xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
            🎤 Voice Setup! ✨
          </h1>
          <p className="text-center text-gray-700 mb-12 font-bold text-2xl sm:text-3xl">
            Want to use YOUR voice for your learning buddy? 🗣️
          </p>

          <div className="grid sm:grid-cols-2 gap-8">
            <button
              onClick={() => setUseOwnVoice(true)}
              className="bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 text-white py-12 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              🎤 Yes! Use My Voice!
            </button>
            
            <button
              onClick={handleUseDefaultVoice}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 text-white py-12 px-8 rounded-3xl hover:shadow-2xl transition-all font-bold text-2xl sm:text-3xl hover:scale-105 shadow-lg"
            >
              🔊 No, Use Default Voice
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 sm:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient">
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 10s ease infinite;
        }
        @keyframes pulse-ring {
          0% { transform: scale(1); opacity: 1; }
          100% { transform: scale(1.5); opacity: 0; }
        }
        .pulse-ring {
          animation: pulse-ring 1.5s ease-out infinite;
        }
      `}</style>

      <div className="w-full max-w-3xl bg-white/95 backdrop-blur rounded-3xl shadow-2xl p-8 sm:p-16 border-4 border-white/60">
        <h1 className="text-4xl sm:text-5xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent">
          🎙️ Record Your Voice!
        </h1>
        <p className="text-center text-gray-700 mb-8 font-bold text-xl">
          Say something fun! Like &quot;Hello!&quot; or &quot;Let&apos;s learn!&quot; 🗣️
        </p>

        <div className="flex justify-center mb-8">
          <div className="relative">
            <button
              onClick={startRecording}
              disabled={isRecording || hasRecorded}
              className={`w-48 h-48 rounded-full bg-gradient-to-r from-red-500 to-pink-600 text-white font-bold text-2xl shadow-2xl hover:scale-110 transition-all ${
                isRecording ? 'animate-pulse' : ''
              } ${hasRecorded ? 'opacity-50' : ''}`}
            >
              {isRecording ? '🎤 Recording...' : hasRecorded ? '✅ Recorded!' : '🎤 Press to Record'}
            </button>
            {isRecording && (
              <div className="absolute inset-0 rounded-full border-8 border-red-500 pulse-ring"></div>
            )}
          </div>
        </div>

        {hasRecorded && (
          <div className="flex flex-col gap-4">
            <button
              onClick={saveVoiceRecording}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white py-6 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-2xl hover:scale-105"
            >
              ✨ Perfect! Use This Recording
            </button>
            
            <button
              onClick={() => setHasRecorded(false)}
              className="w-full bg-gradient-to-r from-orange-500 to-red-500 text-white py-6 px-8 rounded-2xl hover:shadow-2xl transition-all font-bold text-2xl hover:scale-105"
            >
              🔄 Record Again
            </button>
          </div>
        )}

        <p className="text-center text-gray-600 mt-8 font-semibold">
          💡 Your voice will be used when your buddy teaches you! 🎉
        </p>
      </div>
    </div>
  );
}
