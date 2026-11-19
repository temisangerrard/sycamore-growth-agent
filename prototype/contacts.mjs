export function contactRows(records,{query='',product='',segment=''}={}){
 const order={High:0,Medium:1,Low:2,Unreviewed:3};
 return records.filter(r=>!r.suppressed&&r.type!=='insight'&&r.provenance!=='demonstration'&&r.name&&((r.company&&(r.phone||r.email))||(r.type==='prospect'&&/^https:\/\/(?:www\.)?(?:x\.com|linkedin\.com)\//i.test(r.contact||'')))&&(!product||r.product===product)&&(!segment||(r.segment||'').startsWith(segment))&&`${r.name} ${r.company} ${r.role} ${r.product} ${r.segment} ${r.contact}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>(order[a.priority]??3)-(order[b.priority]??3)||a.name.localeCompare(b.name));
}
export function contactCsv(records,filters={}){
 const columns=['name','role','company','area','product','segment','contact','phone','email','source','relevance','next','draft','priority','status','unknowns','checkedAt'];
 const quote=value=>'"'+(/^\s*[=+@\-]/.test(String(value??''))?"'":'')+String(value??'').replaceAll('"','""')+'"';
 return '\uFEFF'+[columns.map(quote).join(','),...contactRows(records,filters).map(r=>columns.map(k=>quote(r[k])).join(','))].join('\r\n');
}
