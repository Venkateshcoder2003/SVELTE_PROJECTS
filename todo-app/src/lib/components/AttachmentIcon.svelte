<script lang="ts">
  export let type: 'image' | 'video';
</script>

<!-- 
  This button displays an icon for an image or video.
  It uses `on:click` to let the parent component know it has been clicked.
-->
<button 
  on:click 
  class="flex items-center space-x-1 text-xs text-gray-500 hover:text-blue-600 transition-colors duration-200"
  title={type === 'image' ? 'View Image' : 'View Video'}
>
  {#if type === 'image'}
    <!-- Image Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
    </svg>
    <span>Image</span>
  {:else}
    <!-- Video Icon -->
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
      <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 001.553.832l3-2a1 1 0 000-1.664l-3-2z" />
    </svg>
    <span>Video</span>
  {/if}
</button>
