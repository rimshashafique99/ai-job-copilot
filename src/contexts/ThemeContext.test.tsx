import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ThemeProvider, useTheme } from './ThemeContext';

// getInitialDark() falls back to window.matchMedia when nothing is stored.
// jsdom doesn't implement matchMedia, so provide a controllable stub.
function mockMatchMedia(prefersDark: boolean) {
  vi.stubGlobal(
    'matchMedia',
    vi.fn().mockImplementation((query: string) => ({
      matches: prefersDark,
      media: query,
      onchange: null,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      addListener: vi.fn(),
      removeListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }))
  );
}

// Small consumer that surfaces the context so the test can read + drive it.
function ThemeConsumer() {
  const { darkMode, toggleDark, setDarkMode } = useTheme();
  return (
    <div>
      <span data-testid="mode">{darkMode ? 'dark' : 'light'}</span>
      <button onClick={toggleDark}>toggle</button>
      <button onClick={() => setDarkMode(true)}>force-dark</button>
    </div>
  );
}

describe('ThemeContext', () => {
  beforeEach(() => {
    localStorage.clear();
    document.documentElement.classList.remove('dark');
    mockMatchMedia(false);
  });

  it('useTheme throws when used outside a ThemeProvider', () => {
    // Suppress React's expected error log for the thrown render.
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => render(<ThemeConsumer />)).toThrow(
      /useTheme must be used within a ThemeProvider/
    );
    spy.mockRestore();
  });

  it('initialises from the stored "theme" value in localStorage', () => {
    localStorage.setItem('theme', 'dark');

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });

  it('falls back to the OS preference when nothing is stored', () => {
    mockMatchMedia(true); // OS prefers dark

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
  });

  it('toggleDark flips the mode, the <html> class, and persists to localStorage', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    // Starts light (no stored value, OS prefers light).
    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(localStorage.getItem('theme')).toBe('light');

    await user.click(screen.getByText('toggle'));

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
    expect(localStorage.getItem('theme')).toBe('dark');

    await user.click(screen.getByText('toggle'));

    expect(screen.getByTestId('mode')).toHaveTextContent('light');
    expect(document.documentElement.classList.contains('dark')).toBe(false);
    expect(localStorage.getItem('theme')).toBe('light');
  });

  it('setDarkMode(true) turns dark mode on directly', async () => {
    const user = userEvent.setup();

    render(
      <ThemeProvider>
        <ThemeConsumer />
      </ThemeProvider>
    );

    await user.click(screen.getByText('force-dark'));

    expect(screen.getByTestId('mode')).toHaveTextContent('dark');
    expect(document.documentElement.classList.contains('dark')).toBe(true);
  });
});
