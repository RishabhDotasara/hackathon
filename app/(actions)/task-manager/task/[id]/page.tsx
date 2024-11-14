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
import { CalendarIcon, ClockIcon, Loader, Loader2, Trash, User } from 'lucide-react';
import { useParams, useRouter } from "next/navigation";
import { Comment, Role, Task } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";
import ToolTip from "@/components/tooltip";
import { Skeleton } from "@/components/ui/skeleton";

export default function TaskDetails() {
  const [status, setStatus] = useState("PENDING");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const { toast } = useToast();
  const session = useSession();
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { id: taskId } = useParams();
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleStatusChange = async (value: string) => {
    try {
      setStatus(value);
      const response = await fetch('/api/task/status', {
        method: "POST",
        body: JSON.stringify({ taskId: task?.taskId, status: value })
      });
      if (response.ok) {
        toast({
          title: "Status Updated"
        });
      }
    } catch (err) {
      toast({
        title: "Error updating Status"
      });
    }
  };

  const getTask = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/task/get?taskId=${taskId}`);
      if (response.ok) {
        const taskData = await response.json();
        setTask(taskData);
        setStatus(taskData.status);
        setComments(taskData.comments);
      } else {
        console.error("Failed to fetch task details.");
      }
    } catch (err) {
      console.log("Error while fetching task:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTask();
  }, []);

  const handleCommentSubmit = async () => {
    try {
      setIsAddingComment(true);
      if (newComment.trim() === "") {
        setIsAddingComment(false);
        toast({
          title: "Invalid Comment!",
          variant: "destructive"
        });
        return;
      }
      const response = await fetch("/api/task/comment/create", {
        method: "POST",
        body: JSON.stringify({
          authorId: session.data?.userId,
          taskId: task?.taskId,
          content: newComment.trim(),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        setComments([...comments, data.comment]);
        toast({
          title: "Comment Added!",
        });
        setNewComment("");
      }
    } catch (err) {
      console.log("Error commenting!");
      toast({
        title: "Error while Commenting!",
      });
    } finally {
      setIsAddingComment(false);
    }
  };

  const handleDeleteTask = async () => {
    try {
      setIsDeleting(true);
      const response = await fetch("/api/task/delete", {
        method: "POST",
        body: JSON.stringify({ taskId: task?.taskId })
      });
      if (response.ok) {
        toast({
          title: "Task Deleted!"
        });
        router.push("/task-manager");
      }
    } catch (err) {
      toast({
        title: "Error While Deleting Task, Please Try Again!",
        variant: "destructive"
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex justify-between">
            {isLoading ? <Skeleton className="h-8 w-3/4" /> : task?.title}
            {!isLoading && session.data?.role !== Role.MEMBER && (
              <span className="p-2 rounded bg-red-200 cursor-pointer" onClick={handleDeleteTask}>
                {!isDeleting ? <Trash className="text-red-500"/> : <Loader2 className="animate-spin"/>}
              </span>
            )}
          </CardTitle>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            {isLoading ? (
              <Skeleton className="h-4 w-full" />
            ) : (
              <>
                <CalendarIcon className="mr-2 h-4 w-4" />
                <span>Due: {new Date(task?.deadline as Date).toLocaleDateString()}</span>
                <ClockIcon className="ml-4 mr-2 h-4 w-4" />
                <span>Estimated: {task ? -new Date().getDate() + new Date(task.deadline).getDate() : 0} day(s)</span>
              </>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">Description</h3>
              {isLoading ? (
                <Skeleton className="h-20 w-full" />
              ) : (
                <p className="text-muted-foreground">{task?.description}</p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Status</h3>
              {isLoading ? (
                <Skeleton className="h-10 w-[180px]" />
              ) : (
                <Select onValueChange={handleStatusChange} defaultValue={status}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="PENDING"><span className="bg-red-500 text-white px-2 py-1 rounded-sm">Pending</span></SelectItem>
                    <SelectItem value="INPROGRESS"><span className="bg-yellow-500 text-white px-2 py-1 rounded-sm">In Progress</span></SelectItem>
                    <SelectItem value="COMPLETED"><span className="bg-green-500 text-white px-2 py-1 rounded-sm">Completed</span></SelectItem>
                  </SelectContent>
                </Select>
              )}
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
            {isLoading ? (
              Array(3).fill(0).map((_, index) => (
                <div key={index} className="flex space-x-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-1/4" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
              ))
            ) : comments.length === 0 ? (
              <h1>No Comments</h1>
            ) : (
              comments.map((comment: Comment) => (
                <div key={comment.commentId} className="flex space-x-4">
                  <Avatar>
                    <AvatarFallback>
                      <User />
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-1">
                    <ToolTip text={(comment.author as any).employeeId}>
                      <p className="text-sm font-medium text-muted-foreground hover:text-foreground">
                        {(comment.author as any).username}
                      </p>
                    </ToolTip>
                    <p className="text-sm text">{comment.content}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(comment.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
        <CardFooter>
          <div className="w-full space-y-2">
            <Textarea
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              disabled={isLoading}
            />
            <Button onClick={handleCommentSubmit} disabled={isAddingComment || isLoading}>
              Post Comment 
              {isAddingComment && <Loader2 className="animate-spin ml-2" />}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}