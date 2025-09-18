<!-- src/components/CommonNavbar.vue -->
<template>
  <nav class="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <button 
      @click="goHome"
      class="flex items-center"
    >
      <!-- Logo -->
      <span class="text-xl font-semibold text-gray-800">LMS</span>
    </button>
    <div class="flex items-center space-x-4">
      <!-- Notifications -->
      <button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2">
        <i class="pi pi-bell text-lg"></i>
      </button>

      <!-- Calendar -->
      <button
        @click="goSchedule"
        class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2"
      >
        <i class="pi pi-calendar text-lg"></i>
      </button>

      <!-- Settings -->
      <button class="text-gray-500 hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-full p-2">
        <i class="pi pi-cog text-lg"></i>
      </button>

      <!-- User Profile -->
      <div class="relative flex items-center space-x-2">
        <button @click="toggleDropdown" class="flex items-center space-x-2 focus:outline-none">
          <!-- Show loading indicator while avatar is loading -->
          <div v-if="loading" class="w-8 h-8 bg-gray-200 rounded-full animate-pulse flex items-center justify-center">
            <i class="pi pi-spinner pi-spin text-gray-400 text-sm"></i>
          </div>
          <!-- Show avatar when loaded -->
          <img 
            v-else
            :src="getAvatarUrl()"
            :alt="`${profile.name || 'User'} Avatar`" 
            class="w-8 h-8 rounded-full object-cover cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all duration-200"
            @error="handleImageError"
            @load="handleImageLoad"
          >
          <!-- Fallback user icon -->
          <div 
            v-if="imageError" 
            class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center cursor-pointer hover:ring-2 hover:ring-blue-300 transition-all duration-200"
          >
            <i class="pi pi-user text-blue-600 text-sm"></i>
          </div>
          
          <span class="font-medium text-gray-700 hidden sm:block">{{ profile.name || user.name }}</span>
          <i class="pi pi-angle-down text-gray-500 text-sm hidden sm:block"></i>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="dropdownOpen"
          class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
        >
          <a @click="goProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Profile</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Settings</a>
          <a @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">Sign out</a>
        </div>
      </div>
    </div>
  </nav>

  <main class="flex-1 p-3 sm:p-4 lg:p-6 overflow-y-auto">
    <div class="max-w-full">
      <router-view /> <!-- This will render sub-components -->
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { api } from '@/api/axios';

const router = useRouter();

const user = ref({
  name: "User Name",
  avatar: "https://via.placeholder.com/150",
  role: "user",
});

const profile = ref({});
const loading = ref(false);
const imageError = ref(false);
const dropdownOpen = ref(false);

// Fetch user profile data
const fetchUser = async () => {
  loading.value = true;
  imageError.value = false;
  try {
    const userData = JSON.parse(localStorage.getItem('user'));
    if (!userData || !userData.id) {
      console.error('No user data found in localStorage');
      return;
    }
    
    
    
    const response = await api.get(`/student_profiles/${userData.id}`);
    profile.value = response.data || {};
    console.log('Profile data:', profile.value);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    // Set default profile data on error
    profile.value = {};
  } finally {
    loading.value = false;
  }
};

const getAvatarUrl = () => {
  // Return the avatar URL if it exists, otherwise return a placeholder
  if (profile.value.avatar_url) {
    return profile.value.avatar_url;
  }
  // Use UI Avatars to generate avatars based on name
  const name = profile.value.name || profile.value.email || 'User';
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=3b82f6&color=ffffff&size=150&rounded=true`;
};

const handleImageError = () => {
  console.error('Avatar image failed to load:', getAvatarUrl());
  imageError.value = true;
};

const handleImageLoad = () => {
  imageError.value = false;
};

const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

const closeDropdown = () => {
  dropdownOpen.value = false;
};

const logout = () => {
  localStorage.removeItem("access_token");
  localStorage.removeItem("user");
  closeDropdown();
  router.push("/"); // Redirect to login page
};

const goProfile = () => {
  router.push("/student/profile");
};

const goSchedule = () => {
  router.push("/student/schedule");
};

const goHome = () => {
  router.push("/student/dashboard");
};

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  const dropdown = document.querySelector(".relative");
  if (dropdown && !dropdown.contains(e.target)) {
    closeDropdown();
  }
};

onMounted(() => {
  document.addEventListener("click", handleClickOutside);
  fetchUser();
  
  // Load user from localStorage if available
  const userData = JSON.parse(localStorage.getItem("user"));
  if (userData?.username) {
    user.value.name = userData.username;
  }
});
</script>