import type { PageLoad } from './$types';

export const load = (async ({ fetch }) => {
  const res = await fetch('/todos.json');

  if (!res.ok) {
    return { todos: [] as Todo[] };
  }

  const { todos } = (await res.json()) as { todos: Todo[] };
  return { todos };
}) satisfies PageLoad;
