<script lang="ts">
  import TodoList from '$lib/components/TodoList.svelte';
  import LoadingSpinner from './LoadingSpinner.svelte';
  import ErrorDisplay from './ErrorDisplay.svelte';
  
  export let todosError: any;
  export let todosLoading: boolean;
</script>

<div class="mt-4 overflow-y-auto pr-2">
  {#if $todosError}
    <ErrorDisplay {$todosError}/>
  {/if}
  {#if todosLoading}
    <div class="space-y-3">
      {#each { length: 3 } as _}
        <LoadingSpinner 
          size="large" 
          color="blue-500" 
          containerClass="flex justify-center items-center h-full min-h-[150px]" 
        />
      {/each}
    </div>
  {:else}
    <TodoList />
  {/if}
</div>