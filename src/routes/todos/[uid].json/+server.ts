import { deleteTodo, updateTodo } from '$lib/server/todos';
import { json } from '@sveltejs/kit';

export const DELETE = async ({ params }) => {
  const ok = await deleteTodo(params.uid);
  if (!ok) return json({ error: 'Not found' }, { status: 404 });
  return json({ ok: true });
};

export const PATCH = async ({ params, request }) => {
  const data = await request.json();

  const updated = await updateTodo(params.uid, {
    text: typeof data.text === 'string' ? data.text.trim() : undefined,
    done: typeof data.done === 'boolean' ? data.done : undefined,
  });

  if (!updated) return json({ error: 'Not found' }, { status: 404 });
  return json({ todo: updated });
};
