<script lang="ts">
  // Import necessary modules
  import { todosStore } from '$lib/stores/todos';
  import TodoItem from './TodoItem.svelte';
  import type { Todo } from '$lib/types';
  
  //Filter state variables
  let filterType: 'all' | 'completed' | 'pending' = 'all';
  
  // Reactive statement to filter and sort todos
  $: filteredTodos = $todosStore
    .filter((todo: Todo) => {
      // Apply filter based on selected filter type
      if (filterType === 'completed') {
        return todo.completed;
      } else if (filterType === 'pending') {
        return !todo.completed;
      }
      return true; // Show all todos
    })
    .sort((a: Todo, b: Todo) => {
      // Sort by creation date (newest first)
      return b.createdAt.getTime() - a.createdAt.getTime();
    });
  
  // Function to handle filter change
  function handleFilterChange(newFilter: 'all' | 'completed' | 'pending') {
    filterType = newFilter;
  }
</script>

<!-- Todo list container -->
<div class="space-y-4">
  <!-- Filter buttons -->
  {#if $todosStore.length > 0}
    <div class="flex items-center justify-start gap-1 p-2 bg-gray-50 rounded-lg sm:gap-2 sm:p-4">      
      <div class="flex items-center gap-1 sm:gap-1">
        <!-- All todos filter button -->
        <button
          on:click={() => handleFilterChange('all')}
          class="select-none px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap"
          class:bg-blue-500={filterType === 'all'}
          class:text-white={filterType === 'all'}
          class:bg-gray-200={filterType !== 'all'}
          class:text-gray-700={filterType !== 'all'}
          class:hover:bg-blue-400={filterType === 'all'}
          class:hover:bg-gray-300={filterType !== 'all'}
        >
          All ({$todosStore.length})
        </button>
        
        <!-- Pending todos filter button -->
        <button
          on:click={() => handleFilterChange('pending')}
          class="select-none px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap"
          class:bg-yellow-500={filterType === 'pending'}
          class:text-white={filterType === 'pending'}
          class:bg-gray-200={filterType !== 'pending'}
          class:text-gray-700={filterType !== 'pending'}
          class:hover:bg-yellow-400={filterType === 'pending'}
          class:hover:bg-gray-300={filterType !== 'pending'}
        >
          Pending ({$todosStore.filter(todo => !todo.completed).length})
        </button>
        
        <!-- Completed todos filter button -->
        <button
          on:click={() => handleFilterChange('completed')}
          class="select-none px-3 py-1 pr-2 text-xs font-medium rounded-full whitespace-nowrap"
          class:bg-green-500={filterType === 'completed'}
          class:text-white={filterType === 'completed'}
          class:bg-gray-200={filterType !== 'completed'}
          class:text-gray-700={filterType !== 'completed'}
          class:hover:bg-green-400={filterType === 'completed'}
          class:hover:bg-gray-300={filterType !== 'completed'}
        >
          Completed ({$todosStore.filter(todo => todo.completed).length})
        </button>
      </div>
    </div>
  {/if}
  
  <!-- Todos list -->
  {#if filteredTodos.length > 0}
    <div class="space-y-1">
      <!-- Loop through filtered todos and display each one -->
      {#each filteredTodos as todo (todo.id)}
        <TodoItem {todo} />
      {/each}
    </div>
    
  {:else if $todosStore.length > 0}
    <!-- No todos match current filter -->
    <div class="text-center py-12">
      <div class="select-none text-4xl mb-4">
        {#if filterType === 'completed'}
          <span>&#127919;</span> 
        {:else if filterType === 'pending'}
          <span>&#x1F4DD;</span>
        {:else}
          <span>&#128203;</span> 
        {/if}
      </div>
      <h3 class="select-none text-lg font-medium text-gray-700 mb-2">
        {#if filterType === 'completed'}
          No completed todos yet
        {:else if filterType === 'pending'}
          No pending todos
        {:else}
          No todos found
        {/if}
      </h3>
      <p class="select-none text-gray-500 text-sm">
        {#if filterType === 'completed'}
          Complete some todos to see them here.
        {:else if filterType === 'pending'}
          Great job! All your todos are completed.
        {:else}
          Add your first todo to get started.
        {/if}
      </p>
    </div>
    
  {:else}
    <!-- No todos at all -->
    <div class="text-center py-12">
      <div class="text-6xl mb-4"><span>&#x1F4DD;</span></div>
      <h3 class="select-none text-xl font-medium text-gray-700 mb-2">
        No todos yet
      </h3>
      <p class="select-none text-gray-500">
        Add your first todo above to get started organizing your tasks!
      </p>
    </div>
  {/if}
</div>