<script lang="ts">
  export let error: string = '';
</script>

{#if error}
  <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
    {error}
  </div>
{/if}