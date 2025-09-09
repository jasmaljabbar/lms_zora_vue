<!-- src/components/Staffs.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Staff Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all staff members in your system</p>
      </div>
      <button 
        @click="navigateToAddStaff" 
        class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
      >
        <i class="pi pi-plus mr-2"></i>
        Add Staff
      </button>
    </div>

    <!-- Search and Filters -->
    <SearchAndFilters
      v-model:searchQuery="searchQuery"
      v-model:searchItem="searchItem"
      v-model:selectedFilter="selectedFilter"
      :filtered-count="filteredStaffs.length"
      :total-count="staffs.length"
      @clear-search="clearSearch"
    />

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading Staff...</p>
    </div>

    <!-- Staff Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Staff Members</h3>
        </div>
        
        <div v-if="filteredStaffs.length === 0" class="text-center py-12">
          <i class="pi pi-users text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No staff found matching your search' : 'No staff found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first staff member to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <StaffCard
            v-for="staff in filteredStaffs"
            :key="staff.user_id"
            :staff="staff"
            @view="viewStaffDetails"
            @edit="editStaff"
            @delete="confirmDelete"
          />
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
                  Employment Type
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hire Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredStaffs.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <i class="pi pi-users text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No staff found matching your search' : 'No staff found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first staff member to get started' }}
                  </p>
                </td>
              </tr>
              <StaffTableRow
                v-for="staff in filteredStaffs"
                :key="staff.user_id"
                :staff="staff"
                @view="viewStaffDetails"
                @edit="editStaff"
                @delete="confirmDelete"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Staff Details Modal -->
    <StaffDetailsModal
      v-if="showDetailsModal"
      :show="showDetailsModal"
      :staff="selectedStaff"
      @close="closeDetailsModal"
      @edit="editStaff"
    />

    <!-- Edit Staff Modal -->
    <StaffForm
      v-if="showEditModal"
      :show="showEditModal"
      :staff="editForm"
      :errors="errors"
      :loading="updating"
      :is-editing="true"
      @close="closeEditModal"
      @submit="updateStaff"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="staffToDelete"
      :loading="deleting"
      item_type="staff"
      @confirm="deleteStaff"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';

// Import components
import StaffForm from './StaffForm.vue';
import StaffCard from './StaffCard.vue';
import StaffTableRow from './StaffTableRow.vue';
import StaffDetailsModal from './StaffDetailsModal.vue';
import SearchAndFilters from './Admin/SearchAndFilters.vue';
import DeleteConfirmation from './DeleteConfirmation.vue';
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router';


const router = useRouter();
const staffs = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);
const searchItem = ref('staff');

const route = useRoute();

onMounted(() => {
  if (route.query.success === 'true') {
    toast.success("Staff added successfully!")
    // remove query param so it doesn’t trigger again
    router.replace({ query: { ...route.query, success: undefined } })
  }
})

// Details Modal
const showDetailsModal = ref(false);
const selectedStaff = ref(null);

// Edit Modal
const showEditModal = ref(false);
const editForm = ref({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    bio: '',
    phone_number: '',
    mobile_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    staff_id: '',
    department: '',
    employment_type: '',
    hire_date: '',
    office_location: '',
    supervisor_id: null,
    is_active_staff: true
});
const errors = ref({});
const staffToEdit = ref(null);

// Delete Modal
const showDeleteModal = ref(false);
const staffToDelete = ref(null);

// Computed property for filtered staffs
const filteredStaffs = computed(() => {
  let filtered = staffs.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(staff => 
      staff.first_name?.toLowerCase().includes(query) ||
      staff.last_name?.toLowerCase().includes(query) ||
      staff.staff_id?.toLowerCase().includes(query) ||
      staff.department?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(staff => staff.is_active_staff);
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(staff => !staff.is_active_staff);
  }

  return filtered;
});

const fetchStaffs = async () => {
  loading.value = true;
  try {
    const response = await api.get('/staff_profiles/');
    staffs.value = response.data;
  } catch (error) {
    console.error('Error fetching staff:', error);
    // Handle error, e.g., show a toast message
  } finally {
    loading.value = false;
  }
};

const navigateToAddStaff = () => {
  router.push('/principal/add');
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Details Modal Functions
const viewStaffDetails = (staff) => {
  selectedStaff.value = staff;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedStaff.value = null;
};

// Edit Modal Functions
const editStaff = (staff) => {
  staffToEdit.value = staff;
  editForm.value = {
    first_name: staff.first_name || '',
    last_name: staff.last_name || '',
    gender: staff.gender || '',
    date_of_birth: staff.date_of_birth || '',
    bio: staff.bio || '',
    phone_number: staff.phone_number || '',
    mobile_number: staff.mobile_number || '',
    address_line1: staff.address_line1 || '',
    address_line2: staff.address_line2 || '',
    city: staff.city || '',
    state: staff.state || '',
    country: staff.country || '',
    postal_code: staff.postal_code || '',
    staff_id: staff.user_id || '',
    department: staff.department || '',
    employment_type: staff.employment_type || '',
    hire_date: staff.hire_date || '',
    office_location: staff.office_location || '',
    supervisor_id: staff.supervisor_id || null,
    is_active_staff: staff.is_active_staff
  };
  errors.value = {};
  showEditModal.value = true;
  // Close details modal if open
  showDetailsModal.value = false;
};

const closeEditModal = () => {
  showEditModal.value = false;
  staffToEdit.value = null;
  editForm.value = {
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    bio: '',
    phone_number: '',
    mobile_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    staff_id: '',
    department: '',
    employment_type: '',
    hire_date: '',
    office_location: '',
    supervisor_id: null,
    is_active_staff: true
  };
  errors.value = {};
};

const updateStaff = async () => {
  if (!staffToEdit.value) return;
  
  updating.value = true;
  errors.value = {};
  
  try {
    const response = await api.put(`/staff_profiles_principal/${staffToEdit.value.user_id}/`, editForm.value);
    
    // Update the staff in the local array
    const index = staffs.value.findIndex(s => s.user_id === staffToEdit.value.user_id);
    if (index !== -1) {
      staffs.value[index] = {
        ...staffs.value[index],
        ...response.data
      };
    }
    
    closeEditModal();
    // You might want to show a success toast here
    toast.success("Updated successful!")
  
  } catch (error) {
    console.error('Error updating staff:', error);
    if (error.response && error.response.data) {
      errors.value = error.response.data;
    }
    // Handle error, show error toast
  } finally {
    updating.value = false;
  }
};

// Delete Modal Functions
const confirmDelete = (staff) => {
  staffToDelete.value = staff;
  showDeleteModal.value = true;
  // Close details modal if open
  showDetailsModal.value = false;
};

const deleteStaff = async () => {
  if (!staffToDelete.value) return;
  
  deleting.value = true;
  try {
    await api.delete(`/staff_profiles_principal/${staffToDelete.value.user_id}/`);
    
    // Remove from local array
    staffs.value = staffs.value.filter(s => s.user_id !== staffToDelete.value.user_id);
    
    showDeleteModal.value = false;
    staffToDelete.value = null;
    // You might want to show a success toast here
    toast.success("Staff deleted successfully!")
  } catch (error) {
    console.error('Error deleting staff:', error);
    // Handle error, show error toast
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  staffToDelete.value = null;
};

onMounted(() => {
  fetchStaffs();
});
</script>