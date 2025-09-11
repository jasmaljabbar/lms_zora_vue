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
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-3xl sm:w-full">
        <!-- Modal Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              Student Details - {{ student.first_name }} {{ student.last_name }}
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
                <p><span class="font-medium">Student ID:</span> ST00{{ student.user_id }}</p>
                <p><span class="font-medium">Gender:</span> {{ student.gender || 'N/A' }}</p>
                <p><span class="font-medium">Date of Birth:</span> {{ formatDate(student.date_of_birth) }}</p>
              </div>
            </div>

            <!-- Academic Information -->
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-3">Academic Information</h4>
              <div class="space-y-2">
                <!-- <p><span class="font-medium">Academic Year:</span> {{ student.academic_year || 'N/A' }}</p> -->
                <p><span class="font-medium">Admission Date:</span> {{ formatDate(student.admission_date) }}</p>
                <p><span class="font-medium">Join Date:</span> {{ formatDate(student.created_at) }}</p>
              </div>
            </div>

            <!-- Guardian Information -->
            <div>
              <h4 class="text-sm font-medium text-gray-600 mb-3">Guardian Information</h4>
              <div class="space-y-2">
                <p><span class="font-medium">Guardian Name:</span> {{ student.guardian_name || 'N/A' }}</p>
                <p><span class="font-medium">Relation:</span> {{ student.guardian_relation || 'N/A' }}</p>
                <p><span class="font-medium">Phone:</span> {{ student.guardian_phone || 'N/A' }}</p>
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

          <!-- Enrollment Information -->
          <div class="mt-6 border-t pt-4">
            <!-- <div class="flex justify-between items-center mb-3">
              <h4 class="text-sm font-medium text-gray-600">Enrollment History</h4>
              <button
                @click="$emit('manage-enrollment', student)"
                class="px-3 py-1 text-sm bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
              >
                <i class="pi pi-book mr-1"></i> Manage Enrollment
              </button>
            </div> -->
            
            <div v-if="enrollments && enrollments.length > 0" class="space-y-3">
              <div v-for="enrollment in enrollments" :key="enrollment.id" 
                   class="border rounded-md p-3" :class="enrollment.is_active ? 'bg-blue-50 border-blue-200' : 'bg-gray-50 border-gray-200'">
                <div class="flex justify-between items-start">
                  <div>
                    <p class="font-medium">
                      {{ enrollment.class_associated?.name }} - {{ enrollment.section_associated?.name }}
                    </p>
                    <p class="text-sm text-gray-600">
                      {{ enrollment.academic_session?.name }} 
                      ({{ formatDate(enrollment.academic_session?.start_date) }} - {{ formatDate(enrollment.academic_session?.end_date) }})
                    </p>
                    <p class="text-xs text-gray-500">
                      Enrolled on: {{ formatDate(enrollment.enrollment_date) }}
                    </p>
                  </div>
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    enrollment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ enrollment.is_active ? 'Current' : 'Previous' }}
                  </span>
                </div>
              </div>
            </div>
            <div v-else class="text-center py-4 bg-gray-50 rounded-md">
              <i class="pi pi-book text-2xl text-gray-300 mb-2"></i>
              <p class="text-gray-500">No enrollment records found</p>
            </div>
          </div>

          <!-- Contact Information -->
          <div class="mt-6 border-t pt-4">
            <h4 class="text-sm font-medium text-gray-600 mb-3">Contact Information</h4>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p><span class="font-medium">Phone:</span> {{ student.phone_number || 'N/A' }}</p>
                <p><span class="font-medium">Mobile:</span> {{ student.mobile_number || 'N/A' }}</p>
              </div>
              <div>
                <p><span class="font-medium">Address:</span> {{ formatAddress(student) }}</p>
              </div>
            </div>
          </div>

          <!-- Bio -->
          <div class="mt-6 border-t pt-4">
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
  student: Object,
  enrollments: {
    type: Array,
    default: () => []
  }
});

defineEmits(['close', 'edit', 'manage-enrollment']);

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

// Format address from student object
const formatAddress = (student) => {
  if (!student) return 'N/A';
  
  const addressParts = [
    student.address_line1,
    student.address_line2,
    student.city,
    student.state,
    student.country,
    student.postal_code
  ].filter(part => part && part.trim() !== '');
  
  return addressParts.length > 0 ? addressParts.join(', ') : 'N/A';
};
</script>