import { render, screen, fireEvent } from '@testing-library/react';
import { FeatureCard } from '@/app/kid/components/FeatureCard';

describe('FeatureCard Component', () => {
  const defaultProps = {
    emoji: '🎮',
    title: 'Games',
    description: 'Play fun learning games!',
    gradient: 'bg-gradient-to-br from-blue-500 to-cyan-400',
    onClick: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders emoji', () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('🎮')).toBeInTheDocument();
  });

  it('renders title', () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('Games')).toBeInTheDocument();
  });

  it('renders description', () => {
    render(<FeatureCard {...defaultProps} />);
    expect(screen.getByText('Play fun learning games!')).toBeInTheDocument();
  });

  it('applies gradient class', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('bg-gradient-to-br');
    expect(card).toHaveClass('from-blue-500');
  });

  it('calls onClick handler when card is clicked', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const card = container.firstChild;
    if (card) {
      fireEvent.click(card);
      expect(defaultProps.onClick).toHaveBeenCalledTimes(1);
    }
  });

  it('applies hover and transition classes', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('hover:scale-105');
    expect(card).toHaveClass('hover:shadow-xl');
    expect(card).toHaveClass('transition-all');
  });

  it('has rounded borders', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('rounded-2xl');
  });

  it('applies correct text alignment for center layout', () => {
    const { container } = render(<FeatureCard {...defaultProps} />);
    const card = container.firstChild;
    expect(card).toHaveClass('flex', 'flex-col', 'items-center', 'justify-center');
  });

  it('renders different emoji', () => {
    render(<FeatureCard {...defaultProps} emoji="🏆" />);
    expect(screen.getByText('🏆')).toBeInTheDocument();
  });

  it('works with different gradient colors', () => {
    const { container } = render(
      <FeatureCard {...defaultProps} gradient="bg-gradient-to-br from-red-500 to-orange-400" />
    );
    const card = container.firstChild;
    expect(card).toHaveClass('from-red-500');
    expect(card).toHaveClass('to-orange-400');
  });
});
