<script lang="ts">
  import { browser } from '$app/environment';
  import { onMount } from 'svelte';

  /* ---------------------------
   * Props (callbacks from parent)
   * --------------------------- */
  export let todo: Todo;
  export let onDeleted: (uid: string) => void = () => {};
  export let onUpdate: (todo: Todo) => void = () => {};

  /* ---------------------------
   * Local UI state
   * --------------------------- */
  let text = todo.text;

  // expand/collapse state (class:expanded on root)
  let expanded = false;

  // textarea ref (used for measuring / initial autosize)
  let taEl: HTMLTextAreaElement | null = null;

  // whether the content actually needs expand/collapse
  let needsExpand = false;

  type ExpandMode = 'auto' | 'expanded' | 'collapsed';
  let mode: ExpandMode = 'auto';

  const expandKey = (uid: string) => `todo-expand:${uid}`;

  // "dirty" = local text differs from latest server/parent value
  $: dirty = text !== todo.text;

  /* ---------------------------
   * Derived display data
   * --------------------------- */
  const created = new Date(todo.created_at);
  $: createdLabel = created.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });

  /* ---------------------------
   * Expand/collapse logic
   * --------------------------- */
  function measureNeedsExpand(el: HTMLTextAreaElement) {
    // 44px ~= your 1-line collapsed height (adjust if needed)
    needsExpand = el.scrollHeight > 44 || el.value.includes('\n');
  }

  function applyExpandedFromMode() {
    if (mode === 'expanded') expanded = true;
    else if (mode === 'collapsed') expanded = false;
    else expanded = needsExpand; // auto follows content
  }

  function setMode(next: ExpandMode) {
    mode = next;
    if (browser) localStorage.setItem(expandKey(todo.uid), mode);
    applyExpandedFromMode();
  }

  function toggleExpand() {
    // user explicitly decides => lock mode
    setMode(expanded ? 'collapsed' : 'expanded');
  }

  function initMeasure() {
    if (!taEl) return;

    // initial autosize
    taEl.style.height = 'auto';
    taEl.style.height = `${taEl.scrollHeight}px`;

    // initial measure + apply
    measureNeedsExpand(taEl);
    applyExpandedFromMode();
  }

  // restore saved preference on client
  if (browser) {
    const saved = localStorage.getItem(expandKey(todo.uid)) as ExpandMode | null;
    if (saved === 'expanded' || saved === 'collapsed' || saved === 'auto') mode = saved;
  }

  onMount(() => {
    initMeasure();
  });

  /* ---------------------------
   * API calls
   * --------------------------- */
  async function remove() {
    const res = await fetch(`/todos/${todo.uid}.json`, { method: 'DELETE' });
    if (!res.ok) {
      console.error('DELETE failed', res.status, await res.text());
      return;
    }
    onDeleted(todo.uid);
  }

  async function update() {
    const res = await fetch(`/todos/${todo.uid}.json`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ text }),
    });

    if (!res.ok) {
      console.error('PATCH failed', res.status, await res.text());
      return;
    }

    const updated = await res.json();
    onUpdate(updated.todo);
    text = updated.todo.text;

    // re-measure after successful save (in case server/parent changed text)
    initMeasure();
  }

  async function toggleDone() {
    const previous = todo.done;

    // optimistic update
    onUpdate({ ...todo, done: !todo.done });

    const res = await fetch(`/todos/${todo.uid}.json`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ done: !previous }),
    });

    if (!res.ok) {
      // rollback on failure
      onUpdate({ ...todo, done: previous });
    }
  }

  /* ---------------------------
   * UX helpers
   * --------------------------- */
  function clickFeedback(el: HTMLElement) {
    el.animate(
      [{ transform: 'scale(1)' }, { transform: 'scale(0.97)' }, { transform: 'scale(1)' }],
      { duration: 120, easing: 'ease-out' },
    );
  }

  function autoResize(e: Event) {
    const el = e.currentTarget as HTMLTextAreaElement;

    // autosize height
    el.style.height = 'auto';
    el.style.height = `${el.scrollHeight}px`;

    // decide whether "More" is needed
    measureNeedsExpand(el);

    // auto mode follows content; manual mode stays locked
    applyExpandedFromMode();
  }

  function onKey(e: KeyboardEvent) {
    // Enter makes a new line (default)
    // Ctrl/Cmd + Enter saves
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') update();
    if (e.key === 'Escape') text = todo.text;
  }
</script>

<div class="todo" class:done={todo.done} class:dirty class:expanded>
  <button
    aria-label="Mark todo as {todo.done ? 'not done' : 'done'}"
    class="toggle"
    type="button"
    on:click={toggleDone}
  >
    <svg
      class="check"
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="3"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      <polyline points="5 13 9 17 19 7" />
    </svg>
  </button>

  <form class="text" on:submit|preventDefault={update}>
    <textarea
      bind:this={taEl}
      rows="1"
      bind:value={text}
      on:input={autoResize}
      on:blur={update}
      on:keydown={onKey}
      placeholder="Write your todo…"
    ></textarea>
    <small class="meta">{createdLabel}</small>
    <button
      aria-label="Save todo"
      class="save"
      type="button"
      on:click={(e) => {
        clickFeedback(e.currentTarget);
        update();
      }}
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
        <polyline points="17 21 17 13 7 13 7 21" />
        <polyline points="7 3 7 8 15 8" />
      </svg>
    </button>
  </form>

  <div class="actions">
    <button
      aria-label="Delete todo"
      class="delete"
      type="button"
      on:click={(e) => {
        clickFeedback(e.currentTarget);
        remove();
      }}
    >
      <!-- trash svg ... -->
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <polyline points="3 6 5 6 21 6" />
        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
        <path d="M10 11v6" />
        <path d="M14 11v6" />
        <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      </svg>
    </button>

    <button
      type="button"
      class="expand"
      aria-label={expanded ? 'Collapse todo' : 'Expand todo'}
      aria-expanded={expanded}
      on:click={toggleExpand}
      disabled={!needsExpand}
      class:hidden={!needsExpand}
      title={!needsExpand ? 'Add a new line (Enter) to expand' : expanded ? 'Collapse' : 'Expand'}
    >
      <span class="chev" aria-hidden="true">{expanded ? 'Hide ▴' : 'More▾'}</span>
    </button>
  </div>
</div>

<style>
  .todo {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    gap: 0.85rem;
    align-items: center;

    margin: 0 0 0.5rem 0;

    background: rgba(255, 255, 255, 0.92);
    border: 1px solid rgba(58, 160, 255, 0.26);
    border-left: 6px solid rgba(58, 160, 255, 0.35);
    border-radius: 14px;

    box-shadow:
      0 10px 22px rgba(2, 6, 23, 0.06),
      0 10px 26px rgba(58, 160, 255, 0.08);

    transition:
      transform 120ms ease,
      box-shadow 120ms ease,
      border-color 120ms ease,
      background 120ms ease,
      opacity 120ms ease;
  }

  .todo:hover {
    transform: translateY(-1px);
    border-color: rgba(58, 160, 255, 0.45);
    box-shadow:
      0 14px 30px rgba(2, 6, 23, 0.08),
      0 14px 36px rgba(58, 160, 255, 0.12);
  }

  .todo button {
    width: 2.4rem;
    height: 2.4rem;
    border: none;
    background: transparent;
    display: grid;
    place-items: center;
    cursor: pointer;
    border-radius: 12px;
  }

  /* Toggle (circle checkbox) */
  button.toggle {
    border: 1px solid rgba(58, 160, 255, 0.55);
    border-radius: 999px;
    background: radial-gradient(
      circle at top left,
      rgba(255, 255, 255, 0.9),
      rgba(191, 227, 255, 0.75)
    );
  }

  button.toggle:hover {
    transform: translateY(-1px);
    border-color: rgba(58, 160, 255, 0.35);
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 0.9),
      0 12px 26px rgba(58, 160, 255, 0.35);
  }

  .toggle svg {
    color: rgba(58, 160, 255, 0.85);
  }

  .toggle .check {
    opacity: 0;
    transform: scale(0.9);
    transition:
      opacity 120ms ease,
      transform 120ms ease;
  }

  /* Text area */
  .text {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 0.35rem;
    min-width: 0;

    padding-top: 0.35rem;
    padding-bottom: 0.35rem;
  }

  /* Save button: shows on focus/hover of row */
  .save {
    position: absolute;
    right: 0.35rem;

    opacity: 0;
    transform: translateY(1px);
    transition:
      opacity 120ms ease,
      transform 120ms ease;

    color: rgba(11, 59, 109, 0.75);
  }

  .todo:hover .save,
  .save:focus-visible {
    opacity: 1;
    transform: translateY(0);
  }

  .save:hover {
    color: rgba(11, 59, 109, 1);
  }

  /* Delete button */
  .delete {
    opacity: 0.35;
    color: rgba(220, 38, 38, 0.75);
    transition:
      opacity 120ms ease,
      transform 120ms ease;
  }

  .delete:hover,
  .delete:focus-visible {
    opacity: 1;
    transform: translateY(-1px);
    color: rgba(220, 38, 38, 0.95);
  }

  /* Done state */
  .todo.done {
    opacity: 1;
    transform: none;

    background: linear-gradient(180deg, rgba(231, 248, 255, 0.95), rgba(255, 255, 255, 0.9));

    border-color: rgba(58, 160, 255, 0.55);
    border-left-color: rgba(58, 160, 255, 0.95);

    box-shadow:
      0 8px 18px rgba(2, 6, 23, 0.05),
      0 14px 34px rgba(58, 160, 255, 0.18);
  }

  .todo.done .toggle {
    background: rgba(58, 160, 255, 0.4);
    border-color: rgba(58, 160, 255, 0.95);
  }

  .todo.done .toggle .check {
    opacity: 1;
    transform: scale(1);
  }

  .todo {
    position: relative;
    overflow: hidden;
    padding: 0.9rem 0.9rem;
  }

  .todo::before {
    content: '';
    position: absolute;
    left: 0;
    top: 10px;
    bottom: 10px;
    width: 4px;
    border-radius: 999px;
    background: rgba(58, 160, 255, 0);
    transition: background 140ms ease;
  }

  .todo.done::before {
    background: rgba(58, 160, 255, 0.55);
  }

  .todo::after {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: inherit;
    pointer-events: none;
    background: linear-gradient(180deg, rgba(255, 255, 255, 0.45), rgba(255, 255, 255, 0) 40%);
  }

  .todo.dirty {
    border-color: rgba(255, 180, 80, 0.6);
  }

  .meta {
    position: static;
    font-size: 0.75rem;
    color: rgba(100, 116, 139, 0.9);
    user-select: none;
    padding-left: 0.1rem;
  }

  .todo textarea {
    width: 100%;
    min-width: 0;
    resize: none;
    overflow: hidden;

    padding: 0.65rem 2.6rem 0.65rem 0.85rem;
    border-radius: 12px;

    background: rgba(255, 255, 255, 0.92);

    line-height: 1.35;
    min-height: 2.6rem;
  }

  .expand {
    height: 1.75rem;
    width: auto;
    min-width: 2.9rem;
    padding: 0 0.6rem;

    border-radius: 999px;
    border: 1px solid rgba(15, 23, 42, 0.14);
    background: rgba(58, 160, 255, 0.1);
    color: rgba(11, 59, 109, 0.9);

    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 0.35rem;

    white-space: nowrap;
    line-height: 1;
    font-size: 0.78rem;

    cursor: pointer;
    opacity: 0.95;
    transition:
      transform 120ms ease,
      opacity 120ms ease,
      border-color 120ms ease,
      background 120ms ease;
  }

  .expand:active {
    transform: translateY(0px) scale(0.98);
  }

  .expand:disabled {
    opacity: 0;
    pointer-events: none;
  }

  .hidden {
    display: none;
  }

  .chev {
    display: inline-flex;
    align-items: center;
    gap: 0.35rem;
    white-space: nowrap;
    line-height: 1;
  }

  .todo textarea {
    transition: max-height 140ms ease;
  }

  .todo:not(.expanded) textarea {
    max-height: 2.6rem;
  }

  .todo.expanded textarea {
    max-height: 60vh;
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
    align-items: flex-end;
    padding-left: 2.8rem;
  }
</style>
