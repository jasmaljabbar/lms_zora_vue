<!-- src/components/PrincipalTableRow.vue -->
<template>
  <tr class="hover:bg-gray-50 transition-colors duration-200">
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm font-medium text-gray-900">
        {{ principal.first_name }} {{ principal.last_name }}
      </div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ principal.email }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ principal.mobile_number || 'N/A' }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <div class="text-sm text-gray-500">{{ principal.school_name || 'Not Assigned' }}</div>
    </td>
    <td class="px-6 py-4 whitespace-nowrap">
      <span :class="[
        'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
        principal.is_active_principal ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
      ]">
        {{ principal.is_active_principal ? 'Active' : 'Inactive' }}
      </span>
    </td>
    <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
      <div class="flex justify-end space-x-2">
        <button
          @click="$emit('edit', principal)"
          class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center"
          title="Edit Principal"
        >
          <i class="pi pi-pencil mr-1"></i>
          Edit
        </button>
        <button
          @click="$emit('delete', principal)"
          class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center"
          title="Delete Principal"
        >
          <i class="pi pi-trash mr-1"></i>
          Delete
        </button>
      </div>
    </td>
  </tr>
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