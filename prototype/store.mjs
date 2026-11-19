import {readFile,writeFile,rename,mkdir} from 'node:fs/promises';
import {dirname} from 'node:path';
import {saveRecord,deleteRecord} from './records.mjs';
export {stages} from './records.mjs';
export async function openStore(path){
 await mkdir(dirname(path),{recursive:true}); let state={records:[],suppression:[]};
 try{state=JSON.parse(await readFile(path,'utf8')); if(!Array.isArray(state.records)||!Array.isArray(state.suppression))throw Error('Invalid storage format');}catch(e){if(e.code!=='ENOENT')throw e;}
 let queue=Promise.resolve();
 const mutate=fn=>{const task=queue.then(async()=>{const next=structuredClone(state);const result=fn(next);await writeFile(path+'.tmp',JSON.stringify(next,null,2),{mode:0o600});await rename(path+'.tmp',path);state=next;return structuredClone(result);});queue=task.catch(()=>{});return task;};
 return {path,list:async()=>{await queue;return structuredClone(state.records);},save:input=>mutate(s=>saveRecord(s,input)),remove:id=>mutate(s=>deleteRecord(s,id))};
}
