import { NextRequest, NextResponse } from 'next/server';

// PATCH: Update application (user editing)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const { id } = params;

    console.log('Updating application:', id, data);

    // In a real app, check if user owns this application
    // and if it's still editable

    // Update application
    const updatedApplication = {
      ...data,
      _id: id,
      updatedAt: new Date(),
    };

    return NextResponse.json({
      success: true,
      application: updatedApplication,
    });
  } catch (error) {
    console.error('Error updating application:', error);
    return NextResponse.json(
      { error: 'Failed to update application' },
      { status: 500 }
    );
  }
}
