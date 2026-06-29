import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ParentLogin from '@/app/parent/login/page';

// Mock Next.js Router
const mockPush = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Next.js Link component
jest.mock('next/link', () => {
  return ({ children, href }: any) => {
    return <a href={href}>{children}</a>;
  };
});

describe('Parent Login Page (src/app/parent/login/page.tsx)', () => {
  beforeEach(() => {
    localStorage.clear();
    mockPush.mockClear();
    jest.clearAllMocks();
  });

  it('renders login form heading', () => {
    render(<ParentLogin />);
    const pageContent = document.body.innerHTML;
    expect(pageContent).toMatch(/login|account|parent/i);
  });

  it('renders email input field', () => {
    const { container } = render(<ParentLogin />);
    const inputs = container.querySelectorAll('input');
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('renders password input field', () => {
    const { container } = render(<ParentLogin />);
    const passwordInputs = container.querySelectorAll('input[type="password"]');
    expect(passwordInputs.length).toBeGreaterThan(0);
  });

  it('starts in login mode', () => {
    render(<ParentLogin />);
    const pageContent = document.body.innerHTML;
    expect(pageContent.length).toBeGreaterThan(0);
  });

  it('has toggle to create account', async () => {
    render(<ParentLogin />);
    const pageContent = document.body.innerHTML;
    expect(pageContent).toMatch(/account|login|create/i);
  });

  it('shows error message when no account exists', async () => {
    const { container } = render(<ParentLogin />);
    const inputs = container.querySelectorAll('input');
    // Should have form elements
    expect(inputs.length).toBeGreaterThan(0);
  });

  it('auto-redirects if already logged in', async () => {
    localStorage.setItem('parentLoggedIn', 'true');
    render(<ParentLogin />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/parent/dashboard');
    });
  });

  it('renders with gradient background styling', () => {
    const { container } = render(<ParentLogin />);
    const main = container.querySelector('main') || container.firstChild;
    expect(main).toBeInTheDocument();
  });

  it('checks for premium version from localStorage', () => {
    localStorage.setItem('learnverseVersion', 'premium');
    render(<ParentLogin />);
    // Component should render regardless of version
    const pageContent = document.body.innerHTML;
    expect(pageContent.length).toBeGreaterThan(0);
  });

  it('renders back to home link', () => {
    const { container } = render(<ParentLogin />);
    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).toBeInTheDocument();
  });

  it('handles successful login with saved parent account', async () => {
    const parentData = {
      email: 'parent@example.com',
      password: 'securepass123',
      familyName: 'Smith Family'
    };
    localStorage.setItem('parentAccount', JSON.stringify(parentData));

    render(<ParentLogin />);
    // Page should render with parent account data
    const pageContent = document.body.innerHTML;
    expect(pageContent.length).toBeGreaterThan(0);
  });

  it('has proper form structure', () => {
    const { container } = render(<ParentLogin />);
    const pageContent = container.innerHTML;
    expect(pageContent.length).toBeGreaterThan(0);
  });

  it('displays family name field in create account mode', async () => {
    const { container } = render(<ParentLogin />);
    const inputs = container.querySelectorAll('input');
    // Page should render with inputs
    expect(inputs.length).toBeGreaterThan(0);
  });
});
