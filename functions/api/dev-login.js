import {makeToken,setCookie,hasSite} from "../_lib/auth.js";
export async function onRequestPost({request,env}) {
  if(!(await hasSite(request,env))) return Response.json({error:"سجّل دخول المنصة أولاً."},{status:401});
  if(!env.DEVELOPER_PASSWORD || !env.SESSION_SECRET) return Response.json({error:"إعدادات المطور غير مكتملة."},{status:503});
  let body={}; try{body=await request.json()}catch{}
  if(typeof body.password!=="string" || body.password!==env.DEVELOPER_PASSWORD) return Response.json({error:"كلمة مرور المطور غير صحيحة."},{status:401});
  const token=await makeToken(env.SESSION_SECRET,"developer",120);
  return Response.json({ok:true},{headers:{"Set-Cookie":setCookie("dev_session",token,7200),"Cache-Control":"no-store"}});
}