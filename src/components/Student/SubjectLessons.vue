<!-- src/views/SubjectLessons.vue -->
<template>
  <main class="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <!-- Breadcrumb -->
    <nav class="flex mb-6" aria-label="Breadcrumb">
      <ol class="inline-flex items-center space-x-1 md:space-x-3">
        <li class="inline-flex items-center">
          <router-link to="/student/dashboard" class="inline-flex items-center text-sm font-medium text-gray-500 hover:text-blue-600">
            <i class="pi pi-home mr-2"></i>
            Subjects
          </router-link>
        </li>
        <li aria-current="page">
          <div class="flex items-center">
            <i class="pi pi-angle-right text-gray-400"></i>
            <span class="ml-1 text-sm font-medium text-gray-700 md:ml-2">Lessons</span>
          </div>
        </li>
      </ol>
    </nav>

    <!-- Subject Header -->
    <div class="bg-white rounded-lg shadow-sm p-3 mb-8">
      <div class="flex items-center">
        <div :class="['w-16 h-16 rounded-full flex items-center justify-center mr-4', getIconBgClass(subjectColor)]">
          <i :class="['text-2xl', getIconColorClass(subjectColor), subjectIcon]"></i>
        </div>
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-gray-900">{{ subjectName }}</h1>
          <p class="text-gray-600 mt-1">Explore all lessons and assignments for this subject</p>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center items-center h-64">
      <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-red-50 p-4 rounded-md mb-6">
      <div class="flex">
        <div class="flex-shrink-0">
          <i class="pi pi-exclamation-triangle text-red-400 text-xl"></i>
        </div>
        <div class="ml-3">
          <h3 class="text-sm font-medium text-red-800">Error loading lessons</h3>
          <p class="text-sm text-red-700 mt-1">{{ error }}</p>
        </div>
      </div>
      <div class="mt-4">
        <button 
          @click="fetchLessons" 
          class="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline transition ease-in-out duration-150"
        >
          Try again
        </button>
      </div>
    </div>

    <!-- Lessons Content -->
    <div v-else class="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <!-- Lessons Grid -->
      <div class="lg:col-span-3">
        <!-- Lessons Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <!-- Lesson Card -->
          <div 
            v-for="lesson in lessons" 
            :key="lesson.id" 
            class="bg-white rounded-lg shadow-md hover:shadow-md transition-shadow duration-200 overflow-hidden cursor-pointer"
            @click="openLesson(lesson)"
          >
            <!-- Card Header with Status Icon -->
            <div class="p-6 pb-4">
              <div class="flex justify-center mb-4">
                <div :class="['w-16 h-16 rounded-full flex items-center justify-center', getLessonIconBgClass(lesson)]">
                  <i :class="['text-2xl', getLessonIconClass(lesson)]"></i>
                </div>
              </div>
              
              <h3 class="text-lg font-semibold text-gray-900 text-center mb-2">
                Lesson {{ lesson.lesson_number }}: {{ lesson.title }}
              </h3>
              
              <p class="text-sm text-gray-600 text-center mb-3">
                {{ getLessonStatusText(lesson) }}
              </p>
            </div>

            <!-- Card Footer with Badges -->
            <div class="px-6 pb-6">
              <div class="flex justify-center space-x-2">
                <!-- Assignment Badge -->
                <span 
                  v-if="lesson.has_assignment" 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800"
                >
                  <i class="pi pi-file-edit mr-1"></i>
                  Assignment{{ lesson.assignment_due ? ' Due' : '' }}
                </span>
                
                <!-- Assessment Badge -->
                <span 
                  v-if="lesson.has_assessment" 
                  class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800"
                >
                  <i class="pi pi-file-check mr-1"></i>
                  Assessment
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Progress Sidebar -->
      <div>
        <!-- Quick Stats -->
        <div class="bg-white rounded-lg shadow-sm p-5">
          <h3 class="font-medium text-gray-900 mb-4">Progress Overview</h3>
          
          <div class="grid grid-cols-2 gap-4">
            <div class="text-center p-3 bg-blue-50 rounded-lg">
              <p class="text-2xl font-bold text-blue-700">{{ completedLessons }}</p>
              <p class="text-xs text-blue-600 mt-1">Completed</p>
            </div>
            
            <div class="text-center p-3 bg-yellow-50 rounded-lg">
              <p class="text-2xl font-bold text-yellow-700">{{ inProgressLessons }}</p>
              <p class="text-xs text-yellow-600 mt-1">In Progress</p>
            </div>
            
            <div class="text-center p-3 bg-gray-50 rounded-lg">
              <p class="text-2xl font-bold text-gray-700">{{ notStartedLessons }}</p>
              <p class="text-xs text-gray-600 mt-1">Not Started</p>
            </div>
            
            <div class="text-center p-3 bg-green-50 rounded-lg">
              <p class="text-2xl font-bold text-green-700">{{ totalLessons }}</p>
              <p class="text-xs text-green-600 mt-1">Total Lessons</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { accapi } from '@/api/axios';

const route = useRoute();
const router = useRouter();

const user = ref({
  name: 'Student Name',
  avatar: 'https://via.placeholder.com/150',
  role: 'student'
});

// Get subject details from route query or session storage
const subjectId = ref(route.params.id);
const subjectName = ref(route.query.name || '');
const subjectColor = ref(route.query.color || 'blue');
const subjectIcon = ref(route.query.icon || 'pi pi-book');
const lessons = ref([]);
const loading = ref(true);
const error = ref(null);

// Get student info from localStorage
const getStudentInfo = () => {
  const student = JSON.parse(localStorage.getItem('user')); 
  if (student?.username) {
    user.value.name = student.username;
    return student;
  }
  return null;
};

// Fetch lessons for the subject
const fetchLessons = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    const student = getStudentInfo();
    if (!student) {
      throw new Error('Student information not found');
    }
    
    // First, get student enrollments to find class_id and section_id
    const enrollmentsResponse = await accapi.get(`/student-enrollments/student/${student.id}`);
    const enrollments = enrollmentsResponse.data;
    
    if (!enrollments || enrollments.length === 0) {
      throw new Error('No enrollments found for this student');
    }
    
    // Get the current enrollment
    const currentEnrollment = enrollments.find(enrollment => enrollment.is_active) || enrollments[0];
    const classId = currentEnrollment.class_id;
    const sectionId = currentEnrollment.section_id;
    
    // Get class_subject_id
    const classSubjectResponse = await accapi.get(`/class_subjects/${classId}/${subjectId.value}`);
    const classSubjectData = classSubjectResponse.data;
    
    if (!classSubjectData) {
      throw new Error('Subject not found in this class');
    }
    
    // Get lessons for this class_subject and section
    const lessonsResponse = await accapi.get(`/lessons/class_subject/${classSubjectData.id}`, {
      params: { section_id: sectionId }
    });
    
    lessons.value = lessonsResponse.data;
    
  } catch (err) {
    console.error('Error fetching lessons:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load lessons';
  } finally {
    loading.value = false;
  }
};

// Get lesson icon background class based on status
const getLessonIconBgClass = (lesson) => {
  if (lesson.is_completed) return 'bg-green-100';
  if (lesson.is_published && !lesson.is_completed) return 'bg-blue-100';
  return 'bg-gray-100';
};

// Get lesson icon class based on status
const getLessonIconClass = (lesson) => {
  if (lesson.is_completed) return 'pi pi-check text-green-600';
  if (lesson.is_published && !lesson.is_completed) return 'pi pi-hourglass text-blue-600';
  return 'pi pi-lock text-gray-400';
};

// Get lesson status text
const getLessonStatusText = (lesson) => {
  if (lesson.is_completed) return 'Completed';
  if (lesson.is_published && !lesson.is_completed) return 'In Progress';
  return 'Not Started';
};

// Format date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

// Open lesson details
const openLesson = (lesson) => {
  // Navigate to lesson detail page or show modal
  console.log('Opening lesson:', lesson);
  // router.push({ name: 'LessonDetail', params: { id: lesson.id } });
};

// Helper functions to get Tailwind classes based on subject color
const getIconBgClass = (color) => {
  switch (color) {
    case 'purple': return 'bg-purple-100';
    case 'blue': return 'bg-blue-100';
    case 'green': return 'bg-green-100';
    case 'yellow': return 'bg-yellow-100';
    case 'red': return 'bg-red-100';
    case 'indigo': return 'bg-indigo-100';
    case 'pink': return 'bg-pink-100';
    case 'orange': return 'bg-orange-100';
    default: return 'bg-gray-100';
  }
};

const getIconColorClass = (color) => {
  switch (color) {
    case 'purple': return 'text-purple-600';
    case 'blue': return 'text-blue-600';
    case 'green': return 'text-green-600';
    case 'yellow': return 'text-yellow-600';
    case 'red': return 'text-red-600';
    case 'indigo': return 'text-indigo-600';
    case 'pink': return 'text-pink-600';
    case 'orange': return 'text-orange-600';
    default: return 'text-gray-600';
  }
};

// Computed properties for progress stats
const completedLessons = computed(() => {
  return lessons.value.filter(lesson => lesson.is_completed).length;
});

const inProgressLessons = computed(() => {
  return lessons.value.filter(lesson => lesson.is_published && !lesson.is_completed).length;
});

const notStartedLessons = computed(() => {
  return lessons.value.filter(lesson => !lesson.is_published && !lesson.is_completed).length;
});

const totalLessons = computed(() => {
  return lessons.value.length;
});

// Fetch lessons when component is mounted
onMounted(() => {
  if (!subjectName.value) {
    const storedSubject = JSON.parse(sessionStorage.getItem('currentSubject') || '{}');
    if (storedSubject.id === subjectId.value) {
      subjectName.value = storedSubject.name;
      subjectColor.value = storedSubject.color;
      subjectIcon.value = storedSubject.iconClass;
    }
  }
  
  // Fetch lessons after setting up subject details
  fetchLessons();
});
</script>

<style scoped>
/* Custom styles if needed */
</style>