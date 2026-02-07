import { NextRequest, NextResponse } from 'next/server';

// POST: Reject application (admin only)
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { adminId, reason } = await request.json();
    const { id } = params;

    console.log('Rejecting application:', id, 'by admin:', adminId);

    // In a real app, verify admin permissions
    // Update application status to 'rejected'

    const updatedApplication = {
      _id: id,
      status: 'rejected',
      rejectionReason: reason,
      isEditable: false,
      timeline: {
        submitted: { date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), completed: true },
        underReview: { date: new Date(), completed: true },
        approved: { completed: false },
        interviewScheduled: { completed: false },
      },
      updatedAt: new Date(),
    };

    // Send notification to user
    // Send email

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error rejecting application:', error);
    return NextResponse.json(
      { error: 'Failed to reject application' },
      { status: 500 }
    );
  }
}
