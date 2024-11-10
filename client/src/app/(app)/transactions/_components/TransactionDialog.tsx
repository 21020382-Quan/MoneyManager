'use client'

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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';
import { useState } from 'react';

export default function TransactionDialog() {
  const [budget, setBudget] = useState<string>();
  const [description, setDescription] = useState<string>();
  const [amount, setAmount] = useState<number | undefined>();
  const {toast} = useToast();
  console.log(budget);

  const budgets = [
    "Shopping",
    "Memberships",
    "Food",
  ]

  const handleCreateTransaction = () => {
    // TODO: send data to server
    const result = true;
    setBudget('');
    setDescription('');
    setAmount(0);
    if (result) {
      toast({
        title: "Add expense successfully!",
        duration: 3000,
        className: "border-none bg-green-500 text-white",
      })
    } else {
      toast({
        title: "Add expense failed!",
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      })
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="bg-blue-500 hover:bg-blue-300 border rounded-xl absolute right-4 bottom-4 font-bold text-xl w-auto h-auto flex items-center justify-center">
          + Add a transaction
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a transaction</DialogTitle>
          <DialogDescription>Create a transaction and put it in the corresponding budget</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="budget" className="text-right">
              Budget:
            </Label>
            <Select value={budget} onValueChange={setBudget}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select a budget" />
              </SelectTrigger>
              <SelectContent>
                {budgets.map((budget, index) => (
                  <SelectItem value={budget} key={index}>{budget}</SelectItem>
                ))}
              </SelectContent>
            </Select>
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
              value={amount}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!(budget && description && amount)}
              type="submit"
              className="bg-blue-500 hover:bg-blue-300 border rounded-full"
              onClick={handleCreateTransaction}
            >
              Create transaction
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}