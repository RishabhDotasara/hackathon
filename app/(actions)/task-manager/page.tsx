"use client"

import { useState } from "react"
import Link from "next/link"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

// Mock data for tasks
const initialTasks = [
  { id: 1, title: "Complete project proposal", status: "pending", assignedBy: "John Doe" },
  { id: 2, title: "Review code changes", status: "in-progress", assignedBy: "Jane Smith" },
  { id: 3, title: "Prepare presentation slides", status: "completed", assignedBy: "Mike Johnson" },
  { id: 4, title: "Update documentation", status: "pending", assignedBy: "Sarah Williams" },
  { id: 5, title: "Fix critical bug", status: "in-progress", assignedBy: "Chris Brown" },
]

const statusColors = {
  pending: "bg-red-500 text-white",
  "in-progress": "bg-yellow-500 text-white",
  completed: "bg-green-500 text-white",
}

export default function HomePage() {
  const [tasks] = useState(initialTasks)

  // Prepare data for the chart
  const chartData = [
    { status: "Pending", count: tasks.filter(task => task.status === "pending").length },
    { status: "In Progress", count: tasks.filter(task => task.status === "in-progress").length },
    { status: "Completed", count: tasks.filter(task => task.status === "completed").length },
  ]

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Task Management Dashboard</h1>
      
      <div className="grid gap-6 md:grid-cols-2">
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
                <Bar dataKey="count" fill="#3b82f6" /> {/* Changed to blue */}
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Task List</CardTitle>
            <CardDescription>Tasks assigned to you</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {tasks.map(task => (
                <li key={task.id} className="flex items-center justify-between p-2 bg-secondary rounded-lg">
                  <div>
                    <Link href={`/task/${task.id}`} className="font-semibold hover:underline">
                      {task.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">Assigned by: {task.assignedBy}</p>
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