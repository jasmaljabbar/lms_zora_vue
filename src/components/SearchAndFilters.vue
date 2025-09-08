<!-- src/components/SearchAndFilters.vue -->
<template>
  <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
    <div class="flex flex-col sm:flex-row gap-4">
      <!-- Search Bar -->
      <div class="flex-1 relative">
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <i class="pi pi-search text-gray-400"></i>
        </div>
        <input
          :value="searchQuery"
          @input="$emit('update:searchQuery', $event.target.value)"
          type="text"
          placeholder="Search principals by name or email..."
          class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        />
        <button
          v-if="searchQuery"
          @click="$emit('clear-search')"
          class="absolute inset-y-0 right-0 pr-3 flex items-center"
        >
          <i class="pi pi-times text-gray-400 hover:text-gray-600"></i>
        </button>
      </div>

      <!-- Status Filter -->
      <div class="relative">
        <select
          :value="selectedFilter"
          @change="$emit('update:selectedFilter', $event.target.value)"
          class="appearance-none bg-white border border-gray-300 rounded-md px-4 py-2 pr-8 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
        >
          <option value="all">All Principals</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <div class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <i class="pi pi-chevron-down text-gray-400"></i>
        </div>
      </div>
    </div>

    <!-- Results Summary -->
    <div class="mt-4 text-sm text-gray-600">
      Showing {{ filteredCount }} of {{ totalCount }} principals
      <span v-if="searchQuery" class="font-medium">for "{{ searchQuery }}"</span>
    </div>
  </div>
</template>

<script setup>
defineProps({
  searchQuery: String,
  selectedFilter: String,
  filteredCount: Number,
  totalCount: Number
});

defineEmits(['update:searchQuery', 'update:selectedFilter', 'clear-search']);
</script>