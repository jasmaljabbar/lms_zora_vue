<!-- src/components/DashboardHome.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header with responsive button -->
    <div class="flex flex-col sm:flex-row sm:justify-end mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
      <button @click="navigateToAddPrincipal" class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200">
        Add Principal
      </button>
    </div>

    <!-- Monthly Business Performance Chart -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6 sm:mb-8">
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">Monthly Business Performance</h3>
      
      <!-- Performance metrics - responsive layout -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
        <div class="mb-2 sm:mb-0">
          <p class="text-xl sm:text-2xl font-bold">$25,000 <span class="text-green-500 text-sm sm:text-base">+12%</span></p>
          <p class="text-gray-500 text-sm">This Month</p>
        </div>
      </div>
      
      <!-- Chart container - responsive height -->
      <div class="w-full h-32 sm:h-48 lg:h-64 bg-gray-100 flex items-center justify-center rounded-md mb-2">
        <p class="text-gray-400 text-xs sm:text-sm text-center px-2">Chart will go here (e.g., using Chart.js or ECharts)</p>
      </div>
      
      <!-- Month labels - responsive text size and spacing -->
      <div class="flex justify-between text-gray-500 text-xs sm:text-sm">
        <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span>
      </div>
    </div>

    <!-- Schools Listing -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md">
      <h3 class="text-base sm:text-lg font-semibold text-gray-800 mb-4">Latest Schools</h3>
      
      <!-- Mobile card view -->
      <div class="block sm:hidden space-y-4">
        <div v-if="schools.length === 0" class="text-center text-sm text-gray-500 py-8">
          No schools found.
        </div>
        <div v-for="school in schools" :key="school.id" class="bg-gray-50 p-4 rounded-lg border">
          <h4 class="font-semibold text-gray-900 mb-2">{{ school.name }}</h4>
          <div class="space-y-2 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-600">Principal:</span>
              <span class="text-gray-900">{{ school.principal_name || 'N/A' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Staff:</span>
              <span class="text-gray-900">{{ school.total_staff }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Teachers:</span>
              <span class="text-gray-900">{{ school.total_teachers }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-600">Students:</span>
              <span class="text-gray-900">{{ school.total_students }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop table view -->
      <div class="hidden sm:block overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SCHOOL NAME</th>
              <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">PRINCIPAL</th>
              <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STAFF</th>
              <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">TEACHERS</th>
              <th scope="col" class="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">STUDENTS</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-if="schools.length === 0">
              <td colspan="5" class="px-3 sm:px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500">
                No schools found.
              </td>
            </tr>
            <tr v-for="school in schools" :key="school.id" class="hover:bg-gray-50">
              <td class="px-3 sm:px-6 py-4 text-sm font-medium text-gray-900">
                <div class="truncate max-w-xs">{{ school.name }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 text-sm text-gray-500">
                <div class="truncate max-w-xs">{{ school.principal_name || 'N/A' }}</div>
              </td>
              <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ school.total_staff }}</td>
              <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ school.total_teachers }}</td>
              <td class="px-3 sm:px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ school.total_students }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../api/axios'; // Import your configured axios instance

const router = useRouter();
const schools = ref([]);

const fetchSchools = async () => {
  try {
    const response = await api.get('/school_last_five_profiles/');
    schools.value = response.data;
  } catch (error) {
    console.error('Error fetching schools:', error);
    // Handle error, e.g., show a toast message
  }
};

const navigateToAddPrincipal = () => {
  router.push('/admin/principals/add'); // Navigate to the add principal page
};

onMounted(() => {
  fetchSchools();
});
</script>

<style scoped>
/* Add any specific styles for DashboardHome here */
</style>