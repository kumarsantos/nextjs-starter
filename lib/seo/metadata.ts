import type { Metadata } from 'next';
import { getAppUrl } from '@/lib/app-url';
import { SITE_DESCRIPTION, SITE_NAME, SITE_TITLE_TEMPLATE } from '@/lib/seo/site';

interface ConstructMetadataParams {
  title?: string;
  description?: string;
  image?: string;
  icons?: string;
  noIndex?: boolean;
  canonicalUrl?: string;
}

export function constructMetadata({
  title = SITE_NAME,
  description = SITE_DESCRIPTION,
  image = '/assets/og-default.png',
  icons = '/favicon.ico',
  noIndex = false,
  canonicalUrl,
}: ConstructMetadataParams = {}): Metadata {
  const APP_URL = getAppUrl();
  const imageUrl = image.startsWith('http')
    ? image
    : `${APP_URL}${image.startsWith('/') ? image : `/${image}`}`;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: title,
      template: SITE_TITLE_TEMPLATE,
    },
    description,
    alternates: {
      canonical: canonicalUrl || './',
    },
    openGraph: {
      type: 'website',
      siteName: SITE_NAME,
      title: title === SITE_NAME ? title : `${title} | ${SITE_NAME}`,
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
      title: title === SITE_NAME ? title : `${title} | ${SITE_NAME}`,
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
