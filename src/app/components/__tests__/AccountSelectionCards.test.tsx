import { render, screen } from '@testing-library/react';
import { AccountSelectionCards } from '@/app/components/AccountSelectionCards';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe('AccountSelectionCards Component', () => {
  it('renders all three account options', () => {
    render(<AccountSelectionCards />);
    expect(screen.getByText(/About the App/i)).toBeInTheDocument();
    expect(screen.getByText(/Parent Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Kid Account/i)).toBeInTheDocument();
  });

  it('renders About card with correct link', () => {
    const { container } = render(<AccountSelectionCards />);
    const aboutCard = container.querySelector('a[href="/info"]');
    expect(aboutCard).toBeInTheDocument();
  });

  it('renders Parent card with login link', () => {
    const { container } = render(<AccountSelectionCards />);
    const parentCard = container.querySelector('a[href="/parent/login"]');
    expect(parentCard).toBeInTheDocument();
  });

  it('renders Kid card with dual action buttons', () => {
    const { container } = render(<AccountSelectionCards />);
    const kidCard = container.querySelector('a[href="/kid/login"]');
    const createButton = container.querySelector('a[href="/kid/welcome"]');
    expect(kidCard).toBeInTheDocument();
    expect(createButton).toBeInTheDocument();
  });

  it('applies grid layout classes', () => {
    const { container } = render(<AccountSelectionCards />);
    const gridContainer = container.querySelector('.grid');
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('md:grid-cols-3');
    expect(gridContainer).toHaveClass('gap-4');
  });

  it('renders card descriptions', () => {
    render(<AccountSelectionCards />);
    expect(screen.getByText(/Learn what makes Learnverse special/i)).toBeInTheDocument();
    expect(screen.getByText(/Monitor your child's progress/i)).toBeInTheDocument();
    expect(screen.getByText(/Learn through fun activities/i)).toBeInTheDocument();
  });

  it('renders button with correct text for About card', () => {
    render(<AccountSelectionCards />);
    expect(screen.getByText(/About & Secrets/i)).toBeInTheDocument();
  });

  it('renders button with correct text for Parent card', () => {
    render(<AccountSelectionCards />);
    expect(screen.getByText(/Parent Login/i)).toBeInTheDocument();
  });

  it('renders buttons with correct text for Kid card', () => {
    render(<AccountSelectionCards />);
    expect(screen.getByText(/Login with Kid ID/i)).toBeInTheDocument();
    expect(screen.getByText(/Create New Account/i)).toBeInTheDocument();
  });

  it('applies gradient backgrounds to cards', () => {
    const { container } = render(<AccountSelectionCards />);
    const gradientElements = container.querySelectorAll('[class*="bg-gradient"]');
    expect(gradientElements.length).toBeGreaterThan(0);
  });

  it('renders hover effects on cards', () => {
    const { container } = render(<AccountSelectionCards />);
    const hoverElements = container.querySelectorAll('[class*="hover:shadow"]');
    expect(hoverElements.length).toBeGreaterThan(0);
  });
});
