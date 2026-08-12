import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import JobInputPanel from '../components/JobinPutPanel';

// Wrapper that mimics what Analyze.tsx does for JobInputPanel
const Wrapper = () => {
  const [jd, setJd] = useState('');
  return (
    <JobInputPanel
      companyName=""
      jobDescription={jd}
      isAnalyzing={false}
      onCompanyChange={() => {}}
      onJDChange={setJd}
      onAnalyze={() => {}}
    />
  );
};

describe('JobInputPanel — Analyze button', () => {
  let textarea: HTMLElement;
  let button: HTMLElement;

  beforeEach(() => {
    render(<Wrapper />);
    textarea = screen.getByPlaceholderText(/paste the full job/i);
    button = screen.getByRole('button', { name: /analyze/i });
  });

  it('enables the Analyze button once JD is long enough', async () => {
    const user = userEvent.setup();
    await user.type(textarea, 'a'.repeat(35));
    expect(button).toBeEnabled();
  });

  it('keeps the Analyze button disabled when JD is too short', async () => {
    const user = userEvent.setup();
    await user.type(textarea, 'a'.repeat(20));
    expect(button).toBeDisabled();
  });
});