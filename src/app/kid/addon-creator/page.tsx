"use client";

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
// Dynamically import BlockEditor (client-only)
const BlockEditor = dynamic(() => import('@/components/BlockEditor'), { ssr: false });

import { useRouter } from 'next/navigation';

interface Addon {
  id: string;
  name: string;
  author: string;
  type: 'game' | 'lesson' | 'theme' | 'character' | 'other';
  description: string;
  icon: string;
  code: string;
  downloads: number;
  createdAt: string;
  published: boolean;
}

export default function AddonCreatorPage() {
  const router = useRouter();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [currentAddon, setCurrentAddon] = useState<Addon | null>(null);
  const [showNewAddonForm, setShowNewAddonForm] = useState(false);
  const [useBlockEditor, setUseBlockEditor] = useState(false);
  const [blockXml, setBlockXml] = useState<string>('');
  const [kidName, setKidName] = useState('Creator');
  const [aprilFoolsMode, setAprilFoolsMode] = useState(false);
  const [foolsColor, setFoolsColor] = useState('#FF69B4'); // Hot pink!
  const [partyMode, setPartyMode] = useState(false);

  useEffect(() => {
    // April Fools auto-party timer - activates after 5 minutes!
    const today = new Date();
    const isAprilFools = today.getMonth() === 3 && today.getDate() === 1; // April 1st
    
    if (isAprilFools) {
      const partyTimer = setTimeout(() => {
        setPartyMode(true);
        setAprilFoolsMode(true);
        // Play party sound if possible
        const audio = new Audio();
        audio.src = 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBj2U1/LNezzpFw==';
        try { audio.play(); } catch(e) {}
      }, 300000); // 5 minutes = 300,000 milliseconds
      
      return () => clearTimeout(partyTimer);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setKidName(kid.kidName || 'Creator');
      }

      const savedAddons = localStorage.getItem('myAddons');
      if (savedAddons) {
        setAddons(JSON.parse(savedAddons));
      }
    }
  }, []);

  const saveAddons = (updatedAddons: Addon[]) => {
    setAddons(updatedAddons);
    localStorage.setItem('myAddons', JSON.stringify(updatedAddons));
    
    // Update public store
    const publicAddons = updatedAddons.filter(a => a.published);
    const allPublicAddons = localStorage.getItem('publicAddons');
    const existingPublic = allPublicAddons ? JSON.parse(allPublicAddons) : [];
    
    const otherAuthorsAddons = existingPublic.filter((a: Addon) => 
      !updatedAddons.find(ua => ua.id === a.id)
    );
    localStorage.setItem('publicAddons', JSON.stringify([...otherAuthorsAddons, ...publicAddons]));
  };

  const createAddon = (name: string, type: Addon['type'], description: string, icon: string) => {
    const newAddon: Addon = {
      id: `addon-${Date.now()}`,
      name,
      author: kidName,
      type,
      description,
      icon,
      code: getDefaultCode(type),
      downloads: 0,
      createdAt: new Date().toISOString(),
      published: false,
    };
    
    const updatedAddons = [...addons, newAddon];
    saveAddons(updatedAddons);
    setCurrentAddon(newAddon);
    setShowNewAddonForm(false);
  };

  const getDefaultCode = (type: Addon['type']): string => {
    const templates = {
      game: `// YOUR AWESOME GAME!
// Use this template to build your game

function startGame() {
  console.log("Game started!");
  // Add your game logic here
}

function update() {
  // Game loop - runs every frame
}

function handleClick(x, y) {
  // Handle player clicks
}

// Start the game!
startGame();`,
      
      lesson: `// YOUR CUSTOM LESSON!
// Teach something cool

const lesson = {
  title: "My Cool Lesson",
  description: "Learn something amazing!",
  
  activities: [
    {
      type: "intro",
      content: "Welcome to my lesson!"
    },
    {
      type: "question",
      question: "What is 2 + 2?",
      options: ["3", "4", "5"],
      correct: 1
    }
  ]
};

export default lesson;`,
      
      theme: `// YOUR CUSTOM THEME!
// Change how Learnverse looks

const theme = {
  colors: {
    primary: "#FF6B6B",
    secondary: "#4ECDC4",
    background: "#F7FFF7"
  },
  
  fonts: {
    heading: "Comic Sans MS",
    body: "Arial"
  },
  
  animations: {
    speed: "fast",
    style: "bouncy"
  }
};

export default theme;`,
      
      character: `// YOUR CUSTOM CHARACTER!
// Create a buddy or mascot

const character = {
  name: "Sparky",
  personality: "friendly and energetic",
  
  greetings: [
    "Hey there! Ready to learn?",
    "What's up buddy?",
    "Let's have some fun!"
  ],
  
  encouragements: [
    "You're doing great!",
    "Keep going!",
    "I knew you could do it!"
  ],
  
  appearance: {
    color: "orange",
    shape: "round",
    emoji: "✨"
  }
};

export default character;`,
      
      other: `// YOUR CUSTOM ADD-ON!
// Build anything you can imagine

// Add your code here...
console.log("Hello from my add-on!");`
    };
    
    return templates[type] || templates.other;
  };

  const updateCode = (code: string, xml?: string) => {
    if (!currentAddon) return;
    const updatedAddon = { ...currentAddon, code };
    const updatedAddons = addons.map(a => a.id === currentAddon.id ? updatedAddon : a);
    saveAddons(updatedAddons);
    setCurrentAddon(updatedAddon);
    if (typeof xml === 'string') setBlockXml(xml);
  };

  const publishAddon = () => {
    if (!currentAddon) return;
    
    const updatedAddon = { ...currentAddon, published: true };
    const updatedAddons = addons.map(a => a.id === currentAddon.id ? updatedAddon : a);
    saveAddons(updatedAddons);
    setCurrentAddon(updatedAddon);
    alert('🎉 Add-on published to the store!');
  };

  const unpublishAddon = () => {
    if (!currentAddon) return;
    
    const updatedAddon = { ...currentAddon, published: false };
    const updatedAddons = addons.map(a => a.id === currentAddon.id ? updatedAddon : a);
    saveAddons(updatedAddons);
    setCurrentAddon(updatedAddon);
  };

  const deleteAddon = (addonId: string) => {
    if (!confirm('Delete this add-on forever?')) return;
    
    const updatedAddons = addons.filter(a => a.id !== addonId);
    saveAddons(updatedAddons);
    if (currentAddon?.id === addonId) {
      setCurrentAddon(null);
    }
  };

  const typeIcons = {
    game: '🎮',
    lesson: '📚',
    theme: '🎨',
    character: '🐾',
    other: '⚡'
  };

  const typeColors = {
    game: 'from-red-400 to-red-600',
    lesson: 'from-blue-400 to-blue-600',
    theme: 'from-purple-400 to-purple-600',
    character: 'from-green-400 to-green-600',
    other: 'from-gray-400 to-gray-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-pink-100 p-4" style={aprilFoolsMode ? { background: foolsColor, transition: 'all 0.5s ease' } : {}}>
      {/* PARTY MODE STYLES! */}
      {partyMode && (
        <style jsx global>{`
          @keyframes rainbow {
            0% { background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); }
            14% { background: linear-gradient(45deg, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000); }
            28% { background: linear-gradient(45deg, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00); }
            42% { background: linear-gradient(45deg, #00ff00, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00); }
            57% { background: linear-gradient(45deg, #0000ff, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00); }
            71% { background: linear-gradient(45deg, #4b0082, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff); }
            85% { background: linear-gradient(45deg, #9400d3, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082); }
            100% { background: linear-gradient(45deg, #ff0000, #ff7f00, #ffff00, #00ff00, #0000ff, #4b0082, #9400d3); }
          }
          @keyframes dance {
            0%, 100% { transform: rotate(-5deg) scale(1); }
            25% { transform: rotate(5deg) scale(1.1); }
            50% { transform: rotate(-5deg) scale(0.9); }
            75% { transform: rotate(5deg) scale(1.05); }
          }
          @keyframes shake {
            0%, 100% { transform: translateX(0) translateY(0); }
            10% { transform: translateX(-10px) translateY(5px); }
            20% { transform: translateX(10px) translateY(-5px); }
            30% { transform: translateX(-10px) translateY(10px); }
            40% { transform: translateX(10px) translateY(-10px); }
            50% { transform: translateX(-5px) translateY(5px); }
            60% { transform: translateX(5px) translateY(-5px); }
            70% { transform: translateX(-5px) translateY(10px); }
            80% { transform: translateX(5px) translateY(-10px); }
            90% { transform: translateX(-2px) translateY(2px); }
          }
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(180deg); }
          }
          body {
            animation: rainbow 3s linear infinite !important;
            background-size: 400% 400% !important;
          }
          button, div, h1, h2, h3, p {
            animation: dance 0.5s ease-in-out infinite !important;
          }
          * {
            cursor: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32'%3E%3Ctext y='28' font-size='28'%3E🎉%3C/text%3E%3C/svg%3E"), auto !important;
          }
        `}</style>
      )}
      
      {/* Floating eyes and hands everywhere! */}
      {partyMode && (
        <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-6xl"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animation: `float ${2 + Math.random() * 3}s ease-in-out infinite`,
                animationDelay: `${Math.random() * 2}s`
              }}
            >
              {i % 3 === 0 ? '👀' : i % 3 === 1 ? '🙌' : '🎉'}
            </div>
          ))}
        </div>
      )}
      
      <div className="max-w-7xl mx-auto" style={partyMode ? { animation: 'shake 0.3s infinite' } : {}}>
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-pink-600 bg-clip-text text-transparent" style={aprilFoolsMode ? { color: 'white', background: 'none', WebkitTextFillColor: 'white' } : {}}>
              {partyMode && '👀🙌 '}⚙️ Add-on Creator {aprilFoolsMode && '🤪'}{partyMode && ' 👀🙌🎉'}
            </h1>
            <p className="text-gray-600 mt-1" style={aprilFoolsMode ? { color: 'white' } : {}}>
              {partyMode ? '🎊 SURPRISE! PARTY MODE ACTIVATED! EVERYTHING IS DANCING! 🎊👀🙌💃🕺' : (aprilFoolsMode ? 'APRIL FOOLS MODE ACTIVATED! 😂' : 'Build and share custom content!')}
            </p>
          </div>
          <div className="flex gap-2">
            {partyMode && (
              <div className="absolute top-0 left-0 w-full flex justify-around pointer-events-none" style={{ animation: 'spin 2s linear infinite' }}>
                <span className="text-6xl">👀</span>
                <span className="text-6xl">🙌</span>
                <span className="text-6xl">👀</span>
                <span className="text-6xl">🙌</span>
                <span className="text-6xl">🎉</span>
              </div>
            )}
            <button
              onClick={() => {
                const colors = ['#FF69B4', '#00FF00', '#FF0000', '#FFFF00', '#00FFFF', '#FF00FF', '#FFA500'];
                setAprilFoolsMode(!aprilFoolsMode);
                if (!aprilFoolsMode) {
                  setFoolsColor(colors[Math.floor(Math.random() * colors.length)]);
                }
              }}
              className="px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white rounded-lg hover:from-pink-600 hover:to-purple-600 transition-colors font-bold animate-pulse"
            >
              {partyMode ? '🎉👀🙌' : (aprilFoolsMode ? '🎨 Normal Mode' : '🤪 April Fools!')}
            </button>
            {/* Secret party button */}
            <button
              onClick={() => {
                setPartyMode(!partyMode);
                setAprilFoolsMode(true);
              }}
              className="px-3 py-2 bg-gradient-to-r from-yellow-400 to-red-500 text-white rounded-lg hover:from-yellow-500 hover:to-red-600 transition-colors font-bold"
              title="Instant Party Mode!"
            >
              {partyMode ? '😴 Stop Party' : '🎊 PARTY!'}
            </button>
            <button
              onClick={() => router.push('/kid/addon-store')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              style={aprilFoolsMode ? { background: foolsColor, filter: 'brightness(0.8)' } : {}}
            >
              {partyMode && '👀 '}🛍️ Add-on Store{partyMode && ' 🙌'}
            </button>
            <button
              onClick={() => router.push('/kid')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              style={aprilFoolsMode ? { background: foolsColor, filter: 'brightness(0.6)' } : {}}
            >
              {partyMode && '🙌 '}← Back{partyMode && ' 👀'}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: My Add-ons */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6" style={aprilFoolsMode ? { background: foolsColor, filter: 'brightness(1.1)' } : {}}>
              <h2 className="text-2xl font-bold mb-4 text-gray-800" style={aprilFoolsMode ? { color: 'white' } : {}}>
                {partyMode && '👀🙌 '}My Add-ons {aprilFoolsMode && '😂'}{partyMode && ' 🎉💃'}
              </h2>
              
              <button
                onClick={() => setShowNewAddonForm(true)}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
                style={aprilFoolsMode ? { background: foolsColor, filter: 'brightness(0.9)' } : {}}
              >
                {partyMode && '🙌👀 '}+ New Add-on{partyMode && ' 🎉🎊'}
              </button>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {addons.map(addon => (
                  <div
                    key={addon.id}
                    onClick={() => setCurrentAddon(addon)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentAddon?.id === addon.id
                        ? 'bg-orange-100 border-2 border-orange-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={aprilFoolsMode ? { 
                      background: foolsColor, 
                      filter: currentAddon?.id === addon.id ? 'brightness(0.8)' : 'brightness(0.95)',
                      border: currentAddon?.id === addon.id ? '2px solid white' : 'none'
                    } : {}}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-12 bg-gradient-to-br ${typeColors[addon.type]} rounded-lg shadow-md flex items-center justify-center text-2xl flex-shrink-0`}>
                        {partyMode ? (Math.random() > 0.5 ? '👀' : '🙌') : typeIcons[addon.type]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate" style={aprilFoolsMode ? { color: 'white' } : {}}>
                          {partyMode && '👀 '}{addon.name}{partyMode && ' 🙌'}
                        </p>
                        <p className="text-sm text-gray-600 capitalize" style={aprilFoolsMode ? { color: 'rgba(255,255,255,0.8)' } : {}}>{addon.type}</p>
                        {addon.published ? (
                          <p className="text-xs text-green-600 font-bold" style={aprilFoolsMode ? { color: 'white' } : {}}>✅ Published ({addon.downloads} downloads)</p>
                        ) : (
                          <p className="text-xs text-gray-500" style={aprilFoolsMode ? { color: 'rgba(255,255,255,0.7)' } : {}}>Draft</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {addons.length === 0 && (
                  <p className="text-gray-400 text-center py-8" style={aprilFoolsMode ? { color: 'white' } : {}}>
                    {partyMode ? '👀🙌 No add-ons yet! But look at all these dancing eyes and hands! 🎉💃🕺' : (aprilFoolsMode ? 'No add-ons yet! Everything is ONE COLOR! 🤪' : 'No add-ons yet!\nClick "New Add-on" to start')}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Add-on Editor */}
          <div className="lg:col-span-2">
            {!currentAddon ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center" style={aprilFoolsMode ? { background: foolsColor, filter: 'brightness(1.1)' } : {}}>
                <p className="text-6xl mb-4">{partyMode ? '👀🙌🎉' : '⚙️'}</p>
                <p className="text-xl text-gray-600" style={aprilFoolsMode ? { color: 'white' } : {}}>
                  {partyMode ? '🎊 EVERYTHING IS PARTYING! LOOK AT ALL THESE EYES AND HANDS! 👀🙌💃🕺🎉' : (aprilFoolsMode ? 'Everything is one color! 😂🎨' : 'Select an add-on or create a new one to start coding!')}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6" style={aprilFoolsMode ? { background: foolsColor, filter: 'brightness(1.1)' } : {}}>
                {/* Add-on Info */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-4xl">{typeIcons[currentAddon.type]}</span>
                        <div>
                          <h2 className="text-3xl font-bold text-gray-800">{currentAddon.name}</h2>
                          <p className="text-gray-600">by {currentAddon.author} • <span className="capitalize">{currentAddon.type}</span></p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500">{currentAddon.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 flex-wrap mt-4">
                    {!currentAddon.published ? (
                      <button
                        onClick={publishAddon}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
                      >
                        🌍 Publish to Store
                      </button>
                    ) : (
                      <button
                        onClick={unpublishAddon}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-bold"
                      >
                        📥 Unpublish
                      </button>
                    )}
                    
                    <button
                      onClick={() => deleteAddon(currentAddon.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      🗑️ Delete
                    </button>
                  </div>
                </div>

                {/* Editor Toggle with fun design */}
                <div className="mb-6">
                  <div className="flex gap-2 p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl">
                    <button
                      className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${!useBlockEditor ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setUseBlockEditor(false)}
                    >
                      💻 Code Editor
                      <p className="text-xs mt-1 opacity-75">For text coding</p>
                    </button>
                    <button
                      className={`flex-1 px-6 py-3 rounded-lg font-bold transition-all transform hover:scale-105 ${useBlockEditor ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                      onClick={() => setUseBlockEditor(true)}
                    >
                      🧩 Block Editor
                      <p className="text-xs mt-1 opacity-75">Drag & drop blocks!</p>
                    </button>
                  </div>
                </div>
                {/* Editor Area */}
                {useBlockEditor ? (
                  <div>
                    <BlockEditor
                      initialXml={blockXml}
                      onCodeChange={(code, xml) => updateCode(code, xml)}
                      height={500}
                    />
                  </div>
                ) : (
                  <div>
                    <textarea
                      value={currentAddon.code}
                      onChange={(e) => updateCode(e.target.value)}
                      className="w-full h-[500px] px-4 py-3 border-2 rounded-lg font-mono text-sm bg-gray-900 text-green-400 border-gray-700"
                      placeholder="Write your code here..."
                      spellCheck={false}
                    />
                    <div className="mt-3 flex justify-between items-center text-sm text-gray-500">
                      <p>{currentAddon.code.length} characters</p>
                      <p>💡 Tip: Test your code before publishing!</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Add-on Modal */}
      {showNewAddonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Add-on</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createAddon(
                  formData.get('name') as string,
                  formData.get('type') as Addon['type'],
                  formData.get('description') as string,
                  formData.get('icon') as string
                );
              }}
            >
              <input
                name="name"
                type="text"
                placeholder="Add-on Name"
                required
                className="w-full px-3 py-2 border rounded-lg mb-3"
              />
              
              <select
                name="type"
                required
                className="w-full px-3 py-2 border rounded-lg mb-3"
              >
                <option value="">Choose Type...</option>
                <option value="game">🎮 Game</option>
                <option value="lesson">📚 Lesson</option>
                <option value="theme">🎨 Theme</option>
                <option value="character">🐾 Character</option>
                <option value="other">⚡ Other</option>
              </select>
              
              <textarea
                name="description"
                placeholder="Short description"
                required
                className="w-full px-3 py-2 border rounded-lg mb-3 h-20"
              />
              
              <input
                name="icon"
                type="text"
                placeholder="Icon emoji (e.g., 🎮)"
                maxLength={2}
                defaultValue="⚡"
                className="w-full px-3 py-2 border rounded-lg mb-4 text-center text-2xl"
              />

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
                >
                  Create Add-on
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewAddonForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
