"use client";

import { useRouter } from "next/navigation";
import { useVersion, getVersionTheme } from "@/utils/useVersion";
import { useEffect } from "react";

export default function TimeMachinePage() {
  const router = useRouter();
  const { version, switchVersion } = useVersion();

  // Force bypass any maintenance/shutdown
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("appMaintenance");
      localStorage.removeItem("showMaintenance");
      localStorage.removeItem("maintenanceReason");
    }
  }, []);

  const versions = [
    {
      id: "v0.1",
      name: "Genesis",
      year: "Early 2024",
      emoji: "🐣",
      description: "The very first version - a simple scaffolded app",
      features: ["Plain white background", "Basic text", "No lessons yet message"],
      status: "lost",
      lostReason: "Code lost in time :(",
    },
    {
      id: "v0.5",
      name: "First Lessons",
      year: "Spring 2024",
      emoji: "📚",
      description: "Added the first real lessons",
      features: ["Basic lesson player", "Simple questions", "No styling yet"],
      status: "lost",
      lostReason: "Overwritten during redesign",
    },
    {
      id: "v1",
      name: "Classic",
      year: "Summer 2024",
      emoji: "🎨",
      description: "Where it all began! Simple white background.",
      features: ["Plain white design", "Basic buttons", "No lessons yet message"],
      status: "available",
      isReplica: true,
    },
    {
      id: "v1.5",
      name: "Interactive Era",
      year: "Fall 2024",
      emoji: "🎮",
      description: "Added games and interactive lessons",
      features: ["Drag and drop", "Mini games", "Achievements"],
      status: "lost",
      lostReason: "Merged into V2",
    },
    {
      id: "v2",
      name: "Premium",
      year: "Winter 2025",
      emoji: "✨",
      description: "Holographic upgrade with futuristic vibes",
      features: ["Glass morphism", "Neon accents", "Enhanced animations"],
      status: "available",
    },
    {
      id: "v3",
      name: "Current",
      year: "2026",
      emoji: "🚀",
      description: "The version you know and love",
      features: ["Polished UI", "More content", "Better performance"],
      status: "available",
    },
    {
      id: "v4",
      name: "Future",
      year: "2027",
      emoji: "🌌",
      description: "Coming soon! 3D floating interface",
      features: ["Full 3D UI", "AI Learning", "Multiplayer"],
      status: "available",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-black p-8">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => router.push("/kid")}
          className="mb-8 px-6 py-3 bg-white/10 backdrop-blur text-white rounded-xl hover:bg-white/20 transition"
        >
          ← Back to Hub
        </button>

        <div className="text-center mb-12">
          <h1 className="text-6xl font-bold text-white mb-4">
            🕰️ Version Time Machine
          </h1>
          <p className="text-2xl text-cyan-300">
            Travel through Learnverse history!
          </p>
          <p className="text-lg text-white/70 mt-2">
            Currently using: <span className="font-bold text-cyan-400">{getVersionTheme(version).name}</span>
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-cyan-500 via-purple-500 to-pink-500" />

          <div className="space-y-16">
            {versions.map((v, i) => (
              <div
                key={v.id}
                className={`flex items-center gap-8 ${
                  i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                }`}
              >
                <div className="flex-1 flex justify-center relative">
                  <div
                    className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
                      version === v.id
                        ? "bg-cyan-500 ring-8 ring-cyan-500/30 animate-pulse"
                        : v.status === "lost"
                        ? "bg-gray-700 opacity-50"
                        : "bg-white/10 backdrop-blur"
                    }`}
                  >
                    {v.emoji}
                  </div>
                </div>

                <div className="flex-1">
                  <div
                    className={`p-8 rounded-3xl transition-all ${
                      v.status === "lost"
                        ? "bg-gray-800/30 border border-gray-700 opacity-70"
                        : version === v.id
                        ? "bg-cyan-500/20 border-2 border-cyan-500 shadow-[0_0_40px_rgba(6,182,212,0.5)]"
                        : "bg-white/5 backdrop-blur border border-white/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h2 className="text-3xl font-bold text-white">{v.name}</h2>
                        <p className="text-cyan-300 text-lg">{v.year}</p>
                      </div>
                      {version === v.id && (
                        <span className="px-4 py-2 bg-cyan-500 text-black rounded-full font-bold text-sm">
                          ACTIVE
                        </span>
                      )}
                      {v.status === "lost" && (
                        <span className="px-4 py-2 bg-gray-700 text-gray-300 rounded-full font-bold text-sm">
                          LOST
                        </span>
                      )}
                    </div>

                    <p className="text-white/80 mb-4">{v.description}</p>

                    <ul className="space-y-2 mb-6">
                      {v.features.map((feature, idx) => (
                        <li key={idx} className="text-white/70 flex items-center gap-2">
                          <span className="text-cyan-400">▸</span> {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => {
                        if (v.status === "available") {
                          if (v.id === "v1") {
                            router.push("/kid/v1-hub");
                          } else if (v.id !== "v4") {
                            switchVersion(v.id as any);
                          }
                        }
                      }}
                      disabled={version === v.id || v.status === "lost" || v.id === "v4"}
                      className={`w-full py-3 rounded-xl font-bold transition ${
                        v.status === "lost"
                          ? "bg-gray-700 text-gray-400 cursor-not-allowed"
                          : v.id === "v4"
                          ? "bg-purple-600 text-white cursor-not-allowed"
                          : version === v.id
                          ? "bg-gray-500 text-gray-300 cursor-not-allowed"
                          : "bg-gradient-to-r from-cyan-500 to-purple-500 text-white hover:scale-105"
                      }`}
                    >
                      {v.status === "lost" 
                        ? `❌ Lost: ${v.lostReason}` 
                        : v.id === "v4"
                        ? "🚧 Coming Soon"
                        : v.id === "v1"
                        ? "View Replica"
                        : version === v.id 
                        ? "Currently Active" 
                        : `Switch to ${v.name}`}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
