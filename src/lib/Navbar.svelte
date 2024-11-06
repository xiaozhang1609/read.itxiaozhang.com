<script lang="ts">
  import { createEventDispatcher } from 'svelte';
  
  export let currentCategory: string;
  
  const dispatch = createEventDispatcher<{ categoryChange: string }>();
  
  const categories = [
    { id: 'all', label: '全部', icon: '📚' },
    { id: 'movie', label: '电影', icon: '🎬' },
    { id: 'tv', label: '剧集', icon: '📺' },
    { id: 'book', label: '图书', icon: '📚' },
    { id: 'music', label: '音乐', icon: '🎵' },
    { id: 'podcast', label: '播客', icon: '🎙️' },
    { id: 'game', label: '游戏', icon: '🎮' },
    { id: 'performance', label: '演出', icon: '🎭' },
  ];

  function handleClick(category: string) {
    dispatch('categoryChange', category);
  }
</script>

<nav class="pb-4">
  <ul class="flex flex-wrap gap-2 justify-center">
    {#each categories as { id, label, icon }}
      <li>
        <button
          class="group relative px-4 py-2 rounded-full transition-all duration-300 {
            currentCategory === id
              ? 'bg-primary text-white shadow-lg shadow-primary/30'
              : 'bg-white dark:bg-gray-700 hover:bg-primary/10 dark:hover:bg-primary/20'
          }"
          on:click={() => handleClick(id)}
        >
          <span class="flex items-center gap-2">
            <span class="text-lg">{icon}</span>
            <span class="font-medium">{label}</span>
          </span>
          {#if currentCategory === id}
            <span class="absolute inset-0 rounded-full animate-pulse bg-primary/20"></span>
          {/if}
        </button>
      </li>
    {/each}
  </ul>
</nav>