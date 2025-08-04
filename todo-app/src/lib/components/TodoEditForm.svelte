<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import { updateTodo } from '$lib/stores/todos';
  import type { Todo } from '$lib/types';
  import Button from './Button.svelte';
  import InputField from './InputField.svelte';
  import TextAreaField from './TextAreaField.svelte';
  import FileUploadField from './FileUploadField.svelte';
  import ErrorDisplay from './ErrorDisplay.svelte';
  import { onMount, onDestroy } from 'svelte';

  export let todo: Todo;

  const dispatch = createEventDispatcher();

  let editText = todo.text;
  let editTitle = todo.title;
  let isUpdating = false;
  let editError = '';
  let editImageFile: File | null = null;
  let editVideoFile: File | null = null;

  const TITLE_LENGTH = 10;
  const MAX_CHARACTERS = 250;

  function handleEditFileSelect(event: Event, type: string) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (type === 'image') {
      editImageFile = file || null;
    } else if (type === 'video') {
      editVideoFile = file || null;
    }
  }

  async function saveEdit() {
    if (isUpdating) return;
    editError = '';

    if (!editTitle.trim()) {
      editError = 'Title cannot be empty';
      return;
    }

    if (editText.length > MAX_CHARACTERS) {
      editError = `Todo text cannot exceed ${MAX_CHARACTERS} characters`;
      return;
    }

    const titleChanged = editTitle.trim() !== todo.title;
    const textChanged = editText.trim() !== todo.text;
    const filesChanged = editImageFile || editVideoFile;

    if (!titleChanged && !textChanged && !filesChanged) {
      dispatch('save');
      return;
    }

    isUpdating = true;

    const updates = {
      newTitle: titleChanged ? editTitle.trim() : undefined,
      newText: textChanged ? editText.trim() : undefined,
      imageFile: editImageFile,
      videoFile: editVideoFile,
    };

    const success = await updateTodo(todo.id, updates, todo);
    isUpdating = false;

    if (success) {
      dispatch('save');
    }
  }

  function cancelEditing() {
    dispatch('cancel');
  }

  function handleEnterKey(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      saveEdit();
    }
  }

  function handleGlobalKeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      cancelEditing();
    }
  }

  onMount(() => {
    window.addEventListener('keydown', handleGlobalKeydown);
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleGlobalKeydown);
  });
</script>

<div class="select-none space-y-3 flex flex-col h-full">
  <InputField
    id="edit-title-{todo.id}"
    label="Title"
    bind:value={editTitle}
    required={true}
    disabled={isUpdating}
    placeholder="Enter todo title"
    maxlength={10}
    showCharCount={true}
    maxChars={TITLE_LENGTH}
    autofocus={true}
    onKeyDown={handleEnterKey}
  />
  
  <TextAreaField
    id="edit-text-{todo.id}"
    label="Description"
    bind:value={editText}
    disabled={isUpdating}
    placeholder="Enter todo description"
    rows={2}
    maxlength={250}
    showCharCount={true}
    maxChars={MAX_CHARACTERS}
    onKeyDown={handleEnterKey}
  />

  <FileUploadField
    id="edit-image-{todo.id}"
    label="Change Image"
    accept="image/*"
    fileType="image"
    disabled={isUpdating}
    onChange={(event, type) => handleEditFileSelect(event, type)}
  />
  
  <FileUploadField
    id="edit-video-{todo.id}"
    label="Change Video"
    accept="video/*"
    fileType="video"
    disabled={isUpdating}
    onChange={(event, type) => handleEditFileSelect(event, type)}
  />

  <div class="flex-grow"></div>

  <ErrorDisplay error={editError} />

  <div class="flex space-x-2 mt-2">
    <Button
      text="Save"
      loading={isUpdating}
      loadingText="Saving..."
      disabled={editText.length > MAX_CHARACTERS || !editTitle.trim()}
      buttonClass="bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors"
      spinnerSize="small"
      spinnerColor="white"
      on:click={saveEdit}
    />
    <Button
      text="Cancel"
      disabled={isUpdating}
      buttonClass="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 py-1 rounded text-sm font-medium transition-colors"
      on:click={cancelEditing}
    />
  </div>
</div>