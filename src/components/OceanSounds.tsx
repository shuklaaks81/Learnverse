// Simple ocean/water sound effect player
import { useEffect } from "react";

export default function OceanSounds() {
  useEffect(() => {
    let audio: HTMLAudioElement | null = null;
    if (typeof window !== "undefined") {
      audio = new Audio("/ocean-waves.mp3");
      audio.loop = true;
      audio.volume = 0.25;
      audio.play().catch(() => {});
    }
    return () => {
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);
  return null;
}
