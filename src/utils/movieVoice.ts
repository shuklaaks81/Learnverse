// Movie voice utilities using Web Speech API

export function speak(text: string, rate: number = 1, pitch: number = 1) {
  if (typeof window === 'undefined' || !window.speechSynthesis) return;
  
  // Cancel any ongoing speech
  window.speechSynthesis.cancel();
  
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.rate = rate;
  utterance.pitch = pitch;
  utterance.volume = 1;
  
  window.speechSynthesis.speak(utterance);
}

export function stopSpeaking() {
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
}

// Character voices
export const voices = {
  narrator: { rate: 0.9, pitch: 1.0 },
  buddy: { rate: 1.2, pitch: 1.3 },
  boss: { rate: 0.8, pitch: 0.7 },
  dramatic: { rate: 0.7, pitch: 0.9 },
  excited: { rate: 1.4, pitch: 1.5 },
  scared: { rate: 1.6, pitch: 1.7 },
};
