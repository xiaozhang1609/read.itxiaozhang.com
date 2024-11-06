<script lang="ts">
  import { onMount } from 'svelte';

  function toggleDarkMode() {
    document.documentElement.classList.toggle('dark');
    localStorage.setItem('darkMode', document.documentElement.classList.contains('dark').toString());
  }

  onMount(() => {
    if (
      localStorage.getItem('darkMode') === 'true' ||
      (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      document.documentElement.classList.add('dark');
    }
  });
</script>

<button
  class="fixed bottom-4 right-4 p-3 bg-white dark:bg-gray-800 text-gray-800 dark:text-white rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group"
  on:click={toggleDarkMode}
>
  <span class="block dark:hidden transform group-hover:rotate-12 transition-transform">🌙</span>
  <span class="hidden dark:block transform group-hover:rotate-180 transition-transform">☀️</span>
</button>