<!-- src/components/SchoolCard.vue -->
<template>
  <div class="p-4 hover:bg-gray-50 transition-colors duration-200">
    <!-- School Header -->
    <div class="flex justify-between items-start mb-3">
      <div>
        <h4 class="font-semibold text-gray-900 text-lg">{{ school.name }}</h4>
        <p class="text-sm text-gray-600 mt-1">
          Principal: {{ school.principal_name || 'Not Assigned' }}
        </p>
      </div>
      <div class="flex space-x-2 ml-4">
        <button
          @click="$emit('edit', school)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          title="Edit School"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('delete', school)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          title="Delete School"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-3 gap-4">
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900">{{ school.total_staff }}</p>
        <p class="text-xs text-gray-500">Staff</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900">{{ school.total_teachers }}</p>
        <p class="text-xs text-gray-500">Teachers</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-gray-900">{{ school.total_students }}</p>
        <p class="text-xs text-gray-500">Students</p>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  school: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>