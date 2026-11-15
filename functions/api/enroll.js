// POST /api/enroll  — รับเวกเตอร์ใบหน้าจากหน้าเว็บ แล้วบันทึกลง D1
export async function onRequestPost({ request, env }) {
  let b;
  try { b = await request.json(); } catch { return j({ error: 'bad json' }, 400); }
  const { studentId, name, classroom, descriptors, consent } = b;

  if (!consent) return j({ error: 'ต้องได้รับความยินยอมก่อน' }, 400);
  if (!/^[A-Za-z0-9-]{3,20}$/.test(studentId || '')) return j({ error: 'รหัสนักเรียนไม่ถูกต้อง' }, 400);
  if (!name || name.length > 100) return j({ error: 'ชื่อไม่ถูกต้อง' }, 400);
  if (!Array.isArray(descriptors) || descriptors.length < 1 || descriptors.length > 10 ||
      !descriptors.every(d => Array.isArray(d) && d.length === 128 && d.every(Number.isFinite)))
    return j({ error: 'ข้อมูลใบหน้าไม่ถูกต้อง' }, 400);

  await env.DB.prepare(
    `INSERT OR REPLACE INTO students (student_id,name,classroom,descriptors,consent_at)
     VALUES (?,?,?,?,?)`
  ).bind(studentId, name.trim(), (classroom || '').slice(0, 20),
         JSON.stringify(descriptors), new Date().toISOString()).run();

  return j({ ok: true });
}
const j = (o, s = 200) => new Response(JSON.stringify(o), { status: s, headers: { 'content-type': 'application/json' } });
