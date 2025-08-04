<script lang="ts">
  import { toggleTodo } from '$lib/stores/todos';
  import type { Todo } from '$lib/types';
  import { toast } from "svelte-sonner";
import LoadingSpinner from './LoadingSpinner.svelte';

  export let todo: Todo;

  let isToggling = false;

  async function handleToggle() {
    if (isToggling) return;
    isToggling = true;
    const success = await toggleTodo(todo.id);
    isToggling = false;
    if (!success) {
      toast.error("Failed to update todo status");
    }
  }
</script>

<button
  on:click={handleToggle}
  disabled={isToggling}
  class="select-none flex-shrink-0 w-5 h-5 mt-1 rounded border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  class:bg-green-500={todo.completed}
  class:border-green-500={todo.completed}
>
  {#if isToggling}
    <LoadingSpinner 
      size="small" 
      color="gray-400" 
      showContainer={false}
    />
  {:else if todo.completed}
    <div class="text-green-300 rounded h-3 w-3 m-auto"></div>
  {/if}
</button>