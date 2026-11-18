import {hasSite} from "./_lib/auth.js";
export async function onRequest(context) {
  const url=new URL(context.request.url);
  if(url.pathname==="/api/login") return context.next();
  if(url.pathname.startsWith("/api/") && !(await hasSite(context.request,context.env))) {
    return Response.json({error:"يلزم تسجيل الدخول إلى المنصة."},{status:401,headers:{"Cache-Control":"no-store"}});
  }
  return context.next();
}