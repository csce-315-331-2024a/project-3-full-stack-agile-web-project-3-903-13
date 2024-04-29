import React from 'react';
import { render, screen } from '@testing-library/react';
import { usePathname } from 'next/navigation';
import LeftSidebar from '../src/components/LeftSidebar';
jest.mock('next/link', () => ({
    __esModule: true,
    default: ({ children, href }) => (
      <a role="link" href={href}>
        {children}
      </a>
    ),
  }));
  
  
  jest.mock('next/navigation', () => ({
    usePathname: jest.fn(() => '/employee/burgers'), // Simulate specific pathname
  }));
  
  jest.mock('next/image', () => ({
    __esModule: true,
    default: jest.fn(() => <img src="" alt="" />), // Mock Image component for basic rendering
  }));
  
  describe('LeftSidebar component', () => {
    it('renders the sidebar with correct navigation links', () => {
      render(<LeftSidebar links={[]} />); // Provide empty links array
  
      // Assert presence of all navigation links
      expect(screen.getAllByRole('link')).toHaveLength(3); // Three links expected
  
      
    });

  });