"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2 } from "lucide-react"

const statusColors = {
  PENDING: "bg-red-500 text-white",
  INPROGRESS: "bg-yellow-500 text-white",
  COMPLETED: "bg-green-500 text-white",
}

const chartColors = {
  PENDING: "#f87171",
  INPROGRESS: "#facc15",
  COMPLETED: "#4ade80",
}

interface User {
  id: number
  name: string
}

interface Task {
  id: number
  title: string
  status: "PENDING" | "INPROGRESS" | "COMPLETED"
  userId: number
}

export default function Component() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [selectedUser, setSelectedUser] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(true)

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://jsonplaceholder.typicode.com/users')
      const data = await response.json()
      const formattedUsers = data.map((user: any) => ({ id: user.id.toString(), name: user.name }))
      setUsers(formattedUsers)
      if (formattedUsers.length > 0) {
        setSelectedUser(formattedUsers[0].id)
      }
    } catch (error) {
      console.error("Error fetching users:", error)
    }
  }

  const fetchTasks = async (userId: string) => {
    setIsLoading(true)
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/todos?userId=${userId}`)
      const data = await response.json()
      const formattedTasks = data.map((task: any) => ({
        id: task.id,
        title: task.title,
        status: task.completed ? "COMPLETED" : Math.random() > 0.5 ? "INPROGRESS" : "PENDING",
        userId: task.userId,
      }))
      setTasks(formattedTasks)
    } catch (error) {
      console.error("Error fetching tasks:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    if (selectedUser) {
      fetchTasks(selectedUser)
    }
  }, [selectedUser])

  const chartData = [
    { status: "PENDING", count: tasks.filter((task) => task.status === "PENDING").length },
    { status: "INPROGRESS", count: tasks.filter((task) => task.status === "INPROGRESS").length },
    { status: "COMPLETED", count: tasks.filter((task) => task.status === "COMPLETED").length },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Task Management Dashboard</h1>

      <div className="mb-6">
        <Select value={selectedUser} onValueChange={setSelectedUser}>
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select a user" />
          </SelectTrigger>
          <SelectContent>
            {users.map((user) => (
              <SelectItem key={user.id} value={user.id}>
                {user.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Task Overview</CardTitle>
            <CardDescription>Current tasks and their statuses</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
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
            <CardDescription>Tasks assigned to the selected user</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-[300px]">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : (
              <ul className="space-y-4">
                {tasks.map((task) => (
                  <li key={task.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                    <div>
                      <Link href={`/task-manager/task/${task.id}`} className="font-semibold hover:underline">
                        {task.title}
                      </Link>
                      <p className="text-sm text-muted-foreground">Task ID: {task.id}</p>
                    </div>
                    <Badge className={statusColors[task.status]}>
                      {task.status}
                    </Badge>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}