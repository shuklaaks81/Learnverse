/**
 * Page Generator AI Agent
 * Takes visual design data and generates working React components
 * Uses CodeLlama to intelligently convert designs into code
 */

import { LLMClient, MODELS } from '@/utils/llm-client';

export interface DesignElement {
  type: 'shape' | 'text' | 'button' | 'image' | 'input';
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  content?: string;
  style?: {
    color?: string;
    backgroundColor?: string;
    fontSize?: number;
    fontWeight?: string;
    borderRadius?: number;
    shape?: 'rectangle' | 'circle' | 'triangle' | 'star';
  };
  action?: string; // For buttons: what happens when clicked
}

export interface PageDesign {
  elements: DesignElement[];
  backgroundColor?: string;
  title: string;
  description?: string;
}

export interface GeneratedPage {
  componentCode: string;
  preview: string; // HTML preview for quick display
  metadata: {
    elementsUsed: number;
    complexity: 'simple' | 'medium' | 'complex';
    estimatedSize: string;
    warnings?: string[];
  };
}

export class PageGeneratorAgent {
  private llm: LLMClient;

  constructor() {
    this.llm = new LLMClient();
  }

  /**
   * Main method: Generate a React component from design data
   */
  async generatePage(design: PageDesign): Promise<GeneratedPage> {
    console.log('🤖 AI Agent: Starting page generation...');
    
    // Step 1: Analyze the design
    const analysis = this.analyzeDesign(design);
    console.log('📊 Design analysis:', analysis);

    // Step 2: Create smart layout hints
    const layoutHints = this.generateLayoutHints(design);
    console.log('🎨 Layout hints:', layoutHints);

    // Step 3: Use AI to generate the component
    const componentCode = await this.generateComponentWithAI(design, layoutHints);
    console.log('✅ Component generated!');

    // Step 4: Generate HTML preview
    const preview = this.generateHTMLPreview(design);

    return {
      componentCode,
      preview,
      metadata: {
        elementsUsed: design.elements.length,
        complexity: analysis.complexity,
        estimatedSize: `${Math.round(componentCode.length / 1024)}KB`,
        warnings: analysis.warnings,
      },
    };
  }

  /**
   * Analyze design complexity and provide warnings
   */
  private analyzeDesign(design: PageDesign): {
    complexity: 'simple' | 'medium' | 'complex';
    warnings: string[];
  } {
    const elementCount = design.elements.length;
    const warnings: string[] = [];

    // Check for overlapping elements
    for (let i = 0; i < design.elements.length; i++) {
      for (let j = i + 1; j < design.elements.length; j++) {
        if (this.elementsOverlap(design.elements[i], design.elements[j])) {
          warnings.push(`Elements ${design.elements[i].id} and ${design.elements[j].id} overlap`);
        }
      }
    }

    // Determine complexity
    let complexity: 'simple' | 'medium' | 'complex';
    if (elementCount <= 5) complexity = 'simple';
    else if (elementCount <= 15) complexity = 'medium';
    else complexity = 'complex';

    return { complexity, warnings };
  }

  /**
   * Check if two elements overlap
   */
  private elementsOverlap(a: DesignElement, b: DesignElement): boolean {
    return !(
      a.x + a.width < b.x ||
      b.x + b.width < a.x ||
      a.y + a.height < b.y ||
      b.y + b.height < a.y
    );
  }

  /**
   * Generate smart layout hints for the AI
   */
  private generateLayoutHints(design: PageDesign): string {
    const hints: string[] = [];

    // Detect common patterns
    const buttons = design.elements.filter(e => e.type === 'button');
    const texts = design.elements.filter(e => e.type === 'text');
    const shapes = design.elements.filter(e => e.type === 'shape');

    if (buttons.length > 0) {
      hints.push(`Contains ${buttons.length} interactive button(s)`);
    }

    // Check for header/title pattern (text at top)
    const topElements = design.elements.filter(e => e.y < 100);
    if (topElements.some(e => e.type === 'text')) {
      hints.push('Has header/title area at top');
    }

    // Check for grid pattern
    const sortedByY = [...design.elements].sort((a, b) => a.y - b.y);
    const rows = this.detectRows(sortedByY);
    if (rows.length > 1) {
      hints.push(`Elements arranged in ${rows.length} row(s)`);
    }

    return hints.join('. ');
  }

  /**
   * Detect rows of elements (similar Y positions)
   */
  private detectRows(elements: DesignElement[]): DesignElement[][] {
    const threshold = 50; // pixels
    const rows: DesignElement[][] = [];
    
    elements.forEach(element => {
      const existingRow = rows.find(row => 
        Math.abs(row[0].y - element.y) < threshold
      );
      
      if (existingRow) {
        existingRow.push(element);
      } else {
        rows.push([element]);
      }
    });

    return rows;
  }

  /**
   * Generate React component using Smart AI Engine
   */
  private async generateComponentWithAI(
    design: PageDesign,
    layoutHints: string
  ): Promise<string> {
    // Use the new Smart AI Engine (100% local, no external APIs!)
    const { smartAI } = await import('./smartAI.engine');
    
    try {
      console.log('🧠 Using Smart Local AI Engine...');
      const response = await smartAI.process({
        type: 'page-generation',
        input: design,
        context: { layoutHints }
      });

      if (response.success && response.output) {
        console.log('✅ Smart AI generated component!');
        console.log('   Confidence:', response.confidence + '%');
        console.log('   Reasoning:', response.reasoning);
        if (response.suggestions && response.suggestions.length > 0) {
          console.log('   Suggestions:', response.suggestions);
        }
        return response.output;
      }
    } catch (error) {
      console.warn('Smart AI failed, using basic template:', error);
    }

    // Fallback: Use basic template
    return this.generateWithTemplate(design);
  }

  /**
   * Build AI prompt for code generation
   */
  private buildPrompt(design: PageDesign, layoutHints: string): string {
    const elementsDesc = design.elements.map(el => 
      `- ${el.type} at (${el.x}, ${el.y}): ${el.content || el.style?.shape || 'no content'}`
    ).join('\n');

    return `Generate a Next.js React component for an educational page.

DESIGN SPECS:
Title: ${design.title}
Background: ${design.backgroundColor || 'white'}
Layout Hints: ${layoutHints}

ELEMENTS:
${elementsDesc}

REQUIREMENTS:
- Use TypeScript with "use client" directive
- Use Tailwind CSS for all styling
- Make it colorful and kid-friendly with gradients
- Position elements using absolute positioning based on x,y coordinates
- Add hover effects to buttons
- Include sound effects on button clicks (import from @/utils/soundEffects)
- Make it responsive with proper spacing
- Export as default function

Generate ONLY the component code, no explanations:`;
  }

  /**
   * Clean up AI-generated code
   */
  private cleanGeneratedCode(code: string): string {
    // Remove markdown code blocks if present
    let cleaned = code.replace(/```typescript\n?/g, '').replace(/```tsx\n?/g, '').replace(/```\n?/g, '');
    
    // Ensure "use client" directive
    if (!cleaned.includes('"use client"')) {
      cleaned = '"use client";\n\n' + cleaned;
    }

    return cleaned.trim();
  }

  /**
   * Fallback: Generate component using templates (no AI needed)
   */
  private generateWithTemplate(design: PageDesign): string {
    const elementsCode = design.elements.map(el => 
      this.generateElementCode(el)
    ).join('\n      ');

    return `"use client";

import { useState } from 'react';
import { SoundEffects } from '@/utils/soundEffects';

export default function CustomPage() {
  const [sounds] = useState(() => new SoundEffects());

  const handleClick = (action: string) => {
    sounds.playClick();
    console.log('Button clicked:', action);
    // Add your custom logic here
  };

  return (
    <div 
      className="min-h-screen w-full relative overflow-hidden"
      style={{ backgroundColor: '${design.backgroundColor || '#f0f9ff'}' }}
    >
      {/* Generated Elements */}
      ${elementsCode}
    </div>
  );
}`;
  }

  /**
   * Generate code for a single design element
   */
  private generateElementCode(element: DesignElement): string {
    const style = `
        position: 'absolute',
        left: '${element.x}px',
        top: '${element.y}px',
        width: '${element.width}px',
        height: '${element.height}px',
      `;

    switch (element.type) {
      case 'text':
        return `<div
        style={{${style}}}
        className="text-${element.style?.fontSize || 'lg'} font-bold"
        style={{ color: '${element.style?.color || '#000'}' }}
      >
        ${element.content || 'Text'}
      </div>`;

      case 'button':
        return `<button
        onClick={() => handleClick('${element.action || 'clicked'}')}
        style={{${style}}}
        className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl hover:scale-105 transform transition-all duration-200 shadow-lg"
      >
        ${element.content || 'Button'}
      </button>`;

      case 'shape':
        const shapeClass = element.style?.shape === 'circle' ? 'rounded-full' : 'rounded-lg';
        return `<div
        style={{${style} backgroundColor: '${element.style?.backgroundColor || '#3b82f6'}'}}
        className="${shapeClass} shadow-lg"
      />`;

      case 'input':
        return `<input
        type="text"
        placeholder="${element.content || 'Type here...'}"
        style={{${style}}}
        className="px-4 py-2 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
      />`;

      default:
        return `<!-- Unknown element type: ${element.type} -->`;
    }
  }

  /**
   * Generate simple HTML preview (for quick display without React)
   */
  private generateHTMLPreview(design: PageDesign): string {
    const elementsHtml = design.elements.map(el => {
      const style = `position:absolute;left:${el.x}px;top:${el.y}px;width:${el.width}px;height:${el.height}px;`;
      
      switch (el.type) {
        case 'text':
          return `<div style="${style}color:${el.style?.color || '#000'};font-size:${el.style?.fontSize || 16}px;font-weight:bold;">${el.content || 'Text'}</div>`;
        case 'button':
          return `<button style="${style}background:linear-gradient(to right, #3b82f6, #8b5cf6);color:white;border:none;border-radius:12px;cursor:pointer;font-weight:bold;">${el.content || 'Button'}</button>`;
        case 'shape':
          return `<div style="${style}background:${el.style?.backgroundColor || '#3b82f6'};border-radius:${el.style?.shape === 'circle' ? '50%' : '8px'};"></div>`;
        case 'input':
          return `<input type="text" placeholder="${el.content || 'Type here...'}" style="${style}border:2px solid #ccc;border-radius:8px;padding:8px;">`;
        default:
          return '';
      }
    }).join('');

    return `<div style="position:relative;width:100%;min-height:100vh;background:${design.backgroundColor || '#f0f9ff'};">${elementsHtml}</div>`;
  }

  /**
   * Validate generated component (basic syntax check)
   */
  validateComponent(code: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!code.includes('export default')) {
      errors.push('Missing export default');
    }

    if (!code.includes('"use client"')) {
      errors.push('Missing "use client" directive');
    }

    // Check for balanced braces (basic check)
    const openBraces = (code.match(/{/g) || []).length;
    const closeBraces = (code.match(/}/g) || []).length;
    if (openBraces !== closeBraces) {
      errors.push('Unbalanced braces');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// Export singleton instance
export const pageGeneratorAgent = new PageGeneratorAgent();
