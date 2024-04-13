
export default function NumericKeypad({ onValueChange, inputValue, setInputValue, onClose }) {
    const handleButtonClick = (value) => {
        setInputValue(prev => prev + value);
    };

    const handleBackspace = () => {
        setInputValue(inputValue.slice(0, -1));
    };

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