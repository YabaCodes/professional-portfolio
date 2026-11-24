type Pending = {status:'pending';label:null;approvalReference:null};
type ApprovedBase = {status:'approved';label:string;approvalReference:string};
export type ContactGate=(Pending&{href:null})|(ApprovedBase&{href:string});
export type ResumeGate=(Pending&{assetPath:null})|(ApprovedBase&{assetPath:string});
const nonempty=(value:unknown):value is string=>typeof value==='string'&&value.trim()===value&&value.length>0;
/** Fail closed if an unapproved destination or asset is put into the public repository. */
export function resolveContact(gate:ContactGate):{label:string;href:string}|null {
 if(gate.status==='pending'){
  if(gate.href!==null||gate.label!==null||gate.approvalReference!==null)throw new Error('Pending contact must not contain a destination or metadata');
  return null;
 }
 if(gate.status!=='approved'||!nonempty(gate.label)||!nonempty(gate.approvalReference)||!nonempty(gate.href))
  throw new Error('Contact destination requires exact item-level approval');
 const email=/^mailto:[^\s@/?#]+@[^\s@/?#]+\.[^\s@/?#]+$/i;
 const profile=/^https:\/\/(?:www\.)?linkedin\.com\/in\/[a-z0-9_-]+\/?$/i;
 if(!email.test(gate.href)&&!profile.test(gate.href))throw new Error('Contact destination must be an approved professional email or profile');
 return {label:gate.label,href:gate.href};
}
export function resolveResume(gate:ResumeGate):{label:string;assetPath:string}|null {
 if(gate.status==='pending'){
  if(gate.assetPath!==null||gate.label!==null||gate.approvalReference!==null)throw new Error('Pending résumé must not contain a file destination or metadata');
  return null;
 }
 if(gate.status!=='approved'||!nonempty(gate.label)||!nonempty(gate.approvalReference)||!nonempty(gate.assetPath))
  throw new Error('Résumé file requires explicit asset-level approval');
 if(!/^\/professional-portfolio\/[A-Za-z0-9_/-]+\.pdf$/.test(gate.assetPath)||
    gate.assetPath.includes('..')||gate.assetPath.includes('//'))
  throw new Error('Résumé asset must be an approved PDF within the project base path');
 return {label:gate.label,assetPath:gate.assetPath};
}
