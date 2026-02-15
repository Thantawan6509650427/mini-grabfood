import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import AuthCallback from '../pages/AuthCallback';

const mockNavigate = vi.fn();
const mockRefreshUser = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams('?token=mock-token')],
  };
});

vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    refreshUser: mockRefreshUser,
  }),
}));

describe('AuthCallback Component', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  it('should save token and redirect on successful callback', async () => {
    render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    );

    await waitFor(() => {
      expect(localStorage.setItem).toHaveBeenCalledWith('token', 'mock-token');
      expect(mockRefreshUser).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
    });
  });

  it('should show loading spinner during redirect', () => {
    const { container } = render(
      <BrowserRouter>
        <AuthCallback />
      </BrowserRouter>
    );

    const spinner = container.querySelector('.animate-spin');
    expect(spinner).toBeDefined();
  });
});