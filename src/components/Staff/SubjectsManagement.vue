<!-- src/components/SubjectsManagement.vue -->
<template>
  <div class="p-3 sm:p-4 lg:p-6 max-w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
      <div class="min-w-0 flex-1">
        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Subjects Management</h2>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">Manage subjects and assign them to classes</p>
      </div>
      <div class="flex-shrink-0 w-full sm:w-auto">
        <button 
          @click="showCreateSubjectModal = true" 
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
        >
          <i class="pi pi-plus mr-2 flex-shrink-0"></i>
          <span class="truncate">Add Subject</span>
        </button>
      </div>
    </div>

    <!-- Tabs Navigation -->
    <div class="bg-white rounded-lg shadow-md mb-4 sm:mb-6 overflow-hidden">
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

    <!-- Subjects List Tab -->
    <div v-if="activeTab === 'subjects'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800">All Subjects</h3>
      </div>

      <!-- Loading State -->
      <div v-if="loadingSubjects" class="p-8 sm:p-12 text-center">
        <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-sm sm:text-base text-gray-500">Loading subjects...</p>
      </div>

      <!-- Subjects Content -->
      <div v-else class="p-3 sm:p-6">
        <div v-if="subjects.length === 0" class="text-center py-8 sm:py-12">
          <i class="pi pi-book text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 mb-2">No subjects found</p>
          <p class="text-xs sm:text-sm text-gray-400">Create your first subject to get started</p>
        </div>

        <!-- Mobile Cards View (< sm) -->
        <div v-else-if="subjects.length > 0" class="sm:hidden space-y-4">
          <div
            v-for="subject in subjects"
            :key="subject.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200"
          >
            <div class="flex justify-between items-start mb-3">
              <div class="min-w-0 flex-1">
                <h4 class="text-sm font-semibold text-gray-900 truncate">{{ subject.name }}</h4>
                <p class="text-xs text-gray-500 mt-1">Code: {{ subject.code }}</p>
              </div>
              <div class="flex space-x-1 ml-2">
                <button
                  @click="editSubject(subject)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Edit Subject"
                >
                  <i class="pi pi-pencil text-sm"></i>
                </button>
                <button
                  @click="confirmDeleteSubject(subject)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  title="Delete Subject"
                >
                  <i class="pi pi-trash text-sm"></i>
                </button>
              </div>
            </div>
            <div v-if="subject.description" class="text-xs text-gray-600 bg-white p-2 rounded border">
              {{ subject.description }}
            </div>
            <div v-else class="text-xs text-gray-400 italic">No description</div>
          </div>
        </div>

        <!-- Desktop Table View (>= sm) -->
        <div v-if="subjects.length > 0" class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject Name
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="subject in subjects"
                :key="subject.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ subject.name }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ subject.code }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4">
                  <div class="text-sm text-gray-500 max-w-xs truncate">{{ subject.description || 'No description' }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editSubject(subject)"
                      class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Edit Subject"
                    >
                      <i class="pi pi-pencil mr-1"></i>
                      <span class="hidden md:inline">Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteSubject(subject)"
                      class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Delete Subject"
                    >
                      <i class="pi pi-trash mr-1"></i>
                      <span class="hidden md:inline">Delete</span>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Class Subjects Assignment Tab -->
    <div v-if="activeTab === 'assignment'" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800">Assign Subjects to Classes</h3>
      </div>

      <!-- Class Selection -->
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <div class="flex flex-col lg:flex-row lg:items-end space-y-4 lg:space-y-0 lg:space-x-4">
          <div class="flex-1 min-w-0">
            <label for="class-select" class="block text-sm font-medium text-gray-700 mb-2">Select Class</label>
            <select
              id="class-select"
              v-model="selectedClassId"
              @change="fetchClassSubjects"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm sm:text-base"
            >
              <option value="">Select a class</option>
              <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
                {{ classItem.name }}
              </option>
            </select>
          </div>
          
          <div v-if="selectedClassId" class="flex-shrink-0 w-full lg:w-auto">
            <button
              @click="showAssignSubjectModal = true"
              class="w-full lg:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
            >
              <i class="pi pi-plus mr-2 flex-shrink-0"></i>
              <span class="truncate">Assign Subject</span>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingClassSubjects" class="p-8 sm:p-12 text-center">
        <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-sm sm:text-base text-gray-500">Loading class subjects...</p>
      </div>

      <!-- Class Subjects Content -->
      <div v-else class="p-3 sm:p-6">
        <div v-if="!selectedClassId" class="text-center py-8 sm:py-12">
          <i class="pi pi-info-circle text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500">Please select a class to view assigned subjects</p>
        </div>

        <div v-else-if="classSubjects.length === 0" class="text-center py-8 sm:py-12">
          <i class="pi pi-book text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 mb-2">No subjects assigned to this class</p>
          <p class="text-xs sm:text-sm text-gray-400">Assign subjects to get started</p>
        </div>

        <!-- Mobile Cards View (< sm) -->
        <div v-else-if="subjects.length > 0" class="sm:hidden space-y-4">
          <div
            v-for="classSubject in classSubjects"
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
                @click="editClassSubject(classSubject)"
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
        <div v-if="subjects.length > 0" class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Subject
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Type
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="classSubject in classSubjects"
                :key="classSubject.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ classSubject.subject_name }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ classSubject.subject_code }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    classSubject.is_compulsory ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                  ]">
                    {{ classSubject.is_compulsory ? 'Compulsory' : 'Optional' }}
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editClassSubject(classSubject)"
                      class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Edit Assignment"
                    >
                      <i class="pi pi-pencil mr-1"></i>
                      <span class="hidden md:inline">Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteClassSubject(classSubject)"
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
    <SubjectModal
      v-if="showCreateSubjectModal || showEditSubjectModal"
      :show="showCreateSubjectModal || showEditSubjectModal"
      :subject-data="currentSubject"
      :is-editing="showEditSubjectModal"
      :loading="subjectLoading"
      @close="closeSubjectModal"
      @submit="handleSubjectSubmit"
    />

    <!-- Assign Subject to Class Modal -->
    <AssignSubjectModal
      v-if="showAssignSubjectModal"
      :show="showAssignSubjectModal"
      :class-id="selectedClassId"
      :subjects="availableSubjects"
      :loading="assignmentLoading"
      @close="closeAssignSubjectModal"
      @submit="handleSubjectAssignment"
    />

    <!-- Edit Class Subject Modal -->
    <EditClassSubjectModal
      v-if="showEditClassSubjectModal"
      :show="showEditClassSubjectModal"
      :class-subject="currentClassSubject"
      :loading="assignmentLoading"
      @close="closeEditClassSubjectModal"
      @submit="handleClassSubjectUpdate"
    />

    <!-- Delete Confirmation Modals -->
    <DeleteConfirmation
      v-if="showDeleteSubjectModal"
      :show="showDeleteSubjectModal"
      :item="subjectToDelete"
      :loading="subjectLoading"
      item-type="subject"
      @confirm="deleteSubject"
      @cancel="cancelDeleteSubject"
    />

    <DeleteConfirmation
      v-if="showDeleteClassSubjectModal"
      :show="showDeleteClassSubjectModal"
      :item="classSubjectToDelete"
      :loading="assignmentLoading"
      item-type="subject assignment"
      @confirm="deleteClassSubject"
      @cancel="cancelDeleteClassSubject"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {api,accapi} from '../../api/axios';
import { toast } from 'vue3-toastify';

// Import components
import SubjectModal from './SubjectModal.vue';
import AssignSubjectModal from './AssignSubjectModal.vue';
import EditClassSubjectModal from './EditClassSubjectModal.vue';
import DeleteConfirmation from '../Admin/DeleteConfirmation.vue';

// Data
const subjects = ref([]);
const classes = ref([]);
const classSubjects = ref([]);
const selectedClassId = ref('');
const activeTab = ref('subjects');
const loadingSubjects = ref(false);
const loadingClasses = ref(false);
const loadingClassSubjects = ref(false);
const subjectLoading = ref(false);
const assignmentLoading = ref(false);

// Modals
const showCreateSubjectModal = ref(false);
const showEditSubjectModal = ref(false);
const showAssignSubjectModal = ref(false);
const showEditClassSubjectModal = ref(false);
const showDeleteSubjectModal = ref(false);
const showDeleteClassSubjectModal = ref(false);

// Current items for editing
const currentSubject = ref(null);
const currentClassSubject = ref(null);
const subjectToDelete = ref(null);
const classSubjectToDelete = ref(null);

// Tabs
const tabs = [
  { id: 'subjects', name: 'All Subjects' },
  { id: 'assignment', name: 'Class Assignment' }
];

// Computed properties
const availableSubjects = computed(() => {
  const assignedSubjectIds = classSubjects.value.map(cs => cs.subject_id);
  return subjects.value.filter(subject => !assignedSubjectIds.includes(subject.id));
});

// Methods
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

const fetchClassSubjects = async () => {
  if (!selectedClassId.value) {
    classSubjects.value = [];
    return;
  }

  loadingClassSubjects.value = true;
  try {
    const response = await accapi.get('/class_subjects/');
    // Filter by selected class and enrich with subject details
    const filtered = response.data.filter(cs => cs.class_id == selectedClassId.value);
    
    // Enrich with subject information
    classSubjects.value = filtered.map(cs => {
      const subject = subjects.value.find(s => s.id === cs.subject_id);
      return {
        ...cs,
        subject_name: subject ? subject.name : 'Unknown',
        subject_code: subject ? subject.code : 'N/A'
      };
    });
  } catch (error) {
    console.error('Error fetching class subjects:', error);
    toast.error('Failed to load class subjects');
    classSubjects.value = [];
  } finally {
    loadingClassSubjects.value = false;
  }
};

// Subject operations
const createSubject = async (subjectData) => {
  subjectLoading.value = true;
  try {
    const response = await accapi.post('/subjects/', subjectData);
    subjects.value.push(response.data);
    toast.success('Subject created successfully');
    closeSubjectModal();
  } catch (error) {
    console.error('Error creating subject:', error);
    toast.error('Failed to create subject');
  } finally {
    subjectLoading.value = false;
  }
};

const updateSubject = async (subjectData) => {
  subjectLoading.value = true;
  try {
    const response = await accapi.put(`/subjects/${subjectData.id}/`, subjectData);
    const index = subjects.value.findIndex(s => s.id === subjectData.id);
    if (index !== -1) {
      subjects.value[index] = response.data;
    }
    toast.success('Subject updated successfully');
    closeSubjectModal();
  } catch (error) {
    console.error('Error updating subject:', error);
    toast.error('Failed to update subject');
  } finally {
    subjectLoading.value = false;
  }
};

const deleteSubject = async () => {
  subjectLoading.value = true;
  try {
    await accapi.delete(`/subjects/${subjectToDelete.value.id}/`);
    subjects.value = subjects.value.filter(s => s.id !== subjectToDelete.value.id);
    toast.success('Subject deleted successfully');
    showDeleteSubjectModal.value = false;
  } catch (error) {
    console.error('Error deleting subject:', error);
    toast.error('Failed to delete subject');
  } finally {
    subjectLoading.value = false;
  }
};

// Class Subject operations
const assignSubjectToClass = async (assignmentData) => {
  assignmentLoading.value = true;
  try {
    const response = await accapi.post('/class_subjects/', assignmentData);
    classSubjects.value.push({
      ...response.data,
      subject_name: subjects.value.find(s => s.id === assignmentData.subject_id)?.name || 'Unknown',
      subject_code: subjects.value.find(s => s.id === assignmentData.subject_id)?.code || 'N/A'
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

const updateClassSubject = async (classSubjectData) => {
  assignmentLoading.value = true;
  try {
    const response = await accapi.put(`/class_subjects/${classSubjectData.id}/`, classSubjectData);
    const index = classSubjects.value.findIndex(cs => cs.id === classSubjectData.id);
    if (index !== -1) {
      classSubjects.value[index] = {
        ...response.data,
        subject_name: classSubjects.value[index].subject_name,
        subject_code: classSubjects.value[index].subject_code
      };
    }
    toast.success('Subject assignment updated successfully');
    closeEditClassSubjectModal();
  } catch (error) {
    console.error('Error updating class subject:', error);
    toast.error('Failed to update subject assignment');
  } finally {
    assignmentLoading.value = false;
  }
};

const deleteClassSubject = async () => {
  assignmentLoading.value = true;
  try {
    await accapi.delete(`/class_subjects/${classSubjectToDelete.value.id}/`);
    classSubjects.value = classSubjects.value.filter(cs => cs.id !== classSubjectToDelete.value.id);
    toast.success('Subject assignment removed successfully');
    showDeleteClassSubjectModal.value = false;
  } catch (error) {
    console.error('Error deleting class subject:', error);
    toast.error('Failed to remove subject assignment');
  } finally {
    assignmentLoading.value = false;
  }
};

// Modal handlers
const editSubject = (subject) => {
  currentSubject.value = { ...subject };
  showEditSubjectModal.value = true;
};

const editClassSubject = (classSubject) => {
  currentClassSubject.value = { ...classSubject };
  showEditClassSubjectModal.value = true;
};

const confirmDeleteSubject = (subject) => {
  subjectToDelete.value = subject;
  showDeleteSubjectModal.value = true;
};

const confirmDeleteClassSubject = (classSubject) => {
  classSubjectToDelete.value = classSubject;
  showDeleteClassSubjectModal.value = true;
};

const closeSubjectModal = () => {
  showCreateSubjectModal.value = false;
  showEditSubjectModal.value = false;
  currentSubject.value = null;
};

const closeAssignSubjectModal = () => {
  showAssignSubjectModal.value = false;
};

const closeEditClassSubjectModal = () => {
  showEditClassSubjectModal.value = false;
  currentClassSubject.value = null;
};

const cancelDeleteSubject = () => {
  showDeleteSubjectModal.value = false;
  subjectToDelete.value = null;
};

const cancelDeleteClassSubject = () => {
  showDeleteClassSubjectModal.value = false;
  classSubjectToDelete.value = null;
};

const handleSubjectSubmit = (subjectData) => {
  if (showEditSubjectModal.value) {
    updateSubject(subjectData);
  } else {
    createSubject(subjectData);
  }
};

const handleSubjectAssignment = (assignmentData) => {
  assignSubjectToClass(assignmentData);
};

const handleClassSubjectUpdate = (classSubjectData) => {
  updateClassSubject(classSubjectData);
};

// Watch for selected class changes
watch(selectedClassId, () => {
  fetchClassSubjects();
});

onMounted(() => {
  fetchSubjects();
  fetchClasses();
});
</script>

<style scoped>
/* Hide scrollbar for horizontal scroll on tabs */
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}

.scrollbar-hide::-webkit-scrollbar {
  display: none;
}

/* Smooth transitions */
.transition-colors {
  transition-property: color, background-color, border-color;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 200ms;
}

/* Ensure proper touch targets on mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px;
  }
  
  /* Improve button spacing in cards */
  .space-x-2 > * + * {
    margin-left: 0.5rem;
  }
}

/* Enhanced table responsiveness */
@media (max-width: 1024px) {
  table {
    font-size: 0.875rem;
  }
  
  th, td {
    padding: 0.75rem 1rem;
  }
}

/* Card hover effects */
.bg-gray-50:hover {
  background-color: #f8fafc;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}

/* Active tab enhanced styling */
.border-blue-500.bg-blue-50 {
  position: relative;
}

.border-blue-500.bg-blue-50::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #3b82f6;
}

/* Loading spinner animation */
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.animate-spin {
  animation: spin 1s linear infinite;
}

/* Improve focus states for accessibility */
button:focus,
select:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Responsive text scaling */
@media (max-width: 640px) {
  .text-lg { font-size: 1rem; }
  .text-xl { font-size: 1.125rem; }
  .text-2xl { font-size: 1.25rem; }
}

/* Card animation transitions */
.bg-gray-50 {
  transition: all 0.2s ease-in-out;
}

/* Improve button group spacing on mobile */
@media (max-width: 640px) {
  .flex.space-x-2 {
    gap: 0.5rem;
  }
  
  .flex.space-x-1 {
    gap: 0.25rem;
  }
}

</style>