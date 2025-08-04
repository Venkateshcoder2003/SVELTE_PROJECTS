<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import TodosSectionHeader from '$lib/components/TodosSectionHeader.svelte';
  import TodosContent from '$lib/components/TodosContent.svelte';
  
  export let todosStore: any;
  export let todosLoading: boolean;
  export let todosError: any;
  export let isDeleting: boolean;
  
  const dispatch = createEventDispatcher();
  
  function handleDeleteAll() {
    dispatch('deleteAll');
  }
</script>

<div class="bg-slate-50 rounded-lg shadow-md p-6 border border-slate-200 flex flex-col max-h-[700px]">
  <TodosSectionHeader 
    {todosStore} 
    {todosLoading} 
    {isDeleting} 
    on:deleteAll={handleDeleteAll} 
  />
  
  <TodosContent {todosError} {todosLoading} />
</div>