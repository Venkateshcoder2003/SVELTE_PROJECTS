<script lang="ts">
  // Import necessary modules
  import { toggleTodo, deleteTodo, updateTodo } from '$lib/stores/todos';
  import type { Todo } from '$lib/types';
  import { toast } from "svelte-sonner";
  import ConfirmDialog from './ConfirmDialog.svelte';
  import AttachmentIcon from './AttachmentIcon.svelte';

  //Prop
  export let todo: Todo;

  // Component state variables
  let isEditing = false;
  let editText = todo.text;
  let isToggling = false;
  let isDeleting = false;
  let isUpdating = false;
  let editError = '';
  let showConfirmDialog = false;
  let showAttachments = false;
  
  let editImageFile: File | null = null;
  let editVideoFile: File | null = null;

  const MAX_CHARACTERS = 250;
  $: remainingChars = MAX_CHARACTERS - editText.length;

  function handleEditFileSelect(event: Event, type: 'image' | 'video') {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (type === 'image') {
      editImageFile = file || null;
    } else {
      editVideoFile = file || null;
    }
  }

  async function handleToggle() {
    if (isToggling) return;
    isToggling = true;
    const success = await toggleTodo(todo.id);
    isToggling = false;
    if (!success) {
      toast.error("Failed to update todo status.");
    }
  }

  function handleDelete() {
    if (isDeleting) return;
    showConfirmDialog = true;
  }

  async function executeDelete() {
    if (isDeleting) return;
    isDeleting = true;
    const success = await deleteTodo(todo.id);
    isDeleting = false;
    if (!success) {
      toast.error("Failed to delete todo.");
    }
  }

  function startEditing() {
    isEditing = true;
    editText = todo.text;
    editError = '';
    editImageFile = null;
    editVideoFile = null;
    showAttachments = false;
  }

  function cancelEditing() {
    isEditing = false;
  }

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

    const textChanged = editText.trim() !== todo.text;
    const filesChanged = editImageFile || editVideoFile;
    if (!textChanged && !filesChanged) {
      isEditing = false;
      return;
    }

    isUpdating = true;
    
    const updates = {
      newText: textChanged ? editText.trim() : undefined,
      imageFile: editImageFile,
      videoFile: editVideoFile,
    };

    const success = await updateTodo(todo.id, updates, todo);
    isUpdating = false;

    if (success) {
      isEditing = false;
    }
  }

  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    } else if (event.key === 'Escape') {
      cancelEditing();
    }
  }

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
  class="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow duration-200 h-full flex flex-col"
  class:opacity-75={todo.completed}
  class:bg-green-50={todo.completed}
  class:border-green-200={todo.completed}
>
  {#if isEditing}
    <!-- Edit mode -->
    <div class="space-y-3 flex flex-col h-full">
      <!-- Edit textarea -->
      <div>
        <textarea
          bind:value={editText}
          on:keypress={handleKeyPress}
          class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="2"
          disabled={isUpdating}
        ></textarea>
      </div>

      <!-- File inputs for edit mode -->
      <div class="space-y-3">
        <div>
          <label for="edit-image-{todo.id}" class="block text-sm font-medium text-gray-700 mb-1">
            Change Image
          </label>
          <input 
            id="edit-image-{todo.id}" 
            type="file" 
            accept="image/*"
            on:change={(e) => handleEditFileSelect(e, 'image')}
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            disabled={isUpdating}
          />
        </div>
        <div>
          <label for="edit-video-{todo.id}" class="block text-sm font-medium text-gray-700 mb-1">
            Change Video
          </label>
          <input 
            id="edit-video-{todo.id}" 
            type="file" 
            accept="video/*"
            on:change={(e) => handleEditFileSelect(e, 'video')}
            class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            disabled={isUpdating}
          />
        </div>
      </div>
      
      <!-- This div pushes the buttons to the bottom -->
      <div class="flex-grow"></div>

      <!-- Character count, errors, and action buttons -->
      <div class="flex justify-between items-center mt-1">
        <div class="text-xs text-gray-500">
          Enter to save, Esc to cancel
        </div>
        <div class="text-xs" class:text-red-500={remainingChars < 0}>
          {remainingChars} characters remaining
        </div>
      </div>
      
      {#if editError}
        <div class="bg-red-50 border border-red-200 text-red-600 px-3 py-2 rounded-md text-sm mt-2">
          {editError}
        </div>
      {/if}
      
      <div class="flex space-x-2 mt-2">
        <button
          on:click={saveEdit}
          disabled={isUpdating || !editText.trim() || editText.length > MAX_CHARACTERS}
          class="bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-3 py-1 rounded text-sm font-medium"
        >
          {#if isUpdating}
            <span>Saving...</span>
          {:else}
            Save
          {/if}
        </button>
        <button
          on:click={cancelEditing}
          disabled={isUpdating}
          class="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-3 py-1 rounded text-sm font-medium"
        >
          Cancel
        </button>
      </div>
    </div>
    
  {:else}
    <!-- Display mode -->
    <div class="flex flex-col h-full">
      <div class="flex items-start space-x-3">
        <button
          on:click={handleToggle}
          disabled={isToggling}
          class="flex-shrink-0 w-5 h-5 mt-1 rounded border-2 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          class:bg-green-500={todo.completed}
          class:border-green-500={todo.completed}
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
        </div>
      </div>
      
      {#if showAttachments}
        <div class="mt-3 space-y-3 flex-grow w-full">
          {#if todo.imageUrl}
            <img src={todo.imageUrl} alt="Todo attachment" class="rounded-lg max-h-60 w-full object-cover" />
          {/if}
          {#if todo.videoUrl}
            <video src={todo.videoUrl} controls class="rounded-lg w-full">
              <track kind="captions" />
            </video>
          {/if}
        </div>
      {/if}

      <div class="flex-grow"></div>

      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-2 w-full gap-2">
        <div class="flex items-center gap-2">
          {#if todo.imageUrl}
            <AttachmentIcon type="image" on:click={() => showAttachments = !showAttachments} />
          {/if}
          {#if todo.videoUrl}
            <AttachmentIcon type="video" on:click={() => showAttachments = !showAttachments} />
          {/if}
        </div>
        
        <div class="flex items-center justify-between w-full sm:w-auto sm:gap-2">
           <div class="text-xs text-gray-500">
            Created {formatDate(todo.createdAt)}
          </div>
          <div class="flex space-x-2">
            <button on:click={startEditing} disabled={isDeleting} class="text-blue-500 hover:text-blue-600 text-xs font-medium" title="Edit todo">
              ✏️ Edit
            </button>
            <button on:click={handleDelete} disabled={isDeleting} class="text-red-500 hover:text-red-600 text-xs font-medium" title="Delete todo">
              {#if isDeleting}
                <span>Deleting...</span>
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
