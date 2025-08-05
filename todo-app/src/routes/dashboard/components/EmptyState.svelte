<script lang="ts">
  export let type: 'no-todos' | 'no-completed' | 'no-pending';

  const states = {
    'no-todos': {
      emoji: '&#127919;',
      size: 'text-6xl',
      title: 'No todos yet',
      titleSize: 'text-xl',
      description: 'Add your first todo above to get started organizing your tasks!'
    },
    'no-completed': {
      emoji: '&#128203;',
      size: 'text-4xl',
      title: 'No completed todos yet',
      titleSize: 'text-lg',
      description: 'Complete some todos to see them here.'
    },
    'no-pending': {
      emoji: '&#x1F4DD;',
      size: 'text-4xl', 
      title: 'No pending todos',
      titleSize: 'text-lg',
      description: 'Great job! All your todos are completed.'
    }
  };

  $: currentState = states[type];
</script>

<div class="text-center py-12">
  <div class="select-none {currentState.size} mb-4">
    <span>{@html currentState.emoji}</span>
  </div>
  <h3 class="select-none {currentState.titleSize} font-medium text-gray-700 mb-2">
    {currentState.title}
  </h3>
  <p class="select-none text-gray-500 text-sm">
    {currentState.description}
  </p>
</div>
