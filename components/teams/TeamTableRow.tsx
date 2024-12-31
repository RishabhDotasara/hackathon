import React, { useState } from 'react'
import { TableCell, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Loader2, Pencil, Trash } from 'lucide-react'
import { Role, Team } from '@prisma/client'
import TeamTableRowSkeleton from './TeamTableRowSkeleton'
import { useToast } from '@/hooks/use-toast'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { useSession } from 'next-auth/react'

type RowProps = {
  team: Team
  onEdit: (team: Team) => void
  isLoading?: boolean
}

export default function TeamTableRow({ team, onEdit, isLoading = false }: RowProps) {
  const { toast } = useToast()
  const session = useSession();
  const queryClient = useQueryClient()
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const deleteTeam = async () => {
    const response = await fetch('/api/teams/delete', {
      method: 'DELETE',
      body: JSON.stringify({ teamId: team.teamId }),
      headers: {
        'Content-Type': 'application/json',
      },
    })

    if (!response.ok) {
      throw new Error('Failed to delete the team')
    }
    return response.json()
  }

  const teamDeleteMutation = useMutation({
    mutationKey: ['deleteTeam', team.teamId],
    mutationFn: deleteTeam,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams', 'all'] })
      toast({
        title: 'Team Deleted!',
        description: 'All members and leaders have been removed from the team!',
      })
    },
    onError: () => {
      toast({
        title: 'Error Deleting Team!',
        description: 'Try Again!',
        variant: 'destructive',
      })
    },
  })

  if (teamDeleteMutation.isSuccess) {
    return <TeamTableRowSkeleton />
  }

  return (
    <TableRow>
      <TableCell>{team.name}</TableCell>
      <TableCell>{team.members.length} members</TableCell>
      <TableCell>{team.leaders.length} leaders</TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onEdit(team)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <AlertDialogTrigger asChild>
              {session.data?.role === Role.ADMIN && <Button
                variant="outline"
                size="icon"
                disabled={teamDeleteMutation.isPending}
              >
                {teamDeleteMutation.isPending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash className="h-4 w-4" />
                )}
              </Button>}
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirm Deletion</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete the team "{team.name}"? This action cannot be undone.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    teamDeleteMutation.mutate()
                    setIsDialogOpen(false)
                  }}
                  disabled={teamDeleteMutation.isPending}
                >
                  {teamDeleteMutation.isPending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    'Delete'
                  )}
                </Button>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </TableCell>
    </TableRow>
  )
}
