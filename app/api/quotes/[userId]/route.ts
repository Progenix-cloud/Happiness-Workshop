import { NextRequest, NextResponse } from 'next/server';

const mockQuotes: Record<string, any> = {
  'default-user': {
    quote: 'Happiness is not something ready made. It comes from your own actions.',
    personalStory: 'This quote reminds me that I have the power to create my own happiness.',
  },
};

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    const quote = mockQuotes[userId] || { quote: '', personalStory: '' };

    return NextResponse.json(quote);
  } catch (error) {
    console.error('Error fetching quote:', error);
    return NextResponse.json(
      { error: 'Failed to fetch quote' },
      { status: 500 }
    );
  }
}
