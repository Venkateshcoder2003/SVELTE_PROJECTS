<script lang="ts">
  export let size: 'small' | 'medium' | 'large' = 'medium';
  export let color: string = 'blue-500';
  export let showContainer: boolean = true;
  export let containerClass: string = 'flex justify-center items-center min-h-[400px]';
  
  $: spinnerSize = size === 'small' ? 'h-4 w-4' : size === 'medium' ? 'h-8 w-8' : 'h-12 w-12';
</script>

{#if showContainer}
  <div class={containerClass}>
    <div class="animate-spin rounded-full {spinnerSize} border-b-2 border-{color}"></div>
  </div>
{:else}
  <div class="animate-spin rounded-full {spinnerSize} border-b-2 border-{color}"></div>
{/if}