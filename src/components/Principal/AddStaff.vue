<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Staff</h2>

    <form @submit.prevent="addStaff" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input 
            type="text" 
            id="username" 
            v-model="form.username" 
            required
            @blur="validateUsername"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': usernameError }"
          >
          <p v-if="usernameError" class="text-red-500 text-xs mt-1">{{ usernameError }}</p>
          <p class="text-gray-500 text-xs mt-1">Username must be 3-20 characters, letters, numbers, and underscores only</p>
        </div>
        
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input 
            type="email" 
            id="email" 
            v-model="form.email" 
            required
            @blur="validateEmail"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': emailError }"
          >
          <p v-if="emailError" class="text-red-500 text-xs mt-1">{{ emailError }}</p>
        </div>
        
        <div>
          <label for="password" class="block text-sm font-medium text-gray-700">Password</label>
          <div class="relative mt-1">
            <input 
              :type="showPassword ? 'text' : 'password'" 
              id="password" 
              v-model="form.password" 
              placeholder="Password"
              required
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <button
              v-if="form.password"
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
              @click="showPassword = !showPassword"
            >
              <i :class="showPassword ? 'pi pi-eye-slash text-gray-400 hover:text-gray-600' : 'pi pi-eye text-gray-400 hover:text-gray-600'"></i>
            </button>
          </div>
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <div class="relative mt-1">
            <input 
              :type="showConfirmPassword ? 'text' : 'password'" 
              id="confirmPassword" 
              v-model="confirmPassword" 
              placeholder="Confirm Password"
              required
              class="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 pr-10 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            >
            <button
              v-if="confirmPassword"
              type="button"
              class="absolute inset-y-0 right-0 flex items-center pr-3"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              <i :class="showConfirmPassword ? 'pi pi-eye-slash text-gray-400 hover:text-gray-600' : 'pi pi-eye text-gray-400 hover:text-gray-600'"></i>
            </button>
          </div>
          <p v-if="passwordMismatch" class="text-red-500 text-xs mt-1">Passwords do not match.</p>
        </div>
        
        <div>
          <label for="firstName" class="block text-sm font-medium text-gray-700">First Name</label>
          <input type="text" id="firstName" v-model="form.first_name" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        
        <div>
          <label for="lastName" class="block text-sm font-medium text-gray-700">Last Name</label>
          <input type="text" id="lastName" v-model="form.last_name" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        
        <div>
          <label for="mobileNumber" class="block text-sm font-medium text-gray-700">Mobile Number</label>
          <input 
            type="text" 
            id="mobileNumber" 
            v-model="form.mobile_number"
            @blur="validatePhoneNumber"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': phoneError }"
          >
          <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
          <p class="text-gray-500 text-xs mt-1">Enter 10-digit mobile number (e.g., 9876543210)</p>
        </div>
        
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700">City</label>
          <input type="text" id="city" v-model="form.city"
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        
        <div>
          <label for="department" class="block text-sm font-medium text-gray-700">
            Department
          </label>
          <select
            id="department"
            v-model="form.department"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Department</option>
            <option value="administration">Administration</option>
            <option value="support">Support</option>
            <option value="maintenance">Maintenance</option>
            <option value="library">Library</option>
            <option value="sports">Sports</option>
            <option value="medical">Medical</option>
            <option value="transport">Transport</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <p v-if="submitError" class="text-red-500 text-center">{{ submitError }}</p>
      <p v-if="submitSuccess" class="text-green-500 text-center">Staff added successfully!</p>

      <div class="flex justify-end pt-4">
        <button type="button" @click="router.back()"
                class="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit"
                :disabled="!isFormValid"
                class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          Add Staff
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, h } from 'vue'
import { useRouter } from 'vue-router'
import api from '../../api/axios'
import { toast } from 'vue3-toastify'

const router = useRouter()

// Password visibility toggles
const showPassword = ref(false)
const showConfirmPassword = ref(false)

const form = ref({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  mobile_number: '',
  city: '',
  department: '',
})

const confirmPassword = ref('')
const submitError = ref('')
const submitSuccess = ref(false)

// Validation error states
const usernameError = ref('')
const emailError = ref('')
const phoneError = ref('')

// Validation functions
const validateUsername = () => {
  const username = form.value.username.trim()
  
  if (!username) {
    usernameError.value = 'Username is required'
    return false
  }
  
  if (username.length < 3) {
    usernameError.value = 'Username must be at least 3 characters long'
    return false
  }
  
  if (username.length > 20) {
    usernameError.value = 'Username must be less than 20 characters'
    return false
  }
  
  // Only letters, numbers, and underscores allowed
  const usernameRegex = /^[a-zA-Z0-9_]+$/
  if (!usernameRegex.test(username)) {
    usernameError.value = 'Username can only contain letters, numbers, and underscores'
    return false
  }
  
  usernameError.value = ''
  return true
}

const validateEmail = () => {
  const email = form.value.email.trim()
  
  if (!email) {
    emailError.value = 'Email is required'
    return false
  }
  
  // Email regex pattern
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) {
    emailError.value = 'Please enter a valid email address'
    return false
  }
  
  emailError.value = ''
  return true
}

const validatePhoneNumber = () => {
  const phone = form.value.mobile_number.trim()
  
  // Phone is optional, so if empty, it's valid
  if (!phone) {
    phoneError.value = ''
    return true
  }
  
  // Indian mobile number format: 10 digits, starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    phoneError.value = 'Please enter a valid 10-digit mobile number starting with 6-9'
    return false
  }
  
  phoneError.value = ''
  return true
}

// Computed properties
const passwordMismatch = computed(() => {
  return form.value.password !== confirmPassword.value && confirmPassword.value !== ''
})

const isFormValid = computed(() => {
  return !passwordMismatch.value && 
         !usernameError.value && 
         !emailError.value && 
         !phoneError.value &&
         form.value.username &&
         form.value.email &&
         form.value.password &&
         form.value.first_name &&
         form.value.last_name &&
         confirmPassword.value
})

const addStaff = async () => {
  submitError.value = ''
  submitSuccess.value = false

  // Run all validations before submitting
  const isUsernameValid = validateUsername()
  const isEmailValid = validateEmail()
  const isPhoneValid = validatePhoneNumber()

  if (!isUsernameValid || !isEmailValid || !isPhoneValid) {
    submitError.value = 'Please fix the validation errors above'
    return
  }

  if (passwordMismatch.value) {
    submitError.value = 'Passwords do not match.'
    return
  }

  try {
    const payload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mobile_number: form.value.mobile_number || null,
      city: form.value.city || null,
      department: form.value.department || null,
      hire_date: new Date().toISOString().slice(0, 19) 
    }

    const response = await api.post('staff/', payload)
    console.log('Staff added:', response.data)
    submitSuccess.value = true

    // Reset form
    Object.keys(form.value).forEach(key => (form.value[key] = ''))
    confirmPassword.value = ''
    
    // Reset validation errors
    usernameError.value = ''
    emailError.value = ''
    phoneError.value = ''
    
    // Reset password visibility toggles
    showPassword.value = false
    showConfirmPassword.value = false
    
    router.push({
      path: '/principal/staff',
      query: { success: 'true' }
    });

  } catch (error) {
    console.error('Error adding staff:', error)
    if (error.response && error.response.data && error.response.data.detail) {
      submitError.value = Array.isArray(error.response.data.detail)
        ? error.response.data.detail.map(d => d.msg).join(', ')
        : error.response.data.detail
    } else {
      submitError.value = 'Failed to add staff. Please try again.'
    }
  }
}
</script>