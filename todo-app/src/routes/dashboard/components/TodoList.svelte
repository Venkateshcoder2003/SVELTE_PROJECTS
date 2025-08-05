<script lang="ts">
  // Import necessary modules
  import { createEventDispatcher } from 'svelte';
  import { todosStore } from '$lib/database/database';
  import type { Todo } from '$lib/types';
  
  // Import the existing components - All components in one place for easy navigation
  import TodoEditForm from './TodoEditForm.svelte';
  import TodoItemHeader from './TodoItemHeader.svelte';
  import TodoItemFooter from './TodoItemFooter.svelte';
  import EmptyState from './EmptyState.svelte';
  import FilterBar from './FilterBar.svelte'; // Import the new FilterBar component
  
  // Props from parent component
  export let editingTodoId: string | null;
  export let isDeleting: boolean;
  export let deletingTodoId: string | null;
  export let todosLoading: boolean;
  export let todosError: any;
  
  // Create event dispatcher to pass events up to parent
  const dispatch = createEventDispatcher();
  
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

   // Determine empty state type
  $: emptyStateType = (() => {
    if ($todosStore.length === 0) return 'no-todos';
    if (filteredTodos.length === 0) {
      if (filterType === 'completed') return 'no-completed';
      if (filterType === 'pending') return 'no-pending';
      return 'no-filtered';
    }
    return 'no-todos'; // fallback
  })();
  
  // Function to handle filter change from FilterBar component
  function handleFilterChange(event) {
    filterType = event.detail;
  }

  // Event handlers to pass events up to parent
  function handleEdit(event) {
    dispatch('edit', event.detail);
  }

  function handleDelete(event) {
    dispatch('delete', event.detail);
  }

  function handleToggle(event) {
    dispatch('toggle', event.detail);
  }

  function handleSaveEdit(event) {
    dispatch('saveEdit', event.detail);
  }

  function handleCancelEdit(event) {
    dispatch('cancelEdit', event.detail);
  }
</script>

<!-- Todo list container -->
<div class="space-y-4">
  
  <!-- Filter Bar Component -->
  {#if $todosStore.length > 0}
    <FilterBar 
      todos={$todosStore} 
      {filterType}
      on:filterChange={handleFilterChange}
    />
  {/if}
  
  <!-- Todos list -->
  {#if filteredTodos.length > 0}
    <div class="space-y-1">
      <!-- Loop through filtered todos and display each one -->
      {#each filteredTodos as todo (todo.id)}
        <div class="bg-slate-200 rounded-lg border border-gray-200 shadow-sm p-4 hover:shadow-md transition-shadow">
          
          {#if editingTodoId === todo.id}
            <!-- TodoEditForm Component -->
            <TodoEditForm 
              {todo}
              on:save={handleSaveEdit}
              on:cancel={handleCancelEdit}
            />
          {:else}
            <!-- TodoItemHeader Component -->
            <TodoItemHeader 
              {todo}
              isDeleting={isDeleting && deletingTodoId === todo.id}
              on:edit={() => handleEdit({ detail: todo })}
              on:delete={() => handleDelete({ detail: todo.id })}
              on:toggle={() => handleToggle({ detail: todo.id })}
            />
            
            <!-- TodoItemFooter Component -->
            <TodoItemFooter {todo} />
          {/if}
        </div>
      {/each}
    </div>
    
  {:else }
    <!-- Component that handles Empty todos -->
    <EmptyState type={emptyStateType} />
  {/if}
</div>