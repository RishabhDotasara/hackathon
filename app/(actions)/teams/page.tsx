"use client"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Loader } from "lucide-react"
import { Dialog, DialogTrigger, DialogContent, DialogTitle} from "@/components/ui/dialog"
import { useEffect } from "react"
import { Team } from "@prisma/client"

interface TeamWithMembers extends Team {
  members: MemberWithTasks[]
}

interface MemberWithTasks extends Member {
  tasks: Task[]
}

interface Task {
  completed: boolean
}

async function fetchTeams(): Promise<TeamWithMembers[]> {
  const response = await fetch("/api/teams/getAll")
  const data = await response.json()
  return data
}

export default function TeamOverview() {
  const [teams, setTeams] = useState<TeamWithMembers[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTeamName, setNewTeamName] = useState("")
  const [newTeamMembers, setNewTeamMembers] = useState<string[]>([])

  useEffect(() => {
    async function loadTeams() {
      try {
        const teamData = await fetchTeams()
        setTeams(teamData)
      } catch (error) {
        console.error("Error fetching teams:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadTeams()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader className="animate-spin" />
      </div>
    )
  }

  const handleAddTeam = () => {
    // Implement your API call to add the team here
    console.log("Adding new team:", newTeamName, newTeamMembers)
    // Close the dialog after submitting
    setIsDialogOpen(false)
  }

  return (
    <div className="container mx-auto p-6 flex flex-col justify-start h-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Company Teams</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger>
            <button className="bg-blue-500 text-white px-4 py-2 rounded">Add Team</button>
          </DialogTrigger>
          <DialogContent>
            <DialogTitle>Add a New Team</DialogTitle>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Team Name</label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Members (comma separated)</label>
              <input
                type="text"
                value={newTeamMembers.join(", ")}
                onChange={(e) => setNewTeamMembers(e.target.value.split(",").map(name => name.trim()))}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            <DialogActions>
              <DialogButton onClick={() => setIsDialogOpen(false)}>Cancel</DialogButton>
              <DialogButton onClick={handleAddTeam}>Add Team</DialogButton>
            </DialogActions>
          </DialogContent>
        </Dialog>
      </div>
      {teams.length === 0 ? (
        <h2 className="text-center text-4xl text-gray-500 font-semibold mt-10">
          No teams available
        </h2>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teams.map((team) => {
            const totalTasks = team.members.reduce((acc, member) => acc + member.tasks.length, 0)
            const completedTasks = team.members.reduce((acc, member) => acc + member.tasks.filter(task => task.completed).length, 0)
            const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0

            return (
              <Card key={team.teamId} className="w-full">
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{team.teamName}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Completion Rate</span>
                    <span className="text-sm font-medium">{totalTasks === 0 ? 'N/A' : `${Math.round(completionRate)}%`}</span>
                  </div>
                  <Progress value={completionRate} className="mb-4" />
                  <h2 className="text-sm font-medium mb-2">Team Members</h2>
                  <ul className="pl-4 space-y-2">
                    {team.members.map((member, index) => (
                      <li
                        key={index}
                        className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm flex items-center justify-between"
                      >
                        <span className="text-gray-700 font-medium">{member.employeeId}</span>
                        <Badge variant="default" className="bg-black text-white rounded-full px-3 py-1">
                          {member.tasks.length}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}
