/**
 * FeatureCard Component
 * 
 * Displays a single feature card with:
 * - Icon/emoji
 * - Title and description
 * - Gradient background
 * - Hover animation
 * - Click handler for navigation
 */

export interface FeatureCardProps {
  emoji: string;
  title: string;
  description: string;
  gradient: string;
  onClick: () => void;
}

export function FeatureCard({
  emoji,
  title,
  description,
  gradient,
  onClick,
}: FeatureCardProps) {
  return (
    <div
      onClick={onClick}
      className={`${gradient} rounded-2xl p-6 shadow-lg border-2 border-white/20 cursor-pointer hover:scale-105 hover:shadow-xl transition-all duration-300 flex flex-col items-center justify-center text-center`}
    >
      <span className="text-5xl mb-3">{emoji}</span>
      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/90">{description}</p>
    </div>
  );
}
