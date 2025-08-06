<script lang="ts">
  export let todosStore: any;
  export let todosLoading: boolean;
</script>

<!-- Displays the stats of todos (Pending, Completed) -->
{#if !todosLoading && $todosStore.length > 0}
  <div class="mt-10 grid grid-cols-3 gap-2 sm:gap-4">
    <div class="bg-indigo-50 border border-blue-200 rounded-lg p-4 text-center">
      <div class="select-none text-xl sm:text-2xl font-bold text-blue-600">
        {$todosStore.length}
      </div>
      <div class="select-none text-xs sm:text-sm text-blue-700">
        Total Todos
      </div>
    </div>
    <div class="bg-emerald-50 border border-green-200 rounded-lg p-4 text-center">
      <div class="select-none text-xl sm:text-2xl font-bold text-green-600">
        {$todosStore.filter(todo => todo.completed).length}
      </div>
      <div class="select-none text-xs sm:text-sm text-green-700 flex justify-center">
        Completed
      </div>
    </div>
    <div class="bg-amber-50 border border-yellow-200 rounded-lg p-4 text-center">
      <div class="select-none text-xl sm:text-2xl font-bold text-yellow-600">
        {$todosStore.filter(todo => !todo.completed).length}
      </div>
      <div class="select-none text-xs sm:text-sm text-yellow-700">
        Pending
      </div>
    </div>
  </div>
{/if}