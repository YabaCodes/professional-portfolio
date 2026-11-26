/** Public metadata only. Approval evidence and private drafts must remain outside this repository. */
export const kinds = ['publications','patents','credentials','career'] as const;
export type Kind = typeof kinds[number];
export const prefixes: Record<Kind,string> = {publications:'PUB',patents:'PAT',credentials:'CRED',career:'CAR'};
export const pillarNames = ['Engineering & Technology','Technical Program Delivery','Leadership & Operational Excellence','Research & Innovation'] as const;
export const evidenceTypes = ['professional-experience','published-research','public-invention','public-credential'] as const;
export type EvidenceType = typeof evidenceTypes[number];
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
  publications:['published-research'],patents:['public-invention'],credentials:['public-credential'],career:['professional-experience'],
};
/** Validates metadata and cross-collection relationships, not factual accuracy or legal authorization. */
export function validateGraph(entries:readonly GraphEntry[]): void {
  const byId=new Map<string,GraphEntry>(); const byRoute=new Set<string>();
  for (const entry of entries) {
    const {kind,data:d}=entry;
    if (!new RegExp('^'+prefixes[kind]+'-[0-9]{3,}$').test(d.id)) throw new Error('Invalid identifier: '+d.id);
    if (byId.has(d.id)) throw new Error('Duplicate ID: '+d.id);
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(d.slug)) throw new Error('Invalid slug: '+d.slug);
    const key=kind+'/'+d.slug;
    if (byRoute.has(key)) throw new Error('Duplicate slug: '+key);
    if (d.publicationStatus!=='approved') throw new Error('Unapproved record: '+d.id);
    if (!allowedEvidence[kind].includes(d.evidenceType)) throw new Error('Invalid evidence type: '+d.id);
    if (['published-research','public-invention','public-credential'].includes(d.evidenceType) && d.references.length===0 && !(kind==='credentials' && d.evidenceType==='public-credential' && d.verificationBasis==='owner-confirmed')) throw new Error('Public reference required: '+d.id);
    if(d.revised && d.revised<d.published) throw new Error('Revision precedes publication: '+d.id);
    if(new Set(d.relatedIds).size!==d.relatedIds.length) throw new Error('Duplicate relationship: '+d.id);
    byId.set(d.id,entry); byRoute.add(key);
  }
  for (const {data:d} of entries) {
    for (const id of d.relatedIds) {
      if (id===d.id || !byId.has(id)) throw new Error('Invalid relationship: '+d.id+' → '+id);
    }
  }
}

