let todos: Todo[] = [];

export function getTodos() {
  return todos;
}

export function addTodo(todo: Todo) {
  todos = [todo, ...todos];
  return todo;
}

export function deleteTodo(uid: string) {
  const before = todos.length;
  todos = todos.filter((t) => t.uid !== uid);
  return todos.length !== before;
}

export function updateTodo(uid: string, updates: Partial<Pick<Todo, 'text' | 'done'>>) {
  const idx = todos.findIndex((t) => t.uid === uid);
  if (idx === -1) return null;

  todos[idx] = { ...todos[idx], ...updates };
  return todos[idx];
}
