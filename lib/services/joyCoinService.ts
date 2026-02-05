/**
 * JoyCoin Service
 * Manages JoyCoin transactions and user balances
 */

import { users, joyCoins as joyCoinTransactions } from '@/lib/mongodb/mockData';
import { IJoyCoinTransaction } from '@/lib/mongodb/schemas';

export class JoyCoinService {
  /**
   * 💰 Award JoyCoins to a user
   */
  async awardCoins(
    userId: string,
    amount: number,
    type: IJoyCoinTransaction['type'],
    description: string,
    workshopId?: string
  ): Promise<IJoyCoinTransaction> {
    // Get current user balance
    const user = users.find((u) => u._id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Calculate new balance
    const newBalance = (user.joyCoins || 0) + amount;
    user.joyCoins = newBalance;

    // Create transaction record
    const transaction: IJoyCoinTransaction = {
      _id: `joycoin_${Date.now()}`,
      userId,
      amount,
      type,
      description,
      workshopId,
      balanceAfter: newBalance,
      createdAt: new Date(),
    };

    joyCoinTransactions.push(transaction);

    console.log(`💰 Awarded ${amount} JoyCoins to User ${userId}. New balance: ${newBalance}`);
    return transaction;
  }

  /**
   * 💸 Deduct JoyCoins from a user
   */
  async deductCoins(
    userId: string,
    amount: number,
    description: string
  ): Promise<IJoyCoinTransaction> {
    const user = users.find((u) => u._id === userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    // Check sufficient balance
    if ((user.joyCoins || 0) < amount) {
      throw new Error('Insufficient JoyCoins balance');
    }

    const newBalance = user.joyCoins! - amount;
    user.joyCoins = newBalance;

    const transaction: IJoyCoinTransaction = {
      _id: `joycoin_${Date.now()}`,
      userId,
      amount: -amount, // Negative for deduction
      type: 'deduction',
      description,
      balanceAfter: newBalance,
      createdAt: new Date(),
    };

    joyCoinTransactions.push(transaction);

    console.log(`💸 Deducted ${amount} JoyCoins from User ${userId}. New balance: ${newBalance}`);
    return transaction;
  }

  /**
   * 📊 Get user's JoyCoin balance
   */
  getBalance(userId: string): number {
    const user = users.find((u) => u._id === userId);
    return user?.joyCoins || 0;
  }

  /**
   * 📜 Get transaction history for a user
   */
  getTransactions(userId: string): IJoyCoinTransaction[] {
    return joyCoinTransactions
      .filter((t) => t.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * 🎁 Award workshop completion bonus
   */
  async awardWorkshopCompletion(
    userId: string,
    workshopId: string,
    workshopTitle: string,
    rewardAmount: number = 20
  ): Promise<IJoyCoinTransaction> {
    return this.awardCoins(
      userId,
      rewardAmount,
      'workshop_attendance',
      `Completed workshop: ${workshopTitle}`,
      workshopId
    );
  }

  /**
   * 🎓 Award certificate bonus
   */
  async awardCertificate(
    userId: string,
    workshopId: string,
    workshopTitle: string
  ): Promise<IJoyCoinTransaction> {
    return this.awardCoins(
      userId,
      10,
      'certificate_earned',
      `Earned certificate: ${workshopTitle}`,
      workshopId
    );
  }
}

// Export singleton instance
export const joyCoinService = new JoyCoinService();
