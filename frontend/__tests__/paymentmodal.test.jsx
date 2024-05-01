import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import PaymentModal from '../src/components/transactions/PaymentModal';

describe('PaymentModal', () => {
  const setShowPaymentOptionsMock = jest.fn();
  const handlePaymentMock = jest.fn();

  beforeEach(() => {
    setShowPaymentOptionsMock.mockClear();
    handlePaymentMock.mockClear();
  });

  test('renders the modal with the correct title', () => {
    render(
      <PaymentModal
        showPaymentOptions={true}
        setShowPaymentOptions={setShowPaymentOptionsMock}
        handlePayment={handlePaymentMock}
      />
    );

    const modalTitle = screen.getByText('Select Payment Method');
    expect(modalTitle).toBeInTheDocument();
  });
  
  test('renders all payment options', () => {
    render(
      <PaymentModal
        showPaymentOptions={true}
        setShowPaymentOptions={setShowPaymentOptionsMock}
        handlePayment={handlePaymentMock}
      />
    );

    const cardOption = screen.getByText('Card');
    const diningDollarsOption = screen.getByText('Dining Dollars');
    const retailSwipeOption = screen.getByText('Retail Swipe');

    expect(cardOption).toBeInTheDocument();
    expect(diningDollarsOption).toBeInTheDocument();
    expect(retailSwipeOption).toBeInTheDocument();
  });

  test('calls handlePayment when a payment option is clicked', () => {
    render(
      <PaymentModal
        showPaymentOptions={true}
        setShowPaymentOptions={setShowPaymentOptionsMock}
        handlePayment={handlePaymentMock}
      />
    );

    const cardOption = screen.getByText('Dining Dollars');
    fireEvent.click(cardOption);
    const continueBut = screen.getByText('Continue');
    fireEvent.click(continueBut);
    expect(handlePaymentMock).toHaveBeenCalled();
  });

  test('calls setShowPaymentOptions with false when Cancel button is clicked', () => {
    render(
      <PaymentModal
        showPaymentOptions={true}
        setShowPaymentOptions={setShowPaymentOptionsMock}
        handlePayment={handlePaymentMock}
      />
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    expect(setShowPaymentOptionsMock).toHaveBeenCalledWith(false);
  });
  
});