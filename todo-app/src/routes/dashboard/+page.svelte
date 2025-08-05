<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/authentication/auth_lce';
  import {
    todosStore,
    todosLoading,
    todosError,
    subscribeTodos,
    unsubscribeTodos,
    deleteAllTodos,
    deleteTodo,
    toggleTodo
  } from '$lib/database/database';
  import { toast } from "svelte-sonner";

  // External reusable components
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import ConfirmDialog from '$lib/components/ConfirmDialog.svelte';
  
  // Dashboard-specific components (created above)
  import DashboardHeader from './components/DashboardHeader.svelte';
  import DashboardStats from './components/DashboardStats.svelte';
  import AddTodoForm from './components/AddTodoForm.svelte';
  import TodosSectionHeader from './components/TodosSectionHeader.svelte';
  import TodoList from './components/TodoList.svelte';
  import TodoItemHeader from './components/TodoItemHeader.svelte';
  import TodoEditForm from './components/TodoEditForm.svelte';



  // Edit Todo State
  let editingTodoId: string | null = null;

  // Delete State
  let showDeleteAllConfirm = false;
  let showDeleteTodoConfirm = false;
  let deletingTodoId: string | null = null;
  let isDeleting = false;
  let isDeletingAll = false;

  let confirmDialogElement: HTMLElement;

  function handleClickOutside(event: MouseEvent) {
    if (showDeleteAllConfirm && confirmDialogElement && !confirmDialogElement.contains(event.target as Node)) {
      showDeleteAllConfirm = false;
    }
  }

  onMount(() => {
    document.addEventListener('mousedown', handleClickOutside);

    const unsubscribeAuth = authStore.subscribe((auth) => {
      if (!auth.loading) {
        if (!auth.user) {
          goto('/');
        } else {
          subscribeTodos(auth.user.uid);
        }
      }
    });

    return () => {
      unsubscribeAuth();
      unsubscribeTodos();
      document.removeEventListener('mousedown', handleClickOutside);
    };
  });

  // Edit Todo Handlers
  function handleEditTodo(event: CustomEvent) {
    const todo = event.detail;
    editingTodoId = todo.id;
  }

  function handleSaveEdit() {
    editingTodoId = null;
  }

  function handleCancelEdit() {
    editingTodoId = null;
  }

  // Delete Todo Handlers
  function handleDeleteTodo(event: CustomEvent) {
    const todoId = event.detail;
    deletingTodoId = todoId;
    showDeleteTodoConfirm = true;
  }

  async function executeDeleteTodo() {
    if (!deletingTodoId || isDeleting) return;
    
    isDeleting = true;
    const success = await deleteTodo(deletingTodoId);
    isDeleting = false;
    showDeleteTodoConfirm = false;
    deletingTodoId = null;
    
    if (!success) {
      toast.error("Failed to delete todo");
    }
  }

  function cancelDeleteTodo() {
    showDeleteTodoConfirm = false;
    deletingTodoId = null;
  }

  // Delete All Handlers
  function handleDeleteAll() {
    showDeleteAllConfirm = true;
  }

  async function executeDeleteAll() {
    if (!$authStore.user || isDeletingAll) return;

    isDeletingAll = true;
    const success = await deleteAllTodos($authStore.user.uid);
    isDeletingAll = false;
    showDeleteAllConfirm = false;
  }

  function cancelDeleteAll() {
    showDeleteAllConfirm = false;
  }

  // Toggle Todo Handler
  async function handleToggleTodo(event: CustomEvent) {
    const todoId = event.detail;
    const success = await toggleTodo(todoId);
    if (!success) {
      toast.error("Failed to update todo status");
    }
  }
</script>

<ConfirmDialog
  bind:this={confirmDialogElement}
  bind:show={showDeleteAllConfirm}
  title="Delete All Todos"
  message="Are you sure you want to delete all {$todosStore.length} todos? This will permanently remove all your todos and their associated files."
  on:confirm={executeDeleteAll}
  on:cancel={cancelDeleteAll}
/>

<ConfirmDialog
  bind:show={showDeleteTodoConfirm}
  title="Delete Todo"
  message="Are you sure you want to delete this todo? This cannot be undone."
  on:confirm={executeDeleteTodo}
  on:cancel={cancelDeleteTodo}
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
        <div class="bg-slate-50 rounded-lg shadow-md p-6 mb-6 border border-slate-200 lg:mb-0">
          <h1 class="select-none text-xl font-bold text-stone-800 mb-4 pb-3 border-b border-slate-200">
            Add New Todo
          </h1>
          <!-- Add Todo Form Component -->
          <AddTodoForm />

          <!-- Dashboard Stats Component -->
          <DashboardStats 
            todosStore={todosStore} 
            todosLoading={$todosLoading} 
          />
        </div>
        
        <div class="bg-slate-50 rounded-lg shadow-md p-6 border border-slate-200 flex flex-col max-h-[700px]">
          
          
          <!-- Todos Section Header Component -->
          <TodosSectionHeader 
            todosStore={todosStore} 
            todosLoading={$todosLoading} 
            isDeleting={isDeletingAll}
            on:deleteAll={handleDeleteAll} 
          />
          
          <div class="mt-4 overflow-y-auto pr-2">
              <!-- Todo List Component -->
          <TodoList 
            todosStore={todosStore}
            todosLoading={$todosLoading}
            todosError={todosError}
            editingTodoId={editingTodoId}
            isDeleting={isDeleting}
            deletingTodoId={deletingTodoId}
            on:edit={handleEditTodo}
            on:delete={handleDeleteTodo}
            on:toggle={handleToggleTodo}
            on:saveEdit={handleSaveEdit}
            on:cancelEdit={handleCancelEdit}
          />
          </div>
          
        </div>
      </div>
    </div>
  </div>
{/if}