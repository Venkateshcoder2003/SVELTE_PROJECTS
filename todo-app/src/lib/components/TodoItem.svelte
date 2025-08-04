<script lang="ts">
  import type { Todo } from '$lib/types';
  import TodoEditForm from './TodoEditForm.svelte';
  import TodoDisplay from './TodoDisplay.svelte';
  import ConfirmDialog from './ConfirmDialog.svelte';
  import { deleteTodo } from '$lib/stores/todos';
  import { toast } from "svelte-sonner";
  
  export let todo: Todo;

  let isEditing = false;
  let isDeleting = false;
  let showConfirmDialog = false;

  function startEditing() {
    isEditing = true;
  }

  function handleEditComplete() {
    isEditing = false;
  }

  function handleEditCancel() {
    isEditing = false;
  }

  function handleDelete() {
    if (isDeleting) return;
    showConfirmDialog = true;
  }

  async function executeDelete() {
    if (isDeleting) return;
    isDeleting = true;
    const success = await deleteTodo(todo.id);
    isDeleting = false;
    if (!success) {
      toast.error("Failed to delete todo");
    }
  }
</script>

<ConfirmDialog
  bind:show={showConfirmDialog}
  title="Delete Todo"
  message="Are you sure you want to delete this todo? This cannot be undone."
  on:confirm={executeDelete}
  on:cancel={() => showConfirmDialog = false}
/>

<div
  class="bg-slate-100 border border-gray-200 rounded-lg p-2 shadow-md hover:shadow-xl transition-shadow duration-200 h-full flex flex-col"
  class:opacity-75={todo.completed}
  class:bg-emerald-50={todo.completed}
  class:border-emerald-500={todo.completed}
>
  {#if isEditing}
    <TodoEditForm 
      {todo} 
      on:save={handleEditComplete}
      on:cancel={handleEditCancel}
    />
  {:else}
    <TodoDisplay 
      {todo} 
      {isDeleting}
      on:edit={startEditing}
      on:delete={handleDelete}
    />
  {/if}
</div>