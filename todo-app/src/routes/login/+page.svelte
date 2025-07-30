<script lang="ts">
  //Import necessary modules
  import { goto } from '$app/navigation';
  import { authStore, signIn } from '$lib/stores/auth';
  import type { LoginForm } from '$lib/types';
  import { toast } from "svelte-sonner";
  //Form data object
  let formData: LoginForm = {
    email: '',
    password: ''
  };
  
  //Local loading state for form submission
  let isSubmitting = false;
  
  //Function to handle form submission
  async function handleSubmit() {
    //Prevent multiple submissions
    if (isSubmitting) return;
    
    //form validation
    if (!formData.email || !formData.password) {
      return; //Don't submit if fields are empty
    }
    
    //Set loading state to true
    isSubmitting = true;
    
    // Attempt to sign in user
    const success = await signIn(formData.email, formData.password);
    
    //Reset loading state to false
    isSubmitting = false;
    
    // Redirect to dashboard if successful
    if (success) {
      toast.success("Login Successful");
      goto('/dashboard');
    }
    // Error message will be shown automatically from the store
  }
  
  // Function to handle Enter key press
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<!-- Page title -->
<svelte:head>
  <title>Login - Todo App</title>
</svelte:head>

<!-- Login form container -->
<div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-8">
  <!-- Form header -->
  <div class="text-center mb-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      Sign In
    </h1>
    <p class="text-gray-600">
      Enter your credentials to access your todos
    </p>
  </div>
  
  <!-- Login form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Email input field -->
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <input
        id="email"
        type="email"
        bind:value={formData.email}
        on:keypress={handleKeyPress}
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your email"
        disabled={isSubmitting}
      />
    </div>
    
    <!-- Password input field -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <input
        id="password"
        type="password"
        bind:value={formData.password}
        on:keypress={handleKeyPress}
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Enter your password"
        disabled={isSubmitting}
      />
    </div>
    
    <!-- Error message display -->
    {#if $authStore.error}
      <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
        {$authStore.error}
      </div>
    {/if}
    
    <!-- Submit button -->
    <button
      type="submit"
      disabled={isSubmitting || !formData.email || !formData.password}
      class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
    >
      {#if isSubmitting}
        <!-- Loading spinner -->
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Signing In...
        </div>
      {:else}
        Sign In
      {/if}
    </button>
  </form>
  
  <!-- Link to signup page -->
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600">
      Don't have an account?
      <a href="/signup" class="text-blue-500 hover:text-blue-600 font-medium">
        Sign up here
      </a>
    </p>
  </div>
  
  <!-- Back to home link -->
  <div class="mt-4 text-center">
    <a href="/" class="text-sm text-gray-500 hover:text-gray-600">
      ← Back to Home
    </a>
  </div>
</div>