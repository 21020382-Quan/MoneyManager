"use client"

import { DataTable } from "@/components/ui/data-table";
import TransactionDialog from "./_components/TransactionDialog";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { BudgetItemInfo } from "../budgets/_components/BudgetItem";
import { columns, Transaction } from "./columns";

export type AddTransactionFunction = (newTransaction: Transaction) => void;
export type EditTransactionFunction = (newTransaction: Transaction) => void;
export type DeleteTransactionFunction = (id: string) => void;

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [budgets, setBudgets] = useState<BudgetItemInfo[]>();
  const { toast } = useToast();
  const [error, setError] = useState(false);
  const { user } = useUser();
  const fetchTransactionsData = async () => {
    if (!user) return
    try {
      const response = await fetch(`http://localhost:8081/api/v1/transaction/get_all_transactions/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Get transactions error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      setTransactions(data.data);
    } catch (error) {
      toast({
        title: `Failed to load page!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
      setError(true);
    }
  }
  const fetchBudgetsData = async () => {
    if (!user) return
    try {
      const response = await fetch(`http://localhost:8081/api/v1/budget/get_all_budgets/${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      })

      if (!response.ok) {
        throw new Error(`Get budgets error! Status: ${response.status}`);
      }

      const data = await response.json();

      setBudgets(data);

    } catch (error) {
      toast({
        title: `Failed to load page!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
      setError(true);
    }
  }
  useEffect(() => {
    fetchBudgetsData();
    fetchTransactionsData();
  }, [user])
  
  if (error || transactions === undefined || budgets === undefined) {
    return <h1 className="font-bold text-3xl">Loading page...</h1>
  }

  const addTransaction: AddTransactionFunction = async (newTransaction) => {
    fetchTransactionsData();
  }

  const deleteTransaction: DeleteTransactionFunction = (id) => {
    fetchTransactionsData();
  };

  const editTransaction: EditTransactionFunction = (newTransaction) => {
    fetchTransactionsData();
  }

  return (
    <div className="relative" style={{ minHeight: "calc(100vh - 96px)" }}>
      <div>
        <h1 className="font-bold text-3xl">All transactions</h1>
      </div>
      <div className="mt-8 pb-24">
        <DataTable columns={columns({editTransaction, deleteTransaction})} data={transactions} />
      </div>
      <TransactionDialog onAddTransaction={addTransaction} budgets={budgets} />
    </div>
  );
}