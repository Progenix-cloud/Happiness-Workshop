/**
 * JoyCoin Wallet API
 * GET /api/joycoins/wallet
 * Returns user's JoyCoin balance and transaction history
 */

import { NextRequest, NextResponse } from 'next/server';
import { authService } from '@/lib/auth/authService';
import { users, joyCoins } from '@/lib/mongodb/mockData';

export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const token = request.cookies.get('token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await authService.getCurrentUser(token);
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's transactions
    const userTransactions = joyCoins
      .filter((t) => t.userId === user._id)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return NextResponse.json({
      balance: user.joyCoins || 0,
      transactions: userTransactions,
      total: userTransactions.length,
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
