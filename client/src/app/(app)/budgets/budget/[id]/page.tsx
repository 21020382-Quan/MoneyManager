"use client"

import { DataTable } from "@/components/ui/data-table";
import BudgetItem, { BudgetItemInfo } from "../../_components/BudgetItem";
import { columns } from "./columns";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";
import DeleteBudgetDialog from "./_components/DeleteBudgetDialog";
import EditBudgetDialog from "./_components/EditBudgetDialog";

interface ParamsProps {
  params: {
    id: string;
  }
}

export default function Budget({ params } : ParamsProps) {
  const { toast } = useToast();
  const [budget, setBudget] = useState<BudgetItemInfo>();
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:8081/api/v1/budget/get/${params.id}/`, {
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

    fetchData();
  }, []);

  if (error || budget === undefined) {
    return <div></div>;
  }

  const editBudget = (newBudget: BudgetItemInfo) => {
    setBudget(newBudget);
  }

  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">Budget {budget.name}</h1>
      </div>
      <div className="mt-8 flex flex-row gap-4">
        <BudgetItem className="min-w-[300px] max-w-[450px] w-full" budget={budget}/>
        <div className="flex flex-col gap-4 w-full">
          <EditBudgetDialog id={budget.id} prevIcon={budget.icon} prevName={budget.name} prevAmount={budget.amount} onEditBudget={editBudget}/>
          <DeleteBudgetDialog id={budget.id} name={budget.name}/>
        </div>
      </div>
      <div className="mt-8">
        <span className="font-bold">Transactions</span>
        <DataTable columns={columns} data={budget.transactionsList || []} />
      </div>
    </div>
  );
}