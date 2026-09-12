import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter } from 'react-router-dom';
import Tracker from './Tracker';

// ---------------------------------------------------------------------------
// Mock the API layer entirely — no real network calls in this test file.
// We keep an in-memory array that get/post/patch/delete all operate on,
// so the UI's refetch-after-mutation behavior (invalidateQueries) has
// real, consistent data to reflect — same idea as Day 4's groqService mock,
// just at the frontend's HTTP boundary instead of the backend's Groq boundary.
// ---------------------------------------------------------------------------
interface MockJobApplicationRow {
  id: string;
  user_id: string;
  role: string | null;
  company_name: string;
  job_title: string | null;
  job_description: string | null;
  job_link: string | null;
  tag: string | null;
  stage: string;
  interview_date: string | null;
  created_at: string;
  updated_at: string;
}

interface MockCreatePayload {
  companyName: string;
  stage: string;
  role?: string;
  tag?: string;
  jobLink?: string;
}

interface MockUpdatePayload {
  companyName?: string;
  stage?: string;
  role?: string;
  tag?: string;
  jobLink?: string;
}

let mockRows: MockJobApplicationRow[];

function resetMockRows() {
  mockRows = [
    {
      id: '1', user_id: 'u1', role: 'Product Designer', company_name: 'Airbnb',
      job_title: null, job_description: null, job_link: null, tag: null,
      stage: 'applied', interview_date: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: '2', user_id: 'u1', role: 'Data Scientist', company_name: 'Netflix',
      job_title: null, job_description: null, job_link: null, tag: null,
      stage: 'applied', interview_date: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
    {
      id: '3', user_id: 'u1', role: 'Full Stack Developer', company_name: 'Shopify',
      job_title: null, job_description: null, job_link: null, tag: null,
      stage: 'applied', interview_date: null,
      created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
    },
  ];
}

vi.mock('../services/api', () => ({
  default: {
    get: vi.fn((url: string) => {
      if (url === '/tracker') {
        return Promise.resolve({ data: { success: true, data: mockRows } });
      }
      return Promise.reject(new Error(`Unhandled GET ${url}`));
    }),
    post: vi.fn((_url: string, payload: MockCreatePayload) => {
      const newRow = {
        id: String(mockRows.length + 1),
        user_id: 'u1',
        role: payload.role ?? null,
        company_name: payload.companyName,
        job_title: null,
        job_description: null,
        job_link: payload.jobLink ?? null,
        tag: payload.tag ?? null,
        stage: payload.stage,
        interview_date: null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      mockRows.push(newRow);
      return Promise.resolve({ data: { success: true, data: newRow } });
    }),
    patch: vi.fn((url: string, payload: MockUpdatePayload) => {
      const id = url.split('/').pop();
      const row = mockRows.find((r) => r.id === id);
      if (row) {
        if (payload.role !== undefined) row.role = payload.role;
        if (payload.companyName !== undefined) row.company_name = payload.companyName;
        if (payload.stage !== undefined) row.stage = payload.stage;
        if (payload.tag !== undefined) row.tag = payload.tag;
        if (payload.jobLink !== undefined) row.job_link = payload.jobLink;
      }
      return Promise.resolve({ data: { success: true, data: row } });
    }),
    delete: vi.fn((url: string) => {
      const id = url.split('/').pop();
      mockRows = mockRows.filter((r) => r.id !== id);
      return Promise.resolve({ data: { success: true } });
    }),
  },
}));

function renderTracker() {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <Tracker />
      </MemoryRouter>
    </QueryClientProvider>
  );
}

// Grab a Kanban card by the role shown in its heading, then hand back its root
// element so we can scope queries (its actions menu, etc.) to that card.
function getCard(role: string): HTMLElement {
  const heading = screen.getByRole('heading', { name: role });
  const card = heading.closest('[draggable="true"]');
  if (!card) throw new Error(`Card for "${role}" not found`);
  return card as HTMLElement;
}

// Open a card's "⋯" actions menu and click one of its items.
async function openCardMenu(
  user: ReturnType<typeof userEvent.setup>,
  card: HTMLElement,
  item: RegExp
) {
  await user.click(within(card).getByRole('button'));
  await user.click(screen.getByRole('menuitem', { name: item }));
}

describe('Tracker — application pipeline', () => {
  beforeEach(() => {
    resetMockRows();
  });

  it('adds a new application through the modal', async () => {
    const user = userEvent.setup();
    renderTracker();

    await screen.findByRole('heading', { name: 'Product Designer' }); // wait for initial load

    expect(
      screen.queryByRole('heading', { name: 'DevOps Engineer' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new application/i }));
    await user.type(screen.getByPlaceholderText(/senior frontend engineer/i), 'DevOps Engineer');
    await user.type(screen.getByPlaceholderText(/stripe/i), 'Cloudflare');
    await user.click(screen.getByRole('button', { name: 'Add Application' }));

    const newCard = await screen.findByRole('heading', { name: 'DevOps Engineer' });
    expect(within(newCard.closest('[draggable="true"]')!).getByText('Cloudflare')).toBeInTheDocument();
  });

  it('edits an existing application', async () => {
    const user = userEvent.setup();
    renderTracker();

    await screen.findByRole('heading', { name: 'Product Designer' });
    const card = getCard('Product Designer');
    await openCardMenu(user, card, /^edit$/i);

    const companyInput = screen.getByDisplayValue('Airbnb');
    await user.clear(companyInput);
    await user.type(companyInput, 'Figma');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    await screen.findByText('Figma');
    expect(screen.queryByText('Airbnb')).not.toBeInTheDocument();
  });

  it('deletes an application after confirming', async () => {
    const user = userEvent.setup();
    renderTracker();

    await screen.findByRole('heading', { name: 'Data Scientist' });
    const card = getCard('Data Scientist');
    await openCardMenu(user, card, /^delete$/i);

    expect(screen.getByRole('heading', { name: /delete application/i })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    await vi.waitFor(() =>
      expect(screen.queryByRole('heading', { name: 'Data Scientist' })).not.toBeInTheDocument()
    );
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    renderTracker();

    await screen.findByRole('heading', { name: 'Full Stack Developer' });
    const card = getCard('Full Stack Developer');
    await openCardMenu(user, card, /^delete$/i);
    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    expect(screen.getByRole('heading', { name: 'Full Stack Developer' })).toBeInTheDocument();
  });
});
