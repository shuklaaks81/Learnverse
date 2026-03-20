"use client";

import { useState, useRef, useEffect } from 'react';
import { pageGeneratorAgent, type PageDesign, type DesignElement } from '@/agents/pageGenerator.agent';
import { claimPageId } from '@/utils/customPageManager';

type Tool = 'text' | 'shape' | 'button' | 'select';
type ShapeType = 'rectangle' | 'circle' | 'triangle';

interface CanvasElement extends DesignElement {
  selected?: boolean;
}

export default function VisualBuilder() {
  const [elements, setElements] = useState<CanvasElement[]>([]);
  const [tool, setTool] = useState<Tool>('select');
  const [shapeType, setShapeType] = useState<ShapeType>('rectangle');
  const [selectedColor, setSelectedColor] = useState('#3b82f6');
  const [backgroundColor, setBackgroundColor] = useState('#fef3c7');
  const [dragging, setDragging] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [generating, setGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [generatedCode, setGeneratedCode] = useState('');
  
  const canvasRef = useRef<HTMLDivElement>(null);

  const handleCanvasClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (tool === 'select' || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newElement: CanvasElement = {
      type: tool,
      id: `elem-${Date.now()}`,
      x,
      y,
      width: tool === 'text' ? 200 : 100,
      height: tool === 'text' ? 40 : 100,
      content: tool === 'text' ? 'Edit me!' : tool === 'button' ? 'Click Me!' : undefined,
      style: {
        backgroundColor: tool === 'shape' ? selectedColor : undefined,
        shape: tool === 'shape' ? shapeType : undefined,
        fontSize: tool === 'text' ? 24 : undefined,
        color: tool === 'text' ? '#000000' : undefined,
        fontWeight: tool === 'text' ? 'bold' : undefined,
      }
    };

    setElements([...elements, newElement]);
    setTool('select');
  };

  const handleMouseDown = (e: React.MouseEvent, elementId: string) => {
    e.stopPropagation();
    setDragging(elementId);
    
    const element = elements.find(el => el.id === elementId);
    if (element) {
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setDragOffset({
          x: x - element.x,
          y: y - element.y
        });
      }
    }
    
    // Select the element
    setElements(elements.map(el => ({
      ...el,
      selected: el.id === elementId
    })));
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragging || !canvasRef.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - dragOffset.x;
    const y = e.clientY - rect.top - dragOffset.y;

    setElements(elements.map(el =>
      el.id === dragging ? { ...el, x, y } : el
    ));
  };

  const handleMouseUp = () => {
    setDragging(null);
  };

  const deleteSelected = () => {
    setElements(elements.filter(el => !el.selected));
  };

  const clearCanvas = () => {
    setElements([]);
  };

  const handleGenerate = async () => {
    if (elements.length === 0) {
      alert('Add some elements first! 🎨');
      return;
    }

    setGenerating(true);
    
    try {
      const pageId = claimPageId();
      if (!pageId) {
        alert('All 50 page slots are in use! 😱');
        setGenerating(false);
        return;
      }

      const design: PageDesign = {
        title: 'My Custom Page',
        description: 'Created with visual builder!',
        backgroundColor,
        elements: elements.map(({ selected, ...el }) => el)
      };

      const result = await pageGeneratorAgent.generatePage(design);
      setGeneratedCode(result.componentCode);
      setShowPreview(true);
      
      // Save to localStorage
      localStorage.setItem(`customPage_${pageId}`, JSON.stringify({
        design,
        code: result.componentCode,
        createdAt: Date.now()
      }));

      alert(`Page created! 🎉\nYour unique URL: /custom/${pageId}`);
    } catch (err) {
      console.error(err);
      alert('Generation failed! Try again 😓');
    } finally {
      setGenerating(false);
    }
  };

  const updateElementContent = (id: string, content: string) => {
    setElements(elements.map(el =>
      el.id === id ? { ...el, content } : el
    ));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-2xl shadow-2xl p-6 mb-4">
          <h1 className="text-4xl font-black text-gray-800 mb-2">
            🎨 Visual Page Builder
          </h1>
          <p className="text-gray-600">
            Click tools, then click the canvas to add elements! Drag to move them around!
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-4">
          {/* Toolbar */}
          <div className="md:col-span-1 bg-white rounded-2xl shadow-xl p-4 h-fit">
            <h2 className="text-xl font-bold text-gray-800 mb-4">🛠️ Tools</h2>
            
            {/* Tool Buttons */}
            <div className="space-y-2 mb-6">
              <button
                onClick={() => setTool('select')}
                className={`w-full px-4 py-3 rounded-xl font-bold text-left transition-all ${
                  tool === 'select'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                👆 Select / Move
              </button>
              <button
                onClick={() => setTool('text')}
                className={`w-full px-4 py-3 rounded-xl font-bold text-left transition-all ${
                  tool === 'text'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                📝 Add Text
              </button>
              <button
                onClick={() => setTool('button')}
                className={`w-full px-4 py-3 rounded-xl font-bold text-left transition-all ${
                  tool === 'button'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔘 Add Button
              </button>
              <button
                onClick={() => setTool('shape')}
                className={`w-full px-4 py-3 rounded-xl font-bold text-left transition-all ${
                  tool === 'shape'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                🔷 Add Shape
              </button>
            </div>

            {/* Shape Type Selector */}
            {tool === 'shape' && (
              <div className="mb-6 p-4 bg-orange-50 rounded-xl">
                <label className="block text-sm font-bold text-gray-700 mb-2">Shape Type:</label>
                <select
                  value={shapeType}
                  onChange={(e) => setShapeType(e.target.value as ShapeType)}
                  className="w-full px-3 py-2 border-2 border-orange-300 rounded-lg text-gray-700 font-bold"
                >
                  <option value="rectangle">Rectangle</option>
                  <option value="circle">Circle</option>
                  <option value="triangle">Triangle</option>
                </select>
              </div>
            )}

            {/* Color Picker */}
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <label className="block text-sm font-bold text-gray-700 mb-2">Color:</label>
              <input
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-blue-300 cursor-pointer"
              />
            </div>

            {/* Background Color */}
            <div className="mb-6 p-4 bg-yellow-50 rounded-xl">
              <label className="block text-sm font-bold text-gray-700 mb-2">Background:</label>
              <input
                type="color"
                value={backgroundColor}
                onChange={(e) => setBackgroundColor(e.target.value)}
                className="w-full h-12 rounded-lg border-2 border-yellow-300 cursor-pointer"
              />
            </div>

            {/* Actions */}
            <div className="space-y-2">
              <button
                onClick={deleteSelected}
                className="w-full px-4 py-3 bg-red-500 text-white font-bold rounded-xl hover:bg-red-600 transition-all"
              >
                🗑️ Delete Selected
              </button>
              <button
                onClick={clearCanvas}
                className="w-full px-4 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-800 transition-all"
              >
                🧹 Clear All
              </button>
              <button
                onClick={handleGenerate}
                disabled={generating}
                className={`w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-xl shadow-lg transition-all ${
                  generating ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                }`}
              >
                {generating ? '⚙️ Generating...' : '✨ Generate Page!'}
              </button>
            </div>
          </div>

          {/* Canvas */}
          <div className="md:col-span-3">
            <div className="bg-white rounded-2xl shadow-xl p-4">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">🖼️ Canvas</h2>
                <div className="text-sm text-gray-600 font-bold">
                  {elements.length} element{elements.length !== 1 ? 's' : ''}
                </div>
              </div>
              
              <div
                ref={canvasRef}
                onClick={handleCanvasClick}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                className="relative w-full rounded-xl border-4 border-dashed border-gray-300 overflow-hidden cursor-crosshair"
                style={{
                  height: '600px',
                  backgroundColor: backgroundColor
                }}
              >
                {elements.length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-xl font-bold pointer-events-none">
                    Click a tool, then click here to add elements! 👆
                  </div>
                )}

                {elements.map((element) => (
                  <div
                    key={element.id}
                    onMouseDown={(e) => handleMouseDown(e, element.id)}
                    className={`absolute cursor-move ${
                      element.selected ? 'ring-4 ring-blue-500' : ''
                    }`}
                    style={{
                      left: element.x,
                      top: element.y,
                      width: element.width,
                      height: element.height,
                    }}
                  >
                    {element.type === 'text' && (
                      <input
                        type="text"
                        value={element.content || ''}
                        onChange={(e) => updateElementContent(element.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="w-full h-full bg-transparent border-2 border-gray-300 rounded px-2 font-bold"
                        style={{
                          fontSize: element.style?.fontSize,
                          color: element.style?.color,
                          fontWeight: element.style?.fontWeight as any,
                        }}
                      />
                    )}

                    {element.type === 'button' && (
                      <button
                        className="w-full h-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {element.content}
                      </button>
                    )}

                    {element.type === 'shape' && (
                      <div
                        className="w-full h-full"
                        style={{
                          backgroundColor: element.style?.backgroundColor,
                          borderRadius: element.style?.shape === 'circle' ? '50%' : '0',
                          clipPath: element.style?.shape === 'triangle' ? 'polygon(50% 0%, 0% 100%, 100% 100%)' : undefined,
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Preview Modal */}
        {showPreview && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <h2 className="text-3xl font-black text-gray-800 mb-4">🎉 Page Generated!</h2>
              
              <div className="bg-gray-900 rounded-xl p-4 mb-4 overflow-x-auto">
                <pre className="text-sm text-green-400 font-mono">
                  {generatedCode}
                </pre>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(generatedCode);
                    alert('Code copied! 📋');
                  }}
                  className="px-6 py-3 bg-blue-500 text-white font-bold rounded-xl hover:scale-105 transition-all"
                >
                  📋 Copy Code
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:scale-105 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
