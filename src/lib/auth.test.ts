import { describe, it, expect, beforeEach } from 'vitest';
import { isAuthenticated, login, logout } from './auth';

describe('auth', () => {
  // Clear localStorage before each test so tests don't leak state into each other
  beforeEach(() => {
    localStorage.clear();
  });

  it('isAuthenticated returns false when nothing is stored', () => {
    expect(isAuthenticated()).toBe(false);
  });

  it('login sets both the auth flag and access token in localStorage', () => {
    login();

    expect(localStorage.getItem('ai-job-copilot-auth')).toBe('true');
    expect(localStorage.getItem('access_token')).toBe('demo-token');
  });

  it('isAuthenticated returns true after login', () => {
    login();
    expect(isAuthenticated()).toBe(true);
  });

  it('logout clears both keys', () => {
    login(); // first set them
    logout();

    expect(localStorage.getItem('ai-job-copilot-auth')).toBeNull();
    expect(localStorage.getItem('access_token')).toBeNull();
  });

  it('isAuthenticated returns false after logout', () => {
    login();
    logout();
    expect(isAuthenticated()).toBe(false);
  });
});