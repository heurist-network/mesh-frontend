import { RealSidebar } from '@/components/sidebar';
import { AgentItem } from '@/components/agent-item';
import { ApiKeyInput } from '@/components/api-key-input';
import { ServerManagement } from '@/components/server-management';
import { ProvisionerProvider } from '@/lib/provisioner-context';
import { AnimatedTitle } from '@/components/animated-title';
import { Footer } from '@/components/footer';
import { ConnectGuide } from '@/components/connect-guide';
import { SidebarToggle } from '@/components/sidebar-toggle';

export default function Home() {
  return (
    <ProvisionerProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <RealSidebar />
        <main className="flex-1 overflow-auto w-full">
          <div className="size-full p-2 md:p-6">
            <div className="mx-auto">
              <div className="bg-gradient-to-b from-purple-500/5 to-transparent p-3 sm:p-6 rounded-xl mb-2 sm:mb-0">
                <AnimatedTitle />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:gap-8">
                <ApiKeyInput />
                <AgentItem />
                <ServerManagement />
                <ConnectGuide />
              </div>

              <Footer />
            </div>
          </div>
        </main>
        <SidebarToggle />
      </div>
    </ProvisionerProvider>
  );
}
