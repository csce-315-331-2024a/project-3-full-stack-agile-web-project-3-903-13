"use client";

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

export default function InventoryUsagePage() {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const fetchInventoryUsage = async () => {
        setLoading(true);
        setErrorMessage('');
        try {
            const response = await fetch(`http://localhost:5000/api/inventory/usage?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();
    
            // Sort data in descending order based on 'totalinventoryused'
            data.sort((a, b) => parseInt(b.totalinventoryused, 10) - parseInt(a.totalinventoryused, 10));
            
            console.log('Fetched data:', data); // DEBUGGING DATA TO ENSURE THE DATA IS BEING PROPERLY RETURNED

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
    
            const chartCtx = chartRef.current.getContext('2d');
            chartInstanceRef.current = new Chart(chartCtx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        label: 'Total Inventory Used',
                        data: data.map(item => parseInt(item.totalinventoryused, 10)),
                        backgroundColor: 'rgba(54, 162, 235, 0.5)',
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 1,
                        barThickness: 10,
                        categoryPercentage: 1.0
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                        },
                        y: {
                            ticks: {
                                autoSkip: false // Ensure all labels are shown
                            }
                        }
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                }
            });
        } catch (error) {
            console.error('Error fetching inventory usage data:', error);
            setErrorMessage('Failed to fetch inventory usage data. Please try again.');
        }
        setLoading(false);
    };
    

    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchInventoryUsage();
    };

    useEffect(() => {
        return () => {
            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }
        };
    }, []);

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl">
                <div className="p-5 bg-white shadow-lg rounded" style={{ height: '800px' }}>
                    <h1 className="text-xl font-semibold text-center mb-6">INVENTORY USAGE REPORT</h1>
                    <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mb-2 md:mb-0 md:mr-2"
                            required
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mb-2 md:mb-0 md:mr-2"
                            required
                        />
                        <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2" disabled={loading}>
                            {loading ? 'Loading...' : 'Generate Report'}
                        </button>
                    </form>
                    <div className="text-center">
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    </div>
                    <div style={{ height: '650px' }}>
                        <canvas ref={chartRef}></canvas>
                    </div>
                </div>
            </div>
        </main>
    );
}
