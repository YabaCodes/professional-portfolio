/** Independent OEE model. Inputs use minutes, minutes/unit and integer counts. No employer data. */
export interface OeeInput {
 plannedMinutes:number; operatingMinutes:number; idealMinutesPerUnit:number; totalUnits:number; goodUnits:number;
}
export interface OeeResult {
 availability:number; performance:number|null; quality:number|null; oee:number;
 losses:{availability:number;performance:number;quality:number;effective:number};
}
function finite(value:number,name:string):void {
 if(!Number.isFinite(value)||value<0) throw new RangeError(name+' must be finite and nonnegative');
}
export function calculateOee(input:OeeInput):OeeResult {
 const {plannedMinutes:p,operatingMinutes:r,idealMinutesPerUnit:c,totalUnits:t,goodUnits:g}=input;
 for(const [name,value] of Object.entries(input)) finite(value,name);
 if(p<=0||c<=0)throw new RangeError('Planned time and ideal cycle time must be positive');
 if(r>p)throw new RangeError('Operating time exceeds planned time');
 if(!Number.isSafeInteger(t)||!Number.isSafeInteger(g)||g>t)throw new RangeError('Invalid unit counts');
 if(r===0&&t>0)throw new RangeError('Production requires operating time');
 const idealTotal=c*t;
 if(!Number.isFinite(idealTotal)||idealTotal>r+1e-10*Math.max(1,r))throw new RangeError('Ideal production time exceeds operating time; review cycle time/counts');
 // Clamp only roundoff-sized impossible excess; larger contradictions are rejected above.
 // Express every partition relative to planned time to preserve conservation.
 const feasibleIdeal=Math.min(r,idealTotal);
 const availabilityFactor=r/p;
 const performanceFactor=r===0?null:feasibleIdeal/r;
 const qualityFactor=t===0?null:g/t;
 const effective=feasibleIdeal*(qualityFactor??0)/p;
 const availabilityLoss=(p-r)/p;
 const performanceLoss=(r-feasibleIdeal)/p;
 const qualityLoss=feasibleIdeal*(1-(qualityFactor??0))/p;
 return {
  availability:availabilityFactor,performance:performanceFactor,quality:qualityFactor,oee:effective,
  losses:{availability:availabilityLoss,performance:performanceLoss,quality:qualityLoss,effective},
 };
}
