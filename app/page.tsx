import { SimpleSidebar } from "@/components/simple-sidebar";
import { SimpleAgentItem } from "@/components/simple-agent-item";
import { ApiKeyInput } from "@/components/api-key-input";
import { ServerManagement } from "@/components/server-management";
import { ProvisionerProvider } from "@/lib/provisioner-context";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { Github, ExternalLink } from "lucide-react";

export default function Home() {
  return (
    <ProvisionerProvider>
      <div className="flex h-screen">
        <SimpleSidebar />
        <main className="flex-1 overflow-auto">
          <div className="w-full p-2 md:p-10">
            <div className="max-w-[1200px] mx-auto space-y-8">
              <div className="p-2">
                <h1 className="text-3xl font-bold mb-4">Customize an agent swarm that works for you</h1>
                <p className="text-muted-foreground">Create and manage MCP servers to access Heurist Mesh</p>
              </div>
              
              <div className="grid grid-cols-1 gap-8">
                {/* Step 1: API Key Input */}
                <div className="w-full">
                  <ApiKeyInput />
                </div>
                
                {/* Step 2: Agent Selection */}
                <div id="agent-selection" className="w-full">
                  <h2 className="text-xl font-semibold mb-4 p-2">Step 2. Select your agents</h2>
                  <p className="text-sm text-muted-foreground mb-4 p-2">
                    Click on the arrow button to select/deselect agents for your MCP server
                  </p>
                  <SimpleAgentItem />
                </div>
                
                {/* Step 3: Server Management */}
                <div className="w-full">
                  <ServerManagement />
                </div>
                
                {/* Step 4: Connect to MCP */}
                <div className="w-full">
                  <Card>
                    <CardHeader>
                      <CardTitle>Step 4. Connect to MCP</CardTitle>
                      <CardDescription>
                        Use your MCP server with these platforms
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        <li className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <Link 
                            href="https://playground.ai.cloudflare.com/" 
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            Cloudflare AI Playground
                          </Link>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <Link 
                            href="https://claude.ai/download" 
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            Claude Desktop
                          </Link>
                        </li>
                        <li className="flex items-center">
                          <ExternalLink className="h-4 w-4 mr-2" />
                          <Link 
                            href="https://www.cursor.com/" 
                            target="_blank"
                            className="text-primary hover:underline"
                          >
                            Cursor
                          </Link>
                        </li>
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
              
              {/* Footer */}
              <footer className="mt-16 pt-8 border-t border-border p-2">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Link 
                        href="https://github.com/heurist-network/heurist-agent-framework" 
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        heurist-agent-framework
                      </Link>
                    </div>
                    <div className="flex items-center gap-2">
                      <Github className="h-4 w-4" />
                      <Link 
                        href="https://github.com/heurist-network/heurist-mesh-mcp-server" 
                        target="_blank"
                        className="text-sm text-muted-foreground hover:text-primary"
                      >
                        heurist-mesh-mcp-server
                      </Link>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link 
                      href="https://heurist.ai/" 
                      target="_blank"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Homepage
                    </Link>
                    <Link 
                      href="https://discord.com/invite/heuristai" 
                      target="_blank"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Discord
                    </Link>
                    <Link 
                      href="https://t.me/heurist_ai" 
                      target="_blank"
                      className="text-sm text-muted-foreground hover:text-primary"
                    >
                      Telegram
                    </Link>
                  </div>
                </div>
                <div className="text-center text-xs text-muted-foreground mt-8">
                  © {new Date().getFullYear()} Heurist Network
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </ProvisionerProvider>
  );
}
