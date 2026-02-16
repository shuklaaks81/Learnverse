# Learnverse - AI Agent Instructions

## Project Overview
Learnverse is a feature-rich educational platform for kids with parent monitoring. Built as a Next.js 16 (App Router) + React 19 + TypeScript PWA with client-side localStorage persistence (no backend/database).

## Architecture & Key Concepts

### Dual-Account System
- **Parent routes**: `/parent/*` - Login, dashboard, kid management
- **Kid routes**: `/kid/*` - Main learning hub with lessons, games, achievements, shop
- **Multi-kid support**: Single parent can manage multiple kid accounts via localStorage array

### State Management Pattern
All state lives in **localStorage** with specific key patterns:
- `currentKid`: Active kid session object `{ kidId, kidName, avatar, coins, streak, ... }`
- `kidAccounts`: Array of all kid profiles
- `kid_${kidId}_completedLessons`: Per-kid lesson completion tracking
- `kid_${kidId}_coins`: Per-kid currency for shop/rewards
- `legendaryMode`, `godMode`, `introDone`: Global feature flags
- `learnverseVersion`: App version ("original" or custom variants)

**Critical pattern**: Always check `typeof window !== 'undefined'` before localStorage access in components that could SSR.

### Content Architecture
1. **Interactive Lessons** ([src/data/interactiveLessons.ts](src/data/interactiveLessons.ts))
   - Object keyed by lesson ID (e.g., `"101"`)
   - Activity types: `intro`, `animation`, `dragdrop`, `matching`, `minigame`, `drawing`, `celebration`
   - Render via [InteractiveLessonComponents.tsx](src/components/InteractiveLessonComponents.tsx)

2. **Topic-Based Lessons** (`/kid/topic/lessons/unit*.ts`)
   - Modular unit files (unit1-8) with structured question/answer content
   - Each lesson has: `{ id, title, icon, description, content[], questions[] }`
   - Linear slide-based presentation model

3. **Games**: Separate routes under `/kid/games/*` (e.g., `blobo-escape`)

### Client-Side Only Components Pattern
Due to Web Audio API, animations, and global listeners, many components require client-only rendering:
```tsx
"use client";  // At file top

// For dynamic imports (e.g., SecretEventProvider wrapper):
const Component = dynamic(() => import('./Component'), { ssr: false });
```

### Sound System
- **Web Audio API** ([src/utils/soundEffects.ts](src/utils/soundEffects.ts)): Procedurally generated sounds (correct/wrong answers, clicks, whoosh)
- **Ocean ambient sounds** ([ClientOceanSoundsWrapper.tsx](src/app/ClientOceanSoundsWrapper.tsx)): Background ambiance with animated ocean ripples
- **Background music** ([BackgroundMusic.tsx](src/components/BackgroundMusic.tsx)): Context-aware music tied to learning activities

### Secret Features & Easter Eggs
- **Secret key listener**: Press `I` to replay intro animation (see [SecretEventProvider.tsx](src/app/SecretEventProvider.tsx))
- **Holiday blocker** ([HolidayBlocker.tsx](src/components/HolidayBlocker.tsx)): Conditionally disables app access during configured dates
- **Legendary/God modes**: Special localStorage flags that unlock enhanced features
- **Lab page** (`/lab`): Experimental features sandbox

### PWA Features
- Service worker at [public/sw.js](public/sw.js)
- Offline page at [public/offline.html](public/offline.html)
- Manifest: [public/manifest.json](public/manifest.json)
- Install prompt: [PWAInstallPrompt.tsx](src/components/PWAInstallPrompt.tsx)

## Development Workflows

### Running the App
```bash
npm run dev      # Development server at localhost:3000
npm run build    # Production build
npm start        # Run production build
npm run lint     # ESLint check
```

### Adding New Lessons
1. **Interactive lessons**: Add entry to `interactiveLessons` object in [src/data/interactiveLessons.ts](src/data/interactiveLessons.ts)
2. **Topic lessons**: Edit relevant `unit*.ts` file in [src/app/kid/topic/lessons/](src/app/kid/topic/lessons/)
3. Ensure lesson IDs follow existing numeric convention (e.g., 101-199 for math)

### Creating New Kid Routes
1. Add folder under [src/app/kid/](src/app/kid/)
2. Create `page.tsx` with `"use client"` directive if using browser APIs
3. Update navigation in [src/app/kid/page.tsx](src/app/kid/page.tsx) or main hub
4. Test multi-account scenarios (sign-out should route to select-account if multiple kids exist)

### Styling Conventions
- **Tailwind-first**: All styling uses Tailwind utility classes
- **Gradient patterns**: Heavy use of `bg-gradient-to-*` for colorful, kid-friendly UI
- **Animation patterns**: `animate-pulse`, `animate-gradient-shift`, custom keyframes in `<style jsx>`
- **Responsive**: Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **Global styles**: [src/app/globals.css](src/app/globals.css) for base styles, [ocean.css](src/app/ocean.css) for ambient effects

### Testing Locally
- Clear localStorage to reset state: `localStorage.clear()` in browser console
- Test multi-kid scenarios: Create 2+ accounts, verify select-account flow
- Test offline: Disable network in DevTools to verify PWA functionality

## Common Patterns

### Creating Interactive Components
Example from [InteractiveLessonComponents.tsx](src/components/InteractiveLessonComponents.tsx):
```tsx
interface Props {
  items: Item[];
  onComplete: () => void;
}

export function CustomActivity({ items, onComplete }: Props) {
  const [state, setState] = useState(initialState);
  
  // Game logic...
  
  useEffect(() => {
    if (gameCompleted) {
      setTimeout(() => onComplete(), 1000);
    }
  }, [gameCompleted]);
  
  return <div>...</div>;
}
```

### Sound Effects Usage
```tsx
import { SoundEffects } from '@/utils/soundEffects';

const sounds = new SoundEffects();
sounds.playCorrect();  // On correct answer
sounds.playWrong();    // On wrong answer
sounds.playClick();    // UI interactions
```

### Accessing Kid Data
```tsx
useEffect(() => {
  const kidData = localStorage.getItem('currentKid');
  if (kidData) {
    const kid = JSON.parse(kidData);
    // Use kid.kidId, kid.coins, etc.
  }
}, []);
```

## Gotchas & Important Notes

1. **No database**: All data is localStorage. Clearing browser data = losing all progress.
2. **Client-side routing only**: No API routes, no server-side data fetching.
3. **TypeScript strict mode**: Use proper types, avoid `any` where possible.
4. **Browser API checks**: Always wrap Web Audio, localStorage in `typeof window !== 'undefined'`.
5. **Multi-account sign-out logic**: Check `kidAccounts.length` to route to either `/kid/kid-selector` or `/kid/login`.
6. **Version system**: `learnverseVersion` localStorage key enables A/B testing of UI variants.

## Key Files Reference
- [src/app/layout.tsx](src/app/layout.tsx) - Root layout with providers, ocean effects, PWA setup
- [src/app/page.tsx](src/app/page.tsx) - Landing page with parent/kid/info navigation
- [src/app/kid/page.tsx](src/app/kid/page.tsx) - Kid account hub (main dashboard)
- [src/data/interactiveLessons.ts](src/data/interactiveLessons.ts) - All interactive lesson definitions
- [src/components/InteractiveLessonComponents.tsx](src/components/InteractiveLessonComponents.tsx) - Reusable lesson activity components
- [src/utils/soundEffects.ts](src/utils/soundEffects.ts) - Web Audio API sound generation

## Dependencies
- Next.js 16 with App Router
- React 19
- TypeScript 5
- Tailwind CSS 3.4
- QRCode library for parent/kid account pairing
- Vercel Analytics for tracking

When making changes, maintain the playful, colorful, kid-friendly aesthetic with emojis, gradients, and animations throughout!
