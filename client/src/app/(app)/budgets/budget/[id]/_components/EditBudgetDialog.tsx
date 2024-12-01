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
import EmojiPicker from 'emoji-picker-react';
import { LucideEdit } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { EditBudgetFunction } from '../page';
import { useUser } from '@clerk/nextjs';

interface EditBudgetDialogProps {
  id: string;
  prevIcon: string;
  prevName: string;
  prevAmount: number;
  onEditBudget: EditBudgetFunction;
}

export default function EditBudgetDialog({ id, prevIcon, prevName, prevAmount, onEditBudget }: EditBudgetDialogProps) {
  const [icon, setIcon] = useState<string>(prevIcon);
  const [openEmoji, setOpenEmoji] = useState(false);
  const [name, setName] = useState<string>(prevName);
  const [amount, setAmount] = useState<number>(prevAmount);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();
  const { user } = useUser();

  const handleSelectEmoji = (e: { emoji: string }) => {
    setIcon(e.emoji);
    setOpenEmoji(false);
  }

  const closeEmojiPicker = (e: MouseEvent) => {
    if (
      emojiPickerRef.current &&
      !emojiPickerRef.current.contains(e.target as Node)
    ) {
      setOpenEmoji(false);
    }
  };

  const openEmojiPicker = () => {
    setOpenEmoji(true);
  };

  const handleEditBudget = async () => {
    try {
      if (!user) throw new Error("Error: User is not logged in!")
      const request = { 
        id,
        icon,
        name,
        amount
      };
      const response = await fetch(`http://localhost:8081/api/v1/budget/put/${id}?clerkId=${user.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Edit budget error! Status: ${response.status}`);
      }

      const newBudget = await response.json();
      onEditBudget(newBudget);

      toast({
        title: "Edit budget successfully!",
        duration: 3000,
        className: "border-none bg-green-500 text-white",
      });
    } catch (error) {
      toast({
        title: `Edit budget failed!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      });
    }
  };

  useEffect(() => {
    if (openEmoji) {
      document.addEventListener('mousedown', closeEmojiPicker);
    }
    return () => {
      document.removeEventListener('mousedown', closeEmojiPicker);
    };
  }, [openEmoji]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button 
          className="min-w-32 w-full bg-yellow-500 hover:bg-yellow-500 font-bold text-lg h-full"
        >
          <LucideEdit />
          <span>Edit</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit '{prevName}' budget</DialogTitle>
          <DialogDescription>Update the information of this budget</DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon:
            </Label>
            <Button variant="outline" onClick={openEmojiPicker}>
              {icon}
            </Button>
            {openEmoji && (
              <div className="absolute top-10" ref={emojiPickerRef}>
                <EmojiPicker className="z-10" onEmojiClick={handleSelectEmoji} />
              </div>
            )}
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name:
            </Label>
            <Input
              id="name"
              placeholder="Budget Name"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="amount" className="text-right">
              Amount:
            </Label>
            <Input
              type="number"
              id="amount"
              placeholder="Budget amount"
              className="col-span-3"
              onChange={(e) => setAmount(Number(e.target.value))}
              value={amount || ''}
            />
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button
              disabled={!(name && amount && icon) || (name === prevName && amount === prevAmount && icon === prevIcon)}
              type="submit"
              className="hover:bg-yellow-500 bg-yellow-500 border rounded-full"
              onClick={handleEditBudget}
            >
              Edit
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}