"use client"

import { DataTable } from "@/components/ui/data-table";
import TransactionDialog from "./_components/TransactionDialog";
import { Transaction, columns } from "./columns";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";

export type AddTransactionFunction = (newTransaction: Transaction) => void;

export default function Transactions() {
  const [transactions, setTransactions] = useState<Transaction[]>();
  const { toast } = useToast();
  const [error, setError] = useState(false);
  const user = useUser();
  const budgets = [
    'Shopping',
    'Food',
    'E-books'
  ]
  useEffect(() => {
    const fetchData = async () => {
      try {
        const request = {
          id: user.user?.id,
        }
        const response = await fetch("http://localhost:8081/api/v1/transaction/get_all_transactions", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
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
    };
    // const fetchData = async () => {
    //   const data = [
    //     {
    //       id: "728ed52f",
    //       budget: "Shopping",
    //       description: "Lorem ipsum",
    //       date: new Date("2024-10-27"),
    //       amount: 1000000,
    //     },
    //     {
    //       id: "489e1d42",
    //       budget: "Memberships",
    //       description: "Lorem ipsum",
    //       date: new Date("2024-09-28"),
    //       amount: 10000000,
    //     },
    //     {
    //       id: "623ejh98e",
    //       budget: "Food",
    //       description: "Lorem ipsum",
    //       date: new Date("2024-08-29"),
    //       amount: 100000,
    //     },
    //     // ...
    //   ];
    //   setTransactions(data);
    // }
    fetchData();
  }, [])
  
  if (error || transactions === undefined) {
    return (
      <div></div>
    )
  }

  const addTransaction: AddTransactionFunction = (newTransaction) => {
    setTransactions((prevTransactions = []) => [...prevTransactions, newTransaction])
  }

  return (
    <div className="relative" style={{ minHeight: "calc(100vh - 96px)" }}>
      <div>
        <h1 className="font-bold text-3xl">All transactions</h1>
      </div>
      <div className="mt-8 pb-24">
        <DataTable columns={columns} data={transactions} />
      </div>
      <TransactionDialog onAddTransaction={addTransaction} budgets={budgets} />
    </div>
  );
}