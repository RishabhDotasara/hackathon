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
import { Loader2, X } from 'lucide-react'
import { useRecoilValue } from 'recoil'
import { teamAtom } from '@/states/teamAtom'
import { useRouter } from 'next/navigation'

export default function TaskDialog({trigger, triggerFunc, tasks, all}:{trigger:React.ReactNode, triggerFunc:any, tasks:any, all: User[]}) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState<string>('')
  const [assignees, setAssignees] = useState<string[]>([])
  const [users, setUsers] = useState<User[]>(all)
  const { toast } = useToast()
  const session = useSession();
  const [isCreating, setIsCreating] = useState(false);
  const teamId = useRecoilValue(teamAtom);
  const router = useRouter();

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

      const body: Omit<Task, "taskId" | "assigneeId"> & {assigneeIds:string[]} = {
        title,
        description,
        createdById: session.data?.userId as string,
        assigneeIds: assignees,
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
        console.log(data)
        triggerFunc()
        setOpen(false);
        setTitle('');
        setDescription('');
        setDueDate('');
        setAssignees([]);
      } else {
        throw new Error('Failed to create task');
      }
    } catch (err:any) {
      toast({
        title: 'Error creating task',
        description: err.message,
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  }

  const handleAssigneeChange = (userId: string) => {
    setAssignees(prev => 
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  useEffect(()=>{
    setUsers(all)
  },[all])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* {JSON.stringify(users)} */}
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-[425px] bg-background text-foreground sm:w-full">
        <DialogHeader>
          <DialogTitle>Add New Task</DialogTitle>
          <DialogDescription>
            Fill in the details for the new task. Click add when you're done.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="sm:text-right">
                Title
              </Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="sm:col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="sm:text-right">
                Description
              </Label>
              <Textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="sm:col-span-3"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="dueDate" className="sm:text-right">
                Due Date
              </Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="sm:col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-4 items-center gap-4">
              <Label htmlFor="assignees" className="sm:text-right">
                Assignees
              </Label>
              <div className="sm:col-span-3">
                <Select
                  onValueChange={(value) => {
                    handleAssigneeChange(value)
                    // Prevent the Select from closing
                    const event = new Event('keydown', { bubbles: true })
                    Object.defineProperty(event, 'keyCode', { get: () => 32 }) // Space key
                    document.dispatchEvent(event)
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select assignees" />
                  </SelectTrigger>
                  <SelectContent className="bg-background">
                    {users && users.map((user) => (
                      <SelectItem key={user.userId} value={user.userId} className={assignees.includes(user.userId) ? "bg-secondary" : ""}>
                        {user.username} | {user.employeeId}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            {assignees.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {assignees.map((userId) => {
                  const user = users.find(u => u.userId === userId);
                  return (
                    <div key={userId} className="bg-secondary text-secondary-foreground rounded-full px-3 py-1 text-sm flex items-center">
                      <span className="truncate max-w-[150px]">
                        {user ? `${user.username} | ${user.employeeId}` : userId}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="ml-2 h-4 w-4 p-0"
                        onClick={() => handleAssigneeChange(userId)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  );
                })}
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