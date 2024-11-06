<script lang="ts">
  export let category: string;
  
  const categoryColors = {
    movie: '#FF6B6B',
    tv: '#4ECDC4',
    book: '#45B7D1',
    music: '#96CEB4',
    podcast: '#FFEEAD',
    game: '#D4A5A5',
    performance: '#9B59B6',
    default: '#CBD5E1'
  };

  $: backgroundColor = categoryColors[category] || categoryColors.default;
</script>

<div 
  class="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800"
  style="background: linear-gradient(135deg, {backgroundColor}20, {backgroundColor}40)"
>
  <div class="text-4xl opacity-50">
    {#if category === 'movie'}
      🎬
    {:else if category === 'tv'}
      📺
    {:else if category === 'book'}
      📚
    {:else if category === 'music'}
      🎵
    {:else if category === 'podcast'}
      🎙️
    {:else if category === 'game'}
      🎮
    {:else if category === 'performance'}
      🎭
    {:else}
      📦
    {/if}
  </div>
</div>