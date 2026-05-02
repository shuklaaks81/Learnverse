'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CodeIssue {
  line: number;
  type: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
}

export default function BloxdCodeFixer() {
  const router = useRouter();
  const [code, setCode] = useState('');
  const [fixedCode, setFixedCode] = useState('');
  const [issues, setIssues] = useState<CodeIssue[]>([]);
  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);
  const [mode, setMode] = useState<'world' | 'block'>('world');

  // BLOXD.io code scanner and fixer
  const scanAndFixCode = () => {
    setScanning(true);
    setScanned(false);
    
    setTimeout(() => {
      const foundIssues: CodeIssue[] = [];
      let fixed = code;
      const lines = code.split('\n');

      // World Code Mode - Check for callbacks
      if (mode === 'world') {
        const hasOnPlayerJoin = code.includes('onPlayerJoin');
        const hasOnPlayerLeave = code.includes('onPlayerLeave');
        const hasOnBlockBreak = code.includes('onBlockBreak');
        const hasOnBlockPlace = code.includes('onBlockPlace');
        
        if (!hasOnPlayerJoin && !hasOnPlayerLeave && !hasOnBlockBreak && !hasOnBlockPlace) {
          foundIssues.push({
            line: 0,
            type: 'warning',
            message: '⚠️ World code should have callbacks like onPlayerJoin(), onBlockBreak(), etc.',
            fix: 'Add event callbacks'
          });
        }

        // Check for world object usage
        if (!code.includes('world.')) {
          foundIssues.push({
            line: 0,
            type: 'info',
            message: '💡 World code usually uses the "world" object (world.spawnEntity, world.getBlock, etc.)',
            fix: 'Recommendation'
          });
        }
      }

      // Code Block Mode - Different checks
      if (mode === 'block') {
        // Check for block-specific patterns
        if (code.includes('onPlayerJoin') || code.includes('onBlockBreak')) {
          foundIssues.push({
            line: 0,
            type: 'warning',
            message: '⚠️ Code blocks should not have world callbacks! Use block.* methods instead.',
            fix: 'Remove callbacks'
          });
        }

        // Check for block object usage
        if (!code.includes('block.')) {
          foundIssues.push({
            line: 0,
            type: 'info',
            message: '💡 Code blocks should use "block" object (block.id, block.data, etc.)',
            fix: 'Recommendation'
          });
        }
      }

      // Check for common BLOXD.io issues (both modes)
      lines.forEach((line, index) => {
        const lineNum = index + 1;

        // Missing semicolons
        if (line.trim() && !line.trim().endsWith(';') && !line.trim().endsWith('{') && !line.trim().endsWith('}') && !line.trim().startsWith('//') && !line.trim().startsWith('if') && !line.trim().startsWith('for') && !line.trim().startsWith('while') && !line.trim().startsWith('function')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: 'Missing semicolon at end of line',
            fix: 'Added semicolon'
          });
          fixed = fixed.replace(line, line + ';');
        }

        // Common typos
        if (line.includes('functoin')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "functoin" should be "function"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('functoin', 'function');
        }

        if (line.includes('retrun')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "retrun" should be "return"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('retrun', 'return');
        }

        if (line.includes('cosole')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "cosole" should be "console"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('cosole', 'console');
        }

        // BLOXD.io specific checks
        if (line.includes('player.positon')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Typo: "positon" should be "position"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace('player.positon', 'player.position');
        }

        if (line.includes('world.spawnEnemy') && !line.includes('()')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Missing parentheses for function call',
            fix: 'Added ()'
          });
        }

        // Variable naming issues
        if (line.match(/let\s+\d/)) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: 'Variable names cannot start with numbers',
            fix: 'Variables should start with letters'
          });
        }

        // Bracket matching
        const openBrackets = (line.match(/\{/g) || []).length;
        const closeBrackets = (line.match(/\}/g) || []).length;
        if (openBrackets !== closeBrackets && (line.includes('{') || line.includes('}'))) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: 'Possible bracket mismatch',
            fix: 'Check your brackets'
          });
        }

        // Missing var/let/const
        if (line.match(/^\s*[a-zA-Z_]\w*\s*=/) && !line.includes('let') && !line.includes('const') && !line.includes('var')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: 'Variable declared without let/const/var',
            fix: 'Should use let, const, or var'
          });
        }

        // BLOXD API tips
        if (line.includes('player.health') && !line.includes('player.health =')) {
          foundIssues.push({
            line: lineNum,
            type: 'info',
            message: '💡 Tip: Use player.setHealth() for better results',
            fix: 'Recommendation'
          });
        }

        if (line.includes('setInterval') || line.includes('setTimeout')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: '⚠️ Be careful with timers - they can cause lag!',
            fix: 'Performance warning'
          });
        }
      });

      // If no issues found
      if (foundIssues.length === 0) {
        foundIssues.push({
          line: 0,
          type: 'info',
          message: '✅ No issues found! Your code looks great!',
        });
      }

      setIssues(foundIssues);
      setFixedCode(fixed);
      setScanning(false);
      setScanned(true);
    }, 1500); // Simulate scanning time
  };

  const copyFixedCode = () => {
    navigator.clipboard.writeText(fixedCode);
    alert('✅ Fixed code copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 mb-6 border-2 border-white/20">
          <button
            onClick={() => router.push('/kid/fun-lab')}
            className="text-white/80 hover:text-white mb-4 flex items-center gap-2"
          >
            ← Back to Fun Lab
          </button>
          <h1 className="text-5xl font-black text-white mb-3 drop-shadow-lg">
            🔧 BLOXD Code Fixer
          </h1>
          <p className="text-xl text-white/90 mb-4">
            Paste your bloxd.io code and I'll scan it for errors and fix them!
          </p>

          {/* Mode Selector */}
          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setMode('world')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all transform ${
                mode === 'world'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white scale-105 shadow-2xl'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              🌍 World Code
              <div className="text-sm font-normal mt-1">
                {mode === 'world' ? 'Uses callbacks!' : 'onPlayerJoin, etc.'}
              </div>
            </button>
            <button
              onClick={() => setMode('block')}
              className={`flex-1 py-4 px-6 rounded-2xl font-bold text-lg transition-all transform ${
                mode === 'block'
                  ? 'bg-gradient-to-r from-blue-500 to-cyan-600 text-white scale-105 shadow-2xl'
                  : 'bg-white/20 text-white/70 hover:bg-white/30'
              }`}
            >
              🧱 Code Block
              <div className="text-sm font-normal mt-1">
                {mode === 'block' ? 'Uses block.*!' : 'block.id, etc.'}
              </div>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
            <h2 className="text-3xl font-bold text-white mb-4">
              📝 Your {mode === 'world' ? 'World' : 'Block'} Code
            </h2>
            <textarea
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={mode === 'world' 
                ? `Paste your World Code here...

Example:
function onPlayerJoin(player) {
  player.positon.x = 10
  world.spawnEntity('zombie')
  cosole.log('Player joined')
}`
                : `Paste your Code Block here...

Example:
if (block.id === 1) {
  block.data = 5
  player.giveItem('diamond')
}`
              }
              className="w-full h-96 bg-gray-900 text-green-400 font-mono p-4 rounded-xl resize-none focus:outline-none focus:ring-4 focus:ring-blue-400"
              spellCheck={false}
            />
            
            <button
              onClick={scanAndFixCode}
              disabled={!code.trim() || scanning}
              className={`w-full mt-4 py-4 rounded-2xl font-bold text-xl transition-all transform ${
                !code.trim() || scanning
                  ? 'bg-gray-500 text-gray-300 cursor-not-allowed'
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:scale-105 hover:shadow-2xl'
              }`}
            >
              {scanning ? '🔍 Scanning...' : '🚀 Scan & Fix Code!'}
            </button>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            {/* Issues Found */}
            {scanned && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">
                  {issues.length === 1 && issues[0].line === 0 ? '✅ Results' : '🔍 Issues Found'}
                </h2>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {issues.map((issue, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-xl ${
                        issue.type === 'error'
                          ? 'bg-red-500/20 border-2 border-red-400'
                          : issue.type === 'warning'
                          ? 'bg-yellow-500/20 border-2 border-yellow-400'
                          : 'bg-blue-500/20 border-2 border-blue-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className="text-2xl">
                          {issue.type === 'error' ? '❌' : issue.type === 'warning' ? '⚠️' : 'ℹ️'}
                        </span>
                        <div className="flex-1">
                          {issue.line > 0 && (
                            <div className="text-white/70 text-sm mb-1">
                              Line {issue.line}
                            </div>
                          )}
                          <div className="text-white font-semibold">
                            {issue.message}
                          </div>
                          {issue.fix && (
                            <div className="text-green-300 text-sm mt-1">
                              ✓ {issue.fix}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fixed Code */}
            {scanned && fixedCode !== code && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">✨ Fixed Code</h2>
                <textarea
                  value={fixedCode}
                  readOnly
                  className="w-full h-64 bg-gray-900 text-green-400 font-mono p-4 rounded-xl resize-none focus:outline-none"
                  spellCheck={false}
                />
                <button
                  onClick={copyFixedCode}
                  className="w-full mt-4 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-2xl font-bold text-xl hover:scale-105 transition-transform"
                >
                  📋 Copy Fixed Code
                </button>
              </div>
            )}

            {/* Tips */}
            {!scanned && (
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
                <h2 className="text-3xl font-bold text-white mb-4">
                  💡 {mode === 'world' ? 'World Code' : 'Code Block'} Tips
                </h2>
                <div className="space-y-3 text-white/90">
                  {mode === 'world' ? (
                    <>
                      <p>✅ World code needs callbacks (onPlayerJoin, onBlockBreak)</p>
                      <p>✅ Use world.* methods (world.spawnEntity, world.getBlock)</p>
                      <p>✅ Callbacks get parameters (player, block, etc.)</p>
                      <p>✅ Checks for typos and missing semicolons</p>
                      <p>✅ BLOXD.io API corrections</p>
                      <p>✅ Performance warnings</p>
                    </>
                  ) : (
                    <>
                      <p>✅ Code blocks use block.* properties (block.id, block.data)</p>
                      <p>✅ Don't use world callbacks in code blocks!</p>
                      <p>✅ Use player.* for player actions</p>
                      <p>✅ Checks for typos and missing semicolons</p>
                      <p>✅ BLOXD.io API corrections</p>
                      <p>✅ Variable naming issues</p>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Example Code Snippets */}
        <div className="mt-6 bg-white/10 backdrop-blur-lg rounded-3xl p-6 border-2 border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            📚 {mode === 'world' ? 'World Code' : 'Code Block'} Examples
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <h3 className="text-white font-bold mb-2">❌ Common Mistake:</h3>
              <code className="text-red-400 text-sm whitespace-pre-wrap">
                {mode === 'world' 
                  ? `// Missing callback!\nplayer.positon.x = 10\ncosole.log("hi")`
                  : `// Wrong for code blocks!\nfunction onPlayerJoin()\nblock.id = undefined`
                }
              </code>
            </div>
            <div className="bg-gray-900/50 p-4 rounded-xl">
              <h3 className="text-white font-bold mb-2">✅ Fixed Version:</h3>
              <code className="text-green-400 text-sm whitespace-pre-wrap">
                {mode === 'world'
                  ? `function onPlayerJoin(player) {\n  player.position.x = 10;\n  console.log("hi");\n}`
                  : `if (block.id === 1) {\n  block.data = 5;\n  player.giveItem('diamond');\n}`
                }
              </code>
            </div>
          </div>
        </div>

        {/* Nether Generation Templates - World Code Only */}
        {mode === 'world' && (
          <div className="mt-6 bg-gradient-to-br from-red-900/30 via-orange-900/30 to-yellow-900/30 backdrop-blur-lg rounded-3xl p-6 border-2 border-orange-500/50">
            <h2 className="text-4xl font-black text-white mb-3 drop-shadow-lg">
              🔥 Nether Generation Templates 🔥
            </h2>
            <p className="text-xl text-orange-200 mb-6">
              Generate the Nether below bedrock! Copy these templates for your mods!
            </p>

            {/* Template 1: Chunk by Chunk Generation */}
            <div className="mb-6 bg-gray-900/80 p-5 rounded-2xl border-2 border-red-500/50">
              <h3 className="text-2xl font-bold text-orange-300 mb-3 flex items-center gap-2">
                🧱 Template 1: Chunk-by-Chunk Nether Generation
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                ⚡ Generates bit by bit to avoid hitting world code limits!
              </p>
              <div className="bg-black/50 p-4 rounded-xl overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`// Chunk-by-chunk Nether generation below bedrock
let currentChunkX = -10;  // Start position
let currentChunkZ = -10;
const CHUNK_SIZE = 8;     // Generate 8x8 blocks at a time
const BEDROCK_Y = 0;      // Bedrock level
const NETHER_START = -5;  // Start Nether 5 blocks below bedrock
const NETHER_HEIGHT = 30; // Nether is 30 blocks tall

function onPlayerJoin(player) {
  // Start generation when player joins
  generateNextChunk();
}

function generateNextChunk() {
  // Generate one chunk at a time
  for (let x = currentChunkX; x < currentChunkX + CHUNK_SIZE; x++) {
    for (let z = currentChunkZ; z < currentChunkZ + CHUNK_SIZE; z++) {
      for (let y = NETHER_START; y < NETHER_START + NETHER_HEIGHT; y++) {
        
        // Netherrack base (replace with red wool or brick)
        if (Math.random() > 0.1) {
          world.setBlock(x, y, z, 'red_wool'); // Use red_wool as netherrack
        }
        
        // Soul sand patches (brown wool)
        if (y === NETHER_START && Math.random() > 0.8) {
          world.setBlock(x, y, z, 'brown_wool');
        }
        
        // Lava lakes
        if (y < NETHER_START + 10 && Math.random() > 0.95) {
          world.setBlock(x, y, z, 'lava');
        }
      }
    }
  }
  
  // Move to next chunk
  currentChunkX += CHUNK_SIZE;
  if (currentChunkX > 10) {  // Generated enough X chunks
    currentChunkX = -10;
    currentChunkZ += CHUNK_SIZE;
  }
  
  // Generate next chunk after delay (avoid lag)
  if (currentChunkZ <= 10) {
    setTimeout(generateNextChunk, 1000);  // Wait 1 second
  }
}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const code1 = `// Chunk-by-chunk Nether generation below bedrock
let currentChunkX = -10;  // Start position
let currentChunkZ = -10;
const CHUNK_SIZE = 8;     // Generate 8x8 blocks at a time
const BEDROCK_Y = 0;      // Bedrock level
const NETHER_START = -5;  // Start Nether 5 blocks below bedrock
const NETHER_HEIGHT = 30; // Nether is 30 blocks tall

function onPlayerJoin(player) {
  // Start generation when player joins
  generateNextChunk();
}

function generateNextChunk() {
  // Generate one chunk at a time
  for (let x = currentChunkX; x < currentChunkX + CHUNK_SIZE; x++) {
    for (let z = currentChunkZ; z < currentChunkZ + CHUNK_SIZE; z++) {
      for (let y = NETHER_START; y < NETHER_START + NETHER_HEIGHT; y++) {
        
        // Netherrack base (replace with red wool or brick)
        if (Math.random() > 0.1) {
          world.setBlock(x, y, z, 'red_wool'); // Use red_wool as netherrack
        }
        
        // Soul sand patches (brown wool)
        if (y === NETHER_START && Math.random() > 0.8) {
          world.setBlock(x, y, z, 'brown_wool');
        }
        
        // Lava lakes
        if (y < NETHER_START + 10 && Math.random() > 0.95) {
          world.setBlock(x, y, z, 'lava');
        }
      }
    }
  }
  
  // Move to next chunk
  currentChunkX += CHUNK_SIZE;
  if (currentChunkX > 10) {  // Generated enough X chunks
    currentChunkX = -10;
    currentChunkZ += CHUNK_SIZE;
  }
  
  // Generate next chunk after delay (avoid lag)
  if (currentChunkZ <= 10) {
    setTimeout(generateNextChunk, 1000);  // Wait 1 second
  }
}`;
                  navigator.clipboard.writeText(code1);
                  alert('📋 Template 1 copied to clipboard!');
                }}
                className="mt-3 px-6 py-3 bg-gradient-to-r from-orange-500 to-red-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
              >
                📋 Copy Template 1
              </button>
            </div>

            {/* Template 2: Nether Structures */}
            <div className="mb-6 bg-gray-900/80 p-5 rounded-2xl border-2 border-purple-500/50">
              <h3 className="text-2xl font-bold text-purple-300 mb-3 flex items-center gap-2">
                🏰 Template 2: Nether Fortress Structures
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                🏗️ Generates nether fortress-style structures!
              </p>
              <div className="bg-black/50 p-4 rounded-xl overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`// Nether fortress structure generator
function generateNetherFortress(centerX, centerY, centerZ) {
  // Main bridge
  for (let x = centerX - 10; x <= centerX + 10; x++) {
    for (let z = centerZ - 1; z <= centerZ + 1; z++) {
      world.setBlock(x, centerY, z, 'nether_brick'); // or dark_brick
      world.setBlock(x, centerY + 1, z, 'air');      // Clear space
      world.setBlock(x, centerY + 2, z, 'air');
      world.setBlock(x, centerY + 3, z, 'air');
    }
  }
  
  // Side walls
  for (let x = centerX - 10; x <= centerX + 10; x++) {
    for (let y = centerY; y <= centerY + 3; y++) {
      world.setBlock(x, y, centerZ - 1, 'nether_brick');
      world.setBlock(x, y, centerZ + 1, 'nether_brick');
    }
  }
  
  // Towers at ends
  generateTower(centerX - 10, centerY, centerZ);
  generateTower(centerX + 10, centerY, centerZ);
}

function generateTower(x, y, z) {
  // Tower base
  for (let tx = x - 2; tx <= x + 2; tx++) {
    for (let tz = z - 2; tz <= z + 2; tz++) {
      for (let ty = y; ty <= y + 8; ty++) {
        // Hollow tower
        if (tx === x - 2 || tx === x + 2 || tz === z - 2 || tz === z + 2) {
          world.setBlock(tx, ty, tz, 'nether_brick');
        } else {
          world.setBlock(tx, ty, tz, 'air');
        }
      }
      // Roof
      world.setBlock(tx, y + 9, tz, 'nether_brick_stairs');
    }
  }
}

function onPlayerJoin(player) {
  // Generate fortress below bedrock
  generateNetherFortress(0, -10, 0);
}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const code2 = `// Nether fortress structure generator
function generateNetherFortress(centerX, centerY, centerZ) {
  // Main bridge
  for (let x = centerX - 10; x <= centerX + 10; x++) {
    for (let z = centerZ - 1; z <= centerZ + 1; z++) {
      world.setBlock(x, centerY, z, 'nether_brick'); // or dark_brick
      world.setBlock(x, centerY + 1, z, 'air');      // Clear space
      world.setBlock(x, centerY + 2, z, 'air');
      world.setBlock(x, centerY + 3, z, 'air');
    }
  }
  
  // Side walls
  for (let x = centerX - 10; x <= centerX + 10; x++) {
    for (let y = centerY; y <= centerY + 3; y++) {
      world.setBlock(x, y, centerZ - 1, 'nether_brick');
      world.setBlock(x, y, centerZ + 1, 'nether_brick');
    }
  }
  
  // Towers at ends
  generateTower(centerX - 10, centerY, centerZ);
  generateTower(centerX + 10, centerY, centerZ);
}

function generateTower(x, y, z) {
  // Tower base
  for (let tx = x - 2; tx <= x + 2; tx++) {
    for (let tz = z - 2; tz <= z + 2; tz++) {
      for (let ty = y; ty <= y + 8; ty++) {
        // Hollow tower
        if (tx === x - 2 || tx === x + 2 || tz === z - 2 || tz === z + 2) {
          world.setBlock(tx, ty, tz, 'nether_brick');
        } else {
          world.setBlock(tx, ty, tz, 'air');
        }
      }
      // Roof
      world.setBlock(tx, y + 9, tz, 'nether_brick_stairs');
    }
  }
}

function onPlayerJoin(player) {
  // Generate fortress below bedrock
  generateNetherFortress(0, -10, 0);
}`;
                  navigator.clipboard.writeText(code2);
                  alert('📋 Template 2 copied to clipboard!');
                }}
                className="mt-3 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
              >
                📋 Copy Template 2
              </button>
            </div>

            {/* Template 3: Mob Spawning */}
            <div className="mb-6 bg-gray-900/80 p-5 rounded-2xl border-2 border-green-500/50">
              <h3 className="text-2xl font-bold text-green-300 mb-3 flex items-center gap-2">
                👹 Template 3: Nether Mob Spawning
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                🧟 Spawns mobs in the Nether! Uses BLOXD mob replacements!
              </p>
              <div className="bg-black/50 p-4 rounded-xl overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`// Nether mob spawner - replaces with BLOXD mobs
const NETHER_Y = -10;  // Nether level
let mobSpawnTimer = 0;

function onPlayerJoin(player) {
  // Start mob spawning
  spawnNetherMobs();
}

function spawnNetherMobs() {
  // Random positions in Nether
  const x = Math.floor(Math.random() * 40) - 20;
  const z = Math.floor(Math.random() * 40) - 20;
  const y = NETHER_Y + 5;
  
  const mobType = Math.random();
  
  if (mobType < 0.4) {
    // Zombie Pigmen -> Use BLOXD zombie
    world.spawnEntity('zombie', x, y, z);
  } else if (mobType < 0.7) {
    // Blazes -> Use BLOXD fire enemy or skeleton
    world.spawnEntity('skeleton', x, y, z);
  } else if (mobType < 0.9) {
    // Ghasts -> Use BLOXD slime (big and floaty!)
    world.spawnEntity('slime', x, y + 3, z);
  } else {
    // Magma Cubes -> Use BLOXD small slime
    world.spawnEntity('small_slime', x, y, z);
  }
  
  // Spawn more mobs every 10 seconds
  setTimeout(spawnNetherMobs, 10000);
}

// Alternative: Spawn mobs when player enters Nether
function onPlayerMove(player) {
  if (player.position.y < 0) {  // Player in Nether!
    // Random chance to spawn nearby mob
    if (Math.random() > 0.99) {
      const nearX = player.position.x + (Math.random() * 20 - 10);
      const nearZ = player.position.z + (Math.random() * 20 - 10);
      world.spawnEntity('zombie', nearX, NETHER_Y + 5, nearZ);
    }
  }
}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const code3 = `// Nether mob spawner - replaces with BLOXD mobs
const NETHER_Y = -10;  // Nether level
let mobSpawnTimer = 0;

function onPlayerJoin(player) {
  // Start mob spawning
  spawnNetherMobs();
}

function spawnNetherMobs() {
  // Random positions in Nether
  const x = Math.floor(Math.random() * 40) - 20;
  const z = Math.floor(Math.random() * 40) - 20;
  const y = NETHER_Y + 5;
  
  const mobType = Math.random();
  
  if (mobType < 0.4) {
    // Zombie Pigmen -> Use BLOXD zombie
    world.spawnEntity('zombie', x, y, z);
  } else if (mobType < 0.7) {
    // Blazes -> Use BLOXD fire enemy or skeleton
    world.spawnEntity('skeleton', x, y, z);
  } else if (mobType < 0.9) {
    // Ghasts -> Use BLOXD slime (big and floaty!)
    world.spawnEntity('slime', x, y + 3, z);
  } else {
    // Magma Cubes -> Use BLOXD small slime
    world.spawnEntity('small_slime', x, y, z);
  }
  
  // Spawn more mobs every 10 seconds
  setTimeout(spawnNetherMobs, 10000);
}

// Alternative: Spawn mobs when player enters Nether
function onPlayerMove(player) {
  if (player.position.y < 0) {  // Player in Nether!
    // Random chance to spawn nearby mob
    if (Math.random() > 0.99) {
      const nearX = player.position.x + (Math.random() * 20 - 10);
      const nearZ = player.position.z + (Math.random() * 20 - 10);
      world.spawnEntity('zombie', nearX, NETHER_Y + 5, nearZ);
    }
  }
}`;
                  navigator.clipboard.writeText(code3);
                  alert('📋 Template 3 copied to clipboard!');
                }}
                className="mt-3 px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
              >
                📋 Copy Template 3
              </button>
            </div>

            {/* Pro Tips */}
            <div className="bg-yellow-900/30 p-4 rounded-xl border-2 border-yellow-500/50">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">💡 Pro Tips for Nether Generation:</h3>
              <div className="space-y-2 text-white/90 text-sm">
                <p>⚡ <strong>Generate in chunks</strong> - Don't try to generate everything at once!</p>
                <p>⏱️ <strong>Use setTimeout</strong> - Add delays between chunks to avoid lag</p>
                <p>🧱 <strong>Block replacements:</strong> red_wool = netherrack, brown_wool = soul sand, lava = lava!</p>
                <p>👹 <strong>Mob replacements:</strong> zombie = zombie pigmen, skeleton = blazes, slime = ghasts!</p>
                <p>🏗️ <strong>Test small first</strong> - Start with CHUNK_SIZE = 4, then increase!</p>
                <p>📍 <strong>Bedrock is Y=0</strong> - Generate Nether at Y=-5 to Y=-35</p>
                <p>🔥 <strong>Combine templates</strong> - Use all 3 together for full Nether experience!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
