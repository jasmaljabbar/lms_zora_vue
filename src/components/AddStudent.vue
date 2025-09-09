<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Student</h2>

    <form @submit.prevent="addStudent" class="space-y-6">
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
          <input type="password" id="password" v-model="form.password" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        
        <div>
          <label for="confirmPassword" class="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input type="password" id="confirmPassword" v-model="confirmPassword" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
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
          <label for="dateOfBirth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
          <input 
            type="date" 
            id="dateOfBirth" 
            v-model="form.date_of_birth" 
            required
            @blur="validateDateOfBirth"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': dobError }"
          >
          <p v-if="dobError" class="text-red-500 text-xs mt-1">{{ dobError }}</p>
        </div>
        
        <div>
          <label for="admissionDate" class="block text-sm font-medium text-gray-700">Admission Date</label>
          <input 
            type="date" 
            id="admissionDate" 
            v-model="form.admission_date" 
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
        </div>
        
        <div>
          <label for="guardianName" class="block text-sm font-medium text-gray-700">Guardian Name</label>
          <input type="text" id="guardianName" v-model="form.guardian_name" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        
        <div>
          <label for="guardianPhone" class="block text-sm font-medium text-gray-700">Guardian Phone</label>
          <input 
            type="text" 
            id="guardianPhone" 
            v-model="form.guardian_phone"
            required
            @blur="validateGuardianPhone"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            :class="{ 'border-red-500': guardianPhoneError }"
          >
          <p v-if="guardianPhoneError" class="text-red-500 text-xs mt-1">{{ guardianPhoneError }}</p>
          <p class="text-gray-500 text-xs mt-1">Enter 10-digit mobile number (e.g., 9876543210)</p>
        </div>
        
        <div>
          <label for="guardianRelation" class="block text-sm font-medium text-gray-700">Guardian Relation</label>
          <select
            id="guardianRelation"
            v-model="form.guardian_relation"
            required
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Relation</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Grandfather">Grandfather</option>
            <option value="Grandmother">Grandmother</option>
            <option value="Uncle">Uncle</option>
            <option value="Aunt">Aunt</option>
            <option value="Brother">Brother</option>
            <option value="Sister">Sister</option>
            <option value="Guardian">Legal Guardian</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>

      <div>
        <label for="addressLine1" class="block text-sm font-medium text-gray-700">Address</label>
        <textarea 
          id="addressLine1" 
          v-model="form.address_line1" 
          required
          rows="3"
          class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter complete address"
        ></textarea>
      </div>

      <p v-if="submitError" class="text-red-500 text-center">{{ submitError }}</p>
      <p v-if="submitSuccess" class="text-green-500 text-center">Student added successfully!</p>

      <div class="flex justify-end pt-4">
        <button type="button" @click="router.back()"
                class="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit"
                :disabled="!isFormValid"
                class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          Add Student
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, h, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import api from '../api/axios'
import { toast } from 'vue3-toastify'

const router = useRouter()

// Get today's date in YYYY-MM-DD format
const getTodayDate = () => {
  const today = new Date()
  return today.toISOString().split('T')[0]
}

const form = ref({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  date_of_birth: '',
  admission_date: getTodayDate(),
  guardian_name: '',
  address_line1: '',
  guardian_phone: '',
  guardian_relation: '',
})

const confirmPassword = ref('')
const submitError = ref('')
const submitSuccess = ref(false)

// Validation error states
const usernameError = ref('')
const emailError = ref('')
const guardianPhoneError = ref('')
const dobError = ref('')

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

const validateGuardianPhone = () => {
  const phone = form.value.guardian_phone.trim()
  
  if (!phone) {
    guardianPhoneError.value = 'Guardian phone is required'
    return false
  }
  
  // Indian mobile number format: 10 digits, starting with 6-9
  const phoneRegex = /^[6-9]\d{9}$/
  if (!phoneRegex.test(phone)) {
    guardianPhoneError.value = 'Please enter a valid 10-digit mobile number starting with 6-9'
    return false
  }
  
  guardianPhoneError.value = ''
  return true
}

const validateDateOfBirth = () => {
  const dob = form.value.date_of_birth
  
  if (!dob) {
    dobError.value = 'Date of birth is required'
    return false
  }
  
  const dobDate = new Date(dob)
  const today = new Date()
  
  if (dobDate >= today) {
    dobError.value = 'Date of birth must be in the past'
    return false
  }
  
  // Check if age is reasonable (between 3 and 25 years)
  const age = today.getFullYear() - dobDate.getFullYear()
  if (age < 3 || age > 25) {
    dobError.value = 'Please enter a valid date of birth (age should be between 3-25 years)'
    return false
  }
  
  dobError.value = ''
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
         !guardianPhoneError.value &&
         !dobError.value &&
         form.value.username &&
         form.value.email &&
         form.value.password &&
         form.value.first_name &&
         form.value.last_name &&
         form.value.date_of_birth &&
         form.value.admission_date &&
         form.value.guardian_name &&
         form.value.address_line1 &&
         form.value.guardian_phone &&
         form.value.guardian_relation &&
         confirmPassword.value
})

const addStudent = async () => {
  submitError.value = ''
  submitSuccess.value = false

  // Run all validations before submitting
  const isUsernameValid = validateUsername()
  const isEmailValid = validateEmail()
  const isGuardianPhoneValid = validateGuardianPhone()
  const isDobValid = validateDateOfBirth()

  if (!isUsernameValid || !isEmailValid || !isGuardianPhoneValid || !isDobValid) {
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
      date_of_birth: form.value.date_of_birth,
      admission_date: form.value.admission_date,
      guardian_name: form.value.guardian_name,
      address_line1: form.value.address_line1,
      guardian_phone: form.value.guardian_phone,
      guardian_relation: form.value.guardian_relation
    }

    const response = await api.post('student/', payload)
    console.log('Student added:', response.data)
    submitSuccess.value = true

    // Reset form
    Object.keys(form.value).forEach(key => {
      if (key === 'admission_date') {
        form.value[key] = getTodayDate()
      } else {
        form.value[key] = ''
      }
    })
    confirmPassword.value = ''
    
    // Reset validation errors
    usernameError.value = ''
    emailError.value = ''
    guardianPhoneError.value = ''
    dobError.value = ''
    
    router.push({
      path: '/principal/students',
      query: { success: 'true' }
    });

  } catch (error) {
    console.error('Error adding student:', error)
    if (error.response && error.response.data && error.response.data.detail) {
      submitError.value = Array.isArray(error.response.data.detail)
        ? error.response.data.detail.map(d => d.msg).join(', ')
        : error.response.data.detail
    } else {
      submitError.value = 'Failed to add student. Please try again.'
    }
  }
}
</script>