"use client";

import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import BudgetDialog from './_components/BudgetDialog';
import BudgetItem, { BudgetItemProps } from './_components/BudgetItem';
import { useUser } from '@clerk/nextjs';

type AddBudgetFunction = (newBudget: BudgetItemProps) => void;

export default function Budgets() {
  const { toast } = useToast();
  const [budgets, setBudgets] = useState<BudgetItemProps[]>();
  const [error, setError] = useState(false);
  const user = useUser();
  console.log(user.user?.id);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:8081/api/v1/budget/get_all_budgets/", {
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
      } catch (error) {
        console.log(error);
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
  }, []);

  console.log(budgets);
  if (error || budgets === undefined) {
    return <div></div>;
  }
  
  const addBudget: AddBudgetFunction = (newBudget) => {
    setBudgets((prevBudgets = []) => [...prevBudgets, newBudget])
  }

  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">All budgets</h1>
      </div>
      <div className="mt-8 pb-24 flex flex-wrap gap-4 justify-around">
        {budgets.map((budget, index) => (
          <BudgetItem budget={budget} key={index} link={`/budgets/budget/${budget.id}`} />
        ))}
      </div>
      <BudgetDialog onAddBudget={addBudget} />
    </div>
  );
}