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
        }, 5000); // Change slide every 5 seconds

        return () => clearInterval(interval);
    }, [boards.length]);

    return (
        <div className="slideshow-container">
        {boards.map((board, index) => (
            <div key={index} style={{ display: index === currentIndex ? 'block' : 'none' }}>
                {board}
            </div>
        ))}
    </div>
    );
};

export default Page;