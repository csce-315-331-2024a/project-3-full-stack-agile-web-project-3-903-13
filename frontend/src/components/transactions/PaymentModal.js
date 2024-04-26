import CreditCardModal from "@/components/transactions/CreditCardModal";
import { useState } from "react";
import { FaCheckCircle, FaRegCircle } from 'react-icons/fa';

const maroon = '#800000';
const maroonLight = '#a05252';
const maroonDark = '#5c0000';

export default function PaymentModal({ showPaymentOptions, setShowPaymentOptions, handlePayment, enableCreditCardInput = false }) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [showCreditCardModal, setShowCreditCardModal] = useState(false);

  const paymentMethods = [
    { id: 'card', label: 'Card' },
    { id: 'dining', label: 'Dining Dollars' },
    { id: 'retail', label: 'Retail Swipe' },
  ];

  const handlePaymentMethodSelect = (methodId) => {
    setSelectedPaymentMethod(methodId);
  };

  const handleContinueClick = () => {
    if (selectedPaymentMethod === 'card' && enableCreditCardInput) {
      setShowCreditCardModal(true);
    } else {
      handlePayment();
    }
  };

  const paymentButtonStyle = (methodId) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '1rem',
    border: `2px solid ${selectedPaymentMethod === methodId ? maroon : '#d1d5db'}`,
    borderRadius: '0.375rem',
    backgroundColor: selectedPaymentMethod === methodId ? 'white' : '',
    cursor: 'pointer',
    transition: 'all 200ms ease-in-out',
  });

  const iconColor = selectedPaymentMethod ? maroon : '#9ca3af';

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-75 overflow-y-auto h-full w-full z-50">
      <div className="relative top-1/4 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 shadow-lg rounded-md bg-white">
        <h3 className="text-3xl font-bold text-center mb-6 pb-2 relative" style={{ color: maroon }}>
          Select Payment Method
          <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-300"></div>
        </h3>
        <div className="space-y-4">
          {paymentMethods.map((method) => (
            <div
              key={method.id}
              style={paymentButtonStyle(method.id)}
              onClick={() => handlePaymentMethodSelect(method.id)}
            >
              <span className="text-lg font-semibold text-gray-800">{method.label}</span>
              {selectedPaymentMethod === method.id ? (
                <FaCheckCircle style={{ color: maroon }} size="1.5em" />
              ) : (
                <FaRegCircle style={{ color: iconColor }} size="1.5em" />
              )}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-8">
          <button
            style={{
              color: maroon,
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              transition: 'background-color 200ms ease-in-out',
            }}
            className="hover:bg-gray-200 font-semibold text-gray-800"
            onClick={() => setShowPaymentOptions(false)}
          >
            Cancel
          </button>
          <button
            style={{
              backgroundColor: maroon,
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '0.375rem',
              boxShadow: '0 2px 4px 0 rgba(0,0,0,0.10)',
              transition: 'all 200ms ease-in-out',
            }}
            className="hover:bg-maroon-dark font-semibold"
            onClick={handleContinueClick}
          >
            Continue
          </button>
        </div>
      </div>
      {showCreditCardModal && enableCreditCardInput && (
        <CreditCardModal
          showCreditCardModal={showCreditCardModal}
          setShowCreditCardModal={setShowCreditCardModal}
          handlePayment={handlePayment}
        />
      )}
    </div>
  );
}