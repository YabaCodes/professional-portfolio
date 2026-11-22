/** Public metadata only. Approval evidence and private drafts must remain outside this repository. */
export const kinds = ['case-studies','competencies','insights','demonstrations','publications','patents','credentials','career'] as const;
export type Kind = typeof kinds[number];
export const prefixes: Record<Kind,string> = {'case-studies':'CS',competencies:'COMP',insights:'INS',demonstrations:'EL',publications:'PUB',patents:'PAT',credentials:'CRED',career:'CAR'};
export const pillarNames = ['Engineering & Technology','Technical Program Delivery','Leadership & Operational Excellence','Research & Innovation'] as const;
export const evidenceTypes = ['professional-experience','published-research','public-invention','independent-demonstration','illustrative-simulation','public-credential'] as const;
export type EvidenceType = typeof evidenceTypes[number];
export const caseSections = [
  {id:'overview',label:'Executive overview'},
  {id:'challenge',label:'Engineering challenge'},
  {id:'contribution',label:'My individual contribution'},
  {id:'methodology',label:'Engineering methodology'},
  {id:'decisions',label:'Technical decisions & trade-offs'},
  {id:'outcomes',label:'Results & outcomes'},
  {id:'demonstration',label:'Independent technical demonstration'},
  {id:'reflection',label:'Reflection & competencies'},
] as const;
/** Calendar precision is preserved; missing months/days are never invented. */
export function validPartialDate(value:string):boolean {
  if(!/^\d{4}(?:-\d{2}(?:-\d{2})?)?$/.test(value))return false;
  const full=value.length===4?value+'-01-01':value.length===7?value+'-01':value;
  const d=new Date(full+'T00:00:00Z');
  return Number.isFinite(d.valueOf())&&d.toISOString().slice(0,10)===full;
}
export interface PublicRecord {
  id:string; slug:string; title:string; summary:string; evidenceType:EvidenceType; pillar:typeof pillarNames[number];
  publicationStatus:'approved'; published:string; revised?:string;
  verificationBasis?:'owner-confirmed'|'public-reference';
  relatedIds:string[]; references:{label:string;url:string}[];
}
export interface GraphEntry { kind:Kind; data:PublicRecord; }
export const allowedEvidence: Record<Kind,readonly EvidenceType[]> = {
  'case-studies':['professional-experience','published-research','public-invention','independent-demonstration'],
  competencies:['professional-experience','published-research','public-invention','independent-demonstration','public-credential'],
  insights:['published-research','public-invention','independent-demonstration','illustrative-simulation'],
  demonstrations:['independent-demonstration','illustrative-simulation'],
  publications:['published-research'],patents:['public-invention'],credentials:['public-credential'],career:['professional-experience'],
};
export const routes: Partial<Record<Kind,string>> = {'case-studies':'work',insights:'insights',demonstrations:'insights/lab'};
/** Validates metadata and cross-collection relationships, not factual accuracy or legal authorization. */
export function validateGraph(entries:readonly GraphEntry[]): void {
  const byId=new Map<string,GraphEntry>(); const byRoute=new Set<string>();
  for (const entry of entries) {
    const {kind,data:d}=entry;
    if (!new RegExp('^'+prefixes[kind]+'-[0-9]{3,}$').test(d.id)) throw new Error('Invalid identifier: '+d.id);
    if (byId.has(d.id)) throw new Error('Duplicate ID: '+d.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) throw new Error('Invalid slug: '+d.slug);
    if (kind==='insights' && d.slug==='lab') throw new Error('Reserved insights route: lab');
    const key=kind+'/'+d.slug;
    if (byRoute.has(key)) throw new Error('Duplicate slug: '+key);
    if (d.publicationStatus!=='approved') throw new Error('Unapproved record: '+d.id);
    if (!allowedEvidence[kind].includes(d.evidenceType)) throw new Error('Invalid evidence type: '+d.id);
    if (kind!=='competencies' && ['published-research','public-invention','public-credential'].includes(d.evidenceType) && d.references.length===0 && !(kind==='credentials' && d.evidenceType==='public-credential' && d.verificationBasis==='owner-confirmed')) throw new Error('Public reference required: '+d.id);
    if(d.revised && d.revised<d.published) throw new Error('Revision precedes publication: '+d.id);
    if(new Set(d.relatedIds).size!==d.relatedIds.length) throw new Error('Duplicate relationship: '+d.id);
    byId.set(d.id,entry); byRoute.add(key);
  }
  for (const {data:d} of entries) {
    for (const id of d.relatedIds) {
      if (id===d.id || !byId.has(id)) throw new Error('Invalid relationship: '+d.id+' → '+id);
    }
  }
  for (const {kind,data:d} of entries) {
    if(kind==='competencies'){
      if(!d.relatedIds.length||d.relatedIds.some(id=>byId.get(id)?.kind==='competencies')) throw new Error('Competency lacks direct supporting evidence: '+d.id);
      if(!d.relatedIds.some(id=>byId.get(id)?.data.evidenceType===d.evidenceType)) throw new Error('Competency evidence classification lacks matching support: '+d.id);
    }
  }
}

/** Derive reverse links from the approved competency-to-evidence relationship. */
export function supportingCompetencies(catalog:readonly GraphEntry[],recordId:string):GraphEntry[]{
 return catalog.filter(entry=>entry.kind==='competencies'&&entry.data.relatedIds.includes(recordId)).sort((a,b)=>a.data.id.localeCompare(b.data.id));
}
