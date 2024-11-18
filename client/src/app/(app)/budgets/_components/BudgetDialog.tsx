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
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { DialogClose } from '@radix-ui/react-dialog';
import EmojiPicker from 'emoji-picker-react';
import { useEffect, useRef, useState } from 'react';
import { BudgetItemInfo } from './BudgetItem';
import { AddBudgetFunction } from '../page';

interface BudgetDialogProps {
  onAddBudget: AddBudgetFunction;
}

export default function BudgetDialog({onAddBudget}: BudgetDialogProps) {
  const [icon, setIcon] = useState<string>('');
  const [openEmoji, setOpenEmoji] = useState(false);
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const emojiPickerRef = useRef<HTMLDivElement | null>(null);
  const { toast } = useToast();

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

  const handleCreateBudget = async () => {
    // TODO: send data to server
    const data = {
      icon,
      name,
      amount
    }
    
    try {
      const response = await fetch("http://localhost:8081/api/v1/budget", {  
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newBudget = await response.json();

      onAddBudget(newBudget);

      setOpenEmoji(false);
      setIcon('');
      setName('');
      setAmount(0);
      toast({
        title: "Create budget successfully!",
        duration: 3000,
        className: "border-none bg-green-500 text-white",
      })
    } catch (error) {
      toast({
        title: `Create budget failed!`,
        description: `${error}`,
        duration: 3000,
        className: "border-none bg-red-500 text-white",
      })
    }
  }

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
        <Button className="bg-blue-500 hover:bg-blue-300 border rounded-xl absolute right-4 bottom-4 font-bold text-xl w-auto h-auto flex items-center justify-center">
          + Add new budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a budget</DialogTitle>
          <DialogDescription>Create a new budget to manage your expenses</DialogDescription>
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
              disabled={!(name && amount && icon)}
              type="submit"
              className="bg-blue-500 hover:bg-blue-300 border rounded-full"
              onClick={handleCreateBudget}
            >
              Create budget
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}