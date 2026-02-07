/**
 * JoyCoin Wallet Component
 * Displays user's JoyCoin balance and transaction history
 */

'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { TrendingUp, Award, Gift, ShoppingCart, History } from 'lucide-react';

interface JoyCoinTransaction {
  _id: string;
  type: 'workshop_attendance' | 'certificate_earned' | 'reward' | 'deduction';
  amount: number;
  description: string;
  balanceAfter: number;
  createdAt: string;
}

interface JoyCoinWalletProps {
  userId?: string;
}

export function JoyCoinWallet({ userId }: JoyCoinWalletProps) {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<JoyCoinTransaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWalletData();
  }, [userId]);

  async function fetchWalletData() {
    try {
      const res = await fetch('/api/joycoins/wallet');
      const data = await res.json();
      setBalance(data.balance || 0);
      setTransactions(data.transactions || []);
    } catch (error) {
      console.error('Failed to fetch wallet data:', error);
    } finally {
      setLoading(false);
    }
  }

  function getTransactionIcon(type: JoyCoinTransaction['type']) {
    switch (type) {
      case 'workshop_attendance':
        return <Award className="h-4 w-4 text-green-600" />;
      case 'certificate_earned':
        return <Gift className="h-4 w-4 text-blue-600" />;
      case 'reward':
        return <TrendingUp className="h-4 w-4 text-purple-600" />;
      case 'deduction':
        return <ShoppingCart className="h-4 w-4 text-red-600" />;
      default:
        return <History className="h-4 w-4 text-gray-600" />;
    }
  }

  function getTransactionColor(type: JoyCoinTransaction['type']) {
    switch (type) {
      case 'workshop_attendance':
        return 'text-green-600';
      case 'certificate_earned':
        return 'text-blue-600';
      case 'reward':
        return 'text-purple-600';
      case 'deduction':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  }

  if (loading) {
    return <div className="text-center py-8">Loading wallet...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Balance Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>JoyCoin Balance</CardTitle>
                <CardDescription>Your current reward balance</CardDescription>
              </div>
              <div className="text-4xl font-bold text-yellow-600">💰</div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-baseline gap-3">
              <div className="text-5xl font-bold text-gray-900">{balance}</div>
              <div className="text-xl text-gray-600 font-semibold">JoyCoins</div>
            </div>
            <p className="text-sm text-gray-600 mt-4">
              Earn JoyCoins by attending workshops and completing certifications!
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Earned This Month</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions
                .filter(
                  (t) =>
                    t.type !== 'deduction' &&
                    new Date(t.createdAt).getMonth() === new Date().getMonth()
                )
                .reduce((sum, t) => sum + t.amount, 0)}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Earned</CardTitle>
            <Award className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {transactions
                .filter((t) => t.type !== 'deduction')
                .reduce((sum, t) => sum + t.amount, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <History className="h-5 w-5" />
            Transaction History
          </CardTitle>
          <CardDescription>Your recent JoyCoin activity</CardDescription>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-gray-600">
              <p>No transactions yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {transactions.slice(0, 10).map((transaction, index) => (
                <motion.div
                  key={transaction._id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className="flex items-center justify-between pb-4 border-b last:border-0 last:pb-0"
                >
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gray-100">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-600">
                        {new Date(transaction.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.amount > 0 ? '+' : ''}{transaction.amount}
                    </div>
                    <p className="text-xs text-gray-600">
                      Balance: {transaction.balanceAfter}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Rewards Marketplace Teaser */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gift className="h-5 w-5" />
            Redeem Your JoyCoins
          </CardTitle>
          <CardDescription>Coming Soon - Exclusive rewards marketplace</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Soon you'll be able to redeem your JoyCoins for:
          </p>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Badge>🎁</Badge> Premium Workshop Access
            </li>
            <li className="flex items-center gap-2">
              <Badge>📚</Badge> Exclusive Materials & Resources
            </li>
            <li className="flex items-center gap-2">
              <Badge>🏅</Badge> Special Certifications
            </li>
            <li className="flex items-center gap-2">
              <Badge>👥</Badge> 1-on-1 Mentoring Sessions
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
