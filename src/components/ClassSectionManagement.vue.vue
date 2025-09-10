<!-- src/components/ClassSectionManagement.vue -->
<template>
  <div class="p-3 sm:p-4 lg:p-6 max-w-full">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
      <div class="min-w-0 flex-1">
        <h2 class="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 truncate">Class & Section Management</h2>
        <p class="text-xs sm:text-sm text-gray-600 mt-1">Manage classes and sections in your institution</p>
      </div>
      <div class="flex-shrink-0 w-full sm:w-auto">
        <button 
          @click="showCreateClassModal = true" 
          class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
        >
          <i class="pi pi-plus mr-2 flex-shrink-0"></i>
          <span class="truncate">Add Class</span>
        </button>
      </div>
    </div>

    <!-- Classes List -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden mb-4 sm:mb-6">
      <div class="p-4 sm:p-6 border-b border-gray-200">
        <h3 class="text-base sm:text-lg font-semibold text-gray-800">Classes</h3>
      </div>

      <!-- Loading State -->
      <div v-if="loadingClasses" class="p-8 sm:p-12 text-center">
        <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-sm sm:text-base text-gray-500">Loading classes...</p>
      </div>

      <!-- Classes Grid -->
      <div v-else class="p-3 sm:p-6">
        <div v-if="classes.length === 0" class="text-center py-8 sm:py-12">
          <i class="pi pi-book text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 mb-2">No classes found</p>
          <p class="text-xs sm:text-sm text-gray-400">Create your first class to get started</p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <div 
            v-for="classItem in classes" 
            :key="classItem.id"
            :class="[
              'border rounded-lg p-3 sm:p-4 cursor-pointer transition-all duration-200',
              selectedClassId === classItem.id 
                ? 'border-blue-500 bg-blue-50 shadow-md' 
                : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
            ]"
            @click="selectClass(classItem)"
          >
            <div class="flex justify-between items-start mb-2 sm:mb-3">
              <h4 class="font-semibold text-sm sm:text-lg text-gray-900 truncate pr-2">{{ classItem.name }}</h4>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full flex-shrink-0',
                classItem.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ classItem.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            
            <p class="text-xs sm:text-sm text-gray-600 mb-3" v-if="classItem.description">
              {{ classItem.description }}
            </p>
            <p v-else class="text-xs sm:text-sm text-gray-400 italic mb-3">No description</p>
            
            <div class="flex justify-between items-center pt-2 border-t border-gray-100">
              <span class="text-xs sm:text-sm text-gray-500">
                {{ classSectionsCount[classItem.id] || 0 }} sections
              </span>
              <div class="flex space-x-1 sm:space-x-2">
                <button
                  @click.stop="editClass(classItem)"
                  class="p-1 sm:p-2 text-blue-600 hover:bg-blue-100 rounded transition-colors duration-200"
                  title="Edit Class"
                >
                  <i class="pi pi-pencil text-sm sm:text-base"></i>
                </button>
                <button
                  @click.stop="confirmDeleteClass(classItem)"
                  class="p-1 sm:p-2 text-red-600 hover:bg-red-100 rounded transition-colors duration-200"
                  title="Delete Class"
                >
                  <i class="pi pi-trash text-sm sm:text-base"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Sections Management (Visible when a class is selected) -->
    <div v-if="selectedClassId" class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-3 sm:space-y-0">
        <div class="min-w-0 flex-1">
          <h3 class="text-base sm:text-lg font-semibold text-gray-800 truncate pr-2">
            Sections for {{ selectedClassName }}
          </h3>
          <p class="text-xs sm:text-sm text-gray-600 mt-1">Manage sections for the selected class</p>
        </div>
        <div class="flex-shrink-0 w-full sm:w-auto">
          <button 
            @click="showCreateSectionModal = true" 
            class="w-full sm:w-auto px-4 sm:px-6 py-2.5 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors duration-200 flex items-center justify-center text-sm sm:text-base"
          >
            <i class="pi pi-plus mr-2 flex-shrink-0"></i>
            <span class="truncate">Add Sections</span>
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loadingSections" class="p-8 sm:p-12 text-center">
        <div class="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-sm sm:text-base text-gray-500">Loading sections...</p>
      </div>

      <!-- Sections Content -->
      <div v-else class="p-3 sm:p-6">
        <div v-if="sections.length === 0" class="text-center py-8 sm:py-12">
          <i class="pi pi-folder-open text-3xl sm:text-4xl text-gray-300 mb-4"></i>
          <p class="text-sm sm:text-base text-gray-500 mb-2">No sections found for this class</p>
          <p class="text-xs sm:text-sm text-gray-400">Add sections to start organizing students</p>
        </div>

        <!-- Mobile Sections Cards View (< sm) -->
        <div v-else class="sm:hidden space-y-4">
          <div
            v-for="section in sections"
            :key="section.id"
            class="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow duration-200"
          >
            <div class="flex justify-between items-start mb-3">
              <h4 class="text-sm font-semibold text-gray-900 truncate">{{ section.name }}</h4>
              <span :class="[
                'px-2 py-1 text-xs font-medium rounded-full flex-shrink-0 ml-2',
                section.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              ]">
                {{ section.is_active ? 'Active' : 'Inactive' }}
              </span>
            </div>
            <div class="text-xs text-gray-600 mb-2">
              <span class="font-medium">Capacity:</span> {{ section.capacity }} students
            </div>
            <div class="text-xs text-gray-600 mb-3">
              <span class="font-medium">Teacher:</span> {{ section.class_teacher_name || 'Not assigned' }}
            </div>
            <div class="flex space-x-2 pt-3 border-t border-gray-200">
              <button
                @click="editSection(section)"
                class="flex-1 px-3 py-2 text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <i class="pi pi-pencil mr-2"></i>
                Edit
              </button>
              <button
                @click="confirmDeleteSection(section)"
                class="flex-1 px-3 py-2 text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-200 flex items-center justify-center text-sm"
              >
                <i class="pi pi-trash mr-2"></i>
                Delete
              </button>
            </div>
          </div>
        </div>

        <!-- Desktop Sections Table View (>= sm) -->
        <div v-if="sections.length > 0" class="hidden sm:block overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Section Name
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacity
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Class Teacher
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-4 lg:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr
                v-for="section in sections"
                :key="section.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ section.name }}</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ section.capacity }} students</div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">
                    {{ section.class_teacher_name || 'Not assigned' }}
                  </div>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 inline-flex text-xs leading-5 font-semibold rounded-full',
                    section.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  ]">
                    {{ section.is_active ? 'Active' : 'Inactive' }}
                  </span>
                </td>
                <td class="px-4 lg:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editSection(section)"
                      class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Edit Section"
                    >
                      <i class="pi pi-pencil mr-1"></i>
                      <span class="hidden md:inline">Edit</span>
                    </button>
                    <button
                      @click="confirmDeleteSection(section)"
                      class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center text-xs sm:text-sm"
                      title="Delete Section"
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

    <!-- Create/Edit Class Modal -->
    <ClassModal
      v-if="showCreateClassModal || showEditClassModal"
      :show="showCreateClassModal || showEditClassModal"
      :class-data="currentClass"
      :is-editing="showEditClassModal"
      :loading="classLoading"
      @close="closeClassModal"
      @submit="handleClassSubmit"
    />

    <!-- Create Sections Modal -->
    <SectionBulkModal
      v-if="showCreateSectionModal"
      :show="showCreateSectionModal"
      :class-id="selectedClassId"
      :loading="sectionLoading"
      @close="closeSectionModal"
      @submit="handleSectionBulkCreate"
    />

    <!-- Edit Section Modal -->
    <SectionModal
      v-if="showEditSectionModal"
      :show="showEditSectionModal"
      :section-data="currentSection"
      :is-editing="true"
      :loading="sectionLoading"
      @close="closeEditSectionModal"
      @submit="handleSectionUpdate"
    />

    <!-- Delete Confirmation Modals -->
    <DeleteConfirmation
      v-if="showDeleteClassModal"
      :show="showDeleteClassModal"
      :item="classToDelete"
      :loading="classLoading"
      item-type="class"
      @confirm="deleteClass"
      @cancel="cancelDeleteClass"
    />

    <DeleteConfirmation
      v-if="showDeleteSectionModal"
      :show="showDeleteSectionModal"
      :item="sectionToDelete"
      :loading="sectionLoading"
      item-type="section"
      @confirm="deleteSection"
      @cancel="cancelDeleteSection"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api, accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';

// Import components
import ClassModal from './ClassModal.vue';
import SectionModal from './SectionModal.vue';
import SectionBulkModal from './SectionBulkModal.vue';
import DeleteConfirmation from './Admin/DeleteConfirmation.vue';

// Data
const classes = ref([]);
const allSections = ref([]); // Store all sections to compute counts
const sections = ref([]); // Sections for the currently selected class
const selectedClassId = ref(null);
const loadingClasses = ref(false);
const loadingSections = ref(false);
const classLoading = ref(false);
const sectionLoading = ref(false);

// Modals
const showCreateClassModal = ref(false);
const showEditClassModal = ref(false);
const showCreateSectionModal = ref(false);
const showEditSectionModal = ref(false);
const showDeleteClassModal = ref(false);
const showDeleteSectionModal = ref(false);

// Current items for editing
const currentClass = ref(null);
const currentSection = ref(null);
const classToDelete = ref(null);
const sectionToDelete = ref(null);

// Computed properties
const selectedClassName = computed(() => {
  const classItem = classes.value.find(c => c.id === selectedClassId.value);
  return classItem ? classItem.name : '';
});

// New computed property to count sections per class
const classSectionsCount = computed(() => {
  return allSections.value.reduce((acc, section) => {
    acc[section.class_id] = (acc[section.class_id] || 0) + 1;
    return acc;
  }, {});
});


// Methods
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

const fetchAllSections = async () => {
  try {
    const response = await accapi.get('/sections/'); // Fetch all sections
    allSections.value = response.data;
  } catch (error) {
    console.error('Error fetching all sections:', error);
    // Not critical to toast here, as individual class sections will show error
  }
}

const fetchSectionsForSelectedClass = async (classId) => {
  if (!classId) {
    sections.value = [];
    return;
  }
  
  loadingSections.value = true;
  try {
    const response = await accapi.get(`/classes/${classId}/sections/`);
    sections.value = response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    toast.error('Failed to load sections for this class');
    sections.value = [];
  } finally {
    loadingSections.value = false;
  }
};

const selectClass = (classItem) => {
  selectedClassId.value = classItem.id;
  fetchSectionsForSelectedClass(classItem.id);
};

// Class operations
const createClass = async (classData) => {
  classLoading.value = true;
  try {
    const response = await accapi.post('/classes/', classData);
    classes.value.push(response.data);
    toast.success('Class created successfully');
    closeClassModal();
  } catch (error) {
    console.error('Error creating class:', error);
    toast.error('Failed to create class');
  } finally {
    classLoading.value = false;
  }
};

const updateClass = async (classData) => {
  classLoading.value = true;
  try {
    const response = await accapi.put(`/classes/${classData.id}/`, classData);
    const index = classes.value.findIndex(c => c.id === classData.id);
    if (index !== -1) {
      classes.value[index] = response.data;
    }
    toast.success('Class updated successfully');
    closeClassModal();
  } catch (error) {
    console.error('Error updating class:', error);
    toast.error('Failed to update class');
  } finally {
    classLoading.value = false;
  }
};

const deleteClass = async () => {
  classLoading.value = true;
  try {
    await accapi.delete(`/classes/${classToDelete.value.id}/`);
    classes.value = classes.value.filter(c => c.id !== classToDelete.value.id);
    if (selectedClassId.value === classToDelete.value.id) {
      selectedClassId.value = null;
      sections.value = [];
    }
    // Also re-fetch all sections to update counts in class cards
    await fetchAllSections();
    toast.success('Class deleted successfully');
    showDeleteClassModal.value = false;
  } catch (error) {
    console.error('Error deleting class:', error);
    toast.error('Failed to delete class');
  } finally {
    classLoading.value = false;
  }
};

// Section operations
const createSectionsBulk = async (sectionData) => {
  sectionLoading.value = true;
  try {
    const response = await accapi.post('/sections/bulk', sectionData);
    sections.value = [...sections.value, ...response.data];
    // After bulk create, update allSections and re-fetch for selected class
    await fetchAllSections();
    await fetchSectionsForSelectedClass(selectedClassId.value);
    toast.success('Sections created successfully');
    closeSectionModal();
  } catch (error) {
    console.error('Error creating sections:', error);
    toast.error('Failed to create sections');
  } finally {
    sectionLoading.value = false;
  }
};

const updateSection = async (sectionData) => {
  sectionLoading.value = true;
  try {
    const response = await accapi.put(`/sections/${sectionData.id}/`, sectionData);
    const index = sections.value.findIndex(s => s.id === sectionData.id);
    if (index !== -1) {
      sections.value[index] = response.data;
    }
    // Update allSections as well
    const allSectionsIndex = allSections.value.findIndex(s => s.id === sectionData.id);
    if (allSectionsIndex !== -1) {
      allSections.value[allSectionsIndex] = response.data;
    }
    toast.success('Section updated successfully');
    closeEditSectionModal();
  } catch (error) {
    console.error('Error updating section:', error);
    toast.error('Failed to update section');
  } finally {
    sectionLoading.value = false;
  }
};

const deleteSection = async () => {
  sectionLoading.value = true;
  try {
    await api.delete(`/sections/${sectionToDelete.value.id}/`);
    sections.value = sections.value.filter(s => s.id !== sectionToDelete.value.id);
    allSections.value = allSections.value.filter(s => s.id !== sectionToDelete.value.id); // Update allSections
    toast.success('Section deleted successfully');
    showDeleteSectionModal.value = false;
  } catch (error) {
    console.error('Error deleting section:', error);
    toast.error('Failed to delete section');
  } finally {
    sectionLoading.value = false;
  }
};

// Modal handlers
const editClass = (classItem) => {
  currentClass.value = { ...classItem };
  showEditClassModal.value = true;
};

const editSection = (section) => {
  currentSection.value = { ...section };
  showEditSectionModal.value = true;
};

const confirmDeleteClass = (classItem) => {
  classToDelete.value = classItem;
  showDeleteClassModal.value = true;
};

const confirmDeleteSection = (section) => {
  sectionToDelete.value = section;
  showDeleteSectionModal.value = true;
};

const closeClassModal = () => {
  showCreateClassModal.value = false;
  showEditClassModal.value = false;
  currentClass.value = null;
};

const closeSectionModal = () => {
  showCreateSectionModal.value = false;
};

const closeEditSectionModal = () => {
  showEditSectionModal.value = false;
  currentSection.value = null;
};

const cancelDeleteClass = () => {
  showDeleteClassModal.value = false;
  classToDelete.value = null;
};

const cancelDeleteSection = () => {
  showDeleteSectionModal.value = false;
  sectionToDelete.value = null;
};

const handleClassSubmit = (classData) => {
  if (showEditClassModal.value) {
    updateClass(classData);
  } else {
    createClass(classData);
  }
};

const handleSectionBulkCreate = (sectionData) => {
  createSectionsBulk(sectionData);
};

const handleSectionUpdate = (sectionData) => {
  updateSection(sectionData);
};

onMounted(() => {
  fetchClasses();
  fetchAllSections(); // Fetch all sections on mount for the count
});
</script>

<style scoped>
/* Custom styles can go here for more granular control or animations */
.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Ensure proper touch targets on mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px; /* WCAG touch target size */
  }
}

/* Improve button group spacing on mobile */
@media (max-width: 640px) {
  .flex.space-x-2 {
    gap: 0.5rem; /* Replaces default margin-left for better flex behavior */
  }
  
  .flex.space-x-1 {
    gap: 0.25rem;
  }
}

/* Add subtle hover/focus effects for accessibility */
button:focus-visible,
.cursor-pointer:focus-visible {
  outline: 2px solid theme('colors.blue.500');
  outline-offset: 2px;
}
</style>