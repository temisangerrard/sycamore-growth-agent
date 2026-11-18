import {test} from 'node:test';import assert from 'node:assert/strict';
const worker=(await import('./worker.mjs').catch(()=>({}))).default;
test('hosted assets and records open without a password',async()=>{const env={ASSETS:{fetch:()=>new Response('dashboard')},DB:{prepare:()=>({first:async()=>({version:0,document:JSON.stringify({records:[],suppression:[]})})})}};for(const path of ['/','/app.js','/api/records']){const r=await worker.fetch(new Request('https://example.org'+path),env);assert.equal(r.status,200);assert.equal(r.headers.get('www-authenticate'),null);}});
test('visitors can access assets but hosted CLI research is explicit',async()=>{assert.ok(worker);const headers={};const env={ASSETS:{fetch:()=>new Response('dashboard')}};assert.equal(await (await worker.fetch(new Request('https://example.org/',{headers}),env)).text(),'dashboard');const r=await worker.fetch(new Request('https://example.org/api/research',{method:'POST',headers:{...headers,origin:'https://example.org','content-type':'application/json'},body:'{}'}),env);assert.equal(r.status,503);});
test('cross-origin mutations are rejected',async()=>{assert.ok(worker);const r=await worker.fetch(new Request('https://example.org/api/records',{method:'POST',headers:{origin:'https://evil.example','content-type':'application/json'},body:'{}'}),{});assert.equal(r.status,403);});
test('hosted records persist through the D1 adapter and suppression survives deletion',async()=>{
 let state={records:[],suppression:[]},version=0;
 const db={prepare(sql){let args=[];return {bind(...values){args=values;return this;},async first(){return {version,document:JSON.stringify(state)};},async run(){if(args[1]!==version)return {meta:{changes:0}};state=JSON.parse(args[0]);version++;return {meta:{changes:1}};}};}};
 const env={DB:db};const headers={origin:'https://example.org','content-type':'application/json'};
 const post=(path,body)=>worker.fetch(new Request('https://example.org'+path,{method:'POST',headers,body:JSON.stringify(body)}),env);
 const create=await post('/api/records',{name:'Hosted test channel',source:'https://example.org/channel',type:'channel'});assert.equal(create.status,200);const row=await create.json();assert.equal((await (await worker.fetch(new Request('https://example.org/api/records',{headers}),env)).json()).length,1);
 assert.equal((await post('/api/records',{...row,suppressed:true})).status,200);assert.equal((await post('/api/delete',{id:row.id})).status,200);assert.equal((await post('/api/records',{name:row.name})).status,400);assert.equal(state.records.length,0);
});
