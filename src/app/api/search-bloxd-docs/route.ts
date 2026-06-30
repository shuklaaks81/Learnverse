import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST(req: NextRequest) {
  try {
    const { query } = await req.json();

    if (!query) {
      return NextResponse.json({ error: "Query is required" }, { status: 400 });
    }

    const apiDocsPath = path.join(process.cwd(), "bloxd-api-docs");
    const results: string[] = [];

    // Search through all API doc files
    const files = [
      "API_REFERENCE.md",
      "CALLBACKS.md",
      "BLOCK_NAMES.txt",
      "ITEM_NAMES.txt",
      "ENTITY_SETTINGS.md",
      "MOB_SETTINGS.md",
      "PARTICLES.md",
      "SOUNDS_AND_MUSIC.md"
    ];

    const searchTerm = query.toLowerCase();

    for (const file of files) {
      try {
        const filePath = path.join(apiDocsPath, file);
        const content = fs.readFileSync(filePath, "utf-8");
        const lines = content.split("\n");

        // Find matching lines
        for (let i = 0; i < lines.length; i++) {
          const line = lines[i];
          if (line.toLowerCase().includes(searchTerm)) {
            // Get context (line before and after)
            const context = [];
            if (i > 0) context.push(lines[i - 1]);
            context.push(`➡️ ${line}`);
            if (i < lines.length - 1) context.push(lines[i + 1]);

            results.push(`📄 ${file}:\n${context.join("\n")}`);

            // Limit results per file
            if (results.length >= 10) break;
          }
        }
      } catch (err) {
        console.error(`Error reading ${file}:`, err);
      }

      if (results.length >= 10) break;
    }

    if (results.length === 0) {
      results.push("❌ No results found. Try different keywords!");
    }

    return NextResponse.json({ results });
  } catch (error) {
    console.error("Search error:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
