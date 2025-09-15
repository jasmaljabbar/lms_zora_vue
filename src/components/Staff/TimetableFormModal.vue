<!-- src/components/TimetableFormModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-800">
          {{ isEditing ? 'Edit Schedule' : 'Add New Schedule' }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Modal Body -->
      <div class="py-4 max-h-96 overflow-y-auto">
        <form @submit.prevent="handleSubmit" class="space-y-4">
          <!-- Academic Session -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Academic Session *</label>
            <select v-model="form.academic_session_id" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">Select Academic Session</option>
              <option v-for="session in academicSessions" :key="session.id" :value="session.id">
                {{ session.name }}
              </option>
            </select>
          </div>

          <!-- Day -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Day *</label>
            <select v-model="form.day" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">Select Day</option>
              <option v-for="day in daysOfWeek" :key="day" :value="day">
                {{ formatDayName(day) }}
              </option>
            </select>
          </div>

          <!-- Period -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Period *</label>
            <select v-model="form.period_id" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">Select Period</option>
              <option v-for="period in periods" :key="period.id" :value="period.id">
                {{ period.name }} ({{ formatTime(period.start_time) }} - {{ formatTime(period.end_time) }})
              </option>
            </select>
          </div>

          <!-- Class -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
            <select v-model="form.class_id" @change="fetchSectionsAndSubjects" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">Select Class</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>

          <!-- Section -->
          <div v-if="form.class_id">
            <label class="block text-sm font-medium text-gray-700 mb-1">Section *</label>
            <select v-model="form.section_id" @change="fetchTeachersForSubject" :disabled="loadingSections" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">{{ loadingSections ? 'Loading sections...' : 'Select Section' }}</option>
              <option v-for="section in sections" :key="section.id" :value="section.id">
                {{ section.name }}
              </option>
            </select>
            <p v-if="sections.length === 0 && !loadingSections && form.class_id" class="text-sm text-red-500 mt-1">
              No sections available for this class.
            </p>
          </div>

          <!-- Subject -->
          <div v-if="form.class_id">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
            <select v-model="selectedSubjectId" @change="fetchClassSubjectAndTeachers" :disabled="loadingSubjects" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">{{ loadingSubjects ? 'Loading subjects...' : 'Select Subject' }}</option>
              <option v-for="subject in subjects" :key="subject.id" :value="subject.id">
                {{ subject.name }}
              </option>
            </select>
            <p v-if="subjects.length === 0 && !loadingSubjects && form.class_id" class="text-sm text-red-500 mt-1">
              No subjects associated with this class.
            </p>
          </div>

          <!-- Teacher -->
          <div v-if="form.class_id && form.section_id && selectedSubjectId">
            <label class="block text-sm font-medium text-gray-700 mb-1">Teacher *</label>
            <select v-model="form.teacher_id" :disabled="loadingTeachers" required 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">{{ loadingTeachers ? 'Loading teachers...' : 'Select Teacher' }}</option>
              <option v-for="teacher in teachers" :key="teacher.teacher_id" :value="teacher.teacher_id">
                {{ teacherProfiles[teacher.teacher_id] || `Teacher ID: ${teacher.teacher_id}` }}
              </option>
            </select>
            <p v-if="teachers.length === 0 && !loadingTeachers && form.class_id && form.section_id && selectedSubjectId" class="text-sm text-red-500 mt-1">
              No teachers assigned for this class, section, and subject combination.
            </p>
          </div>
          
          <!-- Room Number -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Room Number</label>
            <input v-model="form.room_number" type="text" 
                   class="w-full px-3 py-2 border rounded-md text-sm" 
                   placeholder="e.g., A101">
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-4 border-t mt-4">
        <button @click="$emit('close')" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors mr-2">
          Cancel
        </button>
        <button @click="handleSubmit" 
                class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                :disabled="isSaving || !isFormValid">
          {{ isSaving ? 'Saving...' : 'Save Schedule' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, watch, defineProps, defineEmits } from 'vue';
import { accapi,api } from '@/api/axios';
import { toast } from 'vue3-toastify';

const props = defineProps({
  show: Boolean,
  schedule: {
    type: Object,
    default: null
  },
  classes: Array,
  periods: Array,
  academicSessions: Array,
  daysOfWeek: Array,
});

const emit = defineEmits(['save', 'close']);

const isSaving = ref(false);
const loadingSections = ref(false);
const loadingSubjects = ref(false);
const loadingTeachers = ref(false);

const sections = ref([]);
const subjects = ref([]);
const teachers = ref([]);
const selectedSubjectId = ref(null);
const teacherProfiles = ref({});


const form = reactive({
  id: null,
  class_id: '',
  section_id: '',
  classSubject_id: '',
  period_id: '',
  day: '',
  room_number: '',
  academic_session_id: '',
  teacher_id: '',
  created_by: null
});

const isEditing = computed(() => !!form.id);
const isFormValid = computed(() => {
  return form.academic_session_id &&
         form.day &&
         form.period_id &&
         form.class_id &&
         form.section_id &&
         selectedSubjectId.value &&
         form.classSubject_id &&
         form.teacher_id;
});

const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5);
};

const formatDayName = (day) => {
  return day.charAt(0) + day.slice(1).toLowerCase();
};

const resetForm = () => {
  form.id = null;
  form.class_id = '';
  form.section_id = '';
  form.classSubject_id = '';
  form.period_id = '';
  form.day = '';
  form.room_number = '';
  form.academic_session_id = '';
  form.teacher_id = '';
  form.created_by = null;
  selectedSubjectId.value = null;
  sections.value = [];
  subjects.value = [];
  teachers.value = [];
};

// Fetch sections and subjects for the selected class
const fetchSectionsAndSubjects = async () => {
  const classId = form.class_id;
  if (!classId) {
    sections.value = [];
    subjects.value = [];
    return;
  }

  loadingSections.value = true;
  loadingSubjects.value = true;
  
  try {
    // Fetch sections for the class
    const sectionsResponse = await accapi.get(`/classes/${classId}/sections/`);
    sections.value = sectionsResponse.data;

    // Fetch subjects for the class
    const subjectsResponse = await accapi.get(`/classes/${classId}/subjects/`);
    subjects.value = subjectsResponse.data;
  } catch (error) {
    console.error('Error fetching sections or subjects:', error);
    toast.error('Failed to load class data');
  } finally {
    loadingSections.value = false;
    loadingSubjects.value = false;
  }
};
// Fetch teacher profile by ID
const fetchTeacherProfile = async (teacherId) => {
  if (!teacherId || teacherProfiles.value[teacherId]) return; // already cached
  try {
    const { data } = await api.get(`/teacher_profiles/${teacherId}/`);
    teacherProfiles.value[teacherId] = `${data.first_name} ${data.last_name}`;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    teacherProfiles.value[teacherId] = 'N/A';
  }
};

// Fetch class_subject ID and teachers for the selected class, section, and subject
const fetchClassSubjectAndTeachers = async () => {
  if (!form.class_id || !form.section_id || !selectedSubjectId.value) {
    teachers.value = [];
    form.classSubject_id = '';
    return;
  }

  loadingTeachers.value = true;
  
  try {
    // First, get the class_subject ID
    const classSubjectResponse = await accapi.get(
      `/class_subjects/${form.class_id}/${selectedSubjectId.value}`
    );
    
    if (classSubjectResponse.data && classSubjectResponse.data.id) {
      form.classSubject_id = classSubjectResponse.data.id;
      
      // Then, fetch teachers for this class, section, and subject
      const teachersResponse = await accapi.get('/teacher-assignments/filter/by-class-subject', {
        params: {
          class_id: form.class_id,
          section_id: form.section_id,
          subject_id: selectedSubjectId.value
        }
      });
      
      teachers.value = teachersResponse.data;

      // fetch names for each teacher in parallel
      for (const t of teachers.value) {
        if (t.teacher_id) {
          fetchTeacherProfile(t.teacher_id);
        }
      }
    }
  } catch (error) {
    console.error('Error fetching class subject or teachers:', error);
    toast.error('Failed to load teacher data');
  } finally {
    loadingTeachers.value = false;
  }
};

// Handle form submission
const handleSubmit = async () => {
  if (!isFormValid.value) {
    toast.error('Please fill all required fields');
    return;
  }

  isSaving.value = true;
  
  try {
    // Prepare the data for API call
    const scheduleData = {
      class_id: form.class_id,
      section_id: form.section_id,
      classSubject_id: form.classSubject_id,
      period_id: form.period_id,
      day: form.day,
      room_number: form.room_number,
      academic_session_id: form.academic_session_id,
      teacher_id: form.teacher_id
    };

    // Add created_by for new schedules
    if (!isEditing.value) {
      const user = JSON.parse(localStorage.getItem('user'));
      scheduleData.created_by = user?.id;
    }

    emit('save', scheduleData);
    
  } catch (error) {
    console.error('Error saving schedule:', error);
    toast.error('Failed to save schedule');
  } finally {
    isSaving.value = false;
  }
};

// Watch for schedule prop changes (for editing)
watch(() => props.schedule, (newSchedule) => {
  resetForm();
  
  if (newSchedule) {
    form.id = newSchedule.id;
    form.class_id = newSchedule.class_associated?.id || '';
    form.section_id = newSchedule.section_associated?.id || '';
    form.period_id = newSchedule.period?.id || '';
    form.day = newSchedule.day || '';
    form.room_number = newSchedule.room_number || '';
    form.academic_session_id = newSchedule.academic_session?.id || '';
    form.teacher_id = newSchedule.teacher_id || '';
    
    // Set subject ID and classSubject ID
    if (newSchedule.class_subject) {
      selectedSubjectId.value = newSchedule.class_subject.subject_id;
      form.classSubject_id = newSchedule.class_subject.id;
    }

    // Fetch dependent data
    if (form.class_id) {
      fetchSectionsAndSubjects();
    }
  }
}, { immediate: true });

// Watch for class_id changes
watch(() => form.class_id, (newClassId) => {
  if (newClassId) {
    fetchSectionsAndSubjects();
  } else {
    sections.value = [];
    subjects.value = [];
    selectedSubjectId.value = null;
    form.section_id = '';
    form.classSubject_id = '';
    form.teacher_id = '';
  }
});

// Watch for section_id or subject changes
watch([() => form.section_id, selectedSubjectId], () => {
  if (form.section_id && selectedSubjectId.value) {
    fetchClassSubjectAndTeachers();
  } else {
    teachers.value = [];
    form.teacher_id = '';
  }
});
</script>