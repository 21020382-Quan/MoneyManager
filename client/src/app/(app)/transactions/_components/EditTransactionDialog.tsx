"use client"

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import { LucideEdit } from 'lucide-react';
import { useState } from 'react';
import { EditTransactionFunction } from '../page';

interface EditTransactionDialogProps {
  id: string;
  prevBudget: string;
  prevDescription: string;
  prevAmount: number;
  onEdit: EditTransactionFunction;
}

export default function EditTransactionDialog({ id, prevBudget, prevDescription, prevAmount, onEdit }: EditTransactionDialogProps) {
  const [description, setDescription] = useState<string>(prevDescription);
  const [amount, setAmount] = useState<number>(prevAmount);
  const { toast } = useToast();

  const handleEditTransaction = async () => {
    try {
      const request = { 
        id,
        prevBudget,
        description,
        amount,
      };
      const response = await fetch(`http://localhost:8081/api/v1/transaction/put/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Edit transaction error! Status: ${response.status}`);
      }

      const newTransaction = await response.json();
      onEdit(newTransaction);

      toast({
        title: "Edit transaction successfully!",
        duration: 3000,
        className: "border-none bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: `Edit transaction failed!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="flex flex-row gap-2 hover:bg-secondary p-2 hover:cursor-pointer">
          <LucideEdit />
          <span>Edit</span>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit '{prevDescription}' transaction</DialogTitle>
          <DialogDescription>Update the information of this Transaction</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">
              Budget:
            </Label>
            <Input
              id="budget"
              placeholder="Budget"
              className="col-span-3"
              value={prevBudget}
              disabled
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description:
            </Label>
            <Input
              id="description"
              placeholder="Description"
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount:
            </Label>
            <Input
              type="number"
              id="amount"
              placeholder="Amount"
              className="col-span-3"
              onChange={(e) => setAmount(Number(e.target.value))}
              value={amount || ''}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!(description && amount) || !(amount !== prevAmount || description !== prevDescription)}
              type="submit"
              className="hover:text-yellow-100 hover:bg-yellow-500 bg-yellow-500 border rounded-full"
              onClick={handleEditTransaction}
            >
              Edit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}