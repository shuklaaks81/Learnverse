'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSoundEffects } from '@/utils/soundEffects';

function KidSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kidName = searchParams?.get('name') || 'Friend';
  const kidId = searchParams?.get('id') || '';
  const sounds = useSoundEffects();

  // Buddy customization
  const [buddyColor, setBuddyColor] = useState('#FFD700');
  const [expressionType, setExpressionType] = useState('happy');
  const [skinColor, setSkinColor] = useState('#FFE4B5');
  
  // Version preference
  const [preferredVersion, setPreferredVersion] = useState('stable');
  
  // Voice settings
  const [voiceRate, setVoiceRate] = useState(0.88);
  const [voicePitch, setVoicePitch] = useState(1.2);
  const [voiceVolume, setVoiceVolume] = useState(0.85);
  
  // Background music
  const [musicEnabled, setMusicEnabled] = useState(false);
  
  // For testing
  const [isSpeaking, setIsSpeaking] = useState(false);
  
  // Name pronunciation
  const [isRecording, setIsRecording] = useState(false);
  const [hasRecordedName, setHasRecordedName] = useState(false);
  const [nameAudioBlob, setNameAudioBlob] = useState<Blob | null>(null);

  const testVoice = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const utterance = new SpeechSynthesisUtterance(
        `Hi ${kidName}! I'm your learning buddy! Let's have fun learning together!`
      );
      utterance.rate = voiceRate;
      utterance.pitch = voicePitch;
      utterance.volume = voiceVolume;
      
      setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      
      window.speechSynthesis.speak(utterance);
    }
  };

  const recordNamePronunciation = async () => {
    if (isRecording) {
      // Stop recording
      setIsRecording(false);
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks: BlobPart[] = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunks.push(event.data);
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        setNameAudioBlob(audioBlob);
        setHasRecordedName(true);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);

      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (mediaRecorder.state === 'recording') {
          mediaRecorder.stop();
          setIsRecording(false);
        }
      }, 3000);
    } catch (error) {
      console.error('Error recording audio:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const playRecordedName = () => {
    if (nameAudioBlob) {
      const audioUrl = URL.createObjectURL(nameAudioBlob);
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const saveAndContinue = () => {
    // In a real app, save these preferences to localStorage or database
    const preferences = {
      buddyColor,
      expressionType,
      skinColor,
      voiceRate,
      voicePitch,
      voiceVolume,
      musicEnabled,
      customNamePronunciation: hasRecordedName,
      preferredVersion
    };
    
    localStorage.setItem('buddyPreferences', JSON.stringify(preferences));
    localStorage.setItem('preferredVersion', preferredVersion);
    
    // Save audio blob separately if exists
    if (nameAudioBlob) {
      const reader = new FileReader();
      reader.readAsDataURL(nameAudioBlob);
      reader.onloadend = () => {
        localStorage.setItem('nameAudioData', reader.result as string);
        router.push(`/kid/lessons?name=${kidName}&id=${kidId}`);
      };
    } else {
      router.push(`/kid/lessons?name=${kidName}&id=${kidId}`);
    }
  };

  const expressions = {
    happy: 'M 35 45 Q 40 50 45 45',
    excited: 'M 33 43 Q 40 52 47 43',
    friendly: 'M 35 46 Q 40 49 45 46',
    cheerful: 'M 34 44 Q 40 51 46 44'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-8 animate-gradient-shift">
      <div className="max-w-6xl mx-auto">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4 text-center drop-shadow-2xl animate-bounce-slow flex items-center justify-center gap-3">
            <span className="text-7xl animate-spin" style={{ animationDuration: '3s' }}>🎨</span>
            Let&apos;s Set Up Your Learning Buddy!
            <span className="text-7xl animate-pulse">✨</span>
          </h1>
          <p className="text-2xl text-white font-semibold drop-shadow-lg">
            Customize everything, <span className="bg-gradient-to-r from-yellow-200 to-white bg-clip-text text-transparent">{kidName}</span>!
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Buddy Preview */}
          <div className="bg-gradient-to-br from-white to-purple-100 rounded-3xl p-8 shadow-2xl border-4 border-white transform hover:scale-105 transition-transform duration-300 animate-slideInUp">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center gap-2">
              <span className="text-5xl">👤</span> Your Learning Buddy
            </h2>
            
            {/* Buddy Preview */}
            <div className="flex justify-center mb-8">
              <svg width="250" height="350" viewBox="0 0 80 120">
                <defs>
                  <filter id="handDrawn">
                    <feTurbulence type="fractalNoise" baseFrequency="0.05" numOctaves="3" result="noise"/>
                    <feDisplacementMap in="SourceGraphic" in2="noise" scale="1.5" xChannelSelector="R" yChannelSelector="G"/>
                  </filter>
                </defs>
                
                {/* Body */}
                <ellipse cx="40" cy="65" rx="12" ry="18" fill={buddyColor} stroke="#000" strokeWidth="2" filter="url(#handDrawn)"/>
                
                {/* Arms */}
                <line x1="28" y1="60" x2="18" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round" filter="url(#handDrawn)"/>
                <line x1="52" y1="60" x2="62" y2="70" stroke="#000" strokeWidth="2" strokeLinecap="round" filter="url(#handDrawn)"/>
                
                {/* Legs */}
                <line x1="35" y1="83" x2="30" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round" filter="url(#handDrawn)"/>
                <line x1="45" y1="83" x2="50" y2="100" stroke="#000" strokeWidth="2" strokeLinecap="round" filter="url(#handDrawn)"/>
                
                {/* Head */}
                <circle cx="40" cy="35" r="18" fill={skinColor} stroke="#000" strokeWidth="2" filter="url(#handDrawn)"/>
                
                {/* Eyes */}
                <circle cx="33" cy="32" r="2" fill="#000"/>
                <circle cx="47" cy="32" r="2" fill="#000"/>
                
                {/* Smile */}
                <path 
                  d={expressions[expressionType as keyof typeof expressions]} 
                  stroke="#000" 
                  strokeWidth="2" 
                  fill="none" 
                  strokeLinecap="round"
                />
              </svg>
            </div>

            {/* Buddy Customization */}
            <div className="space-y-6">
              <div className="bg-white/80 rounded-2xl p-5 backdrop-blur">
                <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-3xl">👕</span> Shirt Color
                </label>
                <div className="flex gap-4 flex-wrap justify-center">
                  {[{ color: '#FFD700', name: 'Gold' }, { color: '#FF6B6B', name: 'Red' }, { color: '#4ECDC4', name: 'Teal' }, { color: '#95E1D3', name: 'Mint' }, { color: '#A8E6CF', name: 'Green' }, { color: '#C7CEEA', name: 'Lavender' }].map(({ color, name }) => (
                    <button
                      key={color}
                      onClick={() => setBuddyColor(color)}
                      className={`flex flex-col items-center transition-all transform hover:scale-110 duration-200 ${
                        buddyColor === color ? 'scale-110' : ''
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl border-4 shadow-lg transition-all ${
                          buddyColor === color ? 'border-purple-600 ring-4 ring-purple-300' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-bold text-gray-700 mt-2">{name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-5 backdrop-blur">
                <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-3xl">🎨</span> Skin Tone
                </label>
                <div className="flex gap-4 flex-wrap justify-center">
                  {[{ color: '#FFE4B5', name: 'Light' }, { color: '#F5CBA7', name: 'Fair' }, { color: '#D4A574', name: 'Medium' }, { color: '#C68642', name: 'Olive' }, { color: '#8D5524', name: 'Brown' }, { color: '#4A2511', name: 'Dark' }].map(({ color, name }) => (
                    <button
                      key={color}
                      onClick={() => setSkinColor(color)}
                      className={`flex flex-col items-center transition-all transform hover:scale-110 duration-200 ${
                        skinColor === color ? 'scale-110' : ''
                      }`}
                    >
                      <div
                        className={`w-16 h-16 rounded-2xl border-4 shadow-lg transition-all ${
                          skinColor === color ? 'border-purple-600 ring-4 ring-purple-300' : 'border-gray-300'
                        }`}
                        style={{ backgroundColor: color }}
                      />
                      <p className="text-xs font-bold text-gray-700 mt-2">{name}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white/80 rounded-2xl p-5 backdrop-blur">
                <label className="block text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <span className="text-3xl">😊</span> Expression
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {['happy', 'excited', 'friendly', 'cheerful'].map(expr => (
                    <button
                      key={expr}
                      onClick={() => setExpressionType(expr)}
                      className={`px-5 py-3 rounded-2xl font-bold capitalize transition-all transform hover:scale-105 duration-200 ${
                        expressionType === expr
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg scale-105'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {expr}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right side - Voice & Music Settings */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h2 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 bg-clip-text text-transparent mb-6 text-center flex items-center justify-center gap-2">
              <span className="text-4xl">🎵</span> Voice & Sound
            </h2>

            <div className="space-y-6">
              {/* Voice Speed */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-2xl p-5 border border-purple-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>🏃‍♂️</span> Voice Speed
                  </label>
                  <span className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                    {voiceRate.toFixed(2)}x
                  </span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="w-full h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded-lg appearance-none cursor-pointer accent-purple-600"
                />
                <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
                  <span>🐢 Slower</span>
                  <span>⚡ Faster</span>
                </div>
              </div>

              {/* Voice Pitch */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-5 border border-blue-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>🎼</span> Voice Pitch
                  </label>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {voicePitch.toFixed(2)}
                  </span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full h-4 bg-gradient-to-r from-blue-300 to-purple-300 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
                  <span>🔉 Lower</span>
                  <span>🎺 Higher</span>
                </div>
              </div>

              {/* Voice Volume */}
              <div className="bg-gradient-to-r from-orange-50 to-yellow-50 rounded-2xl p-5 border border-orange-100">
                <div className="flex items-center justify-between mb-3">
                  <label className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <span>🔊</span> Voice Volume
                  </label>
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent">
                    {Math.round(voiceVolume * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  className="w-full h-4 bg-gradient-to-r from-orange-300 to-yellow-300 rounded-lg appearance-none cursor-pointer accent-orange-600"
                />
                <div className="flex justify-between text-xs font-semibold text-gray-600 mt-2">
                  <span>🤫 Quiet</span>
                  <span>📢 Loud</span>
                </div>
              </div>

              {/* Test Voice Button */}
              <button
                onClick={() => {
                  sounds?.playClick();
                  testVoice();
                }}
                disabled={isSpeaking}
                className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 ${
                  isSpeaking
                    ? 'bg-gradient-to-r from-gray-400 to-gray-500 text-white cursor-not-allowed animate-pulse shadow-lg'
                    : 'bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 hover:from-purple-600 hover:via-pink-600 hover:to-blue-600 text-white shadow-2xl'
                }`}
              >
                {isSpeaking ? '🔊 Speaking...' : '🎤 Test Voice'}
              </button>

              {/* Name Pronunciation Section */}
              <div className="bg-gradient-to-br from-pink-50 to-purple-50 rounded-2xl p-6 border-2 border-pink-200 mt-6">
                <h3 className="text-2xl font-bold text-transparent bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text mb-2 flex items-center gap-2">
                  <span className="text-3xl">🎙️</span> Your Name Pronunciation
                </h3>
                <p className="text-sm text-gray-700 mb-4 leading-relaxed">
                  Help your buddy say &quot;<span className="font-bold text-pink-600">{kidName}</span>&quot; perfectly by recording yourself! 🎉
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      sounds?.playClick();
                      recordNamePronunciation();
                    }}
                    className={`w-full py-4 rounded-2xl font-bold text-lg transition-all transform hover:scale-105 flex items-center justify-center gap-2 ${
                      isRecording
                        ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white animate-pulse shadow-2xl scale-105'
                        : hasRecordedName
                        ? 'bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-lg'
                        : 'bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white shadow-xl'
                    }`}
                  >
                    {isRecording 
                      ? (<><span className="animate-bounce">🔴</span> Recording... (3 sec)</>) 
                      : hasRecordedName 
                      ? (<><span>🔄</span> Re-record Name</>) 
                      : (<><span>🎙️</span> Record My Name</>)}
                  </button>
                  
                  {hasRecordedName && (
                    <button
                      onClick={() => {
                        sounds?.playClick();
                        playRecordedName();
                      }}
                      className="w-full py-3 bg-gradient-to-r from-purple-200 to-pink-200 hover:from-purple-300 hover:to-pink-300 text-purple-700 rounded-2xl font-bold transition-all transform hover:scale-105 flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>▶️</span> Play Recording
                    </button>
                  )}
                </div>
              </div>

              {/* Background Music */}
              <div className="border-t-2 border-purple-200 pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700">Background Music</h3>
                    <p className="text-sm text-gray-600">Soft music while learning</p>
                  </div>
                  <button
                    onClick={() => setMusicEnabled(!musicEnabled)}
                    className={`relative w-16 h-8 rounded-full transition-all ${
                      musicEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        musicEnabled ? 'translate-x-8' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>

              {/* App Version Preference - NEW! */}
              <div className="border-t-2 border-purple-200 pt-6 mt-6">
                <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">🔄 App Version</h3>
                <p className="text-sm text-gray-600 mb-4">Choose which version you want to use!</p>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => {
                      setPreferredVersion('stable');
                      sounds?.playClick();
                    }}
                    className={`p-5 rounded-2xl border-4 transition-all transform ${
                      preferredVersion === 'stable'
                        ? 'border-green-500 bg-gradient-to-br from-green-50 to-green-100 scale-105 shadow-xl'
                        : 'border-gray-300 bg-white hover:border-green-300 hover:scale-105'
                    }`}
                  >
                    <div className="text-5xl mb-2">✅</div>
                    <div className="font-bold text-lg text-green-600">Stable</div>
                    <div className="text-xs text-gray-600 mt-1">Tested & reliable</div>
                  </button>
                  <button
                    onClick={() => {
                      setPreferredVersion('beta');
                      sounds?.playClick();
                    }}
                    className={`p-5 rounded-2xl border-4 transition-all transform ${
                      preferredVersion === 'beta'
                        ? 'border-blue-500 bg-gradient-to-br from-blue-50 to-blue-100 scale-105 shadow-xl'
                        : 'border-gray-300 bg-white hover:border-blue-300 hover:scale-105'
                    }`}
                  >
                    <div className="text-5xl mb-2">🚀</div>
                    <div className="font-bold text-lg text-blue-600">Beta</div>
                    <div className="text-xs text-gray-600 mt-1">New features!</div>
                  </button>
                </div>
              </div>

              {/* Continue Button */}
              <button
                onClick={() => {
                  sounds?.playVictory();
                  saveAndContinue();
                }}
                className="w-full py-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white rounded-2xl font-bold text-2xl shadow-2xl transition-all mt-8 transform hover:scale-105 animate-pulse"
              >
                🎉 All Done - Let&apos;s Learn! 🎉
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function KidSetup() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 flex items-center justify-center"><div className="text-4xl">✨ Loading...</div></div>}>
      <KidSetupContent />
    </Suspense>
  );
}
