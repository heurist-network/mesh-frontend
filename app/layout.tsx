import type { Metadata } from 'next';
import { Toaster } from 'sonner';

import { ThemeProvider } from '@/components/theme-provider';
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
  keywords: 'AI agents, Web3 MCP, Heurist Mesh, MCP, AI Skills, Crypto Market Alpha, x402',
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

const LIGHT_THEME_COLOR = 'hsl(0 0% 100%)';
const DARK_THEME_COLOR = 'hsl(240deg 10% 3.92%)';
const THEME_COLOR_SCRIPT = `\
(function() {
  var html = document.documentElement;
  var meta = document.querySelector('meta[name="theme-color"]');
  if (!meta) {
    meta = document.createElement('meta');
    meta.setAttribute('name', 'theme-color');
    document.head.appendChild(meta);
  }
  function updateThemeColor() {
    var isDark = html.classList.contains('dark');
    meta.setAttribute('content', isDark ? '${DARK_THEME_COLOR}' : '${LIGHT_THEME_COLOR}');
  }
  var observer = new MutationObserver(updateThemeColor);
  observer.observe(html, { attributes: true, attributeFilter: ['class'] });
  updateThemeColor();
})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      // `next-themes` injects an extra classname to the body element to avoid
      // visual flicker before hydration. Hence the `suppressHydrationWarning`
      // prop is necessary to avoid the React hydration mismatch warning.
      // https://github.com/pacocoursey/next-themes?tab=readme-ov-file#with-app
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: THEME_COLOR_SCRIPT,
          }}
        />
      </head>
      <body className="antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
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
        </ThemeProvider>
      </body>
    </html>
  );
}
