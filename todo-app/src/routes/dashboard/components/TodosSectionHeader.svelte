<script lang="ts">
  // Import required modules
  import { createEventDispatcher } from 'svelte';
  
  export let todosStore: any;
  export let todosLoading: boolean;
  export let isDeleting: boolean;
  
  const dispatch = createEventDispatcher();
  
  function handleDeleteAll() {
    dispatch('deleteAll');
  }
</script>

<div class="flex flex-row flex-nowrap justify-between items-center mb-4 pb-3 border-b border-slate-200 flex-shrink-0">
  <h2 class="select-none lg:text-xl text-sm font-bold text-stone-800 whitespace-nowrap">
    Your Todos
  </h2>
  <div class="flex flex-row flex-nowrap items-center space-x-4">
    {#if !todosLoading}
      <span class="select-none text-sm font-bold text-stone-800">
        {$todosStore.length} {$todosStore.length === 1 ? 'todo' : 'todos'}
      </span>
    {/if}
    {#if !todosLoading && $todosStore.length > 0}
      <button
        on:click={handleDeleteAll}
        class="px-3 py-1.5 text-sm bg-red-500 hover:bg-red-600 text-white rounded-md transition-colors duration-200 flex items-center space-x-1"
        disabled={isDeleting}
      >
        <span class="select-none font-bold whitespace-nowrap">Delete All</span>
      </button>
    {/if}
  </div>
</div>