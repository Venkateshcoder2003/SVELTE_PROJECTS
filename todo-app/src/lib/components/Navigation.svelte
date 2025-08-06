<script lang="ts">
  // Import necessary modules
  import { goto } from '$app/navigation';
  import { signOutUser } from '$lib/authentication/auth_actions';
  import { Logger } from '$lib/utils/logger';
  import { authStore } from '$lib/authentication/auth_lce';
  import ProfileMenu from './ProfileMenu.svelte';

  let isLoggingOut = false;

  // Function to handle user logout
  async function handleLogout() {
    isLoggingOut = true;
    try {
      await signOutUser();
      goto('/');
    } catch (error) {
      Logger.error('Logout failed:', error);
    } finally {
      isLoggingOut = false;
    }
  }
</script>

<nav class="bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-700 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      
      <!-- Logo/Brand -->
      <a 
        href="/dashboard" 
        class="flex items-center space-x-2 text-xl font-bold text-slate-200 hover:text-white transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900 rounded-md px-2 py-1"
      >
        <span class="select-none text-2xl" aria-hidden="true">📝</span>
        <h1 class="select-none">Todo App</h1>
      </a>
      
      <!-- Profile Menu Component -->
      <ProfileMenu 
        userEmail={$authStore.user?.email}
        creationTime={$authStore.user?.creationTime}
        {isLoggingOut}
        on:logout={handleLogout}
      />
      
    </div>
  </div>
</nav>