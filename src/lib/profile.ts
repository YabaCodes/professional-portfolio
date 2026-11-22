/** Owner-approved public wording; see PP-005A editorial decision. */
export const biography = [
  'I am a mechanical engineer and technical leader working at the intersection of engineering, manufacturing technology and complex program delivery.',
  'My professional experience spans the development and industrialization of automated manufacturing systems, from early technical requirements and concept evaluation through equipment integration, verification and production readiness.',
  'Currently, I work as a Senior Process Development Engineer at SHL Medical in Taiwan, with functional engineering team leadership responsibilities. My role combines hands-on technical problem-solving with cross-functional coordination, supplier collaboration and engineering program execution.',
  'My academic background in mechanical engineering and additive manufacturing provides a strong foundation in analytical thinking, experimental investigation and engineering design. I have contributed to three academic publications and am a co-inventor of a granted United States patent.',
  'I am particularly interested in the intersection of engineering excellence, manufacturing systems, technological innovation and technical leadership.',
] as const;
export const leadershipStatement = [
 'My approach to technical leadership is grounded in clarity of requirements, evidence-based decision-making, accountability and collaborative execution.',
 'I believe effective engineering leadership requires both technical depth and the ability to align people, technology and program objectives toward a common outcome.',
] as const;
export const leadershipAreas = [
 {title:'Technical ownership',description:'Establishing engineering priorities and supporting technical decision-making'},
 {title:'Team leadership',description:'Guiding engineers and coordinating technical workstreams'},
 {title:'Program execution',description:'Managing technical deliverables, dependencies and engineering risks'},
 {title:'Supplier collaboration',description:'Coordinating technical alignment with international engineering partners'},
 {title:'Cross-functional integration',description:'Connecting engineering, manufacturing, quality and validation stakeholders'},
] as const;
export const credibility = [
 {value:'M.Sc.',label:'Mechanical Engineering'},
 {value:'PMP®',label:'Project Management'},
 {value:'03',label:'Research Publications'},
 {value:'01',label:'Granted US Patent'},
] as const;
export function displayDate(date:string):string {
 if(date.length===4)return date;
 return new Intl.DateTimeFormat('en',{month:'short',year:'numeric',timeZone:'UTC'}).format(new Date((date.length===7?date+'-01':date)+'T00:00:00Z'));
}
