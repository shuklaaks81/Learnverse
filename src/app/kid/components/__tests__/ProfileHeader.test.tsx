import { render, screen, fireEvent } from '@testing-library/react';
import { ProfileHeader } from '@/app/kid/components/ProfileHeader';

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe('ProfileHeader Component', () => {
  const defaultProps = {
    kidName: 'Alex',
    progress: 65,
    coins: 250,
    streak: 7,
    hasMultipleAccounts: false,
  };

  it('renders kid name', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('Alex')).toBeInTheDocument();
  });

  it('displays progress percentage', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('65% Complete')).toBeInTheDocument();
  });

  it('displays coins count', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('250')).toBeInTheDocument();
  });

  it('displays streak days', () => {
    render(<ProfileHeader {...defaultProps} />);
    expect(screen.getByText('7 day streak')).toBeInTheDocument();
  });

  it('renders achievements link', () => {
    const { container } = render(<ProfileHeader {...defaultProps} />);
    const achievementsLink = container.querySelector('a[href="/kid/achievements"]');
    expect(achievementsLink).toBeInTheDocument();
  });

  it('renders daily challenge button', () => {
    const { container } = render(<ProfileHeader {...defaultProps} />);
    const challengeButton = container.querySelector('a[href="/kid/daily-challenge"]');
    expect(challengeButton).toBeInTheDocument();
  });

  it('shows Sign Out button when single account', () => {
    render(<ProfileHeader {...defaultProps} hasMultipleAccounts={false} />);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  it('shows Switch Account button when multiple accounts', () => {
    render(<ProfileHeader {...defaultProps} hasMultipleAccounts={true} />);
    expect(screen.getByText('🔄 Switch Account')).toBeInTheDocument();
  });

  it('renders progress ring SVG', () => {
    const { container } = render(<ProfileHeader {...defaultProps} />);
    const svg = container.querySelector('svg');
    expect(svg).toBeInTheDocument();
    const circles = container.querySelectorAll('circle');
    expect(circles.length).toBeGreaterThan(1);
  });

  it('applies progress calculation to SVG circle', () => {
    const { container } = render(<ProfileHeader {...defaultProps} progress={50} />);
    const progressCircle = container.querySelector('circle[stroke="#10b981"]');
    expect(progressCircle).toBeInTheDocument();
  });
});
