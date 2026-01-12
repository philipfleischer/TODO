<script>
  import TodoItem from '$lib/todo-item.svelte';

  // Now Changing this changes it every title place in the code!
  const title = 'Todo';
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<h1>{title}</h1>
<form action="" method="">
  <input type="text" name="text" aria-label="Add a todo" placeholder="+ type to add a todo" />
</form>

<!-- import todo.items in Svelte, $lib ensures we can copypaste the relative path anywhere-->
<TodoItem />
