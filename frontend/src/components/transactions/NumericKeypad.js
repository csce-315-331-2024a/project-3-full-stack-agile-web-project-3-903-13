
/**
 * A numeric keypad component for inputting numbers. It provides buttons for digits 0-9, a backspace button for corrections, and buttons to submit or cancel the input.
 * @function NumericKeypad
 * @module NumericKeypad
 * @param {Object} props - The properties passed to the component.
 * @param {function} props.onValueChange - Callback function that gets called when the entered value is submitted.
 * @param {string} props.inputValue - The current value of the input.
 * @param {function} props.setInputValue - Function to update the state of the inputValue.
 * @param {function} props.onClose - Function to close the keypad modal.
 * @returns {React.Component} A React component that displays a numeric keypad for inputting numbers.
 */
export default function NumericKeypad({ onValueChange, inputValue, setInputValue, onClose }) {
    /**
     * Handles the event when numeric buttons are clicked. Appends the clicked value to the existing inputValue.
     * @function handleButtonClick
     * @param {string} value - The numeric value of the button clicked.
     */
    const handleButtonClick = (value) => {
        setInputValue(prev => prev + value);
    };

    /**
     * Handles the backspace operation by removing the last character from the current input value.
     * @function handleBackspace
     */
    const handleBackspace = () => {
        setInputValue(inputValue.slice(0, -1));
    };

    /**
     * Handles the submission of the input value. Parses the input string to an integer, adjusts it by subtracting 1, 
     * and calls the onValueChange callback with the new value. Closes the keypad modal after submission.
     * @function handleSubmit
     */
    const handleSubmit = () => {
        let quantity = parseInt(inputValue);
        if (isNaN(quantity)) {
            quantity = -1; 
        } else {
            quantity = quantity - 1; 
        }
        onValueChange(quantity);
        onClose();
    };

    return (
        <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg">
                <div className="text-center mb-4 font-bold text-xl">Enter Quantity</div>
                <div className="text-center mb-4 text-lg">{inputValue || "0"}</div>
                <div className="grid grid-cols-3 gap-2">
                    {Array.from({ length: 9 }, (_, i) => (
                        <button key={i + 1} onClick={() => handleButtonClick(String(i + 1))} className="bg-gray-200 p-3 rounded">
                            {i + 1}
                        </button>
                    ))}
                    <button onClick={() => handleButtonClick('0')} className="col-span-2 bg-gray-200 p-3 rounded">0</button>
                    <button onClick={handleBackspace} className="bg-red-300 p-3 rounded">←</button>
                </div>
                <div className="mt-4 flex justify-between">
                    <button onClick={handleSubmit} className="bg-green-500 text-white px-6 py-2 rounded">Enter</button>
                    <button onClick={onClose} className="bg-red-500 text-white px-6 py-2 rounded">Cancel</button>
                </div>
            </div>
        </div>
    );
}