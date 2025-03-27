"use client";

import type { User } from "next-auth";

import { SidebarHistory } from "@/components/sidebar-history";
import { SidebarToggle } from "@/components/sidebar-toggle";
import { SidebarUserNav } from "@/components/sidebar-user-nav";
import { Button } from "@/components/ui/button";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from "@/components/ui/sidebar";
import { Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "./ui/separator";

export function AppSidebar({ user }: { user: User | undefined }) {
  const { setOpenMobile, state, isMobile } = useSidebar();

  return (
    <Sidebar className="" collapsible="icon">
      <div className="absolute top-5 right-2 flex flex-row justify-end items-center">
        <SidebarToggle />
      </div>
      <SidebarHeader>
        <SidebarMenu className="">
          <div className="flex flex-row justify-between items-center">
            {state === "expanded" && (
              <Link
                href="/"
                onClick={() => {
                  setOpenMobile(false);
                }}
                className="flex flex-row gap-1 items-center p-2 py-4"
              >
                <Image
                  src="/images/logo.png"
                  alt="Heurist"
                  width={28}
                  height={28}
                />
                <span className="text-sm font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                  Heurist
                </span>
              </Link>
            )}
          </div>
          <Link
            href="/"
            onClick={() => {
              setOpenMobile(false);
            }}
            className="flex items-center font-medium border-t pt-2"
          >
            <SidebarMenuButton>
              <Users /> Agents Store
            </SidebarMenuButton>
          </Link>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent className="custom-scrollbar">
        <SidebarHistory user={user} />
      </SidebarContent>
      <Separator />
      <SidebarFooter className="px-2 pb-4">
        {!user ? (
          <Link href="/login" onClick={() => setOpenMobile(false)}>
            <Button className="w-full h-10 text-base font-medium bg-white transition-colors hover:bg-white/90 text-black hover:text-black/90 shadow-sm">
              Sign in
            </Button>
          </Link>
        ) : (
          <SidebarUserNav user={user} />
        )}
      </SidebarFooter>
    </Sidebar>
  );
}
