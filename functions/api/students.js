// GET /api/students — สำหรับครู/แอดมิน ต้องส่ง header: Authorization: Bearer <ADMIN_TOKEN>
export async function onRequestGet({ request, env }) {
  if (request.headers.get('Authorization') !== `Bearer ${env.ADMIN_TOKEN}`)
    return new Response('unauthorized', { status: 401 });
  const { results } = await env.DB.prepare(
    'SELECT student_id,name,classroom,consent_at,created_at FROM students ORDER BY created_at DESC').all();
  return Response.json(results);
}
