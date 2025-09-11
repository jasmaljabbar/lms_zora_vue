<!-- src/components/StudentCardWithEnrollment.vue -->
<template>
  <div class="p-4 hover:bg-gray-50 transition-colors duration-200">
    <!-- Student Header -->
    <div class="flex justify-between items-start mb-3">
      <div class="flex-1">
        <h4 class="font-semibold text-gray-900 text-lg">{{ student.first_name }} {{ student.last_name }}</h4>
        <p class="text-sm text-gray-600 mt-1">Student ID: ST000{{ student.user_id }}</p>
        <div class="flex items-center mt-2">
          <span :class="[
            'px-2 py-1 text-xs font-medium rounded-full',
            student.is_active_student ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
          ]">
            {{ student.is_active_student ? 'Active' : 'Inactive' }}
          </span>
        </div>
      </div>
      <div class="flex space-x-2 ml-4">
        <button
          @click="$emit('view', student)"
          class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
          title="View Details"
        >
          <i class="pi pi-eye"></i>
        </button>
        <button
          @click="$emit('edit', student)"
          class="p-2 text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
          title="Edit Student"
        >
          <i class="pi pi-pencil"></i>
        </button>
        <button
          @click="$emit('manage-enrollment', student)"
          class="p-2 text-purple-600 hover:bg-purple-50 rounded-md transition-colors duration-200"
          title="Manage Enrollment"
        >
          <i class="pi pi-book"></i>
        </button>
        <button
          @click="$emit('delete', student)"
          class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          title="Delete Student"
        >
          <i class="pi pi-trash"></i>
        </button>
      </div>
    </div>

    <!-- Enrollment Information -->
    <div v-if="enrollments && enrollments.length > 0" class="mb-3 p-3 bg-blue-50 rounded-md">
      <h5 class="font-medium text-blue-800 text-sm mb-2">Current Enrollment</h5>
      <div v-for="enrollment in enrollments.filter(e => e.is_active)" :key="enrollment.id" class="text-sm">
        <div class="flex items-center text-blue-700">
          <i class="pi pi-graduation-cap mr-2"></i>
          <span>{{ enrollment.class_associated?.name }} - {{ enrollment.section_associated?.name }}</span>
        </div>
        <div class="text-xs text-blue-600 ml-4">
          Session: {{ enrollment.academic_session?.name }} (Enrolled: {{ formatDate(enrollment.enrollment_date) }})
        </div>
      </div>
      <div v-if="enrollments.filter(e => !e.is_active).length > 0" class="mt-2 text-xs text-blue-600">
        + {{ enrollments.filter(e => !e.is_active).length }} previous enrollment(s)
      </div>
    </div>
    <div v-else class="mb-3 p-3 bg-gray-50 rounded-md">
      <p class="text-sm text-gray-600">No enrollment records</p>
    </div>

    <!-- Student Details -->
    <div class="space-y-2 text-sm">
      <div class="flex items-center text-gray-600">
        <i class="pi pi-user mr-2"></i>
        <span>Guardian: {{ student.guardian_name || 'Not specified' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-graduation-cap mr-2"></i>
        <span>Academic Year: {{ student.academic_year || 'Not specified' }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-calendar mr-2"></i>
        <span>Admission: {{ formatDate(student.admission_date) }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-calendar-plus mr-2"></i>
        <span>Joined: {{ formatDate(student.created_at) }}</span>
      </div>
      <div class="flex items-center text-gray-600">
        <i class="pi pi-phone mr-2"></i>
        <span>Guardian Phone: {{ student.guardian_phone || 'No contact number' }}</span>
      </div>
      <div v-if="student.previous_school" class="flex items-center text-gray-600">
        <i class="pi pi-building mr-2"></i>
        <span>Previous School: {{ student.previous_school }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

const props = defineProps({
  student: {
    type: Object,
    required: true
  },
  enrollments: {
    type: Array,
    default: () => []
  }
});

defineEmits(['view', 'edit', 'delete', 'manage-enrollment']);

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