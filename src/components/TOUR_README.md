# 🎯 Interactive Onboarding Tour

## Overview
An interactive first-time user tour that guides new users through Learnverse features with page navigation and a fun secrets contract!

## Features

### 🚀 Page-by-Page Tour
1. **Welcome Screen** - Introduction to Learnverse
2. **Dashboard** - Overview of the learning hub
3. **Games** 🎮 - Navigates to games page
4. **Lessons** 📚 - Shows lesson library
5. **AI Tutor** 🤖 - Introduces AI assistant
6. **Achievements** 🏆 - Progress tracking
7. **Shop** 🛍️ - Rewards system
8. **Back to Dashboard** 🏠 - Returns home
9. **Secrets Contract** 📜 - Fun agreement about hidden features

### ✨ Interactive Elements
- **Animated progress indicators** with checkmarks
- **Current page display** shows route
- **Back button** to revisit steps
- **Skip option** anytime
- **Loading states** during navigation
- **Premium/Original themes** - Different styling for each version

### 🤫 Secrets Contract
Final step includes a 5-article "contract" that:
- Acknowledges hidden features
- Hints at keyboard shortcuts (Press "I", "T")
- Mentions legendary modes
- Encourages exploration
- Requires checkbox acceptance

## Usage

### First-Time User
Tour automatically shows when:
- User hasn't completed it (`tourCompleted` not in localStorage)
- Launches 500ms after page load
- Works on both Premium and Original versions

### Replay Tour
Three ways to replay:
1. Press **`T`** key anywhere in the app
2. Visit `/secrets` page and check shortcuts
3. Clear localStorage: `localStorage.removeItem('tourCompleted')`

## Technical Details

### Components
- **OnboardingTour** (`src/components/OnboardingTour.tsx`)
  - Main tour modal with navigation
  - Handles routing between pages
  - Manages tour state
  
- **TourIndicator** (`src/components/TourIndicator.tsx`)
  - Optional floating badge
  - Shows "Tour Active" status
  - Can be added to any page

### State Management
- `tourCompleted` (localStorage) - Permanent completion flag
- `tourActive` (sessionStorage) - Temporary during-tour flag
- Component state for current step, navigation, contract acceptance

### Integration
Already integrated in:
- [src/app/kid/page.tsx](../app/kid/page.tsx) - Kid hub dashboard
- [src/app/SecretEventProvider.tsx](../app/SecretEventProvider.tsx) - Keyboard shortcut

### Tour Steps Configuration
Edit `tourSteps` array in `OnboardingTour.tsx`:
```typescript
{
  id: number,
  title: string,
  description: string,
  highlight: string | null,
  position: string,
  route?: string,        // Page to navigate to
  action?: string,       // "navigate" for page change
  emoji?: string,        // Large display emoji
}
```

## Customization

### Add New Step
```typescript
{
  id: 10,
  title: "New Feature 🎨",
  description: "Check out this awesome feature!",
  highlight: null,
  position: "center",
  route: "/kid/new-feature",
  action: "navigate",
  emoji: "🎨",
}
```

### Skip Contract
Remove the last tour step with `description: "contract"`

### Change Themes
Modify `bgGradient`, `cardBg`, `textColor`, `titleColor` variables in the component

## Keyboard Shortcuts
- **`T`** - Replay tour
- **`I`** - Replay Big Bang intro

## Future Enhancements
- [ ] Add spotlight/highlight effects on specific elements
- [ ] Voice narration option
- [ ] Mini-tutorials for complex features
- [ ] Achievement for completing tour
- [ ] Parent/kid separate tours
- [ ] Interactive tooltips that persist after tour
- [ ] Video demonstrations
- [ ] Gamified tour progression

## Notes
- Tour respects Premium/Original styling
- Auto-navigates between pages
- Session-based for single-session tracking
- Mobile-responsive design
- Accessibility: keyboard navigation, screen reader support
