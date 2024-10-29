import React from 'react';
import { Pen, Trash } from 'lucide-react';

interface TransactionItemProps {
  description: string,
  amount: number,
  date: string,
};

interface TransactionProps {
  transaction: TransactionItemProps;
  index: number
};

export default function TransactionItem({transaction, index} : TransactionProps) {
  return (
    <div
      className={`grid grid-cols-4 p-4 ${index % 2 === 0 ? 'bg-slate-100' : 'bg-blue-100'}`}
    >
      <h2>{transaction.description}</h2>
      <h2>{transaction.amount}</h2>
      <h2>{transaction.date}</h2>
      <div className="flex flex-row gap-4">
        <Trash className="text-[#d9534f]"></Trash>
        <Pen className="text-[#ffc021]"></Pen>
      </div>
    </div>
  )
}