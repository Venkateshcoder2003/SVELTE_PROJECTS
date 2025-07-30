<!-- Component for adding new todos -->
<!-- Includes form validation and character count -->

<script lang="ts">
  // Import necessary modules
  import { authStore } from '$lib/stores/auth';
  import { addTodo, todosError } from '$lib/stores/todos';
  
  // Form state variables
  let todoText = ''; // Text input value
  let isSubmitting = false; // Loading state for form submission
  let localError = ''; // Local validation error messages
  let imageFile: File | null = null;
  let videoFile: File | null = null;
  
  // Maximum character limit for todos (as per requirements)
  const MAX_CHARACTERS = 250;
  
  // Reactive statement to calculate remaining characters
  $: remainingChars = MAX_CHARACTERS - todoText.length;
  
  // Reactive statement to check if input is valid
  $: isValidInput = todoText.trim().length > 0 && todoText.length <= MAX_CHARACTERS;
  
   function handleFileSelect(event: Event, type: 'image' | 'video') {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (type === 'image') {
      imageFile = file || null;
    } else {
      videoFile = file || null;
    }
  }

  // Function to handle form submission
  async function handleSubmit() {
    // Prevent multiple submissions
    if (isSubmitting) return;
    
    // Clear any previous local errors
    localError = '';
    
    // Validate input
    if (!todoText.trim()) {
      localError = 'Please enter a todo text';
      return;
    }
    
    if (todoText.length > MAX_CHARACTERS) {
      localError = `Todo text cannot exceed ${MAX_CHARACTERS} characters`;
      return;
    }
    
    // Check if user is authenticated
    if (!$authStore.user) {
      localError = 'You must be logged in to add todos';
      return;
    }
    
    // Set loading state
    isSubmitting = true;
    
    // Attempt to add the todo
     const success = await addTodo(todoText, $authStore.user.uid, imageFile, videoFile);
    
    // Reset loading state
    isSubmitting = false;
    
    // Clear form if successful
    if (success) {
      todoText = ''; // Clear the input field
      localError = '';
       imageFile = null;
      videoFile = null;
      const form = document.querySelector('form');
      form?.reset(); 
    }
    // Error messages from the store will be displayed automatically
  }
  
  // Function to handle Enter key press
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault(); // Prevent new line
      handleSubmit();
    }
  }
  
  // Function to handle input changes and validate
  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    todoText = target.value;
  }
</script>

<!-- Add todo form -->
<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <!-- Todo input section -->
  <div>
    <label for="todoText" class="block text-sm font-medium text-gray-700 mb-2">
      What do you need to do?
    </label>
    
    <!-- Textarea for todo input -->
    <textarea
      id="todoText"
      bind:value={todoText}
      on:keypress={handleKeyPress}
      on:input={handleInput}
      placeholder="Enter your todo item..."
      rows="3"
      class="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      class:border-red-300={!isValidInput && todoText.length > 0}
      class:border-green-300={isValidInput}
      disabled={isSubmitting}
    ></textarea>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
    <div>
      <label for="imageUpload" class="block text-sm font-medium text-gray-700 mb-2">
        Attach an Image
      </label>
      <input 
        id="imageUpload" 
        type="file" 
        accept="image/*"
        on:change={(e) => handleFileSelect(e, 'image')}
        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />
    </div>
    <div>
      <label for="videoUpload" class="block text-sm font-medium text-gray-700 mb-2">
        Attach a Video
      </label>
      <input 
        id="videoUpload" 
        type="file" 
        accept="video/*"
        on:change={(e) => handleFileSelect(e, 'video')}
        class="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
      />
    </div>
  </div>
    
    <!-- Character count display -->
    <div class="flex justify-between items-center mt-2">
      <div class="text-xs text-gray-500">
        Press Enter to add, Shift+Enter for new line
      </div>
      
      <div class="text-xs" class:text-red-500={remainingChars < 0} class:text-yellow-500={remainingChars < 50 && remainingChars >= 0} class:text-gray-500={remainingChars >= 50}>
        {remainingChars} characters remaining
      </div>
    </div>
  </div>
  
  <!-- Local error display -->
  {#if localError}
    <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
      {localError}
    </div>
  {/if}
  
  <!-- Submit button -->
  <button
    type="submit"
    disabled={!isValidInput || isSubmitting}
    class="w-full bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200"
  >
    {#if isSubmitting}
      <!-- Loading state -->
      <div class="flex items-center justify-center">
        <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
        Adding Todo...
      </div>
    {:else}
      <!-- Normal state -->
      <span class="flex items-center justify-center">
        <span class="mr-2">➕</span>
        Add Todo
      </span>
    {/if}
  </button>
</form>

<!-- Tips section -->
<div class="mt-4 p-4 bg-gray-50 rounded-md">
  <h4 class="text-sm font-medium text-gray-700 mb-2">💡 Tips:</h4>
  <ul class="text-xs text-gray-600 space-y-1">
    <li>• Keep your todos clear and actionable</li>
    <li>• Maximum {MAX_CHARACTERS} characters per todo</li>
    <li>• Use Enter to quickly add todos</li>
    <li>• Break large tasks into smaller ones</li>
  </ul>
</div>