<script lang="ts">
  export let category: string;
  export let className = '';
  
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
  class="w-full h-full flex items-center justify-center {className}"
  style="background: linear-gradient(135deg, {backgroundColor}20, {backgroundColor}40)"
>
  <div class="relative">
    <div class="text-4xl opacity-50 animate-pulse">
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
    <div 
      class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"
      style="background-size: 200% 100%"
    />
  </div>
</div>

<style>
  @keyframes shimmer {
    0% {
      transform: translateX(-100%) skewX(-12deg);
    }
    100% {
      transform: translateX(200%) skewX(-12deg);
    }
  }
  
  .animate-shimmer {
    animation: shimmer 2s infinite;
  }
</style>