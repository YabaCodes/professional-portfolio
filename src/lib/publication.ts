import gates from '../../config/public-facing.json';
import {resolveContact,resolveResume,type ContactGate,type ResumeGate} from './publication-gates.ts';
export const approvedContact=resolveContact(gates.contact as ContactGate);
export const approvedResume=resolveResume(gates.resume as ResumeGate);
