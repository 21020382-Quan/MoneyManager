// "use client"

// import { ColumnDef } from "@tanstack/react-table"
// import { MoreHorizontal } from "lucide-react"
 
// import { Button } from "@/components/ui/button"
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
// import { toLocalMoney } from "@/lib/utils"
// import { Transaction } from "@/app/(app)/transactions/columns"
// import EditTransactionDialog from "@/app/(app)/transactions/_components/EditTransactionDialog"
// import DeleteTransactionDialog from "@/app/(app)/transactions/_components/DeleteTransactionDialog"

// interface ColumnProps {
//   editTransaction: (transaction: Transaction) => void;
//   deleteTransaction: (id: string) => void;
// }
 
// export const columns = ({ editTransaction, deleteTransaction }: ColumnProps): ColumnDef<Transaction>[] => [
//   {
//     accessorKey: "budget",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Budget" />
//     ),
//   },
//   {
//     accessorKey: "description",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Description" />
//     ),
//   },
//   {
//     accessorKey: "date",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Date" />
//     ),
//     cell: ({ row }) => {
//       const date = new Date(row.getValue("date"));
//       const formatted = date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN"); 
//       return <div className="font-medium">{formatted}</div>
//     },
//   },
//   {
//     accessorKey: "amount",
//     header: ({ column }) => (
//       <DataTableColumnHeader column={column} title="Amount" />
//     ),
//     cell: ({ row }) => {
//       const amount = parseFloat(row.getValue("amount"))
//       const formatted = toLocalMoney(amount);
 
//       return <div className="font-medium">{formatted}</div>
//     },
//   },
//   {
//     header: "Actions",
//     id: "actions",
//     cell: ({ row }) => {
//       return (
//         <DropdownMenu>
//           <DropdownMenuTrigger asChild>
//             <Button variant="ghost" className="h-8 w-8 p-0">
//               <span className="sr-only">Open menu</span>
//               <MoreHorizontal className="h-4 w-4" />
//             </Button>
//           </DropdownMenuTrigger>
//           <DropdownMenuContent align="end">
//             <DropdownMenuLabel>Actions</DropdownMenuLabel>
//             <div className="flex flex-col gap-2">
//               <EditTransactionDialog id={row.original.id} prevBudget={row.original.budget} prevDescription={row.original.description} prevAmount={row.original.amount} onEdit={editTransaction} />
//               <DeleteTransactionDialog id={row.original.id} description={row.original.description} onDelete={deleteTransaction} />
//             </div>
//           </DropdownMenuContent>
//         </DropdownMenu>
//       )
//     },
//   },
// ]