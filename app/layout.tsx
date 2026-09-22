import './globals.css';
import Link from 'next/link';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
import { ThemeToggle } from '@/components/theme-toggle';
import { fontInter, fontMono } from '@/lib/fonts';
import { JsonLd } from '@/lib/seo/json-ld';
import { constructMetadata } from '@/lib/seo/metadata';
import { constructViewport } from '@/lib/viewport';

export const metadata = constructMetadata();
export const viewport = constructViewport();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <JsonLd />
      </head>
      <body
        className={`${fontInter.variable} ${fontMono.variable} min-h-screen bg-background text-foreground antialiased`}
      >
        <ThemeProvider>
          <div className="relative flex min-h-screen flex-col">
            <header className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-200 bg-background/80 px-6 py-3 backdrop-blur dark:border-neutral-800">
              <Link href="/" className="text-sm font-semibold tracking-tight">
                Next.js Starter
              </Link>
              <ThemeToggle />
            </header>
            <main className="flex-1">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
