"use client"
import { useEffect, useState } from "react";
import { Loader } from "lucide-react";
import { Role, Team, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TeamForm } from "@/components/teams/TeamForm";
import { CreateTeamDialog } from "@/components/teams/CreateTeamDialog";
import { TeamTable } from "@/components/teams/TeamTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSession } from "next-auth/react";

export default function TeamManagementPage() {
  const [creatingTeam, setCreatingTeam] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const session = useSession();
  const { toast } = useToast();
  const queryClient = useQueryClient()

  const handleCreateTeam = async () => {
    try {
      setIsCreatingTeam(true);
      const response = await fetch("/api/teams/create", {
        method: "POST",
        body: JSON.stringify({ name: creatingTeam }),
      });
      if (response.ok) {
        toast({ title: "Team created!" });
        setCreatingTeam("");
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to create team",
        variant: "destructive",
      });
    } finally {
      setIsCreatingTeam(false);
    }
  };

  const handleUpdateTeam = async (data: any) => {
    try {
      setIsUpdating(true);
      const response = await fetch("/api/teams/update", {
        method: "POST",
        body: JSON.stringify({ ...data, teamId: editingTeam?.teamId }),
      });
      if (response.ok) {
        toast({ title: "Team Updated!" });
        setEditingTeam(null);
        fetchTeams();
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to update team",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/teams/delete?teamId=${teamId}`);
      if (response.ok) {
        toast({ title: "Team Deleted!" });
        setTeams(teams.filter((team: Team) => team.teamId !== teamId));
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to delete team",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const urls = {
        "leader":`/api/teams/get-teams-by-leader?leaderId=${session.data?.userId}`,
        "admin":"/api/teams/getAll"
      }
      const response = await fetch(session.data?.role === Role.ADMIN ? urls.admin : urls.leader);
      if (response.ok) {
        const data = await response.json();
        return data.teams
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/getAll");
      if (response.ok) {
        const data = await response.json();
        return data
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };


  const allUsersQuery = useQuery({
    queryKey:["users", "all"],
    queryFn: fetchUsers,
    staleTime:5*60*1000
  })

  const fetchTeamsQuery = useQuery({
    queryKey:['teams', 'all'],
    queryFn:fetchTeams,
    staleTime:5*60*1000,
    enabled: Boolean(session.data?.userId)
  })

  const createTeamMutation = useMutation({
    mutationKey:['createTeam'],
    mutationFn:handleCreateTeam,
    onSuccess: ()=>{
      queryClient.invalidateQueries({queryKey:['teams', 'all']})
    }
  })


  return (
    <div className="container mx-auto p-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Team Management</CardTitle>
          <CardDescription>Manage your organization's teams</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Existing Teams</h2>
            {session && session.data?.role == Role.ADMIN &&<CreateTeamDialog
              onSubmit={handleCreateTeam}
              setName={setCreatingTeam}
              name={creatingTeam}
              disabled={isCreatingTeam}
            />}
          </div>
          <TeamTable
            isLoading={fetchTeamsQuery.isLoading}
            teams={fetchTeamsQuery.data || []}
            onEdit={setEditingTeam}
            teamCreating={createTeamMutation.isSuccess || false}
            onDelete={handleDeleteTeam}
            isDeleting={isDeleting}
          />
        </CardContent>
      </Card>

      {editingTeam && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Team: {editingTeam.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <TeamForm
              onSubmit={handleUpdateTeam}
              teamData={editingTeam}
              users={allUsersQuery.data || []}
              disabled={isUpdating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}