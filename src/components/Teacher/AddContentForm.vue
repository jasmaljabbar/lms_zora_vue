<template>
  <form @submit.prevent="addContent" class="space-y-3">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Content Type *</label>
      <select v-model="newContent.content_type" required 
              class="w-full px-3 py-2 border rounded-md text-sm">
        <option value="">Select Type</option>
        <option value="TEXT">Text</option>
        <option value="PDF">PDF Document</option>
        <option value="VIDEO">Video</option>
        <option value="AUDIO">Audio</option>
        <option value="IMAGE">Image</option>
        <option value="DOCUMENT">Document</option>
      </select>
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Title *</label>
      <input v-model="newContent.title" required 
             class="w-full px-3 py-2 border rounded-md text-sm" 
             placeholder="Content title">
    </div>

    <div v-if="newContent.content_type === 'TEXT'">
      <label class="block text-sm font-medium text-gray-700 mb-1">Content</label>
      <textarea v-model="newContent.content" 
                class="w-full px-3 py-2 border rounded-md text-sm" 
                rows="3" placeholder="Text content"></textarea>
    </div>

    <div v-else>
      <label class="block text-sm font-medium text-gray-700 mb-1">File Upload</label>
      <input type="file" ref="fileInput" @change="handleFileUpload" 
             class="w-full px-3 py-2 border rounded-md text-sm" 
             :accept="getFileAcceptTypes()">
      <p v-if="selectedFile" class="text-xs text-gray-500 mt-1">
        Selected: {{ selectedFile.name }} ({{ formatFileSize(selectedFile.size) }})
      </p>
    </div>

    <div class="flex items-center">
      <label class="flex items-center space-x-2">
        <input type="checkbox" v-model="newContent.is_active" class="rounded">
        <span class="text-sm text-gray-700">Active</span>
      </label>
    </div>

    <div class="flex justify-end space-x-2 pt-2">
      <button type="button" @click="$emit('cancel')" 
              class="px-3 py-1 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 text-sm">
        Cancel
      </button>
      <button type="submit" 
              class="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              :disabled="isSubmitting">
        {{ isSubmitting ? 'Adding...' : 'Add Content' }}
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive, watch } from 'vue';
import { accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';

// Props
const props = defineProps({
  lesson: {
    type: Object,
    required: true
  },
  storageStatus: {
    type: Object,
    default: () => ({})
  }
});

// Emits
const emit = defineEmits(['content-added', 'cancel']);

// Reactive data
const isSubmitting = ref(false);
const selectedFile = ref(null);
const fileInput = ref(null);

const newContent = reactive({
  content_type: '',
  title: '',
  content: '',
  file_url: '',
  file_size: 0,
  is_active: true
});

// File upload handler
const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    selectedFile.value = file;
    newContent.file_size = file.size;
  }
};

// Get accepted file types based on content type
const getFileAcceptTypes = () => {
  const acceptTypes = {
    'PDF': '.pdf,application/pdf',
    'VIDEO': '.mp4,.avi,.mov,.wmv,.flv,.webm,video/*',
    'AUDIO': '.mp3,.wav,.ogg,.m4a,audio/*',
    'IMAGE': '.jpg,.jpeg,.png,.gif,.bmp,.webp,image/*',
    'DOCUMENT': '.doc,.docx,.txt,.rtf,.odt,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  };
  return acceptTypes[newContent.content_type] || '*/*';
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Upload file to storage (you'll need to implement this based on your storage solution)
const uploadFile = async (file) => {
  // This is a placeholder - implement according to your file storage solution
  // For example, if using AWS S3, Firebase Storage, etc.
  
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    // Replace this with your actual file upload endpoint
    const response = await accapi.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    return response.data.file_url; // Adjust based on your API response
  } catch (error) {
    console.error('File upload error:', error);
    throw new Error('Failed to upload file');
  }
};

// Reset form
const resetForm = () => {
  newContent.content_type = '';
  newContent.title = '';
  newContent.content = '';
  newContent.file_url = '';
  newContent.file_size = 0;
  newContent.is_active = true;
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Add content
const addContent = async () => {
  if (!newContent.content_type || !newContent.title) {
    toast.error('Please fill all required fields');
    return;
  }

  if (newContent.content_type !== 'TEXT' && !selectedFile.value) {
    toast.error('Please select a file to upload');
    return;
  }

  isSubmitting.value = true;
  
  try {
    // Upload file if not text content
    if (newContent.content_type !== 'TEXT' && selectedFile.value) {
      newContent.file_url = await uploadFile(selectedFile.value);
      newContent.content = ''; // Clear content for non-text types
    }

    // Get user ID from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    const contentData = {
      ...newContent,
      created_by: user?.id
    };

    // The API expects an ARRAY of content objects
    const payload = [contentData];

    // Post to the lessons/{lesson_id}/contents/ endpoint
    const response = await accapi.post(`/lessons/${props.lesson.id}/contents/`, payload);
    
    toast.success('Content added successfully!');
    emit('content-added', response.data);
    resetForm();
    
  } catch (error) {
    console.error('Error adding content:', error);
    
    // Check if it's a validation error
    if (error.response?.status === 422) {
      const errors = error.response.data;
      if (typeof errors === 'object') {
        // Display validation errors
        const errorMessages = Object.values(errors).flat().join(', ');
        toast.error(`Validation error: ${errorMessages}`);
      } else {
        toast.error('Validation error: Please check your input');
      }
    } else {
      toast.error('Failed to add content');
    }
  } finally {
    isSubmitting.value = false;
  }
};

// Watch content type changes to reset file selection
watch(() => newContent.content_type, (newType) => {
  selectedFile.value = null;
  newContent.file_url = '';
  newContent.file_size = 0;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
});
</script>