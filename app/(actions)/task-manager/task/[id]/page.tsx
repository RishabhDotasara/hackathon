"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Mock data for a single task
const mockTask = {
  id: 1,
  title: "Complete project proposal",
  description: "Draft a comprehensive project proposal including timeline, budget, and resource allocation.",
  status: "pending",
  assignedBy: "John Doe",
  comments: [
    { id: 1, author: "John Doe", text: "How's the progress on this?", timestamp: "2023-06-10T10:00:00Z" },
    { id: 2, author: "You", text: "I'm working on it. Should be done by tomorrow.", timestamp: "2023-06-10T11:30:00Z" },
  ]
}

const statusColors = {
  pending: "bg-red-500 text-white",
  "in-progress": "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
}

export default function TaskDetail() {
  const router = useRouter()
        
  const [task, setTask] = useState(mockTask)
  const [newComment, setNewComment] = useState("")

  const handleStatusChange = (newStatus) => {
    setTask(prevTask => ({ ...prevTask, status: newStatus }))
  }

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const newCommentObj = {
        id: task.comments.length + 1,
        author: "You",
        text: newComment,
        timestamp: new Date().toISOString()
      }
      setTask(prevTask => ({
        ...prevTask,
        comments: [...prevTask.comments, newCommentObj]
      }))
      setNewComment("")
    }
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
          <CardDescription>Assigned by: {task.assignedBy}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p>{task.description}</p>
          
          <div className="flex items-center space-x-2">
            <span>Status:</span>
            <Select value={task.status} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">
                  <Badge className={statusColors.pending}>Pending</Badge>
                </SelectItem>
                <SelectItem value="in-progress">
                  <Badge className={statusColors["in-progress"]}>In Progress</Badge>
                </SelectItem>
                <SelectItem value="completed">
                  <Badge className={statusColors.completed}>Completed</Badge>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Comments:</h3>
            <ul className="space-y-2">
              {task.comments.map(comment => (
                <li key={comment.id} className="bg-secondary p-2 rounded">
                  <p className="font-semibold">{comment.author}</p>
                  <p>{comment.text}</p>
                  <p className="text-xs text-muted-foreground">{new Date(comment.timestamp).toLocaleString()}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="mb-2"
            />
            <Button onClick={handleCommentSubmit}>Add Comment</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}