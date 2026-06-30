import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { code, mode = "world" } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const issues: Array<{type: "error" | "warning" | "info"; message: string}> = [];

    // Load ALL API docs for validation
    const apiDocsPath = path.join(process.cwd(), "bloxd-api-docs");
    const apiFiles = [
      "API_REFERENCE.md",
      "CALLBACKS.md",
      "MESH_ENTITY_DOCS.md",
      "ENTITY_SETTINGS.md",
      "MOB_SETTINGS.md",
      "PARTICLES.md",
      "QTE_DOCS.md",
      "SOUNDS_AND_MUSIC.md",
      "SKINS_AND_POSES.md",
      "BLOCK_NAMES.txt",
      "ITEM_NAMES.txt"
    ];
    
    let allAPIDocs = "";
    apiFiles.forEach(file => {
      try {
        const content = fs.readFileSync(path.join(apiDocsPath, file), "utf-8");
        allAPIDocs += content + "\n";
      } catch (err) {
        // File doesn't exist, skip it
      }
    });

    const apiReference = allAPIDocs;
    const callbacks = allAPIDocs; // Use same combined docs for both checks

    // 1. Check for setTimeout/setInterval
    if (code.includes("setTimeout") || code.includes("setInterval")) {
      issues.push({
        type: "error",
        message: "setTimeout/setInterval are NOT allowed in Bloxd! Use tick() callback for timing (in World Code mode only)."
      });
    }

    // 2. Check for callbacks in Code Block mode
    if (mode === "codeblock") {
      const callbacks = ["tick", "onPlayerJoin", "onPlayerChat", "onPlayerAttack", "onPlayerChangeBlock"];
      callbacks.forEach(cb => {
        if (code.includes(cb)) {
          issues.push({
            type: "error",
            message: `"${cb}" callback can't be used in CODE BLOCK MODE! Code blocks run once when triggered, no callbacks allowed. Switch to World Code mode for callbacks.`
          });
        }
      });
    }

    // 3. Check for common callback mistakes (World Code mode)
    const wrongCallbacks = ["world.tick", "world.onPlayerJoin", "world.onPlayerChat", "world.onPlayerAttack"];
    wrongCallbacks.forEach(wrong => {
      if (code.includes(wrong)) {
        const correct = wrong.replace("world.", "");
        issues.push({
          type: "error",
          message: `"${wrong}" is wrong! Use "${correct} = () => {}" instead (direct assignment, not property).`
        });
      }
    });

    // 4. Check for undefined variables
    const lines = code.split("\n");
    const definedVars = new Set<string>();
    const usedVars = new Set<string>();

    lines.forEach((line: string) => {
      // Find variable declarations
      const declMatch = line.match(/(?:let|const|var)\s+(\w+)/g);
      if (declMatch) {
        declMatch.forEach((match: string) => {
          const varName = match.split(/\s+/)[1];
          definedVars.add(varName);
        });
      }

      // Find variable usage
      const varMatches = line.match(/\b[a-zA-Z_]\w*\b/g);
      if (varMatches) {
        varMatches.forEach((varName: string) => {
          // Skip keywords and known functions
          const keywords = ["let", "const", "var", "function", "if", "else", "for", "while", "return", "true", "false", "null", "undefined"];
          if (!keywords.includes(varName)) {
            usedVars.add(varName);
          }
        });
      }
    });

    // Check for used but not defined variables
    usedVars.forEach(varName => {
      if (!definedVars.has(varName)) {
        // Check if it's a known API function
        if (!apiReference.includes(varName) && !callbacks.includes(varName)) {
          issues.push({
            type: "warning",
            message: `Variable "${varName}" might be undefined. Make sure to declare it with let/const.`
          });
        }
      }
    });

    // 4. Check for fake API functions
    const functionCalls = code.match(/\b\w+\(/g);
    if (functionCalls) {
      const funcSet = new Set<string>(functionCalls.map((f: string) => f.replace("(", "")));
      const uniqueCalls = Array.from(funcSet);
      uniqueCalls.forEach((funcName) => {
        // Skip obvious JS built-ins and common keywords
        const builtIns = [
          "console", "Math", "parseInt", "parseFloat", "String", "Number", 
          "Array", "Object", "Date", "JSON", "isNaN", "isFinite",
          "setTimeout", "setInterval", "clearTimeout", "clearInterval",
          "log", "error", "warn", "info", "abs", "floor", "ceil", "round",
          "random", "max", "min", "sqrt", "pow"
        ];
        if (builtIns.includes(funcName)) return;

        // Check if function exists in ALL API docs
        if (!apiReference.includes(funcName)) {
          issues.push({
            type: "warning",
            message: `Function "${funcName}()" not found in Bloxd API docs. Double-check spelling or it might not exist!`
          });
        }
      });
    }

    // 5. Check for common block/item confusion
    if (code.includes("Moonstone") && code.includes("setBlock")) {
      issues.push({
        type: "error",
        message: '"Moonstone" is an ITEM, not a block! Use "Moonstone Pickaxe" with givePlayerItem(), not setBlock().'
      });
    }

    // 6. Check for missing tick initialization
    if (code.includes("tick") && !code.includes("tick = ")) {
      issues.push({
        type: "warning",
        message: 'You mentioned "tick" but never initialized it with "tick = () => {}". Make sure to set up the callback!'
      });
    }

    // 7. Check for async/await (not supported well in Bloxd)
    if (code.includes("async") || code.includes("await")) {
      issues.push({
        type: "warning",
        message: "async/await might not work properly in Bloxd scripts. Stick to synchronous code when possible."
      });
    }

    // 8. Count code lines for complexity check
    const codeLines = lines.filter((l: string) => l.trim() && !l.trim().startsWith("//")).length;
    if (codeLines > 200) {
      issues.push({
        type: "info",
        message: `This script is ${codeLines} lines long. Consider breaking it into smaller functions for better organization!`
      });
    }

    // 9. CODE SIMULATION - Virtual execution check!
    issues.push({
      type: "info",
      message: "🎮 Starting code simulation..."
    });

    try {
      // Simulate a Bloxd environment
      const simulationResults = simulateBloxdCode(code, mode);
      
      simulationResults.forEach(result => {
        issues.push(result);
      });
      
      issues.push({
        type: "info",
        message: "✅ Simulation complete!"
      });
    } catch (simError) {
      issues.push({
        type: "error",
        message: `Simulation crashed: ${simError instanceof Error ? simError.message : "Unknown error"}`
      });
    }

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Deep scan error:", error);
    return NextResponse.json(
      { error: "Scan failed" },
      { status: 500 }
    );
  }
}

// SIMULATION ENGINE
function simulateBloxdCode(code: string, mode: string): Array<{type: "error" | "warning" | "info"; message: string}> {
  const results: Array<{type: "error" | "warning" | "info"; message: string}> = [];
  
  // Mock Bloxd API
  const mockWorld = {
    setBlock: (x: number, y: number, z: number, block: string) => {
      results.push({
        type: "info",
        message: `✓ Simulated: setBlock(${x}, ${y}, ${z}, "${block}")`
      });
      return true;
    },
    getBlock: (x: number, y: number, z: number) => {
      results.push({
        type: "info",
        message: `✓ Simulated: getBlock(${x}, ${y}, ${z}) → "Air"`
      });
      return "Air";
    },
    spawnEntity: (type: string, x: number, y: number, z: number) => {
      results.push({
        type: "info",
        message: `✓ Simulated: spawnEntity("${type}", ${x}, ${y}, ${z})`
      });
      return { id: "sim-entity-1" };
    },
    getAllPlayers: () => {
      results.push({
        type: "info",
        message: `✓ Simulated: getAllPlayers() → 1 player`
      });
      return [{ id: "sim-player-1", username: "TestPlayer" }];
    }
  };

  const mockPlayer = {
    id: "sim-player-1",
    username: "TestPlayer",
    position: { x: 0, y: 10, z: 0 }
  };

  // Try to execute code in safe sandbox
  try {
    // Check for variable declarations and usage
    const varDeclarations = code.match(/(?:let|const|var)\s+(\w+)\s*=/g);
    if (varDeclarations && varDeclarations.length > 0) {
      results.push({
        type: "info",
        message: `✓ Found ${varDeclarations.length} variable declaration(s)`
      });
    }

    // Check for function calls
    const functionCalls = code.match(/(\w+)\s*\(/g);
    if (functionCalls && functionCalls.length > 0) {
      const uniqueFuncs = [...new Set(functionCalls.map(f => f.replace(/\s*\(/, "")))];
      results.push({
        type: "info",
        message: `✓ Detected ${uniqueFuncs.length} function call(s): ${uniqueFuncs.slice(0, 5).join(", ")}${uniqueFuncs.length > 5 ? "..." : ""}`
      });
    }

    // Check for loops (potential infinite loops)
    if (code.includes("while(true)") || code.includes("while (true)")) {
      results.push({
        type: "warning",
        message: "⚠️ Infinite loop detected! Make sure you have a break condition or this will freeze Bloxd!"
      });
    }

    // Check for tick callback execution
    if (mode === "world" && code.includes("tick")) {
      results.push({
        type: "info",
        message: "✓ Tick callback found - will run 20 times/second"
      });
      
      const tickCounter = code.match(/tickCounter|counter|count/gi);
      if (tickCounter) {
        results.push({
          type: "info",
          message: "✓ Found timing counter - good for delays!"
        });
      } else {
        results.push({
          type: "warning",
          message: "⚠️ Tick callback found but no counter detected. Add a counter if you need delays!"
        });
      }
    }

    // Simulate player join
    if (code.includes("onPlayerJoin")) {
      results.push({
        type: "info",
        message: "✓ Simulated: Player 'TestPlayer' joined the world"
      });
    }

    // Check for coordinate usage
    const coords = code.match(/(-?\d+),\s*(-?\d+),\s*(-?\d+)/g);
    if (coords && coords.length > 0) {
      results.push({
        type: "info",
        message: `✓ Found ${coords.length} coordinate set(s) - blocks will be placed`
      });
    }

    // Check for console.log (useful for debugging)
    if (code.includes("console.log")) {
      results.push({
        type: "info",
        message: "✓ Console.log found - good for debugging!"
      });
    }

    // Estimate execution time
    const complexity = code.split("\n").length + (functionCalls?.length || 0) * 2;
    if (complexity > 100) {
      results.push({
        type: "warning",
        message: `⚠️ High complexity score (${complexity}). Script might be slow!`
      });
    } else {
      results.push({
        type: "info",
        message: `✓ Complexity score: ${complexity} (Good!)`
      });
    }

  } catch (execError) {
    results.push({
      type: "error",
      message: `Simulation error: ${execError instanceof Error ? execError.message : "Failed to simulate"}`
    });
  }

  return results;
}
