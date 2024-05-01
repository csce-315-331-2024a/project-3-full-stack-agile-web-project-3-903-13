import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import axios from 'axios';
import MenuRemoveModal from "../src/components/MenuRemoveModal"

jest.mock('axios');

describe('MenuRemoveModal', () => {
  const mockOnClose = jest.fn();
  const mockSetMenuItems = jest.fn();
  const mockSetMenuItemsGrid = jest.fn();

  const menuItems = [
    { menuid: 1, itemname: 'Burger' },
    { menuid: 2, itemname: 'Hot Dog' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders modal when isOpen is true', () => {
    render(
      <MenuRemoveModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    expect(screen.getByText('REMOVING MENU ITEMS')).toBeInTheDocument();
  });

  test('does not render modal when isOpen is false', () => {
    const { container } = render(
      <MenuRemoveModal
        onClose={mockOnClose}
        isOpen={false}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('calls onClose when close button is clicked', () => {
    render(
      <MenuRemoveModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.click(screen.getByRole('button', { name: '' }));
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('displays menu items in the dropdown', () => {
    render(
      <MenuRemoveModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    expect(screen.getByRole('option', { name: 'Burger' })).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Hot Dog' })).toBeInTheDocument();
  });

  test('removes menu item when "REMOVE" button is clicked', async () => {
    axios.delete.mockResolvedValueOnce({ success: true, message: 'Menu item removed successfully' });

    render(
      <MenuRemoveModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Burger' } });
    fireEvent.click(screen.getByText('REMOVE'));

    await waitFor(() => {
      expect(screen.getByText('Menu item removed successfully')).toBeInTheDocument();
    });
  });

  test('displays error message when removing menu item fails', async () => {
    axios.delete.mockRejectedValueOnce(new Error('Failed to remove menu item'));

    render(
      <MenuRemoveModal
        onClose={mockOnClose}
        isOpen={true}
        menuItems={menuItems}
        setMenuItems={mockSetMenuItems}
        setMenuItemsGrid={mockSetMenuItemsGrid}
      />
    );

    fireEvent.change(screen.getByRole('combobox'), { target: { value: 'Burger' } });
    fireEvent.click(screen.getByText('REMOVE'));

    await waitFor(() => {
      expect(screen.getByText('Failed to remove menu item')).toBeInTheDocument();
    });
  });
});