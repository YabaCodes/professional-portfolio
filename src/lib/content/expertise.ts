import {routeHref} from '../site';
import {routes,type GraphEntry} from './model';
export const pillarDescriptions=[
 'Developing and integrating manufacturing systems.',
 'Connecting engineering activities with program objectives.',
 'Enabling coordinated execution and sustained engineering performance.',
 'Connecting scientific investigation with practical engineering design.',
] as const;
export const pillarShortLabels=['Engineering','Program Delivery','Leadership','Research'] as const;
export const pillarIds=['engineering','program-delivery','leadership','research'] as const;
export function competencyAnchor(id:string){return id.toLowerCase();}
export function evidenceHref({kind,data}:GraphEntry):string|undefined {
 if(kind==='competencies')return routeHref('expertise')+'#'+competencyAnchor(data.id);
 if(kind==='credentials')return routeHref('about')+'#'+data.id.toLowerCase();
 if(kind==='publications'||kind==='patents')return routeHref('research')+'#'+data.id.toLowerCase();
 const route=routes[kind];return route?routeHref(route+'/'+data.slug):undefined;
}
export function evidenceDescription({kind,data}:GraphEntry):string {
 if(kind==='credentials')return data.verificationBasis==='owner-confirmed'?'Owner-confirmed qualification':'Publicly referenced qualification';
 switch(data.evidenceType){
  case 'professional-experience':return 'Owner-approved professional experience';
  case 'published-research':return 'Published research';
  case 'public-invention':return 'Public invention';
  case 'independent-demonstration':return 'Independent technical demonstration';
  case 'illustrative-simulation':return 'Illustrative or simulated results';
  case 'public-credential':return 'Professional credential';
 }
}
