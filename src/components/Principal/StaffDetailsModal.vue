<!-- src/components/Admin/StaffDetailsModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200">
        <h3 class="text-lg font-medium text-gray-900">Staff Details</h3>
        <button
          @click="$emit('close')"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
        >
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Modal Content -->
      <div class="mt-4">
        <!-- Staff Header -->
        <div class="flex items-center space-x-4 mb-6">
          <div class="flex-shrink-0">
            <img 
              v-if="staff.avatar_url" 
              class="h-16 w-16 rounded-full" 
              :src="staff.avatar_url" 
              :alt="`${staff.first_name} ${staff.last_name}`"
            >
            <div 
              v-else 
              class="h-16 w-16 rounded-full bg-gray-300 flex items-center justify-center"
            >
              <i class="pi pi-user text-gray-600 text-2xl"></i>
            </div>
          </div>
          <div>
            <h2 class="text-xl font-semibold text-gray-900">
              {{ staff.first_name }} {{ staff.last_name }}
            </h2>
            <p class="text-gray-600">{{ staff.department || 'N/A' }}</p>
            <div class="mt-1">
              <span 
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="staff.is_active_staff 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'"
              >
                {{ staff.is_active_staff ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Staff Information Grid -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Personal Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Personal Information
            </h3>
            
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Full Name</label>
                <p class="text-sm text-gray-900">{{ staff.first_name }} {{ staff.last_name }}</p>
              </div>
              
              <div v-if="staff.gender">
                <label class="text-sm font-medium text-gray-500">Gender</label>
                <p class="text-sm text-gray-900 capitalize">{{ staff.gender }}</p>
              </div>
              
              <div v-if="staff.date_of_birth">
                <label class="text-sm font-medium text-gray-500">Date of Birth</label>
                <p class="text-sm text-gray-900">{{ formatDate(staff.date_of_birth) }}</p>
              </div>
              
              <div v-if="staff.bio">
                <label class="text-sm font-medium text-gray-500">Bio</label>
                <p class="text-sm text-gray-900">{{ staff.bio }}</p>
              </div>
            </div>
          </div>

          <!-- Employment Information -->
          <div class="space-y-4">
            <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
              Employment Details
            </h3>
            
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Staff ID</label>
                <p class="text-sm text-gray-900">{{ staff.staff_id || 'Not assigned' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Department</label>
                <p class="text-sm text-gray-900">{{ staff.department || 'N/A' }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Employment Type</label>
                <p class="text-sm text-gray-900 capitalize">{{ formatEmploymentType(staff.employment_type) }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Hire Date</label>
                <p class="text-sm text-gray-900">{{ formatDate(staff.hire_date) }}</p>
              </div>
              
              <div v-if="staff.office_location">
                <label class="text-sm font-medium text-gray-500">Office Location</label>
                <p class="text-sm text-gray-900">{{ staff.office_location }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Contact Information -->
        <div class="mt-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            Contact Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div v-if="staff.phone_number">
                <label class="text-sm font-medium text-gray-500">Phone Number</label>
                <p class="text-sm text-gray-900">{{ staff.phone_number }}</p>
              </div>
              
              <div v-if="staff.mobile_number">
                <label class="text-sm font-medium text-gray-500">Mobile Number</label>
                <p class="text-sm text-gray-900">{{ staff.mobile_number }}</p>
              </div>
            </div>
            
            <!-- Address Information -->
            <div class="space-y-3">
              <div v-if="staff.address_line1 || staff.city">
                <label class="text-sm font-medium text-gray-500">Address</label>
                <div class="text-sm text-gray-900">
                  <p v-if="staff.address_line1">{{ staff.address_line1 }}</p>
                  <p v-if="staff.address_line2">{{ staff.address_line2 }}</p>
                  <p v-if="staff.city || staff.state || staff.postal_code">
                    {{ [staff.city, staff.state, staff.postal_code].filter(Boolean).join(', ') }}
                  </p>
                  <p v-if="staff.country">{{ staff.country }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- System Information -->
        <div class="mt-6 space-y-4">
          <h3 class="text-lg font-medium text-gray-900 border-b border-gray-200 pb-2">
            System Information
          </h3>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">User ID</label>
                <p class="text-sm text-gray-900">{{ staff.user_id }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">School ID</label>
                <p class="text-sm text-gray-900">{{ staff.school_id }}</p>
              </div>
              
              <div v-if="staff.supervisor_id">
                <label class="text-sm font-medium text-gray-500">Supervisor ID</label>
                <p class="text-sm text-gray-900">{{ staff.supervisor_id }}</p>
              </div>
            </div>
            
            <div class="space-y-3">
              <div>
                <label class="text-sm font-medium text-gray-500">Created Date</label>
                <p class="text-sm text-gray-900">{{ formatDateTime(staff.created_at) }}</p>
              </div>
              
              <div>
                <label class="text-sm font-medium text-gray-500">Last Updated</label>
                <p class="text-sm text-gray-900">{{ formatDateTime(staff.updated_at) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="mt-6 pt-4 border-t border-gray-200 flex items-center justify-end space-x-3">
        <button
          @click="$emit('close')"
          class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Close
        </button>
        <button
          @click="$emit('edit', staff)"
          class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          <i class="pi pi-pencil mr-2"></i>
          Edit Staff
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineEmits(['close', 'edit']);

defineProps({
  show: {
    type: Boolean,
    default: false
  },
  staff: {
    type: Object,
    required: true
  }
});

const formatDate = (date) => {
  if (!date) return 'N/A';
  return new Date(date).toLocaleDateString();
};

const formatDateTime = (dateTime) => {
  if (!dateTime) return 'N/A';
  return new Date(dateTime).toLocaleString();
};

const formatEmploymentType = (type) => {
  if (!type) return 'N/A';
  return type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
</script>