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
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';
import { LucideTrash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteTransactionDialogProps {
  id: string;
  description: string;
}

export default function DeleteTransactionDialog({ id, description }: DeleteTransactionDialogProps) {
  const { toast } = useToast();
  const router = useRouter(); // Initialize useRouter

  const handleDeleteTransaction = async () => {
    try {
      const request = {
        id,
      }
      const response = await fetch(`http://localhost:8081/api/v1/transaction/delete/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      toast({
        title: "Delete transaction successfully!",
        duration: 3000,
        className: "border-none bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: `Delete transaction failed!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
      <Button className="bg-red-500 font-bold hover:text-red-100 hover:bg-red-500">
        <LucideTrash />
        <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete '{description}' transaction</DialogTitle>
          <DialogDescription>Do you want to delete this transaction? Once this action is finished, it cannot be reverted.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              className="hover:text-red-100 hover:bg-red-500 bg-red-500 border rounded-full"
              onClick={handleDeleteTransaction}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}