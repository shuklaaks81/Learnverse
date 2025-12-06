"use client";
import React, { useEffect, useState } from "react";

const versions = [
  {
    key: "original",
    label: "Original",
    desc: "The classic Learnverse experience!",
    img: "/original-preview.png",
    highlight: "Main App"
  },
  {
    key: "middleage",
    label: "Middle Age",
    desc: "A supercharged version with more features and style!",
    img: "/middleage-preview.png",
    highlight: "2nd Best App"
  },
  {
    key: "premium",
    label: "Premium",
    desc: "The best, most futuristic learning app you can imagine!",
    img: "/premium-preview.png",
    highlight: "The Best!"
  }
];

export default function VersionSelectModal({ onSelect }: { onSelect: (v: string) => void }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const chosen = localStorage.getItem("learnverseVersion");
    if (!chosen) setShow(true);
  }, []);

  const handleSelect = (key: string) => {
    localStorage.setItem("learnverseVersion", key);
    setShow(false);
    onSelect(key);
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black bg-opacity-70">
      <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-3xl w-full flex flex-col items-center border-8 border-fuchsia-400">
        <h2 className="text-3xl font-extrabold text-fuchsia-700 mb-4 text-center">Choose Your Learnverse Version</h2>
        <div className="flex flex-col sm:flex-row gap-8 w-full justify-center items-center">
          {versions.map((v) => (
            <button
              key={v.key}
              onClick={() => handleSelect(v.key)}
              className="flex flex-col items-center bg-gradient-to-br from-fuchsia-100 to-yellow-100 rounded-2xl shadow-lg p-4 w-64 hover:scale-105 transition border-4 border-fuchsia-200 hover:border-fuchsia-400"
            >
              <img src={v.img} alt={v.label} className="w-40 h-32 object-contain rounded-xl mb-2 border-2 border-fuchsia-300 bg-white" />
              <span className="text-xl font-bold text-fuchsia-700 mb-1">{v.label}</span>
              <span className="text-sm text-gray-700 mb-2">{v.desc}</span>
              <span className="text-xs font-semibold text-fuchsia-500">{v.highlight}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
