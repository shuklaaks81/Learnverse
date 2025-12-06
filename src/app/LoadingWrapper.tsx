"use client";

import { useState, useEffect } from "react";
import LoadingScreen from "@/components/LoadingScreen";
import BigBangIntro from "@/components/BigBangIntro";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);
  const [showIntro, setShowIntro] = useState(false);

  useEffect(() => {
    // Check if intro has been shown before
    const introDone = localStorage.getItem('introDone');
    if (!introDone) {
      setShowIntro(true);
    }
  }, []);

  useEffect(() => {
    // Listen for intro completion
    const checkIntroDone = setInterval(() => {
      const introDone = localStorage.getItem('introDone');
      if (introDone) {
        setShowIntro(false);
        clearInterval(checkIntroDone);
      }
    }, 500);

    return () => clearInterval(checkIntroDone);
  }, []);

  function handleLoadingComplete() {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 300);
  }

  return (
    <>
      {showIntro && <BigBangIntro />}
      {isLoading && !showIntro && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className={`transition-opacity duration-500 ${showContent && !showIntro ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </>
  );
}
