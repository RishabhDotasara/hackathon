"use client"
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { Comment, Task } from "@prisma/client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Skeleton } from "@/components/ui/skeleton";
import { TaskHeader } from "@/components/task-page/TaskHeader";
import { TaskDueDate } from "@/components/task-page/TaskDueDate";
import { TaskStatus } from "@/components/task-page/TaskStatus";
import { CommentList } from "@/components/task-page/CommentList";
import { CommentForm } from "@/components/task-page/CommentForm";

export default function TaskDetails() {
  const [status, setStatus] = useState("PENDING");
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isAddingComment, setIsAddingComment] = useState(false);
  const [task, setTask] = useState<Task | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const { toast } = useToast();
  const session = useSession();
  const { id: taskId } = useParams();
  const router = useRouter();

  const handleStatusChange = async (value: string) => {
    try {
      setStatus(value);
      const response = await fetch('/api/task/status', {
        method: "POST",
        body: JSON.stringify({ taskId: task?.taskId, status: value })
      });
      if (response.ok) {
        toast({ title: "Status Updated" });
      }
    } catch (err) {
      toast({ title: "Error updating Status" });
    }
  };

  const handleCommentSubmit = async () => {
    try {
      setIsAddingComment(true);
      if (newComment.trim() === "") {
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
        toast({ title: "Comment Added!" });
        setNewComment("");
      }
    } catch (err) {
      toast({ title: "Error while Commenting!" });
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
        toast({ title: "Task Deleted!" });
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

  const getTask = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/task/get?taskId=${taskId}`);
      if (response.ok) {
        const taskData = await response.json();
        setTask(taskData);
        setStatus(taskData.status);
        setComments(taskData.comments);
      }
    } catch (err) {
      toast({
        title: "Error fetching task details",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getTask();
  }, [taskId]);

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card>
        <CardHeader>
          <TaskHeader
            title={task?.title || ""}
            isLoading={isLoading}
            userRole={session.data?.role}
            isDeleting={isDeleting}
            onDelete={handleDeleteTask}
          />
          <TaskDueDate
            deadline={task?.deadline as Date}
            isLoading={isLoading}
          />
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
              <TaskStatus
                status={status}
                isLoading={isLoading}
                onStatusChange={handleStatusChange}
              />
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
            <CommentList
              comments={comments}
              isLoading={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter>
          <CommentForm
            value={newComment}
            onChange={setNewComment}
            onSubmit={handleCommentSubmit}
            isLoading={isLoading}
            isSubmitting={isAddingComment}
          />
        </CardFooter>
      </Card>
    </div>
  );
}