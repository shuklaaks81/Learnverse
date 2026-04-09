"use client";
import React, { useState, useMemo } from "react";
// --- Learning Buddy Component ---
function LearningBuddy() {
  const [anim, setAnim] = useState("bounce");
  const [messageIdx, setMessageIdx] = useState(0);
  const [wink, setWink] = useState(false);
  const [color, setColor] = useState("#f0abfc");
  const messages = [
    "Hi, I'm your Learning Buddy!",
    "Let's learn something new today!",
    "Need a tip? Just ask!",
    "You're doing awesome!",
    "Click me for a surprise!",
    "Keep going, superstar!",
    "Did you know? Science is fun!",
    "I'm always here to help!",
    "Ready for your next challenge?",
    "Let's make learning magical!",
    "Wink! 😉",
    "Spin to win! 🌀",
    "Color party! 🌈",
    "Sparkle time! ✨",
    "Boing boing! 🦘",
    "Wave hello! 👋"
  ];
  // Fun animation triggers
  const anims = ["wave", "bounce", "spin", "sparkle", "color", "wink"];
  function randomAnim() {
    return anims[Math.floor(Math.random() * anims.length)];
  }
  function handleClick() {
    const nextAnim = randomAnim();
    setAnim(nextAnim);
    setMessageIdx(idx => (idx + 1) % messages.length);
    if (nextAnim === "wink") {
      setWink(true);
      setTimeout(() => setWink(false), 700);
    }
    if (nextAnim === "color") {
      setColor(`#${Math.floor(Math.random()*16777215).toString(16).padStart(6, "0")}`);
    } else {
      setColor("#f0abfc");
    }
    // Reset anim after duration
    setTimeout(() => setAnim("bounce"), 1200);
  }
  // Randomly animate every so often
  React.useEffect(() => {
    const timer = setInterval(() => {
      handleClick();
    }, 6000 + Math.random() * 4000);
    return () => clearInterval(timer);
  }, []);
  return (
    <div className="flex flex-col items-center group cursor-pointer select-none" onClick={handleClick} title="Click me!">
      {/* Buddy body: SVG for personality */}
      <div className="relative">
        <svg width="90" height="110" viewBox="0 0 90 110" className={
          anim === "wave" ? "animate-buddy-wave" :
          anim === "spin" ? "animate-buddy-spin" :
          anim === "sparkle" ? "animate-buddy-sparkle" :
          "animate-buddy-bounce"
        } style={{transition: 'filter 0.3s', filter: anim === "sparkle" ? 'drop-shadow(0 0 24px #f472b6)' : 'drop-shadow(0 0 8px #f0abfc)', fill: color}}>
          {/* Body */}
          <ellipse cx="45" cy="65" rx="32" ry="38" fill={color} stroke="#a21caf" strokeWidth="3" />
          {/* Face */}
          <ellipse cx="45" cy="55" rx="22" ry="20" fill="#fff" stroke="#a21caf" strokeWidth="2" />
          {/* Eyes */}
          <ellipse cx="36" cy="55" rx="4" ry="5" fill="#0c0a09" style={wink ? {transform: 'scaleY(0.2)'} : {}} />
          <ellipse cx="54" cy="55" rx="4" ry="5" fill="#0c0a09" />
          {/* Smile */}
          <path d="M38 65 Q45 72 52 65" stroke="#a21caf" strokeWidth="2" fill="none" />
          {/* Left arm (waves) */}
          <path d="M15 70 Q0 50 25 45" stroke="#a21caf" strokeWidth="5" fill="none" className={anim === "wave" ? "animate-buddy-arm-wave" : ""} />
          {/* Right arm */}
          <path d="M75 70 Q90 50 65 45" stroke="#a21caf" strokeWidth="5" fill="none" />
          {/* Feet */}
          <ellipse cx="32" cy="100" rx="7" ry="4" fill="#a21caf" />
          <ellipse cx="58" cy="100" rx="7" ry="4" fill="#a21caf" />
        </svg>
        {/* Sparkle effect */}
        <div className={
          "absolute left-1/2 top-2 -translate-x-1/2 pointer-events-none " +
          (anim === "sparkle" ? "animate-buddy-sparkle" : "")
        }>✨</div>
      </div>
      {/* Speech bubble */}
      <div className="relative mt-2">
        <div className="bg-white border-2 border-fuchsia-400 rounded-2xl px-4 py-2 text-fuchsia-900 font-bold shadow-lg text-base min-w-[180px] text-center animate-fade-in">
          {messages[messageIdx]}
        </div>
        <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-4 h-4 bg-white border-l-2 border-b-2 border-fuchsia-400 rotate-45" />
      </div>
    </div>
  );
}

// --- Custom Animations for Learning Buddy ---
// Add these to your global CSS (e.g., globals.css or in a <style jsx global>)
// .animate-buddy-wave { animation: buddy-wave 0.9s cubic-bezier(.4,2,.6,1) 1; }
// .animate-buddy-bounce { animation: buddy-bounce 1.2s infinite alternate cubic-bezier(.4,2,.6,1); }
// .animate-buddy-arm-wave { animation: buddy-arm-wave 0.9s cubic-bezier(.4,2,.6,1) 1; }
// .animate-buddy-sparkle { animation: buddy-sparkle 2.5s infinite linear; font-size: 1.5rem; }
// .animate-buddy-spin { animation: buddy-spin 1.2s cubic-bezier(.4,2,.6,1) 1; }
// @keyframes buddy-wave { 0% { transform: rotate(0deg); } 30% { transform: rotate(-10deg); } 60% { transform: rotate(20deg); } 100% { transform: rotate(0deg); } }
// @keyframes buddy-bounce { 0% { transform: translateY(0); } 100% { transform: translateY(-10px); } }
// @keyframes buddy-arm-wave { 0% { stroke-dashoffset: 0; } 50% { stroke-dashoffset: 20; } 100% { stroke-dashoffset: 0; } }
// @keyframes buddy-sparkle { 0% { opacity: 0.7; transform: scale(1) rotate(0deg); } 50% { opacity: 1; transform: scale(1.2) rotate(20deg); } 100% { opacity: 0.7; transform: scale(1) rotate(0deg); } }
// @keyframes buddy-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
import { useEffect } from "react";
import { playLabSound } from "@/utils/labSounds";

const initialItems = [
    { name: "Big Battery", icon: "🔋💥", effect: "A big battery provides massive power!", explanation: "Big batteries can power many devices at once. Provides 1000 units of electricity." },
  { name: "Explosive", icon: "💣", effect: "Boom! The explosion destroyed the building.", explanation: "Explosives release energy rapidly, causing destruction. In real life, always be safe!" },
  { name: "Weak Explosive", icon: "🧨", effect: "A small pop! The weak explosive made a little noise.", explanation: "Weak explosives release a small amount of energy. Still, always be careful!" },
  { name: "Medium Explosive", icon: "💥", effect: "A big bang! The medium explosive shook the lab.", explanation: "Medium explosives are more powerful and can cause significant damage." },
  { name: "Strong Explosive", icon: "💣🔥", effect: "Massive explosion! The strong explosive changed the landscape.", explanation: "Strong explosives are extremely dangerous and should only be handled by professionals." },
  { name: "TNT", icon: "🧨💥", effect: "TNT explodes with massive force!", explanation: "TNT (Trinitrotoluene) is a powerful explosive used in demolition. Chain reactions possible!" },
  { name: "C4", icon: "🧱💣", effect: "C4 plastic explosive detonates!", explanation: "C4 is a military-grade plastic explosive that can be molded into shapes." },
  { name: "Dynamite", icon: "🧨🔥", effect: "Dynamite stick explodes with a bang!", explanation: "Dynamite was invented by Alfred Nobel and revolutionized mining and construction." },
  { name: "Nuclear Bomb", icon: "☢️💥", effect: "NUCLEAR EXPLOSION! Everything is GONE!", explanation: "Nuclear weapons use atomic reactions. This is just a simulation - never use in real life!" },
  { name: "Chemical Bottle", icon: "🧪", effect: "A chemical reaction occurs! Bubbles and colors appear.", explanation: "Chemicals can react in surprising ways. Always wear safety gear in real labs!" },
  { name: "Acid", icon: "🧫", effect: "Acid reacts with metals and other chemicals!", explanation: "Acids can dissolve metals and cause strong reactions. Handle with care!" },
  { name: "Base", icon: "🧴", effect: "Base neutralizes acids!", explanation: "Bases can neutralize acids and are slippery to the touch. Always use gloves!" },
  { name: "Blade", icon: "🗡️", effect: "A sharp blade can cut objects.", explanation: "Blades are sharp and can cut through many materials. Be careful!" },
  { name: "Bottle", icon: "🍾", effect: "A bottle to mix or pour chemicals.", explanation: "Bottles are used to store and pour liquids in the lab." },
  { name: "Wire", icon: "🪢", effect: "A wire to connect items.", explanation: "Wires can carry electricity or connect devices together." },
  { name: "Battery", icon: "🔋", effect: "A battery provides power.", explanation: "Batteries store energy and can power circuits and devices." },
  { name: "Chip", icon: "💾", effect: "A programmable chip! Double-click to code.", explanation: "Chips can be programmed to control other devices. Double-click to open code editor." },
  { name: "Spinner", icon: "🌀", effect: "The spinner spins rapidly, creating a mini tornado!", explanation: "Spinners demonstrate rotational motion and inertia." },
  { name: "Apple", icon: "🍎", effect: "An apple appears. Maybe it will fall?", explanation: "Apples are healthy and remind us of gravity (thanks, Newton!)." },
  { name: "Building", icon: "🏢", effect: "A building appears in the lab.", explanation: "Buildings provide shelter and space for people to live and work." },
  { name: "Tree", icon: "🌳", effect: "A tree grows in the lab.", explanation: "Trees produce oxygen and provide shade. They are important for the environment." },
  { name: "Rocket", icon: "🚀", effect: "The rocket launches into the sky!", explanation: "Rockets use fuel to overcome gravity and reach space." },
  { name: "Water", icon: "💧", effect: "A splash of water cools things down.", explanation: "Water is essential for life and can change the outcome of reactions." },
  { name: "Fire", icon: "🔥", effect: "Fire burns brightly in the lab.", explanation: "Fire is a chemical reaction that releases heat and light." },
  { name: "Robot", icon: "🤖", effect: "A robot starts moving and beeping!", explanation: "Robots are machines that can perform tasks automatically." },
  { name: "Magnet", icon: "🧲", effect: "The magnet attracts metal objects.", explanation: "Magnets create invisible fields that attract certain metals." },
  { name: "Ball", icon: "⚽", effect: "A ball bounces around the lab.", explanation: "Balls are great for learning about motion and energy transfer." },
  { name: "Book", icon: "📚", effect: "A book opens, revealing new knowledge!", explanation: "Books are a source of endless learning and discovery." },
  { name: "Star", icon: "⭐", effect: "A star twinkles in the lab.", explanation: "Stars are massive balls of burning gas in space." },
  { name: "Crystal", icon: "💎", effect: "A crystal sparkles with light.", explanation: "Crystals form beautiful shapes due to their atomic structure." },
  { name: "Paint", icon: "🎨", effect: "Paint splashes everywhere, making the lab colorful!", explanation: "Painting is a creative way to express ideas and decorate." },
  { name: "Light Bulb", icon: "💡", effect: "The light bulb glows!", explanation: "Light bulbs convert electrical energy into light. Needs power to work!" },
  { name: "Motor", icon: "⚙️", effect: "The motor starts spinning!", explanation: "Motors convert electrical energy into mechanical motion. Needs power!" },
  { name: "Generator", icon: "🔌", effect: "The generator produces electricity!", explanation: "Generators convert mechanical energy into electrical energy." },
  { name: "Computer", icon: "💻", effect: "The computer boots up!", explanation: "Computers process information using binary code. Needs power!" },
  { name: "Tesla Coil", icon: "⚡", effect: "The Tesla coil shoots lightning bolts!", explanation: "Tesla coils create high-voltage electricity and spectacular electrical discharges!" },
  { name: "Laser", icon: "🔴", effect: "The laser fires a beam of intense light!", explanation: "Lasers emit concentrated beams of light through stimulated emission. Needs power!" },
  { name: "Piston", icon: "🔩", effect: "The piston pushes and pulls!", explanation: "Pistons convert pressure into mechanical motion, used in engines." },
  { name: "Gear", icon: "⚙️", effect: "The gear rotates and transfers motion!", explanation: "Gears are used to transfer rotational force between machine parts." },
  { name: "Spring", icon: "〰️", effect: "The spring bounces!", explanation: "Springs store mechanical energy and can compress and extend." },
  { name: "Fan", icon: "🌀", effect: "The fan blows air around!", explanation: "Fans move air by rotating blades. Needs power!" },
  { name: "Drill", icon: "🔨", effect: "The drill spins and makes holes!", explanation: "Drills are rotating tools that create holes in materials. Needs power!" }
];

// Type for all Lab items, including chips
type LabItem = { name: string; icon: string; effect: string; explanation: string; code?: string };

type Connection = [number, number]; // [fromIdx, toIdx]

export default function LabPage() {
  const [labItems, setLabItems] = useState<LabItem[]>([]);
  const [chipEditorIdx, setChipEditorIdx] = useState<number|null>(null);
     const [connections, setConnections] = useState<Connection[]>([]); // Removed stray 'm'
    const [connectMode, setConnectMode] = useState(false);
    const [selectedIdx, setSelectedIdx] = useState<number|null>(null);
  const [chipCode, setChipCode] = useState<string>("");
  const [orbitingRocket, setOrbitingRocket] = useState(false);
  const [nukeIdx, setNukeIdx] = useState<number|null>(null);
  const [message, setMessage] = useState("");
  const [explanation, setExplanation] = useState("");
  const [animating, setAnimating] = useState(false);
  const [explodingIdx, setExplodingIdx] = useState<number|null>(null);
  const [spinningIdx, setSpinningIdx] = useState<number|null>(null);
  const [brokenAppleIdx, setBrokenAppleIdx] = useState<number|null>(null);
  const [crashed, setCrashed] = useState(false);
  const [crashReason, setCrashReason] = useState("");

  // Add secret nuke item definition
  const nukeItem = { name: "Nuke", icon: "☢️", effect: "A secret nuke has been dropped!", explanation: "This is a super powerful explosive. Not for real use!" };

  // --- Animated Combo Reaction Overlay ---
  const [comboReaction, setComboReaction] = useState<null | {emoji: string, text: string, color: string}>(null);
  // List of special combos and their reactions
  const comboList = [
    { items: ["Fire", "Rocket"], emoji: "🚀🔥", text: "Rocket Launches with Fire!", color: "from-yellow-400 via-red-500 to-fuchsia-600" },
    { items: ["Acid", "Base"], emoji: "🧫🧴", text: "Acid + Base = Neutralized!", color: "from-green-300 via-blue-200 to-purple-300" },
    { items: ["Magnet", "Iron"], emoji: "🧲🪨", text: "Magnet Attracts Iron!", color: "from-blue-400 via-gray-300 to-yellow-200" },
    { items: ["Chemical Bottle", "Paint"], emoji: "🧪🎨", text: "Colorful Chemical Reaction!", color: "from-pink-300 via-yellow-200 to-green-200" },
    { items: ["Apple", "Tree"], emoji: "🍎🌳", text: "An Apple Falls from the Tree!", color: "from-green-400 via-yellow-200 to-red-300" },
    { items: ["Robot", "Chip"], emoji: "🤖💾", text: "Robot Upgraded with Chip!", color: "from-blue-400 via-green-200 to-yellow-200" },
    { items: ["Star", "Rocket"], emoji: "⭐🚀", text: "Rocket Reaches the Stars!", color: "from-yellow-200 via-blue-200 to-purple-300" },
    { items: ["Fire", "Water"], emoji: "🔥💧", text: "Fire is Extinguished by Water!", color: "from-blue-300 via-gray-200 to-fuchsia-200" },
    { items: ["Crystal", "Light Bulb"], emoji: "💎💡", text: "Crystal Sparkles with Light!", color: "from-yellow-100 via-blue-100 to-pink-200" },
    { items: ["Battery", "Light Bulb"], emoji: "🔋💡", text: "Light Bulb Powers ON!", color: "from-yellow-300 via-orange-200 to-yellow-400" },
    { items: ["Battery", "Motor"], emoji: "🔋⚙️", text: "Motor Starts Spinning!", color: "from-blue-300 via-gray-300 to-green-300" },
    { items: ["Battery", "Computer"], emoji: "🔋💻", text: "Computer Boots Up!", color: "from-blue-400 via-purple-300 to-green-400" },
    { items: ["Battery", "Tesla Coil"], emoji: "🔋⚡", text: "Tesla Coil Shoots Lightning!", color: "from-purple-400 via-blue-300 to-yellow-200" },
    { items: ["Battery", "Laser"], emoji: "🔋🔴", text: "Laser Beam Activated!", color: "from-red-400 via-pink-300 to-red-500" },
    { items: ["Battery", "Fan"], emoji: "🔋🌀", text: "Fan Starts Blowing!", color: "from-blue-200 via-white to-blue-300" },
    { items: ["Battery", "Drill"], emoji: "🔋🔨", text: "Drill Powers Up and Spins!", color: "from-gray-400 via-yellow-300 to-gray-500" },
    { items: ["Motor", "Gear"], emoji: "⚙️⚙️", text: "Gears Start Turning Together!", color: "from-gray-300 via-blue-200 to-gray-400" },
    { items: ["Piston", "Motor"], emoji: "🔩⚙️", text: "Piston Engine Created!", color: "from-gray-400 via-red-300 to-gray-500" },
    { items: ["Generator", "Wire"], emoji: "🔌🪢", text: "Electrical Circuit Complete!", color: "from-yellow-300 via-blue-200 to-green-300" },
    { items: ["TNT", "Fire"], emoji: "🧨🔥💥", text: "TNT EXPLODES FROM FIRE!", color: "from-red-500 via-orange-400 to-yellow-500" },
    { items: ["C4", "Fire"], emoji: "🧱💣🔥", text: "C4 DETONATES!", color: "from-red-600 via-orange-500 to-yellow-600" },
    { items: ["Battery", "Robot"], emoji: "🔋🤖", text: "Robot Powers On and Moves!", color: "from-green-300 via-blue-300 to-purple-300" },
    // Add more combos as you wish!
  ];

  function checkCombos(newLabItems: LabItem[]) {
    for (const combo of comboList) {
      if (combo.items.every(name => newLabItems.some(i => i.name === name))) {
        setComboReaction({emoji: combo.emoji, text: combo.text, color: combo.color});
        setTimeout(() => setComboReaction(null), 2500);
        break;
      }
    }
  }

  function placeItem(item: typeof initialItems[number]) {
    playLabSound(item.name);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 700);
    setLabItems(prevLabItems => {
      const newLabItems = [...prevLabItems, item];
      checkCombos(newLabItems);
      
      // Nuclear Bomb - INSTANT DESTRUCTION OF EVERYTHING
      if (item.name === "Nuclear Bomb") {
        const idx = newLabItems.length - 1;
        setMessage("⚠️ NUCLEAR BOMB ARMED! ⚠️");
        setExplanation("In 5 seconds, everything will be destroyed!");
        setTimeout(() => {
          setExplodingIdx(idx);
          setMessage("☢️💥 NUCLEAR EXPLOSION! EVERYTHING IS VAPORIZED! 💥☢️");
          setExplanation("Nuclear weapons release unimaginable destructive power. This is only a simulation!");
          playLabSound("Strong Explosive");
          setTimeout(() => {
            setLabItems([]);
            setExplodingIdx(null);
            setMessage("The lab has been completely destroyed...");
            setExplanation("Everything was vaporized by the nuclear blast.");
            setTimeout(() => {
              setMessage("");
              setExplanation("");
            }, 3000);
          }, 2000);
        }, 5000);
        return newLabItems;
      }
      
      // Chain Reaction Explosives - TNT, C4, Dynamite (trigger nearby explosives!)
      const chainExplosives = ["TNT", "C4", "Dynamite", "Explosive", "Weak Explosive", "Medium Explosive", "Strong Explosive"];
      if (chainExplosives.includes(item.name)) {
        const idx = newLabItems.length - 1;
        setMessage(`${item.name} is ticking... 💣`);
        setExplanation("Explosives will detonate after a short delay. Stay back!");
        // If rocket is present, CRASH the app dramatically
        const rocketIdx = newLabItems.findIndex(i => i.name === "Rocket");
        if (rocketIdx !== -1) {
          setTimeout(() => {
            setCrashed(true);
            setCrashReason("ERR: Please do NOT explode explosives with rocket! The explosion caused a catastrophic failure. Reload the page to continue.");
          }, 3500);
        }
        
        setTimeout(() => {
          setExplodingIdx(idx);
          setMessage(`💥 BOOM! ${item.name} EXPLODED!`);
          setExplanation("The explosion triggers a chain reaction!");
          playLabSound("Strong Explosive");
          
          // Chain reaction - find other explosives and trigger them!
          const otherExplosives = newLabItems
            .map((it, i) => ({ item: it, index: i }))
            .filter(({ item, index }) => index !== idx && chainExplosives.includes(item.name));
          
          if (otherExplosives.length > 0) {
            setMessage(`💥💥 CHAIN REACTION! ${otherExplosives.length} more explosives triggered! 💥💥`);
            // Trigger chain explosions with delays
            otherExplosives.forEach(({ index }, i) => {
              setTimeout(() => {
                setExplodingIdx(index);
                playLabSound("Strong Explosive");
              }, (i + 1) * 500);
            });
          }
          
          setTimeout(() => {
            setLabItems([newLabItems[idx]]); // Only one explosive remains (to animate fade out)
            setTimeout(() => {
              setLabItems([]);
              setExplodingIdx(null);
              setMessage("");
              setExplanation("");
            }, 1000);
          }, 1000 + otherExplosives.length * 500);
        }, 5000);
        return newLabItems;
      }
      
      // Explosion animation for building/explosive combo (instant)
      if (
        (item.name === "Explosive" && prevLabItems.some(i => i.name === "Building")) ||
        (item.name === "Building" && prevLabItems.some(i => i.name === "Explosive"))
      ) {
        setMessage("Boom! The explosion destroyed the building.");
        setExplanation("Explosives release energy rapidly, causing destruction. In real life, always be safe!");
        // Animate explosion on the last explosive
        const idx = newLabItems.findIndex(i => i.name === "Explosive");
        if (idx !== -1) {
          setExplodingIdx(idx);
          setTimeout(() => setExplodingIdx(null), 900);
        }
        return prevLabItems.filter(i => i.name !== "Building");
      }
      // Apple on spinner: break after a delay
      if (item.name === "Apple" && prevLabItems.some(i => i.name === "Spinner")) {
        setMessage("The apple is spinning...");
        setExplanation("Centripetal force pulls the apple apart!");
        const idx = newLabItems.length - 1;
        setSpinningIdx(idx);
        setTimeout(() => {
          setBrokenAppleIdx(idx);
          setMessage("The apple broke apart from spinning!");
          setExplanation("Centripetal force acts on objects moving in a circle, pulling them outward.");
        }, 1200);
        setTimeout(() => {
          setSpinningIdx(null);
        }, 1800);
        return newLabItems;
      }
      setMessage(item.effect);
      setExplanation(item.explanation);
      return newLabItems;
    });
  }

  function resetLab() {
    setLabItems([]);
    setMessage("");
    setExplanation("");
  }

  // Force shutdown for demonstration
  // Rapid-fire achievements state
  const [achievementIdx, setAchievementIdx] = React.useState(0);
  // Generate 1000 funny achievements
  const baseAchievements = [
    "Yay! You clicked a button! 🎉",
    "Yay! You scrolled a page! 🖱️",
    "Yay! You looked at a page! 👀",
    "Yay! UI ran out of ideas! 🤪",
    "Yay! You created an account! ✨",
    "Yay! An achievement! 🏆",
    "Yay! You summoned a unicorn! 🦄",
    "Yay! You found the cheese! 🧀",
    "Yay! You pressed reload! 🔄",
    "Yay! You read the fine print! 🔍",
    "Yay! You survived the Lab gremlins! 🧌",
    "Yay! You hovered a button! 🖲️",
    "Yay! You discovered a secret! 🤫",
    "Yay! You made the dev smile! 😁",
    "Yay! You unlocked rapid-fire mode! 🚀",
    "Yay! You ran out of yays! 😅"
  ];
  const achievements = Array.from({length: 1000}, (_, i) => baseAchievements[i % baseAchievements.length] + ` (#${i+1})`);
  const [showLevelUp, setShowLevelUp] = React.useState(false);
  const [showEasy, setShowEasy] = React.useState(false);
  React.useEffect(() => {
    let timer: NodeJS.Timeout;
    let levelTimer: NodeJS.Timeout;
    let easyTimer: NodeJS.Timeout;
    let count = 0;
    if (achievementIdx < 1000) {
      timer = setInterval(() => {
        setAchievementIdx(idx => idx + 1);
        count++;
        if (count >= 1000) {
          clearInterval(timer);
          setShowLevelUp(true);
          levelTimer = setTimeout(() => {
            setShowLevelUp(false);
            setShowEasy(true);
            easyTimer = setTimeout(() => setShowEasy(false), 3000);
          }, 4000);
        }
      }, 60); // ~16.6 per second for 1 minute
    }
    return () => {
      clearInterval(timer);
      clearTimeout(levelTimer);
      clearTimeout(easyTimer);
    };
  }, []);

  // --- Version selection logic ---
  // Use global version from localStorage (set by VersionLayoutClient)
  const [selectedVersion, setSelectedVersion] = React.useState<string|null>(null);
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const v = localStorage.getItem('learnverseVersion');
      setSelectedVersion(v);
    }
  }, []);

  // Handle connecting two items
  function handleItemClick(idx: number) {
    if (!connectMode) return;
    if (selectedIdx === null) {
      setSelectedIdx(idx);
    } else if (selectedIdx !== idx) {
      setConnections(prev => [...prev, [selectedIdx, idx]]);
      setSelectedIdx(null);
      setConnectMode(false);
    }
  }

  // --- Compute fire-connected indices and render order ---
  // Build adjacency list
  const adj: Record<number, number[]> = {};
  connections.forEach(([a, b]) => {
    if (!adj[a]) adj[a] = [];
    if (!adj[b]) adj[b] = [];
    adj[a].push(b);
    adj[b].push(a);
  });
  // Find all indices of fire
  const fireIdxs = labItems.map((it, i) => it.name === "Fire" ? i : -1).filter(i => i !== -1);
  // BFS to find all connected to fire
  const fireIndices = new Set();
  const queue = [...fireIdxs];
  while (queue.length) {
    const curr = queue.shift() as number;
    if (fireIndices.has(curr)) continue;
    fireIndices.add(curr);
    (adj[curr] || []).forEach((n: number) => {
      if (!fireIndices.has(n)) queue.push(n);
    });
  }
  // Visually group connected items: put all items connected to fire first, then the rest
  const fireGroup = [];
  const rest = [];
  for (let i = 0; i < labItems.length; ++i) {
    if (fireIndices.has(i)) fireGroup.push(i);
    else rest.push(i);
  }
  const renderOrder = [...fireGroup, ...rest];

  // --- Power calculation logic ---
  // Returns the total power available to a given item index (by traversing connections)
  function getPower(idx: number): number {
    const visited = new Set<number>();
    let power = 0;
    function dfs(i: number) {
      if (visited.has(i)) return;
      visited.add(i);
      const item = labItems[i];
      if (item?.name === "Battery") power += 1;
      if (item?.name === "Big Battery") power += 1000;
      (adj[i] || []).forEach((n: number) => dfs(n));
    }
    dfs(idx);
    return power;
  }

  // UI (No version-specific rendering for Lab - always show normal interface)
  return (
    <div className="min-h-screen flex flex-col items-center justify-between bg-gradient-to-b from-green-100 to-blue-200 p-6">
      {/* Combo Reaction Overlay */}
      {comboReaction ? (
        <div className={`fixed inset-0 z-[2000] flex items-center justify-center pointer-events-none animate-fade-in`}>
          <div className={`bg-gradient-to-br ${comboReaction?.color ?? ''} rounded-3xl shadow-2xl border-8 border-fuchsia-400 px-16 py-12 flex flex-col items-center`}>
            <div className="text-8xl mb-6 animate-bounce">{comboReaction?.emoji ?? ''}</div>
            <div className="text-5xl font-extrabold text-white drop-shadow-lg mb-2 animate-glow text-center">{comboReaction?.text ?? ''}</div>
          </div>
        </div>
      ) : null}
      <div className={`w-full max-w-2xl bg-gradient-to-b from-green-200 via-green-300 to-green-400 rounded-3xl shadow-2xl p-8 flex flex-col items-center mb-8 transition-all duration-500 ${animating ? 'ring-4 ring-green-400 scale-105' : ''}`}> 
        <button
          className={`mb-2 px-4 py-2 rounded ${connectMode ? 'bg-blue-400 text-white' : 'bg-gray-200 hover:bg-gray-300'}`}
          onClick={() => {
            setConnectMode(m => !m);
            setSelectedIdx(null);
          }}
        >
          {connectMode ? (selectedIdx === null ? 'Select first item...' : 'Select second item to connect') : 'Connect Items'}
        </button>
        <h1 className="text-3xl font-bold mb-4 text-green-700">Learnverse Lab</h1>
        <div className="w-full min-h-[200px] flex flex-wrap items-center justify-center border-4 border-green-700 border-double rounded-xl bg-gradient-to-b from-green-100 via-green-200 to-green-300 mb-4 p-4 relative overflow-hidden">
          {/* Grass blades at the bottom */}
          <div className="absolute left-0 right-0 bottom-0 h-8 flex z-0">
            {[...Array(30)].map((_, i) => (
              <div key={i} className="w-1 h-full bg-gradient-to-t from-green-700 to-green-300 rounded-t-full mx-[1px]" style={{height: `${6 + Math.random() * 18}px`}} />
            ))}
          </div>
          {/* Group connected items together visually */}
          <div className="relative z-10 w-full flex flex-wrap items-center justify-center" style={{minHeight: 120}}>
            {/* SVG wires between connected items */}
            <svg className="absolute left-0 top-0 w-full h-full pointer-events-none z-0" style={{overflow: 'visible'}}>
              {connections.map(([from, to], i) => {
                // Get DOM positions for from/to
                const fromEl = document.getElementById(`lab-item-${from}`);
                const toEl = document.getElementById(`lab-item-${to}`);
                if (!fromEl || !toEl) return null;
                const fromRect = fromEl.getBoundingClientRect();
                const toRect = toEl.getBoundingClientRect();
                // Calculate center points relative to SVG
                const svgRect = fromEl.parentElement?.parentElement?.getBoundingClientRect();
                if (!svgRect) return null;
                const x1 = fromRect.left + fromRect.width/2 - svgRect.left;
                const y1 = fromRect.top + fromRect.height/2 - svgRect.top;
                const x2 = toRect.left + toRect.width/2 - svgRect.left;
                const y2 = toRect.top + toRect.height/2 - svgRect.top;
                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4b5563" strokeWidth={4} strokeLinecap="round" />;
              })}
            </svg>
            {labItems.length === 0 && <div className="text-gray-400">The lab is empty. Place an item below!</div>}
            {renderOrder.map((idx) => {
              let item = labItems[idx];
              // If connected to fire, turn into fire
              if (item.name !== "Fire" && fireIndices.has(idx)) {
                item = { ...item, name: "Fire", icon: "🔥", effect: "Fire burns brightly in the lab.", explanation: "Fire is a chemical reaction that releases heat and light." };
              }
              // Power logic for chips and machines
              const power = getPower(idx);
              const isChip = item.name === "Chip";
              const isPowered = isChip && power >= 30;
              
              // Check if machine needs power
              const powerMachines = ["Light Bulb", "Motor", "Computer", "Tesla Coil", "Laser", "Fan", "Drill"];
              const isMachine = powerMachines.includes(item.name);
              const machinePowered = isMachine && power >= 1;
              
              // Connect/click logic
              const isSelected = connectMode && selectedIdx === idx;
              const baseClass = `text-5xl mx-2 animate-bounce cursor-pointer relative group` + (isSelected ? ' ring-4 ring-blue-400' : '');
              const commonProps = {
                key: idx,
                id: `lab-item-${idx}`,
                className: baseClass,
                title: item.name + (isChip ? ` (Power: ${power})` : isMachine ? ` (Power: ${power})` : ''),
                onClick: () => handleItemClick(idx)
              };
              
              // Powered Machines - Special Effects!
              if (isMachine) {
                let machineClass = baseClass;
                let machineIcon = item.icon;
                
                if (machinePowered) {
                  // Different effects for different machines
                  if (item.name === "Light Bulb") {
                    machineClass = `text-5xl mx-2 cursor-pointer relative group animate-pulse ${isSelected ? 'ring-4 ring-blue-400' : ''}`;
                    machineIcon = "💡";
                  } else if (item.name === "Tesla Coil") {
                    machineClass = `text-5xl mx-2 cursor-pointer relative group animate-ping ${isSelected ? 'ring-4 ring-blue-400' : ''}`;
                    machineIcon = "⚡";
                  } else if (item.name === "Laser") {
                    machineClass = `text-5xl mx-2 cursor-pointer relative group animate-pulse ${isSelected ? 'ring-4 ring-blue-400' : ''}`;
                    machineIcon = "🔴";
                  } else if (item.name === "Motor" || item.name === "Fan" || item.name === "Drill") {
                    machineClass = `text-5xl mx-2 cursor-pointer relative group animate-spin ${isSelected ? 'ring-4 ring-blue-400' : ''}`;
                  } else if (item.name === "Computer") {
                    machineClass = `text-5xl mx-2 cursor-pointer relative group animate-pulse ${isSelected ? 'ring-4 ring-blue-400' : ''}`;
                  }
                }
                
                return (
                  <span {...commonProps} className={machineClass}>
                    {machineIcon}
                    <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full ${machinePowered ? 'bg-yellow-300 text-yellow-900 animate-pulse' : 'bg-gray-300 text-gray-500'}`}>
                      {machinePowered ? '⚡ON' : 'OFF'}
                    </span>
                    {machinePowered && (item.name === "Tesla Coil" || item.name === "Laser") && (
                      <span className="absolute top-0 left-0 text-yellow-400 text-2xl animate-ping">✨</span>
                    )}
                  </span>
                );
              }
              
              // Chip: double-click to program, show power status
              if (isChip) {
                return (
                  <span
                    {...commonProps}
                    onDoubleClick={() => {
                      if (!isPowered) return;
                      setChipEditorIdx(idx);
                      setChipCode(item.code || "// Write code for your chip here!\nfunction run() {\n  // Example: turn on a light\n}");
                    }}
                  >
                    {item.icon}
                    {item.code && (
                      <span className="absolute -top-2 -right-2 bg-green-400 text-white text-xs px-2 py-0.5 rounded-full shadow group-hover:scale-110 transition-transform">💾</span>
                    )}
                    <span className={`absolute -bottom-2 left-1/2 -translate-x-1/2 text-xs px-2 py-0.5 rounded-full ${isPowered ? 'bg-green-300 text-green-900' : 'bg-gray-300 text-gray-500'}`}>{isPowered ? 'Powered' : 'No Power'}</span>
                  </span>
                );
              }
              // Nuke animation
              if (nukeIdx === idx) {
                if (explodingIdx === idx) {
                  return (
                    <span {...commonProps} className="text-6xl mx-2 animate-ping text-yellow-500" >☢️</span>
                  );
                }
                return (
                  <span {...commonProps} className="text-6xl mx-2 animate-bounce text-yellow-500" >☢️</span>
                );
              }
              // Rocket orbiting animation
              if (orbitingRocket && item.name === "Rocket") {
                return (
                  <span {...commonProps} className="text-5xl mx-2 animate-orbit">🚀</span>
                );
              }
              // Explosion animation
              if (explodingIdx === idx) {
                return (
                  <span {...commonProps} className="text-5xl mx-2 animate-ping text-red-600">💥</span>
                );
              }
              // Apple spinning and breaking
              if (spinningIdx === idx) {
                return (
                  <span {...commonProps} className="text-5xl mx-2 animate-spin-slow">🍎</span>
                );
              }
              if (brokenAppleIdx === idx) {
                return (
                  <span {...commonProps} className="text-5xl mx-2"><span className="inline-block rotate-[-20deg]">🍏</span><span className="inline-block rotate-[20deg]">🍎</span></span>
                );
              }
              // Default animation
              return (
                <span {...commonProps}>{item.icon}</span>
              );
            })}
          </div>
        </div>
        {chipEditorIdx !== null && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-lg relative">
              <h2 className="text-xl font-bold mb-2 text-blue-700 flex items-center gap-2">💾 Program Your Chip</h2>
              <textarea
                className="w-full h-48 border-2 border-blue-300 rounded-lg p-2 font-mono text-sm mb-4"
                value={chipCode}
                onChange={e => setChipCode(e.target.value)}
                spellCheck={false}
                autoFocus
              />
              <div className="flex gap-4 justify-end">
                <button
                  className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
                  onClick={() => setChipEditorIdx(null)}
                >Cancel</button>
                <button
                  className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 font-bold"
                  onClick={() => {
                    setLabItems(items => items.map((it, i) => i === chipEditorIdx ? { ...it, code: chipCode } : it));
                    setChipEditorIdx(null);
                  }}
                >Save</button>
              </div>
            </div>
          </div>
        )}
        {/* Hotbar with slider for all items */}
        <div className="w-full max-w-2xl sticky bottom-0 z-20">
          <div className="relative">
            <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-green-400 scrollbar-track-green-100">
              <div className="flex gap-2 py-3 px-2 min-w-max">
                {initialItems.map((item) => (
                  <button
                    key={item.name}
                    onClick={() => placeItem(item)}
                    className="flex flex-col items-center px-4 py-2 bg-green-200 rounded-xl hover:bg-green-300 focus:outline-none min-w-[70px] transition-all duration-200 shadow hover:scale-105"
                  >
                    <span className="text-3xl mb-1">{item.icon}</span>
                    <span className="text-xs font-semibold text-green-900">{item.name}</span>
                  </button>
                ))}
              </div>
            </div>
            {/* Optional: left/right slider arrows for accessibility */}
            {/* You can add arrow buttons here if you want to scroll programmatically */}
          </div>
        </div>
      </div>
    </div>
  );
}
