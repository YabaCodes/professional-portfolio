import { z } from 'astro/zod';
import { evidenceTypes,pillarNames,caseSections,validPartialDate } from './model';
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
const caseFields = Object.fromEntries(caseSections.map(s=>[s.id,text])) as Record<typeof caseSections[number]['id'],typeof text>;
export const schemas = {
  'case-studies':base.extend({
    sections:z.object(caseFields).strict(),
    role:text,context:text,period:text,
    illustration:z.enum(['lattice','system']).optional(),
    methodSteps:z.array(z.object({title:text,description:text}).strict()).default([]),
    comparison:z.object({
      title:text,subtitle:text,rows:z.array(z.object({label:text,value:z.number().finite().nonnegative(),approximate:z.boolean()}).strict()).min(1),
      sourceUrl:z.string().url().refine(v=>/^https:\/\//i.test(v)),note:text,
    }).strict().refine(v=>v.rows.some(r=>r.value>0),'Comparison must contain a positive value').optional(),
    competencies:z.array(text).default([]),
  }).refine(v=>!v.comparison||v.references.some(r=>r.url===v.comparison?.sourceUrl),'Comparison source must be a listed reference'),
  competencies:base,
  insights:base.extend({body:text}),
  demonstrations:base.extend({inputs:z.array(text).min(1),outputs:z.array(text).min(1),assumptions:z.array(text).min(1),limitations:z.array(text).min(1),method:text}),
  publications:base.extend({authors:z.array(text).min(1),venue:text,year:z.number().int().min(1900).max(2100),doi:text.optional()}),
  patents:base.extend({jurisdiction:text,patentNumber:text,grantDate:date,inventors:z.array(text).min(1)}),
  credentials:base.extend({issuer:text,issued:partialDate,category:z.enum(['education','certification']),location:text.optional(),verificationBasis:z.enum(['owner-confirmed','public-reference'])}),
  career:base.extend({role:text,organization:text,start:partialDate,end:partialDate.optional(),location:text.optional(),assignment:z.boolean().default(false)}).refine(v=>!v.end||v.end>=v.start,'End precedes start'),
};
