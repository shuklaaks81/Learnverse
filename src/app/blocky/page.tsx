"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { unlockAchievement } from '@/utils/achievements';

interface Player {
  x: number;
  y: number;
  z: number;
  rotationY: number; // Camera horizontal rotation
  rotationX: number; // Camera vertical rotation (look up/down)
  health: number;
  maxHealth: number;
  coins: number;
  currentTool: 'hand' | 'wooden-pickaxe' | 'stone-pickaxe' | 'iron-pickaxe' | 'golden-pickaxe' | 'lorite-pickaxe';
}

interface Monster {
  id: number;
  type: 'slime' | 'spider' | 'bat' | 'zombie' | 'skeleton';
  x: number;
  y: number;
  health: number;
  maxHealth: number;
  emoji: string;
  name: string;
}

interface Block {
  x: number;
  y: number;
  z: number;
  type: 'grass' | 'dirt' | 'stone' | 'bedrock' | 'ore-coal' | 'ore-iron' | 'ore-copper' | 'ore-gold' | 'ore-crystal' | 'ore-lorite' | 'wood' | 'leaves' | 'air';
  color: string;
  hp: number;
  maxHp: number;
  requiresTool: 'none' | 'any' | 'stone+' | 'iron+' | 'golden+' | 'lorite-only';
}

interface InventoryItem {
  id: string;
  name: string;
  emoji: string;
  count: number;
  type: 'material' | 'tool';
}

interface CraftingRecipe {
  id: string;
  name: string;
  emoji: string;
  requires: { itemId: string; count: number }[];
  produces: { itemId: string; count: number };
  category: 'tools' | 'materials';
}

interface Structure {
  id: number;
  type: 'house' | 'tree' | 'tower' | 'cave-entrance';
  x: number;
  y: number;
  size: 'small' | 'medium' | 'large';
  emoji: string;
  name: string;
}

export default function BlockyPage() {
  const [player, setPlayer] = useState<Player>({
    x: 15,
    y: 11, // Higher so you're standing ON TOP of blocks
    z: 15,
    rotationY: 0,
    rotationX: 0,
    health: 100,
    maxHealth: 100,
    coins: 0,
    currentTool: 'hand'
  });

  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [monsters, setMonsters] = useState<Monster[]>([]);
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [message, setMessage] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCrafting, setShowCrafting] = useState(false);
  const [targetBlock, setTargetBlock] = useState<Block | null>(null);
  const [worldSize] = useState({ width: 30, height: 15, depth: 30 }); // Reduced for performance
  const [renderDistance] = useState(3); // Ultra-optimized for smoothness

  // Block type definitions with unique names to avoid copyright
  const blockTypes = {
    'grass': { name: 'Grass Block', color: '#52b788', hp: 3, requiresTool: 'none' as const, dropItem: 'dirt' },
    'dirt': { name: 'Dirt Block', color: '#8B4513', hp: 2, requiresTool: 'none' as const, dropItem: 'dirt' },
    'stone': { name: 'Stone Block', color: '#808080', hp: 5, requiresTool: 'any' as const, dropItem: 'stone' },
    'bedrock': { name: 'Bedrock', color: '#1a1a1a', hp: 999, requiresTool: 'none' as const, dropItem: null },
    'wood': { name: 'Wood Block', color: '#8B4513', hp: 3, requiresTool: 'none' as const, dropItem: 'wood' },
    'leaves': { name: 'Leaves', color: '#228B22', hp: 1, requiresTool: 'none' as const, dropItem: null },
    'ore-coal': { name: 'Coal Ore', color: '#2C2C2C', hp: 8, requiresTool: 'any' as const, dropItem: 'coal', value: 5 },
    'ore-copper': { name: 'Copper Ore', color: '#B87333', hp: 10, requiresTool: 'any' as const, dropItem: 'copper', value: 8 },
    'ore-iron': { name: 'Iron Ore', color: '#C0C0C0', hp: 12, requiresTool: 'stone+' as const, dropItem: 'iron', value: 15 },
    'ore-gold': { name: 'Gold Ore', color: '#FFD700', hp: 15, requiresTool: 'iron+' as const, dropItem: 'gold', value: 30 },
    'ore-crystal': { name: 'Crystal Ore', color: '#00CED1', hp: 18, requiresTool: 'iron+' as const, dropItem: 'crystal', value: 50 },
    'ore-lorite': { name: '✨ LORITE ✨', color: '#FF00FF', hp: 25, requiresTool: 'golden+' as const, dropItem: 'lorite', value: 200 },
    'air': { name: 'Air', color: 'transparent', hp: 0, requiresTool: 'none' as const, dropItem: null }
  };

  // Crafting recipes
  const craftingRecipes: CraftingRecipe[] = [
    {
      id: 'wooden-pickaxe',
      name: 'Wooden Pickaxe',
      emoji: '🪓',
      requires: [{ itemId: 'wood', count: 5 }],
      produces: { itemId: 'wooden-pickaxe', count: 1 },
      category: 'tools'
    },
    {
      id: 'stone-pickaxe',
      name: 'Stone Pickaxe',
      emoji: '⛏️',
      requires: [{ itemId: 'wood', count: 3 }, { itemId: 'stone', count: 5 }],
      produces: { itemId: 'stone-pickaxe', count: 1 },
      category: 'tools'
    },
    {
      id: 'iron-pickaxe',
      name: 'Iron Pickaxe',
      emoji: '⚒️',
      requires: [{ itemId: 'wood', count: 3 }, { itemId: 'iron', count: 4 }],
      produces: { itemId: 'iron-pickaxe', count: 1 },
      category: 'tools'
    },
    {
      id: 'golden-pickaxe',
      name: 'Golden Pickaxe',
      emoji: '🔨',
      requires: [{ itemId: 'wood', count: 3 }, { itemId: 'gold', count: 4 }],
      produces: { itemId: 'golden-pickaxe', count: 1 },
      category: 'tools'
    },
    {
      id: 'lorite-pickaxe',
      name: '✨ LORITE PICKAXE ✨',
      emoji: '💎',
      requires: [{ itemId: 'wood', count: 5 }, { itemId: 'lorite', count: 3 }],
      produces: { itemId: 'lorite-pickaxe', count: 1 },
      category: 'tools'
    }
  ];

  // Tool power levels
  const toolPower = {
    'hand': 0,
    'wooden-pickaxe': 1,
    'stone-pickaxe': 2,
    'iron-pickaxe': 3,
    'golden-pickaxe': 4,
    'lorite-pickaxe': 5
  };

  // Generate 3D voxel world
  const generate3DWorld = () => {
    const newBlocks: Block[] = [];
    const { width, height, depth } = worldSize;
    
    // Simple height map for terrain variation
    const getTerrainHeight = (x: number, z: number) => {
      // Simple noise-like function for terrain
      const val = Math.sin(x * 0.1) * Math.cos(z * 0.1) * 2;
      return Math.floor(12 + val); // Base height around y=12
    };
    
    for (let x = 0; x < width; x++) {
      for (let z = 0; z < depth; z++) {
        const terrainHeight = getTerrainHeight(x, z);
        
        for (let y = 0; y < height; y++) {
          let type: Block['type'] = 'air';
          
          // Bedrock layer at bottom
          if (y === 0) {
            type = 'bedrock';
          }
          // Stone deep underground
          else if (y < terrainHeight - 3) {
            type = 'stone';
            
            // Generate ores in stone
            const oreRand = Math.random();
            if (y < 6) {
              // Deep ores
              if (oreRand < 0.001) {
                type = 'ore-lorite'; // Super rare Lorite!
              } else if (oreRand < 0.008) {
                type = 'ore-crystal';
              } else if (oreRand < 0.02) {
                type = 'ore-gold';
              }
            } else if (y < 10) {
              // Mid-level ores
              if (oreRand < 0.02) {
                type = 'ore-iron';
              } else if (oreRand < 0.04) {
                type = 'ore-copper';
              }
            } else {
              // Shallow ores
              if (oreRand < 0.03) {
                type = 'ore-coal';
              }
            }
          }
          // Dirt layer
          else if (y < terrainHeight) {
            type = 'dirt';
          }
          // Grass on surface
          else if (y === terrainHeight) {
            type = 'grass';
          }
          // Air above is already set as default
          
          // Only store non-air blocks for performance
          if (type !== 'air') {
            const blockData = blockTypes[type];
            newBlocks.push({
              x, y, z,
              type,
              color: blockData.color,
              hp: blockData.hp,
              maxHp: blockData.hp,
              requiresTool: blockData.requiresTool
            });
          }
        }
        
        // Place trees on surface occasionally (reduced for performance)
        if (Math.random() < 0.02) { // Much fewer trees
          const treeHeight = 3 + Math.floor(Math.random() * 2); // Shorter trees
          const baseY = terrainHeight + 1;
          
          // Tree trunk (wood)
          for (let ty = 0; ty < treeHeight; ty++) {
            newBlocks.push({
              x, y: baseY + ty, z,
              type: 'wood',
              color: blockTypes['wood'].color,
              hp: blockTypes['wood'].hp,
              maxHp: blockTypes['wood'].hp,
              requiresTool: blockTypes['wood'].requiresTool
            });
          }
          
          // Smaller leaves crown (1x1x2 instead of 5x5x3)
          const leafY = baseY + treeHeight;
          for (let ly = 0; ly < 2; ly++) {
            newBlocks.push({
              x, y: leafY + ly, z,
              type: 'leaves',
              color: blockTypes['leaves'].color,
              hp: blockTypes['leaves'].hp,
              maxHp: blockTypes['leaves'].hp,
              requiresTool: blockTypes['leaves'].requiresTool
            });
          }
        }
      }
    }
    
    setBlocks(newBlocks);
  };

  // Start game with loading
  const startGame = async () => {
    unlockAchievement('blocky');
    setIsLoading(true);
    setMessage('⏳ Generating world...');
    
    // Use setTimeout to let UI update
    setTimeout(() => {
      generate3DWorld();
      setGameStarted(true);
      setIsLoading(false);
      setMessage('🎮 Welcome! Mouse to look, WASD to move, E to craft!');
      setTimeout(() => setMessage(''), 4000);
    }, 100);
  };

  // Move player in 3D space (optimized collision)
  const movePlayer = (forward: number, strafe: number) => {
    const speed = 0.3; // Slower but smoother
    
    // Calculate movement based on rotation
    const radY = (player.rotationY * Math.PI) / 180;
    const dx = (Math.sin(radY) * forward + Math.cos(radY) * strafe) * speed;
    const dz = (Math.cos(radY) * forward - Math.sin(radY) * strafe) * speed;
    
    const newX = Math.max(0, Math.min(worldSize.width - 1, player.x + dx));
    const newZ = Math.max(0, Math.min(worldSize.depth - 1, player.z + dz));
    
    // Optimized collision - only check very close blocks
    const checkX = Math.floor(newX);
    const checkZ = Math.floor(newZ);
    const checkY = Math.floor(player.y);
    
    const blockingBlock = blocks.find(b => 
      b.x === checkX && 
      b.z === checkZ && 
      (b.y === checkY || b.y === checkY - 1) &&
      b.type !== 'air' && b.type !== 'leaves'
    );
    
    if (!blockingBlock) {
      setPlayer(p => ({ ...p, x: newX, z: newZ }));
    }
  };

  // Jump
  const jump = () => {
    const newY = Math.min(worldSize.height - 1, player.y + 1);
    setPlayer({ ...player, y: newY });
  };

  // Get block player is looking at (simple raycast)
  const getTargetBlock = (): Block | null => {
    const reach = 5;
    const radY = (player.rotationY * Math.PI) / 180;
    const radX = (player.rotationX * Math.PI) / 180;
    
    // Ray direction
    const dirX = Math.sin(radY) * Math.cos(radX);
    const dirY = -Math.sin(radX);
    const dirZ = Math.cos(radY) * Math.cos(radX);
    
    // Step along ray
    for (let i = 0; i < reach * 10; i++) {
      const step = i * 0.1;
      const checkX = Math.floor(player.x + dirX * step);
      const checkY = Math.floor(player.y + dirY * step);
      const checkZ = Math.floor(player.z + dirZ * step);
      
      const block = blocks.find(b => 
        b.x === checkX && b.y === checkY && b.z === checkZ && b.type !== 'air'
      );
      
      if (block) {
        return block;
      }
    }
    
    return null;
  };

  // Check if player has required tool for block
  const canMineBlock = (block: Block): boolean => {
    const requirement = block.requiresTool;
    const toolLevel = toolPower[player.currentTool];
    
    if (requirement === 'none') return true;
    if (requirement === 'any' && toolLevel >= 1) return true;
    if (requirement === 'stone+' && toolLevel >= 2) return true;
    if (requirement === 'iron+' && toolLevel >= 3) return true;
    if (requirement === 'golden+' && toolLevel >= 4) return true;
    if (requirement === 'lorite-only' && toolLevel >= 5) return true;
    
    return false;
  };

  // Mine block
  const mineBlock = () => {
    const block = getTargetBlock();
    if (!block || block.type === 'air') return;
    
    // Check tool requirement
    if (!canMineBlock(block)) {
      setMessage(`❌ Need better tool to mine ${blockTypes[block.type].name}!`);
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    // Bedrock is unbreakable
    if (block.type === 'bedrock') {
      setMessage('❌ Bedrock is unbreakable!');
      setTimeout(() => setMessage(''), 2000);
      return;
    }
    
    // Damage block
    const damage = 1 + toolPower[player.currentTool];
    const newHp = block.hp - damage;
    
    if (newHp <= 0) {
      // Block destroyed - add to inventory
      const dropItem = blockTypes[block.type].dropItem;
      if (dropItem) {
        addToInventory(dropItem, block.type);
      }
      
      // Remove block
      setBlocks(blocks.filter(b => 
        !(b.x === block.x && b.y === block.y && b.z === block.z)
      ));
    } else {
      // Damage block
      setBlocks(blocks.map(b => {
        if (b.x === block.x && b.y === block.y && b.z === block.z) {
          return { ...b, hp: newHp };
        }
        return b;
      }));
    }
  };

  // Add to inventory
  const addToInventory = (itemId: string, blockType: string) => {
    const blockData = blockTypes[blockType as keyof typeof blockTypes];
    const value = (blockData as any).value || 0;
    
    const existing = inventory.find(i => i.id === itemId);
    if (existing) {
      setInventory(inventory.map(i => 
        i.id === itemId ? { ...i, count: i.count + 1 } : i
      ));
    } else {
      setInventory([...inventory, {
        id: itemId,
        name: blockData.name,
        emoji: '⬛',
        count: 1,
        type: 'material'
      }]);
    }
    
    if (value > 0) {
      setPlayer({ ...player, coins: player.coins + value });
      setMessage(`⛏️ Mined ${blockData.name}! +${value} coins`);
    } else {
      setMessage(`⛏️ Mined ${blockData.name}!`);
    }
    
    setTimeout(() => setMessage(''), 2000);
  };

  // Craft item
  const craftItem = (recipe: CraftingRecipe) => {
    // Check if player has requirements
    for (const req of recipe.requires) {
      const item = inventory.find(i => i.id === req.itemId);
      if (!item || item.count < req.count) {
        setMessage(`❌ Need ${req.count}x ${req.itemId}!`);
        setTimeout(() => setMessage(''), 2000);
        return;
      }
    }
    
    // Remove materials
    let newInventory = [...inventory];
    for (const req of recipe.requires) {
      newInventory = newInventory.map(i => {
        if (i.id === req.itemId) {
          const newCount = i.count - req.count;
          return newCount > 0 ? { ...i, count: newCount } : null;
        }
        return i;
      }).filter((i): i is InventoryItem => i !== null);
    }
    
    // Add produced item
    const existing = newInventory.find(i => i.id === recipe.produces.itemId);
    if (existing) {
      newInventory = newInventory.map(i => 
        i.id === recipe.produces.itemId ? { ...i, count: i.count + recipe.produces.count } : i
      );
    } else {
      newInventory.push({
        id: recipe.produces.itemId,
        name: recipe.name,
        emoji: recipe.emoji,
        count: recipe.produces.count,
        type: 'tool'
      });
    }
    
    setInventory(newInventory);
    setMessage(`✅ Crafted ${recipe.emoji} ${recipe.name}!`);
    setTimeout(() => setMessage(''), 2000);
  };

  // Equip tool
  const equipTool = (toolId: string) => {
    if (toolId === 'hand' || toolId.endsWith('-pickaxe')) {
      setPlayer({ ...player, currentTool: toolId as Player['currentTool'] });
      setMessage(`🔧 Equipped ${toolId}!`);
      setTimeout(() => setMessage(''), 2000);
    }
  };

  // Mouse look controls (optimized)
  useEffect(() => {
    if (!gameStarted) return;
    
    const handleMouseMove = (e: MouseEvent) => {
      if (document.pointerLockElement) {
        const sensitivity = 0.15; // Slightly less sensitive for smoother control
        
        setPlayer(p => ({
          ...p,
          rotationY: p.rotationY + e.movementX * sensitivity,
          rotationX: Math.max(-89, Math.min(89, p.rotationX - e.movementY * sensitivity))
        }));
      }
    };
    
    const handleClick = () => {
      // Request pointer lock for mouse control
      document.body.requestPointerLock();
    };
    
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('click', handleClick);
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('click', handleClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]); // Only re-run when game starts, not on every player rotation

  // Keyboard controls (WASD + actions)
  useEffect(() => {
    if (!gameStarted) return;
    
    const pressedKeys = new Set<string>();
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (player.health <= 0) return;
      pressedKeys.add(e.key.toLowerCase());
      
      switch(e.key.toLowerCase()) {
        case ' ':
          e.preventDefault();
          jump();
          break;
        case 'e':
          e.preventDefault();
          setShowCrafting(!showCrafting);
          break;
        case 'escape':
          e.preventDefault();
          setShowCrafting(false);
          document.exitPointerLock();
          break;
        case '1':
          equipTool('hand');
          break;
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
          // Quick select tools (will implement later)
          break;
      }
    };
    
    const handleKeyUp = (e: KeyboardEvent) => {
      pressedKeys.delete(e.key.toLowerCase());
    };
    
    const handleMouseDown = (e: MouseEvent) => {
      if (e.button === 0) { // Left click
        mineBlock();
      }
    };
    
    // Movement loop
    const moveInterval = setInterval(() => {
      if (player.health <= 0) return;
      
      let forward = 0;
      let strafe = 0;
      
      if (pressedKeys.has('w')) forward += 1;
      if (pressedKeys.has('s')) forward -= 1;
      if (pressedKeys.has('a')) strafe -= 1;
      if (pressedKeys.has('d')) strafe += 1;
      
      if (forward !== 0 || strafe !== 0) {
        movePlayer(forward, strafe);
      }
    }, 33); // ~30fps for smoother performance
    
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('mousedown', handleMouseDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('mousedown', handleMouseDown);
      clearInterval(moveInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]); // Intentionally simplified to prevent infinite loop

  // Update target block continuously
  useEffect(() => {
    if (!gameStarted) return;
    
    const updateTarget = setInterval(() => {
      const target = getTargetBlock();
      setTargetBlock(target);
    }, 100);
    
    return () => clearInterval(updateTarget);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameStarted]); // Only update when game running, not on every player move

  if (player.health <= 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-6">💀</div>
          <h1 className="text-6xl font-bold text-red-500 mb-4">GAME OVER</h1>
          <p className="text-3xl text-white mb-4">You fell in the voxel world!</p>
          <p className="text-2xl text-yellow-300 mb-8">
            Final Score: {player.coins} coins | Inventory: {inventory.length} items
          </p>
          <button
            onClick={() => {
              setPlayer({ 
                x: 15, y: 11, z: 15, 
                rotationY: 0, rotationX: 0,
                health: 100, maxHealth: 100, coins: 0,
                currentTool: 'hand'
              });
              setInventory([]);
              setGameStarted(false);
            }}
            className="px-10 py-5 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-full text-2xl font-bold hover:from-green-700 hover:to-blue-700 transition-all hover:scale-110"
          >
            🔄 Try Again
          </button>
        </div>
      </div>
    );
  }

  // Loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="text-9xl mb-8 animate-bounce">⛏️</div>
          <h1 className="text-5xl font-bold text-white mb-4 animate-pulse">
            Generating Voxel World...
          </h1>
          <div className="flex justify-center gap-2 mt-8">
            <div className="w-4 h-4 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-4 h-4 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-4 h-4 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (!gameStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black overflow-hidden">
        {/* Floating blocks */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute text-5xl animate-float-block"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 4}s`
            }}
          >
            {['🟫', '⬜', '💎', '🟡', '⚫', '🌳'][Math.floor(Math.random() * 6)]}
          </div>
        ))}
        
        <div className="relative z-10 flex items-center justify-center min-h-screen px-8">
          <div className="text-center">
            <div className="text-9xl mb-6 animate-bounce">🧊</div>
            <h1 className="text-8xl font-bold text-yellow-400 mb-6 pixel-font" style={{
              textShadow: '8px 8px 0px #000, 10px 10px 0px #654321'
            }}>
              BLOCKY VOXEL WORLD
            </h1>
            <p className="text-3xl text-cyan-400 font-bold mb-8">
              First-Person • Mine • Craft • Explore
            </p>
            
            <div className="max-w-3xl mx-auto bg-black bg-opacity-60 rounded-3xl p-8 mb-8 border-4 border-yellow-600">
              <h2 className="text-3xl font-bold text-yellow-300 mb-4">📜 How to Play</h2>
              <div className="text-left text-white text-xl space-y-2">
                <p>🖱️ <span className="text-gray-300">- Mouse to look around (click to lock)</span></p>
                <p>WASD <span className="text-gray-300">- Move forward/backward/left/right</span></p>
                <p>SPACE <span className="text-gray-300">- Jump</span></p>
                <p>LEFT CLICK <span className="text-gray-300">- Mine blocks</span></p>
                <p>E <span className="text-gray-300">- Open crafting menu</span></p>
                <p>1-6 <span className="text-gray-300">- Quick select tools</span></p>
                <p>ESC <span className="text-gray-300">- Release mouse</span></p>
              </div>
              
              <div className="mt-6 pt-6 border-t-2 border-yellow-600">
                <h3 className="text-2xl font-bold text-yellow-300 mb-3">🎯 Goal</h3>
                <p className="text-white text-lg">
                  Explore the 3D voxel world, gather wood and stone, craft tools, mine valuable ores, and discover the ultra-rare LORITE! Each tool lets you mine harder materials.
                </p>
              </div>
              
              <div className="mt-6 pt-6 border-t-2 border-yellow-600">
                <h3 className="text-2xl font-bold text-purple-300 mb-3">✨ Special Features</h3>
                <p className="text-white text-lg mb-2">
                  <span className="text-purple-400 font-bold">LORITE</span> - The rarest ore in the world! Super deep, super rare, and glows with magical purple energy. Only mineable with a Golden Pickaxe or better!
                </p>
              </div>
            </div>
            
            <button
              onClick={startGame}
              className="px-12 py-6 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full text-3xl font-bold hover:from-green-700 hover:to-emerald-700 transition-all hover:scale-110 shadow-2xl border-4 border-green-800 animate-pulse"
            >
              🎮 START ADVENTURE
            </button>
            
            <div className="mt-8">
              <Link
                href="/kid"
                className="inline-block px-8 py-4 bg-gray-700 hover:bg-gray-600 text-white rounded-full text-xl font-bold transition-all"
              >
                ⬅️ Back to Learnverse
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-500 to-blue-800 relative overflow-hidden">
      {/* Crosshair */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none">
        <div className="relative">
          <div className="absolute w-8 h-0.5 bg-white -ml-4" />
          <div className="absolute w-0.5 h-8 bg-white -mt-4" />
          {targetBlock && (
            <div className="absolute top-6 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 px-3 py-1 rounded-lg text-white text-sm whitespace-nowrap">
              {blockTypes[targetBlock.type].name} ({targetBlock.hp}/{targetBlock.maxHp} HP)
            </div>
          )}
        </div>
      </div>

      {/* HUD - Top Bar */}
      <div className="fixed top-4 left-4 right-4 z-40 flex justify-between items-start gap-4">
        {/* Player Stats */}
        <div className="bg-black bg-opacity-80 rounded-xl p-3 border-2 border-green-500">
          <div className="text-white font-bold space-y-1">
            <div className="flex items-center gap-2">
              <span>❤️</span>
              <div className="bg-red-900 rounded-full h-4 w-32 overflow-hidden">
                <div 
                  className="bg-red-500 h-full transition-all"
                  style={{ width: `${(player.health / player.maxHealth) * 100}%` }}
                />
              </div>
              <span className="text-sm">{player.health}/{player.maxHealth}</span>
            </div>
            <div className="text-sm">🪙 {player.coins} coins</div>
            <div className="text-sm">📍 X:{Math.floor(player.x)} Y:{Math.floor(player.y)} Z:{Math.floor(player.z)}</div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-black bg-opacity-80 rounded-xl p-3 border-2 border-blue-500">
          <div className="text-white text-xs space-y-1">
            <div>🖱️ Mouse: Look</div>
            <div>WASD: Move</div>
            <div>SPACE: Jump</div>
            <div>Click: Mine</div>
            <div>E: Crafting</div>
            <div>ESC: Release Mouse</div>
          </div>
        </div>
      </div>

      {/* Tool & Inventory Bar - Bottom */}
      <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-40">
        <div className="bg-black bg-opacity-90 rounded-xl p-3 border-2 border-yellow-500">
          <div className="flex items-center gap-3">
            <div className="text-white font-bold text-sm">🔧 Tool:</div>
            <div className={`px-3 py-2 rounded-lg ${player.currentTool === 'hand' ? 'bg-yellow-600' : 'bg-gray-700'} text-white text-sm`}>
              ✋ Hand
            </div>
            {inventory.filter(i => i.type === 'tool').map(tool => (
              <div 
                key={tool.id}
                className={`px-3 py-2 rounded-lg cursor-pointer ${player.currentTool === tool.id ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'} text-white text-sm`}
                onClick={() => equipTool(tool.id)}
              >
                {tool.emoji} {tool.name}
              </div>
            ))}
          </div>
          <div className="mt-2 flex items-center gap-2 flex-wrap max-w-2xl">
            <div className="text-white font-bold text-sm">🎒 Inventory:</div>
            {inventory.filter(i => i.type === 'material').map(item => (
              <div key={item.id} className="bg-gray-700 rounded px-2 py-1 text-white text-xs">
                {item.name} ×{item.count}
              </div>
            ))}
            {inventory.filter(i => i.type === 'material').length === 0 && (
              <div className="text-gray-400 text-xs">Empty</div>
            )}
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <div className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-black bg-opacity-95 rounded-xl px-6 py-3 border-2 border-yellow-400">
          <p className="text-white text-lg font-bold">{message}</p>
        </div>
      )}

      {/* Crafting Menu */}
      {showCrafting && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center p-8">
          <div className="bg-gradient-to-b from-gray-900 to-black rounded-3xl p-8 border-4 border-yellow-600 max-w-4xl max-h-[80vh] overflow-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-4xl font-bold text-yellow-400">🔨 Crafting</h2>
              <button
                onClick={() => setShowCrafting(false)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-bold"
              >
                ✕ Close
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {craftingRecipes.map(recipe => {
                const canCraft = recipe.requires.every(req => {
                  const item = inventory.find(i => i.id === req.itemId);
                  return item && item.count >= req.count;
                });

                return (
                  <div 
                    key={recipe.id}
                    className={`bg-gray-800 rounded-xl p-4 border-2 ${canCraft ? 'border-green-500' : 'border-gray-600'}`}
                  >
                    <div className="text-2xl mb-2">{recipe.emoji}</div>
                    <h3 className="text-white font-bold text-lg mb-2">{recipe.name}</h3>
                    <div className="text-gray-300 text-sm mb-3">
                      <div className="font-bold mb-1">Requires:</div>
                      {recipe.requires.map(req => {
                        const item = inventory.find(i => i.id === req.itemId);
                        const has = item?.count || 0;
                        return (
                          <div key={req.itemId} className={has >= req.count ? 'text-green-400' : 'text-red-400'}>
                            • {req.itemId}: {has}/{req.count}
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => craftItem(recipe)}
                      disabled={!canCraft}
                      className={`w-full py-2 rounded-lg font-bold transition-all ${
                        canCraft
                          ? 'bg-green-600 hover:bg-green-700 text-white'
                          : 'bg-gray-700 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canCraft ? '✅ Craft' : '❌ Need Materials'}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 bg-gray-800 rounded-xl p-4 border-2 border-blue-500">
              <h3 className="text-white font-bold mb-2">💡 Tip: Tool Progression</h3>
              <p className="text-gray-300 text-sm">
                Start by punching trees for wood, then craft a Wooden Pickaxe. Each better pickaxe lets you mine harder materials!
                <br />
                <span className="text-purple-400 font-bold">Ultimate Goal:</span> Craft a Lorite Pickaxe - the strongest tool!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* First-Person 3D View */}
      <div className="w-full h-screen relative" style={{ perspective: '800px' }}>
        <div className="absolute inset-0 bg-gradient-to-b from-sky-400 via-blue-500  to-blue-600" />
        
        <div 
          className="absolute text-8xl"
          style={{
            top: '10%',
            right: '20%',
            transform: `rotate(${player.rotationY}deg)`,
            transition: 'transform 0.1s',
            textShadow: '0 0 50px rgba(255, 255, 0, 0.8)'
          }}
        >
          ☀️
        </div>

        <div className="absolute inset-0 flex items-center justify-center overflow-hidden" style={{
          perspective: '2000px',
          willChange: 'transform'
        }}>
          <div style={{
            transform: `rotateX(${player.rotationX}deg) rotateY(${-player.rotationY}deg) translateY(-150px)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}>
            {blocks.filter(block => {
              const dx = block.x - player.x;
              const dy = block.y - player.y;
              const dz = block.z - player.z;
              const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
              
              // Only render blocks in front and nearby
              return distance < renderDistance && Math.abs(dx) < renderDistance && Math.abs(dz) < renderDistance;
            }).slice(0, 200).map((block) => { // Reduced to 200 for ultra-smooth
              const dx = (block.x - player.x) * 200; // MASSIVE blocks that fill screen!
              const dy = -(block.y - player.y) * 200;
              const dz = -(block.z - player.z) * 200;
              
              const isTarget = targetBlock && 
                targetBlock.x === block.x && 
                targetBlock.y === block.y && 
                targetBlock.z === block.z;

              const blockColor = block.color;
              const isLorite = block.type === 'ore-lorite';

              return (
                <div
                  key={`${block.x}-${block.y}-${block.z}`}
                  style={{
                    position: 'absolute',
                    width: '200px',
                    height: '200px',
                    background: blockColor,
                    transform: `translate3d(${dx}px, ${dy}px, ${dz}px)`,
                    border: isTarget ? '5px solid #ffff00' : '3px solid rgba(0,0,0,0.4)',
                    boxShadow: isTarget ? '0 0 40px #ffff00' : (isLorite ? '0 0 30px #ff00ff' : 'none'),
                    willChange: 'transform',
                    animation: isLorite ? 'loriteGlow 2s ease-in-out infinite' : 'none'
                  }}
                />
              );
            })}
          </div>
        </div>
      </div>

      <div className="fixed bottom-20 left-4 z-40">
        <Link
          href="/kid"
          className="inline-block px-6 py-3 bg-gray-800 hover:bg-gray-700 text-white rounded-xl font-bold transition-all border-2 border-gray-600"
        >
          ⬅️ Exit Game
        </Link>
      </div>

      {/* OLD SURFACE VIEW - Removed (was isometric 3D cubes, now using first-person view above) */}

      {/* OLD UNDERGROUND VIEW - Removed (was cave mining view, now using first-person view above) */}

      {/* Back to Main Menu (always visible) */}
      <div className="text-center mt-8">
        <Link
          href="/kid"
          className="inline-block px-8 py-4 bg-gradient-to-r from-gray-700 to-gray-900 text-white rounded-full text-xl font-bold hover:from-gray-600 hover:to-gray-800 transition-all hover:scale-110 shadow-xl border-4 border-gray-950"
        >
          ⬅️ Back to Learnverse
        </Link>
      </div>

      <style jsx>{`
        @keyframes float-block {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-20px) rotate(5deg);
          }
        }
        .animate-float-block {
          animation: float-block ease-in-out infinite;
        }
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 1s ease-in-out infinite;
        }
        @keyframes float-slow {
          0%, 100% {
            transform: translateX(0px) translateY(0px);
          }
          50% {
            transform: translateX(20px) translateY(-10px);
          }
        }
        .animate-float-slow {
          animation: float-slow 8s ease-in-out infinite;
        }
        @keyframes loriteGlow {
          0%, 100% {
            transform: translate(-5px, -5px) scale(1);
            opacity: 0.6;
          }
          50% {
            transform: translate(-5px, -5px) scale(1.5);
            opacity: 0.3;
          }
        }
        .pixel-font {
          font-family: 'Courier New', monospace;
          letter-spacing: 3px;
        }
      `}</style>
    </div>
  );
}
