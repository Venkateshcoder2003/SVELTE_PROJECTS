<!-- Navigation component for authenticated users -->
<!-- Displays user info and logout functionality -->

<script lang="ts">
  // Import necessary modules
  import { goto } from '$app/navigation';
  import { authStore, signOutUser } from '$lib/stores/auth';
  
  // Function to handle user logout
  async function handleLogout() {
    await signOutUser(); // Sign out user
    goto('/'); // Redirect to home page
  }
</script>

<!-- Navigation bar -->
<nav class="bg-white shadow-sm border-b border-gray-200">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      <!-- Logo/Brand -->
      <div class="flex items-center">
        <h1 class="text-xl font-bold text-gray-800">
          📝 Todo App
        </h1>
      </div>
      
      <!-- User info and logout -->
      <div class="flex items-center space-x-4">
        <!-- Display user email -->
        <span class="text-sm text-gray-600">
          Welcome, {$authStore.user?.email}
        </span>
        
        <!-- Logout button -->
        <button
          on:click={handleLogout}
          class="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </div>
  </div>
</nav>