import {clearCookie,hasSite} from "../_lib/auth.js";
export async function onRequestPost({request,env}) {
  if(!(await hasSite(request,env))) return Response.json({error:"انتهت جلسة المنصة."},{status:401});
  return Response.json({ok:true},{headers:{"Set-Cookie":clearCookie("dev_session")}});
}