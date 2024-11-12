"use client"

import { DataTable } from "@/components/ui/data-table";
import BudgetItem, { BudgetItemProps } from "../../_components/BudgetItem";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { LucidePen, LucidePenBox, LucideTrash } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

interface ParamsProps {
  params: {
    id: string;
  }
}

export default function Budget({ params } : ParamsProps) {
  const { toast } = useToast();
  const [budget, setBudget] = useState<BudgetItemProps>();
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

  console.log(budget);

  if (error || budget === undefined) {
    return <div></div>;
  }

  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">Budget {budget.name}</h1>
      </div>
      <div className="mt-8 flex flex-row gap-4">
        <BudgetItem className="min-w-[300px] max-w-[450px] w-full" budget={budget}/>
        <div className="flex flex-col gap-4 w-full">
          <Button className="min-w-32 max-w-60 w-full bg-yellow-500 font-bold text-lg h-full hover:text-yellow-100 hover:bg-yellow-500">
            <LucidePenBox />
            <span className="ml-2">Edit</span>
          </Button>
          <Button className="min-w-32 max-w-60 w-full bg-red-500 font-bold text-lg h-full hover:text-red-100 hover:bg-red-500">
            <LucideTrash />
            <span className="ml-2">Delete</span>
          </Button>
        </div>
      </div>
      <div className="mt-8">
        <span className="font-bold">Transactions</span>
        <DataTable columns={columns} data={budget.transactionsList || []} />
      </div>
    </div>
  );
}