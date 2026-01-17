<script lang="ts">
  export let todo: Todo;
  export let onDeleted: (uid: string) => void = () => {};

  async function remove() {
    const res = await fetch(`/todos/${todo.uid}.json`, { method: 'DELETE' });
    if (!res.ok) {
      console.error('DELETE failed', res.status, await res.text());
      return;
    }
    onDeleted(todo.uid);
  }
</script>

<!-- <div class="todo done">  -->
<div class="todo">
  <form action="" method="">
    <input type="hidden" name="done" value="" />
    <button aria-label="Mark done/not done" class="toggle">
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
  </form>

  <form action="" method="" class="text">
    <input type="text" value={todo.text} />
    <button aria-label="Save todo" class="save" type="button">
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

  <button aria-label="Delete todo" class="delete" type="button" on:click={remove}>
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
</div>

<style>
  .todo {
    display: grid;
    grid-template-columns: 2rem 1fr 2rem;
    grid-gap: 0.5rem;
    align-items: center;
    margin: 0 0 0.5rem 0;
    padding: 0.5rem;
    background-color: white;
    border-radius: 8px;
    filter: drop-shadow(2px 4px 6px rgba(0, 0, 0, 0.1));
    transform: translate(-1px, -1px);
    transition:
      filter 0.2s,
      transform 0.2s;
  }

  .todo button {
    width: 2em;
    height: 2em;
    border: none;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .todo input {
    flex: 1;
    padding: 0.5rem 2em 0.5em 0.8em;
    border-radius: 3px;
  }

  button.toggle {
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 50%;
    background: transparent;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .toggle svg {
    color: #4caf50;
  }
  .done {
    transform: none;
    opacity: 0.4;
    filter: drop-shadow(0px 0px 1px rgba(0, 0, 0, 0.1));
  }

  .toggle .check {
    opacity: 0;
    transition: opacity 0.2s ease;
  }

  .todo.done .toggle .check {
    opacity: 1;
  }

  .todo.done .toggle {
    background-color: #e8f5e9;
    border-color: #4caf50;
  }

  .text {
    position: relative;
    display: flex;
    align-items: center;
    flex: 1;
  }

  .save {
    position: absolute;
    right: 0;
    opacity: 0;
  }

  .todo input:focus + .save,
  .save:focus {
    transition: opacity 0.2s;
    opacity: 1;
    color: green;
  }

  .delete {
    opacity: 0.2;
    color: red;
  }

  .delete:hover,
  .delete:focus {
    transition: opacity 0.2s;
    opacity: 1;
  }
</style>
