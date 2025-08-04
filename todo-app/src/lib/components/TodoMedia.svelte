<script lang="ts">
  import type { Todo } from '$lib/types';
  import Button from './Button.svelte';

  export let todo: Todo;

  let showImage = true;
  let showVideo = true;
</script>

<div class="mt-3 flex flex-col space-y-2">
  {#if todo.imageUrl}
    <Button
      text={showImage ? "Hide Image" : "Show Image"}
      buttonClass="text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium text-left bg-transparent p-0 w-auto"
      on:click={() => showImage = !showImage}
    />
  {/if}

  {#if todo.videoUrl}
    <Button
      text={showVideo ? "Hide Video" : "Show Video"}
      buttonClass="text-blue-500 hover:text-blue-700 hover:underline text-sm font-medium text-left bg-transparent p-0 w-auto"
      on:click={() => showVideo = !showVideo}
    />
  {/if}

  {#if showImage && todo.imageUrl}
    <div class="mt-2 w-full">
      <img src={todo.imageUrl} alt="Todo attachment" class="select-none rounded-lg max-h-60 w-full object-cover" />
    </div>
  {/if}
  
  {#if showVideo && todo.videoUrl}
    <div class="mt-2 w-full">
      <video src={todo.videoUrl} controls class="select-none rounded-lg w-full">
        <track kind="captions" />
      </video>
    </div>
  {/if}
</div>