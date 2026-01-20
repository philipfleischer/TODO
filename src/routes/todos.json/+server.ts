import { addTodo, getTodos } from '$lib/server/todos';
import { json } from '@sveltejs/kit';

export const GET = async () => {
  const todos = await getTodos();
  return json({ todos });
};

export const POST = async ({ request }) => {
  const data = await request.formData();
  const text = data.get('text');

  if (typeof text !== 'string' || !text.trim()) {
    return json({ error: 'Missing text' }, { status: 400 });
  }

  const todo = await addTodo(text.trim());
  return json({ todo }, { status: 201 });
};
