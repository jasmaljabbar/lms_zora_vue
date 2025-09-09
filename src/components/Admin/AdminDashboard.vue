<!-- src/components/AdminDashboard.vue -->
<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="toggleMobileMenu"
      class="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside :class="[
      'fixed lg:static inset-y-0 left-0 z-30 w-64 bg-white shadow-md p-4 sm:p-6 flex flex-col transform transition-transform duration-300 ease-in-out lg:transform-none',
      isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
    ]">
      <!-- Logo and Close Button -->
      <div class="flex items-center justify-between mb-6 lg:mb-10">
        <span class="text-xl sm:text-2xl font-bold text-gray-800">LMS Admin</span>
        <button 
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-grow">
        <ul class="space-y-1 sm:space-y-2">
          <li>
            <router-link 
              to="/admin/dashboard" 
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-th-large mr-2 sm:mr-3 text-base sm:text-lg"></i>
              <span>Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/admin/schools" 
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-building mr-2 sm:mr-3 text-base sm:text-lg"></i>
              <span>Schools</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/admin/principals" 
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-user-plus mr-2 sm:mr-3 text-base sm:text-lg"></i>
              <span>Principals</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/admin/staff" 
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-users mr-2 sm:mr-3 text-base sm:text-lg"></i>
              <span>Staff</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/admin/teachers" 
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-id-card mr-2 sm:mr-3 text-base sm:text-lg"></i>
              <span>Teachers</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/admin/students" 
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-user   mr-2 sm:mr-3 text-base sm:text-lg"></i>
              <span>Students</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Logout Button -->
      <button 
        @click="logout" 
        class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 mt-4"
      >
        <i class="pi pi-sign-out mr-2 sm:mr-3 text-base sm:text-lg"></i>
        <span>Logout</span>
      </button>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm p-3 sm:p-4 flex justify-between items-center">
        <div class="flex items-center">
          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="lg:hidden p-2 mr-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800">Dashboard</h1>
        </div>
        
        <div class="flex items-center space-x-2 sm:space-x-4">
          <!-- Notification Button -->
          <button class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md">
            <i class="pi pi-bell text-lg sm:text-xl"></i>
          </button>
          
          <!-- User Avatar -->
          <div class="relative">
            <img 
              src="https://via.placeholder.com/40" 
              alt="User Avatar" 
              class="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all duration-200"
            >
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
        <router-view /> <!-- This will render sub-components like DashboardHome, AddPrincipal, SchoolList -->
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const isMobileMenuOpen = ref(false);

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenuOnNavigate = () => {
  isMobileMenuOpen.value = false;
};

const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user');
  router.push('/'); // Redirect to login page
};

// Close mobile menu when clicking outside or on escape key
const handleEscape = (e) => {
  if (e.key === 'Escape') {
    isMobileMenuOpen.value = false;
  }
};

// Close mobile menu on window resize to desktop size
const handleResize = () => {
  if (window.innerWidth >= 1024) { // lg breakpoint
    isMobileMenuOpen.value = false;
  }
};

onMounted(() => {
  document.addEventListener('keydown', handleEscape);
  window.addEventListener('resize', handleResize);
});

onUnmounted(() => {
  document.removeEventListener('keydown', handleEscape);
  window.removeEventListener('resize', handleResize);
});
</script>

<style scoped>
/* Active link styles */
.router-link-active {
  background-color: #ebf8ff; /* A light blue for active link */
  color: #2563eb; /* Primary blue for active link text */
  font-weight: 600;
}

/* Ensure sidebar doesn't interfere with main content on mobile */
@media (max-width: 1023px) {
  .main-content {
    margin-left: 0;
  }
}
</style>