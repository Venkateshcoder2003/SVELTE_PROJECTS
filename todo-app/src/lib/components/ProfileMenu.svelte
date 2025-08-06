<script lang="ts">
  // Import requires modules
  import { createEventDispatcher, onMount, onDestroy } from 'svelte';
  import Button from '$lib/components/Button.svelte';
  
  export let userEmail: string | undefined;
  export let creationTime: string | undefined;
  export let isLoggingOut: boolean;
  
  const dispatch = createEventDispatcher();
  
  let showProfileMenu = false;
  let profileMenu: HTMLElement;
  
  function handleToggleMenu() {
    showProfileMenu = !showProfileMenu;
  }
  
  function handleLogout() {
    showProfileMenu = false;
    dispatch('logout');
  }
  
  function formatCreationDate(dateString: string | undefined): string {
    if (!dateString) return 'Member';
    return `Active Since ${new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
    })}`;
  }
  
  function handleClickOutside(event: MouseEvent) {
    if (showProfileMenu && profileMenu && !profileMenu.contains(event.target as Node)) {
      showProfileMenu = false;
    }
  }
  
  function handleKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape' && showProfileMenu) {
      showProfileMenu = false;
    }
  }
  
  onMount(() => {
    window.addEventListener('click', handleClickOutside);
    window.addEventListener('keydown', handleKeydown);
  });
  
  onDestroy(() => {
    window.removeEventListener('click', handleClickOutside);
    window.removeEventListener('keydown', handleKeydown);
  });
</script>

<div class="relative" bind:this={profileMenu}>
  <!-- Circular Profile Button -->
  <button
    on:click={handleToggleMenu}
    class="select-none w-10 h-10 bg-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg hover:bg-purple-700 transition-colors focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-slate-900"
    aria-label="Open user menu"
    aria-expanded={showProfileMenu}
    aria-haspopup="true"
  >
    {userEmail?.[0]?.toUpperCase() || 'U'}
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
          {userEmail || 'Unknown User'}
        </p>
        <p class="select-none text-xs text-gray-500">
          {formatCreationDate(creationTime)}
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