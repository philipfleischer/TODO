import { deleteTodo, updateTodo } from '$lib/server/todos';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = ({ params }) => {
  const ok = deleteTodo(params.uid);
  if (!ok) return json({ error: 'Not found' }, { status: 404 });
  return json({ ok: true }, { status: 200 });
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  const data = await request.json();

  const updated = updateTodo(params.uid, data);
  if (!updated) {
    return json({ error: 'Not found' }, { status: 404 });
  }

  return json({ ok: true, todo: updated }, { status: 200 });
};
