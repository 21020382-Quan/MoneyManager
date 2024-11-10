import { DataTable } from "@/components/ui/data-table";
import BudgetItem, { BudgetItemProps } from "../_components/BudgetItem";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import { LucidePen, LucidePenBox, LucideTrash } from "lucide-react";

interface ParamsProps {
  params: {
    id: string;
  }
}

export default async function Budget({ params } : ParamsProps) {
  const fetchData = async (): Promise<BudgetItemProps> => {
    return {
      emoji: '🛍️',
      name: 'Shopping',
      transactions: 3,
      amount: 1000000,
      totalSpent: 400000,
      transactionsList: [
        {
          id: "728ed52f",
          description: "Lorem ipsum",
          date: new Date("2024-10-27"),
          amount: 1000000,
        },
        {
          id: "489e1d42",
          description: "Lorem ipsum",
          date: new Date("2024-09-28"),
          amount: 10000000,
        },
        {
          id: "623ejh98e",
          description: "Lorem ipsum",
          date: new Date("2024-08-29"),
          amount: 100000,
        },
      ]
    }
  };

  const budget = await fetchData();
  return (
    <div className="relative" style={{ minHeight: 'calc(100vh - 96px)' }}>
      <div>
        <h1 className="font-bold text-3xl">Budget {budget.name}</h1>
      </div>
      <div className="mt-8 flex flex-row gap-4">
        <BudgetItem className="min-w-[300px] max-w-[400px] w-full" budget={budget}/>
        <div className="flex flex-col gap-4 w-full">
          <Button className="w-full bg-yellow-500 font-bold text-lg h-full hover:text-yellow-100 hover:bg-yellow-500">
            <LucidePenBox />
            <span className="ml-2">Edit</span>
          </Button>
          <Button className="w-full bg-red-500 font-bold text-lg h-full hover:text-red-100 hover:bg-red-500">
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