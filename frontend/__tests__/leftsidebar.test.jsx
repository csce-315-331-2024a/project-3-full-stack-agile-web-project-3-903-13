import React from 'react';
import { render, screen } from '@testing-library/react';
import LeftSidebar from '../src/components/LeftSidebar';
import { usePathname } from 'next/navigation';
import { useRouter } from 'next/router';

jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}));

jest.mock('next/router', () => ({
  useRouter: jest.fn(),
}));

describe('LeftSidebar', () => {
  beforeEach(() => {
    usePathname.mockReturnValue('/employee/burgers');
    useRouter.mockReturnValue({ asPath: '/employee/burgers' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders without crashing', () => {
    render(<LeftSidebar />);
  });

  it('renders the Rev\'s Grill logo', () => {
    render(<LeftSidebar />);
    const logoImage = screen.getByAltText("Rev's Grill Logo");
    expect(logoImage).toBeInTheDocument();
  });

  it('renders the correct number of links', () => {
    render(<LeftSidebar />);
    const links = screen.getAllByRole('link');
    expect(links).toHaveLength(6);
  });

  it('applies the active class to the correct link', () => {
    render(<LeftSidebar />);
    const activeLink = screen.getByTitle('Place an Order');
    expect(activeLink).toHaveClass('left-sidebar-link-active');
  });

  it('updates the page height on window resize', () => {
    const mockResizeHandler = jest.fn();
    window.addEventListener = jest.fn((event, handler) => {
      if (event === 'resize') {
        mockResizeHandler(handler);
      }
    });

    render(<LeftSidebar />);

    const resizeEvent = new Event('resize');
    window.dispatchEvent(resizeEvent);

    expect(mockResizeHandler).toHaveBeenCalled();
  });
});