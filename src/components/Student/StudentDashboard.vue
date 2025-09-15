<!-- src/components/StudentDashboard.vue -->
<template>
    <!-- Common Navigation Bar -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h1 class="text-2xl sm:text-3xl font-bold text-gray-900 mb-6 sm:mb-8">My Subjects</h1>

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
            <h3 class="text-sm font-medium text-red-800">Error loading subjects</h3>
            <p class="text-sm text-red-700 mt-1">{{ error }}</p>
          </div>
        </div>
        <div class="mt-4">
          <button 
            @click="fetchSubjects" 
            class="text-sm font-medium text-red-700 hover:text-red-600 focus:outline-none focus:underline transition ease-in-out duration-150"
          >
            Try again
          </button>
        </div>
      </div>

      <!-- Subjects Grid -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
        <!-- Subject Card -->
        <div 
          v-for="subject in subjects" 
          :key="subject.id" 
          :class="['relative rounded-lg p-6 sm:p-8 shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer text-center flex flex-col items-center justify-between h-48 sm:h-52', getCardBgClass(subject.color)]"
          @click="navigateToSubject(subject)"
        >
          <!-- Icon/Logo Area -->
          <div :class="['w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center mb-3 sm:mb-4', getIconBgClass(subject.color)]">
            <i :class="['text-3xl sm:text-4xl', getIconColorClass(subject.color), subject.iconClass]"></i>
          </div>

          <!-- Text Content -->
          <div>
            <h3 :class="['text-base sm:text-lg font-semibold mb-1', getTextColorClass(subject.color)]">{{ subject.name }}</h3>
            <p :class="['text-xs sm:text-sm', getTeacherColorClass(subject.color)]">{{ subject.code }}</p>
          </div>
        </div>
      </div>
    </main>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { accapi } from '@/api/axios';

const router = useRouter();
const user = ref({
  name: 'Student Name',
  avatar: 'https://via.placeholder.com/150',
  role: 'student'
});

const subjects = ref([]);
const loading = ref(true);
const error = ref(null);

// Subject-specific mappings for icons and colors
const subjectMappings = {
  // Science subjects
  'science': { color: 'purple', iconClass: 'pi pi-filter' },
  'physics': { color: 'purple', iconClass: 'pi pi-atom' },
  'chemistry': { color: 'purple', iconClass: 'pi pi-flask' },
  'biology': { color: 'green', iconClass: 'pi pi-dna' },
  
  // Language subjects
  'english': { color: 'blue', iconClass: 'pi pi-language' },
  'arabic': { color: 'blue', iconClass: 'pi pi-language' },
  'french': { color: 'blue', iconClass: 'pi pi-language' },
  'spanish': { color: 'blue', iconClass: 'pi pi-language' },
  
  // Math subjects
  'math': { color: 'yellow', iconClass: 'pi pi-calculator' },
  'mathematics': { color: 'yellow', iconClass: 'pi pi-calculator' },
  'algebra': { color: 'yellow', iconClass: 'pi pi-calculator' },
  'geometry': { color: 'yellow', iconClass: 'pi pi-calculator' },
  'calculus': { color: 'yellow', iconClass: 'pi pi-calculator' },
  
  // Social studies
  'history': { color: 'orange', iconClass: 'pi pi-history' },
  'geography': { color: 'orange', iconClass: 'pi pi-globe' },
  'civics': { color: 'orange', iconClass: 'pi pi-id-card' },
  'social studies': { color: 'orange', iconClass: 'pi pi-users' },
  
  // Islamic studies
  'islamic': { color: 'red', iconClass: 'pi pi-map' },
  'islamic studies': { color: 'red', iconClass: 'pi pi-mosque' },
  'quran': { color: 'red', iconClass: 'pi pi-book' },
  'islam': { color: 'red', iconClass: 'pi pi-mosque' },
  
  // Arts
  'art': { color: 'pink', iconClass: 'pi pi-palette' },
  'music': { color: 'pink', iconClass: 'pi pi-music' },
  'drawing': { color: 'pink', iconClass: 'pi pi-pencil' },
  
  // Technology
  'computer': { color: 'indigo', iconClass: 'pi pi-desktop' },
  'technology': { color: 'indigo', iconClass: 'pi pi-microchip' },
  'programming': { color: 'indigo', iconClass: 'pi pi-code' },
  'coding': { color: 'indigo', iconClass: 'pi pi-code' },
  
  // Physical education
  'pe': { color: 'green', iconClass: 'pi pi-heart' },
  'physical education': { color: 'green', iconClass: 'pi pi-heart' },
  'sports': { color: 'green', iconClass: 'pi pi-forward' },
};

// Fallback styles for subjects that don't match any specific mapping
const fallbackStyles = [
  { color: 'purple', iconClass: 'pi pi-book' },
  { color: 'blue', iconClass: 'pi pi-book' },
  { color: 'green', iconClass: 'pi pi-book' },
  { color: 'yellow', iconClass: 'pi pi-book' },
  { color: 'red', iconClass: 'pi pi-book' },
  { color: 'indigo', iconClass: 'pi pi-book' },
  { color: 'pink', iconClass: 'pi pi-book' },
  { color: 'orange', iconClass: 'pi pi-book' }
];


// Function to get appropriate icon and color for a subject
const getSubjectStyle = (subjectName) => {
  const lowerCaseName = subjectName.toLowerCase();
  
  // Try to find a direct match
  for (const [key, value] of Object.entries(subjectMappings)) {
    if (lowerCaseName.includes(key)) {
      return value;
    }
  }
  
  // If no direct match, use a fallback based on the subject name hash
  const hash = subjectName.split('').reduce((a, b) => {
    a = ((a << 5) - a) + b.charCodeAt(0);
    return a & a;
  }, 0);
  
  const index = Math.abs(hash) % fallbackStyles.length;
  return fallbackStyles[index];
};

// Fetch student enrollments and then subjects
const fetchSubjects = async () => {
  try {
    loading.value = true;
    error.value = null;
    
    // Get student from localStorage
    const student = JSON.parse(localStorage.getItem('user')); 
    if (student?.username) {
      user.value.name = student.username;
    }
    
    // First, get student enrollments to find class_id
    const enrollmentsResponse = await accapi.get(`/student-enrollments/student/${student?.id}`);
    const enrollments = enrollmentsResponse.data;
    
    if (!enrollments || enrollments.length === 0) {
      throw new Error('No enrollments found for this student');
    }
    
    // Get the current enrollment (filter by is_active or academic_session.is_current)
    const currentEnrollment = enrollments.find(enrollment => enrollment.is_active) || enrollments[0];
    const classId = currentEnrollment.class_id;
    
    // Then, get subjects for this class
    const subjectsResponse = await accapi.get(`/classes/${classId}/subjects`);
    const subjectsData = subjectsResponse.data;
    
    // Map API data to our subject format with appropriate colors and icons
    subjects.value = subjectsData.map((subject) => {
      const style = getSubjectStyle(subject.name);
      return {
        id: subject.id,
        name: subject.name,
        code: subject.code,
        description: subject.description,
        color: style.color,
        iconClass: style.iconClass
      };
    });
  } catch (err) {
    console.error('Error fetching subjects:', err);
    error.value = err.response?.data?.message || err.message || 'Failed to load subjects';
  } finally {
    loading.value = false;
  }
};

// Navigate to subject lessons page with subject details
const navigateToSubject = (subject) => {
  // Store the subject details temporarily
  sessionStorage.setItem('currentSubject', JSON.stringify(subject));
  
  // Navigate to the lessons page
  router.push({ 
    name: 'SubjectLessons', 
    params: { id: subject.id },
    query: { name: subject.name, color: subject.color, icon: subject.iconClass }
  });
};

// Helper functions to get Tailwind classes based on subject color
const getCardBgClass = (color) => {
  switch (color) {
    case 'purple': return 'bg-purple-50';
    case 'blue': return 'bg-blue-50';
    case 'green': return 'bg-green-50';
    case 'yellow': return 'bg-yellow-50';
    case 'red': return 'bg-red-50';
    case 'indigo': return 'bg-indigo-50';
    case 'pink': return 'bg-pink-50';
    case 'orange': return 'bg-orange-50';
    default: return 'bg-gray-50';
  }
};

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

const getTextColorClass = (color) => {
  switch (color) {
    case 'purple': return 'text-purple-800';
    case 'blue': return 'text-blue-800';
    case 'green': return 'text-green-800';
    case 'yellow': return 'text-yellow-800';
    case 'red': return 'text-red-800';
    case 'indigo': return 'text-indigo-800';
    case 'pink': return 'text-pink-800';
    case 'orange': return 'text-orange-800';
    default: return 'text-gray-800';
  }
};

const getTeacherColorClass = (color) => {
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

// Fetch subjects when component is mounted
onMounted(() => {
  fetchSubjects();
});
</script>

<style scoped>
/* Custom styles if needed */
</style>