<!-- src/components/TimetableSlot.vue -->
<template>
  <div v-if="schedule" 
       class="p-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors cursor-pointer"
       @click="handleSlotClick">
    <div class="text-sm font-medium text-blue-800">
      {{ schedule.class_associated?.name }}{{ schedule.section_associated?.name ? ' - ' + schedule.section_associated.name : '' }}
    </div>
    <div class="text-xs text-blue-600 mt-1">
      {{ getSubjectName(schedule) }}
    </div>
    <div class="text-xs text-gray-500 mt-1">
      Room: {{ schedule.room_number || 'N/A' }}
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
import { defineProps, computed } from 'vue';

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

// Check if this is a break period
const isBreakPeriod = computed(() => {
  return props.period.is_break;
});

// Extract subject name using subject data
const getSubjectName = (schedule) => {
  if (!schedule.class_subject?.subject_id) {
    return 'No Subject';
  }

  const subjectId = schedule.class_subject.subject_id;
  const subject = props.subjectData[subjectId];
  
  if (subject && subject.name) {
    return subject.name;
  }
  
  return `Subject ${subjectId}`;
};

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return '';
  return timeString.substring(0, 5); // Extract HH:MM from HH:MM:SS
};

// Handle slot click
const handleSlotClick = () => {
  if (props.schedule && !isBreakPeriod.value) {
    emit('click', props.schedule);
  }
};
</script>