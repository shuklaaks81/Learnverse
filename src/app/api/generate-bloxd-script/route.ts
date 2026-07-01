import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { prompt, mode = "world", conversationHistory = "", previousCode = "" } = await req.json();

    if (!prompt) {
      return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
    }

    // Read the Bloxd API docs
    const apiDocsPath = path.join(process.cwd(), "bloxd-api-docs");
    const apiReference = fs.readFileSync(
      path.join(apiDocsPath, "API_REFERENCE.md"),
      "utf-8"
    );
    
    const blockNames = fs.readFileSync(
      path.join(apiDocsPath, "BLOCK_NAMES.txt"),
      "utf-8"
    );
    
    const itemNames = fs.readFileSync(
      path.join(apiDocsPath, "ITEM_NAMES.txt"),
      "utf-8"
    );

    const groqApiKey = process.env.GROQ_API_KEY;
    
    if (!groqApiKey) {
      return NextResponse.json(
        { error: "Groq API key not configured" },
        { status: 500 }
      );
    }

    // STEP 1: Understanding Phase - Figure out what user wants
    const understandingPrompt = `You are analyzing a Bloxd.io script request. Break down what the user wants into clear requirements.

${conversationHistory ? `Previous Conversation:\n${conversationHistory}\n` : ""}
${previousCode ? `Previous Code:\n\`\`\`\n${previousCode.slice(0, 500)}...\n\`\`\`\n` : ""}

User Request: "${prompt}"

Respond with:
1. What they want to create/fix
2. Key features needed
3. Which Bloxd.io APIs would be useful

Be concise and technical.`;

    const understandingResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: understandingPrompt }],
          temperature: 0.3,
          max_tokens: 500,
        }),
      }
    );

    if (!understandingResponse.ok) {
      const errorData = await understandingResponse.json();
      console.error("Groq understanding error:", errorData);
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
    }

    const understandingData = await understandingResponse.json();
    const analysis = understandingData.choices[0]?.message?.content || "";

    // STEP 2: Code Generation Phase with API docs
    const modeInstructions = mode === "codeblock" 
      ? `
CODE BLOCK MODE: Generate COMPACT code for use in Bloxd code blocks.
- Keep it SHORT (under 50 lines)
- Focus on ONE specific action
- NO CALLBACKS! Code blocks can't use tick(), onPlayerJoin, etc.
- Code runs ONCE when triggered (button press, player touch, etc.)
- No complex world setups
- Use simple effects/sounds
- Perfect for buttons, triggers, simple actions
Example: A button that gives items, spawns one entity, plays sound, teleports player.
CRITICAL: DO NOT include tick, onPlayerJoin, onPlayerChat, or any callbacks!
`
      : `
WORLD CODE MODE: Generate FULL world scripts with complete setups.
- Can be ANY length needed
- CAN use callbacks: tick, onPlayerJoin, onPlayerChat, etc.
- Full world initialization
- Multiple features/systems
- Complex player interactions
- Terrain generation, multiple entities, full game mechanics
Example: Complete minigames, adventure worlds, full survival systems, etc.
`;

    const codeGenPrompt = `You are an expert Bloxd.io script developer. Generate working JavaScript code based on the requirements.

${modeInstructions}

Requirements Analysis:
${analysis}

CRITICAL RULES:
1. ONLY use functions from the official API documentation below
2. Check spelling carefully - use exact function names
3. Include all required parameters for each function
4. Add comments explaining what the code does
5. Use proper JavaScript syntax
6. Handle entity IDs, player IDs correctly
7. Initialize variables before use
8. DO NOT use setTimeout, setInterval, or Promise delays - they are NOT allowed in Bloxd!
9. For timing/delays, use the tick() callback which runs 20 times per second
10. Use tick counters for delays: let counter = 0; in tick: counter++; if(counter >= 20) { /* 1 second passed */ }
11. BLOCKS and ITEMS are DIFFERENT! Check the lists below:
    - Use BLOCK names (like "grass", "stone") for setBlock(), getBlock() functions
    - Use ITEM names (like "moonstone", "diamond_sword") for givePlayerItem(), inventory functions
    - NEVER mix them up or the script will break!
    
EXAMPLES TO PREVENT CONFUSION:
BLOCKS (for setBlock, getBlock, world terrain):
  - "Stone", "Dirt", "Grass Block", "Sand", "Maple Log"
ITEMS (for givePlayerItem, inventory, tools/weapons):
  - "Moonstone Pickaxe", "Diamond Sword", "Iron Helmet", "Wood Axe"
  
If user asks for "moonstone" they probably want "Moonstone Pickaxe" (ITEM), NOT a block!
If user asks to "place stone" use "Stone" (BLOCK), NOT an item!

Official Bloxd.io API Documentation (Key Functions):
${apiReference.slice(0, 15000)}

IMPORTANT - Timing in Bloxd:
Use the tick() callback for all timing needs. It runs 20 times/second.
Callbacks are assigned DIRECTLY, not as properties!
Example:
let tickCounter = 0;
tick = ({ ms }) => {
  tickCounter++;
  if (tickCounter >= 20) { // 1 second passed
    // Do something
    tickCounter = 0; // Reset
  }
};

Common Callbacks (use these exact names):
- tick = () => {} // Runs 20 times/second
- onPlayerChangeBlock = () => {} // When player places/breaks block
- onPlayerJoin = () => {} // When player joins
- onPlayerChat = () => {} // When player chats
- onPlayerAttack = () => {} // When player attacks
DO NOT use "world.tick" or "world.onPlayerChangeBlock" - just "tick" and "onPlayerChangeBlock" directly!

Available Blocks: ${blockNames.slice(0, 1000)}
Available Items: ${itemNames.slice(0, 1000)}

Generate clean, working code with proper error handling. Return ONLY the JavaScript code, no explanations.`;

    const codeGenResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: codeGenPrompt }],
          temperature: 0.5,
          max_tokens: 2000,
        }),
      }
    );

    if (!codeGenResponse.ok) {
      const errorData = await codeGenResponse.json();
      console.error("Groq code gen error:", errorData);
      throw new Error(`Groq API error: ${JSON.stringify(errorData)}`);
    }

    const codeGenData = await codeGenResponse.json();
    let generatedCode = codeGenData.choices[0]?.message?.content || "";

    // Clean up code markers
    if (generatedCode.includes("```javascript")) {
      generatedCode = generatedCode.split("```javascript")[1].split("```")[0].trim();
    } else if (generatedCode.includes("```js")) {
      generatedCode = generatedCode.split("```js")[1].split("```")[0].trim();
    } else if (generatedCode.includes("```")) {
      generatedCode = generatedCode.split("```")[1].split("```")[0].trim();
    }

    // STEP 3: Error Checking & Auto-Fix Phase
    const errorCheckPrompt = `You are a Bloxd.io code validator. Check this code for common errors and fix them.

Code to validate:
\`\`\`javascript
${generatedCode}
\`\`\`

Check for:
1. Typos in function names (compare to API docs)
2. Missing required parameters
3. Undefined variables
4. Type errors (string vs number)
5. Missing semicolons or brackets
6. Incorrect API usage

If you find errors, return the FIXED code. If no errors, return the original code.
Return ONLY the JavaScript code, no explanations.

API Reference for validation:
${apiReference.slice(0, 8000)}`;

    const errorCheckResponse = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [{ role: "user", content: errorCheckPrompt }],
          temperature: 0.2,
          max_tokens: 2000,
        }),
      }
    );

    if (!errorCheckResponse.ok) {
      const errorData = await errorCheckResponse.json();
      console.error("Groq error check error:", errorData);
      // If error checking fails, just return the generated code
      return NextResponse.json({ 
        code: generatedCode,
        hadErrors: false
      });
    }

    const errorCheckData = await errorCheckResponse.json();
    let finalCode = errorCheckData.choices[0]?.message?.content || generatedCode;

    // Clean up final code
    if (finalCode.includes("```javascript")) {
      finalCode = finalCode.split("```javascript")[1].split("```")[0].trim();
    } else if (finalCode.includes("```js")) {
      finalCode = finalCode.split("```js")[1].split("```")[0].trim();
    } else if (finalCode.includes("```")) {
      finalCode = finalCode.split("```")[1].split("```")[0].trim();
    }

    const hadErrors = finalCode !== generatedCode;

    // STEP 4: Dry Run Validation - Check for common logic issues
    const warnings: string[] = [];
    
    // Check for setTimeout/setInterval (common mistake)
    if (finalCode.includes("setTimeout") || finalCode.includes("setInterval")) {
      warnings.push("Found setTimeout/setInterval - Bloxd doesn't allow these! Use tick() callback instead.");
    }
    
    // Check for world.callback instead of just callback
    if (finalCode.includes("world.tick") || finalCode.includes("world.on")) {
      warnings.push("Found 'world.callback' syntax - should be just 'tick = () => {}' directly!");
    }
    
    // Check if trying to use items as blocks
    const itemKeywords = ["pickaxe", "sword", "axe", "helmet", "chestplate", "boots", "leggings"];
    const blockFunctions = ["setBlock", "getBlock"];
    for (const item of itemKeywords) {
      for (const func of blockFunctions) {
        if (finalCode.toLowerCase().includes(item) && finalCode.includes(func)) {
          warnings.push(`Possible issue: Using item name near ${func}() - make sure you're using BLOCK names, not ITEM names!`);
          break;
        }
      }
    }
    
    // Check for undefined variable usage (simple check)
    const varDeclarations = finalCode.match(/(?:let|const|var)\s+(\w+)/g) || [];
    const declaredVars = varDeclarations.map((d: string) => d.split(/\s+/)[1]);
    const usedVars = finalCode.match(/\b[a-zA-Z_]\w*\b/g) || [];
    const potentialUndefined = usedVars.filter((v: string) => 
      !declaredVars.includes(v) && 
      !['tick', 'onPlayerClick', 'onPlayerChangeBlock', 'console', 'api', 'world'].includes(v)
    );
    if (potentialUndefined.length > 3) {
      warnings.push("Some variables might be used before being declared - double-check your variable definitions!");
    }

    return NextResponse.json({ 
      code: finalCode,
      hadErrors: hadErrors,
      warnings: warnings
    });
  } catch (error) {
    console.error("Error generating script:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Full error details:", errorMessage);
    return NextResponse.json(
      { error: `Generation failed: ${errorMessage}` },
      { status: 500 }
    );
  }
}
