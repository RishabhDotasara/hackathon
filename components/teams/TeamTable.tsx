import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Team } from "@prisma/client";
import { Loader2, Pencil, Trash } from "lucide-react";
import TeamTableRow from "./TeamTableRow";
import TeamTableRowSkeleton from "./TeamTableRowSkeleton";

interface TeamTableProps {
  teams: Team[];
  onEdit: (team: Team) => void;
  onDelete: (teamId: string) => void;
  isDeleting: boolean;
  teamCreating:boolean
}

export function TeamTable({
  teams,
  onEdit,
  onDelete,
  isDeleting,
  teamCreating
}: TeamTableProps) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Team Name</TableHead>
          <TableHead>Members</TableHead>
          <TableHead>Leaders</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {isLoading ? (
          <>
        <TeamTableRowSkeleton />
        <TeamTableRowSkeleton />
        <TeamTableRowSkeleton />
          </>
        ) : (
          teams.map((team: Team) => (
        <TeamTableRow isLoading={false} team={team} onEdit={onEdit} key={team.teamId} />
          ))
        )}
        {teamCreating && <TeamTableRowSkeleton/>}
      </TableBody>
    </Table>
  );
}