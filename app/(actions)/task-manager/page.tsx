"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { Loader } from "lucide-react";
import { Task } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import TaskDialog from "@/components/add-task";
import { Button } from "@/components/ui/button";

// Define status colors for different task states
const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
};

// Define corresponding colors for the chart bars
const chartColors = {
  PENDING: "#f87171", // Red
  INPROGRESS: "#facc15", // Yellow
  COMPLETED: "#4ade80", // Green
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const session = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [newTask, setNewTask] = useState(false)

  // Fetch tasks from the backend API
  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      console.log(session);
      const urls = [
        "/api/task/getAll",
        `/api/task/getAll?assigneeId=${session.data?.userId}`,
      ];
      const response = await fetch(
        session.data?.isAdmin ? urls[0] : urls[1]
      ); // Ensure this endpoint is correct
      const data = await response.json();
      console.log(data);
      setIsLoading(false);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error, please reload the page.",
      });
      setIsLoading(false);
    }
  };

  // Run the fetchTasks function on component mount
  useEffect(() => {
    fetchTasks();
  }, [session]);  



  // Prepare data for the chart (group by task status)
  const chartData = useMemo(() => {
    return [
      {
        status: "PENDING",
        count: tasks.filter((task: any) => task.status === "PENDING").length,
      },
      {
        status: "INPROGRESS",
        count: tasks.filter((task: any) => task.status === "INPROGRESS").length,
      },
      {
        status: "COMPLETED",
        count: tasks.filter((task: any) => task.status === "COMPLETED").length,
      },
    ];
  }, [tasks]);

  return (
    <>
      {isLoading && (
        <div>
          <Loader className="animate-spin" />
        </div>
      )}
      {!isLoading && (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Task Management Dashboard</h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card for Task Overview with Bar Chart */}
            <Card>
              <CardHeader>
                <CardTitle>Task Overview</CardTitle>
                <CardDescription>
                  Your current tasks and their statuses
                </CardDescription>
                {session.data?.isAdmin && <TaskDialog trigger={<Button variant="outline">Add Task</Button>} triggerFunc={setTasks}/>}
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={chartData}>
                    <XAxis dataKey="status" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count">
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={chartColors[entry.status]}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Card for Task List */}
            <Card>
              <CardHeader>
                <CardTitle>Task List</CardTitle>
                <CardDescription>Tasks To Work On</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {tasks.map((task: Task) => (
                    <li
                      key={task.taskId}
                      className="flex items-center justify-between p-2 bg-secondary rounded-lg"
                    >
                      <div>
                        <Link
                          href={`/task-manager/task/${task.taskId}`}
                          className="font-semibold hover:underline"
                        >
                          {task.title}
                        </Link>
                        <p className="text-sm text-muted-foreground flex gap-4">
                          <span>Assigned by: {task.user?.employeeId}</span>
                          <span>Time Left: {-new Date().getDate() + new Date(task?.deadline).getDate()} day(s)</span>
                        </p>
                        
                      </div>
                      <Badge className={statusColors[task.status]}>
                        {task.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
