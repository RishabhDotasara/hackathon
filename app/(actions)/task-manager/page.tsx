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
import { Cross, Loader, X } from 'lucide-react';
import { Role, Task, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import TaskDialog from "@/components/add-task";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamAtom } from "@/states/teamAtom";
import { Skeleton } from "@/components/ui/skeleton";

const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
};

const chartColors = {
  PENDING: "#f87171",
  INPROGRESS: "#facc15",
  COMPLETED: "#4ade80",
};

export default function HomePage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const session = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [isTasksLoading, setIsTasksLoading] = useState(true);
  const { toast } = useToast();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [userToFilter, setUserToFilter] = useState("")
  const [users, setUsers] = useState<User[]>()
  const [currentTeamId, setCurrentTeamId] = useRecoilState(teamAtom);

  const fetchTasks = async () => {
    try {
      setIsTasksLoading(true);
      console.log(session);
      const urls = [
        `/api/task/getAll?teamId=${currentTeamId}`,
        `/api/task/getAll?assigneeId=${session.data?.userId}&teamId=${currentTeamId}`,
      ];
      const response = await fetch(session.data?.role != Role.MEMBER ? urls[0] : urls[1]);
      const data = await response.json();
      console.log(data);
      setTasks(Array.isArray(data) ? data : []);
      setFilteredTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error, please reload the page.",
      });
    } finally {
      setIsTasksLoading(false);
    }
  };

  const getUsers = async () => {
    if (session.data?.role == Role.MEMBER) return;
    try {
      const response = await fetch("/api/users/getAll");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users)
      }
    } catch (err) {
      console.log(err);
      toast({
        title: "Error Fetching Users",
        variant: "destructive"
      })
    }
  }

  const filterTasks = async () => {
    try {
      if (userToFilter == "") {
        setFilteredTasks(tasks)
        return;
      }
      const filtered = tasks.filter((task: Task) => task.assigneeId == userToFilter)
      setFilteredTasks(filtered)
    } catch (err) {
      console.log("Error");
      toast({
        title: "Error , Please Refresh The Page.",
        variant: "destructive"
      })
    }
  }

  useEffect(() => {
    if (session.status == "authenticated") {
      fetchTasks();
      getUsers();
    }
    setIsLoading(false);
  }, [session.status, currentTeamId]);

  useEffect(() => {
    filterTasks()
  }, [userToFilter, tasks])

  const chartData = useMemo(() => {
    return [
      {
        status: "PENDING",
        count: filteredTasks.filter((task: any) => task.status === "PENDING").length,
      },
      {
        status: "INPROGRESS",
        count: filteredTasks.filter((task: any) => task.status === "INPROGRESS").length,
      },
      {
        status: "COMPLETED",
        count: filteredTasks.filter((task: any) => task.status === "COMPLETED").length,
      },
    ];
  }, [filteredTasks]);

  // if (isLoading) {
  //   return (
  //     <div className="flex justify-center h-screen">
  //       <Loader className="animate-spin h-8 w-8" />
  //     </div>
  //   )
  // }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>
              Your current tasks and their statuses
            </CardDescription>
            {session.data?.role != Role.MEMBER && session.status == "authenticated" && (
              <TaskDialog
                trigger={<Button variant="outline">Add Task</Button>}
                triggerFunc={fetchTasks}
                tasks={tasks}
                all={users}
              />
            )}
          </CardHeader>
          <CardContent>
            {isTasksLoading ? (
              <Skeleton className="w-full h-[300px]" />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={chartData}>
                  <XAxis dataKey="status" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count">
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={chartColors[entry.status as keyof typeof chartColors]}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>Tasks To Work On</CardDescription>
            {session.data?.role != Role.MEMBER && session.status == "authenticated" && (
              <div className="flex gap-2">
                <Select onValueChange={(value) => { setUserToFilter(value) }} value={userToFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Assigned To</SelectLabel>
                      {users && users.map((user: User) => (
                        <SelectItem key={user.userId} value={user.userId}>
                          {user.username} | {user.employeeId.toUpperCase()}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {userToFilter && <Button variant={"outline"} onClick={() => { setUserToFilter("") }}><X className="h-5 w-5" /></Button>}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] w-full rounded-md border overflow-y-auto p-2">
              {isTasksLoading ? (
                <div className="space-y-2">
                  {[...Array(5)].map((_, index) => (
                    <Skeleton key={index} className="w-full h-16" />
                  ))}
                </div>
              ) : (
                <ul className="space-y-4 overflow-auto">
                  {filteredTasks.length == 0 && (<span className="text-gray-300 text-center">No Task</span>)}
                  {filteredTasks.map((task: Task) => (
                    <li
                      key={task.taskId}
                      className="flex items-center justify-between p-2 bg-accent rounded-lg"
                    >
                      <div>
                        <Link
                          href={`/task-manager/task/${task.taskId}`}
                          className="font-semibold hover:underline"
                        >
                          {task.title}
                        </Link>
                        <p className="text-sm text-muted-foreground">
                          <span className="mr-8">Assigned to: {(task as any).assignee.username}</span>
                          <span>
                            Time Left:{" "}
                            {-new Date().getDate() +
                              new Date(task?.deadline).getDate()}{" "}
                            day(s)
                          </span>
                        </p>
                      </div>
                      <Badge className={statusColors[task.status as keyof typeof statusColors]}>
                        {task.status}
                      </Badge>
                    </li>
                  ))}
                </ul>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}