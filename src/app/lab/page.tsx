"use client";
import React, { useState } from "react";

const initialItems = [
  { name: "Explosive", icon: "💣", effect: "Boom! The explosion destroyed the building.", explanation: "Explosives release energy rapidly, causing destruction. In real life, always be safe!" },
  { name: "Building", icon: "🏢", effect: "A building appears in the lab.", explanation: "Buildings provide shelter and space for people to live and work." },
  { name: "Tree", icon: "🌳", effect: "A tree grows in the lab.", explanation: "Trees produce oxygen and provide shade. They are important for the environment." }
];

export default function LabPage() {
  const [labItems, setLabItems] = useState([] as typeof initialItems);
  const [message, setMessage] = useState("");
  const [explanation, setExplanation] = useState("");

  function placeItem(item: typeof initialItems[number]) {
    setLabItems([...labItems, item]);
    setMessage(item.effect);
    setExplanation(item.explanation);
    // Simple effect: if explosive and building are both present, show a special result
    if (
      (item.name === "Explosive" && labItems.some(i => i.name === "Building")) ||
      (item.name === "Building" && labItems.some(i => i.name === "Explosive"))
    ) {
      setMessage("Boom! The explosion destroyed the building.");
      setExplanation("Explosives release energy rapidly, causing destruction. In real life, always be safe!");
      setLabItems(labItems.filter(i => i.name !== "Building"));
    }
  }

  function resetLab() {
    setLabItems([]);
    setMessage("");
    setExplanation("");
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-green-100 to-blue-200 p-6">
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-8">
        <h1 className="text-3xl font-bold mb-4 text-green-700">Learnverse Lab</h1>
        <div className="w-full min-h-[200px] flex flex-wrap items-center justify-center border-2 border-dashed border-green-300 rounded-xl bg-green-50 mb-4 p-4">
          {labItems.length === 0 && <div className="text-gray-400">The lab is empty. Place an item below!</div>}
          {labItems.map((item, idx) => (
            <span key={idx} className="text-5xl mx-2 animate-bounce" title={item.name}>{item.icon}</span>
          ))}
        </div>
        {message && (
          <div className="w-full bg-yellow-100 border-l-4 border-yellow-400 text-yellow-700 p-4 mb-2 rounded">
            <strong>Result:</strong> {message}
          </div>
        )}
        {explanation && (
          <div className="w-full bg-blue-100 border-l-4 border-blue-400 text-blue-700 p-4 mb-2 rounded">
            <strong>Why?</strong> {explanation}
          </div>
        )}
        <button onClick={resetLab} className="mt-2 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300">Reset Lab</button>
      </div>
      <div className="w-full max-w-2xl flex justify-center gap-4 bg-white/80 rounded-2xl shadow-lg p-4 sticky bottom-0">
        {initialItems.map((item) => (
          <button
            key={item.name}
            onClick={() => placeItem(item)}
            className="flex flex-col items-center px-4 py-2 bg-green-200 rounded-xl hover:bg-green-300 focus:outline-none"
          >
            <span className="text-3xl mb-1">{item.icon}</span>
            <span className="text-xs font-semibold">{item.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
