'use client'

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import EmojiPicker from 'emoji-picker-react';
import { useState } from "react";

export default function Budget() {
  const [emoji, setEmoji] = useState();
  const [openEmoji, setOpenEmoji] = useState(false);
  const [name, setName] = useState<string>();
  const [amount, setAmount] = useState<string>();

  const handleSelectEmoji = (e: any) => {
    setEmoji(e.emoji);
    setOpenEmoji(false);
  }

  return (
    <div className="relative"
      style={{minHeight: 'calc(100vh - 96px)'}}>
      <div>
        <h1 className='font-bold text-3xl'>All budgets</h1>
      </div>
      <Dialog>
      <DialogTrigger asChild>
        <Button
          className="bg-blue-500 hover:bg-blue-300 border rounded-xl absolute right-4 bottom-4 font-bold text-xl w-auto h-auto flex items-center justify-center"
        >
          + Add new budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a budget</DialogTitle>
          <DialogDescription>
            Create a new budget to work with
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              Icon:
            </Label>
            <Button variant="outline" onClick={() => setOpenEmoji(true)}>{emoji}</Button>
            <div className="col-span-3 absolute top-10">
              <EmojiPicker className='z-10' open={openEmoji} onEmojiClick={handleSelectEmoji} />
            </div>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name:
            </Label>
            <Input
              id="name"
              placeholder="Your budget name"
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Amount:
            </Label>
            <Input
              type="number"
              id="amount"
              placeholder="Your budget amount"
              className="col-span-3"
              onChange={(e) => setAmount(e.target.value)}
              value={amount}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            disabled={!(name && amount && emoji)}
            type="submit"   
            className='bg-blue-500 hover:bg-blue-300 border rounded-full'>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
      </Dialog>
    </div>
  );
}