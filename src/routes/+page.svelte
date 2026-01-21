<script lang="ts">
  import { browser } from '$app/environment';
  import TodoItem from '$lib/todo-item.svelte';
  import { tick } from 'svelte';
  import type { PageData } from './$types';
  export let data: PageData;

  const title = 'Todo';
  let text = '';
  let todos = data.todos;
  type Filter = 'all' | 'active' | 'done';
  let filter: Filter = 'all';

  if (browser) {
    const saved = localStorage.getItem('todo-filter') as Filter | null;
    if (saved === 'all' || saved === 'active' || saved === 'done') filter = saved;
  }

  $: if (browser) localStorage.setItem('todo-filter', filter);

  $: filteredTodos =
    filter === 'all'
      ? todos
      : filter === 'active'
        ? todos.filter((t) => !t.done)
        : todos.filter((t) => t.done);

  // derived counts
  $: remaining = todos.filter((t) => !t.done).length;
  $: doneCount = todos.filter((t) => t.done).length;
  let inputEl: HTMLInputElement | null = null;

  async function focusInput() {
    await tick();
    inputEl?.focus();
  }
  focusInput();

  async function addTodo() {
    const trimmed = text.trim();
    if (!trimmed) return;
    const fd = new FormData();
    fd.set('text', trimmed);

    const res = await fetch('/todos.json', {
      method: 'POST',
      body: fd,
    });

    if (!res.ok) {
      return;
    }

    const created = await res.json();
    todos = [created.todo, ...todos];
    text = '';
    await focusInput();
  }

  async function clearCompleted() {
    const completed = todos.filter((t) => t.done);
    if (!completed.length) return;

    // Optimistic: remove from UI instantly
    todos = todos.filter((t) => !t.done);

    // Fire-and-forget deletes (best effort)
    await Promise.all(completed.map((t) => fetch(`/todos/${t.uid}.json`, { method: 'DELETE' })));
  }
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<div class="page">
  <header class="hero">
    <div>
      <h1>{title}</h1>
    </div>
  </header>

  <section class="card">
    <form class="new" on:submit|preventDefault={addTodo}>
      <input
        bind:this={inputEl}
        type="text"
        name="text"
        bind:value={text}
        aria-label="Add a todo"
        placeholder="Add a task…"
      />
      <button class="add" type="submit" aria-label="Add">Add</button>
    </form>

    <div class="bar">
      <div class="tabs" role="tablist" aria-label="Todo filter">
        <button class:active={filter === 'all'} on:click={() => (filter = 'all')} type="button">
          All <span>{todos.length}</span>
        </button>
        <button
          class:active={filter === 'active'}
          on:click={() => (filter = 'active')}
          type="button"
        >
          Active <span>{remaining}</span>
        </button>
        <button class:active={filter === 'done'} on:click={() => (filter = 'done')} type="button">
          Done <span>{doneCount}</span>
        </button>
      </div>

      <div class="stats">
        <span><strong>{remaining}</strong> Todos Left</span>
        <button class="clear" type="button" on:click={clearCompleted} disabled={doneCount === 0}>
          Clear done
        </button>
      </div>
    </div>

    <div class="list">
      {#each filteredTodos as todo (todo.uid)}
        <div class="appear">
          <TodoItem
            {todo}
            onDeleted={(uid) => (todos = todos.filter((t) => t.uid !== uid))}
            onUpdate={(updated) =>
              (todos = todos.map((t) => (t.uid === updated.uid ? updated : t)))}
          />
        </div>
      {/each}
    </div>
  </section>
</div>

<style>
  .page {
    width: 100%;
    max-width: 46rem;
    margin: 4.5rem auto 4rem auto;
    padding: 0 1rem;
  }

  .hero {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    gap: 1rem;
    margin-bottom: 1.25rem;
  }

  h1 {
    margin: 0;
    font-size: clamp(2rem, 3.2vw, 2.7rem);
    letter-spacing: -0.03em;
    line-height: 1.05;
  }

  .subtitle {
    margin: 0.6rem 0 0 0;
    color: var(--muted);
    font-size: 1rem;
  }

  .badge {
    user-select: none;
    font-size: 0.85rem;
    color: #0b3b6d;
    background: linear-gradient(180deg, var(--blue-100), rgba(255, 255, 255, 0.8));
    border: 1px solid rgba(58, 160, 255, 0.25);
    padding: 0.45rem 0.75rem;
    border-radius: 999px;
    box-shadow: 0 8px 18px rgba(58, 160, 255, 0.12);
    white-space: nowrap;
  }

  .card {
    background: var(--surface);
    border: 1px solid rgba(58, 160, 255, 0.2);
    border-radius: var(--radius);
    box-shadow:
      0 18px 40px rgba(58, 160, 255, 0.1),
      var(--shadow);
    padding: 1rem;
    backdrop-filter: blur(10px);
  }
  .card {
    position: relative;
    overflow: hidden;
  }

  .card::before {
    content: '';
    position: absolute;
    inset: 0 0 auto 0;
    height: 6px;
    background: linear-gradient(90deg, rgba(58, 160, 255, 0.35), rgba(58, 160, 255, 0.1));
  }

  .new {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 0.75rem;
    align-items: center;
    margin-bottom: 0.5rem;
  }

  .new input {
    width: 100%;
    padding: 0.85rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(15, 23, 42, 0.12);
    background: var(--surface-2);
    box-shadow: var(--shadow-soft);
  }

  .add {
    padding: 0.85rem 1rem;
    border-radius: var(--radius-sm);
    border: 1px solid rgba(58, 160, 255, 0.35);
    background: linear-gradient(180deg, rgba(58, 160, 255, 0.22), rgba(58, 160, 255, 0.12));
    color: #0b3b6d;
    cursor: pointer;
    box-shadow: 0 10px 20px rgba(58, 160, 255, 0.12);
    transition:
      transform 120ms ease,
      box-shadow 120ms ease;
  }

  .add:hover {
    transform: translateY(-1px);
  }
  .add:active {
    transform: translateY(0px) scale(0.99);
  }

  .hint {
    font-size: 0.9rem;
    color: var(--muted);
    padding: 0.25rem 0.25rem 0.75rem 0.25rem;
    border-bottom: 1px dashed rgba(15, 23, 42, 0.12);
    margin-bottom: 0.75rem;
  }

  .list {
    display: grid;
    gap: 0.5rem;
  }

  /* Global input focus */
  .page :global(input:focus-visible) {
    border-color: rgba(58, 160, 255, 0.55) !important;
    box-shadow: 0 0 0 4px rgba(58, 160, 255, 0.18);
    outline: none;
  }

  /* Make each TodoItem look like a neat row without editing its component */
  .page :global(.todo),
  .page :global(li),
  .page :global(.item) {
    /* If your TodoItem uses any of these common wrappers, this will apply */
  }

  @media (max-width: 520px) {
    .hero {
      flex-direction: column;
      align-items: flex-start;
    }

    .new {
      grid-template-columns: 1fr;
    }

    .add {
      width: 100%;
    }
  }

  .page :global(.todo-item) {
    background: rgba(255, 255, 255, 0.75);
    border: 1px solid rgba(15, 23, 42, 0.1);
    border-radius: 14px;
    padding: 0.75rem 0.9rem;
    box-shadow: 0 10px 20px rgba(2, 6, 23, 0.06);
    transition:
      transform 120ms ease,
      box-shadow 120ms ease;
  }

  .page :global(.todo-item:hover) {
    transform: translateY(-1px);
    box-shadow: 0 14px 28px rgba(2, 6, 23, 0.08);
  }

  .appear {
    animation: pop-in 180ms ease-out;
  }

  @keyframes pop-in {
    from {
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    padding: 0.6rem 0.25rem 0.8rem 0.25rem;
  }

  .tabs {
    display: inline-flex;
    gap: 0.35rem;
    padding: 0.35rem;
    border-radius: 999px;
    border: 1px solid rgba(58, 160, 255, 0.22);
    background: rgba(255, 255, 255, 0.6);
    box-shadow: 0 10px 22px rgba(58, 160, 255, 0.08);
  }

  .tabs button {
    border: 1px solid transparent;
    background: transparent;
    color: rgba(11, 59, 109, 0.9);
    padding: 0.45rem 0.7rem;
    border-radius: 999px;
    cursor: pointer;
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
    transition:
      transform 120ms ease,
      background 120ms ease,
      border-color 120ms ease;
  }

  .tabs button span {
    font-size: 0.8rem;
    padding: 0.08rem 0.45rem;
    border-radius: 999px;
    background: rgba(58, 160, 255, 0.12);
    border: 1px solid rgba(58, 160, 255, 0.18);
  }

  .tabs button:hover {
    transform: translateY(-1px);
    border-color: rgba(58, 160, 255, 0.25);
    background: rgba(58, 160, 255, 0.08);
  }

  .tabs button.active {
    background: linear-gradient(180deg, rgba(58, 160, 255, 0.22), rgba(58, 160, 255, 0.1));
    border-color: rgba(58, 160, 255, 0.35);
    box-shadow: 0 10px 20px rgba(58, 160, 255, 0.12);
  }

  .stats {
    color: var(--muted);
    user-select: none;
    white-space: nowrap;
  }

  @media (max-width: 520px) {
    .bar {
      flex-direction: column;
      align-items: stretch;
    }
    .tabs {
      width: 100%;
      justify-content: space-between;
    }
    .tabs button {
      flex: 1;
      justify-content: center;
    }
  }

  .clear {
    margin-left: 0.6rem;
    border: 1px solid rgba(58, 160, 255, 0.25);
    background: rgba(255, 255, 255, 0.55);
    color: rgba(11, 59, 109, 0.9);
    padding: 0.35rem 0.6rem;
    border-radius: 999px;
    cursor: pointer;
  }
  .clear:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  .clear:not(:disabled):hover {
    background: rgba(58, 160, 255, 0.08);
    border-color: rgba(58, 160, 255, 0.35);
  }

  .list {
    overflow-anchor: none;
  }
</style>
