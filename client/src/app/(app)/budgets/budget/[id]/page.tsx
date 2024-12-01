"use client"

import { DataTable } from "@/components/ui/data-table";
import BudgetItem, { BudgetItemInfo } from "../../_components/BudgetItem";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import DeleteBudgetDialog from "./_components/DeleteBudgetDialog";
import EditBudgetDialog from "./_components/EditBudgetDialog";
import { useUser } from "@clerk/nextjs";
import { columns, Transaction } from "@/app/(app)/transactions/columns";
import TransactionDialog from "@/app/(app)/transactions/_components/TransactionDialog";

interface ParamsProps {
  params: {
    id: string;
  }
}

export type EditBudgetFunction = (newBudget: BudgetItemInfo) => void;
export type AddTransactionFunction = (newTransaction: Transaction) => void;
export type EditTransactionFunction = (newTransaction: Transaction) => void;
export type DeleteTransactionFunction = (id: string) => void;

export default function Budget({ params } : ParamsProps) {
  const { toast } = useToast();
  const [budget, setBudget] = useState<BudgetItemInfo>();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [error, setError] = useState(false);
  const { user } = useUser();

  const fetchData = async () => {
    if (!user) return;
    try {
      const response = await fetch(`http://localhost:8081/api/v1/budget/get/${params.id}?clerkId=${user.id}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setBudget(data);
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

  useEffect(() => {
    fetchData();
  }, [user]);

  useEffect(() => {
    if (budget) {
      setTransactions(
        budget.transactions.map((transaction) => ({
          ...transaction,
          budget: budget.name,
        }))
      );
    }
  }, [budget]);

  if (error || budget === undefined) {
    return <h1 className="font-bold text-3xl">Loading page...</h1>
  }

  const editBudget: EditBudgetFunction = (newBudget) => {
    setBudget(newBudget);
  };

  const addTransaction: AddTransactionFunction = async (newTransaction) => {
    setTransactions((prevTransactions = []) => [...prevTransactions, newTransaction])
    await fetchData();
  }

  const deleteTransaction: DeleteTransactionFunction = async (id) => {
    setTransactions((prevTransactions = []) =>
      prevTransactions.filter((transaction) => transaction.id !== id)
    );
    await fetchData();
  };

  const editTransaction: EditTransactionFunction = async (newTransaction) => {
    setTransactions((prevTransactions = []) => 
      prevTransactions.filter((transaction) => transaction.id !== newTransaction.id)
    );
    setTransactions((prevTransactions = []) => [newTransaction, ...prevTransactions]);
    await fetchData();
  };

  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">Budget {budget.name}</h1>
      </div>
      <div className="mt-8 grid md:grid-cols-2 sm:grid-cols-1 gap-4">
        <BudgetItem budget={budget}/>
        <div className="flex flex-col gap-4 w-full">
          <EditBudgetDialog id={budget.id} prevIcon={budget.icon} prevName={budget.name} prevAmount={budget.amount} onEditBudget={editBudget}/>
          <DeleteBudgetDialog id={budget.id} name={budget.name}/>
        </div>
      </div>
      <div className="mt-8 pb-24">
        <span className="font-bold">Transactions</span>
        <DataTable columns={columns({editTransaction, deleteTransaction})} data={transactions} />
      </div>
      <TransactionDialog onAddTransaction={addTransaction} budgets={[budget]} inBudget={true} />
    </div>
  );
}
