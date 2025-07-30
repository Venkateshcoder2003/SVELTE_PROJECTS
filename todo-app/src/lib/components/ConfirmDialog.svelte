<script lang="ts">
  import { createEventDispatcher } from 'svelte';

  // Props to control the dialog
  export let show = false;
  export let title = 'Are you sure?';
  export let message = 'This action cannot be undone.';

  const dispatch = createEventDispatcher();

  function handleConfirm() {
    dispatch('confirm');
    show = false;
  }

  function handleCancel() {
    dispatch('cancel');
    show = false;
  }
</script>

{#if show}
  <div 
    class="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50"
    on:click={handleCancel}
  >
    <div 
      class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4"

    >
      <h3 class="text-xl font-bold text-gray-800 mb-2">{title}</h3>
      <p class="text-gray-600 mb-6">{message}</p>

      <div class="flex justify-end space-x-3">
        <button 
          on:click={handleCancel}
          class="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-md font-medium"
        >
          Cancel
        </button>
        <button 
          on:click={handleConfirm}
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md font-medium"
        >
          Confirm Delete
        </button>
      </div>
    </div>
  </div>
{/if}