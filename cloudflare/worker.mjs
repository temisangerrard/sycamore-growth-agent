import {createHash,timingSafeEqual} from 'node:crypto';
import {saveRecord,deleteRecord} from '../prototype/records.mjs';
const json=(data,status=200)=>new Response(JSON.stringify(data),{status,headers:{'content-type':'application/json','cache-control':'no-store','x-content-type-options':'nosniff'}});
function authenticated(req,env){try{const [scheme,encoded]=req.headers.get('authorization').split(' ');if(scheme!=='Basic')return false;const credentials=atob(encoded);const colon=credentials.indexOf(':');if(credentials.slice(0,colon)!=='sycamore')return false;const hash=createHash('sha256').update(credentials.slice(colon+1)).digest('hex');return env.ACCESS_PASSWORD_HASH?.length===64&&timingSafeEqual(Buffer.from(hash),Buffer.from(env.ACCESS_PASSWORD_HASH));}catch{return false;}}
async function readState(db){const row=await db.prepare('SELECT version,document FROM workspace WHERE id=1').first();if(!row)throw Error('Storage not initialized');return {version:row.version,state:JSON.parse(row.document)};}
async function mutate(db,fn){for(let attempt=0;attempt<8;attempt++){const {version,state}=await readState(db);const value=fn(state);const result=await db.prepare('UPDATE workspace SET document=?,version=version+1 WHERE id=1 AND version=?').bind(JSON.stringify(state),version).run();if(result.meta.changes===1)return value;}throw Error('Concurrent update; please try again');}
const quote=value=>'"'+(/^\s*[=+@\-]/.test(String(value??''))?"'":'')+String(value??'').replaceAll('"','""')+'"';
export default {async fetch(req,env){
 if(!authenticated(req,env))return new Response('Sign in to Sycamore research',{status:401,headers:{'www-authenticate':'Basic realm="Sycamore research", charset="UTF-8"','cache-control':'no-store'}});
 const url=new URL(req.url);
 if(!url.pathname.startsWith('/api/')){const res=await env.ASSETS.fetch(req);const headers=new Headers(res.headers);headers.set('cache-control','private, no-store');headers.set('x-content-type-options','nosniff');headers.set('referrer-policy','same-origin');return new Response(res.body,{status:res.status,headers});}
 try{
 if(req.method==='GET'&&url.pathname==='/api/status')return json({hosted:true,storage:'Cloudflare D1',firecrawl:false,research:'Research requires the local Codex connector; saved evidence is available.'});
 if(req.method==='GET'&&url.pathname==='/api/saved-research'){const row=await env.DB.prepare('SELECT document FROM research WHERE id=1').first();return json(row?JSON.parse(row.document):null);}
 if(req.method==='GET'&&url.pathname==='/api/records')return json((await readState(env.DB)).state.records);
 if(req.method==='GET'&&url.pathname==='/api/export.csv'){const records=(await readState(env.DB)).state.records;const columns=['name','type','area','segment','source','evidence','contact','status','confidence','priority','unknowns','next','owner','notes','followUp','provenance','suppressed','discoveredAt'];return new Response('\uFEFF'+[columns.map(quote).join(','),...records.map(r=>columns.map(k=>quote(r[k])).join(','))].join('\r\n'),{headers:{'content-type':'text/csv;charset=utf-8','content-disposition':'attachment; filename="sycamore-pipeline.csv"','cache-control':'no-store'}});}
 if(req.method!=='POST')return json({error:'Not found'},404);
 if(req.headers.get('origin')!==url.origin||!req.headers.get('content-type')?.startsWith('application/json'))return json({error:'Use this workspace to save changes.'},403);
 if(!['/api/records','/api/delete','/api/research','/api/firecrawl'].includes(url.pathname))return json({error:'Not found'},404);
 if(['/api/research','/api/firecrawl'].includes(url.pathname))return json({error:'This hosted version supports pipeline review, drafts and exports. Run new Treg/Exa/Firecrawl research in the local Codex workspace; saved research is available here.'},503);
 if(Number(req.headers.get('content-length'))>160000)return json({error:'Request too large'},413);
 let text='';const reader=req.body?.getReader();if(!reader)return json({error:'Empty request'},400);const decoder=new TextDecoder();let size=0;while(true){const {done,value}=await reader.read();if(done)break;size+=value.byteLength;if(size>160000){await reader.cancel();return json({error:'Request too large'},413);}text+=decoder.decode(value,{stream:true});}text+=decoder.decode();
 let body;try{body=JSON.parse(text);}catch{return json({error:'Invalid JSON'},400);}
 try{return json(await mutate(env.DB,s=>url.pathname==='/api/records'?saveRecord(s,body):deleteRecord(s,body?.id)));}catch(e){if(/Invalid|Unsupported|Duplicate|required|suppressed|Record not found|Use a public|Suppressed/.test(e.message))return json({error:e.message},400);throw e;}
 }catch{return json({error:'Storage request failed. Please try again.'},503);}
}};
