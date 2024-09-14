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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from '@/hooks/use-toast'
import { Task, User } from '@prisma/client'
import { useSession } from 'next-auth/react'
import { Loader2 } from 'lucide-react'

export default function TaskDialog({trigger, triggerFunc}:{trigger:React.ReactNode, triggerFunc:any}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<string>('')
  const [assignee, setAssignee] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()
  const session = useSession();
  const [isCreating, setIsCreating] = useState(false);

  // Handle form submission
  // Handle form submission
const handleSubmit = async (event: React.FormEvent) => {
  try {
    setIsCreating(true);
    event.preventDefault();

    // Ensure that all required fields are filled
    if (!title || !dueDate || !assignee) {
      setIsCreating(false);
      toast({
        title: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    // Check if the due date is greater than today's date
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

    // Prepare the task data
    const body: Omit<Task, "taskId"> = {
      title,
      description,
      createdById: session.data?.userId ,
      assigneeId: assignee,
      deadline: selectedDueDate,
      status: 'PENDING', // Assuming you have a status field
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
      triggerFunc([])
      setOpen(false);
      setTitle('');
      setDescription('');
      setDueDate('');
      setAssignee('');
    } else {
      throw new Error('Failed to create task');
    }
  } catch (err) {
    toast({
      title: 'Error creating task',
      description: err.message,
      variant: 'destructive',
    });
  } finally {
    setIsCreating(false);
  }
}


  // Fetch users from the API
  const getUsers = async () => {
    try {
      const response = await fetch("/api/users/getAll");
      if (response.ok) {
        const json = await response.json();
        setUsers(json.users);
      } else {
        throw new Error('Failed to fetch users');
      }
    } catch (err) {
      toast({
        title: "Error fetching users, please try again.",
        description: err.message,
        variant: 'destructive',
      });
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-900">
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
              <Label htmlFor="assignee" className="text-right">
                Assignee
              </Label>
              <Select
                onValueChange={(value) => setAssignee(value)}
                value={assignee}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select an assignee" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {users.map((user) => (
                    <SelectItem key={user.userId} value={user.userId}>
                      {user.employeeId}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
