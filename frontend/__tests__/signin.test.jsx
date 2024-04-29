import React from 'react';
import { render, fireEvent, screen } from '@testing-library/react';
import { GoogleLogin } from '@react-oauth/google';
import { useCookies } from 'react-cookie';
import { GoogleSignInButton, SignOutButton } from '../src/components/GoogleSignIn';

jest.mock('@react-oauth/google', () => ({
  GoogleLogin: jest.fn(() => <div>Google Login</div>),
}));

jest.mock('react-cookie', () => ({
  useCookies: jest.fn(() => [{ access_token: null }, jest.fn()]),
}));

describe('GoogleSignInButton', () => {
  test('renders the Google Login component', () => {
    render(<GoogleSignInButton />);
    expect(screen.getByText('Google Login')).toBeInTheDocument();
  });


});

describe('SignOutButton', () => {
  test('renders the Sign Out button', () => {
    render(<SignOutButton />);
    expect(screen.getByText('Sign Out')).toBeInTheDocument();
  });

  test('clears the access_token cookie when Sign Out button is clicked', () => {
    const [, setCookie] = useCookies();
    const mockSetCookie = jest.fn();
    useCookies.mockReturnValueOnce([{ access_token: 'mockToken' }, mockSetCookie]);

    render(<SignOutButton />);
    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    expect(mockSetCookie).toHaveBeenCalledWith('access_token', null);
  });
});