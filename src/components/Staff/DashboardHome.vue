<!-- src/components/PrincipalDashboard.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Aeme High - Principal Dashboard</h2>
        <p class="text-sm text-gray-600 mt-1">Welcome back, Principal. Here's your overview.</p>
      </div>
      <div class="flex items-center space-x-2">
        <span class="text-sm text-gray-500">Today: {{ currentDate }}</span>
      </div>
    </div>

    <!-- Navigation Cards -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">

      
      <router-link 
        to="/staff/class_section" 
        class="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center border border-gray-200"
      >
        <div class="text-center">
          <i class="pi pi-table text-2xl mb-2 text-gray-600"></i>
          <p class="font-medium text-gray-700">Class & Section</p>
        </div>
      </router-link>
      <router-link 
        to="/principal/teachers" 
        class="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center border border-gray-200"
      >
        <div class="text-center">
          <i class="pi pi-book text-2xl mb-2 text-gray-600"></i>
          <p class="font-medium text-gray-700">Subject</p>
        </div>
      </router-link>
      <router-link 
        to="/principal/teachers" 
        class="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center border border-gray-200"
      >
        <div class="text-center">
          <i class="pi pi-user text-2xl mb-2 text-gray-600"></i>
          <p class="font-medium text-gray-700">Teachers</p>
        </div>
      </router-link>
      
      <router-link 
        to="/principal/students" 
        class="bg-white p-4 rounded-lg shadow-md hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center border border-gray-200"
      >
        <div class="text-center">
          <i class="pi pi-users text-2xl mb-2 text-gray-600"></i>
          <p class="font-medium text-gray-700">Students</p>
        </div>
      </router-link>
    </div>

    <!-- Performance Analytics Section -->
    

    <!-- Teacher Performance Analysis Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Left Column -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Teacher Performance Analysis</h3>
        
        <div class="grid grid-cols-2 gap-4 mb-6">
          <div class="bg-blue-50 p-4 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-sm font-medium text-gray-600">Attendance</h4>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+43%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">95%</p>
            <p class="text-xs text-gray-500 mt-1">This Week</p>
          </div>
          
          <div class="bg-green-50 p-4 rounded-lg">
            <div class="flex justify-between items-start mb-2">
              <h4 class="text-sm font-medium text-gray-600">Student Results</h4>
              <span class="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">+55%</span>
            </div>
            <p class="text-2xl font-bold text-gray-900">80%</p>
            <p class="text-xs text-gray-500 mt-1">This Week</p>
          </div>
        </div>

        <!-- Weekly Performance Chart -->
        <div>
          <h4 class="text-sm font-medium text-gray-600 mb-3">Weekly Performance</h4>
          <div class="flex justify-between items-end h-32">
            <div v-for="(day, index) in weeklyPerformance" :key="index" class="flex flex-col items-center">
              <div class="text-xs text-gray-500 mb-2">{{ day.name }}</div>
              <div 
                class="w-8 rounded-t-lg bg-blue-500" 
                :style="{ height: day.value + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column - Student Performance -->
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">Student Performance</h3>
        
        <div class="space-y-4">
          <div v-for="student in topStudents" :key="student.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div class="flex items-center">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span class="text-blue-600 font-medium">{{ student.initials }}</span>
              </div>
              <div>
                <p class="text-sm font-medium text-gray-900">{{ student.name }}</p>
                <p class="text-xs text-gray-500">{{ student.class }}</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-sm font-medium text-gray-900">{{ student.score }}%</p>
              <p class="text-xs text-gray-500">Score</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Section -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h4 class="text-sm font-medium text-gray-600 mb-2">Total Students</h4>
        <p class="text-3xl font-bold text-gray-900">1,245</p>
        <div class="flex items-center mt-1">
          <i class="pi pi-arrow-up text-green-500 mr-1"></i>
          <span class="text-sm text-green-500">+5% from last month</span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h4 class="text-sm font-medium text-gray-600 mb-2">Total Teachers</h4>
        <p class="text-3xl font-bold text-gray-900">45</p>
        <div class="flex items-center mt-1">
          <i class="pi pi-arrow-up text-green-500 mr-1"></i>
          <span class="text-sm text-green-500">+2 from last month</span>
        </div>
      </div>
      
      <div class="bg-white p-6 rounded-lg shadow-md">
        <h4 class="text-sm font-medium text-gray-600 mb-2">Attendance Today</h4>
        <p class="text-3xl font-bold text-gray-900">94%</p>
        <div class="flex items-center mt-1">
          <i class="pi pi-arrow-up text-green-500 mr-1"></i>
          <span class="text-sm text-green-500">+3% from yesterday</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

const weeklyPerformance = ref([
  { name: 'Mon', value: 75 },
  { name: 'Tue', value: 85 },
  { name: 'Wed', value: 65 },
  { name: 'Thu', value: 90 },
  { name: 'Fri', value: 80 }
]);

const topStudents = ref([
  { id: 1, name: 'Student A', class: 'Grade 10A', score: 95, initials: 'SA' },
  { id: 2, name: 'Student B', class: 'Grade 9B', score: 88, initials: 'SB' },
  { id: 3, name: 'Student C', class: 'Grade 11C', score: 92, initials: 'SC' },
  { id: 4, name: 'Student D', class: 'Grade 12A', score: 85, initials: 'SD' }
]);
</script>

<style scoped>
/* Custom styles for the dashboard */
.bg-blue-50 {
  background-color: #eff6ff;
}

.bg-green-50 {
  background-color: #f0fdf4;
}

/* Smooth transitions for all interactive elements */
* {
  transition: all 0.2s ease-in-out;
}

/* Custom bar chart animation */
@keyframes growHeight {
  from {
    height: 0%;
  }
  to {
    height: var(--final-height);
  }
}

.bg-blue-500 {
  animation: growHeight 1s ease-out forwards;
}
</style>