export function contactRows(records,{query='',product=''}={}){
 const order={High:0,Medium:1,Low:2,Unreviewed:3};
 return records.filter(r=>!r.suppressed&&r.provenance!=='demonstration'&&r.name&&r.company&&(r.phone||r.email)&&(!product||r.product===product)&&`${r.name} ${r.company} ${r.role} ${r.product}`.toLowerCase().includes(query.toLowerCase())).sort((a,b)=>(order[a.priority]??3)-(order[b.priority]??3)||a.name.localeCompare(b.name));
}
