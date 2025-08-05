<script lang="ts">    
  //Import all required Modules
  import { goto } from '$app/navigation';
  import { signUp } from '$lib/authentication/auth_actions';
  import { authStore } from '$lib/authentication/auth_lce';
  import type { SignupForm } from '$lib/schema/form_schems';
  import { validateSignupForm } from '$lib/utils/validation';
  import InputField from '$lib/components/InputField.svelte';
  import Button from '$lib/components/Button.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
  
  //Formdata object
  let formData: SignupForm = {
    email: '',
    password: '',
    confirmPassword: ''
  };
  
  let isSubmitting = false;
  let validationError = '';
  
  //Function that handles form submit 
  async function handleSubmit() {
    if (isSubmitting) return;
    
    //Validate form
    const validation = validateSignupForm(formData.email, formData.password, formData.confirmPassword);
    if (!validation.isValid) {
      validationError = validation.error;
      return;
    }
    
    validationError = '';
    isSubmitting = true;
    //Call the asynchronous signUp function from the auth store
    const success = await signUp(formData.email, formData.password);
    
    isSubmitting = false;
    
    if (success) {
      goto('/dashboard');
    }
  }
  //Handlig keyboard events
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      handleSubmit();
    }
  }
</script>

<svelte:head>
  <title>Sign Up - Todo App</title>
</svelte:head>

<div class="flex items-center justify-center p-2 bg-gray-50">
  <div class="max-w-sm mx-auto bg-slate-200 rounded-xl shadow-xl p-4 py-6 sm:p-10">
    <div class="text-center mb-8">
      <h1 class="select-none text-3xl font-bold text-blue-700 mb-2">
        Create Your Account
      </h1>
      <p class="select-none text-gray-500">
        Sign Up to start managing your todos
      </p>
    </div>
    
    <form on:submit|preventDefault={handleSubmit} class="space-y-6">
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
        placeholder="Min. 6 characters"
        icon="&#128274;"
        required={true}
        disabled={isSubmitting}
        showToggle={true}
        bind:value={formData.password}
        onKeyPress={handleKeyPress}
      />
      
      <InputField
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Confirm your password"
        icon="&#128274;"
        required={true}
        disabled={isSubmitting}
        showToggle={true}
        bind:value={formData.confirmPassword}
        onKeyPress={handleKeyPress}
      />
      
      <ErrorDisplay error={validationError} />
      <ErrorDisplay error={$authStore.error} />
      
      <Button
        type="submit"
        text="Create Account"
        loadingText="Creating Account..."
        loading={isSubmitting}
        disabled={isSubmitting || !formData.email || !formData.password || !formData.confirmPassword}
        buttonClass="select-none bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed w-full rounded-xl p-3 font-bold text-white cursor-pointer transition-colors"
        spinnerColor="white"
      />
    </form>
    
    <div class="mt-8 text-center">
      <p class="select-none text-sm text-gray-500">
        Already have an account?
        <a href="/login" class="select-none text-blue-500 hover:underline font-medium">
          Sign in here
        </a>
      </p>
    </div>

    <div class="pb-2 mt-4 text-center">
      <a href="/" class="select-none text-sm text-gray-500 hover:text-gray-700 transition-colors">
        ← Back to Home
      </a>
    </div>
  </div>
</div>