import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Users, Briefcase, Target, CheckCircle } from "lucide-react"

const teams = [
  {
    name: "Product Development",
    description: "Responsible for designing and building our core products",
    memberCount: 12,
    projectCount: 3,
    completionRate: 87,
    tasksCompleted: 156,
  },
  {
    name: "Marketing",
    description: "Drives brand awareness and customer acquisition strategies",
    memberCount: 8,
    projectCount: 2,
    completionRate: 92,
    tasksCompleted: 104,
  },
  {
    name: "Customer Support",
    description: "Provides excellent service and assistance to our clients",
    memberCount: 15,
    projectCount: 1,
    completionRate: 95,
    tasksCompleted: 230,
  },
  {
    name: "Finance",
    description: "Manages company finances, budgeting, and financial planning",
    memberCount: 6,
    projectCount: 2,
    completionRate: 89,
    tasksCompleted: 78,
  },
]

export default function Component() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Company Teams</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {teams.map((team, index) => (
          <Card key={index} className="w-full">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{team.name}</span>
                <Badge variant="secondary" className="ml-2">
                  <Users className="w-4 h-4 mr-1" />
                  {team.memberCount}
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500 mb-4">{team.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Completion Rate</span>
                <span className="text-sm font-medium">{team.completionRate}%</span>
              </div>
              <Progress value={team.completionRate} className="mb-4" />
              <div className="grid  gap-4 text-sm">
                {/* <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg">
                  <Briefcase className="w-5 h-5 mb-1 text-gray-600" />
                  <span className="font-medium">{team.projectCount}</span>
                  <span className="text-xs text-gray-500">Projects</span>
                </div> */}
                <div className="flex flex-col items-center p-2 bg-gray-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 mb-1 text-gray-600" />
                  <span className="font-medium">{team.tasksCompleted}</span>
                  <span className="text-xs text-gray-500">Tasks Completed</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}