import { NextRequest, NextResponse } from 'next/server';

const mockTrainers = [
  {
    _id: 't1',
    name: 'Dr. Sarah Johnson',
    expertise: ['Happiness', 'Stress Management', 'Meditation'],
    experience: '10+ years',
    bio: 'Passionate about spreading happiness through evidence-based well-being practices.',
    workshopsLed: 45,
    rating: 4.8,
    email: 'sarah@happiness.com',
  },
  {
    _id: 't2',
    name: 'Prof. Raj Kumar',
    expertise: ['Inner Joy', 'IKIGAI', 'Team Connect'],
    experience: '8 years',
    bio: 'Dedicated to helping teams find joy and purpose in their work.',
    workshopsLed: 32,
    rating: 4.6,
    email: 'raj@happiness.com',
  },
  {
    _id: 't3',
    name: 'Maya Sharma',
    expertise: ['Conscious Sleep (Yog-Nidra)', 'Mindfulness', 'Yoga'],
    experience: '6 years',
    bio: 'Specializes in mindfulness and restorative practices for well-being.',
    workshopsLed: 28,
    rating: 4.9,
    email: 'maya@happiness.com',
  },
  {
    _id: 't4',
    name: 'James Wilson',
    expertise: ['Team Connect', 'Stress Management', 'Happiness'],
    experience: '12 years',
    bio: 'Expert in building positive team dynamics and organizational well-being.',
    workshopsLed: 56,
    rating: 4.7,
    email: 'james@happiness.com',
  },
  {
    _id: 't5',
    name: 'Priya Patel',
    expertise: ['Meditation', 'Inner Joy', 'Mindfulness'],
    experience: '5 years',
    bio: 'Certified meditation instructor focused on personal transformation.',
    workshopsLed: 20,
    rating: 4.8,
    email: 'priya@happiness.com',
  },
  {
    _id: 't6',
    name: 'Dr. Michael Chen',
    expertise: ['IKIGAI', 'Happiness', 'Stress Management'],
    experience: '9 years',
    bio: 'Research-backed approach to finding purpose and lasting happiness.',
    workshopsLed: 42,
    rating: 4.9,
    email: 'michael@happiness.com',
  },
];

export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(mockTrainers);
  } catch (error) {
    console.error('Error fetching trainers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch trainers' },
      { status: 500 }
    );
  }
}
