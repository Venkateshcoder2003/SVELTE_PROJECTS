<script lang="ts">
  export let id: string;
  export let label: string;
  export let placeholder: string = '';
  export let value: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let rows: number = 3;
  export let maxlength: number | undefined = undefined;
  export let showCharCount: boolean = false;
  export let maxChars: number = 250;
  export let onKeyDown: ((event: KeyboardEvent) => void) | undefined = undefined;
  export let onKeyPress: ((event: KeyboardEvent) => void) | undefined = undefined;
  export let onInput: ((event: Event) => void) | undefined = undefined;
  
  $: remainingChars = maxChars - value.length;
  $: isValidInput = value.trim().length > 0 && value.length <= maxChars;
  
  function handleKeyDown(event: KeyboardEvent) {
    if (onKeyDown) {
      onKeyDown(event);
    }
  }
  
  function handleKeyPress(event: KeyboardEvent) {
    if (onKeyPress) {
      onKeyPress(event);
    }
  }
  
  function handleInput(event: Event) {
    if (onInput) {
      onInput(event);
    }
  }
</script>

<div class="flex flex-col">
  <!-- Label and character count row -->
  <div class="flex justify-between items-center mb-2">
    <label for={id} class="select-none text-sm font-medium text-gray-700">
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
    {#if showCharCount}
      <div 
        class="select-none text-xs" 
        class:text-red-500={remainingChars < 0} 
        class:text-yellow-500={remainingChars < 50 && remainingChars >= 0} 
        class:text-gray-500={remainingChars >= 50}
      >
        {#if remainingChars <= 0}
          Max characters reached
        {:else}
          {remainingChars} characters remaining
        {/if}
      </div>
    {/if}
  </div>
  
  <!-- Textarea -->
  <textarea
    {id}
    bind:value
    on:keydown={handleKeyDown}
    on:keypress={handleKeyPress}
    on:input={handleInput}
    {placeholder}
    {rows}
    {maxlength}
    {disabled}
    class="w-full focus:bg-gray-100 px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none"
    class:border-red-300={!isValidInput && value.length > 0}
    class:border-green-300={isValidInput}
  ></textarea>
</div>