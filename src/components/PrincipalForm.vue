<!-- src/components/PrincipalForm.vue -->
<template>
  <div
    class="fixed inset-0 z-50 overflow-y-auto"
    aria-labelledby="modal-title"
    role="dialog"
    aria-modal="true"
  >
    <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" aria-hidden="true"></div>
      <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>
      
      <div class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
        <!-- Modal Header -->
        <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg leading-6 font-medium text-gray-900" id="modal-title">
              {{ isEditing ? 'Edit Principal' : 'Add Principal' }}
            </h3>
            <button
              @click="$emit('close')"
              class="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <i class="pi pi-times text-xl"></i>
            </button>
          </div>
        </div>

        <!-- Modal Body -->
        <form @submit.prevent="$emit('submit', formData)" class="p-4 sm:p-6">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            <!-- First Name -->
            <div>
              <label for="first-name" class="block text-sm font-medium text-gray-700 mb-2">
                First Name *
              </label>
              <input
                id="first-name"
                v-model="formData.first_name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.first_name }"
              />
              <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name[0] }}</p>
            </div>

            <!-- Last Name -->
            <div>
              <label for="last-name" class="block text-sm font-medium text-gray-700 mb-2">
                Last Name *
              </label>
              <input
                id="last-name"
                v-model="formData.last_name"
                type="text"
                required
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.last_name }"
              />
              <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name[0] }}</p>
            </div>

            <!-- Phone -->
            <div>
              <label for="phone" class="block text-sm font-medium text-gray-700 mb-2">
                Phone
              </label>
              <input
                id="phone"
                v-model="formData.phone_number"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.phone_number }"
              />
              <p v-if="errors.phone_number" class="mt-1 text-sm text-red-600">{{ errors.phone_number[0] }}</p>
            </div>

            <!-- Mobile Number -->
            <div>
              <label for="mobile" class="block text-sm font-medium text-gray-700 mb-2">
                Mobile Number
              </label>
              <input
                id="mobile"
                v-model="formData.mobile_number"
                type="tel"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.mobile_number }"
              />
              <p v-if="errors.mobile_number" class="mt-1 text-sm text-red-600">{{ errors.mobile_number[0] }}</p>
            </div>

            <!-- Gender -->
           <div>
            <label for="gender" class="block text-sm font-medium text-gray-700 mb-2">
              Gender *
            </label>
            <select
              id="gender"
              v-model="formData.gender"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-500': errors.gender }"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <p v-if="errors.gender" class="mt-1 text-sm text-red-600">
              {{ Array.isArray(errors.gender) ? errors.gender[0] : errors.gender }}
            </p>
          </div>

            <!-- Date of Birth -->
           <div>
            <label for="dob" class="block text-sm font-medium text-gray-700 mb-2">
              Date of Birth *
            </label>
            <input
              id="dob"
              v-model="formData.date_of_birth"
              type="date"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              :class="{ 'border-red-500': errors.date_of_birth }"
            />
            <p v-if="errors.date_of_birth" class="mt-1 text-sm text-red-600">
              {{ Array.isArray(errors.date_of_birth) ? errors.date_of_birth[0] : errors.date_of_birth }}
            </p>
          </div>

            <!-- Address Line 1 -->
            <div class="sm:col-span-2">
              <label for="address1" class="block text-sm font-medium text-gray-700 mb-2">
                Address Line 1
              </label>
              <input
                id="address1"
                v-model="formData.address_line1"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.address_line1 }"
              />
              <p v-if="errors.address_line1" class="mt-1 text-sm text-red-600">{{ errors.address_line1[0] }}</p>
            </div>

            <!-- Address Line 2 -->
            <div class="sm:col-span-2">
              <label for="address2" class="block text-sm font-medium text-gray-700 mb-2">
                Address Line 2
              </label>
              <input
                id="address2"
                v-model="formData.address_line2"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.address_line2 }"
              />
              <p v-if="errors.address_line2" class="mt-1 text-sm text-red-600">{{ errors.address_line2[0] }}</p>
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              <input
                id="city"
                v-model="formData.city"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.city }"
              />
              <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city[0] }}</p>
            </div>

            <!-- State -->
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700 mb-2">
                State
              </label>
              <input
                id="state"
                v-model="formData.state"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.state }"
              />
              <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state[0] }}</p>
            </div>

            <!-- Country -->
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700 mb-2">
                Country
              </label>
              <input
                id="country"
                v-model="formData.country"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.country }"
              />
              <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country[0] }}</p>
            </div>

            <!-- Postal Code -->
            <div>
              <label for="postal" class="block text-sm font-medium text-gray-700 mb-2">
                Postal Code
              </label>
              <input
                id="postal"
                v-model="formData.postal_code"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                :class="{ 'border-red-500': errors.postal_code }"
              />
              <p v-if="errors.postal_code" class="mt-1 text-sm text-red-600">{{ errors.postal_code[0] }}</p>
            </div>

            <!-- Years of Experience -->
            <div>
              <label for="experience" class="block text-sm font-medium text-gray-700 mb-2">
                Years of Experience
              </label>
              <input
                id="experience"
                v-model="formData.years_of_experience"
                type="number"
                min="0"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <!-- Qualification -->
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700 mb-2">
                Qualification
              </label>
              <input
                id="qualification"
                v-model="formData.qualification"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <!-- Office Number -->
            <div>
              <label for="office" class="block text-sm font-medium text-gray-700 mb-2">
                Office Number
              </label>
              <input
                id="office"
                v-model="formData.office_number"
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            <!-- Status -->
            <div v-if="isEditing">
              <label for="status" class="block text-sm font-medium text-gray-700 mb-2">
                Status
              </label>
              <select
                id="status"
                v-model="formData.is_active_principal"
                class="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>
          </div>

          <!-- Modal Footer -->
          <div class="mt-6 flex flex-col sm:flex-row-reverse gap-3">
            <button
              type="submit"
              :disabled="loading"
              class="w-full sm:w-auto inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              <div v-if="loading" class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              {{ loading ? (isEditing ? 'Updating...' : 'Creating...') : (isEditing ? 'Update Principal' : 'Create Principal') }}
            </button>
            <button
              type="button"
              @click="$emit('close')"
              :disabled="loading"
              class="w-full sm:w-auto inline-flex justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-base font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from 'vue';

const props = defineProps({
  show: Boolean,
  principal: Object,
  errors: Object,
  loading: Boolean,
  isEditing: Boolean
});

const emit = defineEmits(['close', 'submit']);

const formData = computed(() => {
  return props.principal || {
    first_name: '',
    last_name: '',
    gender: '',
    date_of_birth: '',
    phone_number: '',
    mobile_number: '',
    address_line1: '',
    address_line2: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    years_of_experience: '',
    qualification: '',
    office_number: '',
    is_active_principal: true
  };
});
</script>