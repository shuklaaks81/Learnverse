"use client";

import Link from "next/link";
import { LandingPageHero } from "./components/LandingPageHero";
import { AccountSelectionCards } from "./components/AccountSelectionCards";

/**
 * Landing Page - Home Route
 * 
 * Main entry point for the Learnverse application.
 * Displays different account options:
 * - About the App with information
 * - Parent Account login
 * - Kid Account login/creation
 */
export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-3 sm:p-6 lg:p-8 bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 animate-gradient-shift">
      <style jsx>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient-shift {
          background-size: 200% 200%;
          animation: gradient-shift 15s ease infinite;
        }
      `}</style>
      
      <main className="max-w-4xl w-full bg-white/95 backdrop-blur rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border-4 border-white/50">
        <LandingPageHero />
        
        <AccountSelectionCards />
      <Link href="/lab" className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-4 px-8 rounded-2xl shadow-lg text-2xl text-center transition-all">
        🧪 Try the Lab
      </Link>
      </main>
    </div>
  );
}
