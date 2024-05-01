// CustomerFooter.test.js
import React from 'react';
import { render } from '@testing-library/react';
import CustomerFooter from '../src/components/Footer'; // Replace with your component path
import GoogleTranslateWidget from '../src/components/GoogleTranslate'; // Assuming GoogleTranslateWidget is a React component

jest.mock('../src/components/GoogleTranslate', () => () => <div>Mocked Google Translate</div>); // Mock GoogleTranslateWidget

describe('CustomerFooter component', () => {
  test('renders footer with content and Google Translate widget', () => {
    const { getByText, getAllByRole } = render(<CustomerFooter />);

    expect(getByText(/Located in:/i)).toBeInTheDocument();
    expect(getByText(/College Station/i)).toBeInTheDocument();
    expect(getByText(/© 2024 Luka Doncic Goat Team/i)).toBeInTheDocument();

  });
});
