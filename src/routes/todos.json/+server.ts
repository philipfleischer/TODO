import { addTodo, getTodos } from '$lib/server/todos';
import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = () => {
  return json(getTodos(), { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const text = data.get('text');

  if (typeof text !== 'string' || !text.trim()) {
    return json({ error: 'Missing text' }, { status: 400 });
  }

  const todo: Todo = {
    uid: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    text: text.trim(),
    done: false,
  };

  addTodo(todo);
  return json({ ok: true, todo }, { status: 201 });
};
