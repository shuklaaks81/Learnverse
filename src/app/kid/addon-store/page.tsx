"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Addon {
  id: string;
  name: string;
  author: string;
  type: 'game' | 'lesson' | 'theme' | 'character' | 'other';
  description: string;
  icon: string;
  code: string;
  downloads: number;
  createdAt: string;
  published: boolean;
}

export default function AddonStorePage() {
  const router = useRouter();
  const [addons, setAddons] = useState<Addon[]>([]);
  const [installedAddons, setInstalledAddons] = useState<string[]>([]);
  const [selectedAddon, setSelectedAddon] = useState<Addon | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'name'>('popular');
  const [showCode, setShowCode] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const publicAddons = localStorage.getItem('publicAddons');
      if (publicAddons) {
        setAddons(JSON.parse(publicAddons));
      }

      const installed = localStorage.getItem('installedAddons');
      if (installed) {
        setInstalledAddons(JSON.parse(installed));
      }
    }
  }, []);

  const filteredAddons = addons
    .filter(addon => {
      const matchesSearch = 
        addon.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addon.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
        addon.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesType = filterType === 'all' || addon.type === filterType;
      
      return matchesSearch && matchesType;
    })
    .sort((a, b) => {
      if (sortBy === 'popular') {
        return b.downloads - a.downloads;
      } else if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else {
        return a.name.localeCompare(b.name);
      }
    });

  const isInstalled = (addonId: string) => installedAddons.includes(addonId);

  const installAddon = (addon: Addon) => {
    if (isInstalled(addon.id)) {
      alert('Already installed!');
      return;
    }

    const updatedInstalled = [...installedAddons, addon.id];
    setInstalledAddons(updatedInstalled);
    localStorage.setItem('installedAddons', JSON.stringify(updatedInstalled));

    // Increment download count
    const updatedAddons = addons.map(a => 
      a.id === addon.id ? { ...a, downloads: a.downloads + 1 } : a
    );
    setAddons(updatedAddons);
    localStorage.setItem('publicAddons', JSON.stringify(updatedAddons));

    // Save to installed addons list with code
    const installedAddonsList = localStorage.getItem('installedAddonsList');
    const list = installedAddonsList ? JSON.parse(installedAddonsList) : [];
    list.push(addon);
    localStorage.setItem('installedAddonsList', JSON.stringify(list));

    alert('✅ Add-on installed! Check your installed add-ons page.');
  };

  const uninstallAddon = (addonId: string) => {
    if (!confirm('Uninstall this add-on?')) return;

    const updatedInstalled = installedAddons.filter(id => id !== addonId);
    setInstalledAddons(updatedInstalled);
    localStorage.setItem('installedAddons', JSON.stringify(updatedInstalled));

    // Remove from installed list
    const installedAddonsList = localStorage.getItem('installedAddonsList');
    if (installedAddonsList) {
      const list = JSON.parse(installedAddonsList);
      const updated = list.filter((a: Addon) => a.id !== addonId);
      localStorage.setItem('installedAddonsList', JSON.stringify(updated));
    }

    alert('Uninstalled!');
  };

  const typeIcons = {
    game: '🎮',
    lesson: '📚',
    theme: '🎨',
    character: '🐾',
    other: '⚡'
  };

  const typeColors = {
    game: 'from-red-400 to-red-600',
    lesson: 'from-blue-400 to-blue-600',
    theme: 'from-purple-400 to-purple-600',
    character: 'from-green-400 to-green-600',
    other: 'from-gray-400 to-gray-600'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4">
      <div className="max-w-7xl mx-auto">
        
        {!selectedAddon ? (
          <>
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-blue-600 bg-clip-text text-transparent">
                  🛍️ Add-on Store
                </h1>
                <p className="text-gray-600 mt-1">Download amazing add-ons from the community!</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => router.push('/kid/addon-creator')}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  ⚙️ My Add-ons
                </button>
                <button
                  onClick={() => router.push('/kid')}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  ← Back
                </button>
              </div>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-lg p-4 mb-6">
              <div className="flex gap-3 flex-wrap mb-3">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="🔍 Search add-ons..."
                  className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg"
                />
                
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="all">All Types</option>
                  <option value="game">🎮 Games</option>
                  <option value="lesson">📚 Lessons</option>
                  <option value="theme">🎨 Themes</option>
                  <option value="character">🐾 Characters</option>
                  <option value="other">⚡ Other</option>
                </select>
                
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="px-4 py-2 border rounded-lg"
                >
                  <option value="popular">Most Popular</option>
                  <option value="newest">Newest First</option>
                  <option value="name">Name A-Z</option>
                </select>
              </div>

              <div className="flex gap-2 text-sm">
                <span className="text-gray-600">
                  {filteredAddons.length} add-on{filteredAddons.length !== 1 ? 's' : ''} • 
                </span>
                <span className="text-green-600 font-bold">
                  {installedAddons.length} installed
                </span>
              </div>
            </div>

            {/* Add-ons Grid */}
            {filteredAddons.length === 0 ? (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-6xl mb-4">🛍️</p>
                {searchQuery || filterType !== 'all' ? (
                  <p className="text-xl text-gray-600">No add-ons match your filters!</p>
                ) : (
                  <>
                    <p className="text-xl text-gray-600 mb-2">No add-ons published yet!</p>
                    <p className="text-gray-500">Be the first to create one!</p>
                    <button
                      onClick={() => router.push('/kid/addon-creator')}
                      className="mt-4 px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
                    >
                      Create an Add-on
                    </button>
                  </>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAddons.map(addon => (
                  <div
                    key={addon.id}
                    className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all"
                  >
                    <div className={`bg-gradient-to-br ${typeColors[addon.type]} h-32 rounded-lg shadow-md mb-4 flex items-center justify-center`}>
                      <span className="text-6xl">{addon.icon || typeIcons[addon.type]}</span>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className="font-bold text-lg text-gray-800 mb-1 line-clamp-1">{addon.name}</h3>
                      <p className="text-sm text-gray-600 mb-1">by {addon.author}</p>
                      <p className="text-xs text-gray-500 capitalize mb-2">{typeIcons[addon.type]} {addon.type}</p>
                      <p className="text-sm text-gray-600 line-clamp-2 mb-3">{addon.description}</p>
                    </div>

                    <div className="flex justify-between items-center mb-3 text-xs text-gray-400">
                      <span>⬇️ {addon.downloads} downloads</span>
                      <span>{new Date(addon.createdAt).toLocaleDateString()}</span>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedAddon(addon)}
                        className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all text-sm font-bold"
                      >
                        👁️ View
                      </button>
                      {isInstalled(addon.id) ? (
                        <button
                          onClick={() => uninstallAddon(addon.id)}
                          className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all text-sm"
                        >
                          🗑️
                        </button>
                      ) : (
                        <button
                          onClick={() => installAddon(addon)}
                          className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all text-sm"
                        >
                          ⬇️
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Add-on Detail View */}
            <div className="mb-4">
              <button
                onClick={() => {
                  setSelectedAddon(null);
                  setShowCode(false);
                }}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                ← Back to Store
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8 max-w-4xl mx-auto">
              {/* Header */}
              <div className="flex items-start gap-6 mb-8 pb-6 border-b">
                <div className={`bg-gradient-to-br ${typeColors[selectedAddon.type]} w-32 h-32 rounded-lg shadow-lg flex-shrink-0 flex items-center justify-center`}>
                  <span className="text-7xl">{selectedAddon.icon || typeIcons[selectedAddon.type]}</span>
                </div>
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-2">{selectedAddon.name}</h1>
                  <p className="text-xl text-gray-600 mb-3">by {selectedAddon.author}</p>
                  <p className="text-gray-600 mb-4">{selectedAddon.description}</p>
                  
                  <div className="flex gap-4 text-sm text-gray-500 mb-4">
                    <span className="capitalize">{typeIcons[selectedAddon.type]} {selectedAddon.type}</span>
                    <span>⬇️ {selectedAddon.downloads} downloads</span>
                    <span>📅 {new Date(selectedAddon.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex gap-2">
                    {isInstalled(selectedAddon.id) ? (
                      <>
                        <button
                          onClick={() => uninstallAddon(selectedAddon.id)}
                          className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-all font-bold"
                        >
                          🗑️ Uninstall
                        </button>
                        <span className="px-6 py-3 bg-green-100 text-green-700 rounded-lg font-bold">
                          ✅ Installed
                        </span>
                      </>
                    ) : (
                      <button
                        onClick={() => installAddon(selectedAddon)}
                        className="px-6 py-3 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-lg hover:from-green-500 hover:to-green-700 transition-all font-bold"
                      >
                        ⬇️ Install Add-on
                      </button>
                    )}
                    
                    <button
                      onClick={() => setShowCode(!showCode)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-all font-bold"
                    >
                      {showCode ? '👁️ Hide Code' : '💻 View Code'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Code Preview */}
              {showCode && (
                <div className="mb-6">
                  <h3 className="text-xl font-bold mb-3 text-gray-800">Source Code</h3>
                  <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono max-h-[500px] overflow-y-auto">
                    {selectedAddon.code}
                  </pre>
                  <p className="text-sm text-gray-500 mt-2">
                    💡 You can view and learn from this code!
                  </p>
                </div>
              )}

              {/* Info */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <p className="text-sm text-gray-700">
                  <strong>How to use:</strong> After installing, this add-on will be available in your Learnverse. 
                  Check &quot;My Add-ons&quot; to manage all installed add-ons!
                </p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
