import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { useState } from "react";

interface CreateTeamDialogProps {
  onSubmit:  () => Promise<void>;
  setName: (name: string) => void;
  name: string;
  disabled: boolean;
}

export function CreateTeamDialog({
  onSubmit,
  setName,
  name,
  disabled,
}: CreateTeamDialogProps) {


  const [open, setOpen] = useState(false);
  const {toast} = useToast();
  const queryClient = useQueryClient();

  const createTeamMutation = useMutation({
    mutationKey:['createTeam'],
    mutationFn:onSubmit,
    onSuccess: ()=>{
      toast({title:"Team created!"});
      setName("");
      setOpen(false);
      queryClient.invalidateQueries({queryKey:['teams','all']})
    }
  })



  return (
    <Dialog open={open} onOpenChange={setOpen}>
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
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={()=>{createTeamMutation.mutate()}} disabled={disabled}>
            Create Team
            {disabled && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}