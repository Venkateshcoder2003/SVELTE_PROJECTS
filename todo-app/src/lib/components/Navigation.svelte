<script lang="ts">
  //Import necessary modules
  import { goto } from '$app/navigation';
  import { authStore, signOutUser } from '$lib/stores/auth';
  
  //Function to handle user logout
  async function handleLogout() {
    await signOutUser(); //Sign out user
    goto('/'); //Redirect user to home page
  }
</script>

<nav class="bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-slate-700 sticky top-0 z-50">
  <div class="container mx-auto px-4">
    <div class="flex justify-between items-center h-16">
      
      <a href="/dashboard" class="flex items-center space-x-2 text-xl font-bold text-slate-200 hover:text-white transition-colors">
        <span class="text-2xl">📝</span>
        <h1>Todo App</h1>
      </a>
      
      <div class="flex items-center space-x-4">
        
        <div class="flex items-center space-x-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-400" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd" />
          </svg>
          <span class="text-sm font-medium text-slate-300 hidden sm:block">
            Welcome, {$authStore.user?.email}
          </span>
        </div>
        
        <button
          on:click={handleLogout}
          class="flex items-center space-x-2 bg-slate-700 hover:bg-red-500 text-slate-300 hover:text-white px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 102 0V4a1 1 0 00-1-1zm10.293 9.293a1 1 0 001.414 1.414l3-3a1 1 0 000-1.414l-3-3a1 1 0 10-1.414 1.414L14.586 9H7a1 1 0 100 2h7.586l-1.293 1.293z" clip-rule="evenodd" />
          </svg>
          <span class="hidden sm:block">Logout</span>
        </button>
      </div>
    </div>
  </div>
</nav>