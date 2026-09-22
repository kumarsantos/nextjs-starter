import type { Viewport } from 'next';

export const constructViewport = (): Viewport => {
  return {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
    // Prevents virtual keyboards on mobile browsers from breaking viewport height layouts
    interactiveWidget: 'resizes-visual',
    colorScheme: 'dark light',
    themeColor: [
      { media: '(prefers-color-scheme: light)', color: '#ffffff' },
      { media: '(prefers-color-scheme: dark)', color: '#09090b' },
    ],
  };
};
