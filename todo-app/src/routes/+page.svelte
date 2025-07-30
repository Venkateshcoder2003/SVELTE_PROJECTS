<script lang="ts">
  // Import necessary modules
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/stores/auth';
  
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
  <div class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>

<!-- Show welcome page for non-authenticated users -->
{:else if !$authStore.user}
  <div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
    <!-- Welcome header -->
    <div class="text-center mb-8">
      <h1 class="text-3xl font-bold text-gray-800 mb-2">
        📝 Welcome to Todo App
      </h1>
      <p class="text-gray-600">
        Organize your tasks and boost your productivity
      </p>
    </div>
    
    <!-- Authentication options -->
    <div class="space-y-4">
      <!-- Login button -->
      <a 
        href="/login"
        class="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-4 rounded-md text-center block transition-colors duration-200"
      >
        Login to Your Account
      </a>
      
      <!-- Signup button -->
      <a 
        href="/signup"
        class="w-full bg-gray-500 hover:bg-gray-600 text-white font-medium py-3 px-4 rounded-md text-center block transition-colors duration-200"
      >
        Create New Account
      </a>
    </div>
    
    <!-- Features list -->
    <div class="mt-8 text-sm text-gray-600">
      <h3 class="font-medium mb-2">Features:</h3>
      <ul class="list-disc list-inside space-y-1">
        <li>Create and manage your todos</li>
        <li>Mark tasks as complete</li>
        <li>Secure user authentication</li>
        <li>Real-time updates</li>
      </ul>
    </div>
  </div>
{/if}