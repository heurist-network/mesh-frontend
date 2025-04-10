import { SimpleSidebar } from "@/components/simple-sidebar";
import { SimpleAgentItem } from "@/components/simple-agent-item";
import { ApiKeyInput } from "@/components/api-key-input";
import { ServerManagement } from "@/components/server-management";
import { ProvisionerProvider } from "@/lib/provisioner-context";

export default function Home() {
  return (
    <ProvisionerProvider>
      <div className="flex h-screen">
        <SimpleSidebar />
        <main className="flex-1 overflow-auto">
          <div className="w-full px-4 py-8">
            <h1 className="text-3xl font-bold mb-8">Customize an agent swarm that works for you</h1>
            <p className="text-muted-foreground mb-8">Create and manage MCP servers to access Heurist Mesh</p>
            
            {/* Step 1: API Key Input */}
            <ApiKeyInput />
            
            {/* Step 2: Agent Selection */}
            <div id="agent-selection" className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Step 2. Select your agents</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Click on the arrow button to select/deselect agents for your MCP server
              </p>
              <SimpleAgentItem />
            </div>
            
            {/* Step 3: Server Management */}
            <ServerManagement />
          </div>
        </main>
      </div>
    </ProvisionerProvider>
  );
}
