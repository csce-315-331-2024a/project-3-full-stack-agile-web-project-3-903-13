"use client";

import React, { useEffect, useRef, useState } from 'react';
import Chart from 'chart.js/auto';

/**
 * A React component for displaying inventory usage reports using a bar chart.
 * The user can specify a date range to generate reports for inventory usage within that period.
 * @module InventoryUsagePage
 * @returns {JSX.Element} The rendered page component.
 */
export default function InventoryUsagePage() {
    const chartRef = useRef(null);
    const chartInstanceRef = useRef(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasData, setHasData] = useState(true);  // Added state variable for tracking if data exists

    /**
     * Fetches inventory usage data from the API based on the provided start and end dates.
     * Updates the chart with new data or handles errors if the fetch fails.
     * @memberOf module:InventoryUsagePage
     */
    const fetchInventoryUsage = async () => {
        setLoading(true);
        setErrorMessage('');
        setHasData(true);  // Assume there is data until checked
        try {
            const response = await fetch(`https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/usage?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            let data = await response.json();

            if (data.length === 0) {
                setHasData(false);
                setLoading(false);
                return;
            }

            // Sort data in descending order based on 'totalinventoryused'
            data.sort((a, b) => parseInt(b.totalinventoryused, 10) - parseInt(a.totalinventoryused, 10));

            console.log('Fetched data:', data); // DEBUGGING DATA TO ENSURE THE DATA IS BEING PROPERLY RETURNED

            if (chartInstanceRef.current) {
                chartInstanceRef.current.destroy();
            }

            const chartCtx = chartRef.current.getContext('2d');
            const gradient = chartCtx.createLinearGradient(0, 0, 0, chartRef.current.height);
            gradient.addColorStop(0, 'rgba(75, 192, 192, 1)');
            gradient.addColorStop(1, 'rgba(75, 192, 192, 0.6)');
            chartInstanceRef.current = new Chart(chartCtx, {
                type: 'bar',
                data: {
                    labels: data.map(item => item.name),
                    datasets: [{
                        label: 'Total Inventory Used',
                        data: data.map(item => parseInt(item.totalinventoryused, 10)),
                        backgroundColor: gradient,
                        borderColor: 'rgba(54, 162, 235, 1)',
                        borderWidth: 2, 
                        categoryPercentage: 0.5, 
                        barPercentage: 1, 
                    }]
                },
                options: {
                    indexAxis: 'y',
                    scales: {
                        x: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    size: 14, 
                                },
                            },
                        },
                        y: {
                            ticks: {
                                autoSkip: false, 
                                font: {
                                    size: 14,
                                },
                            },
                        },
                    },
                    maintainAspectRatio: false,
                    responsive: true,
                }
            });
        } catch (error) {
            console.error('Error fetching inventory usage data:', error);
            setErrorMessage('Failed to fetch inventory usage data. Please try again.');
            setHasData(false);
        }
        setLoading(false);
    };

    /**
     * Submits the form to generate the inventory usage report. Prevents the default form submit behavior.
     * @memberOf module:InventoryUsagePage
     * @param {React.FormEvent} e - The event object associated with the form submission.
     */
    const handleGenerateReport = (e) => {
        e.preventDefault();
        setHasData(true);
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
        <main className="min-h-screen bg-slate-100 flex flex-col">
            <h1 className="text-4xl font-bold text-center mb-3 py-4">Inventory Usage Report</h1>

            <div className="flex w-full max-w-4xl mx-auto">
                <div className="p-5 w-full bg-white shadow-lg rounded">
                    <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center mb-4">
                        <label htmlFor="startDate" className="sr-only">Start Date</label>
                        <input
                            data-testid = "start date"
                            type="date"
                            id="startDate"
                            //type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                            required
                        />
                        <label htmlFor="endDate" className="sr-only">End Date</label>
                        <input
                            data-testid = "end date"
                            type="date"
                            id="endDate"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="mb-2 p-2 w-1/5 md:mb-0 md:mr-2 border border-gray-500 bg-white rounded-md focus:outline-none"
                            required
                        />
                        <button type="submit" className="w-1/5 bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2 font-semibold" disabled={loading}>
                            {loading ? 'Loading...' : 'Generate Report'}
                        </button>
                    </form>
                    <div className="text-center">
                        {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                        {!hasData && !loading && <p>There was no inventory usage during this time range, try another time period.</p>}
                    </div>
                    <div style={{ height: '1200px' }} >
                        {hasData && <canvas data-testid="chart-container" ref={chartRef} aria-label="Inventory Usage Chart" ></canvas>}

                    </div>
                </div>
            </div>
        </main>
    );
}