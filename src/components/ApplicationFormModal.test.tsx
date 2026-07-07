import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ApplicationFormModal from './ApplicationFormModal';

const stages = [
  { id: 'applied' as const, label: 'Applied' },
  { id: 'interviewing' as const, label: 'Interviewing' },
];

describe('ApplicationFormModal', () => {
  it('shows an error when submitting with empty role and company', async () => {
    const onSubmit = vi.fn();
    render(
      <ApplicationFormModal
        open={true}
        mode="add"
        stages={stages}
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    );

    const user = userEvent.setup();
    await user.click(screen.getByText('Add Application'));

    expect(screen.getByText('Role and company are required.')).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('trims whitespace from role and company before submitting', async () => {
    const onSubmit = vi.fn();
    render(
      <ApplicationFormModal
        open={true}
        mode="add"
        stages={stages}
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/senior frontend engineer/i), '  Backend Dev  ');
    await user.type(screen.getByPlaceholderText(/stripe/i), '  Google  ');
    await user.click(screen.getByText('Add Application'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'Backend Dev', company: 'Google' })
    );
  });

  it('prepends https:// to a link missing a protocol', async () => {
    const onSubmit = vi.fn();
    render(
      <ApplicationFormModal
        open={true}
        mode="add"
        stages={stages}
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/senior frontend engineer/i), 'Dev');
    await user.type(screen.getByPlaceholderText(/stripe/i), 'Meta');
    await user.type(screen.getByPlaceholderText(/where you saw this job/i), 'meta.com/jobs');
    await user.click(screen.getByText('Add Application'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ link: 'https://meta.com/jobs' })
    );
  });

  it('does not double-prepend https:// if the user already typed it', async () => {
    const onSubmit = vi.fn();
    render(
      <ApplicationFormModal
        open={true}
        mode="add"
        stages={stages}
        onClose={() => {}}
        onSubmit={onSubmit}
      />
    );

    const user = userEvent.setup();
    await user.type(screen.getByPlaceholderText(/senior frontend engineer/i), 'Dev');
    await user.type(screen.getByPlaceholderText(/stripe/i), 'Meta');
    await user.type(screen.getByPlaceholderText(/where you saw this job/i), 'https://meta.com');
    await user.click(screen.getByText('Add Application'));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ link: 'https://meta.com' })
    );
  });

  it('resets the form fields when reopened with fresh initialValues', () => {
    const { rerender } = render(
      <ApplicationFormModal
        open={true}
        mode="edit"
        stages={stages}
        initialValues={{ role: 'Old Role', company: 'Old Co' }}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(screen.getByDisplayValue('Old Role')).toBeInTheDocument();

    // Simulate closing then reopening with different initialValues
    rerender(
      <ApplicationFormModal
        open={false}
        mode="edit"
        stages={stages}
        initialValues={{ role: 'Old Role', company: 'Old Co' }}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );
    rerender(
      <ApplicationFormModal
        open={true}
        mode="add"
        stages={stages}
        initialValues={{}}
        onClose={() => {}}
        onSubmit={() => {}}
      />
    );

    expect(screen.queryByDisplayValue('Old Role')).not.toBeInTheDocument();
  });
});