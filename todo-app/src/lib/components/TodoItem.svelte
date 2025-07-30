<script lang="ts">
  //Import necessary modules
  import { toggleTodo, deleteTodo, updateTodo } from '$lib/stores/todos';
  import type { Todo } from '$lib/types';
  import { toast } from "svelte-sonner";
  import ConfirmDialog from './ConfirmDialog.svelte'; 


  export let todo: Todo; //The todo object to display
  
  //Component state variables
  let isEditing = false;
  let editText = todo.text;
  let isToggling = false;
  let isDeleting = false;
  let isUpdating = false;
  let editError = '';
  let showConfirmDialog = false; 
  
  //Maximum character limit for todos
  const MAX_CHARACTERS = 250;
  
  //Reactive statement to calculate remaining characters while editing
  $: remainingChars = MAX_CHARACTERS - editText.length;
  
  //Function to handle todo completion toggle
  async function handleToggle() {
    if (isToggling) return;
    
    isToggling = true;
    const success = await toggleTodo(todo.id);
    isToggling = false;
    
    if (!success) {
      toast.error("Failed to toggle todo");
    }
  }
  
  //This function now just OPENS the dialog
  function handleDelete() {
    if (isDeleting) return;
    showConfirmDialog = true;
  }

  //This new function runs AFTER the user confirms
  async function executeDelete() {
    if (isDeleting) return;

    isDeleting = true;
    const success = await deleteTodo(todo.id);
    isDeleting = false;
    
    if (!success) {
      //Error is handled by the store, just log for debugging
      console.error('Failed to delete todo');
    }
  }
  
  // Function to start editing mode
  function startEditing() {
    isEditing = true;
    editText = todo.text;
    editError = '';
  }
  
  // Function to cancel editing
  function cancelEditing() {
    isEditing = false;
    editText = todo.text;
    editError = '';
  }
  
  // Function to save edited todo
  async function saveEdit() {
    if (isUpdating) return;
    
    editError = '';
    
    if (!editText.trim()) {
      editError = 'Todo text cannot be empty';
      return;
    }
    
    if (editText.length > MAX_CHARACTERS) {
      editError = `Todo text cannot exceed ${MAX_CHARACTERS} characters`;
      return;
    }
    
    if (editText.trim() === todo.text) {
      isEditing = false;
      return;
    }
    
    isUpdating = true;
    const success = await updateTodo(todo.id, editText.trim());
    isUpdating = false;
    
    if (success) {
      isEditing = false;
      editError = '';
    }
  }
  
  //Function to handle Enter key press while editing
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  }
  
  //Function to format date for display
  function formatDate(date: Date): string {
    const now = new Date();
    const diffTime = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    } else if (diffDays === 1) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined });
    }
  }
</script>

<ConfirmDialog 
  bind:show={showConfirmDialog}
  title="Delete Todo"
  message="Are you sure you want to delete this todo? This cannot be undone."
  on:confirm={executeDelete}
  on:cancel={() => showConfirmDialog = false}
/>

<div 
  class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200"
  class:opacity-75={todo.completed}
  class:bg-green-50={todo.completed}
  class:border-green-200={todo.completed}
>
  {#if isEditing}
    <div class="space-y-3">
      <div>
        <textarea
          bind:value={editText}
          on:keypress={handleKeyPress}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          class:border-red-300={editError}
          rows="2"
          disabled={isUpdating}
        ></textarea>
        
        <div class="flex justify-between items-center mt-1">
          <div class="text-xs text-gray-500">
            Press Enter to save, Escape to cancel
          </div>
          <div class="text-xs" class:text-red-500={remainingChars < 0} class:text-yellow-500={remainingChars < 50 && remainingChars >= 0} class:text-gray-500={remainingChars >= 50}>
            {remainingChars} characters remaining
          </div>
        </div>
      </div>
      
      {#if editError}
        <div class="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm">
          {editError}
        </div>
      {/if}
      
      <div class="flex space-x-2">
        <button
          on:click={saveEdit}
          disabled={isUpdating || !editText.trim() || editText.length > MAX_CHARACTERS}
          class="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
        >
          {#if isUpdating}
            <span class="flex items-center">
              <div class="animate-spin rounded-full h-3 w-3 border-b border-white mr-1"></div>
              Saving...
            </span>
          {:else}
            Save
          {/if}
        </button>
        
        <button
          on:click={cancelEditing}
          disabled={isUpdating}
          class="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm font-medium transition-colors duration-200"
        >
          Cancel
        </button>
      </div>
    </div>
    
  {:else}
    <div class="flex items-start space-x-3">
      <button
        on:click={handleToggle}
        disabled={isToggling}
        class="flex-shrink-0 w-5 h-5 mt-1 rounded border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        class:bg-green-500={todo.completed}
        class:border-green-500={todo.completed}
        class:hover:border-green-400={!todo.completed}
      >
        {#if isToggling}
          <div class="animate-spin rounded-full h-3 w-3 border-b border-gray-400 m-auto"></div>
        {:else if todo.completed}
          <svg class="w-3 h-3 text-white m-auto" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
          </svg>
        {/if}
      </button>
      
      <div class="flex-grow min-w-0">
        <p 
          class="text-gray-800 break-words"
          class:line-through={todo.completed}
          class:text-green-700={todo.completed}
        >
          {todo.text}
        </p>
        
        <div class="mt-3 space-y-3">
          {#if todo.imageUrl}
            <img src={todo.imageUrl} alt="Todo attachment" class="rounded-lg max-h-60" />
          {/if}
          {#if todo.videoUrl}
            <video src={todo.videoUrl} controls class="rounded-lg w-full"></video>
          {/if}
        </div>
        <div class="flex items-center justify-between mt-2">
          <div class="text-xs text-gray-500">
            Created {formatDate(todo.createdAt)}
          </div>
          
          <div class="flex space-x-2">
            <button
              on:click={startEditing}
              disabled={isDeleting}
              class="text-blue-500 hover:text-blue-600 text-xs font-medium px-2 py-1 rounded transition-colors duration-200"
              title="Edit todo"
            >
              ✏️ Edit
            </button>
            
            <button
              on:click={handleDelete}
              disabled={isDeleting}
              class="text-red-500 hover:text-red-600 text-xs font-medium px-2 py-1 rounded transition-colors duration-200"
              title="Delete todo"
            >
              {#if isDeleting}
                <span class="flex items-center">
                  <div class="animate-spin rounded-full h-3 w-3 border-b border-red-500 mr-1"></div>
                  Deleting...
                </span>
              {:else}
                🗑️ Delete
              {/if}
            </button>
          </div>
        </div>
      </div>
    </div>
  {/if}
</div>