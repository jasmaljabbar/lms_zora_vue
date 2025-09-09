<!-- src/components/StudentDetailsModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Modal Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Student Details
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <div class="p-6">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Personal Information -->
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-3">Personal Information</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Name:</span> {{ student.first_name }} {{ student.last_name }}</p>
                <p><span class="font-medium">Student ID:</span> TC00{{ student.user_id }}</p>
                <p><span class="font-medium">Gender:</span> {{ student.gender || 'N/A' }}</p>
                <p><span class="font-medium">Date of Birth:</span> {{ formatDate(student.date_of_birth) }}</p>
              </div>
            </div>

            <!-- Professional Information -->
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-3">Professional Information</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Guardian:</span> {{ student.guardian_name || 'N/A' }}</p>
                <p><span class="font-medium">Subjects:</span> {{ student.subjects || 'N/A' }}</p>
                <p><span class="font-medium">Join Date:</span> {{ formatDate(student.created_at) }}</p>
              </div>
            </div>

            <!-- Contact Information -->
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-3">Contact Information</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Phone:</span> {{ student.phone_number || 'N/A' }}</p>
                <p><span class="font-medium">Mobile:</span> {{ student.mobile_number || 'N/A' }}</p>
                <!-- <p><span class="font-medium">Email:</span> {{ teacher.email || 'N/A' }}</p> -->
              </div>
            </div>

            <!-- Status -->
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-3">Status</h4>
              <div class="space-y-2">
                <p>
                  <span class="font-medium">Status:</span> 
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full ml-2',
                    student.is_active_student ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ student.is_active_student ? 'Active' : 'Inactive' }}
                  </span>
                </p>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="mt-6">
            <h4 class="text-sm font-medium text-gray-600 mb-2">Bio</h4>
            <p class="text-gray-700">{{ student.bio || 'No bio available' }}</p>
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
          <button
            @click="$emit('edit', student)"
            class="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Edit Student
          </button>
          <button
            @click="$emit('close')"
            class="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:w-auto sm:text-sm"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  show: Boolean,
  student: Object
});

defineEmits(['close', 'edit']);

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