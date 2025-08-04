<!-- AddTodo.svelte - Refactored -->
<script lang="ts">
  //Import necessary modules
  import { authStore } from '$lib/utils/auth_lce';
  import { addTodo, todosError } from '$lib/stores/todos';
  
  //Import reusable components
  import InputField from '$lib/components/InputField.svelte';
  import TextAreaField from '$lib/components/TextAreaField.svelte';
  import FileUploadField from '$lib/components/FileUploadField.svelte';
  import Button from '$lib/components/Button.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';
  
  // Form state variables
  let todoText = '';
  let todoTitle = '';
  let isSubmitting = false;
  let localError = '';
  let imageFile: File | null = null;
  let videoFile: File | null = null;

  // Constants
  const MAX_CHARACTERS = 250;
  const TITLE_LENGTH = 10;

  // Reactive statements
  $: remainingTitleChars = TITLE_LENGTH - todoTitle.length;
  $: isValidTitle = todoTitle.trim().length > 0;
  $: isValidInput = todoText.trim().length > 0 && todoText.length <= MAX_CHARACTERS;

  // Handle file selection
  function handleFileSelect(event: Event, type: string) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (type === 'image') {
      imageFile = file || null;
    } else if (type === 'video') {
      videoFile = file || null;
    }
  }

  // Handle form submission
  async function handleSubmit() {
    if (isSubmitting) return;
    
    localError = '';
    
    // Validate input
    if (!todoTitle.trim()) {
      localError = 'Title is required';
      return;
    }
    
    if (todoText.length > MAX_CHARACTERS) {
      localError = `Todo text cannot exceed ${MAX_CHARACTERS} characters`;
      return;
    }
    
    if (!$authStore.user) {
      localError = 'You must be logged in to add todos';
      return;
    }
    
    isSubmitting = true;
    
    const success = await addTodo(todoTitle, todoText, $authStore.user.uid, imageFile, videoFile);
    
    isSubmitting = false;
    
    if (success) {
      todoText = '';
      todoTitle = '';
      localError = '';
      imageFile = null;
      videoFile = null;
      const form = document.querySelector('form');
      form?.reset(); 
    }
<<<<<<< HEAD
=======
    else{
        localError="Todo With same name already Exists";
    }
>>>>>>> 6a9a601 (fix: fixed logic for Delete All button)
  }
  
  // Handle Enter key press
  function handleKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
  
  // Handle input changes
  function handleInput(event: Event) {
    const target = event.target as HTMLTextAreaElement;
    todoText = target.value;
  }
</script>

<!-- Add todo form -->
<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  
  <ErrorDisplay error={localError} />
  <!-- Title Input with Character Count -->
  <div class="flex flex-col mb-4">
    <div class="flex justify-between items-center mb-1">
      <label class="select-none text-sm font-medium text-gray-700">
        Title <span class="text-red-500">*</span>
      </label>
      <div
        class="select-none text-xs"
        class:text-red-500={remainingTitleChars <= 0}
        class:text-yellow-500={remainingTitleChars < 3 && remainingTitleChars > 0}
        class:text-gray-500={remainingTitleChars >= 3}
      >
        {#if remainingTitleChars <= 0}
          Max characters reached
        {:else}
          {remainingTitleChars} characters remaining
        {/if}
      </div>
    </div>
    
    <input
      type="text"
      bind:value={todoTitle}
      autofocus
      maxlength="10"
      class="w-full px-4 py-2 focus:bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
      class:border-red-300={!isValidTitle && todoTitle.length > 0}
      class:border-green-300={isValidTitle}
      placeholder="Enter Title"
      disabled={isSubmitting}
    />
  </div>

  <!-- Description TextArea -->
  <TextAreaField
    id="todoText"
    label="Description"
    placeholder="Enter more about your {todoTitle} todo"
    bind:value={todoText}
    rows={3}
    maxlength={250}
    showCharCount={true}
    maxChars={MAX_CHARACTERS}
    disabled={isSubmitting}
    onKeyPress={handleKeyPress}
    onInput={handleInput}
  />

  <!-- File Upload Fields -->
  <FileUploadField
    id="imageUpload"
    label="Attach an Image"
    accept="image/*"
    fileType="image"
    onChange={handleFileSelect}
  />

  <FileUploadField
    id="videoUpload"
    label="Attach a Video"
    accept="video/*"
    fileType="video"
    onChange={handleFileSelect}
  />

  <!-- Helper text -->
  <div class="flex justify-between items-center mt-2">
    <div class="select-none text-xs text-gray-500">
      Press Enter to add, Shift+Enter for new line
    </div>
  </div>

  <!-- Error Display -->
  

  <!-- Submit Button -->
  <Button
    type="submit"
    text="Add Todo"
    loadingText="Adding Todo..."
    loading={isSubmitting}
    disabled={!isValidTitle || todoText.length > MAX_CHARACTERS || isSubmitting}
    buttonClass="select-none bg-blue-500 hover:bg-blue-600 disabled:cursor-not-allowed w-full rounded-xl p-3 font-bold text-white cursor-pointer transition-colors"
    spinnerColor="white"
  />
</form>