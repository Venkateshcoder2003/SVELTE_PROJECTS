<script lang="ts">
  // Import all necessary modules
  import { goto } from '$app/navigation';
  import Button from '$lib/components/Button.svelte';
  
  // Features data
  const features = [
    'Create and manage your todos',
    'Mark tasks as complete',
    'Secure user authentication',
    'Real-time updates'
  ];

  // Navigation handlers
  function goToLogin() {
    goto('/login');
  }

  function goToSignup() {
    goto('/signup');
  }
</script>

<div class="w-full max-w-md bg-slate-200 rounded-xl shadow-lg p-6 sm:p-8 md:p-10">
  <!-- Welcome header -->
  <div class="text-center mb-6 sm:mb-8">
    <h1 class="select-none text-3xl font-bold text-blue-700 mb-2">
      <span>&#x1F4DD;</span> Welcome to Todo App
    </h1>
    <p class="select-none text-gray-500 text-sm sm:text-base">
      Organize your tasks and boost your productivity
    </p>
  </div>
  
  <!-- Authentication options -->
  <div class="space-y-3 sm:space-y-4">
    <!-- Login button -->
    <Button
      text="Login to Your Account"
      buttonClass="select-none w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md cursor-pointer transition-colors"
      on:click={goToLogin}
    />
    
    <!-- Signup button -->
    <Button
      text="Create New Account"
      buttonClass="select-none w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2.5 sm:py-3 px-4 rounded-lg shadow-md cursor-pointer transition-colors"
      on:click={goToSignup}
    />
  </div>
  
  <!-- Features list -->
  <div class="mt-6 sm:mt-8 text-sm text-gray-600">
    <h3 class="select-none font-semibold mb-3 text-gray-700">Features:</h3>
    <ul class="space-y-2">
      {#each features as feature}
        <li class="select-none flex items-center">
          <span class="select-none text-green-500 mr-2">&#10003;</span>
          {feature}
        </li>
      {/each}
    </ul>
  </div>
  
  <!-- Footer -->
  <div class="mt-6 sm:mt-8 text-center">
    <p class="select-none text-xs text-gray-400">
      Get started by creating an account or logging in
    </p>
  </div>
  
</div>