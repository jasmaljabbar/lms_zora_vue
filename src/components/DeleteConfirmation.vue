<!-- src/components/DeleteConfirmation.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="mt-3 text-center">
        <div class="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
          <i class="pi pi-exclamation-triangle text-red-600 text-xl"></i>
        </div>
        <h3 class="text-lg font-medium text-gray-900 mt-2">Delete {{item_type}} Member</h3>
        <div class="mt-2 px-7 py-3">
          <p class="text-sm text-gray-500">
            Are you sure you want to delete 
            <span class="font-semibold text-gray-700">
              {{ staff?.first_name }} {{ item?.last_name }}
            </span>?
          </p>
          <p class="text-sm text-gray-500 mt-1">
            This action cannot be undone and will permanently remove all associated data.
          </p>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="items-center px-4 py-3">
        <div class="flex flex-col sm:flex-row-reverse gap-2">
          <button
            @click="$emit('confirm')"
            :disabled="loading"
            class="px-4 py-2 bg-red-600 text-white text-base font-medium rounded-md w-full shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <div v-if="loading" class="flex items-center justify-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Deleting...
            </div>
            <span v-else>Delete {{item_type}}</span>
          </button>
          <button
            @click="$emit('cancel')"
            :disabled="loading"
            class="px-4 py-2 bg-white text-gray-500 text-base font-medium rounded-md w-full shadow-sm border border-gray-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['confirm', 'cancel']);

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  item: {
    type: Object,
    default: null
  },
  loading: {
    type: Boolean,
    default: false
  },
  item_type: {
    type: String,
    default: 'staff member'
  } 
});
</script>