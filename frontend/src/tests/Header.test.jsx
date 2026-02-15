import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Header from '../components/Header';
import { AuthProvider } from '../contexts/AuthContext';

// Mock fetch
global.fetch = vi.fn();

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

// Wrapper component
const AllTheProviders = ({ children }) => {
  return (
    <BrowserRouter>
      <AuthProvider>{children}</AuthProvider>
    </BrowserRouter>
  );
};

describe('Header Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockClear();
  });

  it('should show login button when not authenticated', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockResolvedValue({
      ok: false,
      status: 401,
    });

    render(<Header />, { wrapper: AllTheProviders });

    await waitFor(() => {
      const loginButton = screen.queryByText(/เข้าสู่ระบบด้วย Google/);
      expect(loginButton).toBeTruthy();
    });
  });

  it('should show user profile when authenticated', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/photo.jpg',
    };

    localStorageMock.getItem.mockReturnValue('test-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    render(<Header />, { wrapper: AllTheProviders });

    await waitFor(() => {
      const img = screen.getByAltText('Test User');
      expect(img).toBeTruthy();
    }, { timeout: 3000 });
  });

  it('should show loading skeleton when loading', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    
    // Delay the response
    global.fetch.mockImplementation(() => 
      new Promise(resolve => {
        setTimeout(() => {
          resolve({ ok: false, status: 401 });
        }, 100);
      })
    );

    render(<Header />, { wrapper: AllTheProviders });

    // Should show skeleton immediately
    const skeleton = document.querySelector('.animate-pulse');
    expect(skeleton).toBeTruthy();
  });

  it('should toggle dropdown when profile clicked', async () => {
    const mockUser = {
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/photo.jpg',
    };

    localStorageMock.getItem.mockReturnValue('test-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const { container } = render(<Header />, { wrapper: AllTheProviders });

    await waitFor(() => {
      expect(screen.getByAltText('Test User')).toBeTruthy();
    });

    // Click profile button
    const profileButton = screen.getByAltText('Test User').closest('button');
    profileButton.click();

    await waitFor(() => {
      expect(screen.queryByText('บัญชีของฉัน')).toBeTruthy();
      expect(screen.queryByText('ออกจากระบบ')).toBeTruthy();
    });
  });
});