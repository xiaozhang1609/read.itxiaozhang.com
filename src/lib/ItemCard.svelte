<script lang="ts">
  import type { ReadingItem } from '../types';

  export let item: ReadingItem;
  export let observer: IntersectionObserver;

  let img: HTMLImageElement;
  let isHovered = false;

  $: if (img && observer) {
    observer.observe(img);
  }
</script>

<div
  class="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
>
  <a href="https://neodb.social{item.item.url}" target="_blank" rel="noreferrer" class="block">
    <div class="aspect-[2/3] overflow-hidden relative">
      <img
        bind:this={img}
        data-src={item.item.cover_image_url}
        alt={item.item.display_title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </div>
    
    <div class="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-8 group-hover:translate-y-0 transition-transform duration-300">
      <h3 class="text-lg font-bold mb-2 line-clamp-2">
        {item.item.display_title}
      </h3>
      <div class="flex items-center justify-between">
        <span class="px-2 py-1 bg-black/30 rounded-full text-xs backdrop-blur-sm">
          {item.item.category}
        </span>
        {#if item.rating_grade}
          <span class="flex items-center gap-1">
            <span class="text-yellow-400">★</span>
            <span class="font-bold">{item.rating_grade}</span>
          </span>
        {/if}
      </div>
    </div>
  </a>
</div>