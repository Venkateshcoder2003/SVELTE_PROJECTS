<script lang="ts">
  import '../app.css';
  import Navigation from '$lib/components/Navigation.svelte';

  //Import authentication store
  import { authStore } from '$lib/authentication/auth_lce';
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

<style>
  /* Use a media query to target screens smaller than 640px */
  @media (max-width: 640px) {
    /* [data-sonner-toast] is the selector for the toast component.
      We use !important to ensure these styles override the library's defaults.
    */
    :global([data-sonner-toast]) {
      font-size: 0.875rem !important; /* Smaller font */
      padding: 12px 16px !important;   /* Smaller padding */
    }
  }
</style>