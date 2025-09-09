<!-- src/components/Staff.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
     <div class="flex flex-col sm:flex-row sm:justify-end mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
      <button 
        @click="navigateToAddPrincipal" 
        class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
      >
        <i class="pi pi-plus mr-2"></i>
        Add Principal
      </button>
    </div>
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Staff Management</h2>
        <p class="text-sm text-gray-600 mt-1">View all staff members by school</p>
      </div>
    </div>

    <!-- School Selection and Search -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- School Selection -->
        <div class="flex-1 relative">
          <label for="school-select" class="block text-sm font-medium text-gray-700 mb-2">Select School</label>
          <select
            id="school-select"
            v-model="selectedSchoolId"
            @change="fetchStaff"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option v-for="school in schools" :key="school.id" :value="school.id">
              {{ school.name }}
            </option>
          </select>
          <div class="absolute inset-y-0 right-0 top-6 flex items-center px-2 pointer-events-none">
            <!-- <i class="pi pi-chevron-down text-gray-400"></i> -->
          </div>
        </div>

        <!-- Search Bar -->
        <div class="flex-1 relative">
          <label for="staff-search" class="block text-sm font-medium text-gray-700 mb-2">Search Staff</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-search text-gray-400"></i>
            </div>
            <input
              id="staff-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search staff by name..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i class="pi pi-times text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="mt-4 text-sm text-gray-600">
        Showing {{ filteredStaff.length }} of {{ staff.length }} staff members
        <span v-if="selectedSchoolId"> in {{ selectedSchoolName }}</span>
        <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading staff...</p>
    </div>

    <!-- Staff Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Staff Members</h3>
        </div>
        
        <div v-if="filteredStaff.length === 0" class="text-center py-12">
          <i class="pi pi-users text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No staff found matching your search' : 'No staff found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : selectedSchoolId ? 'This school has no staff' : 'No staff available' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="staffMember in filteredStaff"
            :key="staffMember.id"
            class="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Staff Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-lg">{{ staffMember.first_name }} {{ staffMember.last_name }}</h4>
                <p class="text-sm text-gray-600 mt-1">Staff ID: {{ staffMember.staff_id }}</p>
                <div class="flex items-center mt-2">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    staffMember.is_active_staff ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ staffMember.is_active_staff ? 'Active' : 'Inactive' }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Staff Details -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center text-gray-600">
                <i class="pi pi-briefcase mr-2"></i>
                <span>{{ staffMember.department || 'No department specified' }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-calendar mr-2"></i>
                <span>Hired: {{ formatDate(staffMember.hire_date) }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-phone mr-2"></i>
                <span>{{ staffMember.mobile_number || staffMember.phone_number || 'No contact number' }}</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-envelope mr-2"></i>
                <span>{{ staffMember.email || 'No email available' }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Staff Members</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hire Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredStaff.length === 0">
                <td colspan="6" class="px-6 py-12 text-center">
                  <i class="pi pi-users text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No staff found matching your search' : 'No staff found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : selectedSchoolId ? 'This school has no staff' : 'No staff available' }}
                  </p>
                </td>
              </tr>
              <tr
                v-for="staffMember in filteredStaff"
                :key="staffMember.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">
                    {{ staffMember.first_name }} {{ staffMember.last_name }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ staffMember.staff_id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ staffMember.department || 'N/A' }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(staffMember.hire_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ staffMember.mobile_number || staffMember.phone_number || 'N/A' }}
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    staffMember.is_active_staff ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ staffMember.is_active_staff ? 'Active' : 'Inactive' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../../api/axios';
import { useRouter } from 'vue-router';

const schools = ref([]);
const staff = ref([]);
const selectedSchoolId = ref('');
const searchQuery = ref('');
const loading = ref(false);

const router = useRouter();

// Computed property for filtered staff
const filteredStaff = computed(() => {
  let filtered = staff.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(staffMember => 
      staffMember.first_name.toLowerCase().includes(query) ||
      staffMember.last_name.toLowerCase().includes(query) ||
      (staffMember.staff_id && staffMember.staff_id.toLowerCase().includes(query))
    );
  }

  return filtered;
});

// Get selected school name
const selectedSchoolName = computed(() => {
  if (!selectedSchoolId.value) return 'All Schools';
  const school = schools.value.find(s => s.id == selectedSchoolId.value);
  return school ? school.name : 'Selected School';
});

// Fetch schools list
const fetchSchools = async () => {
  try {
    const response = await api.get('/school_profiles/');
    schools.value = response.data;
    if (schools.value.length > 0) {
      selectedSchoolId.value = schools.value[0].id;
      await fetchStaff(); // optional: fetch staff immediately for first school
    }
  } catch (error) {
    console.error('Error fetching schools:', error);
  }
};

// Fetch staff based on selected school
const fetchStaff = async () => {
  loading.value = true;
  try {
    let url = '/staff_profilesadmin/';
    if (selectedSchoolId.value) {
      url += `${selectedSchoolId.value}`;
    }
    
    const response = await api.get(url);
    staff.value = response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    staff.value = [];
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};

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

const navigateToAddPrincipal = () => {
  router.push('/admin/principals/add'); // Navigate to the add principal page
};

onMounted(() => {
  fetchSchools();
  fetchStaff();
});
</script>

<style scoped>
/* Add any specific styles here */
</style>