# مجمع هائل

منصة تعليمية متكاملة.
المطور: صديق محمد الحيدري

## بنية المشروع
- `public/`: ملفات الموقع الثابتة.
- `functions/`: Cloudflare Pages Functions للمصادقة وواجهة الذكاء الاصطناعي.
- `functions/_middleware.js`: يتحقق من جلسة دخول المنصة لطلبات API.
- `functions/api/`: واجهات تسجيل الدخول والمساعد الذكي.

## النشر على Cloudflare Pages عبر GitHub
1. ارفع محتويات هذا المجلد إلى جذر مستودع GitHub.
2. اختر Connect to Git ثم المستودع `Mujamma-Hail`.
3. اترك Build command فارغاً، واجعل Build output directory هو `public`.
4. أضف الأسرار في Cloudflare:
   - `SITE_PASSWORD`
   - `DEVELOPER_PASSWORD`
   - `SESSION_SECRET`
   - `OPENAI_API_KEY` اختياري.
   - `OPENAI_MODEL` اختياري، والافتراضي `gpt-4.1-mini`.
5. أعد النشر بعد ضبط الأسرار.

## تنبيهات
- لا تضع كلمات المرور أو مفاتيح API داخل GitHub أو ملفات HTML.
- استخدم Git integration أو Wrangler لتشغيل Pages Functions.
- قسم المطور محمي بجلسة موقعة على الخادم.
- هذه نسخة تأسيسية تحتاج استكمال المناهج وقاعدة البيانات وتحليل الصور وأدوات الإدارة المتقدمة.
- دفتر الملاحظات يحفظ على الجهاز والمتصفح فقط.
- تحديث إعدادات النشر
تحديث كلمة مرور الدخول
