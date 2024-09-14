'use client'
import { useEffect, useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { CalendarIcon, ClockIcon } from 'lucide-react'
import { useParams, useSearchParams } from 'next/navigation'

export default function TaskDetails() {
  const [status, setStatus] = useState('pending')
  const [comments, setComments] = useState([
    { id: 1, author: 'John Doe', content: 'This task looks challenging.', timestamp: '2023-06-10T14:30:00Z' },
    { id: 2, author: 'Jane Smith', content: 'I think we can finish this by Friday.', timestamp: '2023-06-11T09:15:00Z' },
  ])
  const [newComment, setNewComment] = useState('')

  const [task, setTask] = useState({})
  const searchParams = useParams();


  const handleStatusChange = (value) => {
    setStatus(value)
  }

  const getTask = async ()=>{
    try 
    {
      fetch(`/api/task/get?taskId=${searchParams.id}`)
      .then(async (response)=>{
        if (response.ok)
        {
          const json = await response.json();
          setTask(json)
        }
      })
    }
    catch(err)
    {
      console.log("Error while fetching task.")
    }
  }

  useEffect(()=>{
    console.log(searchParams)
  },[])

  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      const comment = {
        id: comments.length + 1,
        author: 'Current User',
        content: newComment,
        timestamp: new Date().toISOString(),
      }
      setComments([...comments, comment])
      setNewComment('')
    }
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Implement New User Dashboard</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Due: June 15, 2023</span>
            <ClockIcon className="ml-4 mr-2 h-4 w-4" />
            <span>Estimated: 3 days</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">
                Create a new user dashboard that displays key metrics, recent activity, and personalized recommendations. 
                The dashboard should be responsive and optimized for both desktop and mobile views.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <Select onValueChange={handleStatusChange} defaultValue={status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="in-progress">In Progress</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Comments</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {comments.map((comment) => (
              <div key={comment.id} className="flex space-x-4">
                <Avatar>
                  <AvatarFallback>{comment.author[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium">{comment.author}</p>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            />
            <Button onClick={handleCommentSubmit}>Post Comment</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}