import {makeToken,setCookie} from "../_lib/auth.js";
export async function onRequestPost({request,env}) {
  if(!env.SITE_PASSWORD || !env.SESSION_SECRET) return Response.json({error:"إعدادات الدخول غير مكتملة لدى مدير المنصة."},{status:503});
  let body={}; try{body=await request.json()}catch{}
  if(typeof body.password!=="string" || body.password!==env.SITE_PASSWORD) return Response.json({error:"رمز الدخول غير صحيح."},{status:401});
  const token=await makeToken(env.SESSION_SECRET,"site",720);
  return Response.json({ok:true},{headers:{"Set-Cookie":setCookie("site_session",token,43200),"Cache-Control":"no-store"}});
}