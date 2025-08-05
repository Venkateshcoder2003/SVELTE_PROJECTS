<script lang="ts">
  // Import Spinner component
  import LoadingSpinner from './LoadingSpinner.svelte';
  
  export let type: 'button' | 'submit' = 'button';
  export let disabled: boolean = false;
  export let loading: boolean = false;
  export let loadingText: string = 'Loading...';
  export let text: string;
  export let buttonClass: string = 'select-none bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed w-full rounded-xl p-3 font-bold text-white cursor-pointer transition-colors';
  export let spinnerColor: string = 'white';
  export let spinnerSize: 'small' | 'medium' | 'large' = 'small';
</script>

<button
  {type}
  {disabled}
  class={buttonClass}
  on:click
>
  {#if loading}
    <div class="flex items-center justify-center">
      <div class="mr-3">
        <LoadingSpinner 
          size={spinnerSize} 
          color={spinnerColor} 
          showContainer={false} 
        />
      </div>
      {loadingText}
    </div>
  {:else}
    {text}
  {/if}
</button>