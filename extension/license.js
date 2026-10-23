import {PUBLIC_KEY} from './public-key.js';
const decode=s=>Uint8Array.from(atob(s.replace(/-/g,'+').replace(/_/g,'/')),c=>c.charCodeAt(0));
export async function licensed(token,jwk=PUBLIC_KEY,now=Date.now()){
  try{
    const m=/^C01\.([A-Za-z0-9_-]{10,1200})\.([A-Za-z0-9_-]{86})$/.exec(token||'');if(!m)return false;
    const p=JSON.parse(new TextDecoder().decode(decode(m[1])));
    if(p.product!=='c01'||!['lifetime','monthly'].includes(p.plan)||typeof p.order!=='string'||!/^txn_[a-zA-Z0-9]{1,100}$/.test(p.order)||Object.keys(p).sort().join(',')!=='expires,issued,order,plan,product'||!Number.isFinite(p.issued)||p.issued<0||p.issued>now||!(p.plan==='lifetime'?p.expires===null:Number.isFinite(p.expires)&&p.expires>now&&p.expires>p.issued))return false;
    const key=await crypto.subtle.importKey('jwk',jwk,{name:'ECDSA',namedCurve:'P-256'},false,['verify']);
    return await crypto.subtle.verify({name:'ECDSA',hash:'SHA-256'},key,decode(m[2]),new TextEncoder().encode(`C01.${m[1]}`));
  }catch{return false;}
}

