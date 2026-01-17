import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// TODO: Persist in database
let todos: Todo[] = [];

export const GET: RequestHandler = async () => {
  return json(todos, { status: 200 });
};

export const POST: RequestHandler = async ({ request }) => {
  const data = await request.formData();
  const text = data.get('text');

  if (typeof text !== 'string' || !text.trim()) {
    return json({ error: 'Missing text' }, { status: 400 });
  }

  //Want to get more information in, like datetime
  //There is an error here, expected ")" but found "(" on randomUUID()
  const todo: Todo = {
    uid: crypto.randomUUID(),
    created_at: new Date().toISOString(),
    text: text.trim(),
    done: false,
  };

  todos = [todo, ...todos];

  // Best practice for API: return 201 + created object
  return json({ ok: true, todo }, { status: 201 });
};
