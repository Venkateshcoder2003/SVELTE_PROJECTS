<script lang="ts">
  // Import all necessary Modules
  import { authStore } from '$lib/authentication/auth_lce';
  import { addTodo } from '$lib/database/database';
  import InputField from '$lib/components/InputField.svelte';
  import TextAreaField from '$lib/components/TextAreaField.svelte';
  import FileUploadField from '$lib/components/FileUploadField.svelte';
  import Button from '$lib/components/Button.svelte';
  import ErrorDisplay from '$lib/components/ErrorDisplay.svelte';

  // Form state
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
    } else {
      localError = "Todo with same name already exists";
    }
  }

  // Handle key press
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

<form on:submit|preventDefault={handleSubmit} class="space-y-4">
  <ErrorDisplay error={localError} />
  
  <!-- Title Input with Character Count -->
  <InputField
    id="todoTitle"
    type="text"
    label="Title"
    placeholder="Enter Title"
    bind:value={todoTitle}
    required={true}
    disabled={isSubmitting}
    maxlength={TITLE_LENGTH}
    showCharCount={true}
    maxChars={TITLE_LENGTH}
    autofocus={true}
    onKeyPress={handleKeyPress}
  />

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