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
 */

'use client';

import { useRouter } from "next/navigation";
import { FeatureCard } from "./FeatureCard";

const FEATURE_CARDS = [
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
];

export function FeatureGrid() {
  const router = useRouter();

  return (
    <div className="w-full max-w-5xl grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {FEATURE_CARDS.map((card) => (
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
