<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { authStore, signOutUser } from '$lib/stores/auth';
  import { toast } from 'svelte-sonner';

  // Protect the route: redirect if not logged in
  onMount(() => {
    const unsubscribe = authStore.subscribe((auth) => {
      if (!auth.loading && !auth.user) {
        goto('/');
      }
    });
    return unsubscribe;
  });

  // Function to handle user logout
  async function handleLogout() {
    await signOutUser();
    toast.success("You have been logged out.");
    goto('/');
  }

  // Helper function to format the creation date
  function formatCreationDate(dateString: string | undefined): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }
</script>

<svelte:head>
  <title>Your Profile - Todo App</title>
</svelte:head>

<!-- Show loading spinner while auth state is being checked -->
{#if $authStore.loading}
  <div class="flex justify-center items-center min-h-[400px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>

<!-- Show profile card once user is loaded -->
{:else if $authStore.user}
  <div class="max-w-2xl mx-auto">
    <div class="bg-white rounded-lg shadow-md p-6">
      <div class="flex flex-col items-center text-center">
        
        <!-- Avatar with the first letter of the email -->
        <div class="w-24 h-24 bg-purple-500 rounded-full flex items-center justify-center mb-4">
          <span class="text-4xl font-bold text-white">
            {$authStore.user.email?.[0].toUpperCase()}
          </span>
        </div>

        <!-- User Email -->
        <h1 class="text-2xl font-bold text-gray-800">
          {$authStore.user.email}
        </h1>

        <!-- Member Since -->
        <p class="text-sm text-gray-500 mt-1">
          Member since {formatCreationDate($authStore.user.creationTime)}
        </p>

        <!-- Divider -->
        <hr class="w-full my-6" />

        <!-- Logout Button -->
        <button
          on:click={handleLogout}
          class="w-full max-w-xs bg-red-500 hover:bg-red-600 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
{/if}
