<!-- src/components/SectionBulkModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Create Sections</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700">Section Names *</label>
          <p class="text-sm text-gray-500 mb-2">Enter section names separated by commas (e.g., A,B,C,D)</p>
          <textarea
            v-model="sectionNames"
            rows="3"
            required
            placeholder="A, B, C, D"
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>

        <div>
          <label for="capacity" class="block text-sm font-medium text-gray-700">Capacity *</label>
          <input
            id="capacity"
            v-model.number="capacity"
            type="number"
            min="1"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          />
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
            {{ loading ? 'Creating...' : 'Create Sections' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  show: Boolean,
  classId: Number,
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

const sectionNames = ref('');
const capacity = ref(40);

const handleSubmit = () => {
  const sectionNamesArray = sectionNames.value
    .split(',')
    .map(name => name.trim())
    .filter(name => name);

  if (sectionNamesArray.length === 0) {
    alert('Please enter at least one section name');
    return;
  }

  emit('submit', {
    class_id: props.classId,
    section_names: sectionNamesArray,
    capacity: capacity.value,
    class_teacher: null // Leave null for now as requested
  });

  // Reset form
  sectionNames.value = '';
  capacity.value = 40;
};
</script>