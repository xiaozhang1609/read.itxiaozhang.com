<script lang="ts">
  export let error: string;
</script>

<div class="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 z-50">
  <span class="text-2xl">⚠️</span>
  <p class="text-sm font-medium">{error}</p>
</div>