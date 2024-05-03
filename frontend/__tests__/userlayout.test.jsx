import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../src/app/user/layout';

describe('RootLayout component', () => {
    it('renders children within the appropriate HTML structure', () => {
      const { container } = render(
        <RootLayout>
          <div>Child Component</div>
        </RootLayout>
      );
  
      // Check if the HTML structure is as expected
      const htmlElement = container.querySelector('html');
      expect(htmlElement).toBeInTheDocument();
      expect(htmlElement.getAttribute('lang')).toBe('en');
  
      const bodyElement = container.querySelector('body');
      expect(bodyElement).toBeInTheDocument();
  
      const childComponent = container.querySelector('div');
      expect(bodyElement.contains(childComponent)).toBe(true);
    });
  });