<script lang="ts">
  export let id: string;
  export let label: string;
  export let accept: string;
  export let onChange: ((event: Event, type: string) => void) | undefined = undefined;
  export let fileType: string = 'file';
  export let disabled: boolean = false;
  
  function handleChange(event: Event) {
    if (onChange) {
      onChange(event, fileType);
    }
  }
  
  // Different styles for different file types
  $: fileStyle = fileType === 'image' 
    ? 'file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-100' 
    : 'file:bg-green-100 file:text-green-700 hover:file:bg-green-100';
</script>

<div>
  <label for={id} class="select-none block text-sm font-medium text-gray-700 mb-1/2">
    {label}
  </label>
  <input 
    {id}
    type="file" 
    {accept}
    {disabled}
    on:change={handleChange}
    class="cursor-pointer w-full text-sm text-gray-500  file:mr-2 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold {fileStyle}"
  />
</div>