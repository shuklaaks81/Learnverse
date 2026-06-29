# 🤖 AI Page Generator Agent

## Overview
The Page Generator AI Agent converts visual design data into working React components automatically! It's the brain behind the custom feature creation system.

## How It Works

### 1️⃣ Input: Design Data
You provide a structured design object:
```typescript
const design: PageDesign = {
  title: "My Custom Page",
  backgroundColor: "#f0f9ff",
  elements: [
    {
      type: 'text',
      id: 'title1',
      x: 100,
      y: 50,
      width: 400,
      height: 60,
      content: 'Hello World! 🎉',
      style: { fontSize: 32, color: '#1e40af' }
    },
    {
      type: 'button',
      id: 'btn1',
      x: 150,
      y: 150,
      width: 200,
      height: 50,
      content: 'Click Me!',
      action: 'celebrate'
    }
  ]
};
```

### 2️⃣ AI Processing
The agent does 4 smart things:

**a) Analyzes Design**
- Counts elements
- Detects complexity (simple/medium/complex)
- Finds overlapping elements
- Generates warnings

**b) Detects Layout Patterns**
- Identifies headers (elements at top)
- Finds button groups
- Detects rows and grids
- Creates layout hints

**c) Generates Code**
- Uses CodeLlama AI to generate React components
- Falls back to smart templates if AI fails
- Adds Tailwind styling automatically
- Includes sound effects and interactions

**d) Validates Output**
- Checks for syntax errors
- Ensures "use client" directive
- Validates export statements
- Provides metadata and warnings

### 3️⃣ Output: Working Component
```typescript
const result: GeneratedPage = {
  componentCode: "...full React component code...",
  preview: "...HTML preview...",
  metadata: {
    elementsUsed: 5,
    complexity: 'simple',
    estimatedSize: '2KB',
    warnings: []
  }
};
```

## Usage

### Basic Example
```typescript
import { pageGeneratorAgent } from '@/agents/pageGenerator.agent';

const design = {
  title: "My Page",
  elements: [/* your elements */]
};

const result = await pageGeneratorAgent.generatePage(design);
console.log(result.componentCode); // Full React component!
```

### With Validation
```typescript
const result = await pageGeneratorAgent.generatePage(design);

// Validate the generated component
const validation = pageGeneratorAgent.validateComponent(result.componentCode);

if (validation.valid) {
  // Save to custom page!
  saveCustomPage(pageId, result);
} else {
  console.error('Errors:', validation.errors);
}
```

## Supported Element Types

### 📝 Text
```typescript
{
  type: 'text',
  content: 'Hello World',
  style: {
    fontSize: 24,
    color: '#000',
    fontWeight: 'bold'
  }
}
```

### 🔘 Button
```typescript
{
  type: 'button',
  content: 'Click Me!',
  action: 'celebrate', // What happens on click
}
```

### ⬛ Shape
```typescript
{
  type: 'shape',
  style: {
    shape: 'circle' | 'rectangle' | 'triangle' | 'star',
    backgroundColor: '#3b82f6'
  }
}
```

### 📥 Input
```typescript
{
  type: 'input',
  content: 'Placeholder text...'
}
```

### 🖼️ Image
```typescript
{
  type: 'image',
  content: 'https://...' // Image URL
}
```

## AI Models Used

### Primary: CodeLlama
- Model: `codellama/CodeLlama-7b-hf`
- Best for: Generating clean, working code
- Temperature: 0.3 (consistent output)
- Max tokens: 2000

### Fallback: Template System
If AI fails or is unavailable, the agent uses smart templates that still produce great results!

## Features

✅ **Smart Layout Detection** - Automatically detects patterns in your design  
✅ **Kid-Friendly Styling** - Adds colorful gradients and animations  
✅ **Sound Effects** - Includes audio feedback automatically  
✅ **Responsive Design** - Works on mobile and desktop  
✅ **Error Handling** - Falls back to templates if AI fails  
✅ **Code Validation** - Checks generated code for errors  
✅ **Metadata** - Provides complexity and size estimates  
✅ **Warnings** - Alerts about overlapping elements  

## Testing

Run the test suite:
```bash
npm test -- pageGenerator.test.ts
```

Or visit the demo page:
```
http://localhost:3000/lab/ai-generator
```

## Examples

### Example 1: Simple Welcome Page
```typescript
{
  title: "Welcome",
  backgroundColor: "#fef3c7",
  elements: [
    { type: 'text', x: 100, y: 50, content: 'Welcome! 👋' },
    { type: 'button', x: 150, y: 150, content: 'Start' }
  ]
}
```

### Example 2: Quiz Page
```typescript
{
  title: "Math Quiz",
  backgroundColor: "#ede9fe",
  elements: [
    { type: 'text', x: 50, y: 50, content: 'What is 2 + 2?' },
    { type: 'button', x: 50, y: 150, content: '3' },
    { type: 'button', x: 250, y: 150, content: '4' },
    { type: 'button', x: 450, y: 150, content: '5' }
  ]
}
```

### Example 3: Drawing Canvas
```typescript
{
  title: "Draw Here",
  backgroundColor: "#fff",
  elements: [
    { type: 'text', x: 50, y: 20, content: 'Draw Something! 🎨' },
    { type: 'shape', x: 50, y: 100, width: 600, height: 400, style: { backgroundColor: '#f3f4f6' } },
    { type: 'button', x: 50, y: 520, content: 'Clear' },
    { type: 'button', x: 250, y: 520, content: 'Save' }
  ]
}
```

## Performance

- **Generation Time**: 2-5 seconds (with AI) or <1 second (template fallback)
- **Code Size**: Typically 1-5KB per component
- **Cache**: AI responses are cached for 1 hour
- **Memory**: Minimal - uses efficient string generation

## Future Enhancements

🚀 **Planned Features:**
- Multi-page app generation
- Animation timeline editor
- Advanced interactions (drag-drop, games)
- Component library integration
- Real-time collaboration
- Export to standalone React app

## Troubleshooting

**Problem: AI generation fails**
- Solution: Agent automatically falls back to template system

**Problem: Generated code has errors**
- Solution: Run `validateComponent()` and check errors array

**Problem: Elements overlap**
- Solution: Check `metadata.warnings` for overlap alerts

**Problem: Output too large**
- Solution: Reduce number of elements or simplify design

## API Reference

### `generatePage(design: PageDesign): Promise<GeneratedPage>`
Main method to generate a component from design data.

### `validateComponent(code: string): ValidationResult`
Validates generated component code.

### Returns:
```typescript
{
  valid: boolean,
  errors: string[]
}
```

---

**Built with ❤️ for Learnverse**  
*Empowering kids to create their own learning experiences!*
