import { SimpleSidebar } from '@/components/simple-sidebar';
import { SimpleAgentItem } from '@/components/simple-agent-item';
import { ApiKeyInput } from '@/components/api-key-input';
import { ServerManagement } from '@/components/server-management';
import { ProvisionerProvider } from '@/lib/provisioner-context';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import { AnimatedTitle } from '@/components/animated-title';
import { Footer } from '@/components/footer';

export default function Home() {
  return (
    <ProvisionerProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        <SimpleSidebar />
        <main className="flex-1 overflow-auto w-full">
          <div className="w-full p-2 md:p-6">
            <div className="mx-auto space-y-8">
              <div className="p-2">
                <AnimatedTitle />
              </div>

              <div className="grid grid-cols-1 gap-8">
                <ApiKeyInput />

                <div id="agent-selection" className="w-full">
                  <SimpleAgentItem />
                </div>

                <ServerManagement />

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
                        <ExternalLink className="size-4 mr-2" />
                        <Link
                          href="https://modelcontextprotocol.io/quickstart/user"
                          target="_blank"
                          className="text-primary hover:underline"
                        >
                          Claude Desktop
                        </Link>
                      </li>
                      <li className="flex items-center">
                        <ExternalLink className="size-4 mr-2" />
                        <Link
                          href="https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers"
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

              <Footer />
            </div>
          </div>
        </main>
      </div>
    </ProvisionerProvider>
  );
}
