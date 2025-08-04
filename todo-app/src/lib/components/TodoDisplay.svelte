<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  import type { Todo } from '$lib/types';
  import TodoToggle from './TodoToggle.svelte';
  import TodoContent from './TodoContent.svelte';
  import TodoActions from './TodoActions.svelte';
  import TodoMedia from './TodoMedia.svelte';

  export let todo: Todo;
  export let isDeleting: boolean;

  const dispatch = createEventDispatcher();

  function handleEdit() {
    dispatch('edit');
  }

  function handleDelete() {
    dispatch('delete');
  }
</script>

<div class="flex flex-col h-full">
  <div class="flex space-x-3">
    <TodoToggle {todo} />
    <TodoContent {todo} />
  </div>

  <TodoMedia {todo} />

  <div class="flex-grow"></div>

  <TodoActions 
    {todo} 
    {isDeleting}
    on:edit={handleEdit}
    on:delete={handleDelete}
  />
</div>