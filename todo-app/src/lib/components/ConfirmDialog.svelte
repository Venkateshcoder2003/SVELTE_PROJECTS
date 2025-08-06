<script lang="ts">
  // Import 
  import { createEventDispatcher } from 'svelte';
  import Button from '$lib/components/Button.svelte';

  // Props to control the dialog
  export let show = false;
  export let title = 'Are you sure?';
  export let message = 'This action cannot be undone.';
  export let confirmText = 'Confirm Delete';
  export let cancelText = 'Cancel';
  export let isLoading = false;
  
  // Create a dispatch event
  const dispatch = createEventDispatcher();

  function handleConfirm() {
    dispatch('confirm');
  }

  function handleCancel() {
    dispatch('cancel');
    show = false;
  }

  function handleBackdropClick(event: MouseEvent) {
    // Only close if clicking the backdrop, not the modal content
    if (event.target === event.currentTarget) {
      handleCancel();
    }
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
    on:click={handleBackdropClick}
  >
    <div 
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"
    >
      <h3 class="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p class="text-gray-600 mb-6">{message}</p>

      <div class="flex flex-col sm:flex-row gap-3 sm:justify-end">
        <div class="w-full sm:w-auto">
          <Button
            type="button"
            text={cancelText}
            disabled={isLoading}
            buttonClass="w-full sm:w-auto bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed text-gray-800 px-4 py-2 rounded-md font-medium transition-colors"
            on:click={handleCancel}
          />
        </div>
        <div class="w-full sm:w-auto">
          <Button
            type="button"
            text={confirmText}
            loadingText="Processing..."
            loading={isLoading}
            disabled={isLoading}
            buttonClass="w-full sm:w-auto bg-red-500 hover:bg-red-600 disabled:bg-red-300 disabled:cursor-not-allowed text-white px-4 py-2 rounded-md font-medium transition-colors"
            spinnerColor="white"
            on:click={handleConfirm}
          />
        </div>
      </div>
    </div>
  </div>
{/if}