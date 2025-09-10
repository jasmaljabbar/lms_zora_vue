<!-- src/components/StaffTableRow.vue -->
<template>
  <tr class="hover:bg-gray-50">
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="flex items-center">
        <div class="flex-shrink-0 h-10 w-10">
          <img 
            v-if="staff.avatar_url" 
            class="h-10 w-10 rounded-full" 
            :src="staff.avatar_url" 
            :alt="`${staff.first_name} ${staff.last_name}`"
          >
          <div 
            v-else 
            class="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center"
          >
            <i class="pi pi-user text-gray-600"></i>
          </div>
        </div>
        <div class="ml-4">
          <div class="text-sm font-medium text-gray-900">
            {{ staff.first_name }} {{ staff.last_name }}
          </div>
          <div v-if="staff.mobile_number" class="text-sm text-gray-500">
            {{ staff.mobile_number }}
          </div>
        </div>
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      <span v-if="staff.user_id" class="font-medium">ST000{{ staff.user_id }}</span>
      <span v-else class="text-gray-400 italic">Not assigned</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span class="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
        {{ staff.department || 'N/A' }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      <span class="capitalize">{{ formatEmploymentType(staff.employment_type) }}</span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
      {{ formatDate(staff.hire_date) }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span 
        class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
        :class="staff.is_active_staff 
          ? 'bg-green-100 text-green-800' 
          : 'bg-red-100 text-red-800'"
      >
        {{ staff.is_active_staff ? 'Active' : 'Inactive' }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex items-center justify-end space-x-2">
        <button
          @click="$emit('view', staff)"
          class="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
          title="View Details"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button
          @click="$emit('edit', staff)"
          class="text-indigo-600 hover:text-indigo-900 p-1 rounded hover:bg-indigo-50"
          title="Edit Staff"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('delete', staff)"
          class="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
          title="Delete Staff"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </td>
  </tr>
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
  return type.replace('_', ' ');
};

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};
</script>