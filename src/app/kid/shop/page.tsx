'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useSoundEffects } from '@/utils/soundEffects';
import BackgroundMusic from '@/components/BackgroundMusic';
import WeeklyAnimation from '@/components/WeeklyAnimation';

interface ShopItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: 'buddyColors' | 'backgrounds' | 'accessories' | 'powerups';
  emoji: string;
  unlocked: boolean;
}

export default function ShopPage() {
  const soundEffects = useSoundEffects();
  const [coins, setCoins] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [purchasedItems, setPurchasedItems] = useState<number[]>([]);
  const [isGlitching, setIsGlitching] = useState(false);
  const [showWeeklyAnimation, setShowWeeklyAnimation] = useState(false);
  const [weeklyAnimationUnlocked, setWeeklyAnimationUnlocked] = useState(false);
  const [isPremium, setIsPremium] = useState(false);

  // Get current week number (changes every week!)
  const getCurrentWeek = () => {
    const now = new Date();
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    const days = Math.floor((now.getTime() - startOfYear.getTime()) / (24 * 60 * 60 * 1000));
    return Math.ceil((days + startOfYear.getDay() + 1) / 7);
  };

  const currentWeek = getCurrentWeek();

  const shopItems: ShopItem[] = [
    // Buddy Colors
    { id: 1, name: 'Rainbow Shirt', description: 'Multi-colored gradient shirt', price: 50, category: 'buddyColors', emoji: '🌈', unlocked: false },
    { id: 2, name: 'Gold Shirt', description: 'Shiny golden shirt', price: 100, category: 'buddyColors', emoji: '✨', unlocked: false },
    { id: 3, name: 'Galaxy Shirt', description: 'Cosmic purple shirt with stars', price: 150, category: 'buddyColors', emoji: '🌌', unlocked: false },
    { id: 4, name: 'Fire Shirt', description: 'Hot red and orange flames', price: 120, category: 'buddyColors', emoji: '🔥', unlocked: false },
    
    // Backgrounds
    { id: 5, name: 'Space Theme', description: 'Learning among the stars', price: 80, category: 'backgrounds', emoji: '🚀', unlocked: false },
    { id: 6, name: 'Ocean Theme', description: 'Underwater adventure', price: 80, category: 'backgrounds', emoji: '🌊', unlocked: false },
    { id: 7, name: 'Forest Theme', description: 'Nature learning environment', price: 80, category: 'backgrounds', emoji: '🌲', unlocked: false },
    { id: 8, name: 'Candy Theme', description: 'Sweet and colorful', price: 100, category: 'backgrounds', emoji: '🍭', unlocked: false },
    
    // Accessories
    { id: 9, name: 'Cool Sunglasses', description: 'Buddy looks super cool', price: 60, category: 'accessories', emoji: '😎', unlocked: false },
    { id: 10, name: 'Party Hat', description: 'Always ready to celebrate', price: 40, category: 'accessories', emoji: '🎉', unlocked: false },
    { id: 11, name: 'Crown', description: 'You are learning royalty', price: 200, category: 'accessories', emoji: '👑', unlocked: false },
    { id: 12, name: 'Wizard Hat', description: 'Magical learning powers', price: 150, category: 'accessories', emoji: '🧙', unlocked: false },
    
    // Power-ups
    { id: 13, name: 'Hint Helper', description: 'Get 3 hints on hard questions', price: 30, category: 'powerups', emoji: '💡', unlocked: false },
    { id: 14, name: 'Double Coins', description: '2x coins for 5 lessons', price: 75, category: 'powerups', emoji: '💰', unlocked: false },
    { id: 15, name: 'Streak Saver', description: 'Protects your streak once', price: 50, category: 'powerups', emoji: '🛡️', unlocked: false },
    { id: 16, name: 'XP Boost', description: '1.5x XP for 10 lessons', price: 100, category: 'powerups', emoji: '⚡', unlocked: false },
  ];

  // 💎 PREMIUM EXCLUSIVE ITEMS 💎
  const premiumItems: ShopItem[] = [
    { id: 1001, name: 'Holographic Skin', description: '✨ PREMIUM: Rainbow holographic effect!', price: 300, category: 'buddyColors', emoji: '💎', unlocked: false },
    { id: 1002, name: 'Cyber Neon Outfit', description: '✨ PREMIUM: Futuristic glowing cyberpunk style', price: 350, category: 'buddyColors', emoji: '⚡', unlocked: false },
    { id: 1003, name: 'Crystal Wings', description: '✨ PREMIUM: Diamond wings that sparkle', price: 500, category: 'accessories', emoji: '🦋', unlocked: false },
    { id: 1004, name: 'Dragon Companion', description: '✨ PREMIUM: A baby dragon follows you!', price: 600, category: 'accessories', emoji: '🐉', unlocked: false },
    { id: 1005, name: 'VIP Crown', description: '✨ PREMIUM: Ultimate status symbol', price: 800, category: 'accessories', emoji: '👸', unlocked: false },
    { id: 1006, name: 'Matrix Theme', description: '✨ PREMIUM: Code-rain cyber background', price: 250, category: 'backgrounds', emoji: '💻', unlocked: false },
    { id: 1007, name: 'Aurora Sky', description: '✨ PREMIUM: Northern lights background', price: 300, category: 'backgrounds', emoji: '🌌', unlocked: false },
    { id: 1008, name: 'Mega XP Boost', description: '✨ PREMIUM: 3x XP for 20 lessons!', price: 400, category: 'powerups', emoji: '🚀', unlocked: false },
    { id: 1009, name: 'Auto-Streak', description: '✨ PREMIUM: Never lose your streak!', price: 500, category: 'powerups', emoji: '🔥', unlocked: false },
    { id: 1010, name: 'Coin Magnet', description: '✨ PREMIUM: Earn 50% more coins always!', price: 750, category: 'powerups', emoji: '🧲', unlocked: false },
   { id: 1011, name: 'AI Buddy Pro', description: '✨ PREMIUM: Smart AI learning assistant', price: 900, category: 'powerups', emoji: '🤖', unlocked: false },
    { id: 1012, name: 'Legendary Aura', description: '✨ PREMIUM: Glowing particle effects', price: 1000, category: 'accessories', emoji: '✨', unlocked: false },
  ];

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Check for premium version
      const version = localStorage.getItem('learnverseVersion') || 'original';
      setIsPremium(version === 'premium');
      
      // Load coins from currentKid (same as daily challenge)
      const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
      const currentCoins = currentKid.coins || 0;
      setCoins(currentCoins);

      // Load purchased items
      const purchased = JSON.parse(localStorage.getItem(`purchased_${currentKid.id}`) || '[]');
      setPurchasedItems(purchased);

      // Check if weekly animation is unlocked
      const weeklyUnlocked = localStorage.getItem(`weeklyAnimation_week${currentWeek}`) === 'true';
      setWeeklyAnimationUnlocked(weeklyUnlocked);

      // Refresh coins every second to catch updates from games
      const coinRefreshInterval = setInterval(() => {
        const updatedKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
        const updatedCoins = updatedKid.coins || 0;
        if (updatedCoins !== coins) {
          setCoins(updatedCoins);
        }
      }, 1000);

      return () => clearInterval(coinRefreshInterval);
    }
  }, []);

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price && !purchasedItems.includes(item.id)) {
      // Special unlock for legendary item!
      if (item.id === 999) {
        // Start glitching effect
        setIsGlitching(true);
        
        // Play glitch sounds
        const glitchSounds = setInterval(() => {
          const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = Math.random() * 1000 + 100;
          oscillator.type = 'sawtooth';
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.1);
        }, 100);
        
        // After 10 seconds of glitching, complete the purchase
        setTimeout(() => {
          clearInterval(glitchSounds);
          setIsGlitching(false);
          
          const newCoins = coins - item.price;
          const newPurchased = [...purchasedItems, item.id];
          
          setCoins(newCoins);
          setPurchasedItems(newPurchased);
          
          const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
          // Update coins in currentKid object
          const updatedKid = { ...currentKid, coins: newCoins };
          localStorage.setItem('currentKid', JSON.stringify(updatedKid));
          
          // Update kid accounts
          const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
          const updatedAccounts = kidAccounts.map((kid: any) => 
            kid.id === currentKid.id ? updatedKid : kid
          );
          localStorage.setItem('kidAccounts', JSON.stringify(updatedAccounts));
          
          localStorage.setItem(`purchased_${currentKid.id}`, JSON.stringify(newPurchased));
          localStorage.setItem('legendaryMode', 'true');
          
          soundEffects?.playVictory();
          setTimeout(() => {
            alert('🔮✨ LEGENDARY MODE UNLOCKED! ✨🔮\n\nYour entire app has been transformed with:\n• Cyberpunk neon theme\n• Matrix-style effects\n• Special animations\n• Exclusive features\n• Secret powers activated!\n\nReload any page to see the magic! 🎆');
          }, 500);
        }, 10000);
      } else {
        const newCoins = coins - item.price;
        const newPurchased = [...purchasedItems, item.id];
        
        setCoins(newCoins);
        setPurchasedItems(newPurchased);
        
        const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
        // Update coins in currentKid object
        const updatedKid = { ...currentKid, coins: newCoins };
        localStorage.setItem('currentKid', JSON.stringify(updatedKid));
        
        // Update kid accounts
        const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
        const updatedAccounts = kidAccounts.map((kid: any) => 
          kid.id === currentKid.id ? updatedKid : kid
        );
        localStorage.setItem('kidAccounts', JSON.stringify(updatedAccounts));
        
        localStorage.setItem(`purchased_${currentKid.id}`, JSON.stringify(newPurchased));
        
        soundEffects?.playCelebration();
      }
    } else if (coins < item.price) {
      soundEffects?.playWrong();
    }
  };

  // Add special items based on coin thresholds
  let allItems = isPremium ? [...shopItems, ...premiumItems] : shopItems;
  
  // Filter items based on category AND affordability
  let filteredItems = selectedCategory === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === selectedCategory);
  
  // If "affordable" filter is active, show only items you can buy
  if (selectedCategory === 'affordable') {
    filteredItems = allItems.filter(item => item.price <= coins && !purchasedItems.includes(item.id));
  }

  // Add premium category
  const categories = isPremium ? [
    { id: 'all', name: 'All Items', emoji: '🛍️' },
    { id: 'affordable', name: 'What Can I Buy?', emoji: '💰' },
    { id: 'premium', name: '💎 Premium Exclusives', emoji: '✨' },
    { id: 'buddyColors', name: 'Buddy Styles', emoji: '👕' },
    { id: 'backgrounds', name: 'Backgrounds', emoji: '🖼️' },
    { id: 'accessories', name: 'Accessories', emoji: '🎩' },
    { id: 'powerups', name: 'Power-ups', emoji: '⚡' },
  ] : [
    { id: 'all', name: 'All Items', emoji: '🛍️' },
    { id: 'affordable', name: 'What Can I Buy?', emoji: '💰' },
    { id: 'buddyColors', name: 'Buddy Styles', emoji: '👕' },
    { id: 'backgrounds', name: 'Backgrounds', emoji: '🖼️' },
    { id: 'accessories', name: 'Accessories', emoji: '🎩' },
    { id: 'powerups', name: 'Power-ups', emoji: '⚡' },
  ];
  
  // Show premium items when premium category selected
  if (selectedCategory === 'premium') {
    filteredItems = premiumItems;
  }

  // 🚀 PREMIUM SHOP UI! 💎✨
  if (isPremium) {
    return (
      <div className="min-h-screen relative overflow-hidden">
        {/* Cyber Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-pink-950">
          {/* Animated Grid */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(20)].map((_, i) => (
              <div key={`h-${i}`} className="absolute w-full h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent" style={{top: `${i * 5}%`}} />
            ))}
            {[...Array(20)].map((_, i) => (
              <div key={`v-${i}`} className="absolute h-full w-px bg-gradient-to-b from-transparent via-purple-400 to-transparent" style={{left: `${i * 5}%`}} />
            ))}
          </div>
          
          {/* Floating Particles */}
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full animate-float-particle"
              style={{
                width: Math.random() * 4 + 2 + 'px',
                height: Math.random() * 4 + 2 + 'px',
                background: `${['#0ff', '#f0f', '#ff0'][Math.floor(Math.random() * 3)]}`,
                top: Math.random() * 100 + '%',
                left: Math.random() * 100 + '%',
                boxShadow: `0 0 ${Math.random() * 20 + 10}px currentColor`,
                animationDelay: Math.random() * 5 + 's',
                animationDuration: Math.random() * 15 + 10 + 's'
              }}
            />
          ))}
        </div>

        {/* Content */}
        <div className="relative z-10 p-6 max-w-7xl mx-auto">
          {/* Premium Header */}
          <div className="futuristic-glass p-8 mb-8 animate-card-appear">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
              <div>
                <h1 className="text-5xl font-bold glow-text flex items-center gap-3 mb-3">
                  <span className="text-6xl drop-shadow-[0_0_15px_#0ff">💎</span> Premium Shop
                </h1>
                <p className="text-cyan-300 font-semibold text-xl">Exclusive legendary items await! ✨</p>
              </div>
              <div className="text-center futuristic-glass p-6 border-4 border-yellow-400/50 shadow-[0_0_40px_rgba(255,215,0,0.5)]">
                <p className="text-sm text-cyan-300 font-semibold mb-2">Your Balance</p>
                <p className="text-5xl font-bold glow-text">
                  🪙 {coins}
                </p>
              </div>
            </div>

            {/* Back to Hub Button */}
            <Link href="/kid">
              <button className="bg-gradient-to-r from-cyan-500 to-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-[0_0_30px_rgba(0,255,255,0.5)] hover:shadow-[0_0_50px_rgba(0,255,255,0.8)] hover:scale-105 transition-all duration-300 border-2 border-white/30 mb-6">
                ← Back to Hub
              </button>
            </Link>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-3">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => {
                    setSelectedCategory(cat.id);
                    soundEffects?.playClick();
                  }}
                  className={`px-6 py-3 rounded-xl font-bold transition-all transform hover:scale-110 ${
                    selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-pink-500 via-purple-500 to-cyan-500 text-white shadow-[0_0_30px_rgba(255,0,255,0.7)] scale-110 border-2 border-white/50'
                      : 'bg-white/10 backdrop-blur-xl text-cyan-300 border-2 border-cyan-400/30 hover:border-cyan-400/60 hover:bg-white/20'
                  }`}
                >
                  <span className="text-2xl mr-2">{cat.emoji}</span> {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Premium Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item, index) => {
              const isPurchased = purchasedItems.includes(item.id);
              const canAfford = coins >= item.price;
              const isPremiumItem = item.id >= 1000;

              return (
                <div
                  key={item.id}
                  className="group cursor-pointer"
                  onClick={() => !isPurchased && handlePurchase(item)}
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  <div className="relative preserve-3d hover:rotate-y-6 transition-all duration-500 animate-card-appear">
                    {/* Glow effect */}
                    <div className={`absolute inset-0 ${
                      isPremiumItem 
                        ? 'bg-gradient-to-br from-yellow-400/40 via-pink-500/40 to-purple-500/40' 
                        : 'bg-gradient-to-br from-cyan-400/30 via-purple-500/30 to-pink-400/30'
                    } rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100`} />
                    
                    {/* Card */}
                    <div className={`relative futuristic-glass p-6 rounded-2xl ${
                      isPurchased 
                        ? 'border-4 border-green-400 shadow-[0_0_40px_rgba(0,255,0,0.6)]' 
                        : canAfford 
                          ? 'border-2 border-white/20 group-hover:border-white/60 group-hover:shadow-[0_0_60px_rgba(0,255,255,0.6)]' 
                          : 'border-2 border-red-400/30 opacity-60'
                    } transition-all duration-300`}>
                      {/* Premium Badge */}
                      {isPremiumItem && !isPurchased && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-yellow-400 via-pink-500 to-purple-600 text-white text-xs font-bold px-3 py-2 rounded-full shadow-[0_0_20px_rgba(255,215,0,0.8)] animate-pulse z-10">
                          ✨ PREMIUM
                        </div>
                      )}
                      
                      {/* Owned Badge */}
                      {isPurchased && (
                        <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-400 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-[0_0_20px_rgba(0,255,0,0.6)] z-10">
                          ✓ Owned
                        </div>
                      )}
                      
                      {/* Icon */}
                      <div className={`text-7xl mb-4 transition-all duration-300 ${
                        isPurchased ? 'grayscale' : 'group-hover:scale-125 group-hover:rotate-12'
                      } drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]`}>
                        {item.emoji}
                      </div>
                      
                      {/* Name */}
                      <h3 className={`text-2xl font-bold mb-2 ${
                        isPremiumItem ? 'glow-text' : 'text-white'
                      } group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all duration-300`}>
                        {item.name}
                      </h3>
                      
                      {/* Description */}
                      <p className="text-sm text-cyan-200 font-semibold mb-4">{item.description}</p>
                      
                      {/* Price & Action */}
                      {!isPurchased && (
                        <div className="flex items-center justify-between mt-4 pt-4 border-t-2 border-white/20">
                          <div className="text-2xl font-bold text-yellow-400 drop-shadow-[0_0_10px_rgba(255,215,0,0.8)]">
                            🪙 {item.price}
                          </div>
                          <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
                            canAfford 
                              ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-[0_0_20px_rgba(0,255,0,0.5)]' 
                              : 'bg-red-500/30 text-red-300 border border-red-400/50'
                          }`}>
                            {canAfford ? '✓ Buy Now' : '🔒 Locked'}
                          </div>
                        </div>
                      )}
                      
                      {/* Holographic shine */}
                      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Animations */}
        <style jsx>{`
          @keyframes float-particle {
            0%, 100% { transform: translateY(0) translateX(0); opacity: 0.3; }
            50% { transform: translateY(-100px) translateX(50px); opacity: 1; }
          }
          @keyframes card-appear {
            from { opacity: 0; transform: translateY(30px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .rotate-y-6:hover { transform: rotateY(6deg) rotateX(-3deg); }
        `}</style>

        {/* Weekly Animation Modal */}
        {showWeeklyAnimation && (
          <WeeklyAnimation onClose={() => setShowWeeklyAnimation(false)} />
        )}

        {/* Background Music */}
        <BackgroundMusic />
      </div>
    );
  }

  // Original Shop UI
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-6 relative">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-3xl shadow-2xl p-8 mb-8 border-2 border-orange-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-6">
            <div>
              <h1 className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-orange-600 to-yellow-600 bg-clip-text text-transparent flex items-center gap-3">
                <span className="text-5xl">🏪</span> Learning Shop
              </h1>
              <p className="text-gray-700 mt-2 font-semibold text-lg">Spend your coins on awesome items! ✨</p>
            </div>
            <div className="text-center bg-white/90 backdrop-blur rounded-2xl p-6 border-2 border-yellow-300 shadow-lg">
              <p className="text-sm text-gray-600 font-semibold">Your Balance</p>
              <p className="text-4xl font-bold bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                🪙 {coins}
              </p>
            </div>
          </div>

          {/* WEEKLY ANIMATION SECTION */}
          <div className="mb-6 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl p-6 text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-3xl animate-bounce">🎭</span>
                  <h3 className="text-2xl font-bold">This Week's Animation!</h3>
                  <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-sm font-bold">Week {currentWeek}</span>
                </div>
                <p className="text-sm opacity-90 mb-3">
                  {weeklyAnimationUnlocked 
                    ? "✅ Unlocked! Watch anytime!" 
                    : "🎬 Unlock this week's hilarious animation!"}
                </p>
                <p className="text-xs opacity-75 italic">
                  {currentWeek % 52 === 1 && "Alex's Video Game Logic Loop 🎮"}
                  {currentWeek % 52 !== 1 && "New animation each week!"}
                </p>
              </div>
              <div>
                {weeklyAnimationUnlocked ? (
                  <button
                    onClick={() => {
                      setShowWeeklyAnimation(true);
                      soundEffects?.playClick();
                    }}
                    className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition"
                  >
                    ▶️ Watch Again
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (coins >= 10) {
                        const newCoins = coins - 10;
                        setCoins(newCoins);
                        setWeeklyAnimationUnlocked(true);
                        
                        // Save to localStorage
                        const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
                        currentKid.coins = newCoins;
                        localStorage.setItem('currentKid', JSON.stringify(currentKid));
                        localStorage.setItem(`weeklyAnimation_week${currentWeek}`, 'true');
                        
                        // Play animation
                        setShowWeeklyAnimation(true);
                        soundEffects?.playCelebration();
                      } else {
                        alert('Not enough coins! You need 10 coins.');
                        soundEffects?.playWrong();
                      }
                    }}
                    className="bg-yellow-400 hover:bg-yellow-500 text-black px-6 py-3 rounded-xl font-bold text-lg shadow-lg transform hover:scale-105 transition"
                  >
                    🪙 Unlock for 10 Coins
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3 mt-6 p-4 bg-white/80 backdrop-blur rounded-2xl">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  soundEffects?.playClick();
                }}
                className={`px-5 py-3 rounded-2xl font-bold transition-all transform hover:scale-110 ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-xl scale-110'
                    : 'bg-gradient-to-r from-gray-100 to-gray-200 text-gray-800 hover:from-gray-200 hover:to-gray-300 shadow-md'
                }`}
              >
                <span className="text-xl mr-2">{cat.emoji}</span> {cat.name}
              </button>
            ))}
          </div>
        </div>

        {/* Ultra Secret Item Reveal Message */}
        {coins >= 100000 && !purchasedItems.includes(999) && (
          <div className="bg-black rounded-3xl shadow-2xl p-6 mb-6 border-4 border-red-600 relative overflow-hidden">
            {/* Glitch overlay effect */}
            <div className="absolute inset-0 opacity-20 pointer-events-none animate-pulse">
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500"></div>
              <div className="absolute top-1/3 left-0 w-full h-1 bg-cyan-500"></div>
              <div className="absolute top-2/3 left-0 w-full h-1 bg-lime-500"></div>
              <div className="absolute bottom-0 left-0 w-full h-1 bg-purple-500"></div>
            </div>
            <div className="text-center relative z-10">
              <div className="text-6xl mb-3 animate-pulse" style={{
                animation: 'glitch 0.3s infinite',
                textShadow: '2px 0 red, -2px 0 cyan'
              }}>⚠️💀⚠️</div>
              <h2 className="text-3xl font-bold text-red-500 mb-2" style={{
                animation: 'glitch 0.5s infinite',
                textShadow: '2px 0 red, -2px 0 cyan'
              }}>
                █▓░ C̴O̸R̸R̵U̷P̶T̸E̴D̸ ̶I̶T̴E̵M̷ ̶D̸E̴T̸E̶C̸T̷E̸D̶ ░▓█
              </h2>
              <p className="text-lime-400 text-lg font-mono">
                {`>> SYSTEM ERROR: UNKNOWN ENTITY FOUND IN DATABASE`}
              </p>
              <p className="text-cyan-400 text-sm mt-2 font-mono">
                {`>> WARNING: DO NOT PURCHASE // REALITY BREACH IMMINENT`}
              </p>
              <p className="text-red-400 text-xs mt-1 font-mono animate-pulse">
                {`>> [CORRUPTED_DATA.exe] is running...`}
              </p>
            </div>
            <style jsx>{`
              @keyframes glitch {
                0% { transform: translate(0); }
                20% { transform: translate(-2px, 2px); }
                40% { transform: translate(-2px, -2px); }
                60% { transform: translate(2px, 2px); }
                80% { transform: translate(2px, -2px); }
                100% { transform: translate(0); }
              }
            `}</style>
          </div>
        )}

        {/* Shop Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {filteredItems.map((item, index) => {
            const isPurchased = purchasedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div
                key={item.id}
                className={`rounded-3xl shadow-xl p-6 transition-all transform hover:scale-105 hover:shadow-2xl relative overflow-hidden group animate-slideInUp ${
                  isPurchased 
                    ? 'border-4 border-green-400 bg-gradient-to-br from-green-50 to-emerald-50' 
                    : 'bg-white/95 backdrop-blur border-2 border-gray-200 hover:border-orange-300'
                }`}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                {/* Owned Badge */}
                {isPurchased && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg flex items-center gap-1">
                    <span>✓</span> Owned
                  </div>
                )}

                {/* Item Content */}
                <div className="text-center mb-5 relative z-10">
                  <div className="mb-4 text-7xl group-hover:scale-125 transition-transform">
                    {item.emoji}
                  </div>
                  <h3 className="font-bold text-2xl bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
                    {item.name}
                  </h3>
                  <p className="mt-3 text-sm text-gray-700 leading-relaxed font-semibold">
                    {item.description}
                  </p>
                </div>

                {/* Price and Action */}
                <div className="flex flex-col gap-3 mt-5 pt-5 border-t-2 border-gray-200 relative z-10">
                  <div className="text-center">
                    <p className="text-xs text-gray-600 mb-1">Price</p>
                    <p className="font-bold text-3xl bg-gradient-to-r from-yellow-500 to-orange-600 bg-clip-text text-transparent">
                      🪙 {item.price.toLocaleString()}
                    </p>
                  </div>
                  {isPurchased ? (
                    <div className="bg-gradient-to-r from-green-400 to-emerald-400 text-white px-4 py-3 rounded-2xl font-bold text-center text-lg shadow-lg">
                      ✨ Already Yours! ✨
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`px-6 py-3 rounded-2xl font-bold transition-all transform hover:scale-105 text-lg ${
                        canAfford
                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white hover:shadow-xl shadow-lg'
                        : 'bg-gray-300 text-gray-600 cursor-not-allowed opacity-50'
                      }`}
                    >
                      {canAfford ? '🛒 Buy Now' : '❌ Need ' + (item.price - coins) + ' more'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Back Button */}
        <div className="fixed bottom-6 left-6">
          <Link href="/kid/lessons">
            <button
              onClick={() => soundEffects?.playClick()}
              className="bg-white text-gray-700 px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 font-semibold"
            >
              ← Back to Lessons
            </button>
          </Link>
        </div>

        {/* How to Earn Coins Info */}
        <div className="fixed bottom-6 right-6 bg-white rounded-2xl shadow-xl p-4 max-w-xs">
          <h4 className="font-bold text-gray-800 mb-2">💡 How to Earn Coins</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>🎓 Complete lessons: +10 coins</li>
            <li>🎮 Win games: +15 coins</li>
            <li>🏆 Unlock achievements: +25 coins</li>
            <li>🔥 Daily streak: +5 coins/day</li>
          </ul>
        </div>

        <BackgroundMusic />
      </div>
      
      {/* All CSS animations as regular style tag */}
      <style>{`
        @keyframes glitchOverlay {
          0% { opacity: 0.3; }
          25% { opacity: 0.7; }
          50% { opacity: 0.2; }
          75% { opacity: 0.8; }
          100% { opacity: 0.3; }
        }
        @keyframes scanlinesFast {
          0% { transform: translateY(0); }
          100% { transform: translateY(20px); }
        }
        @keyframes glitch {
          0% { transform: translate(0); }
          20% { transform: translate(-2px, 2px); }
          40% { transform: translate(-2px, -2px); }
          60% { transform: translate(2px, 2px); }
          80% { transform: translate(2px, -2px); }
          100% { transform: translate(0); }
        }
        @keyframes glitchCard {
          0% { transform: translate(0); filter: hue-rotate(0deg); }
          10% { transform: translate(-2px, 1px); }
          20% { transform: translate(2px, -1px); filter: hue-rotate(90deg); }
          30% { transform: translate(-1px, 2px); }
          40% { transform: translate(1px, -2px); filter: hue-rotate(180deg); }
          50% { transform: translate(-2px, -1px); }
          60% { transform: translate(2px, 1px); filter: hue-rotate(270deg); }
          70% { transform: translate(-1px, -2px); }
          80% { transform: translate(1px, 2px); }
          90% { transform: translate(0); filter: hue-rotate(360deg); }
          100% { transform: translate(0); filter: hue-rotate(0deg); }
        }
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(10px); }
        }
        @keyframes glitchSweep {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glitchEmoji {
          0% { transform: scale(1) rotate(0deg); }
          25% { transform: scale(1.1) rotate(-5deg); }
          50% { transform: scale(0.9) rotate(5deg); }
          75% { transform: scale(1.05) rotate(-3deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        @keyframes glitchText {
          0% { clip-path: inset(0 0 0 0); }
          20% { clip-path: inset(20% 0 30% 0); transform: translateX(-5px); }
          40% { clip-path: inset(60% 0 10% 0); transform: translateX(5px); }
          60% { clip-path: inset(10% 0 80% 0); transform: translateX(-3px); }
          80% { clip-path: inset(50% 0 20% 0); transform: translateX(3px); }
          100% { clip-path: inset(0 0 0 0); transform: translateX(0); }
        }
        @keyframes glitchButton {
          0%, 100% { transform: scale(1); filter: hue-rotate(0deg); }
          25% { transform: scale(1.05); filter: hue-rotate(90deg); }
          50% { transform: scale(0.95); filter: hue-rotate(180deg); }
          75% { transform: scale(1.02); filter: hue-rotate(270deg); }
        }
        @keyframes slideInRight {
          from { transform: translateX(100px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes walkRight {
          from { transform: translateX(0); }
          to { transform: translateX(200px); opacity: 0; }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }
      `}</style>

      {/* Weekly Animation Modal */}
      {showWeeklyAnimation && (
        <WeeklyAnimation
          weekNumber={currentWeek % 52 || 1} // Cycle through 52 weeks
          onClose={() => setShowWeeklyAnimation(false)}
        />
      )}
    </div>
  );
}
