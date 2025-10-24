import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { SidebarProvider } from '@/components/ui/sidebar';
import './globals.css';

const description =
  'The Web3 skills library for agents. Equip your AI with crypto market alpha. Create dedicated MCP servers with 100+ Web3 tools.';

export const metadata: Metadata = {
  metadataBase: new URL('https://mesh.heurist.ai'),
  title: 'Heurist Mesh',
  description: description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://mesh.heurist.ai',
    title: 'Heurist Mesh',
    description: description,
    siteName: 'Heurist Mesh',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Heurist Mesh',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Heurist Mesh',
    description: description,
    images: ['/og-image.png'],
    creator: '@heurist_ai',
  },
  keywords:
    'AI agents, Web3 MCP, Heurist Mesh, MCP, AI Skills, Crypto Market Alpha, x402',
  robots: 'index, follow',
  alternates: {
    canonical: 'https://mesh.heurist.ai',
  },
  authors: [{ name: 'Heurist AI' }],
  category: 'Technology',
};

export const viewport = {
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased">
        <SidebarProvider>
          <Toaster
            position="bottom-right"
            toastOptions={{
              classNames: {
                toast:
                  'group toast group-[.toaster]:bg-card group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg font-sans rounded-lg',
                description: 'group-[.toast]:text-muted-foreground',
                actionButton:
                  'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
                cancelButton:
                  'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
                error: '!bg-destructive !text-destructive-foreground',
                success:
                  '!bg-[#cdf138]/15 !text-[#a5c72a] !border-[#cdf138]/20',
                warning:
                  '!bg-orange-400/10 !text-orange-400 !border-orange-400/20',
                info: '!bg-blue-400/10 !text-blue-400 !border-blue-400/20',
              },
            }}
          />
          {children}
        </SidebarProvider>
      </body>
    </html>
  );
}
