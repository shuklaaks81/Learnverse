/**
 * FeatureGrid Component
 * 
 * Grid layout displaying all feature cards:
 * - Games
 * - Community Learning
 * - Lessons
 * - Tutor
 * - Holiday Bookings
 * - News Updates
 * - History Timeline
 * - Theater
 * - Units
 * - Leaderboard
 * 
 * Responsive grid with hover animations
 * Premium Mode: 3D holographic cards with neon effects
 */

'use client';

import { useRouter } from "next/navigation";
import { FeatureCard } from "./FeatureCard";

const FEATURE_CARDS = [
  {
    emoji: "✨",
    title: "Lesson Generator",
    description: "Create custom lessons with AI!",
    gradient: "bg-gradient-to-br from-purple-500 via-pink-500 to-red-500",
    route: "/kid/lesson-generator",
  },
  {
    emoji: "🎮",
    title: "Games",
    description: "Play interactive games",
    gradient: "bg-gradient-to-br from-blue-500 to-cyan-400",
    route: "/kid/games",
  },
  {
    emoji: "📚",
    title: "Community Learning",
    description: "Learn with friends",
    gradient: "bg-gradient-to-br from-green-500 to-teal-400",
    route: "/kid/community-learning",
  },
  {
    emoji: "📖",
    title: "Lessons",
    description: "Interactive lessons",
    gradient: "bg-gradient-to-br from-orange-500 to-pink-400",
    route: "/kid/lessons",
  },
  {
    emoji: "🤖",
    title: "Tutor",
    description: "AI tutoring support",
    gradient: "bg-gradient-to-br from-purple-500 to-indigo-400",
    route: "/kid/tutor",
  },
  {
    emoji: "🏖️",
    title: "Holiday Bookings",
    description: "Plan your break",
    gradient: "bg-gradient-to-br from-yellow-500 to-orange-400",
    route: "/kid/book-holiday",
  },
  {
    emoji: "📰",
    title: "News",
    description: "Latest updates",
    gradient: "bg-gradient-to-br from-red-500 to-pink-400",
    route: "/kid/news",
  },
  {
    emoji: "🕐",
    title: "History Timeline",
    description: "Explore the past",
    gradient: "bg-gradient-to-br from-amber-600 to-yellow-500",
    route: "/kid/history-timeline",
  },
  {
    emoji: "🎭",
    title: "Theater",
    description: "Watch performances",
    gradient: "bg-gradient-to-br from-violet-500 to-purple-400",
    route: "/kid/theater",
  },
  {
    emoji: "🏗️",
    title: "Creation Studio",
    description: "Build & create",
    gradient: "bg-gradient-to-br from-lime-500 to-green-400",
    route: "/kid/creation-studio",
  },
  {
    emoji: "⭐",
    title: "Units",
    description: "Learn by units",
    gradient: "bg-gradient-to-br from-indigo-500 to-blue-400",
    route: "/kid/units",
  },
  {
    emoji: "🧪",
    title: "Fun Lab",
    description: "Unlock crazy experiments! 🎮",
    gradient: "bg-gradient-to-br from-yellow-400 via-orange-500 to-pink-600 animate-gradient-shift",
    route: "/kid/fun-lab",
  },
  {
    emoji: "⚙️",
    title: "Settings",
    description: "Manage your account",
    gradient: "bg-gradient-to-br from-gray-500 to-gray-600",
    route: "/kid/settings",
  },
  {
    emoji: "🛍️",
    title: "Premium Shop",
    description: "Exclusive items! 💎",
    gradient: "bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600",
    route: "/kid/shop",
    premiumOnly: true,
  },
];

interface FeatureGridProps {
  isPremium?: boolean;
}

export function FeatureGrid({ isPremium = false }: FeatureGridProps) {
  const router = useRouter();

  // Filter cards based on premium status
  const displayCards = isPremium 
    ? FEATURE_CARDS 
    : FEATURE_CARDS.filter(card => !card.premiumOnly);

  // Premium version with holographic 3D cards
  if (isPremium) {
    return (
      <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayCards.map((card, index) => (
          <div
            key={card.route}
            onClick={() => router.push(card.route)}
            className="group cursor-pointer perspective-1000 animate-card-appear"
            style={{animationDelay: `${index * 0.05}s`}}
          >
            <div className="relative preserve-3d hover:rotate-y-12 transition-all duration-500">
              {/* Glow effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/20 via-purple-500/20 to-pink-400/20 rounded-2xl blur-md group-hover:blur-lg transition-all duration-300 opacity-0 group-hover:opacity-100 pointer-events-none" />
              
              {/* Card */}
              <div className={`relative ${card.gradient} rounded-2xl p-6 shadow-[0_0_30px_rgba(0,255,255,0.3)] border-2 border-white/20 group-hover:border-white/60 group-hover:shadow-[0_0_60px_rgba(0,255,255,0.6)] transition-all duration-300 backdrop-blur-xl`}>
                {/* Premium badge for exclusive items */}
                {card.premiumOnly && (
                  <div className="absolute -top-2 -right-2 bg-gradient-to-r from-yellow-400 to-pink-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg animate-pulse">
                    PREMIUM
                  </div>
                )}
                
                {/* Icon with hover animation */}
                <div className="text-6xl mb-3 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]">
                  {card.emoji}
                </div>
                
                {/* Title with glow */}
                <h3 className="text-xl font-bold text-white mb-2 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] group-hover:drop-shadow-[0_0_20px_rgba(0,255,255,0.8)] transition-all duration-300">
                  {card.title}
                </h3>
                
                {/* Description */}
                <p className="text-sm text-white/90 font-semibold">{card.description}</p>
                
                {/* Holographic shine effect */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
              </div>
            </div>
          </div>
        ))}
        
        <style jsx>{`
          .perspective-1000 { perspective: 1000px; }
          .preserve-3d { transform-style: preserve-3d; }
          .rotate-y-12:hover { transform: rotateY(12deg) rotateX(-5deg); }
        `}</style>
      </div>
    );
  }

  // Original version
  return (
    <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {displayCards.map((card) => (
        <FeatureCard
          key={card.route}
          emoji={card.emoji}
          title={card.title}
          description={card.description}
          gradient={card.gradient}
          onClick={() => router.push(card.route)}
        />
      ))}
    </div>
  );
}
