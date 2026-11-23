import {calculateOee,type OeeInput,type OeeResult} from './oee.ts';

export interface SyntheticScenario {id:string;label:string;description:string;input:OeeInput}
export const syntheticScenarios:readonly SyntheticScenario[]=[
 {id:'reference',label:'Reference scenario',description:'Balanced synthetic production scenario.',input:{plannedMinutes:480,operatingMinutes:432,idealMinutesPerUnit:0.5,totalUnits:760,goodUnits:744}},
 {id:'availability',label:'Availability-constrained',description:'Hypothetical long downtime with otherwise limited losses.',input:{plannedMinutes:480,operatingMinutes:300,idealMinutesPerUnit:0.5,totalUnits:560,goodUnits:554}},
 {id:'quality',label:'Quality-constrained',description:'Hypothetical elevated rejection count.',input:{plannedMinutes:480,operatingMinutes:450,idealMinutesPerUnit:0.5,totalUnits:880,goodUnits:660}},
 {id:'no-output',label:'No output',description:'Hypothetical complete loss of planned operating time.',input:{plannedMinutes:480,operatingMinutes:0,idealMinutesPerUnit:0.5,totalUnits:0,goodUnits:0}},
 {id:'ideal',label:'Ideal production',description:'Mathematical best case with no losses.',input:{plannedMinutes:480,operatingMinutes:480,idealMinutesPerUnit:0.5,totalUnits:960,goodUnits:960}},
];
export const fieldSpecs=[
 {key:'plannedMinutes',label:'Planned production time',unit:'min',step:'any'},
 {key:'operatingMinutes',label:'Operating time',unit:'min',step:'any'},
 {key:'idealMinutesPerUnit',label:'Ideal cycle time',unit:'min / unit',step:'any'},
 {key:'totalUnits',label:'Total units',unit:'units',step:'1'},
 {key:'goodUnits',label:'Good units',unit:'units',step:'1'},
] as const;
export const lossSpecs=[
 {key:'availability',label:'Availability loss'},
 {key:'performance',label:'Performance loss'},
 {key:'quality',label:'Quality loss'},
 {key:'effective',label:'Effective good production'},
] as const;
export type LossKey=typeof lossSpecs[number]['key'];
export interface OeeAnalysis {
 result:OeeResult;lossMinutes:Record<LossKey,number>;
 dominant:string;interpretation:string;
}
export function analyzeOee(input:OeeInput):OeeAnalysis {
 const result=calculateOee(input);
 const lossMinutes:Record<LossKey,number>={
  availability:result.losses.availability*input.plannedMinutes,
  performance:result.losses.performance*input.plannedMinutes,
  quality:result.losses.quality*input.plannedMinutes,
  effective:result.losses.effective*input.plannedMinutes,
 };
 const lossKeys=['availability','performance','quality'] as const;
 const max=Math.max(...lossKeys.map(key=>lossMinutes[key]));
 const dominant=max<=1e-12?'No losses':lossKeys
  .filter(key=>Math.abs(lossMinutes[key]-max)<=1e-9*Math.max(1,max))
  .map(key=>key[0].toUpperCase()+key.slice(1)+' loss').join(' / ');
 const interpretation=dominant==='No losses'
  ? 'No losses are represented in this idealized scenario; this does not establish real-world performance.'
  : 'Largest modeled loss: '+dominant+'. This identifies a possible investigation priority, not an underlying root cause.';
 return {result,lossMinutes,dominant,interpretation};
}
export const formatPercent=(fraction:number|null):string=>fraction===null?'Not defined':(fraction*100).toFixed(2)+'%';
export const formatMinutes=(value:number):string=>value.toFixed(2)+' min';
