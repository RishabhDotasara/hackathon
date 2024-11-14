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
import { Cross, Loader, X } from "lucide-react";
import { Role, Task, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import TaskDialog from "@/components/add-task";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRecoilState, useRecoilValue } from "recoil";
import { teamAtom } from "@/states/teamAtom";

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
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([])
  const [userToFilter, setUserToFilter] = useState("")
  const [users, setUsers] = useState<User[]>()
  const [currentTeamId, setCurrentTeamId] = useRecoilState(teamAtom);

  // interface Task {
  //   id: number
  //   title: string
  //   status: "PENDING" | "INPROGRESS" | "COMPLETED"
  //   userId: number
  // }

  // export default function Component() {
  //   const [tasks, setTasks] = useState<Task[]>([])
  //   const [users, setUsers] = useState<User[]>([])
  //   const [selectedUser, setSelectedUser] = useState<string>("")
  //   const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchTasks = async () => {
    try {
      setIsLoading(true);
      console.log(session);
      const urls = [
        `/api/task/getAll?teamId=${currentTeamId}`,
        // @ts-ignore
        `/api/task/getAll?assigneeId=${session.data?.userId}?teamId=${currentTeamId}`,
      ];
      // @ts-ignore
      const response = await fetch(session.data?.role != Role.MEMBER ? urls[0] : urls[1]); // Ensure this endpoint is correct
      const data = await response.json();
      console.log(data);
      setIsLoading(false);
      setTasks(Array.isArray(data) ? data : []);
      setFilteredTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error, please reload the page.",
      });
      setIsLoading(false);
    }
  };

  const getUsers = async ()=>{
    try 
    {
      const response = await fetch("/api/users/getAll");
      if (response.ok)
      {
        const data = await response.json();
        setUsers(data.users)
      }
    }
    catch(err)
    {
      console.log(err);
      toast({
        title:"Error Fetching Users",
        variant:"destructive"
      })
    }
  }

  const filterTasks = async ()=>{
    try 
    {
        if (userToFilter == "")
        {
          setFilteredTasks(tasks)
          return;
        }
        const filtered = tasks.filter((task:Task)=>task.assigneeId==userToFilter)
        setFilteredTasks(filtered)
    }
    catch(err)
    {
      console.log("Error");
      toast({
        title:"Error , Please Refresh The Page.",
        variant:"destructive"
      })
    }
  }

  useEffect(() => {
    fetchTasks();
    console.log(currentTeamId)
  }, [session, currentTeamId]);

  useEffect(()=>{
    getUsers()
  },[])

  useEffect(()=>{
    // console.log(userToFilter)
    filterTasks()
  },[userToFilter, tasks])

  // Prepare data for the chart (group by task status)
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

  return (
    <>
      {isLoading && (
        <div>
          <Loader className="animate-spin" />
        </div>
      )}
      {!isLoading && (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-6">Your Tasks</h1>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Card for Task Overview with Bar Chart */}
            <Card className="h-fit">
              <CardHeader>
                <CardTitle>Task Overview</CardTitle>
                <CardDescription>
                  Your current tasks and their statuses
                </CardDescription>
                {/* @ts-ignore */}
                {session.data?.role != Role.MEMBER && (
                  <TaskDialog
                    trigger={<Button variant="outline">Add Task</Button>}
                    triggerFunc={setTasks}
                    tasks={tasks}
                  />
                )}
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
                          // @ts-ignore
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
                {/* @ts-ignore */}
                {session.data?.role != Role.MEMBER && <div className="flex gap-2">
                <Select onValueChange={(value)=>{setUserToFilter(value)}} value={userToFilter}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select a User" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Assigned To</SelectLabel>
                      {users && users.map((user:User)=>{
                        return (
                          <SelectItem value={user.userId}>{user.username} | {user.employeeId.toUpperCase()}</SelectItem>
                        )
                      })}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                {userToFilter && <Button variant={"outline"} onClick={()=>{setUserToFilter("")}}><X className="h-5 w-5"/></Button>}
                </div>}
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[300px] w-full rounded-md border overflow-y-auto p-2">
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
                            {/* @ts-ignore */}
                            <span className="mr-8">Assigned to: {task.assignee.username}</span>
                            <span>
                              Time Left:{" "}
                              {-new Date().getDate() +
                                new Date(task?.deadline).getDate()}{" "}
                              day(s)
                            </span>
                          </p>
                        </div>
                        <Badge className={statusColors[task.status]}>
                          {task.status}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </>
  );
}
