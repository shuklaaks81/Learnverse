"use client";

import { useState, useEffect } from "react";

export type AppVersion = "v1" | "v2" | "v3" | "v4";

export function useVersion() {
  const [version, setVersion] = useState<AppVersion>("v3");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("appVersion") as AppVersion;
      if (saved) setVersion(saved);
    }
  }, []);

  const switchVersion = (newVersion: AppVersion) => {
    setVersion(newVersion);
    localStorage.setItem("appVersion", newVersion);
    window.location.reload();
  };

  return { version, switchVersion };
}

export function getVersionTheme(version: AppVersion) {
  const themes = {
    v1: {
      name: "Classic",
      year: "2024",
      colors: {
        primary: "from-blue-400 via-purple-400 to-pink-400",
        card: "bg-white",
        text: "text-gray-800",
      },
    },
    v2: {
      name: "Premium",
      year: "2025",
      colors: {
        primary: "from-indigo-500 via-purple-500 to-pink-500",
        card: "bg-white/10 backdrop-blur-xl border border-white/20",
        text: "text-white",
      },
    },
    v3: {
      name: "Current",
      year: "2026",
      colors: {
        primary: "from-cyan-500 via-blue-500 to-purple-500",
        card: "bg-white/95 backdrop-blur",
        text: "text-gray-900",
      },
    },
    v4: {
      name: "Future",
      year: "2027",
      colors: {
        primary: "from-cyan-400 via-purple-400 to-pink-400",
        card: "bg-black/40 backdrop-blur-2xl border border-cyan-500/30",
        text: "text-cyan-100",
      },
    },
  };
  return themes[version];
}
