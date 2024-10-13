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

export default function Budget() {
  return (
    <div className="relative"
      style={{minHeight: 'calc(100vh - 64px)'}}>
      <div>Budget</div>
      <Dialog>
      <DialogTrigger asChild>
        <Button
          className="hover:text-blue-500 hover:bg-blue-100 hover:border-blue-500 border border-black rounded-full absolute right-4 bottom-4 font-bold text-xl w-12 h-12 flex items-center justify-center"
          variant="ghost"
        >
          +
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
            <Label htmlFor="name" className="text-right">
              Name:
            </Label>
            <Input
              id="name"
              placeholder="Your budget name (Ex: Shopping)"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              Amount:
            </Label>
            <Input
              id="amount"
              placeholder="Your budget amount (Ex: 10000)"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit" variant='ghost' className='border rounded-full border-black hover:text-blue-500 hover:bg-blue-100 hover:border-blue-500'>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
}