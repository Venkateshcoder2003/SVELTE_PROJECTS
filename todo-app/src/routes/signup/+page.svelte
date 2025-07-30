<!-- Signup page component -->
<!-- Handles new user registration with email and password -->

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

<!-- Signup form container -->
<div class="max-w-md mx-auto bg-white rounded-lg shadow-md p-10">
  <!-- Form header -->
  <div class="text-center mb-8">
    <h1 class="text-2xl font-bold text-gray-800 mb-2">
      Create Account
    </h1>
    <p class="text-gray-600">
      Sign up to start managing your todos
    </p>
  </div>
  
  <!-- Signup form -->
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
        placeholder="Enter your password (min. 6 characters)"
        disabled={isSubmitting}
      />
    </div>
    
    <!-- Confirm Password input field -->
    <div>
      <label for="confirmPassword" class="block text-sm font-medium text-gray-700 mb-2">
        Confirm Password
      </label>
      <input
        id="confirmPassword"
        type="password"
        bind:value={formData.confirmPassword}
        on:keypress={handleKeyPress}
        required
        class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="Confirm your password"
        disabled={isSubmitting}
      />
    </div>
    
    <!-- Validation error display -->
    {#if validationError}
      <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
        {validationError}
      </div>
    {/if}
    
    <!-- Auth error display -->
    {#if $authStore.error}
      <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md text-sm">
        {$authStore.error}
      </div>
    {/if}
    
    <!-- Submit button -->
    <button
      type="submit"
      disabled={isSubmitting || !formData.email || !formData.password || !formData.confirmPassword}
      class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
    >
      {#if isSubmitting}
        <!-- Loading spinner -->
        <div class="flex items-center justify-center">
          <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
          Creating Account...
        </div>
      {:else}
        Create Account
      {/if}
    </button>
  </form>
  
  <!-- Link to login page -->
  <div class="mt-6 text-center">
    <p class="text-sm text-gray-600">
      Already have an account?
      <a href="/login" class="text-blue-500 hover:text-blue-600 font-medium">
        Sign in here
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