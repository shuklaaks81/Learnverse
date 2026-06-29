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

export default function BookCreatorPage() {
  const router = useRouter();
  const [books, setBooks] = useState<Book[]>([]);
  const [currentBook, setCurrentBook] = useState<Book | null>(null);
  const [editingChapter, setEditingChapter] = useState<Chapter | null>(null);
  const [showNewBookForm, setShowNewBookForm] = useState(false);
  const [kidName, setKidName] = useState('Writer');

  // Load data
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const kidData = localStorage.getItem('currentKid');
      if (kidData) {
        const kid = JSON.parse(kidData);
        setKidName(kid.kidName || 'Writer');
      }

      const savedBooks = localStorage.getItem('myBooks');
      if (savedBooks) {
        setBooks(JSON.parse(savedBooks));
      }
    }
  }, []);

  // Save books
  const saveBooks = (updatedBooks: Book[]) => {
    setBooks(updatedBooks);
    localStorage.setItem('myBooks', JSON.stringify(updatedBooks));
    
    // Also update public library
    const publicBooks = updatedBooks.filter(b => b.published);
    const allPublicBooks = localStorage.getItem('publicLibrary');
    const existingPublic = allPublicBooks ? JSON.parse(allPublicBooks) : [];
    
    // Remove old versions of our books and add updated ones
    const otherAuthorsBooks = existingPublic.filter((b: Book) => 
      !updatedBooks.find(ub => ub.id === b.id)
    );
    localStorage.setItem('publicLibrary', JSON.stringify([...otherAuthorsBooks, ...publicBooks]));
  };

  // Create new book
  const createNewBook = (title: string, description: string, coverColor: string) => {
    const newBook: Book = {
      id: `book-${Date.now()}`,
      title,
      author: kidName,
      coverColor,
      description,
      chapters: [],
      published: false,
      createdAt: new Date().toISOString(),
    };
    
    const updatedBooks = [...books, newBook];
    saveBooks(updatedBooks);
    setCurrentBook(newBook);
    setShowNewBookForm(false);
  };

  // Add chapter
  const addChapter = () => {
    if (!currentBook) return;
    
    const newChapter: Chapter = {
      id: `chapter-${Date.now()}`,
      title: `Chapter ${currentBook.chapters.length + 1}`,
      content: '',
    };
    
    const updatedBook = {
      ...currentBook,
      chapters: [...currentBook.chapters, newChapter],
    };
    
    const updatedBooks = books.map(b => b.id === currentBook.id ? updatedBook : b);
    saveBooks(updatedBooks);
    setCurrentBook(updatedBook);
    setEditingChapter(newChapter);
  };

  // Save chapter
  const saveChapter = (chapter: Chapter) => {
    if (!currentBook) return;
    
    const updatedBook = {
      ...currentBook,
      chapters: currentBook.chapters.map(c => c.id === chapter.id ? chapter : c),
    };
    
    const updatedBooks = books.map(b => b.id === currentBook.id ? updatedBook : b);
    saveBooks(updatedBooks);
    setCurrentBook(updatedBook);
    setEditingChapter(null);
  };

  // Delete chapter
  const deleteChapter = (chapterId: string) => {
    if (!currentBook) return;
    if (!confirm('Delete this chapter?')) return;
    
    const updatedBook = {
      ...currentBook,
      chapters: currentBook.chapters.filter(c => c.id !== chapterId),
    };
    
    const updatedBooks = books.map(b => b.id === currentBook.id ? updatedBook : b);
    saveBooks(updatedBooks);
    setCurrentBook(updatedBook);
  };

  // Publish book
  const publishBook = () => {
    if (!currentBook) return;
    if (currentBook.chapters.length === 0) {
      alert('Add at least one chapter before publishing!');
      return;
    }
    
    const updatedBook = {
      ...currentBook,
      published: true,
      publishedAt: new Date().toISOString(),
    };
    
    const updatedBooks = books.map(b => b.id === currentBook.id ? updatedBook : b);
    saveBooks(updatedBooks);
    setCurrentBook(updatedBook);
    alert('🎉 Book published! Everyone can read it now!');
  };

  // Unpublish book
  const unpublishBook = () => {
    if (!currentBook) return;
    
    const updatedBook = {
      ...currentBook,
      published: false,
      publishedAt: undefined,
    };
    
    const updatedBooks = books.map(b => b.id === currentBook.id ? updatedBook : b);
    saveBooks(updatedBooks);
    setCurrentBook(updatedBook);
  };

  // Delete book
  const deleteBook = (bookId: string) => {
    if (!confirm('Delete this book forever?')) return;
    
    const updatedBooks = books.filter(b => b.id !== bookId);
    saveBooks(updatedBooks);
    if (currentBook?.id === bookId) {
      setCurrentBook(null);
    }
  };

  const coverColors = [
    'bg-gradient-to-br from-red-400 to-red-600',
    'bg-gradient-to-br from-blue-400 to-blue-600',
    'bg-gradient-to-br from-green-400 to-green-600',
    'bg-gradient-to-br from-purple-400 to-purple-600',
    'bg-gradient-to-br from-orange-400 to-orange-600',
    'bg-gradient-to-br from-pink-400 to-pink-600',
    'bg-gradient-to-br from-yellow-400 to-yellow-600',
    'bg-gradient-to-br from-indigo-400 to-indigo-600',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-pink-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📚 Book Creator
            </h1>
            <p className="text-gray-600 mt-1">Write and publish your own books!</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => router.push('/kid/library')}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              🌍 Public Library
            </button>
            <button
              onClick={() => router.push('/kid')}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
            >
              ← Back
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left: My Books */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold mb-4 text-gray-800">My Books</h2>
              
              <button
                onClick={() => setShowNewBookForm(true)}
                className="w-full mb-4 px-4 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
              >
                + New Book
              </button>

              <div className="space-y-2 max-h-[600px] overflow-y-auto">
                {books.map(book => (
                  <div
                    key={book.id}
                    onClick={() => setCurrentBook(book)}
                    className={`p-3 rounded-lg cursor-pointer transition-all ${
                      currentBook?.id === book.id
                        ? 'bg-purple-100 border-2 border-purple-500'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-16 ${book.coverColor} rounded shadow-md flex-shrink-0`} />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-gray-800 truncate">{book.title}</p>
                        <p className="text-sm text-gray-600">{book.chapters.length} chapters</p>
                        {book.published ? (
                          <p className="text-xs text-green-600 font-bold">✅ Published</p>
                        ) : (
                          <p className="text-xs text-gray-500">Draft</p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                
                {books.length === 0 && (
                  <p className="text-gray-400 text-center py-8">No books yet!<br/>Click &quot;New Book&quot; to start</p>
                )}
              </div>
            </div>
          </div>

          {/* Right: Book Editor */}
          <div className="lg:col-span-2">
            {!currentBook ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-6xl mb-4">📖</p>
                <p className="text-xl text-gray-600">Select a book or create a new one to start writing!</p>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-lg p-6">
                {/* Book Info */}
                <div className="mb-6 pb-6 border-b">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h2 className="text-3xl font-bold text-gray-800">{currentBook.title}</h2>
                      <p className="text-gray-600">by {currentBook.author}</p>
                      <p className="text-sm text-gray-500 mt-1">{currentBook.description}</p>
                    </div>
                    <div className={`w-20 h-28 ${currentBook.coverColor} rounded-lg shadow-lg`} />
                  </div>
                  
                  <div className="flex gap-2 flex-wrap mt-4">
                    {!currentBook.published ? (
                      <button
                        onClick={publishBook}
                        className="px-4 py-2 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
                      >
                        🌍 Publish to Library
                      </button>
                    ) : (
                      <button
                        onClick={unpublishBook}
                        className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-all font-bold"
                      >
                        📥 Unpublish
                      </button>
                    )}
                    
                    <button
                      onClick={addChapter}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all"
                    >
                      + Add Chapter
                    </button>
                    
                    <button
                      onClick={() => deleteBook(currentBook.id)}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all"
                    >
                      🗑️ Delete Book
                    </button>
                  </div>
                </div>

                {/* Chapters */}
                <div>
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Chapters</h3>
                  
                  {currentBook.chapters.length === 0 ? (
                    <p className="text-gray-400 text-center py-8">No chapters yet! Click &quot;Add Chapter&quot; to start writing.</p>
                  ) : (
                    <div className="space-y-3">
                      {currentBook.chapters.map((chapter, index) => (
                        <div key={chapter.id} className="border rounded-lg p-4 bg-gray-50">
                          {editingChapter?.id === chapter.id ? (
                            <div>
                              <input
                                type="text"
                                value={editingChapter.title}
                                onChange={(e) => setEditingChapter({ ...editingChapter, title: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg mb-2 font-bold"
                                placeholder="Chapter Title"
                              />
                              <textarea
                                value={editingChapter.content}
                                onChange={(e) => setEditingChapter({ ...editingChapter, content: e.target.value })}
                                className="w-full px-3 py-2 border rounded-lg mb-2 h-64 font-mono"
                                placeholder="Write your chapter here..."
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={() => saveChapter(editingChapter)}
                                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
                                >
                                  💾 Save
                                </button>
                                <button
                                  onClick={() => setEditingChapter(null)}
                                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-bold text-lg text-gray-800">{chapter.title}</h4>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => setEditingChapter(chapter)}
                                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                                  >
                                    ✏️ Edit
                                  </button>
                                  <button
                                    onClick={() => deleteChapter(chapter.id)}
                                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
                                  >
                                    🗑️
                                  </button>
                                </div>
                              </div>
                              <p className="text-gray-600 text-sm whitespace-pre-wrap line-clamp-3">
                                {chapter.content || <span className="text-gray-400 italic">No content yet</span>}
                              </p>
                              <p className="text-xs text-gray-400 mt-1">{chapter.content.length} characters</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* New Book Modal */}
      {showNewBookForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full">
            <h3 className="text-2xl font-bold mb-4">Create New Book</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.currentTarget);
                createNewBook(
                  formData.get('title') as string,
                  formData.get('description') as string,
                  formData.get('coverColor') as string
                );
              }}
            >
              <input
                name="title"
                type="text"
                placeholder="Book Title"
                required
                className="w-full px-3 py-2 border rounded-lg mb-3"
              />
              <textarea
                name="description"
                placeholder="Short description"
                required
                className="w-full px-3 py-2 border rounded-lg mb-3 h-20"
              />
              
              <p className="text-sm font-bold mb-2">Choose Cover Color:</p>
              <div className="grid grid-cols-4 gap-2 mb-4">
                {coverColors.map(color => (
                  <label key={color} className="cursor-pointer">
                    <input
                      type="radio"
                      name="coverColor"
                      value={color}
                      required
                      className="hidden peer"
                    />
                    <div className={`${color} h-16 rounded-lg shadow peer-checked:ring-4 peer-checked:ring-purple-500 transition-all`} />
                  </label>
                ))}
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 font-bold"
                >
                  Create Book
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewBookForm(false)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
