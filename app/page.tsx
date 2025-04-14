import { RealSidebar } from '@/components/sidebar';
import { AgentItem } from '@/components/agent-item';
import { ApiKeyInput } from '@/components/api-key-input';
import { ServerManagement } from '@/components/server-management';
import { ProvisionerProvider } from '@/lib/provisioner-context';
import { AnimatedTitle } from '@/components/animated-title';
import { Footer } from '@/components/footer';
import { ConnectGuide } from '@/components/connect-guide';

export default function Home() {
  return (
    <ProvisionerProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <RealSidebar />
        <main className="flex-1 overflow-auto w-full">
          <div className="size-full p-2 md:p-6">
            <div className="mx-auto space-y-8">
              <div className="p-2">
                <AnimatedTitle />
              </div>

              <div className="grid grid-cols-1 gap-8">
                <ApiKeyInput />

                {/* div needed for animation */}
                <div id="agent-selection">
                  <AgentItem />
                </div>

                <ServerManagement />
                <ConnectGuide />
              </div>

              <Footer />
            </div>
          </div>
        </main>
      </div>
    </ProvisionerProvider>
  );
}
