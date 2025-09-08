<!-- src/components/LoadingSpinner.vue -->
<template>
  <div class="bg-white p-12 rounded-lg shadow-md text-center">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
    <p class="text-gray-500">{{ message || 'Loading...' }}</p>
  </div>
</template>

<script setup>
defineProps({
  message: String
});
</script>