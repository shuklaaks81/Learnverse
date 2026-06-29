"use client";

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface CustomPageData {
  design: any;
  code: string;
  createdAt: number;
}

export default function CustomPage() {
  const params = useParams();
  const router = useRouter();
  const pageId = (params?.id as string) || '';
  
  const [pageData, setPageData] = useState<CustomPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(`customPage_${pageId}`);
      
      if (saved) {
        try {
          const data = JSON.parse(saved);
          setPageData(data);
        } catch (err) {
          console.error('Error loading page:', err);
          setError(true);
        }
      } else {
        setError(true);
      }
      
      setLoading(false);
    }
  }, [pageId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 animate-spin">⏳</div>
          <p className="text-2xl text-gray-700 font-bold">Loading your page...</p>
        </div>
      </div>
    );
  }

  if (error || !pageData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-6xl mb-4">😢</div>
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Page Not Found</h1>
          <p className="text-gray-600 mb-6">
            Hmm... this page doesn&apos;t exist or was deleted. Page ID: {pageId}
          </p>
          <Link
            href="/lab/smart-ai"
            className="inline-block px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg transition-all"
          >
            Back to Lab
          </Link>
        </div>
      </div>
    );
  }

  // Render the custom page design
  const { design } = pageData;

  return (
    <div 
      className="min-h-screen p-8 relative"
      style={{ backgroundColor: design.backgroundColor || '#ffffff' }}
    >
      {/* Control Bar */}
      <div className="fixed top-4 left-4 z-50 flex gap-2">
        <Link
          href="/lab/smart-ai"
          className="px-4 py-2 bg-white/90 backdrop-blur rounded-lg shadow-lg hover:shadow-xl transition-all text-gray-800 font-medium"
        >
          ← Back to Lab
        </Link>
        <Link
          href={`/lab/builder?edit=${pageId}`}
          className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-lg hover:shadow-xl transition-all font-medium"
        >
          ✏️ Edit
        </Link>
      </div>

      {/* Custom Page Content */}
      <div className="pt-16">
        {design.elements.map((element: any, idx: number) => {
          const style: React.CSSProperties = {
            position: 'absolute',
            left: element.x,
            top: element.y,
            backgroundColor: element.color,
            color: element.type === 'text' ? '#000000' : '#ffffff',
            border: 'none',
            cursor: element.type === 'button' ? 'pointer' : 'default',
          };

          if (element.type === 'text') {
            return (
              <div
                key={idx}
                style={style}
                className="p-2 text-xl font-bold"
              >
                {element.content}
              </div>
            );
          }

          if (element.type === 'button') {
            return (
              <button
                key={idx}
                style={style}
                className="px-6 py-3 rounded-lg font-bold hover:opacity-80 transition-opacity"
                onClick={() => alert(`Button clicked: ${element.content}`)}
              >
                {element.content}
              </button>
            );
          }

          if (element.type === 'shape') {
            const shapeStyle = { ...style, width: 100, height: 100 };
            
            if (element.shape === 'circle') {
              shapeStyle.borderRadius = '50%';
            } else if (element.shape === 'triangle') {
              shapeStyle.width = 0;
              shapeStyle.height = 0;
              shapeStyle.backgroundColor = 'transparent';
              shapeStyle.borderLeft = '50px solid transparent';
              shapeStyle.borderRight = '50px solid transparent';
              shapeStyle.borderBottom = `100px solid ${element.color}`;
            }

            return <div key={idx} style={shapeStyle} />;
          }

          return null;
        })}
      </div>

      {/* Page Info */}
      <div className="fixed bottom-4 right-4 bg-white/90 backdrop-blur rounded-lg shadow-lg p-4 max-w-xs">
        <p className="text-xs text-gray-600">
          <strong>Page ID:</strong> {pageId}
        </p>
        <p className="text-xs text-gray-600">
          <strong>Created:</strong> {new Date(pageData.createdAt).toLocaleDateString()}
        </p>
        <p className="text-xs text-gray-600">
          <strong>Elements:</strong> {design.elements.length}
        </p>
      </div>
    </div>
  );
}
