import './globals.css';
import { ThemeProvider } from '@/components/providers/ThemeProvider';
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
            {/* Navbar */}
            {children}
            {/* Footer */}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
