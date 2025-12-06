"use client";

import { useState } from "react";
import LoadingScreen from "@/components/LoadingScreen";

export default function LoadingWrapper({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [showContent, setShowContent] = useState(false);

  function handleLoadingComplete() {
    setIsLoading(false);
    setTimeout(() => setShowContent(true), 300);
  }

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleLoadingComplete} />}
      <div className={`transition-opacity duration-500 ${showContent ? 'opacity-100' : 'opacity-0'}`}>
        {children}
      </div>
    </>
  );
}
