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

type TransactionData = {
  id: string,
  amount: number,
  budgetName: string,
  date: Date,
}

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const [budgets, setBudgets] = useState<string[]>();
  const { toast } = useToast();
  const [error, setError] = useState(false);
  const { user } = useUser();
  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
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

        setTransactions(data.data.map((transaction: TransactionData) => {
          return {
            ...transaction,
            budget: transaction.budgetName,
          }
        }));
      } catch (error) {
        toast({
          title: `Failed to load page!`,
          description: `${error}`,
          duration: 3000,
          className: "border-none bg-red-500 text-white",
        });
        setError(true);
      }

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

        setBudgets(data.map((budget: BudgetItemInfo) => {
          return budget.name;
        }))

      } catch (error) {
        toast({
          title: `Failed to load page!`,
          description: `${error}`,
          duration: 3000,
          className: "border-none bg-red-500 text-white",
        });
        setError(true);
      }
    };
    fetchData();
  }, [user])
  
  if (error || !transactions || !budgets) {
    return (
      <div></div>
    )
  }

  const addTransaction: AddTransactionFunction = (newTransaction) => {
    setTransactions((prevTransactions = []) => [...prevTransactions, newTransaction])
  }

  const deleteTransaction: DeleteTransactionFunction = (id) => {
    setTransactions((prevTransactions = []) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
  };

  const editTransaction: EditTransactionFunction = (newTransaction) => {
    setTransactions((prevTransactions = []) => 
      prevTransactions.filter((transaction) => transaction.id !== newTransaction.id)
    );
    setTransactions((prevTransactions = []) => [newTransaction, ...prevTransactions])
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