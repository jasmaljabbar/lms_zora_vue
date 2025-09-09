<!-- src/components/PrincipalNavigation.vue -->
<template>
  <nav class="bg-white shadow-sm border-b border-gray-200">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        <div class="flex">
          <!-- Logo -->
          <div class="flex-shrink-0 flex items-center">
            <span class="text-xl font-bold text-blue-600">Aeme High</span>
          </div>
          
          <!-- Navigation Links -->
          <div class="hidden sm:ml-6 sm:flex sm:space-x-8">
            <router-link 
              to="/principal/dashboard" 
              class="border-blue-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
              exact-active-class="border-blue-500 text-gray-900"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/principal/staff" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              Staff Management
            </router-link>
            <router-link 
              to="/principal/teachers" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              Teachers
            </router-link>
            <router-link 
              to="/principal/students" 
              class="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
              active-class="border-blue-500 text-gray-900"
            >
              Students
            </router-link>
          </div>
        </div>
        
        <!-- User Profile -->
        <div class="flex items-center">
          <div class="ml-3 relative">
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-700">Principal User</span>
              <div class="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <span class="text-blue-600 font-medium">P</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<script setup>
// Component logic here
</script>