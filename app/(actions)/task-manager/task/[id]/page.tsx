"use client";
import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CalendarIcon, ClockIcon, Loader, Loader2, User, User2Icon } from "lucide-react";
import { useParams } from "next/navigation";
import { comment } from "postcss";
import { Comment, Task } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

export default function TaskDetails() {
  const [status, setStatus] = useState("pending");
  const [comments, setComments] = useState<any>([]);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const [task, setTask] = useState<Task>(); // Initialize as null
  const { id: taskId } = useParams(); // Get dynamic taskId from the route

  const handleStatusChange = (value: any) => {
    setStatus(value);
  };

  // Fetch the task details from the API
  const getTask = async () => {
    try {
      const response = await fetch(`/api/task/get?taskId=${taskId}`);
      if (response.ok) {
        const taskData = await response.json();
        console.log(taskData);

        setTask(taskData); // Set the fetched task data
        setStatus(taskData.status); // Update status from fetched task
        setComments(taskData.comments); // Set comments from fetched task
      } else {
        console.error("Failed to fetch task details.");
      }
    } catch (err) {
      console.log("Error while fetching task:", err);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  const handleCommentSubmit = async () => {
    try {
      setIsAddingComment(true)
      const response = await fetch("/api/task/comment/create", {
        method: "POST",
        body: JSON.stringify({
          authorId: session.data?.userId,
          taskId: task?.taskId,
          content: newComment.trim(),
        }),
      });
      if (response.ok) {
        const data = await response.json()
        console.log(data)
        setComments([...comments, data.comment])
        toast({
          title: "Comment Added!",
        });
        setNewComment("")
        setIsAddingComment(false)
      }
    } catch (err) {
      setIsAddingComment(false)
      console.log("Error commenting!");
      toast({
        title: "Error while Commenting!",
      });
    }
  };

  if (!task) {
    return (
      <div>
        <Loader className="animate-spin"></Loader>
      </div>
    ); // Show loading state while task is being fetched
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">{task.title}</CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <CalendarIcon className="mr-2 h-4 w-4" />
            <span>Due: {new Date(task.deadline).toLocaleDateString()}</span>
            <ClockIcon className="ml-4 mr-2 h-4 w-4" />
            <span>Estimated: {task.estimatedTime}</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              <p className="text-muted-foreground">{task.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              <Select onValueChange={handleStatusChange} defaultValue={status}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="INPROGRESS">In Progress</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
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
            {!comments && <h1>No Comments</h1>}
            {comments.map((comment: Comment) => (
              <div key={comment.commentId} className="flex space-x-4">
                <Avatar>
                  <AvatarFallback>
                    <User></User>
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm font-medium text-muted-foreground">
                    {comment.author.employeeId}
                  </p>
                  <p className="text-sm text">{comment.content}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(comment.createdAt).toLocaleString()}
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
            <Button onClick={handleCommentSubmit} disabled={isAddingComment}>Post Comment 
              {isAddingComment && <Loader2 className="animate-spin ml-2"></Loader2>}</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
