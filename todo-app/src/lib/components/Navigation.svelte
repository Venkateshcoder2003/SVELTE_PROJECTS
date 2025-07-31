<script lang="ts">
  // Import necessary modules
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, signOutUser } from '$lib/stores/auth';
  import { toast } from 'svelte-sonner';

  //State to control the visibility of the profile dropdown
  let showProfileMenu = false;

  //Function to handle user logout
  async function handleLogout() {
    showProfileMenu = false; //Close menu on logout
    await signOutUser();
    toast.success("You have been logged out.");
    goto('/');
  }

  //Helper function to format the creation date
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

  //Add the event listener when the component mounts
  onMount(() => {
    window.addEventListener('click', handleClickOutside);
  });

  //Clean up the event listener when the component is destroyed
  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
  });
</script>

<nav class="bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-700 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      
      <a href="/dashboard" class="flex items-center space-x-2 text-xl font-bold text-slate-200 hover:text-white transition-colors">
        <span class="text-2xl">📝</span>
        <h1>Todo App</h1>
      </a>
      
      <!-- Container for the profile button and dropdown -->
      <div class="relative" bind:this={profileMenu}>
        <!-- NEW: Circular Profile Button -->
        <button
          on:click={() => showProfileMenu = !showProfileMenu}
          class="w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-white"
          aria-label="Open user menu"
        >
          <!-- Show the first letter of the user's email -->
          {$authStore.user?.email?.[0].toUpperCase()}
        </button>

        <!-- NEW: Profile Dropdown Menu -->
        {#if showProfileMenu}
          <div class="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-xl py-1 z-50 ring-1 ring-black ring-opacity-5">
            <!-- User Info Section -->
            <div class="px-4 py-3 border-b border-gray-200">
              <p class="text-sm text-gray-800 font-semibold truncate">
                {$authStore.user?.email}
              </p>
              <p class="text-xs text-gray-500">
                {formatCreationDate($authStore.user?.creationTime)}
              </p>
            </div>
            <!-- Logout Button Section -->
            <div class="py-1">
              <button
                on:click={handleLogout}
                class="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-3"
              >
                <!-- Logout Icon -->
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
                </svg>
                <span>Logout</span>
              </button>
            </div>
          </div>
        {/if}
      </div>
    </div>
  </div>
</nav>