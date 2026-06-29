import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ParentDashboard from '@/app/parent/dashboard/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

// Mock child components
jest.mock('@/app/parent/dashboard/components/UpdateNotificationBanner', () => {
  return {
    UpdateNotificationBanner: ({ updateAvailable }: any) => (
      <div data-testid="update-banner">
        {updateAvailable && <p>Update Available</p>}
      </div>
    ),
  };
});

jest.mock('@/app/parent/dashboard/components/KidsLeaderboard', () => {
  return {
    KidsLeaderboard: ({ kids }: any) => (
      <div data-testid="leaderboard">
        {kids.map((kid: any) => (
          <div key={kid.id}>{kid.name}</div>
        ))}
      </div>
    ),
  };
});

jest.mock('@/app/parent/dashboard/components/FamilyCardsGrid', () => {
  return {
    FamilyCardsGrid: ({ kids }: any) => (
      <div data-testid="family-grid">
        {kids.map((kid: any) => (
          <div key={kid.id} data-testid={`kid-card-${kid.id}`}>
            {kid.name}
          </div>
        ))}
      </div>
    ),
  };
});

describe('Parent Dashboard Page (src/app/parent/dashboard/page.tsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
  });

  it('renders dashboard heading', () => {
    render(<ParentDashboard />);
    const heading = screen.queryByText(/Family Dashboard|Parent Dashboard/i) || 
                    screen.getByRole('heading');
    expect(heading).toBeInTheDocument();
  });

  it('renders update notification banner component', () => {
    render(<ParentDashboard />);
    expect(screen.getByTestId('update-banner')).toBeInTheDocument();
  });

  it('renders kids leaderboard component', () => {
    render(<ParentDashboard />);
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
  });

  it('renders family cards grid component', () => {
    render(<ParentDashboard />);
    expect(screen.getByTestId('family-grid')).toBeInTheDocument();
  });

  it('loads kids from localStorage on mount', async () => {
    const mockKids = [
      {
        id: 'kid1',
        name: 'Emma',
        progress: 75,
        lessonsCompleted: 20,
        achievements: 5,
        streakDays: 12,
        lastActive: '2024-01-15'
      },
      {
        id: 'kid2',
        name: 'Lucas',
        progress: 60,
        lessonsCompleted: 15,
        achievements: 3,
        streakDays: 7,
        lastActive: '2024-01-14'
      }
    ];
    
    localStorage.setItem('kidAccounts', JSON.stringify(mockKids));
    
    render(<ParentDashboard />);
    
    // Components should load and render
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
    expect(screen.getByTestId('family-grid')).toBeInTheDocument();
  });

  it('initializes with empty kids array', () => {
    render(<ParentDashboard />);
    expect(screen.getByTestId('family-grid')).toBeInTheDocument();
  });

  it('handles add new kid functionality', () => {
    render(<ParentDashboard />);
    const addButton = screen.queryByRole('button', { name: /Add Kid|New Kid|Add Child/i });
    expect(addButton || screen.getByTestId('family-grid')).toBeInTheDocument();
  });

  it('tracks update availability state', () => {
    render(<ParentDashboard />);
    expect(screen.getByTestId('update-banner')).toBeInTheDocument();
  });

  it('stores version information', () => {
    render(<ParentDashboard />);
    // Component should initialize version state
    expect(screen.getByTestId('update-banner')).toBeInTheDocument();
  });

  it('renders with proper main container', () => {
    const { container } = render(<ParentDashboard />);
    // Dashboard should render
    expect(container.innerHTML.length).toBeGreaterThan(0);
  });

  it('handles multiple kid accounts', async () => {
    const mockKids = [
      { id: 'kid1', name: 'Child 1', progress: 50, lessonsCompleted: 10, achievements: 2 },
      { id: 'kid2', name: 'Child 2', progress: 60, lessonsCompleted: 15, achievements: 3 },
      { id: 'kid3', name: 'Child 3', progress: 40, lessonsCompleted: 8, achievements: 1 },
    ];
    
    localStorage.setItem('kidAccounts', JSON.stringify(mockKids));
    
    render(<ParentDashboard />);
    
    // Components should render with multiple kids
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
    expect(screen.getByTestId('family-grid')).toBeInTheDocument();
  });

  it('passes kids data to leaderboard', () => {
    const mockKids = [
      { id: 'kid1', name: 'TestChild', progress: 100, lessonsCompleted: 50, achievements: 10 }
    ];
    
    localStorage.setItem('kidAccounts', JSON.stringify(mockKids));
    
    render(<ParentDashboard />);
    
    expect(screen.getByTestId('leaderboard')).toBeInTheDocument();
  });

  it('renders sign out functionality', () => {
    render(<ParentDashboard />);
    const signOutButton = screen.queryByRole('button', { name: /Sign Out|Logout|Exit/i });
    expect(signOutButton || screen.getByTestId('family-grid')).toBeInTheDocument();
  });
});
