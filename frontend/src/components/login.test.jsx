import { describe, it, expect, beforeEach, afterEach, jest} from '@jest/globals';
import { useNavigate } from "react-router-dom";
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Login from './login';
import AdminPage from './adminPage';
import React from 'react';

// Mock the fetch API
global.fetch = jest.fn();

jest.mock("react-router-dom", () => ({
  ... jest.requireActual("react-router-dom"),
  useNavigate: jest.fn()
}));

describe('Login Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();
  });

  const testCases = [
    {
      profileType : 'UserAdmin',
      profile_id : '1',
      username : 'admin',
      password : '123'
    },

    {
      profileType : 'Cleaner',
      profile_id : '2',
      username : 'cleaner',
      password : '123'
    },

    {
      profileType : 'Homeowner',
      profile_id : '3',
      username : 'homeowner',
      password : '123'
    },

    {
      profileType : 'PlatformManager',
      profile_id : '4',
      username : 'platformManager',
      password : '123'
    }
  ] 
  
  testCases.forEach(({ profileType, profile_id, username, password }) => {
    it(`successful login for ${profileType}`, async () => {
      // Mock API responses
      fetch
        // First call - GET profiles
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([{ id: profile_id, name: profileType }])
        })
        // Second call - GET users
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ([{ id: profile_id, username }])
        })
        // Third call - POST login
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ success: true })
        });

      render(
        <MemoryRouter>
          <Login />
        </MemoryRouter>
      );

      // Wait for profile to load
      await waitFor(() => {
        expect(screen.getByText(profileType)).toBeInTheDocument();
      });

      // Fill out the form
      fireEvent.change(screen.getByLabelText('Username:'), {
        target: { value: username }
      });
      fireEvent.change(screen.getByLabelText('Password:'), {
        target: { value: password }
      });

      // Submit the form
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      // Verify the login API call
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
              profile_id: profile_id
            }),
          }
        );
      });
    });
  });

    it('handles unsuccessful login with invalid credentials', async () => {
    // 1. Mock API responses
    fetch
      // First call - GET profiles
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: 1, name: 'Admin' },
          { id: 2, name: 'Cleaner'},
          { id: 3, name: 'Homeowner'},
          { id: 4, name: 'PlatformManager'}
        ])
      })
      // Second call - GET users
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ([
          { id: 1, name: 'Admin' },
          { id: 2, name: 'Cleaner'},
          { id: 3, name: 'Homeowner'},
          { id: 4, name: 'PlatformManager'}
        ])
      })
      // Third call - POST login (failure)
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ 
          success: false
        })
      });

    // 2. Render the component
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    // 3. Wait for initial data load
    await waitFor(() => {
      expect(screen.getByText('Admin')).toBeInTheDocument();
    });

    // 4. Fill out the form with invalid credentials
    fireEvent.change(screen.getByLabelText('Username:'), {
      target: { value: 'wronguser' }
    });
    fireEvent.change(screen.getByLabelText('Password:'), {
      target: { value: 'wrongpass' }
    });

    // 5. Submit the form
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenNthCalledWith(3,  // Third call should be login
        'http://localhost:3000/api/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: 'wronguser',
            password: 'wrongpass',
            profile_id: '1'
          }),
        }
      );
    });
  });
});

describe('Logout', () => {
  const mockNavigate = jest.fn();

  beforeEach(() => {
    useNavigate.mockReturnValue(mockNavigate);
    jest.clearAllMocks();
  });

  it('should navigate to /login when logout is clicked', () => {
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
});