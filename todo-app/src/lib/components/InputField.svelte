<!-- InputField.svelte - Improved Version -->
<script lang="ts">
  export let id: string;
  export let type: string = 'text';
  export let label: string;
  export let placeholder: string = '';
  export let value: string = '';
  export let required: boolean = false;
  export let disabled: boolean = false;
  export let icon: string = '';
  export let maxlength: number | undefined = undefined;
  export let showCharCount: boolean = false;
  export let maxChars: number = 250;
  export let autofocus: boolean = false;
  export let onKeyDown: ((event: KeyboardEvent) => void) | undefined = undefined;
  export let onKeyPress: ((event: KeyboardEvent) => void) | undefined = undefined;
  export let extraLink: { text: string; href: string } | undefined = undefined;
  
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
</script>

<div>
  <div class="flex justify-between items-center mb-2">
    <label for={id} class="select-none block text-sm font-medium text-gray-700">
      {#if icon}<span>{@html icon}</span>{/if}
      {label}
      {#if required}<span class="text-red-500">*</span>{/if}
    </label>
    {#if extraLink}
      <a href={extraLink.href} class="select-none text-xs sm:text-sm text-blue-500 hover:underline font-medium">
        {extraLink.text}
      </a>
    {/if}
  </div>
  
  <!-- Character count for input -->
  {#if showCharCount}
    <div class="flex justify-end mb-1">
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
    </div>
  {/if}
  
  <div class="relative">
    <input
      {id}
      {type}
      {autofocus}
      {maxlength}
      bind:value
      on:keydown={handleKeyDown}
      on:keypress={handleKeyPress}
      {required}
      {disabled}
      {placeholder}
      class="text-gray-700 focus:text-gray-500 focus:outline-none  focus:bg-gray-50 focus:ring-blue-500 w-full pl-4 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-1"
      class:border-red-300={!isValidInput && value.length > 0}
      class:border-green-300={isValidInput}
    />
  </div>
</div>