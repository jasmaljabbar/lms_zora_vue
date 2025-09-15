<template>
  <div class="relative flex flex-col items-center justify-center p-2 min-h-[80px] border border-dashed border-gray-200 rounded-md bg-gray-50 hover:bg-gray-100 transition-colors duration-200">
    
    <div v-if="schedules.length > 0" class="w-full">
      <div v-for="schedule in schedules" :key="schedule.id" 
           class="mb-1 p-2 bg-white rounded-md shadow-sm text-left text-xs border border-gray-100 relative group">
        <div class="font-semibold text-gray-800">
          {{ subjectsData[schedule.class_subject?.subject_id]?.name || 'N/A' }} 
          <span class="text-blue-600">({{ schedule.class_associated?.name }} - {{ schedule.section_associated?.name }})</span>
        </div>
        <div class="text-gray-600 mt-1">
          Teacher: {{ teacherProfiles[schedule.teacher_id] || 'Loading...' }} 
        </div>
        <div class="text-gray-500">
          Room: {{ schedule.room_number || 'N/A' }}
        </div>
        
        <!-- Actions for each individual schedule -->
        <div class="absolute top-0 right-0 flex space-x-1 p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button @click.stop="$emit('edit', schedule)" 
                  class="text-blue-500 hover:text-blue-700 p-1 rounded-full hover:bg-blue-100 focus:outline-none text-xs">
            <i class="pi pi-pencil"></i>
          </button>
          <button @click.stop="$emit('delete', schedule)" 
                  class="text-red-500 hover:text-red-700 p-1 rounded-full hover:bg-red-100 focus:outline-none text-xs">
            <i class="pi pi-trash"></i>
          </button>
        </div>
      </div>
      <!-- Button to add another schedule to this slot -->
      <button @click="$emit('add-to-slot', period, day)" 
              class="mt-2 w-full text-blue-600 hover:text-blue-800 text-xs px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded-md transition-colors duration-200">
        <i class="pi pi-plus mr-1"></i> Add Another
      </button>
    </div>

    <div v-else class="text-center text-gray-400">
      <button @click="$emit('add-to-slot', period, day)" 
              class="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-xs focus:outline-none">
        <i class="pi pi-plus mr-1"></i> Add Schedule
      </button>
    </div>
  </div>
</template>

<script setup>
import { api } from '@/api/axios';
import { defineProps, defineEmits, ref, onMounted } from 'vue';

const props = defineProps({
  schedules: {
    type: Array,
    default: () => []
  },
  period: Object,
  day: String,
  subjectsData: Object,
});

const emit = defineEmits(['edit', 'delete', 'add-to-slot']);

// Store teacher profiles in a dictionary { teacher_id: "Full Name" }
const teacherProfiles = ref({});

// Fetch teacher profile by ID
const fetchTeacherProfile = async (teacherId) => {
  if (!teacherId || teacherProfiles.value[teacherId]) return; // already cached
  try {
    const { data } = await api.get(`/teacher_profiles/${teacherId}/`);
    teacherProfiles.value[teacherId] = `${data.first_name} ${data.last_name}`;
  } catch (error) {
    console.error('Error fetching teacher profile:', error);
    teacherProfiles.value[teacherId] = 'N/A';
  }
};

// Load teachers when schedules change
onMounted(() => {
  props.schedules.forEach(sch => {
    if (sch.teacher_id) {
      fetchTeacherProfile(sch.teacher_id);
    }
  });
});
</script>


<style scoped>
/* Add any specific styles for the slot if needed */
.group:hover .opacity-0 {
  opacity: 1;
}
</style>