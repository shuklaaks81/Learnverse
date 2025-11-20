'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { useSoundEffects } from '@/utils/soundEffects';

function KidSetupContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const kidName = searchParams.get('name') || 'Friend';
  const kidId = searchParams.get('id') || '';
  const sounds = useSoundEffects();

  // Buddy customization
  const [buddyColor, setBuddyColor] = useState('#FFD700');
  const [expressionType, setExpressionType] = useState('happy');
  const [skinColor, setSkinColor] = useState('#FFE4B5');
  
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
      customNamePronunciation: hasRecordedName
    };
    
    localStorage.setItem('buddyPreferences', JSON.stringify(preferences));
    
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
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-white mb-2 text-center drop-shadow-lg">
          ✨ Let&apos;s Set Up Your Learning Buddy! ✨
        </h1>
        <p className="text-xl text-white mb-8 text-center">
          Customize your buddy and voice, {kidName}!
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Left side - Buddy Preview */}
          <div className="bg-white/90 backdrop-blur rounded-3xl p-8 shadow-2xl">
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
              Your Learning Buddy
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
            <div className="space-y-4">
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Shirt Color
                </label>
                <div className="flex gap-3 flex-wrap">
                  {['#FFD700', '#FF6B6B', '#4ECDC4', '#95E1D3', '#A8E6CF', '#C7CEEA'].map(color => (
                    <button
                      key={color}
                      onClick={() => setBuddyColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        buddyColor === color ? 'border-purple-600 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Skin Tone
                </label>
                <div className="flex gap-3 flex-wrap">
                  {['#FFE4B5', '#F5CBA7', '#D4A574', '#C68642', '#8D5524', '#4A2511'].map(color => (
                    <button
                      key={color}
                      onClick={() => setSkinColor(color)}
                      className={`w-12 h-12 rounded-full border-4 transition-all ${
                        skinColor === color ? 'border-purple-600 scale-110' : 'border-gray-300'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Expression
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {['happy', 'excited', 'friendly', 'cheerful'].map(expr => (
                    <button
                      key={expr}
                      onClick={() => setExpressionType(expr)}
                      className={`px-4 py-2 rounded-xl font-semibold capitalize transition-all ${
                        expressionType === expr
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
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
            <h2 className="text-3xl font-bold text-purple-600 mb-6 text-center">
              Voice & Sound Settings
            </h2>

            <div className="space-y-6">
              {/* Voice Speed */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Voice Speed: {voiceRate.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.5"
                  max="1.5"
                  step="0.05"
                  value={voiceRate}
                  onChange={(e) => setVoiceRate(parseFloat(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Slower</span>
                  <span>Faster</span>
                </div>
              </div>

              {/* Voice Pitch */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Voice Pitch: {voicePitch.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.8"
                  max="2.0"
                  step="0.05"
                  value={voicePitch}
                  onChange={(e) => setVoicePitch(parseFloat(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Lower</span>
                  <span>Higher</span>
                </div>
              </div>

              {/* Voice Volume */}
              <div>
                <label className="block text-lg font-semibold text-gray-700 mb-2">
                  Voice Volume: {voiceVolume.toFixed(2)}
                </label>
                <input
                  type="range"
                  min="0.3"
                  max="1.0"
                  step="0.05"
                  value={voiceVolume}
                  onChange={(e) => setVoiceVolume(parseFloat(e.target.value))}
                  className="w-full h-3 bg-purple-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-sm text-gray-600 mt-1">
                  <span>Quieter</span>
                  <span>Louder</span>
                </div>
              </div>

              {/* Test Voice Button */}
              <button
                onClick={() => {
                  sounds?.playClick();
                  testVoice();
                }}
                disabled={isSpeaking}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${
                  isSpeaking
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white shadow-lg'
                }`}
              >
                {isSpeaking ? '🔊 Speaking...' : '🎤 Test Voice'}
              </button>

              {/* Name Pronunciation Section */}
              <div className="border-t-2 border-gray-200 pt-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Teach Buddy Your Name 🎙️
                </h3>
                <p className="text-sm text-gray-600 mb-3">
                  Record yourself saying &quot;{kidName}&quot; so your buddy says it perfectly!
                </p>
                
                <div className="space-y-2">
                  <button
                    onClick={() => {
                      sounds?.playClick();
                      recordNamePronunciation();
                    }}
                    className={`w-full py-3 rounded-xl font-bold transition-all ${
                      isRecording
                        ? 'bg-red-500 text-white animate-pulse'
                        : hasRecordedName
                        ? 'bg-green-500 hover:bg-green-600 text-white'
                        : 'bg-blue-500 hover:bg-blue-600 text-white'
                    }`}
                  >
                    {isRecording 
                      ? '🔴 Recording... (3 sec)' 
                      : hasRecordedName 
                      ? '✅ Re-record Name' 
                      : '🎙️ Record My Name'}
                  </button>
                  
                  {hasRecordedName && (
                    <button
                      onClick={() => {
                        sounds?.playClick();
                        playRecordedName();
                      }}
                      className="w-full py-3 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-xl font-semibold transition-all"
                    >
                      ▶️ Play Recording
                    </button>
                  )}
                </div>
              </div>

              {/* Background Music */}
              <div className="border-t-2 border-gray-200 pt-6">
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

              {/* Continue Button */}
              <button
                onClick={() => {
                  sounds?.playClick();
                  saveAndContinue();
                }}
                className="w-full py-4 bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white rounded-xl font-bold text-xl shadow-lg transition-all mt-8"
              >
                ✨ Start Learning! ✨
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
