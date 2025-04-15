'use client';

import type { ComponentProps } from 'react';

import { type SidebarTrigger, useSidebar } from '@/components/ui/sidebar';
import { Button } from './ui/button';
import { PanelLeft } from 'lucide-react';
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function SidebarToggle({
  className,
}: ComponentProps<typeof SidebarTrigger>) {
  const { toggleSidebar, openMobile, state } = useSidebar();
  const isMobile = useIsMobile();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  if (isMobile) {
    return (
      <Button
        onClick={toggleSidebar}
        variant="default"
        size="icon"
        className={cn(
          'fixed z-50 rounded-full shadow-lg md:hidden bg-primary hover:bg-primary/90 h-12 w-12 flex items-center justify-center transition-all duration-300',
          openMobile
            ? 'bottom-6 left-[calc(var(--sidebar-width-mobile)-4rem)]'
            : 'bottom-6 right-6 animate-in slide-in-from-bottom-4',
        )}
      >
        <PanelLeft
          size={20}
          className={`transition-transform duration-300 ${openMobile ? 'rotate-180' : ''}`}
        />
        <span className="sr-only">Toggle sidebar</span>
        <span
          className={cn(
            'absolute inset-0 rounded-full bg-primary/20 opacity-0 transition-opacity',
            openMobile ? 'opacity-100' : 'opacity-0',
          )}
        />
      </Button>
    );
  }

  // for desktop, only to show when collapsed
  if (state === 'collapsed') {
    return (
      <Button
        type="button"
        onClick={toggleSidebar}
        variant="outline"
        size="icon"
        className="fixed left-4 top-4 z-40 hidden md:flex size-8 items-center justify-center bg-background/80 backdrop-blur-sm shadow-sm border-primary/20"
      >
        <PanelLeft size={16} className="text-primary" />
        <span className="sr-only">Show sidebar</span>
      </Button>
    );
  }

  return null;
}
