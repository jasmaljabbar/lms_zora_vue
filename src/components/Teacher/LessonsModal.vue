<!-- src/components/LessonsModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-800">
          Lessons - {{ assignment.subject_associated.name }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="py-4 max-h-96 overflow-y-auto">
        <div v-if="lessons.length === 0" class="text-center py-6">
          <i class="pi pi-book-open text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">No lessons available for this subject</p>
        </div>

        <div v-else class="space-y-3">
          <div v-for="lesson in lessons" :key="lesson.id" 
               class="border rounded-lg p-4" 
               :class="lesson.is_completed ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">
                  Lesson {{ lesson.lesson_number }}: {{ lesson.title }}
                </h4>
                <p class="text-sm text-gray-600 mt-1">{{ lesson.description }}</p>
                <div class="flex items-center mt-2">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    lesson.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ lesson.is_completed ? 'Completed' : 'In Progress' }}
                  </span>
                  <span class="ml-2 text-xs text-gray-500">
                    {{ lesson.is_published ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Lesson Contents -->
            <div v-if="lesson.contents && lesson.contents.length > 0" class="mt-3">
              <p class="text-xs font-medium text-gray-700 mb-1">Contents:</p>
              <div class="flex flex-wrap gap-1">
                <span v-for="(content, index) in lesson.contents" :key="index" 
                      class="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                  {{ content.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-4 border-t mt-4">
        <button @click="$emit('close')" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  assignment: Object,
  lessons: Array
});

defineEmits(['close']);
</script>