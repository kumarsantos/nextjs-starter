import type { Thing, WithContext } from 'schema-dts';
import { getAppUrl } from '../app-url';
import { SITE_DESCRIPTION, SITE_NAME } from './site';

const APP_URL = getAppUrl();

// Default global schema used when no `code` prop is provided
const DEFAULT_SCHEMA = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebSite',
      '@id': `${APP_URL}/#website`,
      url: APP_URL,
      name: SITE_NAME,
      description: SITE_DESCRIPTION,
      inLanguage: 'en-US',
    },
    {
      '@type': 'Organization',
      '@id': `${APP_URL}/#organization`,
      name: `${SITE_NAME} Inc`,
      url: APP_URL,
      logo: `${APP_URL}/logo.png`,
    },
  ],
} as WithContext<Thing> & { '@graph': Thing[] };

interface JsonLdProps<T extends Thing> {
  code?: WithContext<T>;
  id?: string;
}

export function JsonLd<T extends Thing>({ code, id = 'json-ld' }: JsonLdProps<T>) {
  const schemaData = code || DEFAULT_SCHEMA;

  return (
    <script
      id={id}
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(schemaData).replace(/</g, '\\u003c'),
      }}
    />
  );
}
