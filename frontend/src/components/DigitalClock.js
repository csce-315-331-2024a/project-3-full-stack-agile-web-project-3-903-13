"use client"

import { useState, useEffect } from 'react';

const ClockWidget = () => {
    const [currentTime, setCurrentTime] = useState(new Date());

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000); // Update every second

        // Clear interval on component unmount
        return () => clearInterval(interval);
    }, []);

    // Format the date to display day of the week and date
    const formatDate = (date) => {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        return date.toLocaleDateString(undefined, options);
    };

    // Format the time to display hours, minutes, and seconds
    const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { hour12: true, hour: 'numeric', minute: '2-digit' });
    };

    return (
        <div className="fixed bottom-0 left-0 p-2 bg-white border-gray-400 rounded-xl border-2 text-gray-700 z-[1000]">
            <p>{formatTime(currentTime)}</p>
            <p>{formatDate(currentTime)}</p>
        </div>
    );
};

export default ClockWidget;
