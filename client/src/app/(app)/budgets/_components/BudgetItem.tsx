import React from 'react';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn, toLocalMoney } from '@/lib/utils';
import Link from 'next/link';
import { Card } from '@/components/ui/card';
import { Transaction } from '../../transactions/columns';

export type BudgetItemInfo = {
  id: string;
  icon: string;
  name: string;
  amount: number;
  totalSpent: number;
  userId: string;
  transactions: Transaction[];
};

interface BudgetProps {
  budget: BudgetItemInfo;
  link?: string;
};

export default function BudgetItem({budget, link} : BudgetProps) {
  const content = (
    <Card>
      <div className="p-4 w-full h-40 flex flex-col justify-between">
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
              <p className="text-sm">{budget.transactions?.length || 0} transactions</p>
            </div>
          </div>
          <h1 className="font-bold text-blue-500">{toLocalMoney(budget.amount)}</h1>
        </div>

        <div className="mt-4">
          <div className="flex items-center justify-between">
            <p className="text-slate-500"></p>
            <p className={`${budget.totalSpent / budget.amount >= 0.8 ? "text-red-500" : "text-slate-500"} text-xs font-semibold`}>
              {budget.amount >= budget.totalSpent ? 
              `${toLocalMoney(budget.amount - budget.totalSpent)} remaining` :
              `${toLocalMoney(budget.totalSpent - budget.amount)} exceeded`}
            </p>
          </div>
          <div className="w-full bg-secondary h-2 rounded-full mt-2">
            <div 
              className={`${budget.totalSpent / budget.amount >= 0.8 ? "bg-red-500" : "bg-blue-500"} h-2 rounded-full`}
              style={{ width: `${(Math.min(budget.totalSpent || 0, budget.amount)) / budget.amount * 100}%`}}>
            </div>
          </div>
        </div>
      </div>
    </Card>
  )
  return (
    link ? <Link href={link}>{content}</Link> : content
  )
}