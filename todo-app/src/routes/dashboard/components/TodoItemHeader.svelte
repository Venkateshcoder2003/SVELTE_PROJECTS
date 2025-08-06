<script lang="ts">
  // Import necessary modules
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from '$lib/types';
  import Button from '$lib/components/Button.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';

  // props thet receive todo object and isDeleting variable from parent component
  export let todo: Todo;
  export let isDeleting: boolean;

  const dispatch = createEventDispatcher();

  // Variable that holds status of toggling
  let isToggling = false;

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
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined 
      });
    }
  }
 
  // Function that handles the toggle button click
  async function handleToggle() {
    if (isToggling) return;
    isToggling = true;
    dispatch('toggle');
    // Wait a bit to show loading state
    setTimeout(() => {
      isToggling = false;
    }, 300);
  }

  function handleEdit() {
    dispatch('edit');
  }

  function handleDelete() {
    dispatch('delete');
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex flex-row space-x-3 flex-grow">
    <!-- Toggle Button -->
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

    <!-- Todo Content -->
    <div class="flex-grow">
      <div class="select-none flex flex-col">
        <h3 
          class="text-lg font-semibold text-gray-800 break-words"
          class:line-through={todo.completed}
          class:text-gray-500={todo.completed}
        >
          {todo.title}
        </h3>
        <p class="text-gray-600 mt-1 break-words">
          {todo.text}
        </p>
      </div>
    </div>
  </div>
</div>