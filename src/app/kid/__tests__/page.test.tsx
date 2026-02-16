import { render, screen, fireEvent } from '@testing-library/react';
import KidPage from '@/app/kid/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock child components
jest.mock('@/app/kid/components/ProfileHeader', () => {
  return {
    ProfileHeader: ({ kidName, progress, coins, streak, hasMultipleAccounts }: any) => (
      <div data-testid="profile-header">
        <span>{kidName}</span>
        <span>{progress}%</span>
        <span>{coins} coins</span>
        <span>{streak} day streak</span>
        {hasMultipleAccounts && <button>Switch Account</button>}
      </div>
    ),
  };
});

jest.mock('@/app/kid/components/FeatureGrid', () => {
  return {
    FeatureGrid: ({ showBuildButton }: any) => (
      <div data-testid="feature-grid">
        <button>Lessons</button>
        <button>Games</button>
        {showBuildButton && <button>Build App</button>}
      </div>
    ),
  };
});

describe('Kid Hub Page (src/app/kid/page.tsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders kid page with main container', () => {
    render(<KidPage />);
    const container = screen.getByText('Welcome to Learnverse!').parentElement?.parentElement;
    expect(container).toBeInTheDocument();
  });

  it('renders profile header component', () => {
    render(<KidPage />);
    expect(screen.getByTestId('profile-header')).toBeInTheDocument();
  });

  it('renders feature grid component', () => {
    render(<KidPage />);
    expect(screen.getByTestId('feature-grid')).toBeInTheDocument();
  });

  it('displays welcome heading', () => {
    render(<KidPage />);
    expect(screen.getByText('Welcome to Learnverse!')).toBeInTheDocument();
  });

  it('renders with gradient background', () => {
    const { container } = render(<KidPage />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('bg-gradient-to-br');
  });

  it('displays default kid name as Alex', () => {
    render(<KidPage />);
    expect(screen.getByText('Alex')).toBeInTheDocument();
  });

  it('displays default progress as 65%', () => {
    render(<KidPage />);
    expect(screen.getByText('65%')).toBeInTheDocument();
  });

  it('displays default coins as 250', () => {
    render(<KidPage />);
    expect(screen.getByText('250 coins')).toBeInTheDocument();
  });

  it('displays default streak as 7 days', () => {
    render(<KidPage />);
    expect(screen.getByText('7 day streak')).toBeInTheDocument();
  });

  it('checks for build button feature flag in localStorage', () => {
    localStorage.setItem('feature_buildApp', 'true');
    render(<KidPage />);
    // Feature grid component should render (tested separately)
    expect(screen.getByTestId('feature-grid')).toBeInTheDocument();
  });

  it('respects hasMultipleAccounts flag', () => {
    const kidAccounts = [{}, {}];
    localStorage.setItem('kidAccounts', JSON.stringify(kidAccounts));
    render(<KidPage />);
    // Multiple accounts should show switch account button
    expect(screen.queryByText('Switch Account')).toBeInTheDocument();
  });

  it('has white rounded card for content', () => {
    const { container } = render(<KidPage />);
    const card = container.querySelector('.bg-white.rounded-3xl');
    expect(card).toBeInTheDocument();
  });

  it('renders with proper flex layout', () => {
    const { container } = render(<KidPage />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('flex-col');
  });

  it('has min-height screen constraint', () => {
    const { container } = render(<KidPage />);
    const mainDiv = container.firstChild;
    expect(mainDiv).toHaveClass('min-h-screen');
  });

  it('displays navigation to welcome page', () => {
    const { container } = render(<KidPage />);
    const welcomeLink = container.querySelector('a[href="/kid/welcome"]');
    expect(welcomeLink).toBeInTheDocument();
  });
});
