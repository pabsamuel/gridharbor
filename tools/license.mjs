// Never prints private key material. Keep .secrets/ off git, backups and providers.
import {existsSync,mkdirSync,readFileSync,writeFileSync} from 'node:fs';
import {webcrypto as crypto} from 'node:crypto';
const dir=new URL('../.secrets/',import.meta.url),keyFile=new URL('license-signing.jwk',dir);
if(process.argv[2]==='init'){
  if(existsSync(keyFile))throw new Error('Signing key already exists; refusing rotation');
  const keys=await crypto.subtle.generateKey({name:'ECDSA',namedCurve:'P-256'},true,['sign','verify']);
  mkdirSync(dir,{recursive:true});writeFileSync(keyFile,JSON.stringify(await crypto.subtle.exportKey('jwk',keys.privateKey)),{mode:0o600});
  const pub=await crypto.subtle.exportKey('jwk',keys.publicKey);writeFileSync(new URL('../extension/public-key.js',import.meta.url),`export const PUBLIC_KEY = ${JSON.stringify(pub)};\n`);console.log('Public verifier written. Private signer kept only in ignored .secrets/.');
}else if(process.argv[2]==='issue'){
  const [order,plan,expires]=process.argv.slice(3);
  if(!/^txn_[a-zA-Z0-9]+$/.test(order||'')||!['lifetime','monthly'].includes(plan))throw new Error('Usage: issue txn_VERIFIEDORDER lifetime | issue txn_VERIFIEDORDER monthly ISO_EXPIRY');
  const exp=plan==='monthly'?Date.parse(expires):null;if(plan==='monthly'&&(!Number.isFinite(exp)||exp<=Date.now()))throw new Error('Monthly license needs a future expiry');
  const payload={product:'c01',order,plan,issued:Date.now(),expires:exp};
  const body=Buffer.from(JSON.stringify(payload)).toString('base64url'),text=`C01.${body}`;
  const key=await crypto.subtle.importKey('jwk',JSON.parse(readFileSync(keyFile,'utf8')),{name:'ECDSA',namedCurve:'P-256'},false,['sign']);
  const sig=await crypto.subtle.sign({name:'ECDSA',hash:'SHA-256'},key,new TextEncoder().encode(text));
  // Key is only written to a supplied local file, never stdout.
  const out=process.env.C01_LICENSE_OUTPUT;if(!out)throw new Error('Set C01_LICENSE_OUTPUT to a local .key path');
  writeFileSync(out,`${text}.${Buffer.from(sig).toString('base64url')}`,{mode:0o600});console.log('Signed license saved locally.');
}else throw new Error('Choose init or issue');

