import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import { useNavigate } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './login';
import AdminPage from './adminPage';
import CleanerPage from './cleanerPage';
import HomeownerPage from './homeownerPage';
import PlatformManager from './platformManagerPage';
import React from 'react';


global.fetch = jest.fn();

jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const testCases = [
    {
      profileType: 'UserAdmin',
      profile_id: '1',
      username: 'admin',
      password: '123'
    },
    {
      profileType: 'Cleaner',
      profile_id: '2',
      username: 'cleaner',
      password: '123'
    },
    {
      profileType: 'Homeowner',
      profile_id: '3',
      username: 'homeowner',
      password: '123'
    },
    {
      profileType: 'PlatformManager',
      profile_id: '4',
      username: 'platformManager',
      password: '123'
    }
  ];

  testCases.forEach(({ profileType, profile_id, username, password }) => {
    it(`successful login for ${profileType}`, async () => {

      fetch
        // GET userProfile
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([{ id: profile_id, name: profileType, is_active: true }])
        })
        // GET userAdmin
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([{ id: profile_id, username, is_active: true }])
        })
        // POST login
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true, message: 'Login successful' })
        });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      await waitFor(() => {
        const selectElement = screen.getByRole('combobox', { name: /account type/i });
        expect(selectElement).toBeInTheDocument();
      });

      // Fill out the form
      fireEvent.change(screen.getByLabelText('Username:'), {
        target: { value: username }
      });
      fireEvent.change(screen.getByLabelText('Password:'), {
        target: { value: password }
      });

      fireEvent.change(screen.getByLabelText('Account Type'), {
      target: { value: profile_id }
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Verify login
      await waitFor(() => {
        expect(fetch).toHaveBeenNthCalledWith(3,
          'http://localhost:3000/api/login',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username,
              password,
              profile_id
            }),
          }
        );
      });
    });
  });

  it('handles unsuccessful login with invalid credentials', async () => {
    // Mock API responses
    fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: '1', name: 'UserAdmin', is_active: true },
          { id: '2', name: 'Cleaner', is_active: true }
        ])
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: '1', username: 'admin', is_active: true }
        ])
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ 
          success: false,
          message: 'Invalid credentials'
        })
      });

    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    await waitFor(() => {
      const selectElement = screen.getByRole('combobox', { name: /account type/i });
      expect(selectElement).toBeInTheDocument();
    });

    // Fill out the form with invalid credentials
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'wrongpass' }
    });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Verify error message appears
    await waitFor(() => {
      expect(screen.getByText('Invalid credentials')).toBeInTheDocument();
    });
  });

});

describe('Logout', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('should navigate to /login when logout is clicked (adminPage)', () => {
    render(
      <MemoryRouter>
        <AdminPage />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  });

    it('should navigate to /login when logout is clicked (cleanerPage)', () => {
    render(

      <MemoryRouter>
        <CleanerPage />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

    it('should navigate to /login when logout is clicked (homeownerPage)', () => {
    render(
      <MemoryRouter>
        <HomeownerPage />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });

    it('should navigate to /login when logout is clicked (platformManager)', () => {
    render(
      <MemoryRouter>
        <PlatformManager />
      </MemoryRouter>
    );

    const logoutButton = screen.getByText('Logout');
    fireEvent.click(logoutButton);

    // Verify navigation to login page
    expect(mockNavigate).toHaveBeenCalledWith('/login');
  });
});