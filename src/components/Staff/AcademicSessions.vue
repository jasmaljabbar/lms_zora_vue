<!-- src/components/AcademicSessions.vue -->
<template>
  <div class="p-4 sm:p-6">
    <!-- Header Section -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
      <div>
        <h2 class="text-xl sm:text-2xl font-bold text-gray-900">Academic Sessions Management</h2>
        <p class="text-sm text-gray-600 mt-1">Manage all academic sessions in your system</p>
      </div>
      <button 
        @click="showCreateModal = true" 
        class="w-full sm:w-auto px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors duration-200 flex items-center justify-center"
      >
        <i class="pi pi-plus mr-2"></i>
        Add Session
      </button>
    </div>

    <!-- Search and Filters -->
    <div class="bg-white p-4 sm:p-6 rounded-lg shadow-md mb-6">
      <div class="flex flex-col sm:flex-row gap-4">
        <!-- Search Bar -->
        <div class="flex-1 relative">
          <label for="session-search" class="block text-sm font-medium text-gray-700 mb-2">Search Sessions</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i class="pi pi-search text-gray-400"></i>
            </div>
            <input
              id="session-search"
              v-model="searchQuery"
              type="text"
              placeholder="Search sessions by name..."
              class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
            />
            <button
              v-if="searchQuery"
              @click="clearSearch"
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <i class="pi pi-times text-gray-400 hover:text-gray-600"></i>
            </button>
          </div>
        </div>

        <!-- Status Filter -->
        <div class="relative">
          <label for="status-filter" class="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
          <select
            id="status-filter"
            v-model="selectedFilter"
            class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          >
            <option value="all">All Sessions</option>
            <option value="current">Current Sessions</option>
            <option value="upcoming">Upcoming Sessions</option>
            <option value="past">Past Sessions</option>
          </select>
        </div>
      </div>

      <!-- Results Summary -->
      <div class="mt-4 text-sm text-gray-600">
        Showing {{ filteredSessions.length }} of {{ sessions.length }} sessions
        <span v-if="searchQuery"> for "{{ searchQuery }}"</span>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="bg-white p-12 rounded-lg shadow-md text-center">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading academic sessions...</p>
    </div>

    <!-- Sessions Listing -->
    <div v-else class="bg-white rounded-lg shadow-md overflow-hidden">
      <!-- Mobile Card View -->
      <div class="block lg:hidden">
        <div class="p-4 sm:p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Academic Sessions</h3>
        </div>
        
        <div v-if="filteredSessions.length === 0" class="text-center py-12">
          <i class="pi pi-calendar text-4xl text-gray-300 mb-4"></i>
          <p class="text-gray-500 mb-2">
            {{ searchQuery ? 'No sessions found matching your search' : 'No sessions found' }}
          </p>
          <p class="text-sm text-gray-400">
            {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first academic session to get started' }}
          </p>
        </div>

        <div class="divide-y divide-gray-200">
          <div
            v-for="session in filteredSessions"
            :key="session.id"
            class="p-4 hover:bg-gray-50 transition-colors duration-200"
          >
            <!-- Session Header -->
            <div class="flex justify-between items-start mb-3">
              <div class="flex-1">
                <h4 class="font-semibold text-gray-900 text-lg">{{ session.name }}</h4>
                <p class="text-sm text-gray-600 mt-1">
                  {{ formatDate(session.start_date) }} - {{ formatDate(session.end_date) }}
                </p>
                <div class="flex items-center mt-2 space-x-2">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    session.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ session.is_current ? 'Current' : 'Inactive' }}
                  </span>
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getSessionStatus(session) === 'current' ? 'bg-blue-100 text-blue-800' : 
                    getSessionStatus(session) === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ getSessionStatus(session) }}
                  </span>
                </div>
              </div>
              <div class="flex space-x-2 ml-4">
                <button
                  @click="editSession(session)"
                  class="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200"
                  title="Edit Session"
                >
                  <i class="pi pi-pencil"></i>
                </button>
                <button
                  @click="confirmDelete(session)"
                  class="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
                  title="Delete Session"
                >
                  <i class="pi pi-trash"></i>
                </button>
              </div>
            </div>

            <!-- Session Details -->
            <div class="space-y-2 text-sm">
              <div class="flex items-center text-gray-600">
                <i class="pi pi-calendar mr-2"></i>
                <span>Duration: {{ getSessionDuration(session) }} days</span>
              </div>
              <div class="flex items-center text-gray-600">
                <i class="pi pi-clock mr-2"></i>
                <span>Created: {{ formatDateTime(session.created_at) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Desktop Table View -->
      <div class="hidden lg:block">
        <div class="p-6">
          <h3 class="text-lg font-semibold text-gray-800 mb-4">Academic Sessions</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Session Name
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Start Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  End Date
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Current
                </th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-if="filteredSessions.length === 0">
                <td colspan="7" class="px-6 py-12 text-center">
                  <i class="pi pi-calendar text-4xl text-gray-300 mb-4 block"></i>
                  <p class="text-gray-500 mb-2">
                    {{ searchQuery ? 'No sessions found matching your search' : 'No sessions found' }}
                  </p>
                  <p class="text-sm text-gray-400">
                    {{ searchQuery ? 'Try adjusting your search terms' : 'Add your first academic session to get started' }}
                  </p>
                </td>
              </tr>
              <tr
                v-for="session in filteredSessions"
                :key="session.id"
                class="hover:bg-gray-50 transition-colors duration-200"
              >
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ session.name }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(session.start_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ formatDate(session.end_date) }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm text-gray-500">{{ getSessionDuration(session) }} days</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    getSessionStatus(session) === 'current' ? 'bg-blue-100 text-blue-800' : 
                    getSessionStatus(session) === 'upcoming' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ getSessionStatus(session) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="[
                    'px-2 py-1 text-xs font-medium rounded-full',
                    session.is_current ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  ]">
                    {{ session.is_current ? 'Yes' : 'No' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div class="flex justify-end space-x-2">
                    <button
                      @click="editSession(session)"
                      class="px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 flex items-center"
                      title="Edit Session"
                    >
                      <i class="pi pi-pencil mr-1"></i>
                      Edit
                    </button>
                    <button
                      @click="confirmDelete(session)"
                      class="px-3 py-1 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 flex items-center"
                      title="Delete Session"
                    >
                      <i class="pi pi-trash mr-1"></i>
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Create/Edit Session Modal -->
    <SessionModal
      v-if="showCreateModal || showEditModal"
      :show="showCreateModal || showEditModal"
      :session-data="currentSession"
      :is-editing="showEditModal"
      :loading="updating"
      @close="closeModal"
      @submit="handleSessionSubmit"
    />

    <!-- Delete Confirmation Modal -->
    <DeleteConfirmation
      v-if="showDeleteModal"
      :show="showDeleteModal"
      :item="sessionToDelete"
      :loading="deleting"
      item-type="academic session"
      @confirm="deleteSession"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import {api,accapi} from '../../api/axios';
import { toast } from 'vue3-toastify';

// Import components
import SessionModal from './SessionModal.vue';
import DeleteConfirmation from '../Admin/DeleteConfirmation.vue';

// Data
const sessions = ref([]);
const searchQuery = ref('');
const selectedFilter = ref('all');
const loading = ref(false);
const updating = ref(false);
const deleting = ref(false);

// Modals
const showCreateModal = ref(false);
const showEditModal = ref(false);
const showDeleteModal = ref(false);

// Current items for editing
const currentSession = ref(null);
const sessionToDelete = ref(null);

// Computed property for filtered sessions
const filteredSessions = computed(() => {
  let filtered = sessions.value;

  // Apply search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase();
    filtered = filtered.filter(session => 
      session.name.toLowerCase().includes(query)
    );
  }

  // Apply status filter
  const now = new Date();
  if (selectedFilter.value === 'current') {
    filtered = filtered.filter(session => {
      const start = new Date(session.start_date);
      const end = new Date(session.end_date);
      return start <= now && end >= now;
    });
  } else if (selectedFilter.value === 'upcoming') {
    filtered = filtered.filter(session => new Date(session.start_date) > now);
  } else if (selectedFilter.value === 'past') {
    filtered = filtered.filter(session => new Date(session.end_date) < now);
  }

  return filtered;
});

const fetchSessions = async () => {
  loading.value = true;
  try {
    const response = await accapi.get('/academic-sessions/');
    sessions.value = response.data;
  } catch (error) {
    console.error('Error fetching academic sessions:', error);
    toast.error('Failed to load academic sessions');
  } finally {
    loading.value = false;
  }
};

const clearSearch = () => {
  searchQuery.value = '';
};

// Format date for display
const formatDate = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  } catch (error) {
    return dateString;
  }
};

// Format datetime for display
const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleString();
  } catch (error) {
    return dateString;
  }
};

// Get session duration in days
const getSessionDuration = (session) => {
  if (!session.start_date || !session.end_date) return 'N/A';
  
  try {
    const start = new Date(session.start_date);
    const end = new Date(session.end_date);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    return 'N/A';
  }
};

// Get session status (current, upcoming, past)
const getSessionStatus = (session) => {
  if (!session.start_date || !session.end_date) return 'unknown';
  
  try {
    const now = new Date();
    const start = new Date(session.start_date);
    const end = new Date(session.end_date);
    
    if (start <= now && end >= now) return 'current';
    if (start > now) return 'upcoming';
    return 'past';
  } catch (error) {
    return 'unknown';
  }
};

// Session operations
const createSession = async (sessionData) => {
  updating.value = true;
  try {
    const response = await accapi.post('/academic-sessions/', sessionData);
    sessions.value.push(response.data);
    toast.success('Academic session created successfully');
    closeModal();
  } catch (error) {
    console.error('Error creating session:', error);
    toast.error('Failed to create academic session');
    throw error;
  } finally {
    updating.value = false;
  }
};

const updateSession = async (sessionData) => {
  updating.value = true;
  try {
    const response = await accapi.put(`/academic-sessions/${sessionData.id}/`, sessionData);
    const index = sessions.value.findIndex(s => s.id === sessionData.id);
    if (index !== -1) {
      sessions.value[index] = response.data;
    }
    toast.success('Academic session updated successfully');
    closeModal();
  } catch (error) {
    console.error('Error updating session:', error);
    toast.error('Failed to update academic session');
    throw error;
  } finally {
    updating.value = false;
  }
};

const deleteSession = async () => {
  deleting.value = true;
  try {
    await accapi.delete(`/academic-sessions/${sessionToDelete.value.id}/`);
    sessions.value = sessions.value.filter(s => s.id !== sessionToDelete.value.id);
    toast.success('Academic session deleted successfully');
    showDeleteModal.value = false;
  } catch (error) {
    console.error('Error deleting session:', error);
    toast.error('Failed to delete academic session');
  } finally {
    deleting.value = false;
  }
};

// Modal handlers
const editSession = (session) => {
  currentSession.value = { ...session };
  showEditModal.value = true;
};

const confirmDelete = (session) => {
  sessionToDelete.value = session;
  showDeleteModal.value = true;
};

const closeModal = () => {
  showCreateModal.value = false;
  showEditModal.value = false;
  currentSession.value = null;
};

const cancelDelete = () => {
  showDeleteModal.value = false;
  sessionToDelete.value = null;
};

const handleSessionSubmit = async (sessionData) => {
  try {
    if (showEditModal.value) {
      await updateSession(sessionData);
    } else {
      await createSession(sessionData);
    }
  } catch (error) {
    // Error handling is done in the individual methods
  }
};

onMounted(() => {
  fetchSessions();
});
</script>