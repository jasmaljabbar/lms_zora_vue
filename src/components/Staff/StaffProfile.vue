<template>
  <div class="profile-manager">
    <h1 class="text-2xl font-semibold mb-6">Staff Profile Management</h1>

    <div v-if="loading" class="text-center py-8">Loading profile data...</div>
    <div v-if="error" class="text-red-500 text-center py-8">{{ error }}</div>

    <div v-if="user && staffProfile" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile Sidebar/Card -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <div class="flex flex-col items-center">
          <img
            :src="staffProfile.avatar_url || 'https://via.placeholder.com/150'"
            alt="Profile Avatar"
            class="w-32 h-32 rounded-full object-cover mb-4 border-2 border-blue-500"
          />
          <h2 class="text-xl font-bold">{{ user.username }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <div class="mt-2 text-sm text-gray-500">
            Roles: <span v-for="role in user.roles" :key="role" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">{{ role }}</span>
          </div>
          
          <!-- Staff Information -->
          <div class="mt-4 w-full text-sm">
            <div class="flex justify-between py-2 border-b">
              <span class="font-medium">Staff ID:</span>
              <span>{{ staffProfile.staff_id || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="font-medium">Department:</span>
              <span>{{ staffProfile.department || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="font-medium">Employment Type:</span>
              <span>{{ staffProfile.employment_type || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="font-medium">Hire Date:</span>
              <span>{{ formatDate(staffProfile.hire_date) }}</span>
            </div>
            <div class="flex justify-between py-2 border-b">
              <span class="font-medium">Office Location:</span>
              <span>{{ staffProfile.office_location || 'N/A' }}</span>
            </div>
            <div class="flex justify-between py-2">
              <span class="font-medium">Status:</span>
              <span :class="staffProfile.is_active_staff ? 'text-green-600' : 'text-red-600'">
                {{ staffProfile.is_active_staff ? 'Active' : 'Inactive' }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Staff Profile Edit Form -->
      <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Edit Your Staff Profile</h3>
        <form @submit.prevent="saveStaffProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="first_name"
                v-model="editableStaffProfile.first_name"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="last_name"
                v-model="editableStaffProfile.last_name"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                v-model="editableStaffProfile.gender"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
            </div>

            <!-- Date of Birth -->
            <div>
              <label for="date_of_birth" class="block text-sm font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                id="date_of_birth"
                required
                v-model="editableStaffProfile.date_of_birth"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Bio -->
            <div class="md:col-span-2">
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                v-model="editableStaffProfile.bio"
                :disabled="!isEditing"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <!-- Avatar Upload -->
            <div class="md:col-span-2">
              <label class="block text-sm font-medium text-gray-700">Profile Photo</label>
              <div class="mt-1 flex items-center">
                <img
                  v-if="imagePreview"
                  :src="imagePreview"
                  alt="Image Preview"
                  class="w-20 h-20 rounded-full object-cover mr-4"
                />
                <img
                  v-else-if="editableStaffProfile.avatar_url"
                  :src="editableStaffProfile.avatar_url"
                  alt="Current Avatar"
                  class="w-20 h-20 rounded-full object-cover mr-4"
                />
                <div class="flex flex-col">
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    @change="onFileSelected"
                    :disabled="!isEditing || uploading"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    :disabled="!isEditing || uploading"
                    class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {{ uploading ? 'Uploading...' : 'Choose Image' }}
                  </button>
                  <p class="mt-1 text-xs text-gray-500">
                    JPG, PNG or GIF up to 10MB
                  </p>
                </div>
              </div>
              <div v-if="uploadProgress > 0" class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    class="bg-blue-600 h-2.5 rounded-full"
                    :style="{ width: uploadProgress + '%' }"
                  ></div>
                </div>
                <p class="text-xs text-gray-500 mt-1">{{ uploadProgress }}% uploaded</p>
              </div>
            </div>

            <!-- Phone Number -->
            <div>
              <label for="phone_number" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="phone_number"
                v-model="editableStaffProfile.phone_number"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Mobile Number -->
            <div>
              <label for="mobile_number" class="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                id="mobile_number"
                v-model="editableStaffProfile.mobile_number"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Address Line 1 -->
            <div>
              <label for="address_line1" class="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="address_line1"
                v-model="editableStaffProfile.address_line1"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Address Line 2 -->
            <div>
              <label for="address_line2" class="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                id="address_line2"
                v-model="editableStaffProfile.address_line2"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                v-model="editableStaffProfile.city"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- State -->
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
              <input
                type="text"
                id="state"
                v-model="editableStaffProfile.state"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Country -->
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                v-model="editableStaffProfile.country"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Postal Code -->
            <div>
              <label for="postal_code" class="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                v-model="editableStaffProfile.postal_code"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end space-x-3">
            <button
              v-if="!isEditing"
              @click="startEditing"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Profile
            </button>
            <button
              v-if="isEditing"
              @click="cancelEditing"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              v-if="isEditing"
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="saving || uploading"
            >
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { api, coreapi } from '@/api/axios'; 
import { toast } from 'vue3-toastify';

export default {
  name: 'StaffProfileManager',
  data() {
    return {
      userId: null,
      user: null,
      staffProfile: null,
      editableStaffProfile: {
        first_name: '',
        last_name: '',
        gender: 'male',
        date_of_birth: '',
        bio: '',
        avatar_url: '',
        phone_number: '',
        mobile_number: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
      },
      selectedFile: null,
      imagePreview: null,
      uploading: false,
      uploadProgress: 0,
      isEditing: false,
      loading: true,
      saving: false,
      error: null,
    };
  },
  async created() {
    await this.fetchUserId();
    if (this.userId) {
      await this.fetchProfileData();
    }
  },
  methods: {
    fetchUserId() {
      try {
        const userData = JSON.parse(localStorage.getItem('user'));
        if (userData && userData.id) {
          this.userId = userData.id;
        } else {
          this.error = 'User ID not found in local storage. Please log in.';
          console.error('User ID not found in local storage.');
        }
      } catch (e) {
        this.error = 'Failed to parse user data from local storage.';
        console.error('Error parsing user data from local storage:', e);
      }
    },
    async fetchProfileData() {
      this.loading = true;
      this.error = null;
      try {
        // Fetch User details
        const userResponse = await coreapi.get(`/users/${this.userId}`);
        this.user = userResponse.data;

        // Fetch Staff Profile details
        const profileResponse = await api.get(`/staff_profiles/${this.userId}`);
        this.staffProfile = profileResponse.data;

        // Initialize editableStaffProfile with fetched data
        this.copyProfileToEditable();
      } catch (err) {
        this.error = 'Failed to load profile data. ' + (err.response?.data?.detail || err.message);
        console.error('Error fetching profile data:', err);
      } finally {
        this.loading = false;
      }
    },
    copyProfileToEditable() {
      if (this.staffProfile) {
        // Ensure date_of_birth is formatted correctly for input[type="date"]
        const dob = this.staffProfile.date_of_birth ? this.staffProfile.date_of_birth.split('T')[0] : '';
        this.editableStaffProfile = {
          first_name: this.staffProfile.first_name || '',
          last_name: this.staffProfile.last_name || '',
          gender: this.staffProfile.gender || 'male',
          date_of_birth: dob,
          bio: this.staffProfile.bio || '',
          avatar_url: this.staffProfile.avatar_url || '',
          phone_number: this.staffProfile.phone_number || '',
          mobile_number: this.staffProfile.mobile_number || '',
          address_line1: this.staffProfile.address_line1 || '',
          address_line2: this.staffProfile.address_line2 || '',
          city: this.staffProfile.city || '',
          state: this.staffProfile.state || '',
          country: this.staffProfile.country || '',
          postal_code: this.staffProfile.postal_code || '',
        };
      }
    },
    onFileSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      
      this.selectedFile = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      this.uploadImage();
    },
    async uploadImage() {
      if (!this.selectedFile) return;
      
      this.uploading = true;
      this.uploadProgress = 0;
      
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('file', this.selectedFile);
        formData.append('upload_preset', 'lmsUser'); 
        
        // Make request to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/dzrhciunb/image/upload`, {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            this.uploadProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        this.editableStaffProfile.avatar_url = data.secure_url;
        toast.success('Image uploaded successfully!');
      } catch (err) {
        console.error('Error uploading image:', err);
        toast.error('Failed to upload image');
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    formatDate(dateString) {
      if (!dateString) return 'N/A';
      const date = new Date(dateString);
      return date.toLocaleDateString();
    },
    startEditing() {
      this.isEditing = true;
      // When starting to edit, ensure editableStaffProfile is up-to-date with current profile
      this.copyProfileToEditable();
    },
    cancelEditing() {
      this.isEditing = false;
      this.selectedFile = null;
      this.imagePreview = null;
      // Revert changes by copying original profile back to editable
      this.copyProfileToEditable();
    },
    async saveStaffProfile() {
      this.saving = true;
      this.error = null;
      try {
        const payload = {
          first_name: this.editableStaffProfile.first_name,
          last_name: this.editableStaffProfile.last_name,
          gender: this.editableStaffProfile.gender,
          date_of_birth: this.editableStaffProfile.date_of_birth, // Already formatted 'YYYY-MM-DD'
          bio: this.editableStaffProfile.bio,
          avatar_url: this.editableStaffProfile.avatar_url,
          phone_number: this.editableStaffProfile.phone_number,
          mobile_number: this.editableStaffProfile.mobile_number,
          address_line1: this.editableStaffProfile.address_line1,
          address_line2: this.editableStaffProfile.address_line2,
          city: this.editableStaffProfile.city,
          state: this.editableStaffProfile.state,
          country: this.editableStaffProfile.country,
          postal_code: this.editableStaffProfile.postal_code,
        };

        await api.put(`/staff_profiles/${this.userId}`, payload);
        // After successful save, update the displayed profile and exit editing mode
        await this.fetchProfileData(); // Re-fetch to ensure consistency and updated timestamps
        this.isEditing = false;
        this.selectedFile = null;
        this.imagePreview = null;
        toast.success('Staff profile updated successfully!');
      } catch (err) {
        this.error = 'Failed to save profile. ' + (err.response?.data?.detail || err.message);
        console.error('Error saving profile:', err);
        toast.error('Failed to save profile changes.');
      } finally {
        this.saving = false;
      }
    },
  },
};
</script>

<style scoped>
.profile-manager {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9fafb;
}
</style>