<!-- src/components/Schools.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Schools Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all schools in your system</p>
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
      :filtered-count="filteredSchools.length"
      :total-count="schools.length"
      @clear-search="clearSearch"
    />

    <!-- Loading State -->
    <LoadingSpinner v-if="loading" message="Loading schools..." />

    <!-- Schools Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Schools</h3>
        </div>
        
        <div v-if="filteredSchools.length === 0" class="text-center py-12">
          <i class="pi pi-building text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No schools found matching your search' : 'No schools found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first school to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <SchoolCard
            v-for="school in filteredSchools"
            :key="school.id"
            :school="school"
            @edit="editSchool"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Schools</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  School Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Principal
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Staff
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teachers
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Students
                </th>
                <!-- <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th> -->
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredSchools.length === 0">
                <td colspan="6" class="px-6 py-12 text-center">
                  <i class="pi pi-building text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No schools found matching your search' : 'No schools found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first school to get started' }}
                  </p>
                </td>
              </tr>
              <SchoolTableRow
                v-for="school in filteredSchools"
                :key="school.id"
                :school="school"
                @edit="editSchool"
                @delete="confirmDelete"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="schoolToDelete"
      :principal="principalToDelete"
      :loading="deleting"
      item-type="school"
      @confirm="deleteSchool"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios';

// Import components
import SearchAndFilters from './SearchAndFilters.vue';
import SchoolCard from './SchoolCard.vue';
import SchoolTableRow from './SchoolTableRow.vue';
import LoadingSpinner from './LoadingSpinner.vue';
import DeleteConfirmation from './DeleteConfirmation.vue';

const router = useRouter();
const schools = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const deleting = ref(false);

// Delete Modal
const showDeleteModal = ref(false);
const schoolToDelete = ref(null);

// Computed property for filtered schools
const filteredSchools = computed(() => {
  let filtered = schools.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(school => 
      school.name.toLowerCase().includes(query) ||
      (school.principal_name && school.principal_name.toLowerCase().includes(query))
    );
  }

  // Apply principal filter
  if (selectedFilter.value === 'with-principal') {
    filtered = filtered.filter(school => school.principal_name);
  } else if (selectedFilter.value === 'without-principal') {
    filtered = filtered.filter(school => !school.principal_name);
  }

  return filtered;
});

const fetchSchools = async () => {
  loading.value = true;
  try {
    const response = await api.get('/school_profiles/');
    schools.value = response.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    // Handle error, e.g., show a toast message
  } finally {
    loading.value = false;
  }
};

const navigateToAddPrincipal = () => {
  router.push('/admin/principals/add'); // Navigate to the add principal page
};
const clearSearch = () => {
  searchQuery.value = '';
};

const editSchool = (school) => {
  // Navigate to edit school page
  router.push(`/admin/schools/${school.id}/edit`);
};

const confirmDelete = (school) => {
  schoolToDelete.value = school;
  showDeleteModal.value = true;
};

const deleteSchool = async () => {
  if (!schoolToDelete.value) return;
  
  deleting.value = true;
  try {
    await api.delete(`/schools/${schoolToDelete.value.id}/`);
    
    // Remove from local array
    schools.value = schools.value.filter(s => s.id !== schoolToDelete.value.id);
    
    showDeleteModal.value = false;
    schoolToDelete.value = null;
    // You might want to show a success toast here
  } catch (error) {
    console.error('Error deleting school:', error);
    // Handle error, show error toast
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  schoolToDelete.value = null;
};

onMounted(() => {
  fetchSchools();
});
</script>