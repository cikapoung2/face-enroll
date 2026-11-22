// GET ?day=YYYY-MM-DD — รายการเช็คชื่อของวันนั้น (ผู้ดูแลเท่านั้น)
export async function onRequestGet({ request, env }) {
  if (!env.ADMIN_TOKEN || request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`)
    return new Response('unauthorized', { status: 401 });
  const day = new URL(request.url).searchParams.get('day') || '';
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) return Response.json({ error: 'bad day' }, { status: 400 });
  const { results } = await env.DB.prepare(
    `SELECT a.student_id,s.name,s.classroom,a.checked_at FROM attendance a
     LEFT JOIN students s ON s.student_id=a.student_id WHERE a.day=? ORDER BY a.checked_at`).bind(day).all();
  return Response.json(results);
}
