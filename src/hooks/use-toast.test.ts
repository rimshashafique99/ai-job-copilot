import { describe, it, expect } from 'vitest';
import { reducer } from './use-toast';

// Minimal fake state to start each test from
const emptyState = { toasts: [] };

describe('toast reducer', () => {
  it('ADD_TOAST adds a toast to state', () => {
    const action = {
      type: 'ADD_TOAST' as const,
      toast: { id: '1', title: 'Saved', open: true },
    };

    const result = reducer(emptyState, action);

    expect(result.toasts).toHaveLength(1);
    expect(result.toasts[0].title).toBe('Saved');
  });

  it('respects TOAST_LIMIT of 1 — adding a second toast replaces the first', () => {
    const stateWithOneToast = {
      toasts: [{ id: '1', title: 'First', open: true }],
    };
    const action = {
      type: 'ADD_TOAST' as const,
      toast: { id: '2', title: 'Second', open: true },
    };

    const result = reducer(stateWithOneToast, action);

    // TOAST_LIMIT = 1, so only the newest toast should survive
    expect(result.toasts).toHaveLength(1);
    expect(result.toasts[0].id).toBe('2');
  });

  it('UPDATE_TOAST merges new fields into the matching toast by id', () => {
    const state = {
      toasts: [{ id: '1', title: 'Original', open: true }],
    };
    const action = {
      type: 'UPDATE_TOAST' as const,
      toast: { id: '1', title: 'Updated' },
    };

    const result = reducer(state, action);

    expect(result.toasts[0].title).toBe('Updated');
    expect(result.toasts[0].open).toBe(true); // unrelated fields stay untouched
  });

  it('DISMISS_TOAST sets open to false for the matching toast', () => {
    const state = {
      toasts: [{ id: '1', title: 'Bye', open: true }],
    };
    const action = { type: 'DISMISS_TOAST' as const, toastId: '1' };

    const result = reducer(state, action);

    expect(result.toasts[0].open).toBe(false);
  });

  it('REMOVE_TOAST with no toastId clears all toasts', () => {
    const state = {
      toasts: [
        { id: '1', title: 'A', open: true },
        { id: '2', title: 'B', open: true },
      ],
    };
    const action = { type: 'REMOVE_TOAST' as const, toastId: undefined };

    const result = reducer(state, action);

    expect(result.toasts).toHaveLength(0);
  });

  it('REMOVE_TOAST with a specific id only removes that toast', () => {
    const state = {
      toasts: [
        { id: '1', title: 'Keep me', open: true },
        { id: '2', title: 'Remove me', open: true },
      ],
    };
    const action = { type: 'REMOVE_TOAST' as const, toastId: '2' };

    const result = reducer(state, action);

    expect(result.toasts).toHaveLength(1);
    expect(result.toasts[0].id).toBe('1');
  });
});