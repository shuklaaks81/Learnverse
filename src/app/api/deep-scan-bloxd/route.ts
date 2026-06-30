import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { code } = await req.json();

    if (!code) {
      return NextResponse.json({ error: "Code is required" }, { status: 400 });
    }

    const issues: Array<{type: "error" | "warning" | "info"; message: string}> = [];

    // Load API docs for validation
    const apiDocsPath = path.join(process.cwd(), "bloxd-api-docs");
    const apiReference = fs.readFileSync(
      path.join(apiDocsPath, "API_REFERENCE.md"),
      "utf-8"
    );
    const callbacks = fs.readFileSync(
      path.join(apiDocsPath, "CALLBACKS.md"),
      "utf-8"
    );

    // 1. Check for setTimeout/setInterval
    if (code.includes("setTimeout") || code.includes("setInterval")) {
      issues.push({
        type: "error",
        message: "setTimeout/setInterval are NOT allowed in Bloxd! Use tick() callback for timing."
      });
    }

    // 2. Check for common callback mistakes
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

    // 3. Check for undefined variables
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
        // Skip obvious JS built-ins
        const builtIns = ["console", "Math", "parseInt", "parseFloat", "String", "Number", "Array", "Object"];
        if (builtIns.includes(funcName)) return;

        // Check if function exists in API docs
        if (!apiReference.includes(funcName) && !callbacks.includes(funcName)) {
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

    return NextResponse.json({ issues });
  } catch (error) {
    console.error("Deep scan error:", error);
    return NextResponse.json(
      { error: "Scan failed" },
      { status: 500 }
    );
  }
}
