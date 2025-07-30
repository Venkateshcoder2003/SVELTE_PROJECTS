<script lang="ts">
  import { goto } from '$app/navigation';
  import { forgotPassword } from '$lib/stores/auth';

  let email = '';
  let isSubmitting = false;

  async function handleSubmit() {
    if (isSubmitting) return;
    isSubmitting = true;
    
    const success = await forgotPassword(email);
    
    // If successful, redirect to the login page after a short delay
    if (success) {
      setTimeout(() => {
        goto('/login');
      }, 3000);
    }
    
    isSubmitting = false;
  }
</script>

<svelte:head>
  <title>Forgot Password - Todo App</title>
</svelte:head>

<div class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 sm:p-10">
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
      Reset Your Password
    </h1>
    <p class="text-gray-500">
      Enter your email and we'll send you a link to get back into your account.
    </p>
  </div>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <div>
      <label for="email" class="block text-sm font-medium text-gray-700 mb-2">
        Email Address
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
          </svg>
        </div>
        <input
          id="email"
          type="email"
          bind:value={email}
          required
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    <button
      type="submit"
      disabled={isSubmitting}
      class="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      {#if isSubmitting}
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          Sending...
        </div>
      {:else}
        Send Password Reset Link
      {/if}
    </button>
  </form>
  
  <div class="mt-8 text-center">
    <a href="/login" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
      ← Back to Login
    </a>
  </div>
</div>
