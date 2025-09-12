<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Teacher</h2>

    <form @submit.prevent="addTeacher" class="space-y-6">
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
            Department/Subject
          </label>
          <select
            id="department"
            v-model="form.department"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 
                focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select Department/Subject</option>
            <option value="mathematics">Mathematics</option>
            <option value="english">English</option>
            <option value="science">Science</option>
            <option value="physics">Physics</option>
            <option value="chemistry">Chemistry</option>
            <option value="biology">Biology</option>
            <option value="history">History</option>
            <option value="geography">Geography</option>
            <option value="computer_science">Computer Science</option>
            <option value="physical_education">Physical Education</option>
            <option value="art">Art</option>
            <option value="music">Music</option>
            <option value="languages">Languages</option>
            <option value="social_studies">Social Studies</option>
            <option value="economics">Economics</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label for="qualification" class="block text-sm font-medium text-gray-700">
            Qualification <span class="text-red-500">*</span>
          </label>
          <input 
            type="text" 
            id="qualification" 
            v-model="form.qualification" 
            required
            placeholder="e.g., B.Ed, M.A Mathematics, B.Sc Physics"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          <p class="text-gray-500 text-xs mt-1">Enter highest educational qualification</p>
        </div>
        
        <div>
          <label for="yearsOfExperience" class="block text-sm font-medium text-gray-700">
            Years of Experience <span class="text-red-500">*</span>
          </label>
          <input 
            type="number" 
            id="yearsOfExperience" 
            v-model.number="form.years_of_experience" 
            required
            min="0"
            max="50"
            class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
          <p class="text-gray-500 text-xs mt-1">Enter total years of teaching experience (0 for fresh graduates)</p>
        </div>
      </div>

      <p v-if="submitError" class="text-red-500 text-center">{{ submitError }}</p>
      <p v-if="submitSuccess" class="text-green-500 text-center">Teacher added successfully!</p>

      <div class="flex justify-end pt-4">
        <button type="button" @click="router.back()"
                class="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit"
                :disabled="!isFormValid"
                class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          Add Teacher
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

const form = ref({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  mobile_number: '',
  city: '',
  department: '',
  qualification: '',
  years_of_experience: 0
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
         form.value.qualification &&
         (form.value.years_of_experience >= 0) &&
         confirmPassword.value
})
const getuserrole = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  console.log(user.roles,'user roles');
  
  return user?.roles;
};

const addTeacher = async () => {
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

  if (!form.value.qualification.trim()) {
    submitError.value = 'Qualification is required.'
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
      qualification: form.value.qualification,
      years_of_experience: form.value.years_of_experience
    }

    const response = await api.post('/teacher/', payload)
    console.log('Teacher added:', response.data)
    submitSuccess.value = true

    // Reset form
    Object.keys(form.value).forEach(key => {
      if (key === 'years_of_experience') {
        form.value[key] = 0
      } else {
        form.value[key] = ''
      }
    })
    confirmPassword.value = ''
    
    // Reset validation errors
    usernameError.value = ''
    emailError.value = ''
    phoneError.value = ''
    
    // Show success toast
    toast.success('Teacher added successfully!', {
      position: 'top-right',
      timeout: 3000
    })
    // Navigate back to teachers list
    const userrole = getuserrole();
    if (userrole && userrole.includes('principal')) {
      router.push({path:'/principal/teachers',query: { success: 'true' }});
      return;
    }else{
      router.push({
        path: '/staff/teachers',
        query: { success: 'true' }
      });
    }

  } catch (error) {
    console.error('Error adding teacher:', error)
    if (error.response && error.response.data) {
      // Handle different error response formats
      if (error.response.data.detail) {
        submitError.value = Array.isArray(error.response.data.detail)
          ? error.response.data.detail.map(d => d.msg || d).join(', ')
          : error.response.data.detail
      } else if (error.response.data.message) {
        submitError.value = error.response.data.message
      } else if (typeof error.response.data === 'string') {
        submitError.value = error.response.data
      } else {
        submitError.value = 'Failed to add teacher. Please check all fields and try again.'
      }
    } else {
      submitError.value = 'Failed to add teacher. Please try again.'
    }
  }
}
</script>