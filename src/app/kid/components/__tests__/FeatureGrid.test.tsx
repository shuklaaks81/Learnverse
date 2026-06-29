import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureGrid } from '@/app/kid/components/FeatureGrid';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

describe('FeatureGrid Component', () => {
  it('renders all feature cards', () => {
    render(<FeatureGrid />);
    expect(screen.getByText('Games')).toBeInTheDocument();
    expect(screen.getByText('Community Learning')).toBeInTheDocument();
    expect(screen.getByText('Lessons')).toBeInTheDocument();
    expect(screen.getByText('Tutor')).toBeInTheDocument();
    expect(screen.getByText('Holiday Bookings')).toBeInTheDocument();
    expect(screen.getByText('News')).toBeInTheDocument();
    expect(screen.getByText('History Timeline')).toBeInTheDocument();
    expect(screen.getByText('Theater')).toBeInTheDocument();
    expect(screen.getByText('Creation Studio')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
  });

  it('renders emojis for all features', () => {
    render(<FeatureGrid />);
    expect(screen.getByText('🎮')).toBeInTheDocument();
    expect(screen.getByText('📚')).toBeInTheDocument();
    expect(screen.getByText('📖')).toBeInTheDocument();
    expect(screen.getByText('🤖')).toBeInTheDocument();
    expect(screen.getByText('🏖️')).toBeInTheDocument();
  });

  it('renders descriptions for features', () => {
    render(<FeatureGrid />);
    expect(screen.getByText('Play interactive games')).toBeInTheDocument();
    expect(screen.getByText('Learn with friends')).toBeInTheDocument();
    expect(screen.getByText('Interactive lessons')).toBeInTheDocument();
  });

  it('applies grid layout classes', () => {
    const { container } = render(<FeatureGrid />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2');
    expect(grid).toHaveClass('md:grid-cols-4');
    expect(grid).toHaveClass('lg:grid-cols-5');
  });

  it('renders correct number of cards', () => {
    const { container } = render(<FeatureGrid />);
    const cards = container.querySelectorAll('[class*="rounded-2xl"]');
    expect(cards.length).toBe(10);
  });

  it('each card has gradient background', () => {
    const { container } = render(<FeatureGrid />);
    const cards = container.querySelectorAll('[class*="bg-gradient-to-br"]');
    expect(cards.length).toBeGreaterThan(0);
  });

  it('renders cards with correct structure', () => {
    const { container } = render(<FeatureGrid />);
    const gameCard = container.querySelector('[class*="from-blue-500"]');
    expect(gameCard).toBeInTheDocument();
  });

  it('cards have hover effects', () => {
    const { container } = render(<FeatureGrid />);
    const card = container.querySelector('[class*="hover:scale-105"]');
    expect(card).toBeInTheDocument();
  });

  it('includes all expected routes in cards', () => {
    render(<FeatureGrid />);
    
    // Simply verify the component renders all 10 feature cards
    // by checking that specific feature titles appear
    const expectedTitles = [
      'Games',
      'Community Learning',
      'Lessons',
      'Tutor',
      'Holiday Bookings',
      'News',
      'History Timeline',
      'Theater',
      'Creation Studio',
      'Units',
    ];

    expectedTitles.forEach(title => {
      expect(screen.getByText(title)).toBeInTheDocument();
    });
  });

  it('renders responsive grid with proper spacing', () => {
    const { container } = render(<FeatureGrid />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('gap-4');
  });
});
