'use client';

// Sound effects using Web Audio API
export class SoundEffects {
  private audioContext: AudioContext | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
  }

  // Correct answer sound - happy ding!
  playCorrect() {
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(800, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
    
    gainNode.gain.setValueAtTime(0.3, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  // Wrong answer sound - gentle try again
  playWrong() {
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(400, ctx.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.2);
    
    gainNode.gain.setValueAtTime(0.2, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.3);
  }

  // Celebration sound - lesson complete!
  playCelebration() {
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const notes = [523.25, 659.25, 783.99, 1046.50]; // C, E, G, C octave
    
    notes.forEach((freq, index) => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(freq, ctx.currentTime + index * 0.15);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + index * 0.15);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + index * 0.15 + 0.05);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + index * 0.15 + 0.3);
      
      oscillator.start(ctx.currentTime + index * 0.15);
      oscillator.stop(ctx.currentTime + index * 0.15 + 0.3);
    });
  }

  // Achievement unlock sound - magical!
  playAchievement() {
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    
    // Sparkle sound
    for (let i = 0; i < 3; i++) {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(1000 + i * 400, ctx.currentTime + i * 0.1);
      oscillator.frequency.exponentialRampToValueAtTime(2000 + i * 400, ctx.currentTime + i * 0.1 + 0.2);
      
      gainNode.gain.setValueAtTime(0.2, ctx.currentTime + i * 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.1 + 0.3);
      
      oscillator.start(ctx.currentTime + i * 0.1);
      oscillator.stop(ctx.currentTime + i * 0.1 + 0.3);
    }
  }

  // Victory sound - game win!
  playVictory() {
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const melody = [
      { freq: 523.25, time: 0, duration: 0.2 },    // C
      { freq: 659.25, time: 0.2, duration: 0.2 },  // E
      { freq: 783.99, time: 0.4, duration: 0.2 },  // G
      { freq: 1046.50, time: 0.6, duration: 0.5 }, // C octave (longer)
    ];
    
    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);
      
      oscillator.frequency.setValueAtTime(note.freq, ctx.currentTime + note.time);
      
      gainNode.gain.setValueAtTime(0, ctx.currentTime + note.time);
      gainNode.gain.linearRampToValueAtTime(0.3, ctx.currentTime + note.time + 0.02);
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + note.time + note.duration);
      
      oscillator.start(ctx.currentTime + note.time);
      oscillator.stop(ctx.currentTime + note.time + note.duration);
    });
  }

  // Button click sound
  playClick() {
    if (!this.audioContext) return;
    
    const ctx = this.audioContext;
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.frequency.setValueAtTime(600, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(0.15, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + 0.1);
  }
}

// Create a singleton instance
let soundEffectsInstance: SoundEffects | null = null;

export function useSoundEffects() {
  if (typeof window !== 'undefined' && !soundEffectsInstance) {
    soundEffectsInstance = new SoundEffects();
  }
  return soundEffectsInstance;
}
