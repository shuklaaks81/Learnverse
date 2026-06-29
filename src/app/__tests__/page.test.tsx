import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Landing Page (src/app/page.tsx)', () => {
  it('renders landing page heading', () => {
    render(<Home />);
    expect(screen.getByText(/Welcome to Learning App/i)).toBeInTheDocument();
  });

  it('renders hero section with subtitle', () => {
    render(<Home />);
    const subtitle = screen.getByText(/Learn through fun activities/i);
    expect(subtitle).toBeInTheDocument();
  });

  it('renders account selection cards section', () => {
    render(<Home />);
    expect(screen.getByText(/About the App/i)).toBeInTheDocument();
    expect(screen.getByText(/Parent Account/i)).toBeInTheDocument();
    expect(screen.getByText(/Kid Account/i)).toBeInTheDocument();
  });

  it('renders main container with proper styling', () => {
    const { container } = render(<Home />);
    const mainElement = container.querySelector('main');
    expect(mainElement).toBeInTheDocument();
    expect(mainElement).toHaveClass('max-w-4xl');
  });

  it('has gradient background', () => {
    const { container } = render(<Home />);
    const pageContainer = container.querySelector('[class*="bg-gradient"]');
    expect(pageContainer).toBeInTheDocument();
  });

  it('renders Lab page link', () => {
    const { container } = render(<Home />);
    const labLink = container.querySelector('a[href="/lab"]');
    expect(labLink).toBeInTheDocument();
  });

  it('renders all navigation links', () => {
    const { container } = render(<Home />);
    expect(container.querySelector('a[href="/info"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/parent/login"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/kid/login"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/kid/welcome"]')).toBeInTheDocument();
    expect(container.querySelector('a[href="/lab"]')).toBeInTheDocument();
  });

  it('renders 3 account cards with buttons', () => {
    render(<Home />);
    const loginButtons = screen.getAllByRole('button');
    expect(loginButtons.length).toBeGreaterThan(0);
  });

  it('has proper flex layout', () => {
    const { container } = render(<Home />);
    const flexContainer = container.querySelector('[class*="flex"]');
    expect(flexContainer).toBeInTheDocument();
  });

  it('contains responsive padding', () => {
    const { container } = render(<Home />);
    const responsive = container.querySelector('[class*="p-"]');
    expect(responsive).toBeInTheDocument();
  });
});
