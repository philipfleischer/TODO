import { prisma } from '$lib/server/prisma';
import type { Todo } from '@prisma/client';

export async function getTodos(): Promise<Todo[]> {
  return prisma.todo.findMany({
    orderBy: { created_at: 'desc' },
  });
}

export async function addTodo(text: string): Promise<Todo> {
  return prisma.todo.create({
    data: {
      text,
    },
  });
}

export async function deleteTodo(uid: string): Promise<boolean> {
  const res = await prisma.todo.deleteMany({
    where: { uid },
  });

  return res.count === 1;
}

export async function updateTodo(
  uid: string,
  updates: Partial<Pick<Todo, 'text' | 'done'>>,
): Promise<Todo | null> {
  try {
    return await prisma.todo.update({
      where: { uid },
      data: updates,
    });
  } catch {
    return null;
  }
}
