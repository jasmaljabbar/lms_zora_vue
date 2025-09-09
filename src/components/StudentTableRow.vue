<!-- src/components/StudentTableRow.vue -->
<template>
  <tr class="hover:bg-gray-50 transition-colors duration-200">
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">
        {{ student.first_name }} {{ student.last_name }}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">ST000{{ student.user_id }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ student.guardian_name || 'N/A' }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ formatDate(student.created_at) }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span :class="[
        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
        student.is_active_student ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        {{ student.is_active_student ? 'Active' : 'Inactive' }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('view', student)"
          class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center"
          title="View Details"
        >
          <i class="pi pi-eye mr-1"></i>
        </button>
        <button
          @click="$emit('edit', student)"
          class="px-3 py-1 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 flex items-center"
          title="Edit Teacher"
        >
          <i class="pi pi-pencil mr-1"></i>
        </button>
        <button
          @click="$emit('delete', student)"
          class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center"
          title="Delete Teacher"
        >
          <i class="pi pi-trash mr-1"></i>
        </button>
      </div>
    </td>
  </tr>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  student: {
    type: Object,
    required: true
  }
});

defineEmits(['view', 'edit', 'delete']);

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    return dateString;
  }
};
</script>