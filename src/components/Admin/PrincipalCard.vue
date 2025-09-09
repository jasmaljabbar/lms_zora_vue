<!-- src/components/PrincipalCard.vue -->
<template>
  <div
    class="p-4 hover:bg-gray-50 transition-colors duration-200"
  >
    <!-- Principal Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900 text-lg">{{ principal.first_name }} {{ principal.last_name }}</h4>
        <p class="text-sm text-gray-600 mt-1">{{ principal.email }}</p>
        <div class="flex items-center mt-2">
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            principal.is_active_principal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ principal.is_active_principal ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
      <div class="flex space-x-2 ml-4">
        <button
          @click="$emit('edit', principal)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          title="Edit Principal"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('delete', principal)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          title="Delete Principal"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Contact Info -->
    <div class="space-y-2 text-sm">
      <div class="flex items-center text-gray-600">
        <i class="pi pi-phone mr-2"></i>
        <span>{{ principal.mobile_number || 'N/A' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-building mr-2"></i>
        <span>{{ principal.school_name || 'No School Assigned' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  principal: {
    type: Object,
    required: true
  }
});

defineEmits(['edit', 'delete']);
</script>