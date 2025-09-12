<!-- src/components/LessonsModal.vue -->
<template>
  <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
    <div class="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-2/3 xl:w-3/4 shadow-lg rounded-md bg-white">
      <!-- Modal Header -->
      <div class="flex justify-between items-center pb-3 border-b">
        <div>
          <h3 class="text-xl font-semibold text-gray-800">
            {{ assignment.subject_associated.name }}
          </h3>
          <p class="text-sm text-gray-600">
            Class: {{ assignment.class_associated.name }} - Section: {{ assignment.section_associated.name }}
          </p>
        </div>
        <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600">
          <i class="pi pi-times text-xl"></i>
        </button>
      </div>

      <!-- Storage Status -->
      <div class="bg-blue-50 p-4 mt-4 rounded-md border border-blue-200">
        <div class="flex justify-between items-center mb-2">
          <span class="text-sm font-medium text-blue-800">Storage</span>
          <span class="text-sm font-semibold text-blue-600">
            {{ storageStatus.used_storage_mb }} MB used of {{ storageStatus.storage_limit_mb }} MB
          </span>
        </div>
        <div class="w-full bg-blue-200 rounded-full h-2.5 mb-2">
          <div class="bg-blue-600 h-2.5 rounded-full" 
               :style="{ width: storageStatus.usage_percentage + '%' }"></div>
        </div>
        <div class="flex justify-between text-xs text-blue-600">
          <span>{{ storageStatus.usage_percentage }}% used</span>
          <span>{{ storageStatus.remaining_storage_mb }} MB remaining</span>
        </div>
      </div>

      <!-- Lessons Header -->
      <div class="flex justify-between items-center mt-6 mb-4">
        <h4 class="text-lg font-medium text-gray-800">Lessons</h4>
        <button @click="showAddLessonForm = true" 
                class="px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm flex items-center"
                :disabled="editingLesson !== null">
          <i class="pi pi-plus mr-1"></i> Add Lesson
        </button>
      </div>

      <!-- Add Lesson Form -->
      <div v-if="showAddLessonForm" class="mb-6 p-4 bg-gray-50 rounded-md border border-gray-200">
        <h5 class="text-md font-medium text-gray-800 mb-3">Add New Lesson</h5>
        <form @submit.prevent="addNewLesson" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="newLesson.title" required 
                     class="w-full px-3 py-2 border rounded-md text-sm" 
                     placeholder="Lesson title">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lesson Number *</label>
              <input v-model="newLesson.lesson_number" type="number" required 
                     class="w-full px-3 py-2 border rounded-md text-sm" 
                     placeholder="Lesson number">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="newLesson.description" 
                        class="w-full px-3 py-2 border rounded-md text-sm" 
                        rows="2" placeholder="Lesson description"></textarea>
            </div>
            <div class="flex items-center">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="newLesson.is_published" class="rounded">
                <span class="text-sm text-gray-700">Publish immediately</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showAddLessonForm = false" 
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm">
              Cancel
            </button>
            <button type="submit" 
                    class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    :disabled="addingLesson">
              {{ addingLesson ? 'Adding...' : 'Add Lesson' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Edit Lesson Form -->
      <div v-if="editingLesson" class="mb-6 p-4 bg-blue-50 rounded-md border border-blue-200">
        <h5 class="text-md font-medium text-blue-800 mb-3">Edit Lesson</h5>
        <form @submit.prevent="updateLesson" class="space-y-3">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input v-model="editLessonForm.title" required 
                     class="w-full px-3 py-2 border rounded-md text-sm" 
                     placeholder="Lesson title">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Lesson Number *</label>
              <input v-model="editLessonForm.lesson_number" type="number" required 
                     class="w-full px-3 py-2 border rounded-md text-sm" 
                     placeholder="Lesson number">
            </div>
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea v-model="editLessonForm.description" 
                        class="w-full px-3 py-2 border rounded-md text-sm" 
                        rows="2" placeholder="Lesson description"></textarea>
            </div>
            <div class="flex items-center space-x-4">
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="editLessonForm.is_published" class="rounded">
                <span class="text-sm text-gray-700">Published</span>
              </label>
              <label class="flex items-center space-x-2">
                <input type="checkbox" v-model="editLessonForm.is_completed" class="rounded">
                <span class="text-sm text-gray-700">Completed</span>
              </label>
            </div>
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="cancelEdit" 
                    class="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm">
              Cancel
            </button>
            <button type="submit" 
                    class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    :disabled="updatingLesson">
              {{ updatingLesson ? 'Updating...' : 'Update Lesson' }}
            </button>
          </div>
        </form>
      </div>

      <!-- Lessons List -->
      <div class="py-4 max-h-96 overflow-y-auto">
        <div v-if="localLessons.length === 0 && !showAddLessonForm && !editingLesson" class="text-center py-6">
          <i class="pi pi-book-open text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500">No lessons available for this subject</p>
          <button @click="showAddLessonForm = true" 
                  class="mt-2 px-3 py-1 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
            Add Your First Lesson
          </button>
        </div>

        <div v-else class="space-y-3">
          <div v-for="lesson in sortedLessons" :key="lesson.id" 
               class="border rounded-lg p-4" 
               :class="{
                 'bg-green-50 border-green-200': lesson.is_completed,
                 'bg-gray-50 border-gray-200': !lesson.is_completed,
                 'hidden': editingLesson && editingLesson.id === lesson.id // Hide lesson being edited
               }">
            <div class="flex justify-between items-start">
              <div class="flex-1">
                <h4 class="font-medium text-gray-800">
                  Lesson {{ lesson.lesson_number }}: {{ lesson.title }}
                </h4>
                <p class="text-sm text-gray-600 mt-1">{{ lesson.description }}</p>
                <div class="flex items-center mt-2 space-x-2">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    lesson.is_completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  ]">
                    {{ lesson.is_completed ? 'Completed' : 'In Progress' }}
                  </span>
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    lesson.is_published ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ lesson.is_published ? 'Published' : 'Draft' }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2">
                <button @click="startEditLesson(lesson)" 
                        class="p-1 text-blue-600 hover:text-blue-800"
                        title="Edit Lesson"
                        :disabled="addingContentTo === lesson.id || editingLesson !== null">
                  <i class="pi pi-pencil"></i>
                </button>
                <button @click="confirmDeleteLesson(lesson)" 
                        class="p-1 text-red-600 hover:text-red-800"
                        title="Delete Lesson"
                        :disabled="addingContentTo === lesson.id || editingLesson !== null">
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Lesson Contents -->
            <div v-if="lesson.contents && lesson.contents.length > 0" class="mt-3">
              <p class="text-xs font-medium text-gray-700 mb-2">Contents:</p>
              <div class="space-y-2">
                <div v-for="(content, index) in lesson.contents" :key="index" 
                     class="flex justify-between items-center p-2 bg-white rounded border">
                  <div class="flex-1">
                    <p class="text-sm font-medium text-gray-800">{{ content.title }}</p>
                    <p class="text-xs text-gray-600">
                      {{ formatContentType(content.content_type) }} • 
                      {{ content.file_size ? formatFileSize(content.file_size) : 'No file' }} • 
                      Uploaded {{ formatDate(content.created_at) }}
                    </p>
                  </div>
                  <div class="flex space-x-1">
                    <button @click="editContent(content, lesson)" 
                            class="p-1 text-blue-600 hover:text-blue-800"
                            title="Edit Content"
                            :disabled="editingLesson !== null">
                      <i class="pi pi-pencil text-xs"></i>
                    </button>
                    <button @click="confirmDeleteContent(content, lesson)" 
                            class="p-1 text-red-600 hover:text-red-800"
                            title="Delete Content"
                            :disabled="editingLesson !== null">
                      <i class="pi pi-trash text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Add Content Button -->
            <div class="mt-3">
              <button @click="showAddContentForm(lesson)" 
                      class="px-2 py-1 text-xs bg-gray-600 text-white rounded hover:bg-gray-700 flex items-center"
                      :disabled="editingLesson !== null">
                <i class="pi pi-plus mr-1 text-xs"></i> Add Content
              </button>
            </div>

            <!-- Add Content Form -->
            <div v-if="addingContentTo === lesson.id" class="mt-3 p-3 bg-blue-50 rounded-md">
              <h6 class="text-sm font-medium text-blue-800 mb-2">Add Content to Lesson {{ lesson.lesson_number }}</h6>
              <AddContentForm 
                :lesson="lesson"
                :storage-status="storageStatus"
                @content-added="handleContentAdded"
                @cancel="addingContentTo = null"
              />
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer -->
      <div class="flex justify-end pt-4 border-t mt-4">
        <button @click="$emit('close')" 
                class="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition-colors">
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, defineEmits } from 'vue';
import { accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';
import AddContentForm from './AddContentForm.vue';

const props = defineProps({
  show: Boolean,
  assignment: Object,
  lessons: Array
});

const emit = defineEmits(['close', 'refresh']);

// Convert lessons prop to reactive state
const localLessons = ref([]);

const storageStatus = ref({
  used_storage_mb: 0,
  storage_limit_mb: 5120,
  remaining_storage_mb: 5120,
  usage_percentage: 0
});

const showAddLessonForm = ref(false);
const addingLesson = ref(false);
const updatingLesson = ref(false);
const addingContentTo = ref(null);
const classSubjectId = ref(null);

// Edit lesson state
const editingLesson = ref(null); // Holds the lesson object being edited
const editLessonForm = ref({
  title: '',
  description: '',
  class_subject_id: null,
  section_id: null,
  lesson_number: 1,
  is_published: false,
  is_completed: false,
  created_by: null
});

const newLesson = ref({
  title: '',
  description: '',
  class_subject_id: null,
  section_id: null,
  lesson_number: 1,
  is_published: false,
  created_by: null
});

// Watch for changes in props.lessons and update local state
watch(() => props.lessons, (newLessons) => {
  if (newLessons) {
    localLessons.value = [...newLessons];
  }
}, { immediate: true, deep: true });

// Sort lessons by lesson number using local state
const sortedLessons = computed(() => {
  return [...localLessons.value].sort((a, b) => a.lesson_number - b.lesson_number);
});

// Format content type for display
const formatContentType = (type) => {
  const types = {
    'TEXT': 'Text',
    'PDF': 'PDF Document',
    'VIDEO': 'Video',
    'AUDIO': 'Audio',
    'IMAGE': 'Image',
    'DOCUMENT': 'Document'
  };
  return types[type] || type;
};

// Format file size for display
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    return new Date(dateString).toLocaleDateString();
  } catch (error) {
    return dateString;
  }
};

// Fetch storage status
const fetchStorageStatus = async () => {
  try {
    // First get class_subject_id
    const classSubjectResponse = await accapi.get(
      `/class_subjects/${props.assignment.class_id}/${props.assignment.subject_id}`
    );
    
    if (classSubjectResponse.data && classSubjectResponse.data.id) {
      classSubjectId.value = classSubjectResponse.data.id;
      
      // Then get storage status
      const storageResponse = await accapi.get(`/status/${classSubjectId.value}`);
      storageStatus.value = storageResponse.data;
    }
  } catch (error) {
    console.error('Error fetching storage status:', error);
    toast.error('Failed to load storage information');
  }
};

// Start editing a lesson
const startEditLesson = (lesson) => {
  editingLesson.value = lesson;
  showAddLessonForm.value = false; // Close add form if open
  addingContentTo.value = null; // Close add content form if open
  editLessonForm.value = {
    title: lesson.title,
    description: lesson.description || '',
    class_subject_id: lesson.class_subject_id,
    section_id: lesson.section_id,
    lesson_number: lesson.lesson_number,
    is_published: lesson.is_published,
    is_completed: lesson.is_completed,
    created_by: lesson.created_by
  };
};

// Cancel editing
const cancelEdit = () => {
  editingLesson.value = null;
  editLessonForm.value = {
    title: '',
    description: '',
    class_subject_id: null,
    section_id: null,
    lesson_number: 1,
    is_published: false,
    is_completed: false,
    created_by: null
  };
};

// Update lesson
const updateLesson = async () => {
  if (!editLessonForm.value.title || !editLessonForm.value.lesson_number) {
    toast.error('Please fill all required fields');
    return;
  }

  updatingLesson.value = true;
  try {
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    editLessonForm.value.created_by = user?.id; // Ensure created_by is always set on update

    const response = await accapi.put(`/lessons/${editingLesson.value.id}`, editLessonForm.value);
    
    // Find the index of the updated lesson in the localLessons array
    const index = localLessons.value.findIndex(lesson => lesson.id === editingLesson.value.id);
    if (index !== -1) {
      // Update the lesson in the localLessons array with the response data
      localLessons.value[index] = { ...localLessons.value[index], ...response.data };
    }
    
    toast.success('Lesson updated successfully!');
    cancelEdit(); // Close the edit form and reset state
    emit('refresh'); // Notify parent component to refresh data if needed
  } catch (error) {
    console.error('Error updating lesson:', error);
    toast.error('Failed to update lesson');
  } finally {
    updatingLesson.value = false;
  }
};

// Add new lesson
const addNewLesson = async () => {
  if (!newLesson.value.title || !newLesson.value.lesson_number) {
    toast.error('Please fill all required fields');
    return;
  }

  addingLesson.value = true;
  try {
    newLesson.value.class_subject_id = classSubjectId.value;
    newLesson.value.section_id = props.assignment.section_id;
    
    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    newLesson.value.created_by = user?.id;

    const response = await accapi.post('/lessons/', newLesson.value);
    
    // Add the new lesson to local state
    const createdLesson = response.data;
    localLessons.value.push(createdLesson);
    
    toast.success('Lesson added successfully!');
    showAddLessonForm.value = false;
    resetNewLessonForm();
    
    // Still emit refresh in case parent needs to do additional updates
    emit('refresh');
  } catch (error) {
    console.error('Error adding lesson:', error);
    toast.error('Failed to add lesson');
  } finally {
    addingLesson.value = false;
  }
};

// Reset new lesson form
const resetNewLessonForm = () => {
  newLesson.value = {
    title: '',
    description: '',
    class_subject_id: null,
    section_id: null,
    lesson_number: localLessons.value.length + 1, // Use local lessons for count
    is_published: false,
    created_by: null
  };
};

// Delete lesson
const confirmDeleteLesson = (lesson) => {
  if (confirm(`Are you sure you want to delete "${lesson.title}"?`)) {
    deleteLesson(lesson.id);
  }
};

const deleteLesson = async (lessonId) => {
  try {
    await accapi.delete(`/lessons/${lessonId}`);
    
    // Remove lesson from local state
    localLessons.value = localLessons.value.filter(lesson => lesson.id !== lessonId);
    
    toast.success('Lesson deleted successfully!');
    emit('refresh');
  } catch (error) {
    console.error('Error deleting lesson:', error);
    toast.error('Failed to delete lesson');
  }
};

// Show add content form
const showAddContentForm = (lesson) => {
  if (editingLesson.value) return; // Prevent adding content while editing a lesson
  addingContentTo.value = lesson.id;
  showAddLessonForm.value = false; // Close add lesson form if open
};

// Handle content added
const handleContentAdded = (newContent) => {
  // Find the lesson and add the content to it
  const lessonIndex = localLessons.value.findIndex(lesson => lesson.id === addingContentTo.value);
  if (lessonIndex !== -1) {
    // Initialize contents array if it doesn't exist
    if (!localLessons.value[lessonIndex].contents) {
      localLessons.value[lessonIndex].contents = [];
    }
    // Add the new content to the lesson
    localLessons.value[lessonIndex].contents.push(newContent);
  }
  
  addingContentTo.value = null;
  emit('refresh');
  fetchStorageStatus(); // Refresh storage status
};

// Edit content
const editContent = (content, lesson) => {
  // This would typically open a dedicated content editing modal/form.
  // For now, we'll just show a toast.
  toast.info(`Implement edit functionality for content: ${content.title}`);
  // If you had an AddContentForm that could also be used for editing,
  // you might set a state like `editingContent` and pass the content object.
};

// Delete content
const confirmDeleteContent = (content, lesson) => {
  if (confirm(`Are you sure you want to delete "${content.title}"? This cannot be undone.`)) {
    deleteContent(content.id, lesson.id);
  }
};

const deleteContent = async (contentId, lessonId) => {
  try {
    await accapi.delete(`/lesson_contents/${contentId}`);
    
    // Remove content from local state
    const lessonIndex = localLessons.value.findIndex(lesson => lesson.id === lessonId);
    if (lessonIndex !== -1 && localLessons.value[lessonIndex].contents) {
      localLessons.value[lessonIndex].contents = localLessons.value[lessonIndex].contents.filter(
        content => content.id !== contentId
      );
    }
    
    toast.success('Content deleted successfully!');
    emit('refresh');
    fetchStorageStatus(); // Refresh storage status
  } catch (error) {
    console.error('Error deleting content:', error);
    toast.error('Failed to delete content');
  }
};

onMounted(() => {
  if (props.show && props.assignment) {
    fetchStorageStatus();
    resetNewLessonForm();
  }
});

// Watch for modal visibility to reset forms when closed and fetch data when opened
watch(() => props.show, (newVal) => {
  if (newVal) {
    fetchStorageStatus();
    resetNewLessonForm();
  } else {
    // Reset all forms and editing states when modal is closed
    showAddLessonForm.value = false;
    addingLesson.value = false;
    updatingLesson.value = false;
    addingContentTo.value = null;
    editingLesson.value = null;
    cancelEdit(); // Reset editLessonForm
  }
});
</script>