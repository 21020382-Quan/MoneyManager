"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser } from "@clerk/nextjs";
import { useSearchParams } from "next/navigation";
import { BudgetItemInfo } from "../budgets/_components/BudgetItem";
import { rangeOptions } from "@/lib/utils";
import AllSpendingsChart from "./_components/AllSpendingsChart";
import AllBudgetsBarChart from "./_components/AllBudgetsBarChart";
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
  const spendingRangeParam = searchParams.get("spendingRange") || spendingRange || "lastWeek";
  const fetchBudgetData = async () => {
    if (!user) return;
    try {
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
      setBudgets(data);
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
  }
  const fetchSpendingData = async () => {
    try {
      if (!user) throw new Error("User is not logged in!");
      const key = spendingRangeParam as keyof typeof rangeOptions;
      const time = rangeOptions[key].time;
      const response = await fetch(`http://localhost:8081/api/v1/transaction/get_all_transactions_by_time?clerkId=${user.id}&time=${time}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      setSpendings(data);
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
  }

  useEffect(() => {
    fetchSpendingData();
  }, [spendingRangeParam, user]);

  useEffect(() => {
    fetchBudgetData();
  }, [user]);

  if (error || spendings === undefined || budgets === undefined) {
    return <div></div>
  }

  return (
    <div className="relative" style={{ minHeight: "calc(100vh - 96px)" }}>
      <div>
        <h1 className="font-bold text-3xl">Dashboard</h1>
      </div>
      <div className="flex flex-col gap-8 mt-8">
        <AllSpendingsChart spendings={spendings} />
        <div className="grid lg:grid-cols-2 md:grid-cols-1 sm:grid-cols-1 gap-8 justify-between items-center">
          <AllBudgetsBarChart budgets={budgets} />
          <AllBudgetsPercentageChart budgets={budgets} />
        </div>
      </div>
    </div>
  );
}