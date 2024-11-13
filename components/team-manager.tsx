"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Check,
  ChevronsUpDown,
  Loader,
  Loader2,
  Pencil,
  Trash,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Team, User } from "@prisma/client";
import { useToast } from "@/hooks/use-toast";
import { Label } from "./ui/label";

// Mock data for available users and teams

const formSchema = z.object({
  teamName: z.string().min(2, {
    message: "Team name must be at least 2 characters.",
  }),
  members: z.array(z.string()).min(1, {
    message: "Please select at least one team member.",
  }),
  leaders: z.array(z.string()).min(1, {
    message: "Please select at least one team leader.",
  }),
});

function TeamForm({
  onSubmit,
  teamData,
  users,
  disabled,
}: {
  onSubmit: () => void;
  teamData: Team;
  users: User[];
  disabled: boolean;
}) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      teamName: teamData.name,
      members: teamData.members.map((member: User) => member.userId),
      leaders: teamData.leaders.map((member: User) => member.userId),
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="teamName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Name</FormLabel>
              <FormControl>
                <Input placeholder="Enter team name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="members"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Members</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length > 0
                        ? `${field.value.length} members selected`
                        : "Select team members"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {users &&
                            users.map((user: User) => (
                              <CommandItem
                                key={user.userId}
                                onSelect={() => {
                                  const updatedValue = field.value.includes(
                                    user.userId
                                  )
                                    ? field.value.filter(
                                        (id) => id !== user.userId
                                      ) // Remove user ID if already selected
                                    : [...field.value, user.userId]; // Add user ID if not selected
                                  form.setValue("members", updatedValue);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value.includes(user.userId)
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {user.username}
                              </CommandItem>
                            ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                You can select multiple team members.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="leaders"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Team Members</FormLabel>
              <FormControl>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-full justify-between",
                        !field.value.length && "text-muted-foreground"
                      )}
                    >
                      {field.value.length > 0
                        ? `${field.value.length} members selected`
                        : "Select team members"}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[400px] p-0">
                    <Command>
                      <CommandInput placeholder="Search users..." />
                      <CommandList>
                        <CommandEmpty>No user found.</CommandEmpty>
                        <CommandGroup>
                          {teamData.members.map((user: User) => (
                            <CommandItem
                              key={user.userId}
                              onSelect={() => {
                                const updatedValue = field.value.includes(
                                  user.userId
                                )
                                  ? field.value.filter(
                                      (id) => id !== user.userId
                                    ) // Remove user ID if already selected
                                  : [...field.value, user.userId]; // Add user ID if not selected
                                form.setValue("leaders", updatedValue);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  field.value.includes(user.userId)
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {user.username}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
              </FormControl>
              <FormDescription>
                You can select multiple team leaders.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          onClick={() => {
            onSubmit(form.getValues());
          }}
          disabled={disabled}
        >
          Update Team
          {disabled && <Loader2 className="animate-spin h-8 w-8 " />}
        </Button>
      </form>
    </Form>
  );
}

function CreateTeam({
  onSubmit,
  setName,
  name,
  disabled,
}: {
  onSubmit: () => void;
  setTeam: any;
  name: string;
  disabled: boolean;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default">Add New Team</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Team</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Team Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            onClick={() => {
              onSubmit();
            }}
            disabled={disabled}
          >
            Create Team
            {disabled && <Loader2 className="animate-spin h-8 w-8" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function TeamManagementPage() {
  const [creatingTeam, setCreatingTeam] = useState(""); //name for the creating team.
  const [isCreatingTeam, setIsCreatingTeam] = useState(false);
  const [teams, setTeams] = useState<Team[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [editingTeam, setEditingTeam] = useState<Team | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleCreateTeam = async () => {
    try {
      setIsCreatingTeam(true);
      const response = await fetch("/api/teams/create", {
        method: "POST",
        body: JSON.stringify({ name: creatingTeam }),
      });
      if (response.ok) {
        toast({
          title: "Team created!",
        });
        setCreatingTeam("");
        setIsCreatingTeam(false);
        fetchTeams();
      }
    } catch (err) {
      console.error(err);
      setIsCreatingTeam(false);
    }
  };

  const handleUpdateTeam = async (data: any) => {
    try {
      setIsUpdating(true);
      console.log(data);
      const response = await fetch("/api/teams/update", {
        method: "POST",
        body: JSON.stringify({ ...data, teamId: editingTeam.teamId }),
      });
      if (response.ok) {
        toast({
          title: "Team Updated!",
        });
        setIsUpdating(false);
        setEditingTeam(null);
        fetchTeams();
      }
    } catch (err) {
      console.error(err);
      setIsUpdating(false);
      toast({
        title: "Failed to update team",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTeam = async (teamId: string) => {
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/teams/delete?teamId=${teamId}`);
      if (response.ok) {
        toast({
          title: "Team Deleted!",
        });
        setIsDeleting(false);
        setTeams(teams.filter((team: Team) => team.teamId != teamId));
      }
    } catch (err) {
      setIsDeleting(false);
      console.error(err);
      toast({
        title: "Failed to delete team",
        variant: "destructive",
      });
    }
  };

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/teams/getAll");
      if (response.ok) {
        const data = await response.json();
        setTeams(data.data);
        console.log(data.data);
        setIsLoading(false);
      }
    } catch (err) {
      setIsLoading(false);
      console.log(err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user/getAll");
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
        console.log(data);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchTeams();
    fetchUsers();
  }, []);

  if (isLoading) {
    return <Loader className="animate-spin" />;
  } else {
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
              <CreateTeam
                onSubmit={handleCreateTeam}
                setName={setCreatingTeam}
                name={creatingTeam}
                disabled={isCreatingTeam}
              />
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Team Name</TableHead>
                  <TableHead>Members</TableHead>
                  <TableHead>Leader</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams &&
                  teams.map((team: Team) => (
                    <TableRow key={team.id}>
                      <TableCell>{team.name}</TableCell>
                      <TableCell>{team.members.length} members</TableCell>
                      <TableCell>{team.leaders.length}</TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => setEditingTeam(team)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleDeleteTeam(team.teamId)}
                          >
                            {!isDeleting && <Trash className="h-4 w-4" />}
                            {isDeleting && (
                              <Loader2 className="animate-spin h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
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
}
