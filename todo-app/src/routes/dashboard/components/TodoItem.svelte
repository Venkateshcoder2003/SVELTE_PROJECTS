<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from '$lib/types';
  import TodoDisplay from './TodoDisplay.svelte';
  import TodoEditForm from './TodoEditForm.svelte';
  
  export let todo: Todo;
  export let editingTodoId: string | null;
  export let isDeleting: boolean;
  export let deletingTodoId: string | null;
  
  const dispatch = createEventDispatcher();

  function handleEdit() {
    dispatch('edit', todo);
  }

  function handleDelete() {
    dispatch('delete', todo.id);
  }

  function handleToggle() {
    dispatch('toggle', todo.id);
  }

  function handleSaveEdit() {
    dispatch('saveEdit');
  }

  function handleCancelEdit() {
    dispatch('cancelEdit');
  }
</script>

<div
  class="bg-slate-100 border border-gray-200 rounded-lg p-2 shadow-md hover:shadow-xl transition-shadow duration-200 h-full flex flex-col"
  class:opacity-75={todo.completed}
  class:bg-emerald-50={todo.completed}
  class:border-emerald-500={todo.completed}
>
  {#if editingTodoId === todo.id}
    <TodoEditForm 
      {todo} 
      on:save={handleSaveEdit}
      on:cancel={handleCancelEdit}
    />
  {:else}
    <TodoDisplay 
      {todo} 
      isDeleting={isDeleting && deletingTodoId === todo.id}
      on:edit={handleEdit}
      on:delete={handleDelete}
      on:toggle={handleToggle}
    />
  {/if}
</div>