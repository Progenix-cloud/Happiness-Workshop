import React from 'react';
import { render } from '@testing-library/react';
import { ApplicationTracker } from './ApplicationTracker';

describe('ApplicationTracker', () => {
  const mockApplication = {
    status: 'submitted',
    timeline: {
      submitted: { date: '2026-02-07T15:39:22.557Z', completed: true },
      underReview: { completed: false },
      approved: { completed: false },
      interviewScheduled: { completed: false },
    },
    isEditable: true,
  };

  it('renders application tracker with correct timeline', () => {
    const { getByText } = render(<ApplicationTracker application={mockApplication} />);

    // Check if the "Submitted" step is displayed
    expect(getByText('Submitted')).toBeInTheDocument();
    expect(getByText('Application received')).toBeInTheDocument();

    // Check if the "Under Review" step is displayed
    expect(getByText('Under Review')).toBeInTheDocument();
  });
});