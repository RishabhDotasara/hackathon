"use client"

import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Gift, ChevronDown } from 'lucide-react'

interface Task {
  id: number
  title: string
  completed: boolean
}

interface User {
  id: number
  name: string
  tasks: Task[]
}

export default function Component() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Alice",
      tasks: [
        { id: 1, title: "Complete profile", completed: true },
        { id: 2, title: "Post first message", completed: true },
        { id: 3, title: "Add a profile picture", completed: false },
        { id: 4, title: "Connect with 5 users", completed: false },
        { id: 5, title: "Create a group chat", completed: true },
      ]
    },
    {
      id: 2,
      name: "Bob",
      tasks: [
        { id: 1, title: "Complete profile", completed: true },
        { id: 2, title: "Post first message", completed: true },
        { id: 3, title: "Add a profile picture", completed: true },
        { id: 4, title: "Connect with 5 users", completed: true },
        { id: 5, title: "Create a group chat", completed: false },
      ]
    },
    {
      id: 3,
      name: "Charlie",
      tasks: [
        { id: 1, title: "Complete profile", completed: true },
        { id: 2, title: "Post first message", completed: false },
        { id: 3, title: "Add a profile picture", completed: false },
        { id: 4, title: "Connect with 5 users", completed: false },
        { id: 5, title: "Create a group chat", completed: false },
      ]
    }
  ])

  const [selectedUserId, setSelectedUserId] = useState<number>(users[0].id)

  const selectedUser = users.find(user => user.id === selectedUserId) || users[0]
  const completedTasks = selectedUser.tasks.filter(task => task.completed).length
  const totalTasks = selectedUser.tasks.length
  const progress = (completedTasks / totalTasks) * 100

  const canClaimReward = completedTasks >= 20

  const toggleTaskCompletion = (taskId: number) => {
    setUsers(users.map(user => 
      user.id === selectedUserId
        ? {
            ...user,
            tasks: user.tasks.map(task =>
              task.id === taskId ? { ...task, completed: !task.completed } : task
            )
          }
        : user
    ))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">Task Leaderboard</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="relative">
            <select
              className="w-full p-2 pr-8 border rounded appearance-none"
              onChange={(e) => setSelectedUserId(Number(e.target.value))}
              value={selectedUserId}
            >
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 pointer-events-none" />
          </div>

          <div className="flex justify-between items-center">
            <span className="text-lg font-semibold">Progress</span>
            <span className="text-lg font-semibold">{completedTasks}/{totalTasks}</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2.5">
            <div
              className="bg-primary h-2.5 rounded-full"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          
          <div className="space-y-2">
            {selectedUser.tasks.map(task => (
              <div key={task.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                <span className="flex items-center gap-2">
                  {task.completed ? (
                    <CheckCircle className="text-green-500" />
                  ) : (
                    <XCircle className="text-red-500" />
                  )}
                  {task.title}
                </span>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => toggleTaskCompletion(task.id)}
                >
                  {task.completed ? 'Undo' : 'Complete'}
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <h3 className="text-lg font-semibold mb-2">Reward</h3>
            <Card className="bg-primary text-primary-foreground">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-6 w-6" />
                  <span className="font-semibold">Premium Membership</span>
                </div>
                <Badge variant={canClaimReward ? "secondary" : "outline"}>
                  {canClaimReward ? 'Claimable' : `${20 - completedTasks} more to go`}
                </Badge>
              </CardContent>
            </Card>
            <Button 
              className="mt-4 w-full" 
              disabled={!canClaimReward}
            >
              Claim Reward
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}