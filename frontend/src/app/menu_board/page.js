"use client";

import React, { useState, useEffect } from 'react';
import Board1 from './Board_1/page'; // Import your board components
import Board2 from './Board_2/page'; // Import your board components
import Board3 from './Board_3/page';
// Import other board components as needed

const Page = () => {
    const boards = [<Board1 />, <Board2 />, <Board3/>]; // Add your board components to this array

    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % boards.length);
        }, 10000); // Change slide every 10 seconds

        return () => clearInterval(interval);
    }, [boards.length]);

    const renderIndicator = (page) => {
        return (
            <div
                key={page}
                className={`w-6 h-6 rounded-full flex items-center justify-center mx-1 cursor-pointer border-2 ${
                    currentIndex === page ? 'text-white border-black bg-gray-800' : 'bg-white text-black border-black'
                }`}
                onClick={() => setCurrentIndex(page)}
            >
                {page + 1}
            </div>
        );
    };


    return (
        <div className="relative">
            {boards.map((board, index) => (
                <div key={index} className={index === currentIndex ? "block" : "hidden"}>
                    {board}
                </div>
            ))}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex">
                {boards.map((_, index) => renderIndicator(index))}
            </div>
        </div>
    );
};

export default Page;