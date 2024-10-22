"use client";
import Link from "next/link";
import {
  Bell,
  CircleUser,
  File,
  FileText,
  Home,
  List,
  Menu,
  Package2,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ChatBubbleIcon } from "@radix-ui/react-icons";
import { FaPeopleCarry, FaTasks } from "react-icons/fa";
import { useToast } from "@/hooks/use-toast";

import "../globals.css";
import { ModeToggle } from "@/components/theme-toggle";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Team } from "@prisma/client";
import { useRecoilState, useSetRecoilState } from "recoil";
import { userAtom } from "@/states/userAtom";
import { teamAtom } from "@/states/teamAtom";

export const description =
  "A products dashboard with a sidebar navigation and a main content area. The dashboard has a header with a search input and a user menu. The sidebar has a logo, navigation links, and a card with a call to action. The main content area shows an empty state with a call to action.";

export default function Dashboard({ children }: { children: React.ReactNode }) {
  const session = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [teams, setTeams] = useState([]);
  const setUser = useSetRecoilState(userAtom)
  const [currentTeam, setCurrentTeam] = useRecoilState(teamAtom) ;  


  const fetchTeams = async ()=>{
    try 
    {
      const res = await fetch("/api/user/get?userId="+session.data?.userId, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const data = await res.json();
      setUser(data);
      if (data.teams)
      {
        setTeams(data.teams);
        setCurrentTeam(data.teams[0].teamId);
      }
      console.log(data);
    }
    catch(er)
    {
      console.log(er)
    }
  }

  useEffect(() => {
    if (session.status === "unauthenticated") {
      router.push("/auth/signin");
      toast({
        title: "Please Login Again!",
        description: "Session Expired!",
      });
    }
    fetchTeams();
  }, [session.status, router]);

  
  const handleLogOut = async () => {
    try {
      await signOut({ redirect: false }); // Wait for signOut to complete
      router.push("/auth/signin"); // Redirect to sign-in page
      toast({
        title: "Logged Out",
        description: "You have successfully logged out.",
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "Something went wrong while logging out.",
        variant: "destructive",
      });
    }
  };
  console.log(session);

  const TeamSelector = () => {
    return (
      <Select onValueChange={(e)=>{setCurrentTeam(e)}} value={currentTeam}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Select a Team" />
        </SelectTrigger>
        <SelectContent >
          <SelectGroup>
            <SelectLabel>Select Team</SelectLabel>
            {teams && teams.map((team:any)=>{
              return (
                <SelectItem value={team.teamId}>{team.name}</SelectItem>
              )
            })}
            {teams.length == 0 && <SelectItem value="No Teams Found!">No Teams Found!</SelectItem>}
            
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  };

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-background md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b bg-background px-4 lg:h-[60px] lg:px-6">
            <Link
              href="/"
              className="flex items-center gap-2 font-semibold"
            ></Link>
            <TeamSelector/>
            <Button variant="outline" size="icon" className="ml-auto h-8 w-8">
              <Bell className="h-4 w-4" />
              <span className="sr-only">Toggle notifications</span>
            </Button>
          </div>
          <div className="flex-1">
            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
              <Link
                href="/task-manager"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FaTasks className="h-4 w-4" />
                Task Manager
              </Link>
              <Link
                href="/teams"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <FaPeopleCarry className="h-4 w-4"/>
                Teams
              </Link>
              <Link
                href="/leaderboard"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <List className="h-4 w-4" />
                Leader Board
              </Link>
              <Link
                href="/chats"
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
              >
                <ChatBubbleIcon className="h-4 w-4" />
                Chats
              </Link>
              <Link
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                href={"/documents"}
              >
                <FileText className="h-4 w-4" />
                Documents
              </Link>
            </nav>
          </div>
          <div className="mt-auto p-4">
            {/* Add any footer content here if needed */}
          </div>
        </div>
      </div>

      <div className="flex flex-col ">
        <header className="flex h-14 items-center gap-4 border-b bg-background px-4 lg:h-[60px] lg:px-6">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="shrink-0 md:hidden"
              >
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col bg-background">
              <nav className="grid gap-2 text-lg font-medium">
                <Link
                  href="#"
                  className="flex items-center gap-2 text-lg font-semibold"
                >
                  <TeamSelector/>
                </Link>
                <Link
                  href="/task-manager"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <Home className="h-5 w-5" />
                  Task Manager
                </Link>
                <Link
                  href="/teams"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <FaPeopleCarry className="h-5 w-5" />
                  Teams
                </Link>
                <Link
                  href="/leaderboard"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <List className="h-5 w-5" />
                  LeaderBoard
                </Link>

                <Link
                  href="/chats"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <ChatBubbleIcon className="h-5 w-5" />
                  Chats
                </Link>
                <Link
                  href="/documents"
                  className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                >
                  <File className="h-5 w-5" />
                  Documents
                </Link>
              </nav>
            </SheetContent>
          </Sheet>
          <div className="w-full flex-1">
            <ModeToggle />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="secondary" size="icon" className="rounded-full">
                <CircleUser className="h-5 w-5" />
                <span className="sr-only">Toggle user menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-background">
              <DropdownMenuLabel>{session.data?.role}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogOut}>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6 bg-background">
          <div className="flex flex-1  justify-center rounded-lg  shadow-sm">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
