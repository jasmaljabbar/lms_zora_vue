<!-- src/components/StudentForm.vue -->
<template>
    <div v-if="show" class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
        <div
            class="relative top-10 mx-auto p-5 border w-11/12 md:w-4/5 lg:w-3/4 xl:w-2/3 shadow-lg rounded-md bg-white max-h-[90vh] overflow-y-auto">
            <!-- Modal Header -->
            <div class="flex items-center justify-between pb-4 border-b border-gray-200 sticky top-0 bg-white z-10">
                <h3 class="text-lg font-medium text-gray-900">
                    {{ isEditing ? 'Edit Student' : 'Add Student' }}
                </h3>
                <button @click="$emit('close')" class="text-gray-400 hover:text-gray-600 focus:outline-none">
                    <i class="pi pi-times text-xl"></i>
                </button>
            </div>

            <!-- Form Content -->
            <form @submit.prevent="$emit('submit')" class="mt-6 space-y-6">
                <!-- Personal Information Section -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Personal Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- First Name -->
                        <div>
                            <label for="first_name" class="block text-sm font-medium text-gray-700">
                                First Name *
                            </label>
                            <input id="first_name" v-model="student.first_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.first_name }">
                            <p v-if="errors.first_name" class="mt-1 text-sm text-red-600">{{ errors.first_name[0] }}</p>
                        </div>

                        <!-- Last Name -->
                        <div>
                            <label for="last_name" class="block text-sm font-medium text-gray-700">
                                Last Name *
                            </label>
                            <input id="last_name" v-model="student.last_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.last_name }">
                            <p v-if="errors.last_name" class="mt-1 text-sm text-red-600">{{ errors.last_name[0] }}</p>
                        </div>

                        <!-- Gender -->
                        <div>
                            <label for="gender" class="block text-sm font-medium text-gray-700">
                                Gender*
                            </label>
                            <select id="gender" v-model="student.gender" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.gender }">
                                <option value="">Select Gender</option>
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            <p v-if="errors.gender" class="mt-1 text-sm text-red-600">{{ errors.gender[0] }}</p>
                        </div>

                        <!-- Date of Birth -->
                        <div>
                            <label for="date_of_birth" class="block text-sm font-medium text-gray-700">
                                Date of Birth*
                            </label>
                            <input id="date_of_birth" v-model="student.date_of_birth" required type="date"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.date_of_birth }">
                            <p v-if="errors.date_of_birth" class="mt-1 text-sm text-red-600">{{ errors.date_of_birth[0]
                            }}</p>
                        </div>

                        <!-- Bio -->
                        <div class="md:col-span-2">
                            <label for="bio" class="block text-sm font-medium text-gray-700">
                                Bio
                            </label>
                            <textarea id="bio" v-model="student.bio" rows="3"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.bio }"
                                placeholder="Brief description about the student"></textarea>
                            <p v-if="errors.bio" class="mt-1 text-sm text-red-600">{{ errors.bio[0] }}</p>
                        </div>
                    </div>
                </div>

                <!-- Academic Information Section -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Academic Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Admission Date - Fixed Version -->
                        <div>
                            <label for="admission_date" class="block text-sm font-medium text-gray-700">
                                Admission Date*
                            </label>
                            <input id="admission_date" :value="formatDateTimeLocal(student.admission_date)"
                                @input="updateAdmissionDate($event.target.value)" type="datetime-local" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.admission_date }">
                            <p v-if="errors.admission_date" class="mt-1 text-sm text-red-600">{{
                                errors.admission_date[0] }}</p>
                            <!-- Debug info (remove in production) -->
                            <p class="mt-1 text-xs text-gray-400">
                                Debug: {{ student.admission_date }} → {{ formatDateTimeLocal(student.admission_date) }}
                            </p>
                        </div>

                        <!-- Academic Year -->
                        <div>
                            <label for="academic_year" class="block text-sm font-medium text-gray-700">
                                Academic Year*
                            </label>
                            <input id="academic_year" v-model.number="student.academic_year" type="number" min="1"
                                max="12" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.academic_year }" placeholder="e.g., 10">
                            <p v-if="errors.academic_year" class="mt-1 text-sm text-red-600">{{ errors.academic_year[0]
                                }}</p>
                        </div>

                        <!-- Previous School -->
                        <div class="md:col-span-2">
                            <label for="previous_school" class="block text-sm font-medium text-gray-700">
                                Previous School
                            </label>
                            <input id="previous_school" v-model="student.previous_school" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.previous_school }"
                                placeholder="Name of previous school (if any)">
                            <p v-if="errors.previous_school" class="mt-1 text-sm text-red-600">{{
                                errors.previous_school[0] }}</p>
                        </div>
                    </div>
                </div>

                <!-- Guardian Information Section -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Guardian Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Guardian Name -->
                        <div>
                            <label for="guardian_name" class="block text-sm font-medium text-gray-700">
                                Guardian Name*
                            </label>
                            <input id="guardian_name" v-model="student.guardian_name" type="text" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.guardian_name }">
                            <p v-if="errors.guardian_name" class="mt-1 text-sm text-red-600">{{ errors.guardian_name[0]
                                }}</p>
                        </div>

                        <!-- Guardian Phone -->
                        <div>
                            <label for="guardian_phone" class="block text-sm font-medium text-gray-700">
                                Guardian Phone*
                            </label>
                            <input id="guardian_phone" v-model="student.guardian_phone" type="tel" required
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.guardian_phone }" placeholder="e.g., 9876543210">
                            <p v-if="errors.guardian_phone" class="mt-1 text-sm text-red-600">{{
                                errors.guardian_phone[0] }}</p>
                        </div>

                        <!-- Guardian Relation -->
                        <div>
                            <label for="guardian_relation" class="block text-sm font-medium text-gray-700">
                                Guardian Relation*
                            </label>

                            <select id="guardian_relation" v-model="student.guardian_relation" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm 
           focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.guardian_relation }">
                                <option value="">Select Relation</option>
                                <option value="father">Father</option>
                                <option value="mother">Mother</option>
                                <option value="grandfather">Grandfather</option>
                                <option value="grandmother">Grandmother</option>
                                <option value="uncle">Uncle</option>
                                <option value="aunt">Aunt</option>
                                <option value="brother">Brother</option>
                                <option value="sister">Sister</option>
                                <option value="guardian">Legal Guardian</option>
                                <option value="other">Other</option>
                            </select>

                            <p v-if="errors.guardian_relation" class="mt-1 text-sm text-red-600">
                                {{ errors.guardian_relation[0] }}
                            </p>
                        </div>

                    </div>
                </div>

                <!-- Contact Information Section -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Contact Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Phone Number -->
                        <div>
                            <label for="phone_number" class="block text-sm font-medium text-gray-700">
                                Phone Number
                            </label>
                            <input id="phone_number" v-model="student.phone_number" type="tel"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.phone_number }" placeholder="e.g., +91 1234567890">
                            <p v-if="errors.phone_number" class="mt-1 text-sm text-red-600">{{ errors.phone_number[0] }}
                            </p>
                        </div>

                        <!-- Mobile Number -->
                        <div>
                            <label for="mobile_number" class="block text-sm font-medium text-gray-700">
                                Mobile Number
                            </label>
                            <input id="mobile_number" v-model="student.mobile_number" type="tel"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.mobile_number }" placeholder="e.g., +91 9876543210">
                            <p v-if="errors.mobile_number" class="mt-1 text-sm text-red-600">{{ errors.mobile_number[0]
                            }}</p>
                        </div>
                    </div>
                </div>

                <!-- Address Information Section -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Address Information</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <!-- Address Line 1 -->
                        <div class="md:col-span-2">
                            <label for="address_line1" class="block text-sm font-medium text-gray-700">
                                Address Line 1
                            </label>
                            <input id="address_line1" v-model="student.address_line1" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.address_line1 }"
                                placeholder="Street address, apartment, etc.">
                            <p v-if="errors.address_line1" class="mt-1 text-sm text-red-600">{{ errors.address_line1[0]
                            }}</p>
                        </div>

                        <!-- Address Line 2 -->
                        <div class="md:col-span-2">
                            <label for="address_line2" class="block text-sm font-medium text-gray-700">
                                Address Line 2
                            </label>
                            <input id="address_line2" v-model="student.address_line2" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.address_line2 }"
                                placeholder="Additional address information">
                            <p v-if="errors.address_line2" class="mt-1 text-sm text-red-600">{{ errors.address_line2[0]
                            }}</p>
                        </div>

                        <!-- City -->
                        <div>
                            <label for="city" class="block text-sm font-medium text-gray-700">
                                City
                            </label>
                            <input id="city" v-model="student.city" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.city }" placeholder="e.g., Mumbai">
                            <p v-if="errors.city" class="mt-1 text-sm text-red-600">{{ errors.city[0] }}</p>
                        </div>

                        <!-- State -->
                        <div>
                            <label for="state" class="block text-sm font-medium text-gray-700">
                                State
                            </label>
                            <input id="state" v-model="student.state" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.state }" placeholder="e.g., Maharashtra">
                            <p v-if="errors.state" class="mt-1 text-sm text-red-600">{{ errors.state[0] }}</p>
                        </div>

                        <!-- Country -->
                        <div>
                            <label for="country" class="block text-sm font-medium text-gray-700">
                                Country
                            </label>
                            <input id="country" v-model="student.country" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.country }" placeholder="e.g., India">
                            <p v-if="errors.country" class="mt-1 text-sm text-red-600">{{ errors.country[0] }}</p>
                        </div>

                        <!-- Postal Code -->
                        <div>
                            <label for="postal_code" class="block text-sm font-medium text-gray-700">
                                Postal Code
                            </label>
                            <input id="postal_code" v-model="student.postal_code" type="text"
                                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                :class="{ 'border-red-500': errors.postal_code }" placeholder="e.g., 400001">
                            <p v-if="errors.postal_code" class="mt-1 text-sm text-red-600">{{ errors.postal_code[0] }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Status Section -->
                <div class="bg-gray-50 p-4 rounded-lg">
                    <h4 class="text-md font-medium text-gray-900 mb-4">Status</h4>
                    <div class="flex items-center">
                        <input id="is_active_student" v-model="student.is_active_student" type="checkbox"
                            class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                        <label for="is_active_student" class="ml-2 block text-sm text-gray-700">
                            Active Student
                        </label>
                    </div>
                    <p class="mt-1 text-sm text-gray-500">
                        Inactive students won't be able to access the system
                    </p>
                </div>

                <!-- Form Actions -->
                <div
                    class="pt-4 border-t border-gray-200 flex items-center justify-end space-x-3 sticky bottom-0 bg-white">
                    <button type="button" @click="$emit('close')"
                        class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Cancel
                    </button>
                    <button type="submit" :disabled="loading"
                        class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed">
                        <div v-if="loading" class="flex items-center">
                            <div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                            {{ isEditing ? 'Updating...' : 'Creating...' }}
                        </div>
                        <span v-else>
                            {{ isEditing ? 'Update Student' : 'Create Student' }}
                        </span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
const emit = defineEmits(['close', 'submit']);

const props = defineProps({
    show: {
        type: Boolean,
        default: false
    },
    student: {
        type: Object,
        required: true
    },
    errors: {
        type: Object,
        default: () => ({})
    },
    loading: {
        type: Boolean,
        default: false
    },
    isEditing: {
        type: Boolean,
        default: false
    }
});

// Helper function to format date for datetime-local input
const formatDateTimeLocal = (dateValue) => {
    if (!dateValue) return '';

    try {
        let date;

        // Handle different date formats
        if (typeof dateValue === 'string') {
            // Handle various string formats
            date = new Date(dateValue);
        } else if (dateValue instanceof Date) {
            date = dateValue;
        } else {
            return '';
        }

        // Check if date is valid
        if (isNaN(date.getTime())) {
            console.warn('Invalid date:', dateValue);
            return '';
        }

        // Format to YYYY-MM-DDTHH:MM (required for datetime-local)
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');

        return `${year}-${month}-${day}T${hours}:${minutes}`;
    } catch (error) {
        console.error('Error formatting date:', error, dateValue);
        return '';
    }
};

// Handler for updating admission date
const updateAdmissionDate = (value) => {
    if (value) {
        // Convert datetime-local value back to ISO string or desired format
        const date = new Date(value);
        props.student.admission_date = date.toISOString();
    } else {
        props.student.admission_date = null;
    }
};

// Debug logging (remove in production)

</script>