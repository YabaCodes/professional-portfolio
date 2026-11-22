import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { schemas } from './lib/content/schema';
export const collections = {
  'case-studies':defineCollection({loader:file('src/content/case-studies.json'),schema:schemas['case-studies']}),
  competencies:defineCollection({loader:file('src/content/competencies.json'),schema:schemas.competencies}),
  insights:defineCollection({loader:file('src/content/insights.json'),schema:schemas.insights}),
  demonstrations:defineCollection({loader:file('src/content/demonstrations.json'),schema:schemas.demonstrations}),
  publications:defineCollection({loader:file('src/content/publications.json'),schema:schemas.publications}),
  patents:defineCollection({loader:file('src/content/patents.json'),schema:schemas.patents}),
  credentials:defineCollection({loader:file('src/content/credentials.json'),schema:schemas.credentials}),
  career:defineCollection({loader:file('src/content/career.json'),schema:schemas.career}),
};
