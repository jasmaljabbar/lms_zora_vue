<!-- src/components/SchoolTableRow.vue -->
<template>
  <tr class="hover:bg-gray-50 transition-colors duration-200">
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">{{ school.name }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">
        {{ school.principal_name || 'Not Assigned' }}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ school.total_staff }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ school.total_teachers }}
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {{ school.total_students }}
    </td>
    <!-- <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('edit', school)"
          class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center"
          title="Edit School"
        >
          <i class="pi pi-pencil mr-1"></i>
          Edit
        </button>
        <button
          @click="$emit('delete', school)"
          class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center"
          title="Delete School"
        >
          <i class="pi pi-trash mr-1"></i>
          Delete
        </button>
      </div>
    </td> -->
  </tr>
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