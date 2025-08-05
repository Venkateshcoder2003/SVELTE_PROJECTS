<script lang="ts">
  // Import necessary modules
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/authentication/auth_lce';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  import WelcomePage from '$lib/components/WelcomePage.svelte';
  
  
  // Check authentication status when component mounts
  onMount(() => {
    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe((auth) => {
      // If user is authenticated and not loading, redirect to dashboard
      if (auth.user && !auth.loading) {
        goto('/dashboard');
      }
    });
    
    // Cleanup subscription when component is destroyed
    return unsubscribe;
  });
</script>

<!-- Show loading while checking authentication -->
{#if $authStore.loading}
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    <LoadingSpinner 
      size="large" 
      color="blue-500" 
      showContainer={false}
    />
  </div>

<!-- Show welcome page for non-authenticated users -->
{:else if !$authStore.user}
  <div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
    
    <!-- Welcome page Component -->
    <WelcomePage />
    
  </div>
{/if}