import { DataTable } from "@/components/ui/data-table";
import TransactionDialog from "./_components/TransactionDialog";
import { Payment, columns } from "./columns";

export default async function Transactions() {
  const fetchData = async (): Promise<Payment[]> => {
    return [
      {
        id: "728ed52f",
        budget: "Shopping",
        description: "Lorem ipsum",
        date: new Date("2024-10-27"),
        amount: 1000000,
      },
      {
        id: "489e1d42",
        budget: "Memberships",
        description: "Lorem ipsum",
        date: new Date("2024-09-28"),
        amount: 10000000,
      },
      {
        id: "623ejh98e",
        budget: "Food",
        description: "Lorem ipsum",
        date: new Date("2024-08-29"),
        amount: 100000,
      },
      // ...
    ];
  };

  const data = await fetchData();

  return (
    <div className="relative" style={{ minHeight: "calc(100vh - 96px)" }}>
      <div>
        <h1 className="font-bold text-3xl">All transactions</h1>
      </div>
      <div className="mt-8 pb-24">
        <DataTable columns={columns} data={data} />
      </div>
      <TransactionDialog />
    </div>
  );
}