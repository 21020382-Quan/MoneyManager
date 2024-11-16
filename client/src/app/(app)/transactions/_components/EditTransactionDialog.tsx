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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';
import { Label } from '@radix-ui/react-label';
import EmojiPicker from 'emoji-picker-react';
import { LucideEdit } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

interface EditTransactionDialogProps {
  id: string;
  prevBudget: string;
  prevDescription: string;
  prevAmount: number;
}

export default function EditTransactionDialog({ id, prevBudget, prevDescription, prevAmount }: EditTransactionDialogProps) {
  const [budget, setBudget] = useState<string>(prevBudget);
  const [description, setDescription] = useState<string>(prevDescription);
  const [amount, setAmount] = useState<number>(prevAmount);
  const { toast } = useToast();

  const handleEditTransaction = async () => {
    try {
      const request = { 
        id,
        budget,
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
        throw new Error(`HTTP error! status: ${response.status}`);
      }

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
        <Button className="bg-yellow-500 font-bold hover:text-yellow-100 hover:bg-yellow-500">
        <LucideEdit />
        <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit transaction</DialogTitle>
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
              value={budget}
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
              disabled={!(budget && description && amount) || (budget === prevBudget && amount === prevAmount && description === prevDescription)}
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