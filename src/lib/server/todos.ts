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
