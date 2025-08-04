<script lang="ts">
  //Import necessary modules
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/utils/auth_lce';
  import {
    todosStore,
    todosLoading,
    todosError,
    subscribeTodos,
    unsubscribeTodos,
    deleteAllTodos
  } from '$lib/stores/todos';

  //Import components
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import DashboardHeader from '$lib/components/DashboardHeader.svelte';
  import AddTodoSection from '$lib/components/AddTodoSection.svelte';
  import TodosSection from '$lib/components/TodosSection.svelte';
  import { Logger } from '$lib/utils/logger';

  const log = Logger.getInstance();

  // State for delete all confirmation
  let showDeleteAllConfirm = false;
  let isDeleting = false;

  // Reference to the ConfirmDialog component's DOM element
  let confirmDialogElement: HTMLElement;

  // Function to handle clicks outside the ConfirmDialog
  function handleClickOutside(event: MouseEvent) {
    // Check if the dialog is open and the click is outside the dialog element
    if (showDeleteAllConfirm && confirmDialogElement && !confirmDialogElement.contains(event.target as Node)) {
      showDeleteAllConfirm = false;
    }
  }

  // ALL onMount logic consolidated into a single block
  onMount(() => {
    // Add the click listener to the document
    document.addEventListener('mousedown', handleClickOutside);

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
      // Clean up the auth store subscription
      unsubscribeAuth();
      // Clean up the todos subscription
      unsubscribeTodos();
      // Clean up the global event listener
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });
  
  // Handle delete all todos
  const handleDeleteAll = async () => {
    if (!$authStore.user) return;

    isDeleting = true;
    const success = await deleteAllTodos($authStore.user.uid);
    isDeleting = false;
  };

  // Handle confirm delete from dialog
  const handleConfirmDelete = () => {
    handleDeleteAll();
  };

  // Handle cancel delete from dialog
  const handleCancelDelete = () => {
    showDeleteAllConfirm = false;
  };

  // Handle delete all event from TodosSection
  const handleDeleteAllEvent = () => {
    showDeleteAllConfirm = true;
  };
</script>

<ConfirmDialog
  bind:this={confirmDialogElement}
  bind:show={showDeleteAllConfirm}
  title="Delete All Todos"
  message="Are you sure you want to delete all {$todosStore.length} todos? This will permanently remove all your todos and their associated files."
  on:confirm={handleConfirmDelete}
  on:cancel={handleCancelDelete}
/>

<svelte:head>
  <title>Dashboard - Todo App</title>
</svelte:head>

{#if $authStore.loading}
  <LoadingSpinner />

{:else if $authStore.user}
  <div class="min-h-screen bg-slate-300 rounded">
    <div class="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      <DashboardHeader />
      
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 xl:gap-20">
        <AddTodoSection {todosStore} todosLoading={$todosLoading} />
        
        <TodosSection 
          {todosStore} 
          todosLoading={$todosLoading} 
          {todosError} 
          {isDeleting}
          on:deleteAll={handleDeleteAllEvent}
        />
      </div>
    </div>
  </div>
{/if}