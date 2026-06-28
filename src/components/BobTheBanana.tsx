import Link from 'next/link';

export default function BobTheBanana() {
  return (
    <Link href="/banana-dimension" className="flex items-center justify-center hover:scale-110 transition-transform duration-300">
      <svg
        width="48"
        height="48"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="cursor-pointer drop-shadow-lg"
      >
        {/* Banana body */}
        <path
          d="M 20 60 Q 30 20, 70 30 Q 75 32, 75 40"
          stroke="#FFD700"
          strokeWidth="18"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* Banana peel details */}
        <path
          d="M 20 60 Q 30 20, 70 30"
          stroke="#FFC700"
          strokeWidth="2"
          fill="none"
          opacity="0.6"
        />
        
        {/* Top of banana */}
        <circle cx="20" cy="60" r="9" fill="#8B7500" opacity="0.8" />
        
        {/* Bottom of banana */}
        <circle cx="75" cy="40" r="7" fill="#8B7500" opacity="0.8" />
        
        {/* Shine effect */}
        <ellipse cx="45" cy="25" rx="15" ry="8" fill="#FFFF00" opacity="0.3" />
      </svg>
    </Link>
  );
}
