<!-- src/components/TimetableManagement.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Timetable Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage school timetable schedules</p>
      </div>
      <div class="flex space-x-2">
        <button @click="openPeriodManager" 
          class="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 text-sm">
    Manage Periods
  </button>
        <button @click="showCreateForm = true" 
                class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 text-sm">
          Add Schedule
        </button>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading Timetable...</p>
    </div>

    <!-- Timetable Content -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Filters -->
      <div class="p-4 border-b border-gray-200">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Academic Session</label>
            <select v-model="filters.academic_session_id" @change="fetchTimetable" 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">All Sessions</option>
              <option v-for="session in academicSessions" :key="session.id" :value="session.id">
                {{ session.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Class</label>
            <select v-model="filters.class_id" @change="fetchTimetable" 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">All Classes</option>
              <option v-for="cls in classes" :key="cls.id" :value="cls.id">
                {{ cls.name }}
              </option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Day</label>
            <select v-model="filters.day" @change="fetchTimetable" 
                    class="w-full px-3 py-2 border rounded-md text-sm">
              <option value="">All Days</option>
              <option v-for="day in daysOfWeek" :key="day" :value="day">
                {{ formatDayName(day) }}
              </option>
            </select>
          </div>
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
              <th v-for="day in daysOfWeek" :key="day" 
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
              <td v-for="day in daysOfWeek" :key="day" 
                  class="px-4 py-3 text-center">
                <TimetableSlotManage 
                  :schedule="getScheduleForPeriodAndDay(period.id, day)" 
                  :period="period"
                  :day="day"
                  :subjects-data="subjectsData"
                  @edit="editSchedule"
                  @delete="confirmDeleteSchedule"
                />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Empty State -->
      <div v-if="timetableData.length === 0 && !loading" class="text-center py-12">
        <i class="pi pi-calendar-times text-4xl text-gray-300 mb-4"></i>
        <p class="text-gray-500 mb-2">No timetable entries found</p>
        <p class="text-sm text-gray-400">Create your first schedule to get started</p>
      </div>
    </div>

    <!-- Create/Edit Schedule Modal -->
    <TimetableFormModal 
      v-if="showCreateForm || editingSchedule"
      :show="showCreateForm || !!editingSchedule"
      :schedule="editingSchedule"
      :classes="classes"
      :periods="periods"
      :academic-sessions="academicSessions"
      :days-of-week="daysOfWeek"
      @save="handleSaveSchedule"
      @close="closeFormModal"
    />

    <!-- Period Management Modal -->
    <PeriodManagementModal 
      v-if="showPeriodManager"
      :show="showPeriodManager"
      :periods="periods || []"
      @close="closePeriodManager"
      @refresh="refreshPeriods"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation 
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="scheduleToDelete"
      item-type="schedule"
      @confirm="deleteSchedule"
      @cancel="showDeleteModal = false"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';
import TimetableSlotManage from './TimetableSlotManage.vue';
import TimetableFormModal from './TimetableFormModal.vue';
import PeriodManagementModal from './PeriodManagementModal.vue';
import DeleteConfirmation from '../Admin/DeleteConfirmation.vue';

const loading = ref(false);
const timetableData = ref([]);
const classes = ref([]);
const periods = ref([]);
const academicSessions = ref([]);
const subjectsData = ref({}); // To store subject details fetched individually
const showCreateForm = ref(false);
const showPeriodManager = ref(false);
const showDeleteModal = ref(false);
const editingSchedule = ref(null);
const scheduleToDelete = ref(null);

const filters = ref({
  academic_session_id: '',
  class_id: '',
  day: ''
});

// Days of the week
const daysOfWeek = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'];

// Fetch all necessary data
const fetchAllData = async () => {
  loading.value = true;
  try {
    // Await all initial fetches, then fetch timetable
    await Promise.all([
      fetchClasses(),
      fetchPeriods(),
      fetchAcademicSessions()
    ]);
    await fetchTimetable(); // Fetch timetable after filters are potentially populated and other data is available
  } catch (error) {
    console.error('Error fetching initial data:', error);
    toast.error('Failed to load initial data');
  } finally {
    loading.value = false;
  }
};

// Fetch timetable data
const fetchTimetable = async () => {
  try {
    const params = {};
    if (filters.value.academic_session_id) {
      params.academic_session_id = filters.value.academic_session_id;
    }
    if (filters.value.class_id) {
      params.class_id = filters.value.class_id;
    }
    if (filters.value.day) {
      params.day = filters.value.day;
    }

    const response = await accapi.get('/timetable/', { params });
    timetableData.value = response.data;
    
    // Fetch subject data for all timetable entries
    await fetchSubjectsForTimetable(response.data);
  } catch (error) {
    console.error('Error fetching timetable:', error);
    throw error;
  }
};

// Fetch classes
const fetchClasses = async () => {
  try {
    const response = await accapi.get('/classes/');
    classes.value = response.data;
  } catch (error) {
    console.error('Error fetching classes:', error);
    throw error;
  }
};

// Fetch periods
const fetchPeriods = async () => {
  try {
    const response = await accapi.get('/periods/');
    periods.value = response.data;
  } catch (error) {
    console.error('Error fetching periods:', error);
    throw error;
  }
};

// Fetch academic sessions
const fetchAcademicSessions = async () => {
  try {
    const response = await accapi.get('/academic-sessions/');
    academicSessions.value = response.data;
  } catch (error) {
    console.error('Error fetching academic sessions:', error);
    throw error;
  }
};

// Fetch subject data for timetable
const fetchSubjectsForTimetable = async (timetable) => {
  const subjectIds = new Set();
  
  timetable.forEach(item => {
    if (item.class_subject?.subject_id && !subjectsData.value[item.class_subject.subject_id]) {
      subjectIds.add(item.class_subject.subject_id);
    }
  });

  const subjectPromises = Array.from(subjectIds).map(subjectId => 
    accapi.get(`/subjects/${subjectId}`)
      .then(res => { subjectsData.value[subjectId] = res.data; })
      .catch(error => console.error(`Error fetching subject ${subjectId}:`, error))
  );

  await Promise.all(subjectPromises);
};

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return '';
  // Assuming timeString is like "HH:MM:SS.sssZ"
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};


// Format day name for display
const formatDayName = (day) => {
  return day.charAt(0) + day.slice(1).toLowerCase();
};

// Get all unique periods from timetable data
const allPeriods = computed(() => {
  const periodMap = new Map();
  periods.value.forEach(period => {
    periodMap.set(period.id, period);
  });
  return Array.from(periodMap.values());
});

// Sort periods by order or start time
const sortedPeriods = computed(() => {
  return [...allPeriods.value].sort((a, b) => {
    if (a.order !== undefined && b.order !== undefined) {
      return a.order - b.order;
    }
    // Fallback to sorting by start time if order is not defined
    const timeA = new Date(`2000/01/01 ${a.start_time}`);
    const timeB = new Date(`2000/01/01 ${b.start_time}`);
    return timeA - timeB;
  });
});

// Get schedule for specific period and day
const getScheduleForPeriodAndDay = (periodId, day) => {
  return timetableData.value.find(item => 
    item.period?.id === periodId && 
    item.day === day
  );
};

// Edit schedule
const editSchedule = (schedule) => {
  // If schedule is provided with only period_id and day (for creating new slot)
  // or a full schedule object (for editing existing)
  editingSchedule.value = schedule.id ? { ...schedule } : { 
    ...schedule, // { period_id, day }
    academic_session_id: filters.value.academic_session_id || academicSessions.value.find(s => s.is_current)?.id,
    class_id: filters.value.class_id,
    section_id: null,
    subject_id: null, // to be selected in form
    classSubject_id: null, // to be derived
    teacher_id: null,
    room_number: ''
  };
  showCreateForm.value = false; // Ensure create form is hidden if editing
};

// Confirm delete schedule
const confirmDeleteSchedule = (schedule) => {
  scheduleToDelete.value = schedule;
  showDeleteModal.value = true;
};

// Delete schedule
const deleteSchedule = async () => {
  if (!scheduleToDelete.value) return;

  try {
    await accapi.delete(`/timetable/${scheduleToDelete.value.id}`);
    toast.success('Schedule deleted successfully!');
    await fetchTimetable();
  } catch (error) {
    console.error('Error deleting schedule:', error);
    toast.error('Failed to delete schedule');
  } finally {
    showDeleteModal.value = false;
    scheduleToDelete.value = null;
  }
};

// Handle save schedule (create or update)
const handleSaveSchedule = async (scheduleData) => {
  try {
    if (scheduleData.id) {
      // Update existing schedule
      await accapi.put(`/timetable/${scheduleData.id}`, scheduleData);
      toast.success('Schedule updated successfully!');
    } else {
      // Create new schedule
      const user = JSON.parse(localStorage.getItem('user'));
      scheduleData.created_by = user?.id;
      
      await accapi.post('/timetable/', scheduleData);
      toast.success('Schedule created successfully!');
    }
    
    await fetchTimetable();
    closeFormModal();
  } catch (error) {
    console.error('Error saving schedule:', error);
    toast.error('Failed to save schedule');
  }
};

// Close form modal
const closeFormModal = () => {
  showCreateForm.value = false;
  editingSchedule.value = null;
};

const closePeriodManager = () => {
  showPeriodManager.value = false;
};

const refreshPeriods = async () => {
  try {
    await fetchPeriods();
    // Optionally refresh timetable data as well
    await fetchTimetable();
  } catch (error) {
    console.error('Error refreshing periods:', error);
    toast.error('Failed to refresh periods');
  }
};

const openPeriodManager = () => {
  console.log('Opening period manager, periods:', periods.value);
  showPeriodManager.value = true;
};

onMounted(() => {
  fetchAllData();
});
</script>