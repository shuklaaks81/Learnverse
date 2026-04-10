"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Component types that can be added to apps
type ComponentType = "button" | "text" | "image" | "colorbox" | "appbuilder";

interface AppComponent {
  id: string;
  type: ComponentType;
  content: string;
  color?: string;
  nestedApp?: AppComponent[]; // For app-builder components
}

interface AppBuilderProps {
  depth?: number;
  onClose?: () => void;
}

export default function AppBuilder({ depth = 0, onClose }: AppBuilderProps) {
  const router = useRouter();
  const [components, setComponents] = useState<AppComponent[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [selectedComponent, setSelectedComponent] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");
  const [editingColor, setEditingColor] = useState("#3b82f6");
  const [nestedBuilder, setNestedBuilder] = useState<string | null>(null);
  const [appName, setAppName] = useState(`App Level ${depth + 1}`);

  // Color gradient based on depth for visual feedback
  const depthColors = [
    "from-blue-100 to-purple-100",
    "from-green-100 to-blue-100",
    "from-yellow-100 to-pink-100",
    "from-red-100 to-orange-100",
    "from-purple-100 to-blue-100",
    "from-pink-100 to-red-100",
    "from-indigo-100 to-purple-100",
    "from-teal-100 to-green-100",
  ];
  const bgGradient = depthColors[depth % depthColors.length];

  // FUNNY DEPTH MESSAGES! 😂
  function getDepthMessage() {
    if (depth === 0) return null;
    if (depth === 1) return { emoji: "🎉", text: "You made your first nested app!", color: "bg-green-100 border-green-400 text-green-800" };
    if (depth === 5) return { emoji: "🤔", text: "5 levels deep... are you okay?", color: "bg-blue-100 border-blue-400 text-blue-800" };
    if (depth === 10) return { emoji: "😅", text: "Level 10! You're committed to this madness!", color: "bg-yellow-100 border-yellow-400 text-yellow-800" };
    if (depth === 20) return { emoji: "🤯", text: "LEVEL 20?! Your computer is sweating!", color: "bg-orange-100 border-orange-400 text-orange-800" };
    if (depth === 50) return { emoji: "😰", text: "50 LEVELS! SERIOUSLY?! GET HELP!", color: "bg-red-100 border-red-400 text-red-800" };
    if (depth === 69) return { emoji: "😏", text: "Nice.", color: "bg-purple-100 border-purple-400 text-purple-800" };
    if (depth === 100) return { emoji: "🔥", text: "🚨 LEVEL 100 ALERT 🚨 YOUR COMPUTER IS ON FIRE!", color: "bg-red-200 border-red-500 text-red-900 animate-pulse" };
    if (depth === 200) return { emoji: "💀", text: "Level 200... why... just why...", color: "bg-gray-100 border-gray-400 text-gray-800" };
    if (depth === 420) return { emoji: "🌿", text: "Blaze it! (Also please stop)", color: "bg-green-200 border-green-500 text-green-900" };
    if (depth === 500) return { emoji: "😭", text: "YOUR COMPUTER IS LITERALLY CRYING! LEVEL 500!", color: "bg-blue-200 border-blue-500 text-blue-900 animate-bounce" };
    if (depth === 666) return { emoji: "😈", text: "Welcome to Hell... I mean Level 666", color: "bg-red-300 border-red-600 text-red-950" };
    if (depth === 1000) return { emoji: "🏆", text: "🎉🎉🎉 ABSOLUTE MADLAD! YOU REACHED LEVEL 1000! 🎉🎉🎉", color: "bg-gradient-to-r from-yellow-200 via-pink-200 to-purple-200 border-rainbow-500 text-purple-900 animate-ping" };
    if (depth % 100 === 0) return { emoji: "📊", text: `Milestone: Level ${depth}. You're insane.`, color: "bg-purple-100 border-purple-400 text-purple-800" };
    if (depth > 1000) return { emoji: "💻", text: `Level ${depth}... your computer has achieved sentience and is planning revenge.`, color: "bg-black border-red-500 text-red-500" };
    return null;
  }

  const depthMsg = getDepthMessage();

  // Component palette
  const palette: { type: ComponentType; icon: string; label: string }[] = [
    { type: "button", icon: "🔘", label: "Button" },
    { type: "text", icon: "📝", label: "Text" },
    { type: "image", icon: "🖼️", label: "Image" },
    { type: "colorbox", icon: "🎨", label: "Color Box" },
    { type: "appbuilder", icon: "📱", label: "App Builder" },
  ];

  // Add component to canvas
  function addComponent(type: ComponentType) {
    const newComponent: AppComponent = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      content:
        type === "button"
          ? "Click Me!"
          : type === "text"
          ? "Hello World!"
          : type === "image"
          ? "🎉"
          : type === "colorbox"
          ? ""
          : "App Builder",
      color: type === "colorbox" ? "#3b82f6" : type === "button" ? "#10b981" : "#6366f1",
      nestedApp: type === "appbuilder" ? [] : undefined,
    };
    setComponents([...components, newComponent]);
  }

  // Delete component
  function deleteComponent(id: string) {
    setComponents(components.filter((c) => c.id !== id));
    setSelectedComponent(null);
  }

  // Update component
  function updateComponent(id: string, updates: Partial<AppComponent>) {
    setComponents(components.map((c) => (c.id === id ? { ...c, ...updates } : c)));
  }

  // Save app to localStorage with code
  function saveApp() {
    const appData = { name: appName, components, depth };
    const code = btoa(JSON.stringify(appData)); // Base64 encode
    localStorage.setItem(`app_${code.slice(0, 8)}`, JSON.stringify(appData));
    alert(`App saved! Code: ${code.slice(0, 8)}\n\nShare this code with friends!`);
  }

  // Load app from code
  function loadApp() {
    const code = prompt("Enter app code:");
    if (!code) return;
    try {
      const appData = localStorage.getItem(`app_${code}`);
      if (appData) {
        const parsed = JSON.parse(appData);
        setComponents(parsed.components || []);
        setAppName(parsed.name || "Loaded App");
      } else {
        alert("App code not found!");
      }
    } catch (e) {
      alert("Invalid code!");
    }
  }

  // Render component in preview mode
  function renderComponent(comp: AppComponent) {
    if (comp.type === "button") {
      return (
        <button
          key={comp.id}
          className="px-6 py-3 rounded-lg font-bold text-white shadow-lg hover:scale-105 transition-transform"
          style={{ backgroundColor: comp.color }}
          onClick={() => alert(`${comp.content} clicked!`)}
        >
          {comp.content}
        </button>
      );
    }
    if (comp.type === "text") {
      return (
        <div key={comp.id} className="text-2xl font-bold" style={{ color: comp.color }}>
          {comp.content}
        </div>
      );
    }
    if (comp.type === "image") {
      return (
        <div key={comp.id} className="text-6xl">
          {comp.content}
        </div>
      );
    }
    if (comp.type === "colorbox") {
      return (
        <div
          key={comp.id}
          className="w-32 h-32 rounded-xl shadow-lg"
          style={{ backgroundColor: comp.color }}
        />
      );
    }
    if (comp.type === "appbuilder") {
      return (
        <button
          key={comp.id}
          className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl font-bold shadow-xl hover:scale-105 transition-transform flex items-center gap-2"
          onClick={() => setNestedBuilder(comp.id)}
        >
          📱 {comp.content} (Level {depth + 2})
        </button>
      );
    }
  }

  // If a nested builder is open
  if (nestedBuilder) {
    const comp = components.find((c) => c.id === nestedBuilder);
    if (comp && comp.type === "appbuilder") {
      return (
        <AppBuilder
          depth={depth + 1}
          onClose={() => setNestedBuilder(null)}
        />
      );
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${bgGradient} p-4`}>
      {/* FUNNY DEPTH MESSAGE BANNER! */}
      {depthMsg && (
        <div className={`max-w-6xl mx-auto mb-4 p-4 rounded-2xl border-4 ${depthMsg.color} font-bold text-center shadow-2xl`}>
          <div className="text-4xl mb-2">{depthMsg.emoji}</div>
          <div className="text-xl">{depthMsg.text}</div>
        </div>
      )}
      
      {/* Header with depth indicator */}
      <div className="max-w-6xl mx-auto mb-4">
        <div className="bg-white rounded-2xl shadow-xl p-4 flex items-center justify-between">
          {depth > 0 && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
            >
              ← Back to Level {depth}
            </button>
          )}
          {depth === 0 && (
            <button
              onClick={() => router.push("/kid")}
              className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg font-bold"
            >
              ← Kid Hub
            </button>
          )}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              className="px-4 py-2 border-2 border-purple-300 rounded-lg font-bold text-xl"
              placeholder="App Name"
            />
            <div className="px-4 py-2 bg-purple-500 text-white rounded-lg font-bold">
              📊 Depth: {depth + 1}
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={saveApp}
              className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-bold"
            >
              💾 Save
            </button>
            <button
              onClick={loadApp}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-bold"
            >
              📂 Load
            </button>
            <button
              onClick={() => setPreviewMode(!previewMode)}
              className="px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-bold"
            >
              {previewMode ? "✏️ Edit" : "👁️ Preview"}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Component Palette (only in edit mode) */}
        {!previewMode && (
          <div className="bg-white rounded-2xl shadow-xl p-4">
            <h2 className="text-xl font-bold mb-4 text-purple-700">📦 Components</h2>
            <div className="space-y-2">
              {palette.map((item) => (
                <button
                  key={item.type}
                  onClick={() => addComponent(item.type)}
                  className="w-full px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-200 hover:to-pink-200 rounded-xl font-bold flex items-center gap-2 transition-all"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
            <div className="mt-6 p-4 bg-yellow-50 rounded-xl border-2 border-yellow-300">
              <p className="text-sm font-bold text-yellow-800">
                💡 Tip: Add an "App Builder" to create apps inside apps!
              </p>
            </div>
          </div>
        )}

        {/* Canvas */}
        <div className={`bg-white rounded-2xl shadow-xl p-6 ${previewMode ? "col-span-1 lg:col-span-4" : "col-span-1 lg:col-span-3"}`}>
          <h2 className="text-2xl font-bold mb-4 text-purple-700">
            {previewMode ? "🎬 Preview Mode" : "🎨 Canvas"}
          </h2>
          {components.length === 0 && (
            <div className="text-center py-20 text-gray-400">
              <div className="text-6xl mb-4">📱</div>
              <div className="text-xl font-bold">Your app is empty!</div>
              <div>Add components from the palette →</div>
            </div>
          )}
          <div className="flex flex-wrap gap-4 items-start">
            {components.map((comp) => {
              if (previewMode) {
                return renderComponent(comp);
              }
              // Edit mode
              const isSelected = selectedComponent === comp.id;
              return (
                <div
                  key={comp.id}
                  onClick={() => setSelectedComponent(comp.id)}
                  className={`relative p-4 rounded-xl cursor-pointer transition-all ${
                    isSelected ? "ring-4 ring-purple-500 bg-purple-50" : "bg-gray-50 hover:bg-gray-100"
                  }`}
                >
                  {renderComponent(comp)}
                  {isSelected && (
                    <div className="absolute -top-2 -right-2 flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteComponent(comp.id);
                        }}
                        className="px-2 py-1 bg-red-500 text-white rounded-full text-xs font-bold hover:bg-red-600"
                      >
                        🗑️
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Edit Panel for selected component */}
          {!previewMode && selectedComponent && (
            <div className="mt-6 p-4 bg-purple-50 rounded-xl border-2 border-purple-300">
              {(() => {
                const comp = components.find((c) => c.id === selectedComponent);
                if (!comp) return null;
                return (
                  <div className="space-y-3">
                    <h3 className="font-bold text-purple-700">Edit {comp.type}</h3>
                    {(comp.type === "button" || comp.type === "text" || comp.type === "appbuilder") && (
                      <div>
                        <label className="block text-sm font-bold mb-1">Text</label>
                        <input
                          type="text"
                          value={comp.content}
                          onChange={(e) => updateComponent(comp.id, { content: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg"
                        />
                      </div>
                    )}
                    {comp.type === "image" && (
                      <div>
                        <label className="block text-sm font-bold mb-1">Emoji</label>
                        <input
                          type="text"
                          value={comp.content}
                          onChange={(e) => updateComponent(comp.id, { content: e.target.value })}
                          className="w-full px-3 py-2 border-2 border-purple-300 rounded-lg text-4xl"
                          maxLength={2}
                        />
                      </div>
                    )}
                    {(comp.type === "button" || comp.type === "text" || comp.type === "colorbox") && (
                      <div>
                        <label className="block text-sm font-bold mb-1">Color</label>
                        <input
                          type="color"
                          value={comp.color}
                          onChange={(e) => updateComponent(comp.id, { color: e.target.value })}
                          className="w-full h-12 rounded-lg cursor-pointer"
                        />
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
