"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

// Block types with Lorite and custom blocks!
type BlockType = "air" | "grass" | "dirt" | "stone" | "bedrock" | 
  "coal_ore" | "iron_ore" | "gold_ore" | "lorite_ore" | "crystal_ore" |
  "wood" | "leaves" | "sand" | "water" | "lava";

interface Block {
  type: BlockType;
  x: number;
  y: number;
  z: number;
}

interface Player {
  x: number;
  y: number;
  z: number;
  rotationY: number; // Horizontal rotation (yaw)
  rotationX: number; // Vertical rotation (pitch)
  velocityY: number;
  onGround: boolean;
  health: number;
  inventory: { [key: string]: number };
  selectedTool: "hand" | "wooden_pickaxe" | "stone_pickaxe" | "iron_pickaxe" | "gold_pickaxe" | "lorite_pickaxe";
}

export default function Bloxd3DPage() {
  const router = useRouter();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameStarted, setGameStarted] = useState(false);
  const [world, setWorld] = useState<Block[][][]>([]);
  const [player, setPlayer] = useState<Player>({
    x: 15,
    y: 20,
    z: 15,
    rotationY: 0,
    rotationX: 0,
    velocityY: 0,
    onGround: false,
    health: 100,
    inventory: {
      wood: 0,
      stone: 0,
      coal: 0,
      iron: 0,
      gold: 0,
      lorite: 0,
      crystal: 0,
    },
    selectedTool: "hand",
  });
  const [keys, setKeys] = useState<{ [key: string]: boolean }>({});
  const [mouseDown, setMouseDown] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [dayTime, setDayTime] = useState(0); // 0-24000 (like Minecraft)

  const worldSize = { x: 30, y: 30, z: 30 };
  const blockSize = 1;

  // Block colors
  const blockColors: { [key in BlockType]: string } = {
    air: "transparent",
    grass: "#4a9d2c",
    dirt: "#8b6914",
    stone: "#808080",
    bedrock: "#1a1a1a",
    coal_ore: "#2a2a2a",
    iron_ore: "#c9a890",
    gold_ore: "#ffd700",
    lorite_ore: "#ff00ff", // EPIC PURPLE!
    crystal_ore: "#00ffff",
    wood: "#8b4513",
    leaves: "#228b22",
    sand: "#f4a460",
    water: "#4169e1",
    lava: "#ff4500",
  };

  // Initialize world
  useEffect(() => {
    const newWorld: Block[][][] = [];
    for (let x = 0; x < worldSize.x; x++) {
      newWorld[x] = [];
      for (let y = 0; y < worldSize.y; y++) {
        newWorld[x][y] = [];
        for (let z = 0; z < worldSize.z; z++) {
          let type: BlockType = "air";
          
          // Bedrock layer
          if (y === 0) {
            type = "bedrock";
          }
          // Stone layer
          else if (y < 8) {
            type = "stone";
            // Ores!
            const rand = Math.random();
            if (rand < 0.02) type = "coal_ore";
            else if (rand < 0.03) type = "iron_ore";
            else if (rand < 0.035) type = "gold_ore";
            else if (rand < 0.038) type = "lorite_ore"; // RARE!
            else if (rand < 0.04) type = "crystal_ore";
          }
          // Dirt layer
          else if (y < 12) {
            type = "dirt";
          }
          // Grass layer
          else if (y === 12) {
            type = "grass";
          }
          // Trees
          else if (y > 12 && y < 18 && Math.random() < 0.008 && type === "air") {
            if (newWorld[x][12] && newWorld[x][12][z]?.type === "grass") {
              type = "wood";
              // Add leaves on top
              if (y >= 15) {
                for (let lx = -1; lx <= 1; lx++) {
                  for (let lz = -1; lz <= 1; lz++) {
                    for (let ly = 0; ly <= 2; ly++) {
                      if (x + lx >= 0 && x + lx < worldSize.x && 
                          z + lz >= 0 && z + lz < worldSize.z &&
                          y + ly < worldSize.y) {
                        if (!newWorld[x + lx][y + ly]) newWorld[x + lx][y + ly] = [];
                        if (Math.random() < 0.7) {
                          newWorld[x + lx][y + ly][z + lz] = { type: "leaves", x: x + lx, y: y + ly, z: z + lz };
                        }
                      }
                    }
                  }
                }
              }
            }
          }
          
          newWorld[x][y][z] = { type, x, y, z };
        }
      }
    }
    setWorld(newWorld);
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;

    const gameLoop = () => {
      // Update player physics
      setPlayer(p => {
        let newP = { ...p };
        
        // Gravity
        if (!p.onGround) {
          newP.velocityY -= 0.02;
        }
        
        newP.y += p.velocityY;
        
        // Ground collision
        const blockBelow = world[Math.floor(p.x)]?.[Math.floor(p.y - 1)]?.[Math.floor(p.z)];
        if (blockBelow && blockBelow.type !== "air") {
          newP.onGround = true;
          newP.velocityY = 0;
          newP.y = Math.floor(p.y);
        } else {
          newP.onGround = false;
        }
        
        // Movement
        const speed = 0.15;
        if (keys["w"]) {
          newP.x += Math.sin(p.rotationY) * speed;
          newP.z += Math.cos(p.rotationY) * speed;
        }
        if (keys["s"]) {
          newP.x -= Math.sin(p.rotationY) * speed;
          newP.z -= Math.cos(p.rotationY) * speed;
        }
        if (keys["a"]) {
          newP.x -= Math.cos(p.rotationY) * speed;
          newP.z += Math.sin(p.rotationY) * speed;
        }
        if (keys["d"]) {
          newP.x += Math.cos(p.rotationY) * speed;
          newP.z -= Math.sin(p.rotationY) * speed;
        }
        if (keys[" "] && p.onGround) {
          newP.velocityY = 0.3; // Jump!
        }
        
        // Boundaries
        newP.x = Math.max(1, Math.min(worldSize.x - 2, newP.x));
        newP.z = Math.max(1, Math.min(worldSize.z - 2, newP.z));
        newP.y = Math.max(1, Math.min(worldSize.y - 2, newP.y));
        
        return newP;
      });
      
      // Day/night cycle
      setDayTime(t => (t + 1) % 24000);
      
      // Render
      render(ctx, canvas);
      
      animationId = requestAnimationFrame(gameLoop);
    };

    gameLoop();

    return () => cancelAnimationFrame(animationId);
  }, [gameStarted, world, player, keys, dayTime]);

  // Render 3D world (simplified ray-casting)
  const render = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    const w = canvas.width;
    const h = canvas.height;
    
    // Sky color (changes with time)
    const skyBrightness = Math.sin((dayTime / 24000) * Math.PI * 2) * 0.5 + 0.5;
    const skyColor = `rgb(${100 * skyBrightness}, ${150 * skyBrightness}, ${255 * skyBrightness})`;
    ctx.fillStyle = skyColor;
    ctx.fillRect(0, 0, w, h);
    
    // Simple 3D projection (draw blocks based on distance from player)
    const visibleBlocks: { block: Block; distance: number; screenX: number; screenY: number; size: number }[] = [];
    
    const renderDistance = 15;
    
    for (let x = Math.floor(player.x - renderDistance); x < Math.floor(player.x + renderDistance); x++) {
      for (let y = Math.floor(player.y - renderDistance); y < Math.floor(player.y + renderDistance); y++) {
        for (let z = Math.floor(player.z - renderDistance); z < Math.floor(player.z + renderDistance); z++) {
          if (x < 0 || x >= worldSize.x || y < 0 || y >= worldSize.y || z < 0 || z >= worldSize.z) continue;
          
          const block = world[x]?.[y]?.[z];
          if (!block || block.type === "air") continue;
          
          // Calculate position relative to player
          const dx = block.x - player.x;
          const dy = block.y - player.y;
          const dz = block.z - player.z;
          
          // Rotate based on player rotation
          const rotX = dx * Math.cos(-player.rotationY) - dz * Math.sin(-player.rotationY);
          const rotZ = dx * Math.sin(-player.rotationY) + dz * Math.cos(-player.rotationY);
          const rotY = dy;
          
          // Only render blocks in front of player
          if (rotZ > 0.1) {
            const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
            
            // 3D projection
            const scale = 300 / rotZ;
            const screenX = w / 2 + rotX * scale;
            const screenY = h / 2 - rotY * scale - player.rotationX * 500;
            const size = blockSize * scale;
            
            visibleBlocks.push({ block, distance, screenX, screenY, size });
          }
        }
      }
    }
    
    // Sort by distance (far to near)
    visibleBlocks.sort((a, b) => b.distance - a.distance);
    
    // Draw blocks
    visibleBlocks.forEach(({ block, screenX, screenY, size }) => {
      const color = blockColors[block.type];
      ctx.fillStyle = color;
      ctx.strokeStyle = "#000";
      ctx.lineWidth = 1;
      
      // Draw cube (simplified)
      ctx.fillRect(screenX - size / 2, screenY - size / 2, size, size);
      ctx.strokeRect(screenX - size / 2, screenY - size / 2, size, size);
    });
    
    // Crosshair
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(w / 2 - 10, h / 2);
    ctx.lineTo(w / 2 + 10, h / 2);
    ctx.moveTo(w / 2, h / 2 - 10);
    ctx.lineTo(w / 2, h / 2 + 10);
    ctx.stroke();
    
    // HUD
    ctx.fillStyle = "#fff";
    ctx.font = "20px monospace";
    ctx.fillText(`HP: ${player.health}`, 10, 30);
    ctx.fillText(`Tool: ${player.selectedTool}`, 10, 60);
    ctx.fillText(`Time: ${Math.floor(dayTime / 1000)}:${String(Math.floor((dayTime % 1000) / 100)).padStart(2, '0')}`, 10, 90);
  };

  // Mouse movement for looking around
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!gameStarted) return;
    
    const sensitivity = 0.003;
    setPlayer(p => ({
      ...p,
      rotationY: p.rotationY + e.movementX * sensitivity,
      rotationX: Math.max(-Math.PI / 2, Math.min(Math.PI / 2, p.rotationX + e.movementY * sensitivity)),
    }));
  };

  // Key handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeys(k => ({ ...k, [e.key.toLowerCase()]: true }));
      if (e.key.toLowerCase() === "e") setShowInventory(v => !v);
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      setKeys(k => ({ ...k, [e.key.toLowerCase()]: false }));
    };
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  // Start game and lock pointer
  const startGame = () => {
    setGameStarted(true);
    canvasRef.current?.requestPointerLock();
  };

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-900 via-purple-900 to-black flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-6xl font-bold text-white mb-4 animate-pulse">🎮 BLOXD 3D 🎮</h1>
          <p className="text-2xl text-purple-300 mb-2">SECRET GAME UNLOCKED!</p>
          <p className="text-lg text-gray-300 mb-8">A 3D voxel adventure with LORITE ore!</p>
          <div className="bg-black/50 rounded-xl p-6 mb-8 text-left max-w-2xl">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">🎮 CONTROLS:</h2>
            <div className="grid grid-cols-2 gap-4 text-white text-sm">
              <div>• <b>WASD</b> - Move</div>
              <div>• <b>SPACE</b> - Jump</div>
              <div>• <b>MOUSE</b> - Look around</div>
              <div>• <b>CLICK</b> - Break block</div>
              <div>• <b>RIGHT CLICK</b> - Place block</div>
              <div>• <b>E</b> - Inventory</div>
              <div>• <b>1-5</b> - Select tool</div>
              <div>• <b>ESC</b> - Exit pointer lock</div>
            </div>
            <div className="mt-4 p-4 bg-purple-900/50 rounded-lg">
              <p className="text-purple-200">💎 <b>Find LORITE ore</b> - the rarest block!</p>
              <p className="text-blue-200">⛏️ Mine ores to craft better tools</p>
              <p className="text-green-200">🌳 Chop trees for wood</p>
            </div>
          </div>
          <button
            onClick={startGame}
            className="px-12 py-4 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-2xl font-bold rounded-xl shadow-2xl hover:scale-110 transition-transform"
          >
            🚀 START GAME
          </button>
          <br />
          <button
            onClick={() => router.push("/kid")}
            className="mt-4 px-6 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600"
          >
            ← Back to Hub
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen bg-black overflow-hidden">
      <canvas
        ref={canvasRef}
        width={1200}
        height={800}
        className="w-full h-full cursor-none"
        onMouseMove={handleMouseMove}
        onClick={() => {
          // Break block logic here
          console.log("Break block!");
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          // Place block logic here
          console.log("Place block!");
        }}
      />
      
      {/* Inventory overlay */}
      {showInventory && (
        <div className="absolute inset-0 bg-black/80 flex items-center justify-center" onClick={() => setShowInventory(false)}>
          <div className="bg-gray-800 rounded-2xl p-8 max-w-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-3xl font-bold text-white mb-6">📦 INVENTORY</h2>
            <div className="grid grid-cols-4 gap-4">
              {Object.entries(player.inventory).map(([item, count]) => (
                <div key={item} className="bg-gray-700 rounded-lg p-4 text-center">
                  <div className="text-4xl mb-2">
                    {item === "lorite" ? "💜" : item === "gold" ? "🟡" : item === "iron" ? "⚪" : "⬜"}
                  </div>
                  <div className="text-white font-bold">{item}</div>
                  <div className="text-gray-400">×{count}</div>
                </div>
              ))}
            </div>
            <button
              onClick={() => setShowInventory(false)}
              className="mt-6 w-full px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-bold"
            >
              Close (E)
            </button>
          </div>
        </div>
      )}
      
      {/* Exit button */}
      <button
        onClick={() => {
          document.exitPointerLock();
          router.push("/kid");
        }}
        className="absolute top-4 right-4 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold shadow-xl"
      >
        ❌ EXIT GAME
      </button>
    </div>
  );
}
