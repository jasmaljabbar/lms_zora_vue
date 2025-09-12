<!-- src/components/Students.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Student Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all students in your system</p>
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
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first student to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <StudentCard
            v-for="student in filteredStudents"
            :key="student.user_id"
            :student="student"
            :enrollments="getStudentEnrollments(student.user_id)"
            @view="viewStudentDetails"
            @edit="editStudent"
            @delete="confirmDelete"
            @manage-enrollment="manageEnrollment"
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
                  Current Class
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
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
                <td colspan="8" class="px-6 py-12 text-center">
                  <i class="pi pi-user text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No students found matching your search' : 'No students found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first student to get started' }}
                  </p>
                </td>
              </tr>
              <StudentTableRow
                v-for="student in filteredStudents"
                :key="student.user_id"
                :student="student"
                :enrollments="getStudentEnrollments(student.user_id)"
                @view="viewStudentDetails"
                @edit="editStudent"
                @delete="confirmDelete"
                @manage-enrollment="manageEnrollment"
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
      :enrollments="getStudentEnrollments(selectedStudent?.user_id)"
      @close="closeDetailsModal"
      @edit="editStudent"
      @manage-enrollment="manageEnrollment"
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

    <!-- Enrollment Management Modal -->
    <StudentEnrollmentModal
      v-if="showEnrollmentModal"
      :show="showEnrollmentModal"
      :student="selectedStudent"
      :enrollments="getStudentEnrollments(selectedStudent?.user_id)"
      :loading="enrollmentLoading"
      @close="closeEnrollmentModal"
      @add="addEnrollment"
      @edit="editEnrollment"
      @delete="deleteEnrollment"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="studentToDelete"
      :loading="deleting"
      item_type="student"
      @confirm="deleteStudent"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {api,accapi} from '../../api/axios';

// Import components
import StudentForm from '../Principal/StudentForm.vue';
import StudentCard from '../Principal/StudentCard.vue';
import StudentTableRow from '../Principal/StudentTableRow.vue';
import StudentDetailsModal from '../Principal/StudentDetailsModal.vue';
import StudentEnrollmentModal from './StudentEnrollmentModal.vue';
import SearchAndFilters from '../Admin/SearchAndFilters.vue';
import DeleteConfirmation from '../Admin/DeleteConfirmation.vue';
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router';

const router = useRouter();
const students = ref([]);
const enrollments = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);
const enrollmentLoading = ref(false);
const searchItem = ref('student');

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

// Enrollment Modal
const showEnrollmentModal = ref(false);

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
const studentToDelete = ref(null);

// Updated filteredStudents computed property for the second document
const filteredStudents = computed(() => {
  let filtered = students.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(student => {
      // Basic student information search
      const basicMatch = 
        student.first_name?.toLowerCase().includes(query) ||
        student.last_name?.toLowerCase().includes(query) ||
        student.user_id?.toString().toLowerCase().includes(query) ||
        student.department?.toLowerCase().includes(query) ||
        student.subjects?.toLowerCase().includes(query) ||
        student.guardian_name?.toLowerCase().includes(query) ||
        student.guardian_phone?.toLowerCase().includes(query) ||
        student.phone_number?.toLowerCase().includes(query) ||
        student.mobile_number?.toLowerCase().includes(query) ||
        student.city?.toLowerCase().includes(query) ||
        student.state?.toLowerCase().includes(query);

      // Get student enrollments for additional search
      const studentEnrollments = getStudentEnrollments(student.user_id);
      
      // Search in enrollment data using actual properties
      const enrollmentMatch = studentEnrollments.some(enrollment => 
        enrollment.class_id?.toString().includes(query) ||
        enrollment.section_id?.toString().includes(query) ||
        enrollment.academic_session_id?.toString().includes(query) ||
        // If you have lookup data for names, add those too
        enrollment.class_name?.toLowerCase().includes(query) ||
        enrollment.section_name?.toLowerCase().includes(query) ||
        enrollment.academic_year?.toLowerCase().includes(query)
      );

      return basicMatch || enrollmentMatch;
    });
  }

  // Apply status filter
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(student => student.is_active_student);
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(student => !student.is_active_student);
  }

  return filtered;
});

// Alternative approach if you want to make it more comprehensive
const filteredStudentsAlternative = computed(() => {
  let filtered = students.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(student => {
      // Create a searchable string with all relevant data
      const studentEnrollments = getStudentEnrollments(student.user_id);
      
      // Combine all searchable fields
      const searchFields = [
        student.first_name,
        student.last_name,
        student.user_id,
        student.department,
        student.subjects,
        student.guardian_name,
        student.guardian_phone,
        student.guardian_relation,
        student.phone_number,
        student.mobile_number,
        student.city,
        student.state,
        student.address_line1,
        ...studentEnrollments.flatMap(enrollment => [
          enrollment.class_name,
          enrollment.section_name,
          enrollment.academic_year,
          enrollment.class,
          enrollment.section
        ])
      ];

      // Check if any field matches the search query
      return searchFields.some(field => 
        field?.toString().toLowerCase().includes(query)
      );
    });
  }

  // Apply status filter
  if (selectedFilter.value === 'active') {
    filtered = filtered.filter(student => student.is_active_student);
  } else if (selectedFilter.value === 'inactive') {
    filtered = filtered.filter(student => !student.is_active_student);
  }

  return filtered;
});

// Get enrollments for a specific student
const getStudentEnrollments = (studentId) => {
  if (!studentId) return [];
  const result = enrollments.value.filter(enrollment => enrollment.student_id === studentId);
  console.log(`Enrollments for ${studentId}:`, result);
  return result;
};

const fetchStudents = async () => {
  loading.value = true;
  try {
    const [studentsResponse, enrollmentsResponse] = await Promise.all([
      api.get('/student_profiles/'),
      accapi.get('/student-enrollments/')
    ]);
    students.value = studentsResponse.data;
    enrollments.value = enrollmentsResponse.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    toast.error('Failed to load data');
  } finally {
    loading.value = false;
  }
};

const getuserrole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.roles,'user roles');
  
  return user?.roles;
};


const navigateToAddStudent = () => {
  const userrole = getuserrole();
  if (userrole && userrole.includes('principal')) {
    router.push('/principal/students/add');
    return;
  }
  router.push('/staff/students/add');
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

// Enrollment Modal Functions
const manageEnrollment = (student) => {
  selectedStudent.value = student;
  showEnrollmentModal.value = true;
};

const closeEnrollmentModal = () => {
  showEnrollmentModal.value = false;
  selectedStudent.value = null;
};

const addEnrollment = async (enrollmentData) => {
  enrollmentLoading.value = true;
  try {
    const response = await accapi.post('/student-enrollments/', enrollmentData);
    enrollments.value.push(response.data);
    toast.success("Enrollment added successfully!");
  } catch (error) {
    console.error('Error adding enrollment:', error);
    toast.error('Failed to add enrollment');
  } finally {
    enrollmentLoading.value = false;
  }
};

const editEnrollment = async (enrollmentId, enrollmentData) => {
  enrollmentLoading.value = true;
  try {
    const response = await accapi.put(`/student-enrollments/${enrollmentId}`, enrollmentData);
    const index = enrollments.value.findIndex(e => e.id === enrollmentId);
    if (index !== -1) {
      enrollments.value[index] = response.data;
    }
    toast.success("Enrollment updated successfully!");
  } catch (error) {
    console.error('Error updating enrollment:', error);
    toast.error('Failed to update enrollment');
  } finally {
    enrollmentLoading.value = false;
  }
};

const deleteEnrollment = async (enrollmentId) => {
  enrollmentLoading.value = true;
  try {
    await accapi.delete(`/student-enrollments/${enrollmentId}`);
    enrollments.value = enrollments.value.filter(e => e.id !== enrollmentId);
    toast.success("Enrollment deleted successfully!");
  } catch (error) {
    console.error('Error deleting enrollment:', error);
    toast.error('Failed to delete enrollment');
  } finally {
    enrollmentLoading.value = false;
  }
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
    
    // Update the student in the local array
    const index = students.value.findIndex(t => t.user_id === studentToEdit.value.user_id);
    if (index !== -1) {
      students.value[index] = {
        ...students.value[index],
        ...response.data
      };
    }
    
    closeEditModal();
    toast.success("Student updated successfully!");
  
  } catch (error) {
    console.error('Error updating student:', error);
    if (error.response && error.response.data) {
      errors.value = error.response.data;
      toast.error('Failed to update student');
    } else {
      toast.error('An error occurred while updating student');
    }
  } finally {
    updating.value = false;
  }
};

// Delete Modal Functions
const confirmDelete = (student) => {
  studentToDelete.value = student;
  showDeleteModal.value = true;
  // Close details modal if open
  showDetailsModal.value = false;
};

const deleteStudent = async () => {
  if (!studentToDelete.value) return;
  
  deleting.value = true;
  try {
    await api.delete(`/studentStaff_profiles/${studentToDelete.value.user_id}/`);
    
    // Remove from local array
    students.value = students.value.filter(t => t.user_id !== studentToDelete.value.user_id);
    
    showDeleteModal.value = false;
    studentToDelete.value = null;
    toast.success("Student deleted successfully!");
  } catch (error) {
    console.error('Error deleting student:', error);
    toast.error('Failed to delete student');
  } finally {
    deleting.value = false;
  }
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  studentToDelete.value = null;
};


onMounted(() => {
  fetchStudents();
  
});
</script>