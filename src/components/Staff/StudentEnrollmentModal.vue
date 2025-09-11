<!-- src/components/StudentEnrollmentModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-1/2 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <h3 class="text-xl font-semibold text-gray-800">
          Manage Enrollments for {{ student.first_name }} {{ student.last_name }}
        </h3>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="py-8 text-center">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p class="text-gray-500">Loading...</p>
      </div>

      <!-- Enrollment List -->
      <div v-else class="py-4">
        <div v-if="enrollments.length === 0" class="text-center py-6">
          <i class="pi pi-book text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">No enrollments found for this student</p>
        </div>

        <div v-else class="space-y-4">
          <div v-for="enrollment in enrollments" :key="enrollment.id" 
               class="border rounded-lg p-4" 
               :class="enrollment.is_active ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">{{ enrollment.class_associated?.name }} - {{ enrollment.section_associated?.name }}</h4>
                <p class="text-sm text-gray-600">{{ enrollment.academic_session?.name }}</p>
                <p class="text-sm text-gray-600">Enrolled on: {{ formatDate(enrollment.enrollment_date) }}</p>
                <span class="inline-block mt-2 px-2 py-1 text-xs rounded-full" 
                      :class="enrollment.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'">
                  {{ enrollment.is_active ? 'Active' : 'Inactive' }}
                </span>
                
                <!-- Warning if trying to add another active enrollment -->
                <div v-if="enrollment.is_active && isEditingEnrollment?.id !== enrollment.id" 
                     class="mt-2 text-xs text-orange-600 bg-orange-50 p-2 rounded">
                  <i class="pi pi-exclamation-triangle mr-1"></i>
                  Only one active enrollment is allowed. Editing this will deactivate others.
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="startEditEnrollment(enrollment)" 
                        class="p-1 text-blue-600 hover:text-blue-800"
                        :disabled="loading">
                  <i class="pi pi-pencil"></i>
                </button>
                <button @click="confirmDeleteEnrollment(enrollment)" 
                        class="p-1 text-red-600 hover:text-red-800"
                        :disabled="loading">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Edit Form for this enrollment -->
            <div v-if="isEditingEnrollment?.id === enrollment.id" class="mt-4 p-3 bg-blue-50 rounded-md">
              <h5 class="font-medium text-blue-800 mb-2">Edit Enrollment</h5>
              <form @submit.prevent="updateEnrollment" class="space-y-3">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
                    <select v-model="isEditingEnrollment.class_id" required class="w-full px-3 py-2 border rounded-md text-sm">
                      <option value="">Select Class</option>
                      <option v-for="cls in availableClasses" :key="cls.id" :value="cls.id">
                        {{ cls.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Section</label>
                    <select v-model="isEditingEnrollment.section_id" required class="w-full px-3 py-2 border rounded-md text-sm">
                      <option value="">Select Section</option>
                      <option v-for="section in availableSections" :key="section.id" :value="section.id">
                        {{ section.name }}
                      </option>
                    </select>
                  </div>
                  <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>
                    <select v-model="isEditingEnrollment.academic_session_id" required class="w-full px-3 py-2 border rounded-md text-sm">
                      <option value="">Select Session</option>
                      <option v-for="session in availableSessions" :key="session.id" :value="session.id">
                        {{ session.name }} ({{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }})
                      </option>
                    </select>
                  </div>
                  <div class="flex items-end">
                    <label class="flex items-center space-x-2">
                      <input type="checkbox" v-model="isEditingEnrollment.is_active" class="rounded">
                      <span class="text-sm text-gray-700">Active Enrollment</span>
                    </label>
                  </div>
                </div>
                <div class="flex justify-end space-x-2">
                  <button type="button" @click="cancelEdit" 
                          class="px-3 py-1 text-sm bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400">
                    Cancel
                  </button>
                  <button type="submit" 
                          class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                          :disabled="loading">
                    Update Enrollment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Add New Enrollment Form -->
      <div v-if="enrollments.length === 0" class="pt-4 border-t mt-4">
        <h4 class="font-medium text-gray-800 mb-3">Add New Enrollment</h4>
        
        <!-- Warning about active enrollment -->
        <div  v-if="hasActiveEnrollment" class="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded-md">
          <p class="text-sm text-yellow-700">
            <i class="pi pi-exclamation-triangle mr-1"></i>
            This student already has an active enrollment. Adding a new active enrollment will deactivate the current one.
          </p>
        </div>
        
        <form @submit.prevent="addNewEnrollment" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Class *</label>
              <select v-model="newEnrollment.class_id" required class="w-full px-3 py-2 border rounded-md"
                      :disabled="loading">
                <option value="">Select Class</option>
                <option v-for="cls in availableClasses" :key="cls.id" :value="cls.id">
                  {{ cls.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Section *</label>
              <select v-model="newEnrollment.section_id" required class="w-full px-3 py-2 border rounded-md"
                      :disabled="loading">
                <option value="">Select Section</option>
                <option v-for="section in availableSections" :key="section.id" :value="section.id">
                  {{ section.name }}
                </option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Academic Session *</label>
              <select v-model="newEnrollment.academic_session_id" required class="w-full px-3 py-2 border rounded-md"
                      :disabled="loading">
                <option value="">Select Session</option>
                <option v-for="session in availableSessions" :key="session.id" :value="session.id">
                  {{ session.name }} ({{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }})
                </option>
              </select>
            </div>
            <div class="flex items-end">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="newEnrollment.is_active" class="rounded"
                       :disabled="loading">
                <span class="text-sm text-gray-700">Active Enrollment</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end pt-2">
            <button type="submit" 
                    class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
                    :disabled="loading">
              Add Enrollment
            </button>
          </div>
        </form>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-4 border-t mt-4">
        <button @click="$emit('close')" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 mr-2 transition-colors"
                :disabled="loading">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, defineProps, defineEmits, watch } from 'vue';
import { api, accapi } from '../../api/axios';
import { toast } from 'vue3-toastify';

const props = defineProps({
  show: Boolean,
  student: Object,
  enrollments: Array,
  loading: Boolean
});

const emit = defineEmits(['close', 'add', 'edit', 'delete']);

const availableClasses = ref([]);
const availableSections = ref([]);
const availableSessions = ref([]);
const isEditingEnrollment = ref(null);

const newEnrollment = ref({
  student_id: props.student?.user_id || null,
  class_id: null,
  section_id: null,
  academic_session_id: null,
  is_active: true
});

// Check if student already has an active enrollment
const hasActiveEnrollment = computed(() => {
  return props.enrollments.some(enrollment => enrollment.is_active);
});

// Watch for student prop changes
watch(() => props.student, (newStudent) => {
  if (newStudent) {
    newEnrollment.value.student_id = newStudent.user_id;
  }
});

// Fetch available classes, sections, and sessions
const fetchOptions = async () => {
  try {
    const [classesResponse, sessionsResponse] = await Promise.all([
      accapi.get('/classes/'),
      accapi.get('/academic-sessions/')
    ]);
    
    availableClasses.value = classesResponse.data;
    availableSessions.value = sessionsResponse.data;
  } catch (error) {
    console.error('Error fetching options:', error);
    toast.error('Failed to load options');
  }
};

const fetchSections = async (classId) => {
  if (!classId) {
    availableSections.value = [];
    return;
  }
  try {
    const response = await accapi.get(`/classes/${classId}/sections/`);
    availableSections.value = response.data;
  } catch (error) {
    console.error('Error fetching sections:', error);
    toast.error('Failed to load sections');
  }
};

watch(() => newEnrollment.value.class_id, (newClassId) => {
  fetchSections(newClassId);
});

// Watch for changes in editing enrollment class
watch(() => isEditingEnrollment.value?.class_id, (newClassId) => {
  if (isEditingEnrollment.value) {
    fetchSections(newClassId);
  }
});

const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString();
};

const startEditEnrollment = (enrollment) => {
  isEditingEnrollment.value = { ...enrollment };
};

const cancelEdit = () => {
  isEditingEnrollment.value = null;
};

const updateEnrollment = () => {
  if (!isEditingEnrollment.value) return;
  
  // If making this enrollment active, we need to deactivate others
  if (isEditingEnrollment.value.is_active) {
    emit('edit', isEditingEnrollment.value.id, isEditingEnrollment.value, true);
  } else {
    emit('edit', isEditingEnrollment.value.id, isEditingEnrollment.value);
  }
  
  isEditingEnrollment.value = null;
};

const addNewEnrollment = () => {
  if (!newEnrollment.value.class_id || !newEnrollment.value.section_id || !newEnrollment.value.academic_session_id) {
    toast.error('Please fill all required fields');
    return;
  }
  
  // If making this enrollment active and there's already an active one, show confirmation
  if (newEnrollment.value.is_active && hasActiveEnrollment.value) {
    if (!confirm('This student already has an active enrollment. Adding a new active enrollment will deactivate the current one. Continue?')) {
      return;
    }
  }
  
  emit('add', { ...newEnrollment.value });
  
  // Reset form
  newEnrollment.value = {
    student_id: props.student?.user_id || null,
    class_id: null,
    section_id: null,
    academic_session_id: null,
    is_active: true
  };
};

const confirmDeleteEnrollment = (enrollment) => {
  if (confirm('Are you sure you want to delete this enrollment?')) {
    emit('delete', enrollment.id);
  }
};

onMounted(() => {
  if (props.show) {
    fetchOptions();
  }
});
</script>