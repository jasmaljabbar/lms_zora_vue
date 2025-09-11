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

    <!-- Tabs Navigation -->
    <div  class="bg-white rounded-lg shadow-md mb-4 sm:mb-6 overflow-hidden">
      <div class="border-b border-gray-200">
        <nav class="flex overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.id"
            @click="activeTab = tab.id"
            :class="[
              'py-3 sm:py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap flex-shrink-0',
              activeTab === tab.id
                ? 'border-blue-500 text-blue-600 bg-blue-50'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
            ]"
          >
            {{ tab.name }}
          </button>
        </nav>
      </div>
    </div>

    <div v-if="activeTab === 'teachers'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800">All Subjects</h3>
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
  <div v-if="activeTab === 'assignment'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800">Assign Subjects to Classes</h3>
      </div>
      <!-- Class Selection -->
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="flex-1 min-w-0">
            <label for="class-select" class="block text-sm font-medium text-gray-700 mb-2">Select teacher</label>
            <select
              id="class-select"
              v-model="selectedTeacherId"
              @change="fetchteacherAssgnments"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select a teacher</option>
              <option v-for="teacherItem in teachers" :key="teacherItem.id" :value="teacherItem.user_id">
                {{ teacherItem.first_name }}
              </option>
            </select>
          </div>
          
          <div v-if="selectedTeacherId" class="flex-shrink-0 w-full lg:w-auto">
            <button
              @click="showAssignTeacherModal = true"
              class="w-full lg:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
            >
              <i class="pi pi-plus mr-2 flex-shrink-0"></i>
              <span class="truncate">Assign Teacher</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingTeacherClass" class="p-8 sm:p-12 text-center">
        <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-sm sm:text-base text-gray-500">Loading class subjects...</p>
      </div>

      <!-- Class Subjects Content -->
      <div v-else class="p-3 sm:p-6">
        <div v-if="!selectedTeacherId" class="text-center py-8 sm:py-12">
          <i class="pi pi-info-circle text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500">Please select a Teacher to view assigned Class</p>
        </div>

        <div v-else-if="teacherclass.length === 0" class="text-center py-8 sm:py-12">
          <i class="pi pi-book text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 mb-2">No subjects assigned to this class</p>
          <p class="text-xs sm:text-sm text-gray-400">Assign subjects to get started</p>
        </div>

        <!-- Mobile Cards View (< sm) -->
        <div v-else-if="subjects.length > 0" class="sm:hidden space-y-4">
          <div
            v-for="classSubject in teacherclass"
            :key="classSubject.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="min-w-0 flex-1">
                <h4 class="text-sm font-semibold text-gray-900 truncate">{{ classSubject.subject_name }}</h4>
                <p class="text-xs text-gray-500 mt-1">Code: {{ classSubject.subject_code }}</p>
              </div>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2',
                classSubject.is_compulsory ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              ]">
                {{ classSubject.is_compulsory ? 'Compulsory' : 'Optional' }}
              </span>
            </div>
            <div class="flex space-x-2 pt-3 border-t border-gray-200">
              <button
                @click="editAssignTeacher(classSubject)"
                class="flex-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <i class="pi pi-pencil mr-2"></i>
                Edit
              </button>
              <button
                @click="confirmDeleteClassSubject(classSubject)"
                class="flex-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <i class="pi pi-trash mr-2"></i>
                Remove
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Table View (>= sm) -->
        <div v-if="teachers.length > 0" class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="teacherClass in teacherclass"
                :key="teacherClass.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ teacherClass.subject_name }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ teacherClass.class_name }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ teacherClass.section_name }}</div>
                </td>
                <!-- <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    teacherClass.is_compulsory ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  ]">
                    {{ teacherClass.is_compulsory ? 'Compulsory' : 'Optional' }}
                  </span>
                </td> -->
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="openEditAssignTeacherModal(teacherClass)"
                      class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Edit Assignment"
                    >
                      <i class="pi pi-pencil mr-1"></i>
                      <span class="hidden md:inline">Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteClassSubject(teacherClass)"
                      class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Remove Assignment"
                    >
                      <i class="pi pi-trash mr-1"></i>
                      <span class="hidden md:inline">Remove</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Subject Modal -->
    <!-- <SubjectModal
      v-if="showCreateSubjectModal || showEditSubjectModal"
      :show="showCreateSubjectModal || showEditSubjectModal"
      :subject-data="currentSubject"
      :is-editing="showEditSubjectModal"
      :loading="subjectLoading"
      @close="closeSubjectModal"
      @submit="handleSubjectSubmit"
    /> -->

    <!-- Assign Subject to Class Modal -->
    <AssignTeacherModal
      v-if="showAssignTeacherModal"
      :show="showAssignTeacherModal"
      :classes="classes"
      :teacher-id="selectedTeacherId"
      :loading="assignmentLoading"
      @close="closeAssignTeacherModal"
      @submit="handleTeacherAssignment"
    />

    <!-- Edit Class Subject Modal -->
    <EditAssignTeacherModal
      v-if="showEditAssignTeacherModal"
      :show="showEditAssignTeacherModal"
      :assign-teacher="currentAssignTeacher"
      :loading="assignmentLoading"
      @close="closeEditAssogmTeacherModal"
      @submit="handleAssignTeacherUpdate"
    />

    <!-- Delete Confirmation Modals -->
    <!-- <DeleteConfirmation
      v-if="showDeleteSubjectModal"
      :show="showDeleteSubjectModal"
      :item="subjectToDelete"
      :loading="subjectLoading"
      item-type="subject"
      @confirm="deleteSubject"
      @cancel="cancelDeleteSubject"
    /> -->

    <DeleteConfirmation
      v-if="showDeleteAssignTeacherModal"
      :show="showDeleteAssignTeacherModal"
      :item="AssignTeacherToDelete"
      :loading="assignmentLoading"
      item-type="teacher assignment"
      @confirm="deleteAssignmenTeacher"
      @cancel="cancelDeleteAssignTeacher"
    />
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import {api,accapi} from '../../api/axios';

import { watch } from 'vue';

// Import components
import TeacherForm from '../Principal/TeacherForm.vue';
import TeacherCard from '../Principal/TeacherCard.vue';
import TeacherTableRow from '../Principal/TeacherTableRow.vue';
import TeacherDetailsModal from '../Principal/TeacherDetailsModal.vue';
import SearchAndFilters from '../Admin/SearchAndFilters.vue';
import DeleteConfirmation from '../Admin/DeleteConfirmation.vue';
import { toast } from 'vue3-toastify'
import { useRoute } from 'vue-router';
import AssignTeacherModal from './AssignTeacherModal.vue';
import EditAssignTeacherModal from './EditAssignTeacherModal.vue';

const router = useRouter();
const subjects = ref([]);
const teachers = ref([]);
const classes = ref([]);
const section = ref([]);
const teacherclass = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);
const searchItem = ref('teacher');
const activeTab = ref('teachers');
const loadingTeacherClass = ref(false)
const selectedTeacherId = ref('');
const teacherAssignment = ref([]);
const loadingTeacherAssignment = ref(false);
const loadingClasses = ref(false);
const assignmentLoading = ref(false);
const loadingSections = ref(false);
const loadingSubjects = ref(false);



// modals
const showAssignTeacherModal = ref(false);
const showEditAssignTeacherModal = ref(false);
const showDeleteAssignTeacherModal = ref(false);
const AssignTeacherToDelete = ref(null);

// Current items for editing
const currentAssignTeacher = ref(null);

const route = useRoute();




// Tabs
const tabs = [
  { id: 'teachers', name: ' Teachers' },
  { id: 'assignment', name: 'Teacher Assignment' }
];

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
  router.push('/staff/teachers/add'); // Update this path according to your routing
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


const fetchteacherAssgnments = async () => {
  if (!selectedTeacherId.value) {
    teacherAssignment.value = [];
    return;
  }

  loadingTeacherAssignment.value = true;
  try {
    const response = await accapi.get('/teacher-assignments/');
    // Filter by selected class and enrich with subject details
    const filtered = response.data.filter(ts => ts.teacher_id == selectedTeacherId.value);
    
    // Enrich with subject information
    teacherAssignment.value = filtered.map(ta => {
      const teacher = teachers.value.find(t => t.id === ta.subject_id);
      return {
        ...ta,
        teacher_name: teacher ? subject.name : 'Unknown',
        // subject_code: subject ? subject.code : 'N/A'
      };
    });
  } catch (error) {
    console.error('Error fetching class subjects:', error);
    toast.error('Failed to load class subjects');
    teacherAssignment.value = [];
  } finally {
    loadingTeacherAssignment.value = false;
  }
};

const closeAssignTeacherModal = () => {
  showAssignTeacherModal.value = false;
};


const fetchClasses = async () => {
  loadingClasses.value = true;
  try {
    const response = await accapi.get('/classes/');
    classes.value = response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    toast.error('Failed to load classes');
  } finally {
    loadingClasses.value = false;
  }
};

const fetchSection = async () => {
  loadingClasses.value = true;
  try {
    const response = await accapi.get('/sections/');
    classes.value = response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    toast.error('Failed to load sections');
  } finally {
    loadingSections.value = false;
  }
};

const fetchSubjects = async () => {
  loadingSubjects.value = true;
  try {
    const response = await accapi.get('/subjects/');
    subjects.value = response.data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    toast.error('Failed to load subjects');
  } finally {
    loadingSubjects.value = false;
  }
};

const fetchTeacherAssignment = async (teacher_id) => {
  loadingSubjects.value = true;
  try {
    const response = await accapi.get(`/teacher-assignments/teacher/${teacher_id}`);

    // Map API response into formatted data
    teacherclass.value = response.data.map(item => ({
      ...item,
      subject_name: item.subject_associated?.name || 'Unknown',
      class_name: item.class_associated?.name || 'N/A',
      section_name: item.section_associated?.name || 'N/A',
      academic_session_name: item.academic_session?.name || 'N/A'
    }));

  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    toast.error('Failed to load teacher assignments');
    teacherclass.value = [];
  } finally {
    loadingSubjects.value = false;
  }
};


// Class Teacher operations
const assignTeacherToClass = async (assignmentData) => {
  assignmentLoading.value = true;
  try {
    const response = await accapi.post('/teacher-assignments/', assignmentData);
    teacherclass.value.push({
      ...response.data,
      subject_name: subjects.value.find(s => s.id === assignmentData.subject_id)?.name || 'Unknown',
      class_name: classes.value.find(c => c.id === assignmentData.class_id)?.name || 'N/A',
      section_name: section.value.find(c => c.id === assignmentData.section_id)?.name || 'N/A'
    });
    toast.success('Subject assigned to class successfully');
    closeAssignSubjectModal();
  } catch (error) {
    console.error('Error assigning subject:', error);
    toast.error('Failed to assign subject to class');
  } finally {
    assignmentLoading.value = false;
  }
};

const updateAssignTeacher = async (assignmentData) => {
  console.log('UpdateAssignTeacher called with:', assignmentData);
  assignmentLoading.value = true;
  try {
    const response = await accapi.put(`/teacher-assignments/${assignmentData.id}/`, assignmentData);

    // Update teacherclass with response data
    const index = teacherclass.value.findIndex(ta => ta.id === assignmentData.id);
    if (index !== -1) {
      teacherclass.value[index] = {
        ...response.data,
        subject_name: response.data.subject_associated?.name,
        class_name: response.data.class_associated?.name,
        section_name: response.data.section_associated?.name,
        academic_session_name: response.data.academic_session?.name
      };
    }

    toast.success('Teacher assignment updated successfully');
    closeEditAssignTeacherModal();
  } catch (error) {
    console.error('Error updating teacher assignment:', error);
    toast.error('Failed to update teacher assignment');
  } finally {
    assignmentLoading.value = false;
  }
};
const confirmDeleteClassSubject = (classSubject) => {
  AssignTeacherToDelete.value = {
    ...classSubject,
    name: classSubject.subject_name // 🔑 add name field for modal
  };
  showDeleteAssignTeacherModal.value = true;
};
const deleteAssignmenTeacher = async () => {
  if (!AssignTeacherToDelete.value) return;

  assignmentLoading.value = true;
  try {
    await accapi.delete(`/teacher-assignments/${AssignTeacherToDelete.value.id}/`);
    teacherclass.value = teacherclass.value.filter(ta => ta.id !== AssignTeacherToDelete.value.id);
    toast.success('Teacher assignment deleted successfully');
    showDeleteAssignTeacherModal.value = false;
    AssignTeacherToDelete.value = null;
  } catch (error) {
    console.error('Error deleting teacher assignment:', error);
    toast.error('Failed to delete teacher assignment');
  } finally {
    assignmentLoading.value = false;
  }
};
const cancelDeleteAssignTeacher = () => {
  showDeleteAssignTeacherModal.value = false;
  AssignTeacherToDelete.value = null;
};


const handleTeacherAssignment = (assignmentData) => {
  assignTeacherToClass(assignmentData);
};

const editAssignTeacher = (classSubject) => {
  currentAssignTeacher.value = { ...classSubject };
  showEditAssignTeacherModal.value = true;
};

const closeEditAssogmTeacherModal = () => {
  closeEditAssignTeacherModal()
};

const handleAssignTeacherUpdate = (assignmentData) => {
  console.log('Parent received update data:', assignmentData);
  updateAssignTeacher(assignmentData);
};

const closeEditAssignTeacherModal = () => {
  showEditAssignTeacherModal.value = false;
  currentAssignTeacher.value = null;
};

const openEditAssignTeacherModal = (assignmentData) => {
  console.log('Opening edit modal with data:', assignmentData);
  currentAssignTeacher.value = assignmentData;
  showEditAssignTeacherModal.value = true;
};

watch(selectedTeacherId, (newVal) => {
  if (newVal) {
    fetchTeacherAssignment(newVal);
  } else {
    teacherclass.value = []; // clear if no teacher selected
  }
});


onMounted(() => {
  fetchTeachers();
  fetchClasses();
  fetchSubjects();
  fetchSection();
});
</script>