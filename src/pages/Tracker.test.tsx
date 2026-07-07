import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import Tracker from './Tracker';

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
  it('adds a new application through the modal', async () => {
    const user = userEvent.setup();
    render(<Tracker />);

    // Not there yet.
    expect(
      screen.queryByRole('heading', { name: 'DevOps Engineer' })
    ).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /new application/i }));

    await user.type(
      screen.getByPlaceholderText(/senior frontend engineer/i),
      'DevOps Engineer'
    );
    await user.type(screen.getByPlaceholderText(/stripe/i), 'Cloudflare');
    await user.click(screen.getByRole('button', { name: 'Add Application' }));

    // The new card is now on the board.
    const newCard = getCard('DevOps Engineer');
    expect(within(newCard).getByText('Cloudflare')).toBeInTheDocument();
  });

  it('edits an existing application', async () => {
    const user = userEvent.setup();
    render(<Tracker />);

    const card = getCard('Product Designer');
    await openCardMenu(user, card, /^edit$/i);

    // Modal is pre-filled with the current values.
    const companyInput = screen.getByDisplayValue('Airbnb');
    await user.clear(companyInput);
    await user.type(companyInput, 'Figma');
    await user.click(screen.getByRole('button', { name: 'Save Changes' }));

    // The card now reflects the new company.
    const updated = getCard('Product Designer');
    expect(within(updated).getByText('Figma')).toBeInTheDocument();
    expect(screen.queryByText('Airbnb')).not.toBeInTheDocument();
  });

  it('deletes an application after confirming', async () => {
    const user = userEvent.setup();
    render(<Tracker />);

    expect(
      screen.getByRole('heading', { name: 'Data Scientist' })
    ).toBeInTheDocument();

    const card = getCard('Data Scientist');
    await openCardMenu(user, card, /^delete$/i);

    // Confirmation dialog appears; confirm it.
    expect(
      screen.getByRole('heading', { name: /delete application/i })
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Delete' }));

    // Card is gone.
    expect(
      screen.queryByRole('heading', { name: 'Data Scientist' })
    ).not.toBeInTheDocument();
  });

  it('does not delete when the confirmation is cancelled', async () => {
    const user = userEvent.setup();
    render(<Tracker />);

    const card = getCard('Full Stack Developer');
    await openCardMenu(user, card, /^delete$/i);

    await user.click(screen.getByRole('button', { name: 'Cancel' }));

    // Still on the board.
    expect(
      screen.getByRole('heading', { name: 'Full Stack Developer' })
    ).toBeInTheDocument();
  });
});
