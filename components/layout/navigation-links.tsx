"use client";
import Link from "next/link";
import { Bell, FileText, List } from "lucide-react";
import { FaPeopleCarry, FaTasks } from "react-icons/fa";
import { Role } from "@prisma/client";
import { ChatBubbleIcon } from "@radix-ui/react-icons";

interface NavLinksProps {
  role?: Role;
  className?: string;
  iconClassName?: string;
}

export function NavigationLinks({ role, className = "", iconClassName = "h-4 w-4" }: NavLinksProps) {
  return (
    <nav className={`grid items-start ${className}`}>
      <Link href="/task-manager" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <FaTasks className={iconClassName} />
        Task Manager
      </Link>
      {role && role !== Role.MEMBER && (
        <Link href="/teams" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
          <FaPeopleCarry className={iconClassName} />
          Teams
        </Link>
      )}
      {/* <Link href="/leaderboard" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <List className={iconClassName} />
        Leader Board
      </Link>
      <Link href="/chats" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <ChatBubbleIcon className={iconClassName} />
        Chats
      </Link>
      <Link href="/documents" className="flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary">
        <FileText className={iconClassName} />
        Documents
      </Link> */}
    </nav>
  );
}