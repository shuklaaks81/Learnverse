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

  useEffect(() => {
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
  }, []);

  const handlePurchase = (item: ShopItem) => {
    if (coins >= item.price && !purchasedItems.includes(item.id)) {
          oscillator.type = 'square';
          
          gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + 0.05);
        }, 50); // Super fast glitching!
        
        // After 15 seconds of INTENSE glitching, ASCEND!
        setTimeout(() => {
          clearInterval(godGlitchSounds);
          setIsGlitching(false);
          
          const newCoins = coins - item.price;
          const newPurchased = [...purchasedItems, item.id];
          
          setCoins(newCoins);
          setPurchasedItems(newPurchased);
          
          const currentKid = JSON.parse(localStorage.getItem('currentKid') || '{}');
          const updatedKid = { ...currentKid, coins: newCoins };
          localStorage.setItem('currentKid', JSON.stringify(updatedKid));
          
          const kidAccounts = JSON.parse(localStorage.getItem('kidAccounts') || '[]');
          const updatedAccounts = kidAccounts.map((kid: any) => 
            kid.id === currentKid.id ? updatedKid : kid
          );
          localStorage.setItem('kidAccounts', JSON.stringify(updatedAccounts));
          
          localStorage.setItem(`purchased_${currentKid.id}`, JSON.stringify(newPurchased));
          localStorage.setItem('godMode', 'true'); // GOD MODE ACTIVATED!!!
          
          soundEffects?.playVictory();
          setTimeout(() => {
            alert('✨🌟💫 GOD MODE ACTIVATED 💫🌟✨\n\nYOU HAVE TRANSCENDED REALITY!\n\n🌌 Infinite Knowledge Unlocked\n⚡ Control Over Time and Space\n✨ Reality Bends to Your Will\n💎 All Secrets Revealed\n🚀 Unlimited Power\n\n🔮 THE UNIVERSE IS NOW YOURS 🔮\n\nYou are no longer bound by mortal limits...\nReload to witness your ASCENSION!');
          }, 500);
        }, 15000); // 15 seconds of reality-breaking!
        
        return;
      }
      
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
  let allItems = [...shopItems];
  
  // Filter items based on category AND affordability
  let filteredItems = selectedCategory === 'all' 
    ? allItems 
    : allItems.filter(item => item.category === selectedCategory);
  
  // If "affordable" filter is active, show only items you can buy
  if (selectedCategory === 'affordable') {
    filteredItems = allItems.filter(item => item.price <= coins && !purchasedItems.includes(item.id));
  }

  const categories = [
    { id: 'all', name: 'All Items', emoji: '🛍️' },
    { id: 'affordable', name: 'What Can I Buy?', emoji: '💰' },
    { id: 'buddyColors', name: 'Buddy Styles', emoji: '👕' },
    { id: 'backgrounds', name: 'Backgrounds', emoji: '🖼️' },
    { id: 'accessories', name: 'Accessories', emoji: '🎩' },
    { id: 'powerups', name: 'Power-ups', emoji: '⚡' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-400 via-orange-300 to-pink-300 p-6 relative">
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-3xl shadow-xl p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h1 className="text-4xl font-bold text-orange-600">🏪 Learning Shop</h1>
              <p className="text-gray-600 mt-1">Spend your coins on cool items!</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">Your Balance</p>
              <p className="text-3xl font-bold text-yellow-500">🪙 {coins}</p>
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
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => {
                  setSelectedCategory(cat.id);
                  soundEffects?.playClick();
                }}
                className={`px-4 py-2 rounded-full font-semibold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white shadow-lg scale-105'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {cat.emoji} {cat.name}
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
          {filteredItems.map(item => {
            const isPurchased = purchasedItems.includes(item.id);
            const canAfford = coins >= item.price;

            return (
              <div
                key={item.id}
                className={`rounded-2xl shadow-lg p-6 transition-all hover:shadow-xl relative overflow-hidden ${
                  isPurchased ? 'border-4 border-green-400 bg-white' : 'bg-white'
                }`}
              >
                <div className="text-center mb-4 relative z-10">
                  <div className="mb-3 text-6xl">
                    {item.emoji}
                  </div>
                  <h3 className="font-bold text-xl text-gray-800">
                    {item.name}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600">
                    {item.description}
                  </p>
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200 relative z-10">
                  <div className="font-bold text-2xl text-yellow-500">
                    🪙 {item.price.toLocaleString()}
                  </div>
                  {isPurchased ? (
                    <div className="bg-green-100 text-green-700 px-4 py-2 rounded-full font-semibold">
                      ✓ Owned
                    </div>
                  ) : (
                    <button
                      onClick={() => handlePurchase(item)}
                      disabled={!canAfford}
                      className={`px-6 py-2 rounded-full font-semibold transition-all ${
                        canAfford
                        ? 'bg-gradient-to-r from-orange-400 to-pink-400 text-white hover:shadow-lg hover:scale-105'
                        : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Buy' : 'Need more'}
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
