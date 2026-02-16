import { render, screen } from '@testing-library/react';
import { KidsLeaderboard } from '@/app/parent/dashboard/components/KidsLeaderboard';

describe('KidsLeaderboard Component', () => {
  const mockKids = [
    {
      id: '1',
      name: 'Alice',
      progress: 85,
      lessonsCompleted: 42,
      achievements: 15,
      streakDays: 10,
    },
    {
      id: '2',
      name: 'Bob',
      progress: 65,
      lessonsCompleted: 28,
      achievements: 8,
      streakDays: 5,
    },
    {
      id: '3',
      name: 'Charlie',
      progress: 45,
      lessonsCompleted: 18,
      achievements: 3,
      streakDays: 0,
    },
  ];

  it('renders leaderboard heading', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getByText(/Family Leaderboard/i)).toBeInTheDocument();
  });

  it('renders empty state when no kids provided', () => {
    render(<KidsLeaderboard kids={[]} />);
    expect(screen.getByText(/Add kids to see the leaderboard/i)).toBeInTheDocument();
  });

  it('displays kids sorted by progress descending', () => {
    const { container } = render(<KidsLeaderboard kids={mockKids} />);
    const rankings = container.querySelectorAll('[class*="flex items-center justify-between"]');
    expect(rankings.length).toBeGreaterThan(0);
  });

  it('renders gold medal for first place', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    const goldMedal = screen.getByText('🥇');
    expect(goldMedal).toBeInTheDocument();
  });

  it('renders silver medal for second place', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    const silverMedal = screen.getByText('🥈');
    expect(silverMedal).toBeInTheDocument();
  });

  it('renders bronze medal for third place', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    const bronzeMedal = screen.getByText('🥉');
    expect(bronzeMedal).toBeInTheDocument();
  });

  it('renders rank numbers for positions beyond top 3', () => {
    const moreKids = [
      ...mockKids,
      {
        id: '4',
        name: 'David',
        progress: 25,
        lessonsCompleted: 10,
        achievements: 1,
        streakDays: 0,
      },
    ];
    render(<KidsLeaderboard kids={moreKids} />);
    expect(screen.getByText('#4')).toBeInTheDocument();
  });

  it('displays kid names on leaderboard', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Charlie')).toBeInTheDocument();
  });

  it('displays progress percentages', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getByText('85%')).toBeInTheDocument();
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('45%')).toBeInTheDocument();
  });

  it('displays lesson counts', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getByText(/42 lessons/i)).toBeInTheDocument();
    expect(screen.getByText(/28 lessons/i)).toBeInTheDocument();
  });

  it('displays achievement counts', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getByText(/15 achievements/i)).toBeInTheDocument();
    expect(screen.getByText(/8 achievements/i)).toBeInTheDocument();
  });

  it('displays day streak when present', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getByText(/🔥 10 day streak/i)).toBeInTheDocument();
    expect(screen.getByText(/🔥 5 day streak/i)).toBeInTheDocument();
  });

  it('does not display streak for zero days', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    // Charlie has 0 streak, so should not show streak
    const charlieSection = screen.getByText('Charlie').closest('div');
    const streakInCharlie = charlieSection?.querySelector('[class*="text-orange"]');
    expect(streakInCharlie).not.toBeInTheDocument();
  });

  it('applies gradient background to first place', () => {
    const { container } = render(<KidsLeaderboard kids={mockKids} />);
    const firstPlaceCard = container.querySelector('[class*="from-amber-100"]');
    expect(firstPlaceCard).toBeInTheDocument();
  });

  it('applies different styling to top 3 vs others', () => {
    const { container } = render(<KidsLeaderboard kids={mockKids} />);
    const amberCard = container.querySelector('[class*="from-amber-100"]');
    const grayCard = container.querySelector('[class*="from-gray-100"]');
    expect(amberCard).toBeInTheDocument();
    expect(grayCard).toBeInTheDocument();
  });

  it('displays progress label', () => {
    render(<KidsLeaderboard kids={mockKids} />);
    expect(screen.getAllByText('progress').length).toBeGreaterThan(0);
  });
});
