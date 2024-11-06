<script lang="ts">
  import { onMount } from 'svelte';
  import Navbar from './lib/Navbar.svelte';
  import ItemGrid from './lib/ItemGrid.svelte';
  import Loading from './lib/Loading.svelte';
  import ErrorMessage from './lib/ErrorMessage.svelte';
  import DarkModeToggle from './lib/DarkModeToggle.svelte';
  import type { ReadingItem } from './types';

  let currentCategory = 'all';
  let items: ReadingItem[] = [];
  let loading = false;
  let error = '';

  async function fetchData(category: string) {
    loading = true;
    error = '';
    try {
      const response = await fetch(`/neodb_data/${category}.json`);
      const jsonData = await response.json();
      items = jsonData.data;
    } catch (err) {
      error = `获取数据时出错: ${err.message}`;
      items = [];
    } finally {
      loading = false;
    }
  }

  function handleCategoryChange(event: CustomEvent<string>) {
    currentCategory = event.detail;
    fetchData(currentCategory);
  }

  onMount(() => {
    fetchData(currentCategory);
  });
</script>

<div class="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300">
  <header class="bg-white/80 dark:bg-gray-800/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-700 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4">
      <div class="py-6">
        <h1 class="text-3xl font-bold text-center bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
          我的收藏
        </h1>
      </div>
      <Navbar {currentCategory} on:categoryChange={handleCategoryChange} />
    </div>
  </header>
  
  <main class="max-w-7xl mx-auto px-4 py-8">
    {#if loading}
      <Loading />
    {:else if error}
      <ErrorMessage {error} />
    {:else}
      <ItemGrid {items} />
    {/if}
  </main>

  <DarkModeToggle />
</div>