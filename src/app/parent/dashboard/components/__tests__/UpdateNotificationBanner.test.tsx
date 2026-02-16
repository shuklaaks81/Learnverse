import { render, screen, fireEvent } from '@testing-library/react';
import { UpdateNotificationBanner } from '@/app/parent/dashboard/components/UpdateNotificationBanner';

describe('UpdateNotificationBanner Component', () => {
  const defaultProps = {
    latestVersion: '2.0.0',
    currentVersion: '1.0.0',
    updateInfo: {
      releaseDate: '2026-02-16',
      changelog: {
        'Features': ['New lesson system', 'Parent dashboard redesign'],
        'Fixes': ['Bug fixes for mobile', 'Performance improvements'],
      },
    },
    showChangelog: false,
    onToggleChangelog: jest.fn(),
    onInstall: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders update notification heading', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    expect(screen.getByText(/New Update Available/i)).toBeInTheDocument();
  });

  it('displays latest version', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    expect(screen.getByText(/Version 2.0.0/i)).toBeInTheDocument();
  });

  it('displays release date', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    expect(screen.getByText(/2026-02-16/i)).toBeInTheDocument();
  });

  it('renders View Changes button', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    expect(screen.getByText(/View Changes/i)).toBeInTheDocument();
  });

  it('renders Install Now button', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    expect(screen.getByText(/Install Now/i)).toBeInTheDocument();
  });

  it('calls onToggleChangelog when View Changes button is clicked', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    const viewButton = screen.getByText(/View Changes/i);
    fireEvent.click(viewButton);
    expect(defaultProps.onToggleChangelog).toHaveBeenCalledTimes(1);
  });

  it('calls onInstall when Install Now button is clicked', () => {
    render(<UpdateNotificationBanner {...defaultProps} />);
    const installButton = screen.getByText(/Install Now/i);
    fireEvent.click(installButton);
    expect(defaultProps.onInstall).toHaveBeenCalledTimes(1);
  });

  it('displays changelog when showChangelog is true', () => {
    render(<UpdateNotificationBanner {...defaultProps} showChangelog={true} />);
    expect(screen.getByText(/What's New/i)).toBeInTheDocument();
    // Use getAllByText since Features/Fixes appear in changelog
    const featureItems = screen.getAllByText(/Features/i);
    expect(featureItems.length).toBeGreaterThan(0);
  });

  it('does not display changelog when showChangelog is false', () => {
    render(<UpdateNotificationBanner {...defaultProps} showChangelog={false} />);
    const changelogItems = screen.queryAllByText(/New lesson system/i);
    expect(changelogItems.length).toBe(0);
  });

  it('renders changelog items when visible', () => {
    render(<UpdateNotificationBanner {...defaultProps} showChangelog={true} />);
    expect(screen.getByText(/New lesson system/i)).toBeInTheDocument();
    expect(screen.getByText(/Parent dashboard redesign/i)).toBeInTheDocument();
    expect(screen.getByText(/Bug fixes for mobile/i)).toBeInTheDocument();
  });

  it('applies green gradient background', () => {
    const { container } = render(<UpdateNotificationBanner {...defaultProps} />);
    const banner = container.firstChild;
    expect(banner).toHaveClass('bg-gradient-to-r');
    expect(banner).toHaveClass('from-green-500');
    expect(banner).toHaveClass('to-emerald-600');
  });

  it('displays white text', () => {
    const { container } = render(<UpdateNotificationBanner {...defaultProps} />);
    const banner = container.firstChild;
    expect(banner).toHaveClass('text-white');
  });

  it('shows correct button text when changelog is hidden', () => {
    render(<UpdateNotificationBanner {...defaultProps} showChangelog={false} />);
    expect(screen.getByText(/📋 View Changes/i)).toBeInTheDocument();
  });

  it('shows correct button text when changelog is visible', () => {
    render(<UpdateNotificationBanner {...defaultProps} showChangelog={true} />);
    expect(screen.getByText(/📋 Hide Changes/i)).toBeInTheDocument();
  });
});
