/** Independent educational readiness assessment, not a release authorization. */
export interface ReadinessCriterion {label:string;maturity:number;mandatory:boolean}
export const maturityLabels=['Not started','In progress','Evidence available','Accepted'] as const;
export function assessReadiness(criteria:readonly ReadinessCriterion[]){
 if(criteria.length!==6)throw new RangeError('Six criteria required');
 const seen=new Set<string>();
 const counts=[0,0,0,0];
 const blockers:string[]=[];
 for(const item of criteria){
  if(typeof item.label!=='string'||!item.label.trim()||seen.has(item.label)||!Number.isInteger(item.maturity)||item.maturity<0||item.maturity>3||typeof item.mandatory!=='boolean')throw new RangeError('Invalid readiness criterion');
  seen.add(item.label);
  counts[item.maturity]++;
  if(item.mandatory&&item.maturity!==3)blockers.push(item.label);
 }
 const accepted=counts[3];
 const status=blockers.length?'Gate blocked':accepted===criteria.length?'Ready for review':'Review required';
 return {accepted,counts,blockers,status};
}
