// RootLayout.test.js

import React from 'react';
import { render, screen } from '@testing-library/react';
import RootLayout from '../src/app/menu_board/layout'; // Assuming RootLayout.js is in the same directory

jest.mock('../src/app/menu_board/page', () => () => <div>Page Content</div>); // Mock the Page component

describe('RootLayout component', () => {
  test('renders the Page component', () => {
    render(<RootLayout />);
    expect(screen.getByText('Page Content')).toBeInTheDocument();
  });
});
