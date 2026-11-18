import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
const mod = await import('./store.mjs').catch(() => ({}));
const input = {name:'Example network',type:'partner',source:'https://example.org/contact',evidence:'Public organisation contact page',contact:'https://example.org/contact',provenance:'user-entered'};
async function fresh(){ assert.equal(typeof mod.openStore,'function','persistent store must exist'); return mod.openStore(join(await mkdtemp(join(tmpdir(),'sikamo-test-')),'records.json')); }
test('records persist across restart and canonical source prevents duplicates',async()=>{const s=await fresh(); const r=await s.save(input); assert.ok(r.id); const again=await mod.openStore(s.path); assert.equal((await again.list()).length,1); await assert.rejects(()=>again.save({...input,name:'Other',source:input.source+'/'}),/Duplicate/);});
test('concurrent creates are retained',async()=>{const s=await fresh(); await Promise.all(Array.from({length:8},(_,i)=>s.save({...input,name:'Network '+i,source:'https://example.org/'+i}))); assert.equal((await s.list()).length,8);});
test('suppression survives deletion and prevents reimport',async()=>{const s=await fresh(); const r=await s.save(input); await s.save({...r,suppressed:true}); await s.remove(r.id); assert.equal((await s.list()).length,0); await assert.rejects(()=>s.save(input),/suppressed/);});
test('validation rejects bad source, enums and sensitive document fields',async()=>{const s=await fresh(); for(const change of [{source:'javascript:alert(1)'},{type:'qualified borrower'},{passport:'123'},{status:'Approved'}]) await assert.rejects(()=>s.save({...input,...change}));});
test('updates retain identity and evidence dates',async()=>{const s=await fresh(); const r=await s.save(input); const u=await s.save({...r,status:'Reviewed',priority:'High',confidence:'Low'}); assert.equal(u.id,r.id); assert.equal(u.discoveredAt,r.discoveredAt); assert.equal(u.status,'Reviewed');});
