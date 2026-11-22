// ครอบทุก /api/* — ถ้าเซิร์ฟเวอร์พัง ให้ตอบเป็น JSON พร้อมสาเหตุ แทนหน้า HTML
export async function onRequest({ next }) {
  try { return await next(); }
  catch (e) {
    return new Response(JSON.stringify({ error: 'เซิร์ฟเวอร์ผิดพลาด: ' + (e && e.message || e) }),
      { status: 500, headers: { 'content-type': 'application/json' } });
  }
}
