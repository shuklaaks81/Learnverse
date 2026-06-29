import { render, screen } from '@testing-library/react';
import { LandingPageHero } from '@/app/components/LandingPageHero';

describe('LandingPageHero Component', () => {
  it('renders the hero title', () => {
    render(<LandingPageHero />);
    const title = screen.getByText(/Welcome to Learning App/i);
    expect(title).toBeInTheDocument();
  });

  it('renders the subtitle with value proposition', () => {
    render(<LandingPageHero />);
    const subtitle = screen.getByText(/Monitor your child's progress/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('contains h1 tag for title', () => {
    const { container } = render(<LandingPageHero />);
    const heading = container.querySelector('h1');
    expect(heading).toBeInTheDocument();
  });

  it('applies gradient text styling to title', () => {
    const { container } = render(<LandingPageHero />);
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('bg-gradient-to-r');
    expect(heading).toHaveClass('from-purple-600');
    expect(heading).toHaveClass('bg-clip-text');
    expect(heading).toHaveClass('text-transparent');
  });

  it('applies pulse animation to title', () => {
    const { container } = render(<LandingPageHero />);
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('animate-pulse');
  });

  it('applies responsive text sizing', () => {
    const { container } = render(<LandingPageHero />);
    const heading = container.querySelector('h1');
    expect(heading).toHaveClass('text-2xl');
    expect(heading).toHaveClass('sm:text-3xl');
    expect(heading).toHaveClass('lg:text-5xl');
  });

  it('renders paragraph with centered text', () => {
    const { container } = render(<LandingPageHero />);
    const paragraph = container.querySelector('p');
    expect(paragraph).toBeInTheDocument();
    expect(paragraph).toHaveClass('text-center');
  });

  it('includes emojis in rendered text', () => {
    render(<LandingPageHero />);
    expect(screen.getByText(/🎉/)).toBeInTheDocument();
    expect(screen.getByText(/✨/)).toBeInTheDocument();
  });
});
