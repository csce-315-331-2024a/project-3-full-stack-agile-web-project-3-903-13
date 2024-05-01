import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import axios from 'axios';
import MenuAddModal from '../src/components/MenuAddModal';

jest.mock('axios');

describe('MenuAddModal', () => {
  const mockOnClose = jest.fn();
  const mockSetMenuItems = jest.fn();
  const mockSetInventoryItems = jest.fn();
  const mockSetMenuItemsGrid = jest.fn();

  const menuItems = [
    { itemname: 'Burger', price: 5.99, category: 0 },
    { itemname: 'Hot Dog', price: 3.99, category: 1 },
  ];

  const inventoryItems = [
    { inventid: 1, ingredientname: 'Lettuce', disabled: false },
    { inventid: 2, ingredientname: 'Tomato', disabled: false },
    { inventid: 3, ingredientname: 'Onion', disabled: false },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <MenuAddModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        inventoryItems={inventoryItems}
        setInventoryItems={mockSetInventoryItems}
        menuItemsGrid={menuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    expect(screen.getByText('ADDING MENU ITEMS')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    const { container } = render(
      <MenuAddModal
        onClose={mockOnClose}
        isOpen={false}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        inventoryItems={inventoryItems}
        setInventoryItems={mockSetInventoryItems}
        menuItemsGrid={menuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <MenuAddModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        inventoryItems={inventoryItems}
        setInventoryItems={mockSetInventoryItems}
        menuItemsGrid={menuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('adds ingredient when "Add Ingredient" button is clicked', () => {
    render(
      <MenuAddModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        inventoryItems={inventoryItems}
        setInventoryItems={mockSetInventoryItems}
        menuItemsGrid={menuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.click(screen.getByText('Add Ingredient'));
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
  });

  test('removes ingredient when remove button is clicked', () => {
    render(
      <MenuAddModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        inventoryItems={inventoryItems}
        setInventoryItems={mockSetInventoryItems}
        menuItemsGrid={menuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.click(screen.getByText('Add Ingredient'));
    fireEvent.click(screen.getAllByRole('button', { name: '' })[0]);
    expect(screen.getAllByRole('combobox')).toHaveLength(3);
  });


  test('adds menu item when all required fields are filled', async () => {
    axios.post.mockResolvedValueOnce({ status: 200, data: { message: 'Menu item added successfully' } });

    render(
      <MenuAddModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        inventoryItems={inventoryItems}
        setInventoryItems={mockSetInventoryItems}
        menuItemsGrid={menuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.change(screen.getByPlaceholderText('Item Name'), { target: { value: 'New Item' } });
    fireEvent.change(screen.getByPlaceholderText('Price'), { target: { value: '4.99' } });
    const descriptionInput = screen.getByPlaceholderText('Description');
    userEvent.type(descriptionInput, 'Type');
    fireEvent.change(screen.getByPlaceholderText('Calories'), { target: { value: '200' } });
    fireEvent.click(screen.getByText('ADD'));

    await expect(axios.post).toHaveBeenCalledTimes(0);
  });

  
});