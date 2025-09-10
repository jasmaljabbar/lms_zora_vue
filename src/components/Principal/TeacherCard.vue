<!-- src/components/TeacherCard.vue -->
<template>
  <div class="p-4 hover:bg-gray-50 transition-colors duration-200">
    <!-- Teacher Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900 text-lg">{{ teacher.first_name }} {{ teacher.last_name }}</h4>
        <p class="text-sm text-gray-600 mt-1">Teacher ID: {{ teacher.teacher_id }}</p>
        <div class="flex items-center mt-2">
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            teacher.is_active_teacher ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ teacher.is_active_teacher ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
      <div class="flex space-x-2 ml-4">
        <button
          @click="$emit('view', teacher)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          title="View Details"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button
          @click="$emit('edit', teacher)"
          class="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
          title="Edit Teacher"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('delete', teacher)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          title="Delete Teacher"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Teacher Details -->
    <div class="space-y-2 text-sm">
      <div class="flex items-center text-gray-600">
        <i class="pi pi-briefcase mr-2"></i>
        <span>{{ teacher.department || 'No department specified' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-book mr-2"></i>
        <span>Subjects: {{ teacher.subjects || 'Not specified' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-calendar mr-2"></i>
        <span>Joined: {{ formatDate(teacher.join_date) }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-phone mr-2"></i>
        <span>{{ teacher.mobile_number || teacher.phone_number || 'No contact number' }}</span>
      </div>
    </div>
  </div>
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