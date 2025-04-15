'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import Link from 'next/link';
import { ExternalLink, Link2, Laptop, FileCode, GitBranch } from 'lucide-react';
import { motion } from 'framer-motion';

export function ConnectGuide() {
  const platforms = [
    {
      name: 'Claude Desktop',
      icon: <Laptop className="size-4" />,
      link: 'https://modelcontextprotocol.io/quickstart/user',
      description: 'Official MCP client with integrated Claude AI',
    },
    {
      name: 'Cursor',
      icon: <FileCode className="size-4" />,
      link: 'https://docs.cursor.com/context/model-context-protocol#configuring-mcp-servers',
      description: 'Code editor with AI capabilities supporting MCP',
    },
    {
      name: 'MCP Proxy',
      icon: <GitBranch className="size-4" />,
      link: 'https://github.com/sparfenyuk/mcp-proxy',
      description:
        'Proxy tool to connect MCP servers with different transports',
    },
    {
      name: 'MCP Documentation',
      icon: <Link2 className="size-4" />,
      link: 'https://modelcontextprotocol.io',
      description: 'Learn more about connecting to MCP servers',
    },
  ];

  return (
    <Card className="w-full overflow-hidden border-0 shadow-lg bg-gradient-to-br from-card/80 to-card">
      <div className="absolute top-0 right-0 size-32 bg-blue-500/5 rounded-bl-full blur-2xl" />

      <CardHeader className="p-6 sm:px-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center">
            <ExternalLink className="size-5 text-primary" />
          </div>
          <CardTitle className="text-2xl sm:text-3xl font-bold">
            Step 4. Connect to MCP
          </CardTitle>
        </div>
        <CardDescription className="text-base text-muted-foreground/90 pl-[52px]">
          Use your MCP server with these platforms and applications
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 sm:px-8 pb-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {platforms.map((platform, index) => (
            <motion.div
              key={platform.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.2,
                delay: index * 0.1,
              }}
            >
              <Link
                href={platform.link}
                target="_blank"
                className="group flex flex-col h-full p-5 rounded-lg border border-muted bg-background/80 hover:bg-background hover:border-primary/30 hover:shadow-md transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="size-9 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    {platform.icon}
                  </div>
                  <h3 className="font-medium text-base text-foreground">
                    {platform.name}
                  </h3>
                  <ExternalLink className="size-4 ml-auto opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
                <p className="text-sm text-foreground/70 pl-12 leading-relaxed">
                  {platform.description}
                </p>
              </Link>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
