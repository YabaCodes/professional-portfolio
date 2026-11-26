import { z } from 'astro/zod';
import { evidenceTypes,pillarNames,validPartialDate } from './model';
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/).refine(v=>{
  const d=new Date(v+'T00:00:00Z'); return Number.isFinite(d.valueOf()) && d.toISOString().slice(0,10)===v;
},'Invalid calendar date');
const partialDate = z.string().refine(validPartialDate,'Invalid calendar date or precision');
const text = z.string().trim().min(1);
const ref = z.object({label:text,url:z.string().url().refine(v=>/^https:\/\//i.test(v),'Public HTTPS link required')}).strict();
const base = z.object({
  id:text,slug:z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),title:text,summary:text,
  evidenceType:z.enum(evidenceTypes),pillar:z.enum(pillarNames),
  publicationStatus:z.literal('approved'),published:date,revised:date.optional(),
  relatedIds:z.array(text).default([]),references:z.array(ref).default([]),
}).strict();
export const schemas = {
  publications:base.extend({
    authors:z.array(text).min(1),venue:text,year:z.number().int().min(1900).max(2100),
    doi:z.string().regex(/^10\.\d{4,9}\/\S+$/),
    publicationType:z.enum(['original-research','review-article']),
    authorship:z.enum(['first-author','co-author']),
    volume:text,issue:text.optional(),pages:text.optional(),articleNumber:text.optional(),onlineDate:date,
  }).refine(v=>v.references.some(ref=>ref.url==='https://doi.org/'+v.doi),'Publication DOI must be in public references')
    .refine(v=>v.authors.includes('Yeabsra Mekdim Hailu')&&(v.authorship!=='first-author'||v.authors[0]==='Yeabsra Mekdim Hailu'),'Authorship attribution must match author list'),
  patents:base.extend({
    jurisdiction:z.literal('United States'),patentNumber:z.string().regex(/^US\d+B\d$/),
    grantDate:date,filingDate:date,applicationNumber:text,inventors:z.array(text).min(1),
    originalAssignee:text,role:z.literal('co-inventor'),claimCount:z.number().int().positive(),
  }).refine(v=>v.filingDate<=v.grantDate,'Grant must follow filing date')
    .refine(v=>v.inventors.includes('Yeabsra Mekdim Hailu'),'Co-inventor must appear in inventor list')
    .refine(v=>v.references.some(ref=>ref.url==='https://patents.google.com/patent/'+v.patentNumber),'Patent grant reference required'),
  credentials:base.extend({issuer:text,issued:partialDate,category:z.enum(['education','certification']),location:text.optional(),verificationBasis:z.enum(['owner-confirmed','public-reference'])}),
  career:base.extend({role:text,organization:text,start:partialDate,end:partialDate.optional(),location:text.optional(),assignment:z.boolean().default(false)}).refine(v=>!v.end||v.end>=v.start,'End precedes start'),
};
