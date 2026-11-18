import {hasSite,hasDev} from "../_lib/auth.js";
export async function onRequestPost({request,env}) {
  if(!(await hasSite(request,env))) return Response.json({error:"سجّل دخول المنصة أولاً."},{status:401});
  if(!(await hasDev(request,env))) return Response.json({error:"افتح قسم المطور أولاً لاستخدام خدمة الذكاء الاصطناعي."},{status:403});
  if(!env.OPENAI_API_KEY) return Response.json({error:"خدمة الذكاء الاصطناعي غير مفعّلة بعد. يحتاج مدير المنصة إضافة OPENAI_API_KEY في Cloudflare."},{status:503});
  let body={};try{body=await request.json()}catch{}
  const prompt=typeof body.prompt==="string"?body.prompt.trim():"";
  if(!prompt || prompt.length>12000) return Response.json({error:"اكتب سؤالاً لا يتجاوز 12000 حرف."},{status:400});
  const model=env.OPENAI_MODEL||"gpt-4.1-mini";
  const upstream=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Authorization":`Bearer ${env.OPENAI_API_KEY}`,"Content-Type":"application/json"},body:JSON.stringify({model,input:[{role:"system",content:"أنت معلم عربي واضح ومبسّط. اشرح للطالب خطوة بخطوة، واذكر إن لم تكن متأكداً."},{role:"user",content:prompt}]})});
  const data=await upstream.json().catch(()=>({}));
  if(!upstream.ok) return Response.json({error:"تعذر الاتصال بخدمة الذكاء الاصطناعي. راجع إعدادات المفتاح أو رصيد الحساب."},{status:502});
  const answer=(data.output||[]).flatMap(x=>x.content||[]).filter(x=>x.type==="output_text").map(x=>x.text).join("\n")||"لم يصل رد نصي.";
  return Response.json({answer},{headers:{"Cache-Control":"no-store"}});
}