import { NextRequest, NextResponse } from 'next/server';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { userId } = await request.json();
    const workshopId = params.id;

    // TODO: Replace with actual database logic
    // For now, mock response
    console.log(`User ${userId} liked workshop ${workshopId}`);

    // In production:
    // const workshop = await db.workshops.findById(workshopId);
    // if (!workshop.likes.includes(userId)) {
    //   workshop.likes.push(userId);
    // } else {
    //   workshop.likes = workshop.likes.filter(id => id !== userId);
    // }
    // await workshop.save();

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error toggling like:', error);
    return NextResponse.json(
      { error: 'Failed to toggle like' },
      { status: 500 }
    );
  }
}
