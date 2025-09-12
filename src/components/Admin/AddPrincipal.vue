<!-- src/components/AddPrincipal.vue -->
<template>
  <div class="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md">
    <h2 class="text-2xl font-bold text-gray-800 mb-6">Add New Principal</h2>

    <form @submit.prevent="addPrincipal" class="space-y-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label for="username" class="block text-sm font-medium text-gray-700">Username</label>
          <input type="text" id="username" v-model="form.username" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
          <input type="email" id="email" v-model="form.email" required
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
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
          <input type="text" id="mobileNumber" v-model="form.mobile_number"
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="city" class="block text-sm font-medium text-gray-700">City</label>
          <input type="text" id="city" v-model="form.city"
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="officeNumber" class="block text-sm font-medium text-gray-700">Office Number</label>
          <input type="text" id="officeNumber" v-model="form.office_number"
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
        <div>
          <label for="schoolName" class="block text-sm font-medium text-gray-700">School Name</label>
          <input type="text" id="schoolName" v-model="form.school_name"
                 class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500">
        </div>
      </div>

      <p v-if="submitError" class="text-red-500 text-center">{{ submitError }}</p>
      <p v-if="submitSuccess" class="text-green-500 text-center">Principal added successfully!</p>

      <div class="flex justify-end pt-4">
        <button type="button" @click="router.back()"
                class="mr-4 px-6 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          Cancel
        </button>
        <button type="submit"
                :disabled="passwordMismatch"
                class="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed">
          Add Principal
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import api from '../../api/axios'; // Import your configured axios instance

const router = useRouter();

const form = ref({
  username: '',
  email: '',
  password: '',
  first_name: '',
  last_name: '',
  mobile_number: '',
  city: '',
  office_number: '',
  school_name: '',
});

const confirmPassword = ref('');
const submitError = ref('');
const submitSuccess = ref(false);

const passwordMismatch = computed(() => form.value.password !== confirmPassword.value);

const addPrincipal = async () => {
  submitError.value = '';
  submitSuccess.value = false;

  if (passwordMismatch.value) {
    submitError.value = 'Passwords do not match.';
    return;
  }

  try {
    // The API expects a 'string' for school_name, not an ID or object, based on your provided data structure
    const payload = {
      username: form.value.username,
      email: form.value.email,
      password: form.value.password,
      first_name: form.value.first_name,
      last_name: form.value.last_name,
      mobile_number: form.value.mobile_number || null, // API expects null if not provided
      city: form.value.city || null,
      office_number: form.value.office_number || null,
      school_name: form.value.school_name || null // Ensure this matches your backend expectation (string name or ID)
    };

    const response = await api.post('http://127.0.0.1:8001/principal/', payload);
    console.log('Principal added:', response.data);
    submitSuccess.value = true;
    router.push('/admin/principals');
    // Optionally, clear the form after successful submission
    Object.keys(form.value).forEach(key => (form.value[key] = ''));
    confirmPassword.value = '';

    // Optionally, navigate back to the dashboard or principals list
    // router.push('/admin/principals');

  } catch (error) {
    console.error('Error adding principal:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      submitError.value = Array.isArray(error.response.data.detail)
        ? error.response.data.detail.map(d => d.msg).join(', ')
        : error.response.data.detail;
    } else {
      submitError.value = 'Failed to add principal. Please try again.';
    }
  }
};
</script>

<style scoped>
/* Add any specific styles for AddPrincipal here */
</style>