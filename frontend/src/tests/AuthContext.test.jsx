import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, waitFor } from '@testing-library/react';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { act } from 'react';

// Mock fetch
global.fetch = vi.fn();

// Mock window.location
delete window.location;
window.location = { href: '', assign: vi.fn(), reload: vi.fn() };

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.clear();
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockClear();
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should initialize with loading state', async () => {
    // Mock no token scenario
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    // รอให้ loading เสร็จ แล้วเช็คว่า user เป็น null
    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
  });

  it('should load user from token on mount', async () => {
    const mockUser = {
      id: 1,
      name: 'Test User',
      email: 'test@example.com',
      picture: 'https://example.com/photo.jpg',
    };

    localStorageMock.getItem.mockReturnValue('mock-token');
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => mockUser,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toEqual(mockUser);
  });

  it('should handle invalid token', async () => {
    localStorageMock.getItem.mockReturnValue('invalid-token');
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user).toBe(null);
    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
  });

  it('should redirect to Google OAuth on login', async () => {
    localStorageMock.getItem.mockReturnValue(null);
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 401,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    act(() => {
      result.current.login();
    });

    expect(window.location.href).toBe('http://localhost:5000/api/auth/google');
  });

  it('should clear user and token on logout', async () => {
    const mockUser = { id: 1, name: 'Test User' };
    
    localStorageMock.getItem.mockReturnValue('mock-token');
    global.fetch
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockUser,
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true }),
      });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });

    await act(async () => {
      await result.current.logout();
    });

    expect(localStorageMock.removeItem).toHaveBeenCalledWith('token');
    expect(window.location.href).toBe('/');
  });

  it('should refresh user data', async () => {
    const mockUser = {
      id: 1,
      name: 'Updated User',
      email: 'updated@example.com',
    };

    localStorageMock.getItem.mockReturnValue('mock-token');
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => mockUser,
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    await act(async () => {
      await result.current.refreshUser();
    });

    await waitFor(() => {
      expect(result.current.user).toEqual(mockUser);
    });
  });
});