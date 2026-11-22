// GET รายชื่อ / DELETE ?id=รหัส — ต้องส่ง Authorization: Bearer <ADMIN_TOKEN>
const ok = (r, e) => e.ADMIN_TOKEN && r.headers.get('Authorization') === `Bearer ${e.ADMIN_TOKEN}`;
export async function onRequestGet({ request, env }) {
  if (!ok(request, env)) return new Response('unauthorized', { status: 401 });
  const { results } = await env.DB.prepare(
    'SELECT student_id,name,classroom,consent_at,created_at FROM students ORDER BY classroom,student_id').all();
  return Response.json(results);
}
export async function onRequestDelete({ request, env }) {
  if (!ok(request, env)) return new Response('unauthorized', { status: 401 });
  const id = new URL(request.url).searchParams.get('id');
  if (!id) return Response.json({ error: 'missing id' }, { status: 400 });
  await env.DB.batch([
    env.DB.prepare('DELETE FROM attendance WHERE student_id=?').bind(id),
    env.DB.prepare('DELETE FROM students WHERE student_id=?').bind(id)]);
  return Response.json({ ok: true });
}
