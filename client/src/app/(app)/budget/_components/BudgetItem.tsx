import React from 'react';

interface BudgetItemProps {
  emoji: string;
  name: string;
  transactions: number;
  amount: number;
  totalSpent: number;
};

interface BudgetProps {
  budget: BudgetItemProps;
};

export default function BudgetItem({budget} : BudgetProps) {
  return (
    <div className="p-4 border rounded-lg min-w-[300px] max-w-[300px] min-h-[150px] max-h-[150px] hover:shadow-md flex flex-col justify-between">
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center max-w-[150px] overflow-clip">
          <div className="p-2 bg-blue-100 rounded-full text-xl">
            {budget.emoji}
          </div>
          <div>
            <h2 className="font-bold">{budget.name}</h2>
            <p className="text-sm">{budget.transactions} transactions</p>
          </div>
        </div>
        <h1 className="font-bold text-blue-500">{budget.amount} VND</h1>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500"></p>
          <p className="text-slate-500 text-xs">{budget.amount - budget.totalSpent} VND remaining</p>
        </div>
        <div className="w-full bg-slate-300 h-2 rounded-full">
          <div className="w-[40%] bg-blue-500 h-2 rounded-full">
          </div>
        </div>
      </div>
    </div>
  )
}