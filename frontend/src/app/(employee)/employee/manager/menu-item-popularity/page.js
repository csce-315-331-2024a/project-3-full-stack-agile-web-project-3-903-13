"use client";

import React, { useState, useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

export default function ItemPopularityPage() {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [hasData, setHasData] = useState(true);
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    useEffect(() => {
        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        if (reportData.length === 0) {
            setHasData(false);
            return;
        }

        // Sort data in descending order based on 'quantity_sold'
        reportData.sort((a, b) => b.quantity_sold - a.quantity_sold);

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: reportData.map(item => item.itemname),
                datasets: [{
                    label: 'Quantity Sold',
                    data: reportData.map(item => item.quantity_sold),
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
                        beginAtZero: true
                    },
                    y: {
                        ticks: {
                            autoSkip: false
                        }
                    }
                },
                maintainAspectRatio: false,
                responsive: true
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [reportData]);

    const fetchSalesReport = async () => {
        setLoading(true);
        setErrorMessage('');
        setHasData(true);
        try {
            const response = await fetch(`http://localhost:5000/api/reports/salesreport?startDate=${startDate}&endDate=${endDate}`);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data.length === 0) {
                setErrorMessage('No entries found for the selected date range. Please try a different time range.');
                setHasData(false);
            } else {
                setReportData(data);
            }
        } catch (error) {
            console.error('Error fetching sales report:', error);
            setErrorMessage('Failed to fetch sales report. Please try again.');
            setHasData(false);
        }
        setLoading(false);
    };

    const handleGenerateReport = (e) => {
        e.preventDefault();
        fetchSalesReport();
    };

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded" style={{ height: '800px' }}>
                <h1 className="text-xl font-semibold text-center mb-6">Menu Item Popularity</h1>
                <form onSubmit={handleGenerateReport} className="flex flex-col md:flex-row justify-between items-center mb-4">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} required />
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} required />
                    <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white rounded px-4 py-2" disabled={loading}>
                        {loading ? 'Loading...' : 'Generate Report'}
                    </button>
                </form>
                <div className="text-center">
                    {errorMessage && <p className="text-red-500">{errorMessage}</p>}
                    {!hasData && !loading && <p>No sales data found for the selected date range. Try another time period.</p>}
                </div>
                <div style={{ height: '650px' }}>
                    {hasData && <canvas ref={chartRef}></canvas>}
                </div>
            </div>
        </main>
    );
}
