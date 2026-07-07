import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import ProtectedRoute from './ProtectedRoute';
import * as authModule from '../lib/auth';

describe('ProtectedRoute', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('redirects to /login when the user is not authenticated', () => {
    vi.spyOn(authModule, 'isAuthenticated').mockReturnValue(false);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Login Page')).toBeInTheDocument();
    expect(screen.queryByText('Secret Dashboard')).not.toBeInTheDocument();
  });

  it('renders children when the user is authenticated', () => {
    vi.spyOn(authModule, 'isAuthenticated').mockReturnValue(true);

    render(
      <MemoryRouter initialEntries={['/dashboard']}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <div>Secret Dashboard</div>
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByText('Secret Dashboard')).toBeInTheDocument();
  });
});