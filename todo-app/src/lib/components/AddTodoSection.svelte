<script lang="ts">
  import AddTodo from '$lib/components/AddTodo.svelte';
  import DashboardStats from '$lib/components/DashboardStats.svelte';
  
  export let todosStore: any;
  export let todosLoading: boolean;
</script>

<div class="bg-slate-50 rounded-lg shadow-md p-6 mb-6 border border-slate-200 lg:mb-0">
  <h1 class="select-none text-xl font-bold text-stone-800 mb-4 pb-3 border-b border-slate-200">
    Add New Todo
  </h1>
  <AddTodo />

  <DashboardStats {todosStore} {todosLoading} />
</div>