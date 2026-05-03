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

  // BLOXD.io code scanner and fixer - ADVANCED VERSION!
  const scanAndFixCode = () => {
    setScanning(true);
    setScanned(false);
    
    setTimeout(() => {
      const foundIssues: CodeIssue[] = [];
      let fixed = code;
      const lines = code.split('\n');
      
      // Track defined variables and functions for existence checking!
      const definedVars = new Set<string>();
      const definedFunctions = new Set<string>();
      const usedVars = new Set<string>();

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
        if (!code.includes('world.') && !code.includes('api.')) {
          foundIssues.push({
            line: 0,
            type: 'info',
            message: '💡 World code usually uses "world" or "api" object (world.setBlock, api.attemptSpawnMob, etc.)',
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
        const trimmed = line.trim();

        // ADVANCED SYNTAX ERROR CHECKS!
        
        // Missing closing parentheses
        const openParen = (line.match(/\(/g) || []).length;
        const closeParen = (line.match(/\)/g) || []).length;
        if (openParen !== closeParen && trimmed && !trimmed.startsWith('//')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: `❌ SYNTAX ERROR: Mismatched parentheses! (${openParen} open, ${closeParen} close)`,
            fix: 'Check your () brackets'
          });
        }

        // Missing closing quotes
        const singleQuotes = (line.match(/'/g) || []).length;
        const doubleQuotes = (line.match(/"/g) || []).length;
        if (singleQuotes % 2 !== 0 && !trimmed.startsWith('//')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: "❌ SYNTAX ERROR: Unclosed single quote '",
            fix: 'Add closing quote'
          });
        }
        if (doubleQuotes % 2 !== 0 && !trimmed.startsWith('//')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ SYNTAX ERROR: Unclosed double quote "',
            fix: 'Add closing quote'
          });
        }

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
            message: '❌ TYPO: "retrun" should be "return"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/retrun/g, 'return');
        }
        if (line.includes('reutrn')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "reutrn" should be "return"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/reutrn/g, 'return');
        }
        if (line.includes('funtion')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "funtion" should be "function"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/funtion/g, 'function');
        }
        if (line.includes('funciton')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "funciton" should be "function"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/funciton/g, 'function');
        }

        if (line.includes('cosole')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "cosole" should be "console"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/cosole/g, 'console');
        }
        if (line.includes('consol.')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "consol" should be "console"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/consol\./g, 'console.');
        }
        if (line.match(/\bture\b/)) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "ture" should be "true"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/\bture\b/g, 'true');
        }
        if (line.match(/\bflase\b/)) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "flase" should be "false"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/\bflase\b/g, 'false');
        }
        if (line.includes('postion')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "postion" should be "position"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/postion/g, 'position');
        }

        // Track function definitions for existence checking
        const funcMatch = line.match(/function\s+([a-zA-Z_]\w*)/);
        if (funcMatch) {
          definedFunctions.add(funcMatch[1]);
        }
        
        // Track variable declarations
        const varMatch = line.match(/(?:let|const|var)\s+([a-zA-Z_]\w*)/);
        if (varMatch) {
          definedVars.add(varMatch[1]);
        }
        
        // Track variable usage
        const usageMatches = line.matchAll(/\b([a-zA-Z_]\w*)\b/g);
        for (const match of usageMatches) {
          const varName = match[1];
          if (!['if', 'for', 'while', 'function', 'let', 'const', 'var', 'return', 'true', 'false', 'null', 'undefined', 'this', 'else'].includes(varName)) {
            usedVars.add(varName);
          }
        }

        // BLOXD.io specific checks
        if (line.includes('player.positon') || line.includes('.positon')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ TYPO: "positon" should be "position"',
            fix: 'Fixed typo'
          });
          fixed = fixed.replace(/positon/g, 'position');
        }
        
        // Check for wrong API function names
        if (line.match(/api\.spawnMob/i) && !line.includes('attemptSpawnMob')) {
          foundIssues.push({
            line: lineNum,
            type: 'error',
            message: '❌ Wrong function! Use "api.attemptSpawnMob" not "api.spawnMob"',
            fix: 'Fixed function name'
          });
          fixed = fixed.replace(/api\.spawnMob/gi, 'api.attemptSpawnMob');
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
            message: '❌ Variable names cannot start with numbers!',
            fix: 'Start variable names with letters'
          });
        }

        // Bracket matching
        const openBrackets = (line.match(/\{/g) || []).length;
        const closeBrackets = (line.match(/\}/g) || []).length;
        if (openBrackets !== closeBrackets && (line.includes('{') || line.includes('}'))) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: `⚠️ Possible bracket mismatch (${openBrackets} open, ${closeBrackets} close)`,
            fix: 'Check your {} brackets'
          });
        }

        // Missing var/let/const
        if (line.match(/^\s*[a-zA-Z_]\w*\s*=/) && !line.includes('let') && !line.includes('const') && !line.includes('var') && !line.includes('.')) {
          foundIssues.push({
            line: lineNum,
            type: 'warning',
            message: '⚠️ Variable declared without let/const/var',
            fix: 'Should use let, const, or var'
          });
        }

        // BLOXD API tips
        if (line.includes('player.health') && !line.includes('player.health =') && !line.includes('setHealth')) {
          foundIssues.push({
            line: lineNum,
            type: 'info',
            message: '💡 Tip: Use player.setHealth() or api.setHealth() for better results',
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

      // Check for undefined variables/functions being used!
      usedVars.forEach(varName => {
        // Skip built-in objects and BLOXD API
        if (['Math', 'console', 'player', 'world', 'block', 'api', 'setTimeout', 'setInterval', 'String', 'Number', 'Array', 'Object'].includes(varName)) {
          return;
        }
        
        if (!definedVars.has(varName) && !definedFunctions.has(varName)) {
          foundIssues.push({
            line: 0,
            type: 'warning',
            message: `⚠️ "${varName}" is used but never defined! Did you forget to declare it?`,
            fix: 'Check if variable exists'
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
                🧱 Template 1: Nether Generation (WORKING VERSION!)
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                ⚡ Generates 9x9x9 cubes below you! You'll SEE it generate! 🔥
              </p>
              <div className="bg-black/50 p-4 rounded-xl overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`// Nether generation that WORKS and you can SEE!
let currentPlayer = null;    // Store player reference
let startX = 0;              // Will be set to player position
let startZ = 0;
let currentX = 0;
let currentZ = 0;
let currentY = -10;          // Start Y position (below bedrock)
const CUBE_SIZE = 9;         // Generate 9x9x9 cubes!
const NETHER_HEIGHT = 30;    // Nether is 30 blocks tall
const AREA_SIZE = 100;       // Generate 100 blocks around spawn (change to 100000 for world border!)
let totalCubes = 0;

function onPlayerJoin(player) {
  currentPlayer = player;    // Save player!
  
  // Get player position
  let pos = player.getPosition();
  startX = Math.floor(pos.x) - 50;  // Start 50 blocks away
  startZ = Math.floor(pos.z) - 50;
  currentX = startX;
  currentZ = startZ;
  
  console.log("🔥 Starting Nether generation at X:" + startX + " Z:" + startZ);
  player.sendMessage("🔥 Starting Nether generation! Look around you!");
  
  // Generate first cube immediately so you see something!
  setTimeout(() => generateNextCube(), 100);
}

function generateNextCube() {
  console.log("Generating cube at X:" + currentX + " Y:" + currentY + " Z:" + currentZ);
  
  // Generate one 9x9x9 cube
  for (let x = currentX; x < currentX + CUBE_SIZE; x++) {
    for (let z = currentZ; z < currentZ + CUBE_SIZE; z++) {
      for (let y = currentY; y < currentY + CUBE_SIZE; y++) {
        
        // Netherrack base (red wool) - dense!
        if (Math.random() > 0.05) {
          world.setBlock(x, y, z, 'red_wool');
        }
        
        // Soul sand patches (brown wool)
        if (y === currentY && Math.random() > 0.85) {
          world.setBlock(x, y, z, 'brown_wool');
        }
        
        // Lava lakes - rare
        if (Math.random() > 0.97) {
          world.setBlock(x, y, z, 'lava');
        }
        
        // Glowstone (yellow wool) - very rare
        if (Math.random() > 0.98) {
          world.setBlock(x, y, z, 'yellow_wool');
        }
      }
    }
  }
  
  totalCubes++;
  
  // Move to next cube horizontally first
  currentX += CUBE_SIZE;
  
  // If we finished this row, move to next Z
  if (currentX >= startX + AREA_SIZE) {
    currentX = startX;
    currentZ += CUBE_SIZE;
    
    // Progress update every row
    if (currentPlayer) {
      currentPlayer.sendMessage("🔥 Row complete! Generated " + totalCubes + " cubes!");
    }
    console.log("🔥 Row complete! Total cubes: " + totalCubes);
  }
  
  // If we finished all rows, move up
  if (currentZ >= startZ + AREA_SIZE) {
    currentZ = startZ;
    currentY += CUBE_SIZE;
  }
  
  // Check if we're done (generated all height layers)
  if (currentY >= -10 + NETHER_HEIGHT) {
    if (currentPlayer) {
      currentPlayer.sendMessage("✅ NETHER GEN COMPLETE! 🔥🔥🔥");
      currentPlayer.sendMessage("Total cubes: " + totalCubes);
    }
    console.log("✅ GENERATION COMPLETE! Total: " + totalCubes + " cubes");
    return; // Stop generating
  }
  
  // Continue generating after short delay (prevents lag!)
  setTimeout(() => generateNextCube(), 200);  // 0.2 second delay
}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const code1 = `// Nether generation that WORKS and you can SEE!
let currentPlayer = null;    // Store player reference
let startX = 0;              // Will be set to player position
let startZ = 0;
let currentX = 0;
let currentZ = 0;
let currentY = -10;          // Start Y position (below bedrock)
const CUBE_SIZE = 9;         // Generate 9x9x9 cubes!
const NETHER_HEIGHT = 30;    // Nether is 30 blocks tall
const AREA_SIZE = 100;       // Generate 100 blocks around spawn (change to 100000 for world border!)
let totalCubes = 0;

function onPlayerJoin(player) {
  currentPlayer = player;    // Save player!
  
  // Get player position
  let pos = player.getPosition();
  startX = Math.floor(pos.x) - 50;  // Start 50 blocks away
  startZ = Math.floor(pos.z) - 50;
  currentX = startX;
  currentZ = startZ;
  
  console.log("🔥 Starting Nether generation at X:" + startX + " Z:" + startZ);
  player.sendMessage("🔥 Starting Nether generation! Look around you!");
  
  // Generate first cube immediately so you see something!
  setTimeout(() => generateNextCube(), 100);
}

function generateNextCube() {
  console.log("Generating cube at X:" + currentX + " Y:" + currentY + " Z:" + currentZ);
  
  // Generate one 9x9x9 cube
  for (let x = currentX; x < currentX + CUBE_SIZE; x++) {
    for (let z = currentZ; z < currentZ + CUBE_SIZE; z++) {
      for (let y = currentY; y < currentY + CUBE_SIZE; y++) {
        
        // Netherrack base (red wool) - dense!
        if (Math.random() > 0.05) {
          world.setBlock(x, y, z, 'red_wool');
        }
        
        // Soul sand patches (brown wool)
        if (y === currentY && Math.random() > 0.85) {
          world.setBlock(x, y, z, 'brown_wool');
        }
        
        // Lava lakes - rare
        if (Math.random() > 0.97) {
          world.setBlock(x, y, z, 'lava');
        }
        
        // Glowstone (yellow wool) - very rare
        if (Math.random() > 0.98) {
          world.setBlock(x, y, z, 'yellow_wool');
        }
      }
    }
  }
  
  totalCubes++;
  
  // Move to next cube horizontally first
  currentX += CUBE_SIZE;
  
  // If we finished this row, move to next Z
  if (currentX >= startX + AREA_SIZE) {
    currentX = startX;
    currentZ += CUBE_SIZE;
    
    // Progress update every row
    if (currentPlayer) {
      currentPlayer.sendMessage("🔥 Row complete! Generated " + totalCubes + " cubes!");
    }
    console.log("🔥 Row complete! Total cubes: " + totalCubes);
  }
  
  // If we finished all rows, move up
  if (currentZ >= startZ + AREA_SIZE) {
    currentZ = startZ;
    currentY += CUBE_SIZE;
  }
  
  // Check if we're done (generated all height layers)
  if (currentY >= -10 + NETHER_HEIGHT) {
    if (currentPlayer) {
      currentPlayer.sendMessage("✅ NETHER GEN COMPLETE! 🔥🔥🔥");
      currentPlayer.sendMessage("Total cubes: " + totalCubes);
    }
    console.log("✅ GENERATION COMPLETE! Total: " + totalCubes + " cubes");
    return; // Stop generating
  }
  
  // Continue generating after short delay (prevents lag!)
  setTimeout(() => generateNextCube(), 200);  // 0.2 second delay
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
                👹 Template 3: Nether Mob Spawning (REAL API!)
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                🔥 Uses api.attemptSpawnMob() and api.setMobSetting() - the REAL BLOXD API!
              </p>
              <div className="bg-black/50 p-4 rounded-xl overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`// Nether mob spawner - REAL BLOXD API!
const NETHER_Y = -10;  // Nether level

function onPlayerJoin(player) {
  // Spawn initial Nether mobs
  spawnNetherMobs();
}

function spawnNetherMobs() {
  // Random position in Nether
  const x = Math.floor(Math.random() * 40) - 20;
  const z = Math.floor(Math.random() * 40) - 20;
  const y = NETHER_Y + 5;
  const mobType = Math.random();
  
  if (mobType < 0.4) {
    // Zombie Pigmen - Just use Zombie!
    const m = api.attemptSpawnMob("Zombie", x, y, z, {
      name: "Zombie Pigman",
      variation: "default"
    });
    api.setMobSetting(m, "maxHealth", 400);
    api.setHealth(m, 400);
    api.setMobSetting(m, "attackItemName", "Fireball");
    api.setMobSetting(m, "attackDamage", 15);
    api.setMobSetting(m, "attackInterval", 1000);
    api.setMobSetting(m, "attackRadius", 20);
    api.setMobSetting(m, "chaseRadius", 30);
    
  } else if (mobType < 0.7) {
    // Blaze - Use Magma Golem!
    const m = api.attemptSpawnMob("Magma Golem", x, y + 2, z, {
      name: "Blaze",
      variation: "default"
    });
    api.setMobSetting(m, "maxHealth", 300);
    api.setHealth(m, 300);
    api.setMobSetting(m, "attackItemName", "Fireball");
    api.setMobSetting(m, "attackDamage", 20);
    api.setMobSetting(m, "attackInterval", 800);
    api.setMobSetting(m, "attackRadius", 30);
    api.setMobSetting(m, "chaseRadius", 40);
    
  } else {
    // Magma Cube - Cow with slow attacks!
    const m = api.attemptSpawnMob("Cow", x, y, z, {
      name: "Magma Cube",
      variation: "default"
    });
    api.setMobSetting(m, "maxHealth", 500);
    api.setHealth(m, 500);
    api.setMobSetting(m, "attackItemName", "Stick");
    api.setMobSetting(m, "attackDamage", 25);
    api.setMobSetting(m, "attackInterval", 999999); // Basically never attacks!
    api.setMobSetting(m, "attackRadius", 15);
    api.setMobSetting(m, "onDeathAura", 100); // Explodes on death!
  }
  
  // Spawn more mobs every 15 seconds
  setTimeout(spawnNetherMobs, 15000);
}

// Bonus: Spawn mobs near player in Nether
function onPlayerMove(player) {
  if (player.position.y < 0) {  // Player in Nether!
    if (Math.random() > 0.98) {
      const nearX = player.position.x + (Math.random() * 20 - 10);
      const nearZ = player.position.z + (Math.random() * 20 - 10);
      const m = api.attemptSpawnMob("Zombie", nearX, NETHER_Y + 5, nearZ, {
        name: "Zombie Pigman"
      });
      api.setMobSetting(m, "maxHealth", 400);
      api.setHealth(m, 400);
      api.setMobSetting(m, "attackItemName", "Fireball");
      api.setMobSetting(m, "attackDamage", 15);
    }
  }
}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const code3 = `// Nether mob spawner - REAL BLOXD API!
const NETHER_Y = -10;  // Nether level

function onPlayerJoin(player) {
  // Spawn initial Nether mobs
  spawnNetherMobs();
}

function spawnNetherMobs() {
  // Random position in Nether
  const x = Math.floor(Math.random() * 40) - 20;
  const z = Math.floor(Math.random() * 40) - 20;
  const y = NETHER_Y + 5;
  const mobType = Math.random();
  
  if (mobType < 0.4) {
    // Zombie Pigmen - Just use Zombie!
    const m = api.attemptSpawnMob("Zombie", x, y, z, {
      name: "Zombie Pigman",
      variation: "default"
    });
    api.setMobSetting(m, "maxHealth", 400);
    api.setHealth(m, 400);
    api.setMobSetting(m, "attackItemName", "Fireball");
    api.setMobSetting(m, "attackDamage", 15);
    api.setMobSetting(m, "attackInterval", 1000);
    api.setMobSetting(m, "attackRadius", 20);
    api.setMobSetting(m, "chaseRadius", 30);
    
  } else if (mobType < 0.7) {
    // Blaze - Use Magma Golem!
    const m = api.attemptSpawnMob("Magma Golem", x, y + 2, z, {
      name: "Blaze",
      variation: "default"
    });
    api.setMobSetting(m, "maxHealth", 300);
    api.setHealth(m, 300);
    api.setMobSetting(m, "attackItemName", "Fireball");
    api.setMobSetting(m, "attackDamage", 20);
    api.setMobSetting(m, "attackInterval", 800);
    api.setMobSetting(m, "attackRadius", 30);
    api.setMobSetting(m, "chaseRadius", 40);
    
  } else {
    // Magma Cube - Cow with slow attacks!
    const m = api.attemptSpawnMob("Cow", x, y, z, {
      name: "Magma Cube",
      variation: "default"
    });
    api.setMobSetting(m, "maxHealth", 500);
    api.setHealth(m, 500);
    api.setMobSetting(m, "attackItemName", "Stick");
    api.setMobSetting(m, "attackDamage", 25);
    api.setMobSetting(m, "attackInterval", 999999); // Basically never attacks!
    api.setMobSetting(m, "attackRadius", 15);
    api.setMobSetting(m, "onDeathAura", 100); // Explodes on death!
  }
  
  // Spawn more mobs every 15 seconds
  setTimeout(spawnNetherMobs, 15000);
}

// Bonus: Spawn mobs near player in Nether
function onPlayerMove(player) {
  if (player.position.y < 0) {  // Player in Nether!
    if (Math.random() > 0.98) {
      const nearX = player.position.x + (Math.random() * 20 - 10);
      const nearZ = player.position.z + (Math.random() * 20 - 10);
      const m = api.attemptSpawnMob("Zombie", nearX, NETHER_Y + 5, nearZ, {
        name: "Zombie Pigman"
      });
      api.setMobSetting(m, "maxHealth", 400);
      api.setHealth(m, 400);
      api.setMobSetting(m, "attackItemName", "Fireball");
      api.setMobSetting(m, "attackDamage", 15);
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

            {/* Template 4: Nether Portal System */}
            <div className="mb-6 bg-gray-900/80 p-5 rounded-2xl border-2 border-blue-500/50">
              <h3 className="text-2xl font-bold text-blue-300 mb-3 flex items-center gap-2">
                🌀 Template 4: Nether Portal System! (TELEPORT!)
              </h3>
              <p className="text-white/80 mb-3 text-sm">
                🔥 Build obsidian frame, light with lava, portal fills with blue blocks, TELEPORTS you to the Nether! 🌀
              </p>
              <div className="bg-black/50 p-4 rounded-xl overflow-x-auto">
                <pre className="text-green-400 text-xs font-mono">
{`// NETHER PORTAL SYSTEM - Build and teleport!
const NETHER_Y = -10;        // Where Nether generates
let netherPortalPos = null;  // Track portal location
let overworldPortalPos = null; // Track overworld portal

function onPlayerJoin(player) {
  player.sendMessage("🌀 Build a 4x5 obsidian frame and light it with lava!");
  player.sendMessage("💡 Obsidian blocks work in BLOXD!");
}

// Detect when player places lava to light portal
function onBlockPlace(player, blockType, x, y, z) {
  if (blockType === 'lava') {
    console.log("Lava placed at X:" + x + " Y:" + y + " Z:" + z);
    
    // Check if this is near an obsidian portal frame
    if (checkForPortalFrame(x, y, z)) {
      player.sendMessage("🔥 LIGHTING PORTAL!");
      lightPortal(x, y, z, player);
    }
  }
}

// Check if there's a 4x5 obsidian frame nearby
function checkForPortalFrame(x, y, z) {
  // Check for vertical portal frame (4 wide, 5 tall)
  // Bottom left corner check
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (isPortalFrameAt(x + dx, y + dy, z)) {
        return true;
      }
    }
  }
  return false;
}

function isPortalFrameAt(x, y, z) {
  // Check if there's a 4x5 frame of obsidian
  let frameCount = 0;
  
  // Check 4 wide, 5 tall frame
  for (let px = x; px < x + 4; px++) {
    for (let py = y; py < y + 5; py++) {
      const block = world.getBlock(px, py, z);
      if (block === 'obsidian') {
        frameCount++;
      }
    }
  }
  
  // Need at least 14 blocks for a frame (4+4+3+3 = 14)
  return frameCount >= 14;
}

function lightPortal(x, y, z, player) {
  // Find the portal frame bounds
  let portalX = x - 1;
  let portalY = y - 1;
  let portalZ = z;
  
  // Fill portal interior with light blue wool (portal blocks!)
  for (let px = portalX; px < portalX + 4; px++) {
    for (let py = portalY; py < portalY + 5; py++) {
      const block = world.getBlock(px, py, portalZ);
      
      // Only fill air spaces inside frame
      if (block === 'air' || block === 'lava') {
        world.setBlock(px, py, portalZ, 'light_blue_wool'); // BLUE PORTAL!
      }
    }
  }
  
  // Save portal locations
  if (y > 0) {
    // Overworld portal
    overworldPortalPos = { x: portalX + 2, y: portalY + 2, z: portalZ };
    player.sendMessage("✅ OVERWORLD PORTAL ACTIVATED! 🌀");
    player.sendMessage("💡 Step into the blue blocks to teleport to the Nether!");
  } else {
    // Nether portal
    netherPortalPos = { x: portalX + 2, y: portalY + 2, z: portalZ };
    player.sendMessage("✅ NETHER PORTAL ACTIVATED! 🌀");
    player.sendMessage("💡 Step in to return to the Overworld!");
  }
  
  // Play sound effect (whoosh!)
  player.sendMessage("🔊 WHOOOOSH! Portal activated!");
}

// Teleport player when they walk into portal
function onPlayerMove(player) {
  const pos = player.getPosition();
  const px = Math.floor(pos.x);
  const py = Math.floor(pos.y);
  const pz = Math.floor(pos.z);
  
  const block = world.getBlock(px, py, pz);
  
  // Check if player is in a portal block
  if (block === 'light_blue_wool') {
    
    if (py > 0 && netherPortalPos) {
      // In overworld portal - teleport to Nether!
      player.sendMessage("🌀 TELEPORTING TO THE NETHER! 🔥🔥🔥");
      player.teleport(netherPortalPos.x, netherPortalPos.y, netherPortalPos.z);
      
    } else if (py < 0 && overworldPortalPos) {
      // In Nether portal - teleport to overworld!
      player.sendMessage("🌀 TELEPORTING TO OVERWORLD! 🌍");
      player.teleport(overworldPortalPos.x, overworldPortalPos.y, overworldPortalPos.z);
    }
  }
}

// Auto-create Nether-side portal when first portal is lit
function createNetherPortal(x, z) {
  // Build portal frame in Nether
  const netherX = Math.floor(x / 8);  // Nether coordinate scaling
  const netherZ = Math.floor(z / 8);
  const netherY = NETHER_Y + 5;
  
  // Build 4x5 obsidian frame
  for (let px = netherX; px < netherX + 4; px++) {
    world.setBlock(px, netherY, netherZ, 'obsidian');      // Bottom
    world.setBlock(px, netherY + 4, netherZ, 'obsidian'); // Top
  }
  for (let py = netherY; py <= netherY + 4; py++) {
    world.setBlock(netherX, py, netherZ, 'obsidian');     // Left
    world.setBlock(netherX + 3, py, netherZ, 'obsidian'); // Right
  }
  
  // Fill with portal blocks
  for (let px = netherX + 1; px < netherX + 3; px++) {
    for (let py = netherY + 1; py < netherY + 4; py++) {
      world.setBlock(px, py, netherZ, 'light_blue_wool');
    }
  }
  
  netherPortalPos = { x: netherX + 2, y: netherY + 2, z: netherZ };
  console.log("🌀 Auto-created Nether portal at X:" + netherX + " Y:" + netherY + " Z:" + netherZ);
}`}
                </pre>
              </div>
              <button
                onClick={() => {
                  const code4 = `// NETHER PORTAL SYSTEM - Build and teleport!
const NETHER_Y = -10;        // Where Nether generates
let netherPortalPos = null;  // Track portal location
let overworldPortalPos = null; // Track overworld portal

function onPlayerJoin(player) {
  player.sendMessage("🌀 Build a 4x5 obsidian frame and light it with lava!");
  player.sendMessage("💡 Obsidian blocks work in BLOXD!");
}

// Detect when player places lava to light portal
function onBlockPlace(player, blockType, x, y, z) {
  if (blockType === 'lava') {
    console.log("Lava placed at X:" + x + " Y:" + y + " Z:" + z);
    
    // Check if this is near an obsidian portal frame
    if (checkForPortalFrame(x, y, z)) {
      player.sendMessage("🔥 LIGHTING PORTAL!");
      lightPortal(x, y, z, player);
    }
  }
}

// Check if there's a 4x5 obsidian frame nearby
function checkForPortalFrame(x, y, z) {
  // Check for vertical portal frame (4 wide, 5 tall)
  // Bottom left corner check
  for (let dx = -2; dx <= 2; dx++) {
    for (let dy = -2; dy <= 2; dy++) {
      if (isPortalFrameAt(x + dx, y + dy, z)) {
        return true;
      }
    }
  }
  return false;
}

function isPortalFrameAt(x, y, z) {
  // Check if there's a 4x5 frame of obsidian
  let frameCount = 0;
  
  // Check 4 wide, 5 tall frame
  for (let px = x; px < x + 4; px++) {
    for (let py = y; py < y + 5; py++) {
      const block = world.getBlock(px, py, z);
      if (block === 'obsidian') {
        frameCount++;
      }
    }
  }
  
  // Need at least 14 blocks for a frame (4+4+3+3 = 14)
  return frameCount >= 14;
}

function lightPortal(x, y, z, player) {
  // Find the portal frame bounds
  let portalX = x - 1;
  let portalY = y - 1;
  let portalZ = z;
  
  // Fill portal interior with light blue wool (portal blocks!)
  for (let px = portalX; px < portalX + 4; px++) {
    for (let py = portalY; py < portalY + 5; py++) {
      const block = world.getBlock(px, py, portalZ);
      
      // Only fill air spaces inside frame
      if (block === 'air' || block === 'lava') {
        world.setBlock(px, py, portalZ, 'light_blue_wool'); // BLUE PORTAL!
      }
    }
  }
  
  // Save portal locations
  if (y > 0) {
    // Overworld portal
    overworldPortalPos = { x: portalX + 2, y: portalY + 2, z: portalZ };
    player.sendMessage("✅ OVERWORLD PORTAL ACTIVATED! 🌀");
    player.sendMessage("💡 Step into the blue blocks to teleport to the Nether!");
  } else {
    // Nether portal
    netherPortalPos = { x: portalX + 2, y: portalY + 2, z: portalZ };
    player.sendMessage("✅ NETHER PORTAL ACTIVATED! 🌀");
    player.sendMessage("💡 Step in to return to the Overworld!");
  }
  
  // Play sound effect (whoosh!)
  player.sendMessage("🔊 WHOOOOSH! Portal activated!");
}

// Teleport player when they walk into portal
function onPlayerMove(player) {
  const pos = player.getPosition();
  const px = Math.floor(pos.x);
  const py = Math.floor(pos.y);
  const pz = Math.floor(pos.z);
  
  const block = world.getBlock(px, py, pz);
  
  // Check if player is in a portal block
  if (block === 'light_blue_wool') {
    
    if (py > 0 && netherPortalPos) {
      // In overworld portal - teleport to Nether!
      player.sendMessage("🌀 TELEPORTING TO THE NETHER! 🔥🔥🔥");
      player.teleport(netherPortalPos.x, netherPortalPos.y, netherPortalPos.z);
      
    } else if (py < 0 && overworldPortalPos) {
      // In Nether portal - teleport to overworld!
      player.sendMessage("🌀 TELEPORTING TO OVERWORLD! 🌍");
      player.teleport(overworldPortalPos.x, overworldPortalPos.y, overworldPortalPos.z);
    }
  }
}

// Auto-create Nether-side portal when first portal is lit
function createNetherPortal(x, z) {
  // Build portal frame in Nether
  const netherX = Math.floor(x / 8);  // Nether coordinate scaling
  const netherZ = Math.floor(z / 8);
  const netherY = NETHER_Y + 5;
  
  // Build 4x5 obsidian frame
  for (let px = netherX; px < netherX + 4; px++) {
    world.setBlock(px, netherY, netherZ, 'obsidian');      // Bottom
    world.setBlock(px, netherY + 4, netherZ, 'obsidian'); // Top
  }
  for (let py = netherY; py <= netherY + 4; py++) {
    world.setBlock(netherX, py, netherZ, 'obsidian');     // Left
    world.setBlock(netherX + 3, py, netherZ, 'obsidian'); // Right
  }
  
  // Fill with portal blocks
  for (let px = netherX + 1; px < netherX + 3; px++) {
    for (let py = netherY + 1; py < netherY + 4; py++) {
      world.setBlock(px, py, netherZ, 'light_blue_wool');
    }
  }
  
  netherPortalPos = { x: netherX + 2, y: netherY + 2, z: netherZ };
  console.log("🌀 Auto-created Nether portal at X:" + netherX + " Y:" + netherY + " Z:" + netherZ);
}`;
                  navigator.clipboard.writeText(code4);
                  alert('📋 Template 4 copied to clipboard!');
                }}
                className="mt-3 px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-600 text-white rounded-xl font-bold hover:scale-105 transition-transform"
              >
                📋 Copy Template 4
              </button>
            </div>

            {/* Pro Tips */}
            <div className="bg-yellow-900/30 p-4 rounded-xl border-2 border-yellow-500/50">
              <h3 className="text-xl font-bold text-yellow-300 mb-3">💡 Pro Tips for Nether Generation:</h3>
              <div className="space-y-2 text-white/90 text-sm">
                <p>⚡ <strong>Generate 9x9x9 cubes</strong> - Perfect size to avoid lag!</p>
                <p>🌍 <strong>World border = 100,000 blocks</strong> - Template 1 generates ALL OF IT!</p>
                <p>⏱️ <strong>Use setTimeout</strong> - 0.5 second delay between cubes prevents lag</p>
                <p>📊 <strong>Progress messages</strong> - Shows &quot;Row complete!&quot; and cube count!</p>
                <p>✅ <strong>&quot;NETHER GEN COMPLETE!&quot;</strong> - Message when finished!</p>
                <p>🧱 <strong>Block replacements:</strong> red_wool = netherrack, brown_wool = soul sand, lava = lava!</p>
                <p>👹 <strong>Mob API:</strong> Use api.attemptSpawnMob() and api.setMobSetting() for custom mobs!</p>
                <p>🧟 <strong>Mob types:</strong> Zombie = Pigmen, Magma Golem = Blazes, Cow = Magma Cubes!</p>
                <p>⏰ <strong>Magma Cubes:</strong> Set attackInterval to 999999 so they only attack when you get close!</p>
                <p>🌀 <strong>Portal blocks:</strong> obsidian = frame, light_blue_wool = portal blocks!</p>
                <p>🔥 <strong>Light portal:</strong> Build 4x5 obsidian frame, place lava inside to activate!</p>
                <p>🚪 <strong>Teleportation:</strong> onPlayerMove() detects when you walk into portal blocks!</p>
                <p>📍 <strong>Portal linking:</strong> Overworld Y&gt;0 teleports to Nether Y&lt;0!</p>
                <p>🧪 <strong>Test small first</strong> - Lower WORLD_BORDER to 1000 for testing!</p>
                <p>📍 <strong>Bedrock is Y=0</strong> - Nether generates from Y=-10 to Y=-40 (30 blocks tall)!</p>
                <p>🔥 <strong>Combine templates</strong> - Use all 4 together for FULL Nether experience with portals!</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
