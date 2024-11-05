'use client';

import BudgetDialog from './_components/BudgetDialog';
import BudgetItem from './_components/BudgetItem';

interface BudgetItemProps {
  emoji: string;
  name: string;
  transactions: number;
  amount: number;
  totalSpent: number;
};

export default function Budgets() {
  const budgets: BudgetItemProps[] = [
    {
      emoji: '🛍️',
      name: 'Shopping',
      transactions: 3,
      amount: 10000000,
      totalSpent: 400,
    },
    {
      emoji: '🛍️',
      name: 'Memberships',
      transactions: 2,
      amount: 1000000,
      totalSpent: 500,
    },
    {
      emoji: '🛍️',
      name: 'Food',
      transactions: 10,
      amount: 500000,
      totalSpent: 500000,
    },
  ]
  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">All budgets</h1>
      </div>
      <div className="mt-8 flex flex-wrap gap-4 justify-around">
        {budgets.map((budget, index) => (
          <BudgetItem budget={budget} key={index} />
        ))}
      </div>
      <BudgetDialog/>
    </div>
  );
}