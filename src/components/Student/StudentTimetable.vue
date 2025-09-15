<!-- src/components/StudentTimetable.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="mb-6">
      <h2 class="text-xl sm:text-2xl font-bold text-gray-900">My Timetable</h2>
      <p class="text-sm text-gray-600 mt-1">Your teaching schedule for {{ academicSession.name }}</p>
      <div class="flex items-center mt-2 text-sm text-blue-600">
        <i class="pi pi-calendar mr-2"></i>
        <span>{{ formatDateRange(academicSession.start_date, academicSession.end_date) }}</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading Timetable...</p>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="bg-white p-8 rounded-lg shadow-md text-center">
      <i class="pi pi-exclamation-triangle text-4xl text-red-400 mb-4"></i>
      <p class="text-red-500 mb-2">Failed to load timetable</p>
      <p class="text-sm text-gray-500">{{ error }}</p>
      <button @click="fetchTimetable" class="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        Try Again
      </button>
    </div>

    <!-- Timetable Content -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Days Filter -->
      <div class="p-4 border-b border-gray-200">
        <div class="flex flex-wrap gap-2">
          <button v-for="day in daysOfWeek" :key="day" 
                  @click="toggleDayFilter(day)"
                  :class="[
                    'px-3 py-1 rounded-full text-sm font-medium transition-colors',
                    activeDays.includes(day) 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  ]">
            {{ formatDayName(day) }}
          </button>
        </div>
      </div>

      <!-- Timetable Grid -->
      <div class="overflow-x-auto">
        <table class="min-w-full">
          <thead>
            <tr>
              <th class="px-4 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Period
              </th>
              <th v-for="day in filteredDays" :key="day" 
                  class="px-4 py-3 bg-gray-50 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                {{ formatDayName(day) }}
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="period in sortedPeriods" :key="period.id">
              <td class="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900">
                <div>{{ period.name }}</div>
                <div class="text-xs text-gray-500">
                  {{ formatTime(period.start_time) }} - {{ formatTime(period.end_time) }}
                </div>
                <div v-if="period.is_break" class="text-xs text-orange-600">
                  Break
                </div>
              </td>
              <td v-for="day in filteredDays" :key="day" 
                  class="px-4 py-3 text-center">
                <TimetableSlot 
                  :schedule="getScheduleForPeriodAndDay(period.id, day)" 
                  :period="period"
                  :day="day"
                  :subject-data="subjectsData"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="filteredTimetable.length === 0" class="text-center py-12">
        <i class="pi pi-calendar-times text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 mb-2">No classes scheduled</p>
        <p class="text-sm text-gray-400">You don't have any classes in your timetable yet</p>
      </div>

      <!-- Timetable Summary -->
      <div v-if="filteredTimetable.length > 0" class="p-4 border-t border-gray-200 bg-gray-50">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
          <div class="text-center">
            <span class="font-semibold text-blue-600">{{ totalClasses }}</span>
            <p class="text-gray-600">Total Classes</p>
          </div>
          <div class="text-center">
            <span class="font-semibold text-green-600">{{ uniqueSubjects }}</span>
            <p class="text-gray-600">Subjects</p>
          </div>
          <div class="text-center">
            <span class="font-semibold text-purple-600">{{ uniqueClasses }}</span>
            <p class="text-gray-600">Classes</p>
          </div>
          <div class="text-center">
            <span class="font-semibold text-orange-600">{{ uniqueSections }}</span>
            <p class="text-gray-600">Sections</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';
import TimetableSlot from './TimetableSlot.vue';

const loading = ref(false);
const error = ref(null);
const timetableData = ref([]);
const subjectsData = ref({}); // Store subject data by ID
const academicSession = ref({
  name: 'Current Session',
  start_date: new Date(),
  end_date: new Date(),
  is_current: false,
  id: 0,
  school_id: 0,
  created_by: 0
});

// Days of the week from API response
const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];
const activeDays = ref(['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY']);

// Get Studnet ID from localStorage
const getStudentId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.id;
};

// Fetch current academic session
const fetchAcademicSession = async () => {
  try {
    const response = await accapi.get('/academic-sessions/current');
    academicSession.value = response.data;
    return response.data.id;
  } catch (err) {
    console.error('Error fetching academic session:', err);
    toast.error('Failed to load academic session');
    throw err;
  }
};

// Fetch subject data by ID
const fetchSubjectData = async (subjectId) => {
  if (subjectsData.value[subjectId]) {
    return subjectsData.value[subjectId]; // Already fetched
  }

  try {
    const response = await accapi.get(`/subjects/${subjectId}`);
    subjectsData.value[subjectId] = response.data;
    return response.data;
  } catch (err) {
    console.error(`Error fetching subject ${subjectId}:`, err);
    return { name: `Subject ${subjectId}`, code: '' }; // Fallback
  }
};

// Fetch all subjects for timetable
const fetchSubjectsForTimetable = async (timetable) => {
  const subjectIds = new Set();
  
  // Collect all unique subject IDs
  timetable.forEach(item => {
    if (item.class_subject?.subject_id) {
      subjectIds.add(item.class_subject.subject_id);
    }
  });

  // Fetch all subjects in parallel
  const subjectPromises = Array.from(subjectIds).map(subjectId => 
    fetchSubjectData(subjectId)
  );

  await Promise.all(subjectPromises);
};

// Fetch timetable data
const fetchTimetable = async () => {
  const studentId = getStudentId();
  if (!studentId) {
    error.value = 'Student ID not found';
    return;
  }

  loading.value = true;
  error.value = null;

  try {
    // First get academic session ID
    const academicSessionId = await fetchAcademicSession();
    
    // Then get timetable with both student_id and academic_session_id
    const response = await accapi.get(`/timetable/student/${studentId}`, {
      params: { academic_session_id: academicSessionId }
    });
    
    timetableData.value = response.data;
    
    // Fetch subject data for all timetable entries
    await fetchSubjectsForTimetable(response.data);
  } catch (err) {
    console.error('Error fetching timetable:', err);
    error.value = err.response?.data?.message || 'Failed to load timetable';
    toast.error('Failed to load timetable');
  } finally {
    loading.value = false;
  }
};

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
};

// Format date range
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) return '';
  
  const start = new Date(startDate).toLocaleDateString();
  const end = new Date(endDate).toLocaleDateString();
  
  return `${start} - ${end}`;
};

// Format day name for display (MONDAY -> Monday)
const formatDayName = (day) => {
  return day.charAt(0) + day.slice(1).toLowerCase();
};

// Toggle day filter
const toggleDayFilter = (day) => {
  const index = activeDays.value.indexOf(day);
  if (index === -1) {
    activeDays.value.push(day);
  } else {
    activeDays.value.splice(index, 1);
  }
};

// Get all unique periods from timetable data
const allPeriods = computed(() => {
  const periods = new Map();
  timetableData.value.forEach(item => {
    if (item.period && !periods.has(item.period.id)) {
      periods.set(item.period.id, item.period);
    }
  });
  return Array.from(periods.values());
});

// Sort periods by order or start time
const sortedPeriods = computed(() => {
  return [...allPeriods.value].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    return a.start_time.localeCompare(b.start_time);
  });
});

// Get filtered days based on active filters
const filteredDays = computed(() => {
  return daysOfWeek.filter(day => activeDays.value.includes(day));
});

// Get schedule for specific period and day
const getScheduleForPeriodAndDay = (periodId, day) => {
  return timetableData.value.find(item => 
    item.period?.id === periodId && 
    item.day === day // Note: changed from day_of_week to day based on your response
  );
};

// Filtered timetable data
const filteredTimetable = computed(() => {
  return timetableData.value.filter(item => 
    activeDays.value.includes(item.day) // Note: changed from day_of_week to day
  );
});

// Statistics
const totalClasses = computed(() => filteredTimetable.value.length);
const uniqueSubjects = computed(() => {
  const subjects = new Set();
  filteredTimetable.value.forEach(item => {
    if (item.class_subject?.subject_id) {
      subjects.add(item.class_subject.subject_id);
    }
  });
  return subjects.size;
});
const uniqueClasses = computed(() => {
  const classes = new Set();
  filteredTimetable.value.forEach(item => {
    if (item.class_associated?.id) {
      classes.add(item.class_associated.id);
    }
  });
  return classes.size;
});
const uniqueSections = computed(() => {
  const sections = new Set();
  filteredTimetable.value.forEach(item => {
    if (item.section_associated?.id) {
      sections.add(item.section_associated.id);
    }
  });
  return sections.size;
});

onMounted(() => {
  fetchTimetable();
});
</script>