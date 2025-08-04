<script lang="ts">
  // Import necessary modules
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { signOutUser } from '$lib/stores/auth';
  import { Logger } from '$lib/utils/logger';
  import { authStore } from '$lib/utils/auth_lce';
  import Button from '$lib/components/Button.svelte';

  // State to control the visibility of the profile dropdown
  let showProfileMenu = false;
  let isLoggingOut = false;

  // Function to handle user logout
  async function handleLogout() {
    showProfileMenu = false; // Close menu on logout
    isLoggingOut = true;
    await signOutUser();
    isLoggingOut = false;
    goto('/');
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
    if (showProfileMenu && !profileMenu.contains(event.target)) {
      showProfileMenu = false;
    }
  }

  // Add the event listener when the component mounts
  onMount(() => {
    window.addEventListener('click', handleClickOutside);
  });

  // Clean up the event listener when the component is destroyed
  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<nav class="bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-700 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      
      <a href="/dashboard" class="flex items-center space-x-2 text-xl font-bold text-slate-200 hover:text-white transition-colors">
        <span class="select-none text-2xl"><span>&#x1F4DD;</span></span>
        <h1 class="select-none">Todo App</h1>
      </a>
      
      <!-- Container for the profile button and dropdown -->
      <div class="relative" bind:this={profileMenu}>
        <!-- NEW: Circular Profile Button -->
        <button
          on:click={() => showProfileMenu = !showProfileMenu}
          class="select-none w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white"
          aria-label="Open user menu"
        >
          <!-- Show the first letter of the user's email -->
          {$authStore.user?.email?.[0].toUpperCase()}
        </button>

        <!-- NEW: Profile Dropdown Menu -->
        {#if showProfileMenu}
          <div class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
            <!-- User Info Section -->
            <div class="hover:bg-gray-100 px-4 py-3 border-b border-gray-200">
              <p class="hover:bg-gray-100 select-none text-sm text-gray-800 font-semibold truncate">
                {$authStore.user?.email}
              </p>
              <p class="hover:bg-gray-100 select-none text-xs text-gray-500">
                {formatCreationDate($authStore.user?.creationTime)}
              </p>
            </div>
            <!-- Logout Button Section -->
            <div class="py-1">
              <Button
                type="button"
                text="Logout"
                loadingText="Logging out..."
                loading={isLoggingOut}
                disabled={isLoggingOut}
                buttonClass="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 disabled:bg-gray-50 disabled:cursor-not-allowed flex items-center space-x-3 transition-colors"
                spinnerColor="gray-600"
                on:click={handleLogout}
              />
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>