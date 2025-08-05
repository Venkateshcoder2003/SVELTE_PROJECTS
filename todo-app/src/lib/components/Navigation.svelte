<script lang="ts">
  // Import necessary modules
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { signOutUser } from '$lib/authentication/auth_actions';
  import { Logger } from '$lib/utils/logger';
  import { authStore } from '$lib/authentication/auth_lce';
  import Button from '$lib/components/Button.svelte';

  // State to control the visibility of the profile dropdown
  let showProfileMenu = false;
  let isLoggingOut = false;

  // Function to handle user logout
  async function handleLogout() {
    showProfileMenu = false; // Close menu on logout
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

  // Helper function to format the creation date
  function formatCreationDate(dateString: string | undefined): string {
    if (!dateString) return 'Member';
    return `Active Since ${new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })}`;
  }

  // --- Logic to close the menu when clicking outside ---
  let profileMenu: HTMLElement;

  function handleClickOutside(event: MouseEvent) {
    // If the menu is open and the click is outside the menu, close it
    if (showProfileMenu && profileMenu && !profileMenu.contains(event.target as Node)) {
      showProfileMenu = false;
    }
  }

  // Handle escape key to close menu
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showProfileMenu) {
      showProfileMenu = false;
    }
  }

  // Add the event listeners when the component mounts
  onMount(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeydown);
  });

  // Clean up the event listeners when the component is destroyed
  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleKeydown);
  });
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
      
      <!-- Container for the profile button and dropdown -->
      <div class="relative" bind:this={profileMenu}>
        <!-- Circular Profile Button -->
        <button
          on:click={() => showProfileMenu = !showProfileMenu}
          class="select-none w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
          aria-label="Open user menu"
          aria-expanded={showProfileMenu}
          aria-haspopup="true"
        >
          <!-- Show the first letter of the user's email -->
          {$authStore.user?.email?.[0]?.toUpperCase() || 'U'}
        </button>

        <!-- Profile Dropdown Menu -->
        {#if showProfileMenu}
          <div 
            class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5 animate-in slide-in-from-top-2 duration-200"
            role="menu"
            aria-orientation="vertical"
            aria-labelledby="user-menu-button"
          >
            <!-- User Info Section -->
            <div class="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <p class="select-none text-sm text-gray-800 font-semibold truncate">
                {$authStore.user?.email || 'Unknown User'}
              </p>
              <p class="select-none text-xs text-gray-500">
                {formatCreationDate($authStore.user?.creationTime)}
              </p>
            </div>
            
            <!-- Actions Section -->
            <div class="py-1">
              <Button
                type="button"
                text="Logout"
                loadingText="Logging out..."
                loading={isLoggingOut}
                disabled={isLoggingOut}
                buttonClass="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 transition-colors focus:outline-none focus:bg-gray-100"
                spinnerColor="gray-600"
                spinnerSize="small"
                on:click={handleLogout}
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>