<script lang="ts">
  //Import necessary modules
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore } from '$lib/utils/auth_lce';
  import LoadingSpinner from '$lib/components/LoadingSpinner.svelte';
  
  //Check authentication status when component mounts
  onMount(() => {
    // Subscribe to auth store changes
    const unsubscribe = authStore.subscribe((auth) => {
      // If user is authenticated and not loading, redirect to dashboard
      if (auth.user && !auth.loading) {
        goto('/dashboard');
      }
    });
    
    //Cleanup subscription when component is destroyed
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
    <div class="w-full max-w-md bg-slate-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
      <!-- Welcome header -->
      <div class="text-center mb-6 sm:mb-8">
        <h1 class="select-none text-3xl font-bold text-blue-700 mb-2">
          <span>&#x1F4DD;</span> Welcome to Todo App
        </h1>
        <p class="select-none text-gray-500 text-sm sm:text-base">
          Organize your tasks and boost your productivity
        </p>
      </div>
      
      <!-- Authentication options -->
      <div class="space-y-3 sm:space-y-4">
        <!-- Login button -->
        <a 
          href="/login"
          class="select-none w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg text-center block shadow-md cursor-pointer"
        >
          Login to Your Account
        </a>
        
        <!-- Signup button -->
        <a 
          href="/signup"
          class="select-none w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg text-center block shadow-md cursor-pointer"
        >
          Create New Account
        </a>
      </div>
      
      <!-- Features list -->
      <div class="mt-6 sm:mt-8 text-sm text-gray-600">
        <h3 class="select-none font-semibold mb-3 text-gray-700">Features:</h3>
        <ul class="space-y-2">
          <li class="select-none flex items-center">
            <span class="select-nonde text-green-500 mr-2">&#10003;</span>
            Create and manage your todos
          </li>
          <li class="select-none flex items-center">
            <span class="select-none text-green-500 mr-2">&#10003;</span>
            Mark tasks as complete
          </li>
          <li class="select-none flex items-center">
            <span class="select-none text-green-500 mr-2">&#10003;</span>
            Secure user authentication
          </li>
          <li class="select-none flex items-center">
            <span class="select-none text-green-500 mr-2">&#10003;</span>
            Real-time updates
          </li>
        </ul>
      </div>
      
      <!-- Footer -->
      <div class="mt-6 sm:mt-8 text-center">
        <p class="select-none text-xs text-gray-400">
          Get started by creating an account or logging in
        </p>
      </div>
    </div>
  </div>
{/if}