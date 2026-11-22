// POST /api/checkin {descriptor:[128]} — เทียบใบหน้าฝั่งเซิร์ฟเวอร์ แล้วบันทึกเช็คชื่อวันละครั้ง
export async function onRequestPost({ request, env }) {
  let b; try { b = await request.json(); } catch { return j({ error: 'bad json' }, 400); }
  const q = b.descriptor;
  if (!Array.isArray(q) || q.length !== 128 || !q.every(Number.isFinite)) return j({ error: 'ข้อมูลไม่ถูกต้อง' }, 400);
  const { results } = await env.DB.prepare('SELECT student_id,name,classroom,descriptors FROM students').all();
  let best = null, bd = 9;
  for (const s of results) for (const d of JSON.parse(s.descriptors)) {
    let t = 0; for (let i = 0; i < 128; i++) { const x = q[i] - d[i]; t += x * x; }
    t = Math.sqrt(t); if (t < bd) { bd = t; best = s; }
  }
  if (!best || bd > 0.5) return j({ match: false });   // ปรับความเข้มงวดที่ 0.5 (ยิ่งน้อยยิ่งเข้ม)
  const now = new Date(), day = new Date(now.getTime() + 7 * 3600e3).toISOString().slice(0, 10); // เวลาไทย
  const r = await env.DB.prepare('INSERT OR IGNORE INTO attendance (student_id,day,checked_at) VALUES (?,?,?)')
    .bind(best.student_id, day, now.toISOString()).run();
  return j({ match: true, name: best.name, studentId: best.student_id, classroom: best.classroom, already: r.meta.changes === 0 });
}
const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });
