"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import AllSpendingsChart from "./_components/AllTransactionsChart";
import { BudgetItemInfo } from "../budgets/_components/BudgetItem";
import AllBudgetsBarChart from "./_components/AllBudgetsChart";
import AllBudgetsPercentageChart from "./_components/AllBudgetsPercentageChart";

export type Spending = {
  date: Date;
  amount: number;
};

interface DashboardInterface {
  spendingRange?: string;
}

export default function Dashboard({ spendingRange }: DashboardInterface) {
  const [spendings, setSpendings] = useState<Spending[]>();
  const [budgets, setBudgets] = useState<BudgetItemInfo[]>();
  const { toast } = useToast();
  const [error, setError] = useState(false);
  const { user } = useUser();
  const searchParams = useSearchParams(); // Hook to get search params
  const spendingRangeParam = searchParams.get("spendingRange") || spendingRange; // Get the "spendingRange" param

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Example data for testing
        const spendingData = [
          {
            date: new Date("2024-10-27"),
            amount: 1000000,
          },
          {
            date: new Date("2024-09-28"),
            amount: 10000000,
          },
          {
            date: new Date("2024-08-29"),
            amount: 100000,
          },
        ];
  
        // const response = await fetch(`http://localhost:8081/api/v1/transaction/get_all_spendings?clerkUserId=${user.user?.id}&range=${spendingRangeParam}`, {
        //   method: "GET",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        // });
  
        // if (!response.ok) {
        //   throw new Error(`HTTP error! status: ${response.status}`);
        // }
  
        // const data = await response.json();
  
        setSpendings(spendingData);
        console.log(spendingData);
        setError(false);
      } catch (error) {
        toast({
          title: `Failed to load data!`,
          description: `${error}`,
          duration: 3000,
          className: "border-none bg-red-500 text-white",
        });
        setError(true);
      }
    };
    fetchData();
  }, [spendingRangeParam]);

  useEffect(() => {
    if (!user) return;
    const fetchData = async () => {
      try {
        // Example data for testing
        const budgetData = [
          {
            id: "1",
            icon: "a",
            name: "Shopping",
            amount: 1000000,
            totalSpent: 500000,
            userId: "1",
            transaction: [
              {
                id: "1",
                description: "a",
                date: new Date("2024/11/26"),
                amount: 500000,
              }
            ]
          },
          {
            id: "2",
            icon: "b",
            name: "Food",
            amount: 2000000,
            totalSpent: 500000,
            userId: "2",
            transaction: [
              {
                id: "2",
                description: "b",
                date: new Date("2024/11/26"),
                amount: 500000,
              }
            ]
          },
          {
            id: "3",
            icon: "c",
            name: "Membership",
            amount: 500000,
            totalSpent: 500000,
            userId: "3",
            transaction: [
              {
                id: "3",
                description: "c",
                date: new Date("2024/11/26"),
                amount: 500000,
              }
            ]
          },
        ];
  
        const response = await fetch(`http://localhost:8081/api/v1/budget/get_all_budgets/${user.id}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
  
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
  
        const data = await response.json();
  
        setBudgets(data.data);
        console.log(budgets);
        setError(false);
      } catch (error) {
        toast({
          title: `Failed to load data!`,
          description: `${error}`,
          duration: 3000,
          className: "border-none bg-red-500 text-white",
        });
        setError(true);
      }
    };
    fetchData();
  }, [user]);

  if (error || spendings === undefined || budgets === undefined) {
    return <div></div>;
  }

  return (
    <div className="relative" style={{ minHeight: "calc(100vh - 96px)" }}>
      <div>
        <h1 className="font-bold text-3xl">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-4 mt-8">
        <AllSpendingsChart spendings={spendings} />
        <div className="flex flex-wrap gap-4 justify-between items-center">
          <AllBudgetsBarChart budgets={budgets} />
          <AllBudgetsPercentageChart budgets={budgets} />
        </div>
      </div>
    </div>
  );
}