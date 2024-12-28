"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "@/states/userAtom";
import { teamAtom } from "@/states/teamAtom";
import { Bell, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ModeToggle } from "@/components/theme-toggle";
import { NavigationLinks } from "@/components/layout/navigation-links";
import { TeamSelector } from "@/components/layout/team-selector";
import { UserMenu } from "@/components/layout/user-menu";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [teams, setTeams] = useState([]);
  const setUser = useSetRecoilState(userAtom);
  const [currentTeam, setCurrentTeam] = useRecoilState(teamAtom);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
      toast({
        title: "Please Login Again!",
        description: "Session Expired!",
      });
    } else if (session.status === "authenticated") {
      fetchTeams();
    }
  }, [session.status]);

  const fetchTeams = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/user/get?userId=${session.data?.userId}`);
      const data = await res.json();
      setUser(data);
      if (data.teams) {
        setTeams(data.teams);
        if (data.teams.length > 0)
        {
          setCurrentTeam(data.teams[0].id);
        }
        else 
        {
          toast({
            title: "No Teams Found!",
            description: "You are not part of any team!",
          })
        }
      }
    } catch (error) {
      console.error(error);
      toast({
        title: "Error",
        description: "Failed to fetch teams",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/auth/signin");
      toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong while logging out. Try Again!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* Sidebar */}
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <TeamSelector
              teams={teams}
              currentTeam={currentTeam}
              onTeamChange={setCurrentTeam}
            />
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1 px-2 lg:px-4">
            <NavigationLinks role={session.data?.role} />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0 md:hidden">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-background">
              <TeamSelector
                teams={teams}
                currentTeam={currentTeam}
                onTeamChange={setCurrentTeam}
              />
              <NavigationLinks
                role={session.data?.role}
                className="mt-4"
                iconClassName="h-5 w-5"
              />
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <ModeToggle />
          </div>
          <UserMenu role={session.data?.role} onLogout={handleLogOut} />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <div className="flex flex-1 justify-center rounded-lg shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}