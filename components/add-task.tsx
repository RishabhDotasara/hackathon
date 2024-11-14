'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
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
import { Textarea } from "@/components/ui/textarea"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from '@/hooks/use-toast'
import { Task, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { Check, ChevronsUpDown, Loader2, X } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { teamAtom } from '@/states/teamAtom'
import { cn } from "@/lib/utils"

export default function TaskDialog({ trigger, triggerFunc, tasks, Users }: { trigger: React.ReactNode, triggerFunc: any, tasks: any, Users:User[] }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<string>('')
  const [assignees, setAssignees] = useState<User[]>([])
  const [users, setUsers] = useState<User[]>(Users)
  const [openCombobox, setOpenCombobox] = useState(false)
  const { toast } = useToast()
  const session = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const teamId = useRecoilValue(teamAtom);

  const handleSubmit = async (event: React.FormEvent) => {
    try {
      setIsCreating(true);
      event.preventDefault();

      if (!title || !dueDate || assignees.length === 0) {
        setIsCreating(false);
        toast({
          title: 'Please fill all required fields',
          variant: 'destructive',
        });
        return;
      }

      const currentDate = new Date();
      const selectedDueDate = new Date(dueDate);
      if (selectedDueDate <= currentDate) {
        setIsCreating(false);
        toast({
          title: 'Invalid due date',
          description: 'The due date must be greater than today\'s date.',
          variant: 'destructive',
        });
        return;
      }

      const body: Omit<Task, "taskId"> & {assigneeIds:string[]} = {
        title,
        description,
        createdById: session.data?.userId as string,
        assigneeIds: assignees.map(user => user.userId),
        deadline: selectedDueDate,
        status: 'PENDING',
        teamId: teamId
      };
    
      const response = await fetch("/api/task/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (response.ok) {
        toast({
          title: "Task Created Successfully!",
        });
        const data = await response.json();
        triggerFunc([...tasks, data.task])
        setOpen(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        setAssignees([]);
      } else {
        throw new Error('Failed to create task');
      }
    } catch (err: any) {
      toast({
        title: 'Error creating task',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }

  useEffect(() => {
    console.log(users)
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-background text-foreground">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details for the new task. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="assignees" className="text-right">
                Assignees
              </Label>
              <Popover open={openCombobox} onOpenChange={setOpenCombobox}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={openCombobox}
                    className="col-span-3 justify-between"
                  >
                    {assignees.length > 0
                      ? `${assignees.length} user${assignees.length > 1 ? 's' : ''} selected`
                      : "Select users"}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Search users..." />
                    <CommandEmpty>No user found.</CommandEmpty>
                    <CommandGroup>
                      {users && users.map((user) => (
                        <CommandItem
                          key={user.userId}
                          onSelect={() => {
                            setAssignees(prev => 
                              prev.some(a => a.userId === user.userId)
                                ? prev.filter(a => a.userId !== user.userId)
                                : [...prev, user]
                            )
                          }}
                        >
                          <Check
                            className={cn(
                              "mr-2 h-4 w-4",
                              assignees.some(a => a.userId === user.userId) ? "opacity-100" : "opacity-0"
                            )}
                          />
                          {user.username} | {user.employeeId}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            {assignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignees.map((user) => (
                  <div key={user.userId} className="flex items-center bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm">
                    {user.username}
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="ml-2 h-4 w-4 p-0"
                      onClick={() => setAssignees(prev => prev.filter(a => a.userId !== user.userId))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button type="submit" disabled={isCreating}>
              Add Task
              {isCreating && <Loader2 className='animate-spin ml-2' />}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}