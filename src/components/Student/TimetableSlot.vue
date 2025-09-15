<!-- src/components/TimetableSlot.vue -->
<template>
  <div v-if="schedule" 
       class="p-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
       @click="handleSlotClick">
    <div class="text-xs text-blue-600 mt-1">
      {{ getSubjectName(schedule) }}
    </div>
    <div class="text-xs text-gray-500 mt-1">
      Teacher: {{ teacherProfiles[schedule.teacher_id] || 'Loading...'}}
    </div>
    <div v-if="isBreakPeriod" class="text-xs text-orange-600 mt-1">
      Break Time
    </div>
  </div>
  <div v-else-if="isBreakPeriod" class="p-2 text-center bg-orange-50 border border-orange-200 rounded-md">
    <div class="text-xs font-medium text-orange-700">Break</div>
    <div class="text-xs text-orange-600">
      {{ formatTime(period.start_time) }} - {{ formatTime(period.end_time) }}
    </div>
  </div>
  <div v-else class="p-2 text-center">
    <span class="text-xs text-gray-400">-</span>
  </div>
</template>

<script setup>
import { defineProps, computed, ref, onMounted, watch } from 'vue';
import { api } from '@/api/axios'; 

const props = defineProps({
  schedule: {
    type: Object,
    default: null
  },
  period: {
    type: Object,
    required: true
  },
  day: {
    type: String,
    required: true
  },
  subjectData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['click']);

const teacherProfiles = ref({});

// ✅ Break period check
const isBreakPeriod = computed(() => props.period.is_break);

// ✅ Get subject name
const getSubjectName = (schedule) => {
  if (!schedule?.class_subject?.subject_id) return 'No Subject';

  const subjectId = schedule.class_subject.subject_id;
  const subject = props.subjectData[subjectId];
  return subject?.name || `Subject ${subjectId}`;
};

// ✅ Format time
const formatTime = (timeString) => timeString ? timeString.substring(0, 5) : '';

// ✅ Click handler
const handleSlotClick = () => {
  if (props.schedule && !isBreakPeriod.value) {
    emit('click', props.schedule);
  }
};

// ✅ Fetch teacher profile by ID (with caching)
const fetchTeacherProfile = async (teacherId) => {
  if (!teacherId || teacherProfiles.value[teacherId]) return;
  try {
    const { data } = await api.get(`/teacher_profiles/${teacherId}/`);
    teacherProfiles.value[teacherId] = `${data.first_name} ${data.last_name}`;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    teacherProfiles.value[teacherId] = 'N/A';
  }
};

// ✅ Watch when schedule changes
watch(
  () => props.schedule,
  (newSchedule) => {
    if (newSchedule?.teacher_id) {
      fetchTeacherProfile(newSchedule.teacher_id);
    }
  },
  { immediate: true }
);
</script>
