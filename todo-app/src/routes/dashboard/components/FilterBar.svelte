<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from '$lib/types';
  
  // Props
  export let todos: Todo[];
  export let filterType: 'all' | 'completed' | 'pending' = 'all';
  
  // Create event dispatcher
  const dispatch = createEventDispatcher();
  
  // Calculate counts
  $: totalCount = todos.length;
  $: pendingCount = todos.filter(todo => !todo.completed).length;
  $: completedCount = todos.filter(todo => todo.completed).length;
  
  // Handle filter change
  function handleFilterChange(newFilter: 'all' | 'completed' | 'pending') {
    dispatch('filterChange', newFilter);
  }
</script>

<!-- Filter buttons container -->
<div class="flex items-center justify-start gap-1 p-2 bg-gray-50 rounded-lg sm:gap-2 sm:p-4">      
  <div class="flex items-center gap-1 sm:gap-1">
    
    <!-- All todos filter button -->
    <button
      on:click={() => handleFilterChange('all')}
      class="select-none px-2 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors duration-200"
      class:bg-blue-500={filterType === 'all'}
      class:text-white={filterType === 'all'}
      class:bg-gray-200={filterType !== 'all'}
      class:text-gray-700={filterType !== 'all'}
      class:hover:bg-blue-400={filterType === 'all'}
      class:hover:bg-gray-300={filterType !== 'all'}
      aria-pressed={filterType === 'all'}
      aria-label="Show all todos"
    >
      All ({totalCount})
    </button>
    
    <!-- Pending todos filter button -->
    <button
      on:click={() => handleFilterChange('pending')}
      class="select-none px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap transition-colors duration-200"
      class:bg-yellow-500={filterType === 'pending'}
      class:text-white={filterType === 'pending'}
      class:bg-gray-200={filterType !== 'pending'}
      class:text-gray-700={filterType !== 'pending'}
      class:hover:bg-yellow-400={filterType === 'pending'}
      class:hover:bg-gray-300={filterType !== 'pending'}
      aria-pressed={filterType === 'pending'}
      aria-label="Show pending todos"
    >
      Pending ({pendingCount})
    </button>
    
    <!-- Completed todos filter button -->
    <button
      on:click={() => handleFilterChange('completed')}
      class="select-none px-3 py-1 pr-2 text-xs font-medium rounded-full whitespace-nowrap transition-colors duration-200"
      class:bg-green-500={filterType === 'completed'}
      class:text-white={filterType === 'completed'}
      class:bg-gray-200={filterType !== 'completed'}
      class:text-gray-700={filterType !== 'completed'}
      class:hover:bg-green-400={filterType === 'completed'}
      class:hover:bg-gray-300={filterType !== 'completed'}
      aria-pressed={filterType === 'completed'}
      aria-label="Show completed todos"
    >
      Completed ({completedCount})
    </button>
    
  </div>
</div>