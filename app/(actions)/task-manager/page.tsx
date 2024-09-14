"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useSession } from "next-auth/react"

// Define status colors for different task states
const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
}

// Define corresponding colors for the chart bars
const chartColors = {
  PENDING: "#f87171",      // Red
  INPROGRESS: "#facc15",   // Yellow
  COMPLETED: "#4ade80",    // Green
}

export default function HomePage() {
  const [tasks, setTasks] = useState([])
  const session = useSession();

  // Fetch tasks from the backend API
  const fetchTasks = async () => {
    try {
      console.log(session)
      const response = await fetch(`/api/task/getAll?assigneeId=${session.data?.userId}`) // Ensure this endpoint is correct
      const data = await response.json()
      setTasks(data)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    }
  }

  // Run the fetchTasks function on component mount
  useEffect(() => {
   

      fetchTasks()
    
  }, [session])

  // Prepare data for the chart (group by task status)
  const chartData = [
    { status: "PENDING", count: tasks.filter((task:any) => task.status === "PENDING").length },
    { status: "INPROGRESS", count: tasks.filter((task:any) => task.status === "INPROGRESS").length },
    { status: "COMPLETED", count: tasks.filter((task:any) => task.status === "COMPLETED").length },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Task Management Dashboard</h1>

      <div className="grid gap-6 md:grid-cols-2">
        
        {/* Card for Task Overview with Bar Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>Your current tasks and their statuses</CardDescription>
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
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {tasks.map((task:any) => (
                <li key={task.taskId} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div>
                    <Link href={`/task-manager/task/${task.taskId}`} className="font-semibold hover:underline">
                      {task.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">Assigned by: {task.user?.employeeId}</p>
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
  )
}
