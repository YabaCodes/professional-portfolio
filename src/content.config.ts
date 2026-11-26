import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { schemas } from './lib/content/schema';
export const collections = {
  publications:defineCollection({loader:file('src/content/publications.json'),schema:schemas.publications}),
  patents:defineCollection({loader:file('src/content/patents.json'),schema:schemas.patents}),
  credentials:defineCollection({loader:file('src/content/credentials.json'),schema:schemas.credentials}),
  career:defineCollection({loader:file('src/content/career.json'),schema:schemas.career}),
};
