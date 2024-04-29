import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import InventoryUsagePage from '../src/app/(employee)/employee/manager/inventory-usage/page'; // Replace './page.js' with the actual path to your file

// Mock getContext method of canvas element
HTMLCanvasElement.prototype.getContext = jest.fn(() => ({
  fillRect: jest.fn(),
  clearRect: jest.fn(),
  getImageData: jest.fn(),
  putImageData: jest.fn(),
  createImageData: jest.fn(),
  setTransform: jest.fn(),
  resetTransform: jest.fn(),
  drawImage: jest.fn(),
  save: jest.fn(),
  restore: jest.fn(),
  beginPath: jest.fn(),
  moveTo: jest.fn(),
  lineTo: jest.fn(),
  closePath: jest.fn(),
  stroke: jest.fn(),
  translate: jest.fn(),
  scale: jest.fn(),
  rotate: jest.fn(),
  arc: jest.fn(),
  fill: jest.fn(),
  measureText: jest.fn(),
  transform: jest.fn(),
  rect: jest.fn(),
  clip: jest.fn(),
}));

// Then your tests...

jest.mock('chart.js/auto'); // Mock chart.js

describe('InventoryUsagePage component', () => {
  it('should render the component initially', () => {
    render(<InventoryUsagePage />);

    expect(screen.getByText('INVENTORY USAGE REPORT')).toBeInTheDocument();
  });

  it('should enable the Generate Report button when both start and end dates are selected', () => {
    render(<InventoryUsagePage />);

    const startDateInput = screen.getByTestId('start date');
    const endDateInput = screen.getByTestId('end date');
    const generateButton = screen.getByRole('button');

    fireEvent.change(startDateInput, { target: { value: '2024-01-04' } });
    fireEvent.change(endDateInput, { target: { value: '2024-02-04' } });

    expect(generateButton).toBeEnabled();
  });

  it('fetches data and renders the chart', async () => {
    global.fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: () =>
        Promise.resolve([
          { name: "Item 1", totalinventoryused: "10" },
          { name: "Item 2", totalinventoryused: "20" },
        ]),
    })
  );
    render(<InventoryUsagePage />);

    // Fill in start and end dates
    fireEvent.change(screen.getByTestId('start date'), {
      target: { value: '2024-01-01' },
    });
    fireEvent.change(screen.getByTestId('end date'), {
      target: { value: '2024-01-31' },
    });

    // Click generate report button
    fireEvent.click(screen.getByText('Generate Report'));

    // Wait for data to be fetched and chart to be rendered
    await waitFor(() => expect(screen.getByTestId('chart-container')).toBeInTheDocument()); // Replace 'chart-container' with your actual class name

  });

  
  // Add more test cases to simulate error scenarios, data handling, and chart rendering
});
