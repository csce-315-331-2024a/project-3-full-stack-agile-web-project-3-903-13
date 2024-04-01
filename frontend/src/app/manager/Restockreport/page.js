
"use client";

import React, { useState, useEffect } from 'react';
import { useTable } from "react-table";
import axios from 'axios';

const RestockReportPage = () => {
    const [restockItems, setRestockItems] = useState([]);
    const [loading, setLoading] = useState(true);

     // Extracted function to fetch data
     const fetchData = () => {
        setLoading(true);
        axios.get('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/restock')
            .then(response => {
                setRestockItems(response.data);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching restock data:', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fulfillRestock = () => {
        // Call the backend to fulfill restock orders
        axios.patch('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/restock')
            .then(response => {
                // Optionally handle success (e.g., show success message)
                console.log('Restock fulfilled successfully:', response.data);
            })
            .catch(error => {
                // Handle error (e.g., show error message)
                console.error('Error fulfilling restock:', error);
            });
    };


    const columns = [
        {
            Header: 'InventID',
            accessor: 'inventid'
        },
        {
            Header: 'Ingredient Name',
            accessor: 'ingredientname'
        },
        {
            Header: 'Count',
            accessor: 'count'
        },
        {
            Header: 'Price',
            accessor: 'price'
        },
        {
            Header: 'Min Count',
            accessor: 'mincount'
        }
    ];

    return (
        <main className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="w-full max-w-4xl p-5 bg-white shadow-lg rounded">
                <h1 className="text-xl font-semibold text-center mb-6">RESTOCK REPORT</h1>
                <button
                    onClick={fetchData}
                    className="mb-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                >
                    Regenerate Report
                </button>

                <button
                onClick={fulfillRestock}
                className="mb-4 ml-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
            >
                Fulfill Restock
            </button>

                <div>
                    {loading ? (
                        <p>Loading...</p>
                    ) : (
                        <div>
                            <h2 className="text-lg font-semibold mb-4">Restock Items</h2>
                            {restockItems.length > 0 ? (
                                <Table columns={columns} data={restockItems} />
                            ) : (
                                <p>No restock items available.</p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
};


const Table = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow
    } = useTable({ columns, data });

    return (
        <table {...getTableProps()} className="w-full">
            <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} className="border px-4 py-2">{column.render('Header')}</th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody {...getTableBodyProps()}>
                {rows.map(row => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} className="border px-4 py-2">{cell.render('Cell')}</td>;
                            })}
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
};

export default RestockReportPage;



