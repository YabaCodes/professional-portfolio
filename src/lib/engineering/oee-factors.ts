/** Synthetic percentage-factor model; not an observed production record. */
export interface OeeFactors {availability:number;performance:number;quality:number}
export const lossLabels=['Availability loss','Performance loss','Quality loss','Effective production'] as const;
export function calculateFactorOee(input:OeeFactors) {
 const {availability:a,performance:p,quality:q}=input;
 for(const value of [a,p,q]) if(!Number.isFinite(value)||value<0||value>100)throw new RangeError('Factors must be finite percentages between 0 and 100');
 const oee=a*p*q/10000;
 const losses=[100-a,a*(100-p)/100,a*p*(100-q)/10000,oee];
 const max=Math.max(...losses.slice(0,3));
 const largestLoss=max===0?'No losses':lossLabels.slice(0,3).filter((_,i)=>Math.abs(losses[i]-max)<1e-9).join(' / ');
 return {oee,losses,largestLoss};
}
