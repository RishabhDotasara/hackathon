import { Skeleton } from "@/components/ui/skeleton";
import { Role } from "@prisma/client";
import { Loader2, Trash } from "lucide-react";

interface TaskHeaderProps {
  title: string;
  isLoading: boolean;
  userRole?: Role;
  isDeleting: boolean;
  onDelete: () => void;
}

export function TaskHeader({ title, isLoading, userRole, isDeleting, onDelete }: TaskHeaderProps) {
  return (
    <div className="flex justify-between">
      {isLoading ? (
        <Skeleton className="h-8 w-3/4" />
      ) : (
        <>
          <h2 className="text-2xl font-bold">{title}</h2>
          {userRole !== Role.MEMBER && (
            <span 
              className="p-2 rounded bg-red-200 cursor-pointer" 
              onClick={onDelete}
            >
              {!isDeleting ? (
                <Trash className="text-red-500"/>
              ) : (
                <Loader2 className="animate-spin"/>
              )}
            </span>
          )}
        </>
      )}
    </div>
  );
}