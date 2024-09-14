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
import { User } from '@prisma/client'

export default function TaskDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [assignee, setAssignee] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const { toast } = useToast()

  // Handle form submission
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()

    // Ensure that all required fields are filled
    if (!title || !dueDate || !assignee) {
      toast({
        title: 'Please fill all required fields',
        variant: 'destructive',
      })
      return
    }

    // Here you would typically handle the form submission, e.g., sending data to an API
    console.log('Form submitted', { title, description, dueDate, assignee })

    // Close the dialog after submission
    setOpen(false)

    // Clear form fields
    setTitle('')
    setDescription('')
    setDueDate('')
    setAssignee('')
  }

  // Fetch users from the API
  const getUsers = async () => {
    try {
      const response = await fetch("/api/users/getAll")
      if (response.ok) {
        const json = await response.json()
        setUsers(json.users)
      }
    } catch (err) {
      console.log("Error")
      toast({
        title: "Error fetching users, please try again.",
        variant: 'destructive',
      })
    }
  }

  // Fetch users on component mount
  useEffect(() => {
    getUsers()
  }, [])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Task</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white dark:bg-neutral-900"> {/* Set background and shadow */}
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
                <SelectContent className="bg-white"> {/* Ensure background color */}
                  {users.map((user) => (
                    <SelectItem key={user.userId} value={user.id}>
                      {user.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">Add Task</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
