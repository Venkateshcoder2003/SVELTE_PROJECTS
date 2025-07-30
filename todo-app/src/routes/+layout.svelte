<script lang="ts">
  import '../app.css';
  import Navigation from '$lib/components/Navigation.svelte';

  // Import authentication store
  import { authStore } from '$lib/stores/auth';
  import { Toaster } from 'svelte-sonner';
</script>
<Toaster richColors /> 
<div class="min-h-screen bg-gray-50">
  {#if $authStore.user}
    <Navigation />
  {/if}

  <main class="container mx-auto px-4 py-8">
    <slot />
  </main>
</div>