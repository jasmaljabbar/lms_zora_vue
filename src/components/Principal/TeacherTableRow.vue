<!-- src/components/TeacherTableRow.vue -->
<template>
  <tr class="hover:bg-gray-50 transition-colors duration-200">
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">
        {{ teacher.first_name }} {{ teacher.last_name }}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">TC000{{ teacher.user_id }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ teacher.department || 'N/A' }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ formatDate(teacher.created_at) }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span :class="[
        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
        teacher.is_active_teacher ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        {{ teacher.is_active_teacher ? 'Active' : 'Inactive' }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('view', teacher)"
          class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center"
          title="View Details"
        >
          <i class="pi pi-eye mr-1"></i>
        </button>
        <button
          @click="$emit('edit', teacher)"
          class="px-3 py-1 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200 flex items-center"
          title="Edit Teacher"
        >
          <i class="pi pi-pencil mr-1"></i>
        </button>
        <button
          @click="$emit('delete', teacher)"
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
  teacher: {
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