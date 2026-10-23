import {licensed} from './license.js';
import {validateRows,validateOptions,appendRows} from './core.js';
export const EMPTY=()=>({captures:[],recipes:[],token:''});
let queue=Promise.resolve();
export function serial(fn){const p=queue.then(fn);queue=p.catch(()=>{});return p;}
async function load(){return (await chrome.storage.local.get('state')).state||EMPTY();}
export async function storeCaptures(captures){return serial(async()=>{
  const s=await load();
  const incoming=captures.map(c=>({id:crypto.randomUUID(),label:String(c.label||'Captured table').slice(0,120),rows:validateRows(c.rows),warnings:Array.isArray(c.warnings)?c.warnings.map(String).slice(0,10):[]}));
  if(incoming.length>100||incoming.reduce((n,c)=>n+c.rows.length*c.rows[0].length,0)>100000)throw new Error('Workspace exceeds the 100,000-cell / 100-table safety limit.');
  // Keep one page at a time; replacing requires the user's explicit toolbar action.
  const combined=[...s.captures,...incoming];if(combined.length>100||combined.reduce((n,c)=>n+c.rows.length*c.rows[0].length,0)>100000)throw new Error('Workspace exceeds the 100,000-cell / 100-table safety limit. Back up and clear first.');s.captures=combined;await chrome.storage.local.set({state:s});return incoming;
});}
export async function dispatch(m,sender){
  if(sender?.id!==chrome.runtime.id||sender.url?.split('?')[0]!==chrome.runtime.getURL('workbench.html'))throw new Error('Only the GridHarbor workbench can manage local data.');
  return serial(async()=>{
    const s=await load(),pro=await licensed(s.token);
    if(m.op==='state')return {...s,token:undefined,pro};
    if(m.op==='capture'){
      if(!Number.isInteger(m.tabId)||m.tabId<=0)throw new Error('Open GridHarbor from the source page toolbar first.');
      const tab=await chrome.tabs.get(m.tabId);
      if(!/^https?:\/\//.test(tab.url||'')||/^https?:\/\/(chromewebstore\.google\.com|chrome\.google\.com)\//.test(tab.url))throw new Error('This page cannot be captured. Open a normal HTTP(S) page.');
      await chrome.scripting.executeScript({target:{tabId:m.tabId},files:['collector.js']});
      const [{result}]=await chrome.scripting.executeScript({target:{tabId:m.tabId},func:selector=>window.GHCollect({selector}),args:[m.selector||'']});
      const incoming=result.map(c=>({...c,id:crypto.randomUUID(),rows:validateRows(c.rows)}));
      const captures=m.keep?[...s.captures,...incoming]:incoming;
      if(captures.length>100||captures.reduce((n,c)=>n+c.rows.length*c.rows[0].length,0)>100000)throw new Error('Workspace exceeds the 100,000-cell / 100-table safety limit. Back up and clear first.');
      s.captures=captures;
    }else if(m.op==='view'){s.view={selected:String(m.selected||''),options:validateOptions(m.options)};}
    else if(m.op==='activate'){if(!await licensed(m.token))throw new Error('License is invalid, expired or belongs to another product.');s.token=m.token;}
    else if(m.op==='recipe'){
      const name=String(m.name||'').trim().slice(0,80);if(!name)throw new Error('Name the cleanup recipe.');
      if(!pro&&s.recipes.length>=3)throw new Error('Free includes 3 recipes. Delete one to save another, or activate Pro.');
      s.recipes.push({id:crypto.randomUUID(),name,options:validateOptions(m.options)});
    }else if(m.op==='deleteRecipe'){s.recipes=s.recipes.filter(r=>r.id!==m.id);}
    else if(m.op==='batch'){if(!pro)throw new Error('Batch export requires Pro. Single-table exports remain free.');return s.captures;}
    else if(m.op==='restore'){
      if(!m.backup||m.backup.product!=='gridharbor'||m.backup.version!==1||!Array.isArray(m.backup.captures)||m.backup.captures.length>100)throw new Error('Choose a GridHarbor version 1 JSON backup.');
      let cells=0;
      const incoming=m.backup.captures.map(c=>{const rows=validateRows(c.rows);cells+=rows.length*rows[0].length;return {id:crypto.randomUUID(),label:String(c.label||'Imported table').slice(0,120),rows,warnings:[]};});
      if(cells>100000)throw new Error('Backup exceeds the 100,000-cell safety limit.');
      s.captures=incoming;
    }else if(m.op==='append'){
      const a=s.captures.find(c=>c.id===m.target),b=s.captures.find(c=>c.id===m.source);
      if(!a||!b||a.id===b.id)throw new Error('Choose two different tables to append.');
      const rows=appendRows(a.rows,b.rows,m.header!==false);
      s.captures.push({id:crypto.randomUUID(),label:(a.label+' + appended').slice(0,120),rows,warnings:[]});
      if(s.captures.length>100||s.captures.reduce((n,c)=>n+c.rows.length*c.rows[0].length,0)>100000)throw new Error('Workspace exceeds the 100,000-cell / 100-table safety limit. Back up and clear first.');
    }else if(m.op==='clear'){await chrome.storage.local.remove('state');return {cleared:true};}
    else throw new Error('Unknown action.');
    await chrome.storage.local.set({state:s});return {ok:true};
  });
}
