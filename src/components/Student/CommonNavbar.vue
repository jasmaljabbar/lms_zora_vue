<!-- src/components/CommonNavbar.vue -->
<template>
  <nav class="bg-white shadow-sm h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8">
    <button 
     @click="goHome"
    class="flex items-center">
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
          <img class="h-8 w-8 rounded-full object-cover" :src="user.avatar" :alt="user.name" />
          <span class="font-medium text-gray-700 hidden sm:block">{{ user.name }}</span>
          <i class="pi pi-angle-down text-gray-500 text-sm hidden sm:block"></i>
        </button>

        <!-- Dropdown Menu -->
        <div
          v-if="dropdownOpen"
          class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10"
        >
          <a @click="goProfile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Profile</a>
          <a href="#" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Settings</a>
          <a @click="logout" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">Sign out</a>
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
import { ref, onMounted, onBeforeUnmount } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();

const user = ref({
  name: "User Name",
  avatar: "https://via.placeholder.com/150",
  role: "user",
});

// ✅ Load user from localStorage if available
const student = JSON.parse(localStorage.getItem("user"));
if (student?.username) {
  user.value.name = student.username;
}

const dropdownOpen = ref(false);

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
  closeDropdown();
  router.push("/profile"); // Example route
};

// Close dropdown when clicking outside
const handleClickOutside = (e) => {
  const dropdown = document.querySelector(".relative");
  if (dropdown && !dropdown.contains(e.target)) {
    closeDropdown();
  }
};

const goSchedule = () => {
  router.push("/student/schedule");
};
const goHome = () => {
  router.push("/student/dashboard");
};


onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>
