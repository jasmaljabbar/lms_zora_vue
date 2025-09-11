<!-- src/components/AssignTeacherModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div class="relative top-10 mx-auto p-5 border w-11/12 md:w-2/3 lg:w-1/2 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
        <h3 class="text-lg font-medium text-gray-900">Assign Teacher to Subject</h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="mt-4 space-y-4">
        <!-- Class Selection -->
        <div>
          <label for="class" class="block text-sm font-medium text-gray-700">Select Class *</label>
          <select
            id="class"
            v-model="selectedClassId"
            @change="fetchSectionsAndSubjects"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            :disabled="loadingClasses || loading"
          >
            <option value="">Select a class</option>
            <option v-for="classItem in classes" :key="classItem.id" :value="classItem.id">
              {{ classItem.name }}
            </option>
          </select>
          <div v-if="loadingClasses" class="mt-1 text-sm text-gray-500">
            <i class="pi pi-spinner pi-spin mr-1"></i> Loading classes...
          </div>
        </div>

        <!-- Section Selection -->
        <div v-if="selectedClassId">
          <label for="section" class="block text-sm font-medium text-gray-700">Select Section *</label>
          <select
            id="section"
            v-model="selectedSectionId"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            :disabled="loadingSections || loading"
          >
            <option value="">Select a section</option>
            <option v-for="section in sections" :key="section.id" :value="section.id">
              {{ section.name }}
            </option>
          </select>
          <div v-if="loadingSections" class="mt-1 text-sm text-gray-500">
            <i class="pi pi-spinner pi-spin mr-1"></i> Loading sections...
          </div>
        </div>

        <!-- Subject Selection -->
        <div v-if="selectedClassId">
          <label for="subject" class="block text-sm font-medium text-gray-700">Select Subject *</label>
          <select
            id="subject"
            v-model="selectedSubjectId"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            :disabled="loadingSubjects || loading"
          >
            <option value="">Select a subject</option>
            <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
              {{ subject.name }} ({{ subject.code }})
            </option>
          </select>
          <div v-if="loadingSubjects" class="mt-1 text-sm text-gray-500">
            <i class="pi pi-spinner pi-spin mr-1"></i> Loading subjects...
          </div>
        </div>

        <!-- Academic Session Selection -->
        <div>
          <label for="academic_session" class="block text-sm font-medium text-gray-700">Academic Session *</label>
          <select
            id="academic_session"
            v-model="selectedAcademicSessionId"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            :disabled="loadingAcademicSessions || loading"
          >
            <option value="">Select academic session</option>
            <option v-for="session in academicSessions" :key="session.id" :value="session.id">
              {{ session.name }} ({{ session.start_date }} to {{ session.end_date }})
            </option>
          </select>
          <div v-if="loadingAcademicSessions" class="mt-1 text-sm text-gray-500">
            <i class="pi pi-spinner pi-spin mr-1"></i> Loading academic sessions...
          </div>
        </div>

        <!-- Active Status -->
        <div class="flex items-center">
          <input
            id="is_active"
            v-model="isActive"
            type="checkbox"
            class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            :disabled="loading"
          />
          <label for="is_active" class="ml-2 block text-sm text-gray-700">Active Assignment</label>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-3 pt-4 border-t border-gray-200 sticky bottom-0 bg-white z-10">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-sm text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            :disabled="loading"
          >
            Cancel
          </button>
          <button
            type="submit"
            :disabled="loading || !isFormValid"
            class="px-4 py-2 text-sm text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="loading">
              <i class="pi pi-spinner pi-spin mr-1"></i> Assigning...
            </span>
            <span v-else>Assign Teacher</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import {api,accapi} from '../../api/axios';
import { toast } from 'vue3-toastify';

const props = defineProps({
  show: Boolean,
  teacherId: Number,
  loading: Boolean
});

const emit = defineEmits(['close', 'submit']);

// Data
const classes = ref([]);
const sections = ref([]);
const subjects = ref([]);
const academicSessions = ref([]);
const selectedClassId = ref('');
const selectedSectionId = ref('');
const selectedSubjectId = ref('');
const selectedAcademicSessionId = ref('');
const isActive = ref(true);

// Loading states
const loadingClasses = ref(false);
const loadingSections = ref(false);
const loadingSubjects = ref(false);
const loadingAcademicSessions = ref(false);

// Computed properties
const isFormValid = computed(() => {
  return selectedClassId.value && 
         selectedSectionId.value && 
         selectedSubjectId.value && 
         selectedAcademicSessionId.value;
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

const fetchSections = async (classId) => {
  if (!classId) {
    sections.value = [];
    return;
  }
  
  loadingSections.value = true;
  try {
    const response = await accapi.get(`/classes/${classId}/sections/`);
    sections.value = response.data;
    // Reset section selection
    selectedSectionId.value = '';
  } catch (error) {
    console.error('Error fetching sections:', error);
    toast.error('Failed to load sections for this class');
    sections.value = [];
  } finally {
    loadingSections.value = false;
  }
};

const fetchSubjects = async (classId) => {
  if (!classId) {
    subjects.value = [];
    return;
  }
  
  loadingSubjects.value = true;
  try {
    // Assuming you have an endpoint to get subjects by class
    // If not, you might need to adjust this
    const response = await accapi.get(`/classes/${classId}/subjects`);
    subjects.value = response.data;
    // Reset subject selection
    selectedSubjectId.value = '';
  } catch (error) {
    console.error('Error fetching subjects:', error);
    toast.error('Failed to load subjects for this class');
    subjects.value = [];
  } finally {
    loadingSubjects.value = false;
  }
};

const fetchAcademicSessions = async () => {
  loadingAcademicSessions.value = true;
  try {
    const response = await accapi.get('/academic-sessions/');
    academicSessions.value = response.data;
    // Set default to current academic session if available
    const currentSession = academicSessions.value.find(session => session.is_current);
    if (currentSession) {
      selectedAcademicSessionId.value = currentSession.id;
    }
  } catch (error) {
    console.error('Error fetching academic sessions:', error);
    toast.error('Failed to load academic sessions');
  } finally {
    loadingAcademicSessions.value = false;
  }
};

const fetchSectionsAndSubjects = () => {
  if (selectedClassId.value) {
    fetchSections(selectedClassId.value);
    fetchSubjects(selectedClassId.value);
  } else {
    sections.value = [];
    subjects.value = [];
    selectedSectionId.value = '';
    selectedSubjectId.value = '';
  }
};

const handleSubmit = () => {
  if (!isFormValid.value) return;

  emit('submit', {
    teacher_id: props.teacherId,
    class_id: selectedClassId.value,
    section_id: selectedSectionId.value,
    subject_id: selectedSubjectId.value,
    academic_session_id: selectedAcademicSessionId.value,
    is_active: isActive.value
  });
};

const resetForm = () => {
  selectedClassId.value = '';
  selectedSectionId.value = '';
  selectedSubjectId.value = '';
  selectedAcademicSessionId.value = '';
  isActive.value = true;
  sections.value = [];
  subjects.value = [];
};

// Watch for modal show/hide
watch(() => props.show, (newVal) => {
  if (newVal) {
    resetForm();
    if (classes.value.length === 0) {
      fetchClasses();
    }
    if (academicSessions.value.length === 0) {
      fetchAcademicSessions();
    }
  }
});

onMounted(() => {
  fetchClasses();
  fetchAcademicSessions();
});
</script>