import {test} from 'node:test';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {mkdtemp} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
test('HTTP records, origin checks, restart persistence and suppression',{timeout:20000},async()=>{
 const dir=await mkdtemp(join(tmpdir(),'sikamo-http-'));const port=14317;const root='http://127.0.0.1:'+port;let child;
 async function start(){child=spawn(process.execPath,['server.mjs'],{cwd:new URL('.',import.meta.url),env:{...process.env,SYCAMORE_PORT:String(port),SYCAMORE_DATA:join(dir,'records.json')},stdio:['ignore','pipe','pipe']});await new Promise((resolve,reject)=>{child.stdout.once('data',resolve);child.once('error',reject);child.once('exit',code=>reject(Error('Server exited '+code)));});}
 async function stop(){if(child&&!child.killed){const closed=new Promise(r=>child.once('exit',r));child.kill();await closed;}}
 const post=(path,body,origin=root)=>fetch(root+path,{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(body)});
 try{await start();assert.equal((await fetch(root+'/')).status,200);assert.equal((await post('/api/records',{name:'Bad'},'https://evil.example')).status,403);let response=await post('/api/records',{name:'HTTP example',source:'https://example.org',type:'channel'});assert.equal(response.status,200);const record=await response.json();const exported=await fetch(root+'/api/export.csv');assert.equal(exported.status,200);assert.match(await exported.text(),/HTTP example/);assert.equal((await post('/api/records',{name:'HTTP example'})).status,400);await stop();await start();let rows=await fetch(root+'/api/records').then(r=>r.json());assert.equal(rows[0].id,record.id);response=await post('/api/records',{...record,suppressed:true});assert.equal(response.status,200);assert.equal((await post('/api/delete',{id:record.id})).status,200);assert.equal((await post('/api/records',{name:'HTTP example'})).status,400);assert.deepEqual(await fetch(root+'/api/records').then(r=>r.json()),[]);}finally{await stop();}
});
