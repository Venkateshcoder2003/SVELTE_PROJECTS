<script lang="ts">
  // Import necessary modules
  import { goto } from '$app/navigation';
  import { authStore, signUp } from '$lib/stores/auth';
  import type { SignupForm } from '$lib/types';
  
  // Form data object
  let formData: SignupForm = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  // Local loading state for form submission
  let isSubmitting = false;
  
  // Local validation errors
  let validationError = '';

  // State to toggle password visibility
  let showPassword = false;
  let showConfirmPassword = false;
  
  // Function to validate form data
  function validateForm(): boolean {
    validationError = '';
    
    // Check if all fields are filled
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      validationError = 'All fields are required';
      return false;
    }
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      validationError = 'Passwords do not match';
      return false;
    }

    const hasUpperCase = /[A-Z]/.test(formData.password);
    const hasSpecialChar = /[!@#$%^&*]/.test(formData.password);
  
    if (!hasUpperCase || !hasSpecialChar) {
      validationError = 'Password must contain at least one uppercase letter and one special character (!@#$%^&*)';
      return false;
    }
    
    // Check password length (minimum 6 characters for Firebase)
    if (formData.password.length < 6) {
      validationError = 'Password must be at least 6 characters long';
      return false;
    }

    return true; // Form is valid
  }
  
  // Function to handle form submission
  async function handleSubmit() {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    // Set loading state
    isSubmitting = true;
    
    // Attempt to create new user account
    const success = await signUp(formData.email, formData.password);
    
    // Reset loading state
    isSubmitting = false;
    
    // Redirect to dashboard if successful
    if (success) {
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
  <title>Sign Up - Todo App</title>
</svelte:head>

<!-- Signup form container with a softer shadow -->
<div class="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 sm:p-10">
  <!-- Form header with gradient text -->
  <div class="text-center mb-8">
    <h1 class="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-blue-500 mb-2">
      Create Your Account
    </h1>
    <p class="text-gray-500">
      Join us to start managing your todos
    </p>
  </div>
  
  <!-- Signup form -->
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
    <!-- Email input field with icon -->
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
          bind:value={formData.email}
          on:keypress={handleKeyPress}
          required
          class="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          placeholder="you@example.com"
          disabled={isSubmitting}
        />
      </div>
    </div>
    
    <!-- Password input field with icon and visibility toggle -->
    <div>
      <label for="password" class="block text-sm font-medium text-gray-700 mb-2">
        Password
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          id="password"
          type={showPassword ? 'text' : 'password'}
          bind:value={formData.password}
          on:keypress={handleKeyPress}
          required
          class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          placeholder="Min. 6 characters"
          disabled={isSubmitting}
        />
        <button 
          type="button" 
          on:click={() => showPassword = !showPassword}
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {#if showPassword}
            <!-- Eye Off Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clip-rule="evenodd" />
              <path d="M10 17a7 7 0 01-7-7c0-1.554.524-3.023 1.428-4.218l-1.357-1.357A9.976 9.976 0 00.458 10c1.274 4.057 5.064 7 9.542 7 1.853 0 3.579-.498 5.088-1.354l-1.612-1.612A6.979 6.979 0 0110 17z" />
            </svg>
          {:else}
            <!-- Eye Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Confirm Password input field with icon and visibility toggle -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password
      </label>
      <div class="relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
            <path fill-rule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14l-1 1-1 1H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clip-rule="evenodd" />
          </svg>
        </div>
        <input
          id="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          bind:value={formData.confirmPassword}
          on:keypress={handleKeyPress}
          required
          class="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition"
          placeholder="Confirm your password"
          disabled={isSubmitting}
        />
        <button 
          type="button" 
          on:click={() => showConfirmPassword = !showConfirmPassword}
          class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
          aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
        >
          {#if showConfirmPassword}
            <!-- Eye Off Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074L3.707 2.293zM10 12a2 2 0 110-4 2 2 0 010 4z" clip-rule="evenodd" />
              <path d="M10 17a7 7 0 01-7-7c0-1.554.524-3.023 1.428-4.218l-1.357-1.357A9.976 9.976 0 00.458 10c1.274 4.057 5.064 7 9.542 7 1.853 0 3.579-.498 5.088-1.354l-1.612-1.612A6.979 6.979 0 0110 17z" />
            </svg>
          {:else}
            <!-- Eye Icon -->
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd" />
            </svg>
          {/if}
        </button>
      </div>
    </div>
    
    <!-- Validation error display -->
    {#if validationError}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {validationError}
      </div>
    {/if}
    
    <!-- Auth error display -->
    {#if $authStore.error}
      <div class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
        {$authStore.error}
      </div>
    {/if}
    
    <!-- Submit button with gradient and hover effect -->
    <button
      type="submit"
      disabled={isSubmitting || !formData.email || !formData.password || !formData.confirmPassword}
      class="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300"
    >
      {#if isSubmitting}
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
          Creating Account...
        </div>
      {:else}
        Create Account
      {/if}
    </button>
  </form>
  
  <!-- Link to login page -->
  <div class="mt-8 text-center">
    <p class="text-sm text-gray-500">
      Already have an account?
      <a href="/login" class="text-blue-500 hover:underline font-medium">
        Sign in here
      </a>
    </p>
  </div>

   <div class="mt-4 text-center">
    <a href="/" class="text-sm text-gray-500 hover:text-gray-700 transition-colors">
      ← Back to Home
    </a>
  </div>
</div>
