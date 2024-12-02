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
import { useUser } from '@clerk/nextjs';
import { DialogClose } from '@radix-ui/react-dialog';
import { LucideTrash } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface DeleteBudgetDialogProps {
  id: string;
  name: string;
}

export default function DeleteBudgetDialog({ id, name }: DeleteBudgetDialogProps) {
  const { toast } = useToast();
  const router = useRouter();
  const { user } = useUser();

  const handleDeleteBudget = async () => {
    try {
      if (!user) throw new Error("Error: User is not logged in!")
      const request = {
        id,
      }
      const response = await fetch(`http://localhost:8081/api/v1/budget/delete/${id}?clerkId=${user.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Delete budget error! Status: ${response.status}`);
      }

      toast({
        title: "Delete budget successfully!",
        duration: 3000,
        className: "border-none bg-green-500 text-white",
      });
      router.push('/budgets');
    } catch (error) {
      toast({
        title: `Delete budget failed!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="min-w-32 w-full bg-red-500 hover:bg-red-500 font-bold text-lg h-full"
        >
          <LucideTrash />
          <span>Delete</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete '{name}' budget</DialogTitle>
          <DialogDescription>Do you want to delete this budget?  Once this action is finished, it cannot be reverted.</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              type="submit"
              className="hover:bg-red-500 bg-red-500 border rounded-full"
              onClick={handleDeleteBudget}
            >
              Delete
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}