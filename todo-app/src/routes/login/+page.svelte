<script lang="ts">
  //Import required modules
  import { goto } from '$app/navigation';
  import { signIn } from '$lib/stores/auth';
  import { authStore } from '$lib/utils/auth_lce';
  import type { LoginForm } from '$lib/types';
  import { validateLoginForm } from '$lib/validation';
  import InputField from '$lib/components/InputField.svelte';
  import Button from '$lib/components/Button.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

  let formData: LoginForm = {
    email: '',
    password: ''
  };
  
  let isSubmitting = false;
  let validationError = '';
  
  //Handles form submission
  async function handleSubmit() {
    if (isSubmitting) return;
    
    //Validate form
    const validation = validateLoginForm(formData.email, formData.password);
    if (!validation.isValid) {
      validationError = validation.error;
      return;
    }
    
    validationError = '';
    isSubmitting = true;
    
    //Call the asynchronous signIn function from the auth store
    const success = await signIn(formData.email, formData.password);
    
    isSubmitting = false;
    
    if (success) {
      goto('/dashboard');
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<svelte:head>
  <title>Login - Todo App</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center p-4 bg-gray-50">
  <div class="w-full max-w-md bg-slate-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
    <div class="text-center mb-6 sm:mb-8">
      <h1 class="select-none text-3xl font-bold text-blue-700 mb-2">
        Welcome Back!
      </h1>
      <p class="select-none text-gray-500 text-sm sm:text-base">
        Sign in to continue to your dashboard
      </p>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-4 sm:space-y-6">
    <!-- Custom InputField component for the email and password input -->
      <InputField
        id="email"
        type="email"
        label="Email Address"
        placeholder="you@example.com"
        icon="&#128233;"
        required={true}
        disabled={isSubmitting}
        bind:value={formData.email}
        onKeyPress={handleKeyPress}
      />
      
      <InputField
        id="password"
        type="password"
        label="Password"
        placeholder="Enter your password"
        icon="&#128274;"
        required={true}
        disabled={isSubmitting}
        bind:value={formData.password}
        onKeyPress={handleKeyPress}
        extraLink={{ text: "Forgot password?", href: "/forgot-password" }}
      />
      
      <ErrorDisplay error={validationError} />
      <ErrorDisplay error={$authStore.error} />
      
      <Button
        type="submit"
        text="Sign In"
        loadingText="Signing In..."
        loading={isSubmitting}
        disabled={isSubmitting || !formData.email || !formData.password}
        buttonClass="select-none bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed w-full rounded-xl p-3 font-bold text-white cursor-pointer transition-colors"
        spinnerColor="white"
      />
    </form>
    
    <div class="mt-6 sm:mt-8 text-center">
      <p class="select-none text-sm text-gray-500">
        Don't have an account?
        <a href="/signup" class="select-none text-blue-500 hover:underline font-medium">
          Sign up here
        </a>
      </p>
    </div>

    <div class="mt-4 text-center">
      <a href="/" class="select-none text-sm text-gray-500 hover:text-gray-700 transition-colors">
        ← Back to Home
      </a>
    </div>
  </div>
</div>