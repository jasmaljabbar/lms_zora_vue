<!-- src/components/Admin/StaffCard.vue -->
<template>
  <div class="p-4 border-b border-gray-200 hover:bg-gray-50">
    <div class="flex items-start justify-between">
      <div class="flex items-center space-x-3 flex-1">
        <div class="flex-shrink-0">
          <img 
            v-if="staff.avatar_url" 
            class="h-12 w-12 rounded-full" 
            :src="staff.avatar_url" 
            :alt="`${staff.first_name} ${staff.last_name}`"
          >
          <div 
            v-else 
            class="h-12 w-12 rounded-full bg-gray-300 flex items-center justify-center"
          >
            <i class="pi pi-user text-gray-600 text-lg"></i>
          </div>
        </div>
        <div class="flex-1 min-w-0">
          <h4 class="text-lg font-medium text-gray-900 truncate">
            {{ staff.first_name }} {{ staff.last_name }}
          </h4>
          <div class="mt-1 space-y-1">
            <p v-if="staff.staff_id" class="text-sm text-gray-600">
              <span class="font-medium">Staff ID:</span> {{ staff.staff_id }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Department:</span> {{ staff.department || 'N/A' }}
            </p>
            <p class="text-sm text-gray-600">
              <span class="font-medium">Employment:</span> {{ formatEmploymentType(staff.employment_type) }}
            </p>
            <p v-if="staff.mobile_number" class="text-sm text-gray-600">
              <span class="font-medium">Mobile:</span> {{ staff.mobile_number }}
            </p>
          </div>
          <div class="mt-2 flex items-center space-x-2">
            <span 
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="staff.is_active_staff 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'"
            >
              {{ staff.is_active_staff ? 'Active' : 'Inactive' }}
            </span>
            <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
              {{ staff.department || 'N/A' }}
            </span>
          </div>
        </div>
      </div>
      <div class="flex items-center space-x-2 ml-3">
        <button
          @click="$emit('view', staff)"
          class="text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-50"
          title="View Details"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button
          @click="$emit('edit', staff)"
          class="text-indigo-600 hover:text-indigo-900 p-2 rounded-full hover:bg-indigo-50"
          title="Edit Staff"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('delete', staff)"
          class="text-red-600 hover:text-red-900 p-2 rounded-full hover:bg-red-50"
          title="Delete Staff"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['view', 'edit', 'delete']);

defineProps({
  staff: {
    type: Object,
    required: true
  }
});

const formatEmploymentType = (type) => {
  if (!type) return 'N/A';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
</script>