// Page.test.js

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Page from '../src/app/menu_board/page'; // Assuming Page.js is in the same directory

// Mock your Board components (replace with your actual Board component tests)
jest.mock('../src/app/menu_board/Board_1/page', () => () => <div>Board 1 Content</div>);
jest.mock('../src/app/menu_board/Board_2/page', () => () => <div>Board 2 Content</div>);
jest.mock('../src/app/menu_board/Board_3/page', () => () => <div>Board 3 Content</div>);

describe('Page component', () => {
  test('renders the first board initially', () => {
    render(<Page />);
    expect(screen.getByText('Board 1 Content')).toBeInTheDocument();
  });


  test('cycles through boards on indicator click', () => {
    render(<Page />);

    const secondIndicator = screen.getAllByText('2')[0]; // Get the second indicator
    fireEvent.click(secondIndicator);

    expect(screen.getByText('Board 2 Content')).toBeInTheDocument();
  });

  test('highlights the current board indicator', () => {
    render(<Page />);

    const firstIndicator = screen.getByText('1');
    expect(firstIndicator).toHaveClass('text-white border-black bg-gray-800');
  });


});
