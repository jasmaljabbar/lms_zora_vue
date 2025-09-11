<!-- src/components/Dashboard.vue -->
<template>
  <div class="space-y-6">
    <!-- Welcome Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
            Welcome back, {{ teacherName }}!
          </h2>
          <p class="text-gray-600">Here's what's happening in your classes today.</p>
        </div>
        <div class="mt-4 sm:mt-0 flex items-center space-x-2">
          <div class="bg-blue-100 rounded-full p-2">
            <i class="pi pi-user text-blue-600 text-xl"></i>
          </div>
          <span class="text-sm text-gray-500">{{ currentDate }}</span>
        </div>
      </div>
    </div>

    <!-- Task Cards Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Today's Tasks</h3>
        <button 
          @click="showAddTaskModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 flex items-center"
        >
          <i class="pi pi-plus mr-2"></i>
          Add Task
        </button>
      </div>

      <!-- Task Cards Grid -->
      <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div 
          v-for="task in tasks" 
          :key="task.id"
          class="bg-gradient-to-r p-4 rounded-lg border-l-4 transition-all duration-200 hover:shadow-md cursor-pointer"
          :class="task.completed ? 
            'from-green-50 to-green-100 border-green-500' : 
            task.priority === 'high' ? 'from-red-50 to-red-100 border-red-500' :
            task.priority === 'medium' ? 'from-yellow-50 to-yellow-100 border-yellow-500' :
            'from-blue-50 to-blue-100 border-blue-500'"
          @click="toggleTask(task.id)"
        >
          <div class="flex items-start justify-between">
            <div class="flex-1">
              <h4 class="font-medium text-gray-900 mb-1" :class="{ 'line-through text-gray-500': task.completed }">
                {{ task.title }}
              </h4>
              <p class="text-sm text-gray-600 mb-2">{{ task.description }}</p>
              <div class="flex items-center text-xs text-gray-500">
                <i class="pi pi-calendar mr-1"></i>
                {{ task.date }}
              </div>
            </div>
            <div class="ml-4">
              <div 
                class="w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-200"
                :class="task.completed ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-400 hover:bg-gray-300'"
              >
                <i class="pi pi-check text-xs"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Performance Chart Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <div class="flex items-center justify-between mb-6">
        <h3 class="text-lg font-semibold text-gray-900">Performance</h3>
        <select 
          v-model="performancePeriod"
          class="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="7">Last 7 days</option>
          <option value="30">Last 30 days</option>
          <option value="90">Last 90 days</option>
        </select>
      </div>

      <!-- Chart Container -->
      <div class="h-64 mb-4">
        <div class="flex items-end justify-between h-full space-x-2 px-4">
          <div 
            v-for="(data, index) in performanceData" 
            :key="index"
            class="flex flex-col items-center flex-1"
          >
            <div class="w-full bg-gray-200 rounded-t-lg relative overflow-hidden" :style="{ height: '200px' }">
              <div 
                class="absolute bottom-0 w-full bg-gradient-to-t from-purple-400 to-purple-300 rounded-t-lg transition-all duration-500 ease-out"
                :style="{ height: `${(data.value / 100) * 200}px` }"
              ></div>
              <!-- Value Label -->
              <div class="absolute top-2 left-0 right-0 text-center">
                <span class="text-xs font-medium text-gray-600">{{ data.value }}%</span>
              </div>
            </div>
            <span class="text-sm text-gray-600 mt-2">{{ data.grade }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Today's Timetable Section -->
    <div class="bg-white rounded-lg shadow-sm p-4 sm:p-6">
      <h3 class="text-lg font-semibold text-gray-900 mb-6">Today's Time Table</h3>
      
      <!-- Timetable Grid -->
      <div class="overflow-x-auto">
        <div class="grid grid-cols-4 gap-4 min-w-full">
          <div 
            v-for="slot in timetableSlots" 
            :key="slot.id"
            class="bg-gray-50 rounded-lg p-4 hover:shadow-md transition-all duration-200"
            :class="{
              'bg-blue-100 border-2 border-blue-300': slot.isActive,
              'bg-purple-100': slot.subject === 'Arabic'
            }"
          >
            <div class="text-center">
              <div class="text-xs text-gray-500 mb-2">{{ slot.time }}</div>
              <div class="font-medium text-gray-900 mb-1">{{ slot.subject }}</div>
              <div class="text-xs text-gray-600">{{ slot.class }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Quick Stats Cards -->
    <div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <div 
        v-for="stat in quickStats" 
        :key="stat.id"
        class="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow duration-200"
      >
        <div class="flex items-center">
          <div :class="`bg-${stat.color}-100 rounded-lg p-3`">
            <i :class="`pi ${stat.icon} text-${stat.color}-600 text-xl`"></i>
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-500">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Add Task Modal -->
    <div v-if="showAddTaskModal" class="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div class="bg-white rounded-lg shadow-xl p-6 w-full max-w-md mx-4">
        <h3 class="text-lg font-semibold text-gray-900 mb-4">Add New Task</h3>
        <form @submit.prevent="addTask">
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input 
                v-model="newTask.title"
                type="text" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task title"
              >
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea 
                v-model="newTask.description"
                rows="3"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter task description"
              ></textarea>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Priority</label>
              <select 
                v-model="newTask.priority"
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input 
                v-model="newTask.date"
                type="date" 
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
            </div>
          </div>
          <div class="flex justify-end space-x-3 mt-6">
            <button 
              type="button"
              @click="showAddTaskModal = false"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              Cancel
            </button>
            <button 
              type="submit"
              class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200"
            >
              Add Task
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';

// Reactive data
const teacherName = ref('Behzad Pashael');
const performancePeriod = ref('7');
const showAddTaskModal = ref(false);

// Current date
const currentDate = computed(() => {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
});

// Tasks data
const tasks = ref([
  {
    id: 1,
    title: 'Finish Maths Chapter 5 - Class 7A',
    description: 'Complete algebra problems and review with students',
    date: 'Today',
    priority: 'high',
    completed: true
  },
  {
    id: 2,
    title: 'Conduct Chapter 3 content test in Class 8B',
    description: 'Prepare test materials and conduct assessment',
    date: 'Tomorrow',
    priority: 'medium',
    completed: false
  },
  {
    id: 3,
    title: 'Conduct Chapter 3 content test in Class 8B',
    description: 'Review previous test results and plan next chapter',
    date: '2 Aug',
    priority: 'low',
    completed: false
  }
]);

// New task form data
const newTask = ref({
  title: '',
  description: '',
  date: '',
  priority: 'medium'
});

// Performance data
const performanceData = ref([
  { grade: '5th', value: 10 },
  { grade: '6th', value: 35 },
  { grade: '7th', value: 40 },
  { grade: '8th', value: 38 },
  { grade: '9th', value: 65 }
]);

// Timetable slots
const timetableSlots = ref([
  { id: 1, time: '08:00 - 09:00', subject: 'Maths', class: 'Class 7A', isActive: false },
  { id: 2, time: '09:00 - 10:00', subject: 'Arabic', class: 'Class 8B', isActive: true },
  { id: 3, time: '10:00 - 11:00', subject: 'Computer', class: 'Class 9A', isActive: false },
  { id: 4, time: '11:00 - 12:00', subject: 'EVS', class: 'Class 6B', isActive: false }
]);

// Quick stats
const quickStats = ref([
  { id: 1, label: 'Total Students', value: '245', icon: 'pi-users', color: 'blue' },
  { id: 2, label: 'Active Classes', value: '8', icon: 'pi-book', color: 'green' },
  { id: 3, label: 'Pending Tasks', value: '12', icon: 'pi-clock', color: 'yellow' },
  { id: 4, label: 'Completed Tests', value: '24', icon: 'pi-check-circle', color: 'purple' }
]);

// Methods
const toggleTask = (taskId) => {
  const task = tasks.value.find(t => t.id === taskId);
  if (task) {
    task.completed = !task.completed;
  }
};

const addTask = () => {
  if (newTask.value.title.trim()) {
    const task = {
      id: Date.now(),
      title: newTask.value.title,
      description: newTask.value.description,
      date: newTask.value.date,
      priority: newTask.value.priority,
      completed: false
    };
    tasks.value.push(task);
    
    // Reset form
    newTask.value = {
      title: '',
      description: '',
      date: '',
      priority: 'medium'
    };
    showAddTaskModal.value = false;
  }
};

// Set current time slot as active
onMounted(() => {
  const currentHour = new Date().getHours();
  timetableSlots.value.forEach(slot => {
    const slotHour = parseInt(slot.time.split(':')[0]);
    slot.isActive = currentHour >= slotHour && currentHour < slotHour + 1;
  });
});
</script>

<style scoped>
/* Custom animations for charts */
@keyframes slideUp {
  from {
    height: 0;
  }
  to {
    height: var(--final-height);
  }
}

/* Smooth hover effects */
.hover-lift:hover {
  transform: translateY(-2px);
}

/* Custom scrollbar for mobile */
::-webkit-scrollbar {
  height: 8px;
}

::-webkit-scrollbar-track {
  background: #f1f5f9;
}

::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* Focus states for accessibility */
button:focus,
input:focus,
select:focus,
textarea:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Card hover effects */
.card-hover:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
  transform: translateY(-2px);
}

/* Modal animation */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}
</style>