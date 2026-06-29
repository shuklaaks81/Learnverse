"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Chapter {
  id: string;
  title: string;
  content: string;
}

interface Book {
  id: string;
  title: string;
  author: string;
  coverColor: string;
  description: string;
  chapters: Chapter[];
  published: boolean;
  createdAt: string;
  publishedAt?: string;
}

export default function LibraryPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const publicBooks = localStorage.getItem('publicLibrary');
      if (publicBooks) {
        setBooks(JSON.parse(publicBooks));
      }
    }
  }, []);

  const filteredBooks = books
    .filter(book => 
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.publishedAt || b.createdAt).getTime() - new Date(a.publishedAt || a.createdAt).getTime();
      } else if (sortBy === 'oldest') {
        return new Date(a.publishedAt || a.createdAt).getTime() - new Date(b.publishedAt || b.createdAt).getTime();
      } else {
        return a.title.localeCompare(b.title);
      }
    });

  const currentChapter = selectedBook?.chapters[currentChapterIndex];

  const nextChapter = () => {
    if (selectedBook && currentChapterIndex < selectedBook.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  const prevChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {!selectedBook ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  🌍 Public Library
                </h1>
                <p className="text-gray-600 mt-1">Read books from creators around the world!</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/kid/book-creator')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  ✏️ My Books
                </button>
                <button
                  onClick={() => router.push('/kid')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* Search & Sort */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6 flex gap-3 flex-wrap">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="🔍 Search books or authors..."
                className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="title">Alphabetical</option>
              </select>
            </div>

            {/* Book Grid */}
            {filteredBooks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-6xl mb-4">📚</p>
                {searchQuery ? (
                  <p className="text-xl text-gray-600">No books match your search!</p>
                ) : (
                  <>
                    <p className="text-xl text-gray-600 mb-2">No books published yet!</p>
                    <p className="text-gray-500">Be the first to publish a book!</p>
                    <button
                      onClick={() => router.push('/kid/book-creator')}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
                    >
                      Create a Book
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredBooks.map(book => (
                  <div
                    key={book.id}
                    onClick={() => {
                      setSelectedBook(book);
                      setCurrentChapterIndex(0);
                    }}
                    className="bg-white rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-2xl hover:-translate-y-1 transition-all"
                  >
                    <div className={`${book.coverColor} h-48 rounded-lg shadow-md mb-4 flex items-center justify-center`}>
                      <p className="text-white text-4xl">📖</p>
                    </div>
                    
                    <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-2">{book.title}</h3>
                    <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                    <p className="text-sm text-gray-500 mb-3 line-clamp-2">{book.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>{book.chapters.length} chapters</span>
                      <span>{new Date(book.publishedAt || book.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {filteredBooks.length > 0 && (
              <p className="text-center text-gray-500 mt-6">
                {filteredBooks.length} book{filteredBooks.length !== 1 ? 's' : ''} available
              </p>
            )}
          </>
        ) : (
          <>
            {/* Book Reader */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setSelectedBook(null);
                  setCurrentChapterIndex(0);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back to Library
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              {/* Book Header */}
              <div className="flex items-start gap-6 mb-8 pb-8 border-b">
                <div className={`${selectedBook.coverColor} w-32 h-44 rounded-lg shadow-lg flex-shrink-0 flex items-center justify-center`}>
                  <p className="text-white text-6xl">📖</p>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedBook.title}</h1>
                  <p className="text-xl text-gray-600 mb-3">by {selectedBook.author}</p>
                  <p className="text-gray-600 mb-4">{selectedBook.description}</p>
                  <p className="text-sm text-gray-500">
                    {selectedBook.chapters.length} chapters • Published {new Date(selectedBook.publishedAt || selectedBook.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Chapter Content */}
              {currentChapter ? (
                <div className="mb-8">
                  <div className="mb-6">
                    <p className="text-sm font-bold text-purple-600 mb-1">
                      Chapter {currentChapterIndex + 1} of {selectedBook.chapters.length}
                    </p>
                    <h2 className="text-3xl font-bold text-gray-800 mb-6">{currentChapter.title}</h2>
                  </div>
                  
                  <div className="prose prose-lg max-w-none">
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed text-lg">
                      {currentChapter.content}
                    </p>
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-center py-12">This book has no chapters yet!</p>
              )}

              {/* Navigation */}
              {selectedBook.chapters.length > 0 && (
                <div className="flex justify-between items-center pt-8 border-t">
                  <button
                    onClick={prevChapter}
                    disabled={currentChapterIndex === 0}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      currentChapterIndex === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    ← Previous Chapter
                  </button>

                  <div className="text-center">
                    <select
                      value={currentChapterIndex}
                      onChange={(e) => setCurrentChapterIndex(Number(e.target.value))}
                      className="px-4 py-2 border rounded-lg"
                    >
                      {selectedBook.chapters.map((chapter, index) => (
                        <option key={chapter.id} value={index}>
                          {index + 1}. {chapter.title}
                        </option>
                      ))}
                    </select>
                  </div>

                  <button
                    onClick={nextChapter}
                    disabled={currentChapterIndex === selectedBook.chapters.length - 1}
                    className={`px-6 py-3 rounded-lg font-bold transition-all ${
                      currentChapterIndex === selectedBook.chapters.length - 1
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-blue-500 text-white hover:bg-blue-600'
                    }`}
                  >
                    Next Chapter →
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
