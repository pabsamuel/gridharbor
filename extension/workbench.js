import {transform,exportData} from './core.js';
const $=id=>document.getElementById(id), names=['trim','empty','dedupe','transpose','header'];
let state={captures:[],recipes:[]}, selected='',options={}, columns=null,initialized=false,persistTimer;
const say=(text,error=false)=>{$('status').textContent=text;$('status').classList.toggle('error',error);};
const action=async(op,data={})=>{const r=await chrome.runtime.sendMessage({op,...data});if(!r.ok)throw new Error(r.error);return r.value;};
const current=()=>state.captures.find(c=>c.id===selected);
function readOptions(){return {...Object.fromEntries(names.map(n=>[n,$(n).checked])),query:$('query').value,columns};}
function output(){return transform(current().rows,readOptions());}
async function load(){state=await action('state');if(!initialized){initialized=true;if(state.view){selected=state.view.selected;names.forEach(n=>$(n).checked=state.view.options[n]);$('query').value=state.view.options.query;columns=state.view.options.columns;}}if(!current()){selected=state.captures[0]?.id||'';columns=null;}render();}
function render(){
 $('tabs').replaceChildren();state.captures.forEach(c=>{const b=document.createElement('button');b.textContent=`${c.label} (${c.rows.length} rows)`;b.setAttribute('aria-pressed',String(c.id===selected));b.onclick=()=>{selected=c.id;columns=null;render();};$('tabs').append(b);});
 const c=current();$('emptyState').hidden=!!c;$('workspace').hidden=!c;$('summary').textContent=`${state.captures.length} tables saved locally`;
 $('plan').textContent=state.pro?'Pro active on this device. More recipes and batch CSV unlocked.':'Pro is planned at $19 lifetime: more recipes and batch CSV. Sales setup pending.';
 $('recipes').replaceChildren();state.recipes.forEach(r=>{const row=document.createElement('div'),apply=document.createElement('button'),del=document.createElement('button');apply.textContent=r.name;apply.className='quiet';apply.onclick=()=>{names.forEach(n=>$(n).checked=r.options[n]);$('query').value=r.options.query;columns=r.options.columns;render();say(`Applied recipe: ${r.name}`);};del.textContent='Delete';del.className='quiet';del.setAttribute('aria-label',`Delete recipe ${r.name}`);del.onclick=()=>run(async()=>{await action('deleteRecipe',{id:r.id});await load();});row.append(apply,del);$('recipes').append(row);});
 if(!c)return;
 $('appendSource').replaceChildren();state.captures.filter(x=>x.id!==selected).forEach(x=>{const o=document.createElement('option');o.value=x.id;o.textContent=x.label;$('appendSource').append(o);});
 $('columns').replaceChildren();c.rows[0].forEach((name,i)=>{const l=document.createElement('label');l.className='check';const cb=document.createElement('input');cb.type='checkbox';cb.checked=columns===null||columns.includes(i);cb.onchange=()=>{columns=[...$('columns').querySelectorAll('input')].flatMap((b,n)=>b.checked?[n]:[]);preview();};l.append(cb,document.createTextNode(name||`Column ${i+1}`));$('columns').append(l);});preview();
}
function preview(){try{const rows=output();clearTimeout(persistTimer);persistTimer=setTimeout(()=>run(()=>action('view',{selected,options:readOptions()})),200);$('preview').replaceChildren();rows.slice(0,101).forEach((r,i)=>{const tr=document.createElement('tr');r.forEach(v=>{const cell=document.createElement(i===0&&$('header').checked?'th':'td');cell.textContent=v;tr.append(cell);});$('preview').append(tr);});$('previewNote').textContent=`Preview: ${Math.min(rows.length,101)} of ${rows.length} rows · ${rows[0]?.length||0} columns. Export includes every matching row. Original capture is preserved. ${current().warnings?.join(' ')||''}`;}catch(e){say(e.message,true);}}
function save(text,name,type='text/plain'){const url=URL.createObjectURL(new Blob([text],{type})),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
async function run(fn){try{await fn();}catch(e){say(e.message,true);}}
names.forEach(n=>$(n).onchange=preview);$('query').oninput=preview;
$('reset').onclick=()=>{names.forEach(n=>$(n).checked=['trim','empty','header'].includes(n));$('query').value='';columns=null;render();say('Cleanup reset. Original capture restored.');};
$('download').onclick=()=>run(async()=>{if(!current())throw new Error('Capture or restore a table first.');const f=$('format').value;save(exportData(output(),f,$('header').checked),`gridharbor.${f}`);say('Export downloaded. All matching rows included.');});
$('copy').onclick=()=>run(async()=>{await navigator.clipboard.writeText(exportData(output(),$('format').value,$('header').checked));say('Copied export.');});
$('backup').onclick=()=>save(JSON.stringify({product:'gridharbor',version:1,captures:state.captures},null,2),'gridharbor-backup.json','application/json');
$('restore').onchange=()=>run(async()=>{const file=$('restore').files[0];if(!file)return;if(file.size>12_000_000)throw new Error('Backup is too large (12 MB maximum).');await action('restore',{backup:JSON.parse(await file.text())});columns=null;await load();say('Backup restored locally.');});
$('capture').onclick=()=>run(async()=>{await action('capture',{tabId:Number(new URLSearchParams(location.search).get('source')),selector:$('selector').value,keep:$('keep').checked});await load();say('Source page captured.');});
$('append').onclick=()=>run(async()=>{await action('append',{target:selected,source:$('appendSource').value,header:$('header').checked});await load();selected=state.captures.at(-1)?.id;columns=null;render();say('Rows appended into a new table. Both source tables preserved.');});
$('saveRecipe').onclick=()=>run(async()=>{await action('recipe',{name:$('recipeName').value,options:readOptions()});await load();say('Recipe saved locally.');});
$('activate').onclick=()=>run(async()=>{await action('activate',{token:$('license').value.trim()});$('license').value='';await load();say('Pro license activated offline.');});
$('batch').onclick=()=>run(async()=>{const tables=await action('batch');for(const [i,c] of tables.entries())save(exportData(transform(c.rows,readOptions()),'csv',$('header').checked),`gridharbor-table-${i+1}.csv`);say('Batch files requested. Your browser may ask to allow multiple downloads.');});
$('clear').onclick=()=>run(async()=>{if(!confirm('Delete all captures, recipes and the saved license on this device? Back up first.'))return;await action('clear');selected='';columns=null;await load();say('Local workspace deleted.');});
await run(load);const error=new URLSearchParams(location.search).get('error');if(error)say(error,true);
