<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from '$lib/types';
  import Button from './Button.svelte';

  export let todo: Todo;
  export let isDeleting: boolean;

  const dispatch = createEventDispatcher();

  function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  }

  function handleEdit() {
    dispatch('edit');
  }

  function handleDelete() {
    dispatch('delete');
  }
</script>

<div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 w-full gap-2">
  <div class="flex items-center gap-2"></div>

  <div class="flex items-center justify-between w-full sm:w-auto sm:gap-2">
    <div class="select-none text-xs text-gray-800">
      Created {formatDate(todo.createdAt)}
    </div>
    <div class="flex space-x-2">
      <Button
        text="Edit"
        disabled={isDeleting}
        buttonClass="text-blue-500 hover:text-blue-700 text-xs font-medium bg-transparent p-0 transition-colors"
        on:click={handleEdit}
      />
      <Button
        text="Delete"
        loading={isDeleting}
        loadingText="Deleting..."
        buttonClass="text-red-400 hover:text-red-600 text-xs font-medium bg-transparent p-0 transition-colors"
        spinnerSize="small"
        spinnerColor="red"
        on:click={handleDelete}
      />
    </div>
  </div>
</div>