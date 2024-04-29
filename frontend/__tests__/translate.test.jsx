import React from 'react';
import { render, screen } from '@testing-library/react';
import GoogleTranslateWidget from '../src/components/GoogleTranslate';

jest.mock('next/script', () => {
  const mockScript = ({ id, strategy }) => {
    return <div data-testid={`script-${id}`} data-strategy={strategy} />;
  };
  return mockScript;
});

describe('GoogleTranslateWidget', () => {

  test('renders the Google Translate scripts', () => {
    render(<GoogleTranslateWidget />);
    const script1 = screen.getByTestId('script-translate1');
    const script2 = screen.getByTestId('script-translate2');

    expect(script1).toBeInTheDocument();
    expect(script1).toHaveAttribute('data-strategy', 'afterInteractive');

    expect(script2).toBeInTheDocument();
    expect(script2).toHaveAttribute('data-strategy', 'afterInteractive');
  });
});