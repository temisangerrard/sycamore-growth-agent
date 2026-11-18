import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
export const stages=['Researched','Reviewed','Contacted','Replied','Interested','Application started','Outcome'];
const fields=['name','type','area','segment','source','evidence','contact','relevance','eligibility','unknowns','next','confidence','priority','status','owner','notes','followUp','provenance','draft'];
const normal=s=>s.toLowerCase().replace(/[^a-z0-9]/g,'');
const canonical=s=>{if(!s)return ''; const u=new URL(s); if(!['http:','https:'].includes(u.protocol)||u.username||u.password)throw Error('Use a public HTTP source URL'); u.hash=''; for(const k of [...u.searchParams.keys()])if(k.startsWith('utm_'))u.searchParams.delete(k); return u.href.replace(/\/$/,'');};
const hash=s=>createHash('sha256').update(s).digest('hex');
const keys=r=>[hash('name:'+normal(r.name)),...(r.source?[hash('source:'+canonical(r.source))]:[]),...(r.contact?[hash('contact:'+r.contact.trim().toLowerCase())]:[])];
export async function openStore(path){
 await mkdir(dirname(path),{recursive:true}); let state={records:[],suppression:[]};
 try{state=JSON.parse(await readFile(path,'utf8')); if(!Array.isArray(state.records)||!Array.isArray(state.suppression))throw Error('Invalid storage format');}catch(e){if(e.code!=='ENOENT')throw e;}
 let queue=Promise.resolve();
 const mutate=fn=>{const task=queue.then(async()=>{const next=structuredClone(state);const result=fn(next);await writeFile(path+'.tmp',JSON.stringify(next,null,2),{mode:0o600});await rename(path+'.tmp',path);state=next;return structuredClone(result);});queue=task.catch(()=>{});return task;};
 return {path,list:async()=>{await queue;return structuredClone(state.records);},save:input=>mutate(s=>{
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Invalid record');
 for(const key of Object.keys(input))if(![...fields,'id','discoveredAt','updatedAt','suppressed'].includes(key))throw Error('Unsupported field: '+key);
 const old=input.id?s.records.find(r=>r.id===input.id):null;if(input.id&&!old)throw Error('Record not found');
 const r={};for(const key of fields){const value=input[key]??old?.[key]??'';if(typeof value!=='string'||value.length>6000)throw Error('Invalid '+key);r[key]=value.trim();}
 if(!r.name)throw Error('Name is required');
 r.type ||= 'partner';r.status ||= 'Researched';r.provenance ||= 'user-entered';r.confidence ||= 'Low';r.priority ||= 'Unreviewed';r.unknowns ||= 'Eligibility, product suitability and permission to contact are unverified.';
 if(!['prospect','partner','channel','insight'].includes(r.type)||!stages.includes(r.status)||!['Low','Medium','High'].includes(r.confidence)||!['Unreviewed','Low','Medium','High'].includes(r.priority)||!['user-entered','live research','demonstration'].includes(r.provenance))throw Error('Invalid record classification');
 r.source=canonical(r.source);if(r.followUp&&!/^\d{4}-\d{2}-\d{2}$/.test(r.followUp))throw Error('Invalid follow-up date');
 r.id=old?.id||randomUUID();r.discoveredAt=old?.discoveredAt||new Date().toISOString();r.updatedAt=new Date().toISOString();r.suppressed=old?.suppressed||input.suppressed===true;
 const identities=keys(r);if(!old&&identities.some(k=>s.suppression.includes(k)))throw Error('This identity is suppressed');
 if(s.records.some(x=>x.id!==r.id&&(normal(x.name)===normal(r.name)||(r.source&&canonical(x.source)===r.source))))throw Error('Duplicate record; update the existing record');
 if(r.suppressed){s.suppression=[...new Set([...s.suppression,...(old?keys(old):[]),...identities])];if(['Contacted','Interested','Application started'].includes(r.status)&&r.status!==old?.status)throw Error('Suppressed records cannot advance outreach');}
 if(old)s.records[s.records.indexOf(old)]=r;else s.records.push(r);return r;
 }),remove:id=>mutate(s=>{const i=s.records.findIndex(r=>r.id===id);if(i<0)throw Error('Record not found');s.records.splice(i,1);return {deleted:true};})};
}
