<!-- src/components/TimetableSlotManage.vue -->
<template>
  <div v-if="schedule" 
       class="p-2 bg-blue-50 border border-blue-200 rounded-md hover:bg-blue-100 transition-colors cursor-pointer group relative"
       @click="$emit('edit', schedule)">
    <div class="text-sm font-medium text-blue-800">
      {{ schedule.class_associated?.name }}{{ schedule.section_associated?.name ? ' - ' + schedule.section_associated.name : '' }}
    </div>
    <div class="text-xs text-blue-600 mt-1">
      {{ getSubjectName(schedule) }}
    </div>
    <div class="text-xs text-gray-500 mt-1">
      Room: {{ schedule.room_number || 'N/A' }}
    </div>
    <div class="text-xs text-gray-500 mt-1">
      Teacher: {{ getTeacherName(schedule) }}
    </div>
    
    <!-- Action buttons -->
    <div class="absolute top-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
      <button @click.stop="$emit('edit', schedule)" 
              class="p-1 text-blue-600 hover:text-blue-800 bg-white rounded"
              title="Edit">
        <i class="pi pi-pencil text-xs"></i>
      </button>
      <button @click.stop="$emit('delete', schedule)" 
              class="p-1 text-red-600 hover:text-red-800 bg-white rounded"
              title="Delete">
        <i class="pi pi-trash text-xs"></i>
      </button>
    </div>
  </div>
  <div v-else-if="period.is_break" class="p-2 text-center bg-orange-50 border border-orange-200 rounded-md">
    <div class="text-xs font-medium text-orange-700">Break</div>
    <div class="text-xs text-orange-600">
      {{ formatTime(period.start_time) }} - {{ formatTime(period.end_time) }}
    </div>
  </div>
  <div v-else class="p-2 text-center hover:bg-gray-50 cursor-pointer flex items-center justify-center h-full min-h-[60px]" 
       @click="$emit('edit', { period_id: period.id, day: day })">
    <span class="text-xs text-gray-400">+ Add Class</span>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';

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
  subjectsData: {
    type: Object,
    default: () => ({})
  }
});

const emit = defineEmits(['edit', 'delete']);

// Extract subject name
const getSubjectName = (schedule) => {
  if (!schedule.class_subject?.subject_id) return 'No Subject';
  
  const subjectId = schedule.class_subject.subject_id;
  const subject = props.subjectsData[subjectId];
  
  return subject?.name || `Subject ${subjectId}`;
};

// Extract teacher name (you might need to fetch this separately)
const getTeacherName = (schedule) => {
  // This currently displays the teacher ID. For actual names, you'd need
  // to fetch teacher data and map the ID to a name.
  return schedule.teacher_id ? `Teacher ID: ${schedule.teacher_id}` : 'Not assigned';
};

// Format time for display
const formatTime = (timeString) => {
  if (!timeString) return '';
  const date = new Date(timeString);
  return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
};
</script>
