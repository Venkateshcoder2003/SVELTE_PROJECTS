<script lang="ts">
  import type { Todo } from '$lib/types';

  export let todo: Todo;
</script>

<div class="flex-grow min-w-0">
  <h3
    class="select-none font-medium text-lg break-words"
    class:line-through={todo.completed}
    class:text-green-700={todo.completed}
  >
    {todo.title}
  </h3>
  <p class="select-none text-gray-800 break-words mt-1">
    {todo.text}
  </p>
</div>