<!-- src/components/Subjects.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Subjects</h2>
      <p class="text-sm text-gray-600 mt-1">Your assigned subjects and progress</p>
    </div>

    <!-- Main Loading State -->
    <div v-if="loading && teacherAssignments.length === 0" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading Subjects...</p>
    </div>

    <!-- Subjects Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <!-- Skeleton Loaders for Assignments -->
      <div v-if="loading && teacherAssignments.length === 0" v-for="n in 6" :key="'skeleton-' + n" 
           class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <div class="p-4 border-b border-gray-200">
          <div class="h-6 bg-gray-200 rounded w-3/4 mb-2 animate-pulse"></div>
          <div class="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
        </div>
        <div class="p-4 bg-gray-50">
          <div class="flex justify-between">
            <div class="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
          </div>
          <div class="h-4 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
        </div>
        <div class="p-4">
          <div class="flex justify-between mb-2">
            <div class="h-4 bg-gray-200 rounded w-1/3 animate-pulse"></div>
            <div class="h-4 bg-gray-200 rounded w-1/6 animate-pulse"></div>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2.5 animate-pulse"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2 mt-2 animate-pulse"></div>
        </div>
        <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
          <div class="h-8 bg-gray-200 rounded w-20 animate-pulse"></div>
          <div class="h-8 bg-gray-200 rounded w-24 animate-pulse"></div>
        </div>
      </div>

      <!-- Actual Assignment Cards -->
      <div v-for="assignment in teacherAssignments" :key="assignment.id" 
           class="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
        <!-- Subject Header -->
        <div class="p-4 border-b border-gray-200">
          <h3 class="text-lg font-semibold text-gray-800">{{ assignment.subject_associated.name }}</h3>
          <p class="text-sm text-gray-600 mt-1">{{ assignment.subject_associated.description || 'No description' }}</p>
        </div>

        <!-- Class & Section Info -->
        <div class="p-4 bg-gray-50">
          <div class="flex justify-between items-center text-sm text-gray-600">
            <span>Class: {{ assignment.class_associated.name }}</span>
            <span>Section: {{ assignment.section_associated.name }}</span>
          </div>
          <div class="mt-2 text-sm text-gray-600">
            Session: {{ assignment.academic_session.name }}
          </div>
        </div>

        <!-- Progress Section -->
        <div class="p-4">
          <div class="flex justify-between items-center mb-2">
            <span class="text-sm font-medium text-gray-700">Lessons Completed</span>
            <span class="text-sm font-semibold text-blue-600">{{ completionPercentage(assignment) }}%</span>
          </div>
          
          <!-- Progress Bar -->
          <div class="w-full bg-gray-200 rounded-full h-2.5">
            <div class="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                 :style="{ width: completionPercentage(assignment) + '%' }"></div>
          </div>

          <!-- Lesson Stats -->
          <div class="mt-3 flex justify-between text-xs text-gray-500">
            <span>{{ completedLessonsCount(assignment) }} of {{ totalLessonsCount(assignment) }} lessons completed</span>
          </div>
        </div>

        <!-- Action Buttons -->
        <div class="p-4 border-t border-gray-200 bg-gray-50 flex justify-between">
          <button @click="viewLessons(assignment)" 
                  class="px-3 py-1 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center"
                  :disabled="lessonLoading[assignment.id]">
            <span v-if="lessonLoading[assignment.id]" class="flex items-center">
              <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
              Loading...
            </span>
            <span v-else>View Lessons</span>
          </button>
          <button @click="manageContent(assignment)" 
                  class="px-3 py-1 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors">
            Manage Content
          </button>
        </div>
      </div>

      <!-- Empty State -->
      <div v-if="!loading && teacherAssignments.length === 0" class="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
        <i class="pi pi-book text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 mb-2">No subjects assigned to you yet</p>
        <p class="text-sm text-gray-400">Contact your administrator to get assigned to subjects</p>
      </div>
    </div>

    <!-- Lessons Modal -->
    <LessonsModal 
      v-if="showLessonsModal" 
      :show="showLessonsModal" 
      :assignment="selectedAssignment"
      :lessons="lessons"
      @close="closeLessonsModal"
      @refresh="handleRefresh"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { api, accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';
import LessonsModal from './LessonsModal.vue';

const loading = ref(false);
const teacherAssignments = ref([]);
const lessonsData = ref({});
const showLessonsModal = ref(false);
const selectedAssignment = ref(null);
const lessons = ref([]);
const lessonLoading = ref({}); // Track loading state for individual assignments

// Get teacher ID from localStorage
const getTeacherId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.id;
};

// Fetch teacher assignments
const fetchTeacherAssignments = async () => {
  const teacherId = getTeacherId();
  if (!teacherId) {
    toast.error('Teacher ID not found');
    return;
  }

  loading.value = true;
  try {
    const response = await accapi.get(`/teacher-assignments/teacher/${teacherId}`);
    teacherAssignments.value = response.data;
    
    // Initialize loading states for each assignment
    teacherAssignments.value.forEach(assignment => {
      lessonLoading.value[assignment.id] = false;
    });
    
  } catch (error) {
    console.error('Error fetching teacher assignments:', error);
    toast.error('Failed to load subjects');
  } finally {
    loading.value = false;
  }
};

// Fetch lessons for a specific assignment
const fetchLessonsForAssignment = async (assignment) => {
  if (lessonLoading.value[assignment.id]) return; // Prevent multiple clicks
  
  lessonLoading.value[assignment.id] = true;
  
  try {
    // First get class_subject_id
    const classSubjectResponse = await accapi.get(
      `/class_subjects/${assignment.class_id}/${assignment.subject_id}`
    );
    
    if (classSubjectResponse.data && classSubjectResponse.data.id) {
      const classSubjectId = classSubjectResponse.data.id;
      
      // Then get lessons for this class_subject_id and section_id
      const lessonsResponse = await accapi.get(
        `/lessons/class_subject/${classSubjectId}?section_id=${assignment.section_id}`
      );
      
      lessonsData.value[assignment.id] = lessonsResponse.data || [];
    }
  } catch (error) {
    console.error(`Error fetching lessons for assignment ${assignment.id}:`, error);
    lessonsData.value[assignment.id] = [];
    toast.error('Failed to load lessons');
  } finally {
    lessonLoading.value[assignment.id] = false;
  }
};

// Fetch lessons for all assignments (background loading)
const fetchAllLessons = async () => {
  for (const assignment of teacherAssignments.value) {
    await fetchLessonsForAssignment(assignment);
  }
};

// Calculate completion percentage for an assignment
const completionPercentage = (assignment) => {
  const lessons = lessonsData.value[assignment.id] || [];
  if (lessons.length === 0) return 0;
  
  const completed = lessons.filter(lesson => lesson.is_completed).length;
  return Math.round((completed / lessons.length) * 100);
};

// Get completed lessons count
const completedLessonsCount = (assignment) => {
  const lessons = lessonsData.value[assignment.id] || [];
  return lessons.filter(lesson => lesson.is_completed).length;
};

// Get total lessons count
const totalLessonsCount = (assignment) => {
  const lessons = lessonsData.value[assignment.id] || [];
  return lessons.length;
};

// View lessons for an assignment
const viewLessons = async (assignment) => {
  // Check if we already have lessons data
  if (!lessonsData.value[assignment.id]) {
    await fetchLessonsForAssignment(assignment);
  }
  
  selectedAssignment.value = assignment;
  lessons.value = lessonsData.value[assignment.id] || [];
  showLessonsModal.value = true;
};

// Handle refresh from modal
const handleRefresh = async () => {
  if (selectedAssignment.value) {
    await fetchLessonsForAssignment(selectedAssignment.value);
    lessons.value = lessonsData.value[selectedAssignment.value.id] || [];
  }
};

// Manage content for an assignment
const manageContent = (assignment) => {
  // Implement content management functionality
  toast.info(`Manage content for ${assignment.subject_associated.name}`);
};

// Close lessons modal
const closeLessonsModal = () => {
  showLessonsModal.value = false;
  selectedAssignment.value = null;
  lessons.value = [];
};

// Load lessons in background after assignments are loaded
onMounted(async () => {
  await fetchTeacherAssignments();
  // Start background loading of lessons
  if (teacherAssignments.value.length > 0) {
    fetchAllLessons();
  }
});
</script>