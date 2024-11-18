"use client"

import { ColumnDef } from "@tanstack/react-table"
import { LucideEdit, LucideTrash, MoreHorizontal } from "lucide-react"
 
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { toLocalMoney } from "@/lib/utils"
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import DeleteTransactionDialog from "./_components/DeleteTransactionDialog"
import EditTransactionDialog from "./_components/EditTransactionDialog"
 
// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Transaction = {
  id: string
  budget: string
  description: string
  date: Date
  amount: number
}

interface ColumnProps {
  editTransaction: (transaction: Transaction) => void;
  deleteTransaction: (transaction: Transaction) => void;
}
 
export const columns = ({ editTransaction, deleteTransaction }: ColumnProps): ColumnDef<Transaction>[] => [
  {
    accessorKey: "budget",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Budget" />
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Description" />
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("date"));
      const formatted = date.toLocaleDateString("vi-VN") + " " + date.toLocaleTimeString("vi-VN"); 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = toLocalMoney(amount);
 
      return <div className="font-medium">{formatted}</div>
    },
  },
  {
    header: "Actions",
    id: "actions",
    cell: ({ row }) => {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <div className="flex flex-col gap-2">
              <EditTransactionDialog id={row.original.id} prevBudget={row.original.budget} prevDescription={row.original.description} prevAmount={row.original.amount} onEdit={editTransaction} />
              <DeleteTransactionDialog id={row.original.id} description={row.original.description} onDelete={deleteTransaction} />
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]