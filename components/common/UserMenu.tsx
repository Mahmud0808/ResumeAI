"use client";

import React, { useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { KeyRound, LogOut } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ChangePasswordDialog from "@/components/common/ChangePasswordDialog";

const initialsOf = (name?: string | null, email?: string | null) => {
  const base = name?.trim() || email?.split("@")[0] || "U";
  return base
    .split(/\s+/)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
};

const UserMenu = ({ showName = true }: { showName?: boolean }) => {
  const { data: session } = useSession();
  const user = session?.user;
  const [pwOpen, setPwOpen] = useState(false);

  if (!user) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 focus:outline-none">
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={user.image}
            alt={user.name ?? "User"}
            className="h-8 w-8 rounded-full object-cover"
          />
        ) : (
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-700 text-sm font-semibold text-white">
            {initialsOf(user.name, user.email)}
          </span>
        )}
        {showName && (
          <span className="text-sm font-medium text-slate-800 max-md:hidden">
            {user.name ?? user.email}
          </span>
        )}
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuLabel className="max-w-[12rem] truncate">
          {user.email}
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => setPwOpen(true)}
          className="cursor-pointer"
        >
          <KeyRound className="mr-2 h-4 w-4" /> Change password
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: "/" })}
          className="cursor-pointer text-red-600"
        >
          <LogOut className="mr-2 h-4 w-4" /> Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>

      <ChangePasswordDialog open={pwOpen} onOpenChange={setPwOpen} />
    </DropdownMenu>
  );
};

export default UserMenu;
