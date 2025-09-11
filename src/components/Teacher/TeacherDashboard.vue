<!-- src/components/TeacherDashboard.vue -->
<template>
  <div class="flex min-h-screen bg-gray-100">
    <!-- Mobile Overlay -->
    <div 
      v-if="isMobileMenuOpen" 
      @click="toggleMobileMenu"
      class="fixed inset-0 z-30 bg-black bg-opacity-50 lg:hidden"
    ></div>

    <!-- Sidebar -->
    <aside
      :class="[
        'fixed inset-y-0 left-0 w-64 bg-white shadow-lg p-4 sm:p-6 flex flex-col z-40 transform transition-transform duration-300 ease-in-out',
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
      ]"
    >
      <!-- Logo with Mobile Close Button -->
      <div class="flex items-center justify-between mb-6 lg:mb-10">
        <span class="text-xl sm:text-2xl font-bold text-gray-800">LMS Teacher</span>
        <!-- Mobile Close Button -->
        <button
          @click="toggleMobileMenu"
          class="lg:hidden p-2 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-grow">
        <ul class="space-y-1 sm:space-y-2">
          <li>
            <router-link 
              to="/teacher/dashboard"
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-th-large mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
              <span class="truncate">Dashboard</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/teacher/subject"
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-book mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
              <span class="truncate">Subject</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/staff/subjects"
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-file-edit mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
              <span class="truncate">My Lesson Plan</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/staff/teachers"
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-chart-bar mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
              <span class="truncate">Manage Assessment</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/staff/students"
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-users mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
              <span class="truncate">Manage Assignments</span>
            </router-link>
          </li>
          <li>
            <router-link 
              to="/staff/academicsession"
              @click="closeMobileMenuOnNavigate"
              class="flex items-center p-2 sm:p-3 text-sm sm:text-base text-gray-700 hover:bg-blue-50 hover:text-blue-600 rounded-md transition-colors duration-200"
            >
              <i class="pi pi-stopwatch mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
              <span class="truncate">Schedule</span>
            </router-link>
          </li>
        </ul>
      </nav>

      <!-- Logout -->
      <button 
        @click="logout"
        class="flex items-center w-full p-2 sm:p-3 text-sm sm:text-base text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 mt-4"
      >
        <i class="pi pi-sign-out mr-2 sm:mr-3 text-base sm:text-lg flex-shrink-0"></i>
        <span class="truncate">Logout</span>
      </button>
    </aside>

    <!-- Main Content Area -->
    <div class="flex-1 flex flex-col lg:ml-64">
      <!-- Top Bar -->
      <header class="bg-white shadow-sm p-3 sm:p-4 flex justify-between items-center sticky top-0 z-20">
        <div class="flex items-center min-w-0 flex-1">
          <!-- Mobile Menu Button -->
          <button 
            @click="toggleMobileMenu"
            class="lg:hidden p-2 mr-2 sm:mr-3 rounded-md text-gray-600 hover:text-gray-800 hover:bg-gray-100 flex-shrink-0"
            aria-label="Toggle menu"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <h1 class="text-lg sm:text-xl font-semibold text-gray-800 truncate">Dashboard</h1>
        </div>
        
        <div class="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
          <!-- Notification Button -->
          <button 
            class="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-md"
            aria-label="Notifications"
          >
            <i class="pi pi-bell text-lg sm:text-xl"></i>
          </button>
          
          <!-- User Avatar -->
          <div class="relative">
            <button class="focus:outline-none focus:ring-2 focus:ring-blue-300 rounded-full">
              <img 
                src="https://via.placeholder.com/40" 
                alt="User Avatar" 
                class="w-8 h-8 sm:w-10 sm:h-10 rounded-full cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all duration-200"
              >
            </button>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
        <div class="max-w-full">
          <router-view /> <!-- This will render sub-components -->
        </div>
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
  background-color: #ebf8ff;
  color: #2563eb;
  font-weight: 600;
}

/* Smooth transitions for mobile menu */
.transform {
  transform: translateX(var(--tw-translate-x)) translateY(var(--tw-translate-y)) rotate(var(--tw-rotate)) skewX(var(--tw-skew-x)) skewY(var(--tw-skew-y)) scaleX(var(--tw-scale-x)) scaleY(var(--tw-scale-y));
}

/* Ensure proper stacking and positioning */
@media (max-width: 1023px) {
  /* Mobile specific adjustments */
  .main-content {
    margin-left: 0;
  }
}

/* Prevent body scroll when mobile menu is open */
body.menu-open {
  overflow: hidden;
}

/* Enhanced focus styles for accessibility */
button:focus,
a:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Improve touch targets on mobile */
@media (max-width: 640px) {
  button {
    min-height: 44px;
    min-width: 44px;
  }
  
  a {
    min-height: 44px;
  }
}
</style>