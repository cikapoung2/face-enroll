// POST /api/login {password} — ตรวจรหัสผ่านผู้ดูแล (ค่า ADMIN_TOKEN ที่ตั้งใน Cloudflare)
export async function onRequestPost({ request, env }) {
  let b = {}; try { b = await request.json(); } catch {}
  if (!env.ADMIN_TOKEN) return j({ error: 'ยังไม่ได้ตั้งค่า ADMIN_TOKEN ใน Cloudflare' }, 500);
  if (b.password !== env.ADMIN_TOKEN) { await new Promise(r => setTimeout(r, 800)); return j({ error: 'รหัสผ่านไม่ถูกต้อง' }, 401); }
  return j({ ok: true });
}
const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });
