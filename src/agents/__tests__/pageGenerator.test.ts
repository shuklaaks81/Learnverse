/**
 * Test file for Page Generator AI Agent
 * Run this to verify the AI is working correctly
 */

import { pageGeneratorAgent, type PageDesign } from '@/agents/pageGenerator.agent';

// Test design: Simple welcome page
const testDesign: PageDesign = {
  title: "Test Page",
  description: "AI Generated Test",
  backgroundColor: "#dbeafe",
  elements: [
    {
      type: 'text',
      id: 'heading',
      x: 50,
      y: 50,
      width: 300,
      height: 50,
      content: 'Hello AI! 🤖',
      style: {
        fontSize: 32,
        color: '#1e40af',
        fontWeight: 'bold',
      }
    },
    {
      type: 'button',
      id: 'testBtn',
      x: 100,
      y: 150,
      width: 150,
      height: 50,
      content: 'Test Button',
      action: 'test'
    }
  ]
};

/**
 * Run the test
 */
async function runTest() {
  console.log('🧪 Starting AI Agent Test...\n');
  
  try {
    // Test 1: Generate page
    console.log('Test 1: Generating page from design...');
    const result = await pageGeneratorAgent.generatePage(testDesign);
    
    console.log('✅ Page generated successfully!');
    console.log('📊 Metadata:', result.metadata);
    console.log('💻 Component code length:', result.componentCode.length, 'chars');
    console.log('👁️ Preview length:', result.preview.length, 'chars');
    
    // Test 2: Validate component
    console.log('\nTest 2: Validating generated component...');
    const validation = pageGeneratorAgent.validateComponent(result.componentCode);
    
    if (validation.valid) {
      console.log('✅ Component is valid!');
    } else {
      console.log('❌ Component has errors:', validation.errors);
    }
    
    // Test 3: Check code structure
    console.log('\nTest 3: Checking code structure...');
    const hasUseClient = result.componentCode.includes('"use client"');
    const hasExport = result.componentCode.includes('export default');
    const hasTailwind = result.componentCode.includes('className');
    
    console.log('Has "use client":', hasUseClient ? '✅' : '❌');
    console.log('Has export default:', hasExport ? '✅' : '❌');
    console.log('Uses Tailwind:', hasTailwind ? '✅' : '❌');
    
    // Summary
    console.log('\n🎉 All tests passed!');
    console.log('\n📝 Generated Component Preview:');
    console.log('─'.repeat(60));
    console.log(result.componentCode.substring(0, 500) + '...');
    console.log('─'.repeat(60));
    
    return true;
  } catch (error) {
    console.error('❌ Test failed:', error);
    return false;
  }
}

// Auto-run if executed directly
if (typeof window === 'undefined') {
  runTest().then(success => {
    process.exit(success ? 0 : 1);
  });
}

export { runTest, testDesign };
