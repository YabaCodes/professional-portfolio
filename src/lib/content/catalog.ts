import { getCollection } from 'astro:content';
import { kinds,validateGraph,type GraphEntry,type PublicRecord,type Kind } from './model';
export async function loadCatalog():Promise<GraphEntry[]> {
  const groups = await Promise.all(kinds.map(async kind=>(await getCollection(kind)).map(item=>({kind,data:item.data as PublicRecord}))));
  const entries=groups.flat();
  validateGraph(entries);
  return entries;
}
export function ofKind(catalog:readonly GraphEntry[],kind:Kind): GraphEntry[] {
  return catalog.filter(e=>e.kind===kind).sort((a,b)=>b.data.published.localeCompare(a.data.published)||a.data.id.localeCompare(b.data.id));
}
export function related(catalog:readonly GraphEntry[],record:PublicRecord):GraphEntry[] {
  return record.relatedIds.map(id=>{ const item=catalog.find(e=>e.data.id===id); if(!item)throw new Error('Missing relation '+id); return item; });
}
