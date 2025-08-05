<script lang="ts">
  //Import required modules
  import { goto } from '$app/navigation';
  import { forgotPassword } from '$lib/authentication/auth_actions';
  import InputField from '$lib/components/InputField.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
  import Button from '$lib/components/Button.svelte';
  import { validateForgotPasswordForm } from '$lib/utils/validation';

  let email = '';
  let isSubmitting = false;
  let validationError='';

  //Handles form submission
  async function handleSubmit() {
    if (isSubmitting) return;
    
    const validation = validateForgotPasswordForm(email);
    if (!validation.isValid) {
      validationError = validation.error;
      return;
    }
    
    validationError = '';

    isSubmitting = true;
    //Call the asynchronous forgotPassword function from the auth store
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
<div class="max-w-sm mx-auto bg-slate-200 rounded-xl shadow-xl p-10 sm:p-10 mt-20">
  <div class="text-center mb-8">
    <h1 class="select-none text-3xl text-blue-700 font-bold mb-3">
      Reset Your Password
    </h1>
    <p class="select-none text-gray-500">
      Enter your email and we'll send you a link to get back into your account.
    </p>
  </div>
  
  <form on:submit|preventDefault={handleSubmit} class="space-y-6">
  <!-- Custom InputField component for the email input -->
    <InputField
      id="email"
      type="email"
      label="Email Address"
      placeholder="you@example.com"
      icon="&#128233;"
      required={true}
      disabled={isSubmitting}
      bind:value={email}
    />

    <ErrorDisplay error={validationError} />

    <Button
      type="submit"
      text="Send Password Reset Link"
      loadingText="Sending..."
      loading={isSubmitting}
      disabled={isSubmitting}
      buttonClass="select-none bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed w-full rounded-xl p-3 font-bold text-white cursor-pointer transition-colors"
      spinnerColor="white"
    />
  </form>
  
  <div class="mt-8 text-center">
    <a href="/login" class="select-none text-sm text-gray-500 hover:text-gray-700 transition-colors">
      ← Back to Login
    </a>
  </div>
</div>
