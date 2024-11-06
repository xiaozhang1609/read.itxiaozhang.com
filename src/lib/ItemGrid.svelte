<script lang="ts">
  import { onMount } from 'svelte';
  import type { ReadingItem } from '../types';
  import ItemCard from './ItemCard.svelte';

  export let items: ReadingItem[];

  let observer: IntersectionObserver;

  function groupByMonth(data: ReadingItem[]) {
    return data.reduce((acc, item) => {
      const date = new Date(item.created_time);
      const monthYear = `${date.getFullYear()}年${(date.getMonth() + 1).toString().padStart(2, '0')}月`;
      if (!acc[monthYear]) acc[monthYear] = [];
      acc[monthYear].push(item);
      return acc;
    }, {} as Record<string, ReadingItem[]>);
  }

  onMount(() => {
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          img.src = img.dataset.src;
          observer.unobserve(img);
        }
      });
    });

    return () => {
      observer?.disconnect();
    };
  });

  $: groupedItems = groupByMonth(items);
</script>

{#each Object.entries(groupedItems) as [month, monthItems]}
  <div class="mb-12">
    <div class="relative mb-6">
      <div class="absolute inset-0 flex items-center">
        <div class="w-full border-t border-gray-300 dark:border-gray-600"></div>
      </div>
      <div class="relative flex justify-center">
        <span class="px-4 py-2 bg-gradient-to-r from-primary/20 via-primary/30 to-primary/20 text-primary-dark dark:text-primary-light rounded-full text-sm font-bold">
          {month}
        </span>
      </div>
    </div>
    <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
      {#each monthItems as item}
        <ItemCard {item} {observer} />
      {/each}
    </div>
  </div>
{/each}