<!-- src/components/Students.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Student Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all student in your system</p>
      </div>
      <button 
        @click="navigateToAddStudent" 
        class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
      >
        <i class="pi pi-plus mr-2"></i>
        Add Student
      </button>
    </div>

    <!-- Search and Filters -->
    <SearchAndFilters
      v-model:searchQuery="searchQuery"
      v-model:searchItem="searchItem"
      v-model:selectedFilter="selectedFilter"
      :filtered-count="filteredStudents.length"
      :total-count="students.length"
      @clear-search="clearSearch"
    />

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading Students...</p>
    </div>

    <!-- Students Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Students</h3>
        </div>
        
        <div v-if="filteredStudents.length === 0" class="text-center py-12">
          <i class="pi pi-user text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No students found matching your search' : 'No students found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first teacher to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <StudentCard
            v-for="student in filteredStudents"
            :key="student.user_id"
            :student="student"
            @view="viewStudentDetails"
            @edit="editStudent"
            @delete="confirmDelete"
          />
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Student</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Student ID
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardian
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
              <tr v-if="filteredStudents.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <i class="pi pi-user text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No students found matching your search' : 'No students found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first teacher to get started' }}
                  </p>
                </td>
              </tr>
              <StudentTableRow
                v-for="student in filteredStudents"
                :key="student.user_id"
                :student="student"
                @view="viewStudentDetails"
                @edit="editStudent"
                @delete="confirmDelete"
              />
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Student Details Modal -->
    <StudentDetailsModal
      v-if="showDetailsModal"
      :show="showDetailsModal"
      :student="selectedStudent"
      @close="closeDetailsModal"
      @edit="editStudent"
    />

    <!-- Edit Student Modal -->
    <StudentForm
      v-if="showEditModal"
      :show="showEditModal"
      :student="editForm"
      :errors="errors"
      :loading="updating"
      :is-editing="true"
      @close="closeEditModal"
      @submit="updateStudent"
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
import StudentForm from './StudentForm.vue';
import StudentCard from './StudentCard.vue';
import StudentTableRow from './StudentTableRow.vue';
import StudentDetailsModal from './StudentDetailsModal.vue';
import SearchAndFilters from './Admin/SearchAndFilters.vue';
import DeleteConfirmation from './DeleteConfirmation.vue';
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router';

const router = useRouter();
const students = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);
const searchItem = ref('teacher');

const route = useRoute();
onMounted(() => {
  if (route.query.success === 'true') {
    toast.success("Student added successfully!")
    // remove query param so it doesn't trigger again
    router.replace({ query: { ...route.query, success: undefined } })
  }
})

// Details Modal
const showDetailsModal = ref(false);
const selectedStudent = ref(null);

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
    admission_date: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_relation: '',
    academic_year: '',
    is_active_student: true
});
const errors = ref({});
const studentToEdit = ref(null);

// Delete Modal
const showDeleteModal = ref(false);
const teacherToDelete = ref(null);

// Computed property for filtered students
const filteredStudents = computed(() => {
  let filtered = students.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(student => 
      student.first_name?.toLowerCase().includes(query) ||
      student.last_name?.toLowerCase().includes(query) ||
      student.teacher_id?.toLowerCase().includes(query) ||
      student.department?.toLowerCase().includes(query) ||
      student.subjects?.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(student => student.is_active_student);
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(student => !student.is_active_student);
  }

  return filtered;
});

const fetchStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get('/student_profiles/');
    students.value = response.data;
  } catch (error) {
    console.error('Error fetching students:', error);
    toast.error('Failed to load students');
  } finally {
    loading.value = false;
  }
};

const navigateToAddStudent = () => {
  router.push('/principal/students/add'); // Update this path according to your routing
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Details Modal Functions
const viewStudentDetails = (student) => {
  selectedStudent.value = student;
  showDetailsModal.value = true;
};

const closeDetailsModal = () => {
  showDetailsModal.value = false;
  selectedStudent.value = null;
};

// Edit Modal Functions
const editStudent = (student) => {
  studentToEdit.value = student;
  editForm.value = {
    first_name: student.first_name || '',
    last_name: student.last_name || '',
    gender: student.gender || '',
    date_of_birth: student.date_of_birth || '',
    bio: student.bio || '',
    phone_number: student.phone_number || '',
    mobile_number: student.mobile_number || '',
    address_line1: student.address_line1 || '',
    address_line2: student.address_line2 || '',
    city: student.city || '',
    state: student.state || '',
    country: student.country || '',
    postal_code: student.postal_code || '',
    admission_date: student.admission_date || '',
    guardian_name: student.guardian_name || '',
    guardian_phone: student.guardian_phone || '',
    guardian_relation: student.guardian_relation || '',
    academic_year: student.academic_year || '',
    is_active_student: student.is_active_student
  };
  errors.value = {};
  showEditModal.value = true;
  // Close details modal if open
  showDetailsModal.value = false;
};

const closeEditModal = () => {
  showEditModal.value = false;
  studentToEdit.value = null;
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
    admission_date: '',
    guardian_name: '',
    guardian_phone: '',
    guardian_relation: '',
    academic_year: '',
    is_active_student: true
  };
  errors.value = {};
};

const updateStudent = async () => {
  if (!studentToEdit.value) return;
  
  updating.value = true;
  errors.value = {};
  
  try {
    const response = await api.put(`/studentStaff_profiles/${studentToEdit.value.user_id}/`, editForm.value);
    
    // Update the teacher in the local array
    const index = students.value.findIndex(t => t.user_id === studentToEdit.value.user_id);
    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
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
    students.value = students.value.filter(t => t.user_id !== teacherToDelete.value.user_id);
    
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
  fetchStudents();
});
</script>