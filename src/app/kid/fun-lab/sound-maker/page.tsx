"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

type InstrumentType = 'beep' | 'boop' | 'zap' | 'wobble' | 'laser' | 'drum' | 'space' | 'noise';

export default function SoundMaker() {
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [volume, setVolume] = useState(0.3);
  const [isPlaying, setIsPlaying] = useState(false);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      setAudioContext(ctx);
      return () => {
        ctx.close();
      };
    }
  }, []);

  const playSound = (type: InstrumentType, frequency: number = 440) => {
    if (!audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'beep':
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.frequency.value = frequency;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.2);
        break;

      case 'boop':
        oscillator.type = 'square';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.frequency.value = frequency / 2;
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.15);
        break;

      case 'zap':
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(frequency * 2, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency / 4, audioContext.currentTime + 0.1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.1);
        break;

      case 'wobble':
        oscillator.type = 'sine';
        const lfo = audioContext.createOscillator();
        const lfoGain = audioContext.createGain();
        lfo.frequency.value = 5;
        lfoGain.gain.value = 50;
        lfo.connect(lfoGain);
        lfoGain.connect(oscillator.frequency);
        oscillator.frequency.value = frequency;
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        lfo.start();
        oscillator.start();
        lfo.stop(audioContext.currentTime + 0.5);
        oscillator.stop(audioContext.currentTime + 0.5);
        break;

      case 'laser':
        oscillator.type = 'sawtooth';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.frequency.setValueAtTime(frequency * 3, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency / 8, audioContext.currentTime + 0.3);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.3);
        break;

      case 'drum':
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(volume * 1.5, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.08);
        oscillator.frequency.setValueAtTime(150, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.08);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.08);
        break;

      case 'space':
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(volume, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
        oscillator.frequency.setValueAtTime(frequency, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(frequency * 4, audioContext.currentTime + 1);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 1);
        break;

      case 'noise':
        // White noise
        const bufferSize = audioContext.sampleRate * 0.2;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = Math.random() * 2 - 1;
        }
        const noiseSource = audioContext.createBufferSource();
        noiseSource.buffer = buffer;
        noiseSource.connect(gainNode);
        gainNode.gain.setValueAtTime(volume * 0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        noiseSource.start();
        noiseSource.stop(audioContext.currentTime + 0.2);
        return;
    }
  };

  const startContinuousSound = (type: InstrumentType, frequency: number) => {
    if (!audioContext || isPlaying) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.type = type === 'beep' ? 'sine' : type === 'boop' ? 'square' : 'triangle';
    oscillator.frequency.value = frequency;
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.value = volume;

    oscillator.start();
    oscillatorRef.current = oscillator;
    setIsPlaying(true);
  };

  const stopContinuousSound = () => {
    if (oscillatorRef.current) {
      oscillatorRef.current.stop();
      oscillatorRef.current = null;
      setIsPlaying(false);
    }
  };

  const instruments: { type: InstrumentType; name: string; emoji: string; color: string }[] = [
    { type: 'beep', name: 'Beep', emoji: '🔔', color: 'from-blue-400 to-blue-600' },
    { type: 'boop', name: 'Boop', emoji: '📯', color: 'from-green-400 to-green-600' },
    { type: 'zap', name: 'Zap', emoji: '⚡', color: 'from-yellow-400 to-orange-600' },
    { type: 'wobble', name: 'Wobble', emoji: '〰️', color: 'from-purple-400 to-purple-600' },
    { type: 'laser', name: 'Laser', emoji: '🔫', color: 'from-red-400 to-red-600' },
    { type: 'drum', name: 'Drum', emoji: '🥁', color: 'from-orange-400 to-orange-600' },
    { type: 'space', name: 'Space', emoji: '🚀', color: 'from-indigo-400 to-indigo-600' },
    { type: 'noise', name: 'Static', emoji: '📻', color: 'from-gray-400 to-gray-600' }
  ];

  const frequencies = [
    { note: 'C', freq: 261.63, color: 'bg-red-500' },
    { note: 'D', freq: 293.66, color: 'bg-orange-500' },
    { note: 'E', freq: 329.63, color: 'bg-yellow-500' },
    { note: 'F', freq: 349.23, color: 'bg-green-500' },
    { note: 'G', freq: 392.00, color: 'bg-blue-500' },
    { note: 'A', freq: 440.00, color: 'bg-indigo-500' },
    { note: 'B', freq: 493.88, color: 'bg-purple-500' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-5xl font-black text-white drop-shadow-lg">
            🔊 Crazy Sound Maker!
          </h1>
          <Link href="/kid/fun-lab">
            <button className="bg-white/20 backdrop-blur-sm text-white px-6 py-3 rounded-xl font-bold border-2 border-white/50 hover:bg-white/30 transition-all">
              ← Back to Lab
            </button>
          </Link>
        </div>

        {/* Volume Control */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-white/30">
          <label className="block text-white font-bold text-xl mb-3">
            🔊 Volume: {Math.round(volume * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="w-full h-3 rounded-lg"
          />
        </div>

        {/* Instrument Selection */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-4">🎵 Choose Your Sound:</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instruments.map(instrument => (
              <button
                key={instrument.type}
                onClick={() => playSound(instrument.type, 440)}
                className={`bg-gradient-to-r ${instrument.color} text-white py-4 rounded-xl font-bold border-2 border-white/50 hover:scale-105 transition-all shadow-xl`}
              >
                <div className="text-3xl mb-1">{instrument.emoji}</div>
                <div>{instrument.name}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Piano Keyboard */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-4">🎹 Play Notes:</h2>
          <div className="grid grid-cols-7 gap-2">
            {frequencies.map(note => (
              <button
                key={note.note}
                onClick={() => playSound('beep', note.freq)}
                onMouseDown={() => startContinuousSound('beep', note.freq)}
                onMouseUp={stopContinuousSound}
                onMouseLeave={stopContinuousSound}
                onTouchStart={() => startContinuousSound('beep', note.freq)}
                onTouchEnd={stopContinuousSound}
                className={`${note.color} text-white py-8 rounded-xl font-bold border-2 border-white hover:scale-105 transition-all shadow-xl text-2xl`}
              >
                {note.note}
              </button>
            ))}
          </div>
          <p className="text-white/70 text-sm mt-3 text-center">
            Click for quick note • Hold for continuous sound
          </p>
        </div>

        {/* Crazy Sound Grid */}
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-4">🎮 Sound Playground:</h2>
          <div className="grid grid-cols-4 md:grid-cols-8 gap-2">
            {Array.from({ length: 32 }, (_, i) => {
              const freq = 200 + i * 50;
              const randomInstrument = instruments[Math.floor(Math.random() * instruments.length)];
              return (
                <button
                  key={i}
                  onClick={() => playSound(randomInstrument.type, freq)}
                  className="bg-gradient-to-br from-pink-500 to-purple-600 hover:from-yellow-400 hover:to-orange-500 text-white py-6 rounded-xl font-bold border-2 border-white/50 hover:scale-110 transition-all shadow-xl"
                >
                  {i + 1}
                </button>
              );
            })}
          </div>
          <p className="text-white/70 text-sm mt-3 text-center">
            Each button makes a different sound! Click them all!
          </p>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white/10 backdrop-blur-xl rounded-2xl p-6 border-2 border-white/30">
          <h2 className="text-2xl font-bold text-white mb-3">✨ How to Use:</h2>
          <ul className="text-white space-y-2 text-lg">
            <li>🎵 <strong>Sound Types:</strong> Each makes a totally different sound!</li>
            <li>🎹 <strong>Piano:</strong> Play the notes C through B - hold for continuous sound!</li>
            <li>🎮 <strong>Playground:</strong> 32 buttons with random sounds at different pitches!</li>
            <li>🔊 <strong>Volume:</strong> Turn it up or down with the slider!</li>
            <li>🎨 <strong>Mix it up:</strong> Try clicking fast for crazy sound combinations!</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
