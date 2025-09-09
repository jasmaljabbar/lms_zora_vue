<!-- src/components/Principals.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Principals Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all principals in your system</p>
      </div>
      <button 
        @click="navigateToAddPrincipal" 
        class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
      >
        <i class="pi pi-plus mr-2"></i>
        Add Principal
      </button>
    </div>

    <!-- Search and Filters -->
    <SearchAndFilters
      v-model:searchQuery="searchQuery"
      v-model:selectedFilter="selectedFilter"
      :filtered-count="filteredPrincipals.length"
      :total-count="principals.length"
      @clear-search="clearSearch"
    />

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading principals...</p>
    </div>

    <!-- Principals Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Principals</h3>
        </div>
        
        <div v-if="filteredPrincipals.length === 0" class="text-center py-12">
          <i class="pi pi-user text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No principals found matching your search' : 'No principals found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first principal to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <PrincipalCard
            v-for="principal in filteredPrincipals"
            :key="principal.user_id"
            :principal="principal"
            @edit="editPrincipal"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Principals</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Phone
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School
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
              <tr v-if="filteredPrincipals.length === 0">
                <td colspan="6" class="px-6 py-12 text-center">
                  <i class="pi pi-user text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No principals found matching your search' : 'No principals found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first principal to get started' }}
                  </p>
                </td>
              </tr>
              <PrincipalTableRow
                v-for="principal in filteredPrincipals"
                :key="principal.user_id"
                :principal="principal"
                @edit="editPrincipal"
                @delete="confirmDelete"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Edit Principal Modal -->
    <PrincipalForm
      v-if="showEditModal"
      :show="showEditModal"
      :principal="editForm"
      :errors="errors"
      :loading="updating"
      :is-editing="true"
      @close="closeEditModal"
      @submit="updatePrincipal"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :principal="principalToDelete"
      :loading="deleting"
      @confirm="deletePrincipal"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

// Import components
import PrincipalForm from './PrincipalForm.vue';
import PrincipalCard from './PrincipalCard.vue';
import PrincipalTableRow from './PrincipalTableRow.vue';
import SearchAndFilters from './SearchAndFilters.vue';
import DeleteConfirmation from './DeleteConfirmation.vue';

const router = useRouter();
const principals = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);

// Edit Modal
const showEditModal = ref(false);
const editForm = ref({
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    mobile_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    years_of_experience: "0",
    qualification: '',
    office_number: '',
    is_active_principal : true
});
const errors = ref({});
const principalToEdit = ref(null);

// Delete Modal
const showDeleteModal = ref(false);
const principalToDelete = ref(null);

// Computed property for filtered principals
const filteredPrincipals = computed(() => {
  let filtered = principals.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(principal => 
      principal.first_name.toLowerCase().includes(query) ||
      principal.last_name.toLowerCase().includes(query) ||
      principal.email.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(principal => principal.is_active_principal);
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(principal => !principal.is_active_principal);
  }

  return filtered;
});

const fetchPrincipals = async () => {
  loading.value = true;
  try {
    const response = await api.get('/principal_profiles/');
    principals.value = response.data;
  } catch (error) {
    console.error('Error fetching principals:', error);
    // Handle error, e.g., show a toast message
  } finally {
    loading.value = false;
  }
};

const navigateToAddPrincipal = () => {
  router.push('/admin/principals/add');
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Edit Modal Functions
const editPrincipal = (principal) => {
  principalToEdit.value = principal;
  editForm.value = {
    first_name: principal.first_name,
    last_name: principal.last_name,
    gender: principal.gender,
    date_of_birth: principal.date_of_birth || '',
    phone_number: principal.phone_number || '',
    mobile_number: principal.mobile_number || '',
    address_line1: principal.address_line1 || '',
    address_line2: principal.address_line2 || '',
    city: principal.city || '',
    state: principal.state || '',
    country: principal.country || '',
    postal_code: principal.postal_code || '',
    years_of_experience: principal.years_of_experience || '0',
    qualification: principal.qualification || '',
    office_number: principal.office_number || '',
    is_active_principal: principal.is_active_principal
  };
  errors.value = {};
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  principalToEdit.value = null;
  editForm.value = {
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    mobile_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    years_of_experience: '0',
    qualification: '',
    office_number: '',
    is_active_principal : true
  };
  errors.value = {};
};

const updatePrincipal = async () => {
  if (!principalToEdit.value) return;
  
  updating.value = true;
  errors.value = {};
  
  try {
    const response = await api.put(`/principal_admin_profiles/${principalToEdit.value.user_id}/`, editForm.value);
    
    // Update the principal in the local array while preserving school_name
    const index = principals.value.findIndex(p => p.user_id === principalToEdit.value.user_id);
    if (index !== -1) {
      // Preserve the school_name if it's not in the response
      const updatedPrincipal = {
        ...principals.value[index], // Keep existing data including school_name
        ...response.data,           // Override with new data from API
        school_name: response.data.school_name || principals.value[index].school_name // Preserve school_name if not in response
      };
      principals.value[index] = updatedPrincipal;
    }
    
    closeEditModal();
    // You might want to show a success toast here
  } catch (error) {
    console.error('Error updating principal:', error);
    if (error.response && error.response.data) {
      errors.value = error.response.data;
    }
    // Handle error, show error toast
  } finally {
    updating.value = false;
  }
};

// Delete Modal Functions
const confirmDelete = (principal) => {
  principalToDelete.value = principal;
  showDeleteModal.value = true;
};

const deletePrincipal = async () => {
  if (!principalToDelete.value) return;
  
  deleting.value = true;
  try {
    await api.delete(`/principal_admin_profiles/${principalToDelete.value.user_id}/`);
    
    // Remove from local array
    principals.value = principals.value.filter(p => p.user_id !== principalToDelete.value.user_id);
    
    showDeleteModal.value = false;
    principalToDelete.value = null;
    // You might want to show a success toast here
  } catch (error) {
    console.error('Error deleting principal:', error);
    // Handle error, show error toast
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  principalToDelete.value = null;
};

onMounted(() => {
  fetchPrincipals();
});
</script>