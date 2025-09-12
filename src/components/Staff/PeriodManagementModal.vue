 <!-- src/components/Staff/PeriodManagementModal.vue -->
<template>
  <el-dialog
    :model-value="show"
    title="Manage Periods"
    width="50%"
    :before-close="handleClose"
    append-to-body
  >
    <el-button type="primary" @click="openCreatePeriodDialog">Add New Period</el-button>

    <!-- Loading State for Periods -->
    <div v-if="loading" class="text-center py-8">
      <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p class="text-gray-500">Loading periods...</p>
    </div>

    <!-- Empty State -->
    <div v-else-if="!periodsData || periodsData.length === 0" class="text-center py-8">
      <p class="text-gray-500">No periods found</p>
    </div>

    <!-- Periods Table -->
    <div v-else class="mt-4">
      <el-table 
        :data="periodsData" 
        style="width: 100%"
        empty-text="No periods available"
        v-loading="loading"
      >
        <el-table-column prop="name" label="Period Name" min-width="120">
          <template #default="{ row }">
            <span>{{ row?.name || 'N/A' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Start Time" min-width="100">
          <template #default="{ row }">
            <span>{{ row ? formatTimeForDisplay(row.start_time) : 'N/A' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="End Time" min-width="100">
          <template #default="{ row }">
            <span>{{ row ? formatTimeForDisplay(row.end_time) : 'N/A' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column prop="order" label="Order" width="80">
          <template #default="{ row }">
            <span>{{ row?.order ?? 'N/A' }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="Break?" width="80" align="center">
          <template #default="{ row }">
            <el-tag v-if="row" :type="row.is_break ? 'warning' : 'success'" size="small">
              {{ row.is_break ? 'Yes' : 'No' }}
            </el-tag>
          </template>
        </el-table-column>
        
        <el-table-column label="Actions" width="180" align="center">
          <template #default="{ row }">
            <div v-if="row" class="flex space-x-2 justify-center">
              <el-button size="small" type="primary" @click="handleEdit(row)">
                Edit
              </el-button>
              <el-button size="small" type="danger" @click="handleDelete(row)">
                Delete
              </el-button>
            </div>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- Create/Edit Period Dialog -->
    <el-dialog
      v-model="showPeriodFormDialog"
      :title="isEditMode ? 'Edit Period' : 'Create Period'"
      width="40%"
      destroy-on-close
      append-to-body
    >
      <el-form 
        :model="currentPeriod" 
        ref="periodForm" 
        label-width="120px"
        :rules="formRules"
      >
        <el-form-item label="Period Name" prop="name">
          <el-input v-model="currentPeriod.name" placeholder="Enter period name"></el-input>
        </el-form-item>
        
        <el-form-item label="Start Time" prop="start_time">
          <el-time-picker
            v-model="currentPeriod.start_time"
            format="HH:mm"
            value-format="HH:mm:ss"
            placeholder="Select start time"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="End Time" prop="end_time">
          <el-time-picker
            v-model="currentPeriod.end_time"
            format="HH:mm"
            value-format="HH:mm:ss"
            placeholder="Select end time"
            style="width: 100%"
          />
        </el-form-item>
        
        <el-form-item label="Order" prop="order">
          <el-input-number 
            v-model="currentPeriod.order" 
            :min="0" 
            style="width: 100%"
            placeholder="Enter display order"
          />
        </el-form-item>
        
        <el-form-item label="Is Break?" prop="is_break">
          <el-checkbox v-model="currentPeriod.is_break">
            Mark this period as a break
          </el-checkbox>
        </el-form-item>
      </el-form>
      
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="closePeriodForm">Cancel</el-button>
          <el-button 
            type="primary" 
            @click="submitPeriodForm"
            :loading="submitting"
          >
            {{ isEditMode ? 'Update' : 'Create' }}
          </el-button>
        </div>
      </template>
    </el-dialog>
  </el-dialog>
</template>

<script setup>
import { ref, watch, computed, defineProps, defineEmits, nextTick } from 'vue';
import { accapi } from '@/api/axios';
import { toast } from 'vue3-toastify';

const props = defineProps({
  show: {
    type: Boolean,
    default: false,
  },
  periods: {
    type: Array,
    default: () => [],
  },
});

const emit = defineEmits(['close', 'refresh']);

// Reactive data
const loading = ref(false);
const submitting = ref(false);
const showPeriodFormDialog = ref(false);
const isEditMode = ref(false);
const currentPeriod = ref({
  name: '',
  start_time: '',
  end_time: '',
  order: 0,
  is_break: false,
});
const periodForm = ref(null);

// Form validation rules
const formRules = {
  name: [
    { required: true, message: 'Period name is required', trigger: 'blur' }
  ],
  start_time: [
    { required: true, message: 'Start time is required', trigger: 'change' }
  ],
  end_time: [
    { required: true, message: 'End time is required', trigger: 'change' }
  ],
  order: [
    { required: true, message: 'Order is required', trigger: 'blur' }
  ]
};

// Computed properties
const periodsData = computed(() => {
  const data = Array.isArray(props.periods) ? props.periods : [];
  console.log('Periods data in modal:', data);
  return data;
});

// Watchers
watch(() => props.show, (newVal) => {
  console.log('Modal show changed:', newVal);
  if (!newVal) {
    resetPeriodForm();
  }
});

// Methods
const handleClose = () => {
  console.log('Closing period modal');
  emit('close');
};

const openCreatePeriodDialog = () => {
  console.log('Opening create period dialog');
  isEditMode.value = false;
  resetPeriodForm();
  showPeriodFormDialog.value = true;
};

const handleEdit = (period) => {
  console.log('Editing period:', period);
  isEditMode.value = true;
  currentPeriod.value = { 
    ...period,
    start_time: formatTimeToString(period.start_time),
    end_time: formatTimeToString(period.end_time)
  };
  showPeriodFormDialog.value = true;
  nextTick(() => {
    if (periodForm.value) {
      periodForm.value.clearValidate();
    }
  });
};

const handleDelete = async (period) => {
  console.log('Deleting period:', period);
  try {
    await ElMessageBox.confirm(
      `Are you sure you want to delete period "${period.name}"?`,
      'Warning',
      {
        confirmButtonText: 'Delete',
        cancelButtonText: 'Cancel',
        type: 'warning',
      }
    );

    loading.value = true;
    await accapi.delete(`/periods/${period.id}`);
    toast.success('Period deleted successfully!');
    emit('refresh');
  } catch (error) {
    if (error !== 'cancel') {
      console.error('Error deleting period:', error);
      toast.error('Failed to delete period');
    }
  } finally {
    loading.value = false;
  }
};

const submitPeriodForm = async () => {
  if (!periodForm.value) return;

  try {
    submitting.value = true;
    // Validate form
    await periodForm.value.validate();

    // Prepare payload
    const payload = {
      name: currentPeriod.value.name,
      start_time: currentPeriod.value.start_time,
      end_time: currentPeriod.value.end_time,
      order: currentPeriod.value.order,
      is_break: currentPeriod.value.is_break
    };

    console.log('Submitting period:', payload);

    if (isEditMode.value) {
      await accapi.put(`/periods/${currentPeriod.value.id}`, payload);
      toast.success('Period updated successfully!');
    } else {
      await accapi.post('/periods/', payload);
      toast.success('Period created successfully!');
    }

    closePeriodForm();
    emit('refresh');
  } catch (error) {
    console.error('Error submitting period form:', error);
    if (error.response?.data?.errors) {
      toast.error('Please correct the form errors');
    } else {
      toast.error('Failed to save period');
    }
  } finally {
    submitting.value = false;
  }
};

const closePeriodForm = () => {
  showPeriodFormDialog.value = false;
  resetPeriodForm();
};

const resetPeriodForm = () => {
  currentPeriod.value = {
    name: '',
    start_time: '',
    end_time: '',
    order: 0,
    is_break: false,
  };
  nextTick(() => {
    if (periodForm.value) {
      periodForm.value.clearValidate();
    }
  });
};

// Helper function to format time string for time picker
const formatTimeToString = (timeString) => {
  if (!timeString) return '';
  
  // Handle different time formats
  if (timeString.includes('T')) {
    // ISO format like "2024-01-01T09:00:00.000Z"
    const date = new Date(timeString);
    return date.toTimeString().substr(0, 8); // HH:MM:SS
  }
  
  // Handle "HH:MM" or "HH:MM:SS" formats
  const parts = timeString.split(':');
  if (parts.length >= 2) {
    const hours = parts[0].padStart(2, '0');
    const minutes = parts[1].padStart(2, '0');
    const seconds = parts[2] ? parts[2].substr(0, 2).padStart(2, '0') : '00';
    return `${hours}:${minutes}:${seconds}`;
  }
  
  return timeString;
};

// Format time for display in table
const formatTimeForDisplay = (timeString) => {
  if (!timeString) return '';
  
  try {
    // Handle different time formats
    let hours, minutes;
    
    if (timeString.includes('T')) {
      // ISO format
      const date = new Date(timeString);
      hours = date.getHours().toString().padStart(2, '0');
      minutes = date.getMinutes().toString().padStart(2, '0');
    } else {
      // Handle "HH:MM" or "HH:MM:SS" formats
      const parts = timeString.split(':');
      if (parts.length >= 2) {
        hours = parts[0].padStart(2, '0');
        minutes = parts[1].padStart(2, '0');
      } else {
        return timeString; // Return as-is if can't parse
      }
    }
    
    return `${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting time:', error);
    return timeString;
  }
};
</script>

<style scoped>
.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.flex {
  display: flex;
}

.space-x-2 > * + * {
  margin-left: 0.5rem;
}

.justify-center {
  justify-content: center;
}
</style>