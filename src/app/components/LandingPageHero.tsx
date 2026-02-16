/**
 * LandingPageHero Component
 * 
 * Displays the main hero section of the landing page with:
 * - Animated title
 * - Subtitle with value proposition
 * - Lab button for experimental features
 */

export function LandingPageHero() {
  return (
    <>
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

      <h1 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-center mb-2 sm:mb-4 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-500 bg-clip-text text-transparent animate-pulse">
        Welcome to Learning App 🎉
      </h1>
      <p className="text-sm sm:text-base lg:text-lg text-center text-gray-700 mb-6 sm:mb-8 font-semibold">
        Monitor your child&apos;s progress and build amazing learning adventures! ✨
      </p>
    </>
  );
}
