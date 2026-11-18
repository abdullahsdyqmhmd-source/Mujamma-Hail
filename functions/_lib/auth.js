const enc = new TextEncoder();
function b64url(bytes) {
  let s = ""; for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function fromB64url(s) {
  s=s.replace(/-/g,"+").replace(/_/g,"/");
  while(s.length%4)s+="=";
  return Uint8Array.from(atob(s),c=>c.charCodeAt(0));
}
async function key(secret) {
  return crypto.subtle.importKey("raw",enc.encode(secret),{name:"HMAC",hash:"SHA-256"},false,["sign","verify"]);
}
export async function makeToken(secret, type, minutes=720) {
  const payload=b64url(enc.encode(JSON.stringify({type,exp:Date.now()+minutes*60000})));
  const sig=new Uint8Array(await crypto.subtle.sign("HMAC",await key(secret),enc.encode(payload)));
  return payload+"."+b64url(sig);
}
export async function checkToken(secret, token, type) {
  if(!secret||!token)return false;
  try {
    const [payload,sig]=token.split(".");
    if(!payload||!sig)return false;
    const ok=await crypto.subtle.verify("HMAC",await key(secret),fromB64url(sig),enc.encode(payload));
    if(!ok)return false;
    const data=JSON.parse(new TextDecoder().decode(fromB64url(payload)));
    return data.type===type && data.exp>Date.now();
  } catch { return false; }
}
export function getCookie(request,name) {
  const raw=request.headers.get("Cookie")||"";
  const part=raw.split(";").map(x=>x.trim()).find(x=>x.startsWith(name+"="));
  return part?decodeURIComponent(part.slice(name.length+1)):"";
}
export function setCookie(name,value,maxAge=43200) {
  return `${name}=${encodeURIComponent(value)}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}
export function clearCookie(name) {
  return `${name}=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0`;
}
export async function hasSite(request,env) {
  return checkToken(env.SESSION_SECRET,getCookie(request,"site_session"),"site");
}
export async function hasDev(request,env) {
  return checkToken(env.SESSION_SECRET,getCookie(request,"dev_session"),"developer");
}