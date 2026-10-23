import {transpose} from './vendor/matrix.js';
export const MAX_CELLS=100000;
export function validateRows(rows) {
  if (!Array.isArray(rows) || !rows.length || rows.length > MAX_CELLS) throw new Error('A dataset needs 1–100,000 rows.');
  const width=Array.isArray(rows[0])?rows[0].length:0;
  if (!width || width>1000 || width*rows.length>MAX_CELLS) throw new Error('Dataset exceeds the 100,000-cell / 1,000-column safety limit.');
  return rows.map(row => {
    if (!Array.isArray(row) || row.length!==width || row.some(x=>typeof x!=='string' || x.length>10000)) throw new Error('Rows must have equal widths and text cells up to 10,000 characters.');
    return [...row];
  });
}
export function validateOptions(o={}) {
  if (!o || typeof o !== 'object' || Array.isArray(o)) throw new Error('Invalid cleanup options.');
  return {trim:o.trim!==false,empty:o.empty!==false,dedupe:!!o.dedupe,transpose:!!o.transpose,header:o.header!==false,query:typeof o.query==='string'?o.query.slice(0,250):'',columns:Array.isArray(o.columns)?o.columns.filter(x=>Number.isInteger(x)&&x>=0&&x<1000):null};
}
export function transform(raw, options={}) {
  const o=validateOptions(options), cols=o.columns || raw[0].map((_,i)=>i);
  if (!cols.length) throw new Error('Choose at least one column.');
  let rows=raw.map(row=>cols.map(i=>o.trim?(row[i]??'').trim():row[i]??''));
  const head=o.header?rows.shift():null;
  if(o.empty)rows=rows.filter(row=>row.some(Boolean));
  if(o.query)rows=rows.filter(row=>row.some(x=>x.toLocaleLowerCase().includes(o.query.toLocaleLowerCase())));
  if(o.dedupe){const seen=new Set();rows=rows.filter(row=>{const s=JSON.stringify(row);if(seen.has(s))return false;seen.add(s);return true;});}
  if(head)rows.unshift(head);
  return o.transpose?transpose(rows):rows;
}
export function safeCell(value) {return /^[\s\u0000-\u001f]*[=+\-@]/.test(value)||/^[\t\r\n]/.test(value)?"'"+value:value;}
export function exportData(rows,format,header=true) {
  if(!rows.length) return format==='json'?'[]':'';
  if(format==='csv')return '\uFEFF'+rows.map(row=>row.map(s=>'"'+safeCell(s).replaceAll('"','""')+'"').join(',')).join('\r\n');
  if(format==='tsv')return rows.map(row=>row.map(s=>safeCell(s).replace(/[\t\r\n]+/g,' ')).join('\t')).join('\r\n');
  if(format==='md'){
    const esc=s=>s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('\\','\\\\').replaceAll('|','\\|').replace(/([`*_{}\[\]()#!])/g,'\\$1').replace(/[\r\n]+/g,'<br>');
    const list=rows.map(row=>'| '+row.map(esc).join(' | ')+' |');
    if(!header)list.unshift('| '+rows[0].map((_,i)=>`Column ${i+1}`).join(' | ')+' |');
    list.splice(1,0,'| '+rows[0].map(()=>'---').join(' | ')+' |');return list.join('\n');
  }
  if(format==='json') {
    if(!header)return JSON.stringify(rows,null,2);
    const used=new Set(),names=rows[0].map((name,i)=>{let base=name||`Column ${i+1}`,key=base,n=2;while(used.has(key))key=`${base} (${n++})`;used.add(key);return key;});
    return JSON.stringify(rows.slice(1).map(row=>Object.fromEntries(names.map((n,i)=>[n,row[i]??'']))),null,2);
  }
  throw new Error('Choose CSV, TSV, JSON or Markdown.');
}
export function appendRows(a,b,header=true){
  if(a[0].length!==b[0].length)throw new Error('Append needs the same number of columns.');
  const tail=header&&JSON.stringify(a[0])===JSON.stringify(b[0])?b.slice(1):b;
  return validateRows([...a,...tail]);
}
