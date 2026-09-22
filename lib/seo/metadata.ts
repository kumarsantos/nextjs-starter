import type { Metadata } from 'next';

const APP_DEFAULT_TITLE = 'ticktock';
const APP_TITLE_TEMPLATE = '%s | ticktock';
const APP_DESCRIPTION =
  'ticktock — multi-tenant weekly timesheet tracker built with the Next.js App Router.';
const rawAppUrl =
  process.env.NEXT_PUBLIC_APP_URL || process.env.NEXT_PUBLIC_VERCEL_URL || 'http://localhost:3000';
const APP_URL = rawAppUrl.startsWith('http') ? rawAppUrl : `https://${rawAppUrl}`;

interface ConstructMetadataParams {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export function constructMetadata({
  title = APP_DEFAULT_TITLE,
  description = APP_DESCRIPTION,
  image = '/og-image.png',
  icons = '/favicon.ico',
  noIndex = false,
  canonicalUrl,
}: ConstructMetadataParams = {}): Metadata {
  // Ensure image path is absolute if it's relative
  const imageUrl = image.startsWith('http')
    ? image
    : `${APP_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: title,
      template: APP_TITLE_TEMPLATE,
    },
    description,
    alternates: {
      canonical: canonicalUrl || './',
    },
    openGraph: {
      type: 'website',
      siteName: APP_DEFAULT_TITLE,
      title: title === APP_DEFAULT_TITLE ? title : `${title} | ${APP_DEFAULT_TITLE}`,
      description,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: title === APP_DEFAULT_TITLE ? title : `${title} | ${APP_DEFAULT_TITLE}`,
      description,
      images: [imageUrl],
    },
    icons,
    ...(noIndex && {
      robots: {
        index: false,
        follow: false,
      },
    }),
  };
}
