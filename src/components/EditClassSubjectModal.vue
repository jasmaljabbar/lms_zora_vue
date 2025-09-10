<!-- src/components/EditClassSubjectModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Edit Subject Assignment</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="$emit('submit', formData)" class="mt-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Subject</label>
          <p class="mt-1 text-sm text-gray-600">{{ classSubject.subject_name }} ({{ classSubject.subject_code }})</p>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Class</label>
          <p class="mt-1 text-sm text-gray-600">{{ classSubject.class_name || 'Unknown' }}</p>
        </div>

        <div class="flex items-center">
          <input
            id="is_compulsory"
            v-model="formData.is_compulsory"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label for="is_compulsory" class="ml-2 block text-sm text-gray-700">Compulsory Subject</label>
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
            {{ loading ? 'Updating...' : 'Update Assignment' }}
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
  classSubject: Object,
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = ref({
  id: null,
  is_compulsory: true
});

// Watch for classSubject changes
watch(() => props.classSubject, (newVal) => {
  if (newVal) {
    formData.value = {
      id: newVal.id,
      is_compulsory: newVal.is_compulsory
    };
  }
}, { immediate: true });
</script>