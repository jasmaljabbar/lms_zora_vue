<template>
  <div class="profile-manager">
    <h1 class="text-2xl font-semibold mb-6">Profile Management</h1>

    <div v-if="loading" class="text-center py-8">Loading profile data...</div>
    <div v-if="error" class="text-red-500 text-center py-8">{{ error }}</div>

    <div v-if="user && profile" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile Sidebar/Card -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <div class="flex flex-col items-center">
          <img
            :src="profile.avatar_url || 'https://via.placeholder.com/150'"
            alt="Profile Avatar"
            class="w-32 h-32 rounded-full object-cover mb-4 border-2 border-blue-500"
          />
          <h2 class="text-xl font-bold">{{ user.username }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <div class="mt-2 text-sm text-gray-500">
            Roles: <span v-for="role in user.roles" :key="role" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">{{ role }}</span>
          </div>
        </div>
      </div>

      <!-- Profile Edit Form -->
      <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Edit Your Profile</h3>
        <form @submit.prevent="saveProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="first_name"
                v-model="editableProfile.first_name"
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
                v-model="editableProfile.last_name"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                v-model="editableProfile.gender"
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
                v-model="editableProfile.date_of_birth"
                :disabled="!isEditing"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Bio -->
            <div class="md:col-span-2">
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                v-model="editableProfile.bio"
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
                  v-else-if="editableProfile.avatar_url"
                  :src="editableProfile.avatar_url"
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
                v-model="editableProfile.phone_number"
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
                v-model="editableProfile.mobile_number"
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
                v-model="editableProfile.address_line1"
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
                v-model="editableProfile.address_line2"
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
                v-model="editableProfile.city"
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
                v-model="editableProfile.state"
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
                v-model="editableProfile.country"
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
                v-model="editableProfile.postal_code"
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
  name: 'ProfileManager',
  data() {
    return {
      userId: null,
      user: null,
      profile: null,
      editableProfile: {
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

        // Fetch Profile details
        const profileResponse = await api.get(`/admin_profiles/${this.userId}`);
        this.profile = profileResponse.data;

        // Initialize editableProfile with fetched data
        this.copyProfileToEditable();
      } catch (err) {
        this.error = 'Failed to load profile data. ' + (err.response?.data?.detail || err.message);
        console.error('Error fetching profile data:', err);
      } finally {
        this.loading = false;
      }
    },
    copyProfileToEditable() {
      if (this.profile) {
        // Ensure date_of_birth is formatted correctly for input[type="date"]
        const dob = this.profile.date_of_birth ? this.profile.date_of_birth.split('T')[0] : '';
        this.editableProfile = {
          ...this.profile,
          date_of_birth: dob,
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
        this.editableProfile.avatar_url = data.secure_url;
        toast.success('Image uploaded successfully!');
      } catch (err) {
        console.error('Error uploading image:', err);
        toast.error('Failed to upload image');
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },
    startEditing() {
      this.isEditing = true;
      // When starting to edit, ensure editableProfile is up-to-date with current profile
      this.copyProfileToEditable();
    },
    cancelEditing() {
      this.isEditing = false;
      this.selectedFile = null;
      this.imagePreview = null;
      // Revert changes by copying original profile back to editable
      this.copyProfileToEditable();
    },
    async saveProfile() {
      this.saving = true;
      this.error = null;
      try {
        const payload = {
          first_name: this.editableProfile.first_name,
          last_name: this.editableProfile.last_name,
          gender: this.editableProfile.gender,
          date_of_birth: this.editableProfile.date_of_birth,
          bio: this.editableProfile.bio,
          avatar_url: this.editableProfile.avatar_url,
          phone_number: this.editableProfile.phone_number,
          mobile_number: this.editableProfile.mobile_number,
          address_line1: this.editableProfile.address_line1,
          address_line2: this.editableProfile.address_line2,
          city: this.editableProfile.city,
          state: this.editableProfile.state,
          country: this.editableProfile.country,
          postal_code: this.editableProfile.postal_code,
        };

        await api.put(`/admin_profiles/${this.userId}`, payload);
        // After successful save, update the displayed profile and exit editing mode
        await this.fetchProfileData(); // Re-fetch to ensure consistency and updated timestamps
        this.isEditing = false;
        this.selectedFile = null;
        this.imagePreview = null;
        toast.success('Profile updated successfully!');
      } catch (err) {
        this.error = 'Failed to save profile. ' + (err.response?.data?.detail || err.message);
        console.error('Error saving profile:', err);
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