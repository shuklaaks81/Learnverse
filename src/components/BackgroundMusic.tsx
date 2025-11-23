'use client';

import { useState, useEffect, useRef } from 'react';

export default function BackgroundMusic() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.3);
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const gainNodeRef = useRef<GainNode | null>(null);

  useEffect(() => {
    // Check if music should be enabled from localStorage
    const preferences = localStorage.getItem('buddyPreferences');
    if (preferences) {
      const prefs = JSON.parse(preferences);
      if (prefs.musicEnabled) {
        setIsPlaying(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isPlaying) {
      startMusic();
    } else {
      stopMusic();
    }

    return () => stopMusic();
  }, [isPlaying, startMusic]);

  useEffect(() => {
    if (gainNodeRef.current) {
      gainNodeRef.current.gain.value = volume;
    }
  }, [volume]);

  const startMusic = () => {
    if (audioContextRef.current) return;

    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    audioContextRef.current = audioContext;

    const gainNode = audioContext.createGain();
    gainNode.gain.value = volume;
    gainNode.connect(audioContext.destination);
    gainNodeRef.current = gainNode;

    // Create a simple, soothing melody using oscillators
    const notes = [
      { freq: 261.63, duration: 0.5 }, // C4
      { freq: 293.66, duration: 0.5 }, // D4
      { freq: 329.63, duration: 0.5 }, // E4
      { freq: 349.23, duration: 0.5 }, // F4
      { freq: 392.00, duration: 0.5 }, // G4
      { freq: 329.63, duration: 0.5 }, // E4
      { freq: 293.66, duration: 0.5 }, // D4
      { freq: 261.63, duration: 1.0 }, // C4
    ];

    let currentTime = audioContext.currentTime;
    const oscillators: OscillatorNode[] = [];

    const playMelody = () => {
      notes.forEach((note) => {
        const oscillator = audioContext.createOscillator();
        oscillator.type = 'sine';
        oscillator.frequency.value = note.freq;
        
        const noteGain = audioContext.createGain();
        noteGain.gain.setValueAtTime(0, currentTime);
        noteGain.gain.linearRampToValueAtTime(0.1, currentTime + 0.05);
        noteGain.gain.linearRampToValueAtTime(0, currentTime + note.duration);
        
        oscillator.connect(noteGain);
        noteGain.connect(gainNode);
        
        oscillator.start(currentTime);
        oscillator.stop(currentTime + note.duration);
        
        oscillators.push(oscillator);
        currentTime += note.duration;
      });

      // Loop the melody
      setTimeout(() => {
        if (audioContextRef.current && isPlaying) {
          playMelody();
        }
      }, currentTime * 1000 - audioContext.currentTime * 1000);
    };

    playMelody();
    oscillatorsRef.current = oscillators;
  };

  const stopMusic = () => {
    oscillatorsRef.current.forEach(osc => {
      try {
        osc.stop();
      } catch (e) {
        // Already stopped
      }
    });
    oscillatorsRef.current = [];

    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    gainNodeRef.current = null;
  };

  const toggleMusic = () => {
    setIsPlaying(!isPlaying);
    
    // Update preferences
    const preferences = localStorage.getItem('buddyPreferences');
    if (preferences) {
      const prefs = JSON.parse(preferences);
      prefs.musicEnabled = !isPlaying;
      localStorage.setItem('buddyPreferences', JSON.stringify(prefs));
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div className="bg-white/90 backdrop-blur rounded-2xl shadow-2xl p-4">
        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
              isPlaying
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600'
                : 'bg-gray-300 text-gray-600 hover:bg-gray-400'
            }`}
            title={isPlaying ? 'Pause Music' : 'Play Music'}
          >
            {isPlaying ? '🎵' : '🔇'}
          </button>
          
          {isPlaying && (
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-gray-700">🔊</span>
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
