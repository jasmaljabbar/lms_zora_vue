<!-- src/components/Teachers.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Teachers Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all teachers in your system</p>
      </div>
      <button 
        @click="navigateToAddTeacher" 
        class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
      >
        <i class="pi pi-plus mr-2"></i>
        Add Teacher
      </button>
    </div>

    <!-- Search and Filters -->
    <SearchAndFilters
      v-model:searchQuery="searchQuery"
      v-model:searchItem="searchItem"
      v-model:selectedFilter="selectedFilter"
      :filtered-count="filteredTeachers.length"
      :total-count="teachers.length"
      @clear-search="clearSearch"
    />

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading Teachers...</p>
    </div>

    <!-- Teachers Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Teachers</h3>
        </div>
        
        <div v-if="filteredTeachers.length === 0" class="text-center py-12">
          <i class="pi pi-user text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No teachers found matching your search' : 'No teachers found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first teacher to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <TeacherCard
            v-for="teacher in filteredTeachers"
            :key="teacher.user_id"
            :teacher="teacher"
            @view="viewTeacherDetails"
            @edit="editTeacher"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Teachers</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teacher ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Join Date
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
              <tr v-if="filteredTeachers.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <i class="pi pi-user text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No teachers found matching your search' : 'No teachers found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first teacher to get started' }}
                  </p>
                </td>
              </tr>
              <TeacherTableRow
                v-for="teacher in filteredTeachers"
                :key="teacher.user_id"
                :teacher="teacher"
                @view="viewTeacherDetails"
                @edit="editTeacher"
                @delete="confirmDelete"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Teacher Details Modal -->
    <TeacherDetailsModal
      v-if="showDetailsModal"
      :show="showDetailsModal"
      :teacher="selectedTeacher"
      @close="closeDetailsModal"
      @edit="editTeacher"
    />

    <!-- Edit Teacher Modal -->
    <TeacherForm
      v-if="showEditModal"
      :show="showEditModal"
      :teacher="editForm"
      :errors="errors"
      :loading="updating"
      :is-editing="true"
      @close="closeEditModal"
      @submit="updateTeacher"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="teacherToDelete"
      :loading="deleting"
      item_type="teacher"
      @confirm="deleteTeacher"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios';


// Import components
import TeacherForm from './TeacherForm.vue';
import TeacherCard from './TeacherCard.vue';
import TeacherTableRow from './TeacherTableRow.vue';
import TeacherDetailsModal from './TeacherDetailsModal.vue';
import SearchAndFilters from './Admin/SearchAndFilters.vue';
import DeleteConfirmation from './DeleteConfirmation.vue';
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router';

const router = useRouter();
const teachers = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);
const searchItem = ref('teacher');

const route = useRoute();

onMounted(() => {
  if (route.query.success === 'true') {
    toast.success("Teacher added successfully!")
    // remove query param so it doesn't trigger again
    router.replace({ query: { ...route.query, success: undefined } })
  }
})

// Details Modal
const showDetailsModal = ref(false);
const selectedTeacher = ref(null);

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
    department: '',
    // subjects: '',
    office_hours: '',
    is_active_teacher: true
});
const errors = ref({});
const teacherToEdit = ref(null);

// Delete Modal
const showDeleteModal = ref(false);
const teacherToDelete = ref(null);

// Computed property for filtered teachers
const filteredTeachers = computed(() => {
  let filtered = teachers.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(teacher => 
      teacher.first_name?.toLowerCase().includes(query) ||
      teacher.last_name?.toLowerCase().includes(query) ||
      teacher.teacher_id?.toLowerCase().includes(query) ||
      teacher.department?.toLowerCase().includes(query) ||
      teacher.subjects?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(teacher => teacher.is_active_teacher);
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(teacher => !teacher.is_active_teacher);
  }

  return filtered;
});

const fetchTeachers = async () => {
  loading.value = true;
  try {
    const response = await api.get('/teacher_profiles/');
    teachers.value = response.data;
  } catch (error) {
    console.error('Error fetching teachers:', error);
    toast.error('Failed to load teachers');
  } finally {
    loading.value = false;
  }
};

const navigateToAddTeacher = () => {
  router.push('/principal/teachers/add'); // Update this path according to your routing
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Details Modal Functions
const viewTeacherDetails = (teacher) => {
  selectedTeacher.value = teacher;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedTeacher.value = null;
};

// Edit Modal Functions
const editTeacher = (teacher) => {
  teacherToEdit.value = teacher;
  editForm.value = {
    first_name: teacher.first_name || '',
    last_name: teacher.last_name || '',
    gender: teacher.gender || '',
    date_of_birth: teacher.date_of_birth || '',
    bio: teacher.bio || '',
    phone_number: teacher.phone_number || '',
    mobile_number: teacher.mobile_number || '',
    address_line1: teacher.address_line1 || '',
    address_line2: teacher.address_line2 || '',
    city: teacher.city || '',
    state: teacher.state || '',
    country: teacher.country || '',
    postal_code: teacher.postal_code || '',
    teacher_id: teacher.teacher_id || '',
    department: teacher.department || '',
    subjects: teacher.subjects || '',
    employment_type: teacher.employment_type || '',
    join_date: teacher.join_date || '',
    office_location: teacher.office_location || '',
    supervisor_id: teacher.supervisor_id || null,
    is_active_teacher: teacher.is_active_teacher
  };
  errors.value = {};
  showEditModal.value = true;
  // Close details modal if open
  showDetailsModal.value = false;
};

const closeEditModal = () => {
  showEditModal.value = false;
  teacherToEdit.value = null;
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
    teacher_id: '',
    department: '',
    subjects: '',
    employment_type: '',
    join_date: '',
    office_location: '',
    supervisor_id: null,
    is_active_teacher: true
  };
  errors.value = {};
};

const updateTeacher = async () => {
  if (!teacherToEdit.value) return;
  
  updating.value = true;
  errors.value = {};
  
  try {
    const response = await api.put(`/teacher_profiles_staff/${teacherToEdit.value.user_id}/`, editForm.value);
    
    // Update the teacher in the local array
    const index = teachers.value.findIndex(t => t.user_id === teacherToEdit.value.user_id);
    if (index !== -1) {
      teachers.value[index] = {
        ...teachers.value[index],
        ...response.data
      };
    }
    
    closeEditModal();
    toast.success("Teacher updated successfully!");
  
  } catch (error) {
    console.error('Error updating teacher:', error);
    if (error.response && error.response.data) {
      errors.value = error.response.data;
      toast.error('Failed to update teacher');
    } else {
      toast.error('An error occurred while updating teacher');
    }
  } finally {
    updating.value = false;
  }
};

// Delete Modal Functions
const confirmDelete = (teacher) => {
  teacherToDelete.value = teacher;
  showDeleteModal.value = true;
  // Close details modal if open
  showDetailsModal.value = false;
};

const deleteTeacher = async () => {
  if (!teacherToDelete.value) return;
  
  deleting.value = true;
  try {
    await api.delete(`/teacher_profiles_staff/${teacherToDelete.value.user_id}/`);
    
    // Remove from local array
    teachers.value = teachers.value.filter(t => t.user_id !== teacherToDelete.value.user_id);
    
    showDeleteModal.value = false;
    teacherToDelete.value = null;
    toast.success("Teacher deleted successfully!");
  } catch (error) {
    console.error('Error deleting teacher:', error);
    toast.error('Failed to delete teacher');
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  teacherToDelete.value = null;
};

onMounted(() => {
  fetchTeachers();
});
</script>