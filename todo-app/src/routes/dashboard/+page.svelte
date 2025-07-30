<!-- Dashboard page - protected route for authenticated users -->
<!-- Main todo management interface -->
<script lang="ts">
  // Import necessary modules
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  import { 
    todosStore, 
    todosLoading, 
    todosError,
    subscribeTodos, 
    unsubscribeTodos 
  } from '$lib/stores/todos';
  
  // Import todo components
  import AddTodo from '$lib/components/AddTodo.svelte';
  import TodoList from '$lib/components/TodoList.svelte';
  
  // Check authentication and setup todos subscription when component mounts
  onMount(() => {
    const unsubscribeAuth = authStore.subscribe((auth) => {
      if (!auth.loading) {
        if (!auth.user) {
          // User is not authenticated, redirect to home page
          goto('/');
        } else {
          // User is authenticated, start listening to their todos
          subscribeTodos(auth.user.uid);
        }
      }
    });
    
    // Cleanup function will run when component is destroyed
    return () => {
      unsubscribeAuth();
      unsubscribeTodos(); // Stop listening to todos
    };
  });
  
  // Cleanup todos subscription when component is destroyed
  onDestroy(() => {
    unsubscribeTodos();
  });
</script>

<!-- Page title -->
<svelte:head>
  <title>Dashboard - Todo App</title>
</svelte:head>

<!-- Show loading while checking authentication -->
{#if $authStore.loading}
  <div class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>

<!-- Show dashboard for authenticated users -->
{:else if $authStore.user}
  <div class="max-w-4xl mx-auto">
    <div class="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 class="text-3xl font-bold text-gray-800">
          📝 Todo Dashboard
        </h1>
        <p class="text-gray-600 mt-1 sm:mt-0">
          Manage your tasks and stay organized
        </p>
      </div>
    </div>
    
    <!-- Add new todo section -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-xl font-semibold text-gray-800 mb-4">
        Add New Todo
      </h2>
      <AddTodo />
    </div>
    
    <!-- Todos error display -->
    {#if $todosError}
      <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm mb-6">
        {$todosError}
      </div>
    {/if}
    
    <!-- Todos list section -->
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-800">
          Your Todos
        </h2>
        
        <!-- Todo count display -->
        {#if !$todosLoading}
          <span class="text-sm text-gray-500">
            {$todosStore.length} {$todosStore.length === 1 ? 'todo' : 'todos'}
          </span>
        {/if}
      </div>
      
      <!-- Show loading spinner while loading todos -->
      {#if $todosLoading}
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span class="ml-2 text-gray-600">Loading your todos...</span>
        </div>
      
      <!-- Show todos list -->
      {:else}
        <TodoList />
      {/if}
    </div>

    {#if !$todosLoading && $todosStore.length > 0}
      <div class="mt-6 grid grid-cols-3 gap-2 sm:gap-4">
        <!-- Total todos -->
        <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div class="text-xl sm:text-2xl font-bold text-blue-600">
            {$todosStore.length}
          </div>
          <div class="text-xs sm:text-sm text-blue-700">
            Total Todos
          </div>
        </div>
        
        <!-- Completed todos -->
        <div class="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div class="text-xl sm:text-2xl font-bold text-green-600">
            {$todosStore.filter(todo => todo.completed).length}
          </div>
          <div class="text-xs sm:text-sm text-green-700">
            Completed
          </div>
        </div>
        
        <!-- Pending todos -->
        <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-center">
          <div class="text-xl sm:text-2xl font-bold text-yellow-600">
            {$todosStore.filter(todo => !todo.completed).length}
          </div>
          <div class="text-xs sm:text-sm text-yellow-700">
            Pending
          </div>
        </div>
      </div>
    {/if}
  </div>
{/if}
