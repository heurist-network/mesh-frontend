'use client';

import type { User } from 'next-auth';
import { useRouter } from 'next/navigation';

import { PlusIcon } from '@/components/icons';
import { SidebarHistory } from '@/components/sidebar-history';
import { SidebarUserNav } from '@/components/sidebar-user-nav';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  useSidebar,
} from '@/components/ui/sidebar';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipTrigger } from './ui/tooltip';
import { Separator } from './ui/separator';
import { Users } from 'lucide-react';

export function AppSidebar({ user }: { user: User | undefined }) {
  const router = useRouter();
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="group-data-[side=left]:border-r-0">
      <SidebarHeader>
        <SidebarMenu>
          <div className="flex flex-row justify-between items-center">
            <Link
              href="/"
              onClick={() => {
                setOpenMobile(false);
              }}
              className="flex flex-row gap-3 items-center"
            >
              <span className="text-lg font-semibold px-2 hover:bg-muted rounded-md cursor-pointer">
                Heurist
              </span>
            </Link>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  type="button"
                  className="p-2 h-fit"
                  onClick={() => {
                    setOpenMobile(false);
                    router.push('/');
                    router.refresh();
                  }}
                >
                  <PlusIcon />
                </Button>
              </TooltipTrigger>
              <TooltipContent align="end">New Chat</TooltipContent>
            </Tooltip>
          </div>

          <Link
            href="/agents"
            onClick={() => {
              setOpenMobile(false);
            }}
            className="flex items-center font-medium"
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
