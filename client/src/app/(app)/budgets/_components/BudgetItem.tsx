import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn, toLocalMoney } from '@/lib/utils';
import { BudgetTransaction } from '../budget/[id]/columns';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export type BudgetItemInfo = {
  id: string;
  icon: string;
  name: string;
  transaction: number;
  amount: number;
  totalSpent: number;
  transactionsList?: BudgetTransaction[];
};

interface BudgetProps extends React.HTMLAttributes<HTMLDivElement> {
  budget: BudgetItemInfo;
  link?: string;
};

export default function BudgetItem({budget, link, className} : BudgetProps) {
  const content = (
    <div className={cn("p-4 border rounded-lg w-[300px] h-[150px] flex flex-col justify-between transition-colors duration-120", className)}>
      <div className="flex items-center justify-between">
        <div className="flex gap-2 items-center max-w-[150px] overflow-clip">
          <div className="p-2 bg-secondary rounded-full text-xl">
            {budget.icon}
          </div>
          <div>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger className="font-bold hover:cursor-text select-text">{budget.name}</TooltipTrigger>
                <TooltipContent>
                  <p>{budget.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <p className="text-sm">{budget.transaction} transactions</p>
          </div>
        </div>
        <h1 className="font-bold text-blue-500">{toLocalMoney(budget.amount)}</h1>
      </div>

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <p className="text-slate-500"></p>
          <p className="text-slate-500 text-xs">{toLocalMoney(budget.amount - (budget.totalSpent || 0))} remaining</p>
        </div>
        <div className="w-full bg-secondary h-2 rounded-full">
          <div 
            className="bg-blue-500 h-2 rounded-full" 
            style={{ width: `${(budget.totalSpent || 0) / budget.amount}`}}>
          </div>
        </div>
      </div>
    </div>
  )
  return (
    link ? <Link href={link}>{content}</Link> : content
  )
}