"use client"
import { useEffect, useState } from "react";
import { Loader, Users, Users2 } from "lucide-react";
import { Team, User } from "@prisma/client";
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
import { useRouter } from "next/navigation";

export const dynamic = 'force-dynamic'

export default function TeamManagementPage() {
  const [creatingTeam, setCreatingTeam] = useState("");
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  

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
        fetchTeams();
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
      const response = await fetch("/api/teams/getAll");
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data);
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
        setUsers(data);
      }
    } catch (err) {
      console.error(err);
      toast({
        title: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader className="h-8 w-8 animate-spin" />
      </div>
    );
  }

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
            <CreateTeamDialog
              onSubmit={handleCreateTeam}
              setName={setCreatingTeam}
              name={creatingTeam}
              disabled={isCreatingTeam}
            />
          </div>
          <TeamTable
            teams={teams}
            onEdit={setEditingTeam}
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
              users={users}
              disabled={isUpdating}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}