<script lang="ts">
  import { onMount } from 'svelte';
  import PlaceholderImage from './PlaceholderImage.svelte';
  
  export let item;
  let img: HTMLImageElement;
  let isHovered = false;
  let imageLoaded = false;
  let imageError = false;

  function handleImageLoad() {
    imageLoaded = true;
  }

  function handleImageError() {
    imageError = true;
  }
</script>

<div
  class="group relative bg-white dark:bg-gray-800 rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
  on:mouseenter={() => isHovered = true}
  on:mouseleave={() => isHovered = false}
>
  <a href="https://neodb.social{item.item.url}" target="_blank" rel="noreferrer" class="block">
    <div class="aspect-[2/3] overflow-hidden relative">
      {#if !imageLoaded || imageError}
        <PlaceholderImage category={item.item.category} />
      {/if}
      <img
        bind:this={img}
        src={item.item.cover_image_url}
        alt={item.item.display_title}
        class="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        class:opacity-0={!imageLoaded}
        on:load={handleImageLoad}
        on:error={handleImageError}
      />
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