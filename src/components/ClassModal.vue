<!-- src/components/ClassModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">
          {{ isEditing ? 'Edit Class' : 'Create Class' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="$emit('submit', formData)" class="mt-4 space-y-4">
        <div>
          <label for="name" class="block text-sm font-medium text-gray-700">Class Name *</label>
          <input
            id="name"
            v-model="formData.name"
            type="text"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label for="description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="description"
            v-model="formData.description"
            rows="3"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div v-if="isEditing" class="flex items-center">
          <input
            id="is_active"
            v-model="formData.is_active"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="is_active" class="ml-2 block text-sm text-gray-700">Active</label>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading"
            class="px-4 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {{ loading ? 'Processing...' : (isEditing ? 'Update' : 'Create') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: Boolean,
  classData: Object,
  isEditing: Boolean,
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  name: '',
  description: '',
  is_active: true
});

// Watch for classData changes
watch(() => props.classData, (newVal) => {
  if (newVal) {
    formData.value = { ...newVal };
  }
}, { immediate: true });
</script>