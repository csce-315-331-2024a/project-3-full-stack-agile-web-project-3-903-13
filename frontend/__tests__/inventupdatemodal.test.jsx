// InventUpdateModal.test.js
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import InventUpdateModal, {
    getInventoryItems,
    updateInventCount,
    updateInventPrice,
    updateInventMin,
} from '../src/components/InventUpdateModal';

jest.mock('axios');

describe('InventUpdateModal', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getInventoryItems', () => {
        it('should fetch inventory items successfully', async () => {
            const mockData = [{ id: 1, itemName: 'Item 1', count: 10, price: 9.99, mincount: 5 }];
            axios.get.mockResolvedValueOnce({ data: mockData });

            const result = await getInventoryItems();

            expect(axios.get).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory');
            expect(result).toEqual(mockData);
        });

        it('should handle errors when fetching inventory items', async () => {
            const errorMessage = 'Network Error';
            axios.get.mockRejectedValueOnce(new Error(errorMessage));

            await expect(getInventoryItems()).rejects.toThrowError(errorMessage);
        });
    });

    describe('updateInventCount', () => {
        it('should update inventory item count successfully', async () => {
            const updatedItem = { itemName: 'Item 1', newCount: 15 };
            const mockResponse = { data: { success: true } };
            axios.patch.mockResolvedValueOnce(mockResponse);

            const result = await updateInventCount(updatedItem);

            expect(axios.patch).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/updateQuantity', updatedItem, { headers: { 'Content-Type': 'application/json' } });
            expect(result).toEqual({ success: true, message: 'Inventory item count updated successfully' });
        });
    });

    describe('updateInventPrice', () => {
        it('should update inventory item price successfully', async () => {
            const updatedItem = { itemName: 'Item 1', newPrice: 12.99 };
            const mockResponse = { data: { success: true } };
            axios.patch.mockResolvedValueOnce(mockResponse);

            const result = await updateInventPrice(updatedItem);

            expect(axios.patch).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/updatePrice', updatedItem, { headers: { 'Content-Type': 'application/json' } });
            expect(result).toEqual({ success: true, message: 'Inventory item price updated successfully' });
        });
    });

    describe('updateInventMin', () => {
        it('should update inventory item minimum count successfully', async () => {
            const updatedItem = { itemName: 'Item 1', newCount: 3 };
            const mockResponse = { data: { success: true } };
            axios.patch.mockResolvedValueOnce(mockResponse);

            const result = await updateInventMin(updatedItem);

            expect(axios.patch).toHaveBeenCalledWith('https://project-3-full-stack-agile-web-project-3-lc1v.onrender.com/api/inventory/updateMinCount', updatedItem, { headers: { 'Content-Type': 'application/json' } });
            expect(result).toEqual({ success: true, message: 'Inventory item minimum count updated successfully' });
        });
    });

    describe('InventUpdateModal component', () => {
        it('should render the modal when isOpen is true', () => {
            const { getByText } = render(<InventUpdateModal isOpen={true} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

            expect(getByText('UPDATE INVENTORY ITEM')).toBeInTheDocument();
        });

        it('should not render the modal when isOpen is false', () => {
            const { queryByText } = render(<InventUpdateModal isOpen={false} onClose={jest.fn()} inventoryItems={[]} setInventoryItems={jest.fn()} />);

            expect(queryByText('UPDATE INVENTORY ITEM')).toBeNull();
        });
    });
});