import { NextRequest, NextResponse } from 'next/server';

const mockQuotes: Record<string, any> = {};

export async function POST(request: NextRequest) {
  try {
    const { userId, quote, personalStory } = await request.json();

    mockQuotes[userId] = {
      quote,
      personalStory,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json(
      { success: true, message: 'Quote saved successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving quote:', error);
    return NextResponse.json(
      { error: 'Failed to save quote' },
      { status: 500 }
    );
  }
}
