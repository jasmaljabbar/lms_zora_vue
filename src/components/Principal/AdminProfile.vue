<template>
  <div class="profile-manager">
    <h1 class="text-2xl font-semibold mb-6">Principal Profile Management</h1>

    <div v-if="loading" class="text-center py-8">Loading profile data...</div>
    <div v-if="error" class="text-red-500 text-center py-8">{{ error }}</div>

    <div v-if="user && principalProfile" class="grid grid-cols-1 md:grid-cols-3 gap-8">
      <!-- Profile Sidebar/Card -->
      <div class="md:col-span-1 bg-white p-6 rounded-lg shadow-md">
        <div class="flex flex-col items-center">
          <img
            :src="principalProfile.avatar_url || 'https://via.placeholder.com/150'"
            alt="Profile Avatar"
            class="w-32 h-32 rounded-full object-cover mb-4 border-2 border-blue-500"
          />
          <h2 class="text-xl font-bold">{{ user.username }}</h2>
          <p class="text-gray-600">{{ user.email }}</p>
          <div class="mt-2 text-sm text-gray-500">
            Roles: <span v-for="role in user.roles" :key="role" class="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1">{{ role }}</span>
          </div>
          <div v-if="principalProfile.school_name" class="mt-4 text-center">
            <p class="text-sm text-gray-600">Principal at</p>
            <p class="font-semibold">{{ principalProfile.school_name }}</p>
          </div>
        </div>
      </div>

      <!-- Principal Profile Edit Form -->
      <div class="md:col-span-2 bg-white p-6 rounded-lg shadow-md">
        <h3 class="text-xl font-semibold mb-4">Edit Your Principal Profile</h3>
        <form @submit.prevent="savePrincipalProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- First Name -->
            <div>
              <label for="first_name" class="block text-sm font-medium text-gray-700">First Name</label>
              <input
                type="text"
                id="first_name"
                v-model="editablePrincipalProfile.first_name"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Last Name -->
            <div>
              <label for="last_name" class="block text-sm font-medium text-gray-700">Last Name</label>
              <input
                type="text"
                id="last_name"
                v-model="editablePrincipalProfile.last_name"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Gender -->
            <div>
              <label for="gender" class="block text-sm font-medium text-gray-700">Gender</label>
              <select
                id="gender"
                v-model="editablePrincipalProfile.gender"
                :disabled="!isEditingPrincipal"
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
                v-model="editablePrincipalProfile.date_of_birth"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Years of Experience -->
            <div>
              <label for="years_of_experience" class="block text-sm font-medium text-gray-700">Years of Experience</label>
              <input
                type="number"
                id="years_of_experience"
                v-model="editablePrincipalProfile.years_of_experience"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Qualification -->
            <div>
              <label for="qualification" class="block text-sm font-medium text-gray-700">Qualification</label>
              <input
                type="text"
                id="qualification"
                v-model="editablePrincipalProfile.qualification"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Office Number -->
            <div>
              <label for="office_number" class="block text-sm font-medium text-gray-700">Office Number</label>
              <input
                type="tel"
                id="office_number"
                v-model="editablePrincipalProfile.office_number"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Leadership Score -->
            <div v-if="principalProfile.leadership_score !== undefined">
              <label for="leadership_score" class="block text-sm font-medium text-gray-700">Leadership Score</label>
              <input
                type="number"
                id="leadership_score"
                :value="principalProfile.leadership_score"
                disabled
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 sm:text-sm"
              />
            </div>

            <!-- Bio -->
            <div class="md:col-span-2">
              <label for="bio" class="block text-sm font-medium text-gray-700">Bio</label>
              <textarea
                id="bio"
                v-model="editablePrincipalProfile.bio"
                :disabled="!isEditingPrincipal"
                rows="3"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              ></textarea>
            </div>

            <!-- Avatar Upload with Cloudinary -->
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
                  v-else-if="editablePrincipalProfile.avatar_url"
                  :src="editablePrincipalProfile.avatar_url"
                  alt="Current Avatar"
                  class="w-20 h-20 rounded-full object-cover mr-4"
                />
                <div class="flex flex-col">
                  <input
                    type="file"
                    ref="fileInput"
                    accept="image/*"
                    @change="onFileSelected"
                    :disabled="!isEditingPrincipal || uploading"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.fileInput.click()"
                    :disabled="!isEditingPrincipal || uploading"
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
                v-model="editablePrincipalProfile.phone_number"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Mobile Number -->
            <div>
              <label for="mobile_number" class="block text-sm font-medium text-gray-700">Mobile Number</label>
              <input
                type="tel"
                id="mobile_number"
                v-model="editablePrincipalProfile.mobile_number"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Address Line 1 -->
            <div>
              <label for="address_line1" class="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="address_line1"
                v-model="editablePrincipalProfile.address_line1"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Address Line 2 -->
            <div>
              <label for="address_line2" class="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                id="address_line2"
                v-model="editablePrincipalProfile.address_line2"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- City -->
            <div>
              <label for="city" class="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                v-model="editablePrincipalProfile.city"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- State -->
            <div>
              <label for="state" class="block text-sm font-medium text-gray-700">State / Province</label>
              <input
                type="text"
                id="state"
                v-model="editablePrincipalProfile.state"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Country -->
            <div>
              <label for="country" class="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="country"
                v-model="editablePrincipalProfile.country"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Postal Code -->
            <div>
              <label for="postal_code" class="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                id="postal_code"
                v-model="editablePrincipalProfile.postal_code"
                :disabled="!isEditingPrincipal"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end space-x-3">
            <button
              v-if="!isEditingPrincipal"
              @click="startEditingPrincipal"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Edit Principal Profile
            </button>
            <button
              v-if="isEditingPrincipal"
              @click="cancelEditingPrincipal"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              v-if="isEditingPrincipal"
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="savingPrincipal || uploading"
            >
              {{ savingPrincipal ? 'Saving...' : 'Save Principal Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- School Profile Section -->
    <div v-if="schoolProfile" class="mt-12">
      <div class="bg-white p-6 rounded-lg shadow-md">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold">School Profile</h3>
          <button
            v-if="!isEditingSchool"
            @click="startEditingSchool"
            type="button"
            class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Edit School Profile
          </button>
        </div>

        <div v-if="!isEditingSchool" class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- School Info Display -->
          <div class="flex flex-col space-y-4">
            <div class="flex items-center space-x-4">
              <div v-if="schoolProfile.logo_url" class="flex-shrink-0">
                <img :src="schoolProfile.logo_url" alt="School Logo" class="w-16 h-16 object-contain">
              </div>
              <div>
                <h4 class="text-lg font-semibold">{{ schoolProfile.name }}</h4>
                <p class="text-sm text-gray-600">Code: {{ schoolProfile.code }}</p>
              </div>
            </div>
            
            <div>
              <p class="text-sm"><span class="font-medium">Established:</span> {{ schoolProfile.established_year }}</p>
              <p class="text-sm"><span class="font-medium">Status:</span> 
                <span :class="schoolProfile.is_active ? 'text-green-600' : 'text-red-600'">
                  {{ schoolProfile.is_active ? 'Active' : 'Inactive' }}
                </span>
              </p>
            </div>
            
            <div>
              <h5 class="font-medium mb-1">Contact Information</h5>
              <p class="text-sm">{{ schoolProfile.email }}</p>
              <p class="text-sm">{{ schoolProfile.phone_number }}</p>
              <p class="text-sm">{{ schoolProfile.website }}</p>
            </div>
            
            <div>
              <h5 class="font-medium mb-1">Statistics</h5>
              <div class="grid grid-cols-3 gap-2 text-sm">
                <div>
                  <p class="font-semibold">{{ schoolProfile.total_students || 0 }}</p>
                  <p class="text-xs text-gray-600">Students</p>
                </div>
                <div>
                  <p class="font-semibold">{{ schoolProfile.total_teachers || 0 }}</p>
                  <p class="text-xs text-gray-600">Teachers</p>
                </div>
                <div>
                  <p class="font-semibold">{{ schoolProfile.total_staff || 0 }}</p>
                  <p class="text-xs text-gray-600">Staff</p>
                </div>
              </div>
            </div>
          </div>
          
          <!-- School Address Display -->
          <div>
            <h5 class="font-medium mb-1">Address</h5>
            <p class="text-sm">{{ schoolProfile.address_line1 }}</p>
            <p class="text-sm" v-if="schoolProfile.address_line2">{{ schoolProfile.address_line2 }}</p>
            <p class="text-sm">{{ schoolProfile.city }}, {{ schoolProfile.state }} {{ schoolProfile.postal_code }}</p>
            <p class="text-sm">{{ schoolProfile.country }}</p>
            
            <div v-if="schoolProfile.banner_url" class="mt-4">
              <img :src="schoolProfile.banner_url" alt="School Banner" class="w-full h-32 object-cover rounded">
            </div>
          </div>
        </div>

        <!-- School Edit Form -->
        <form v-else @submit.prevent="saveSchoolProfile">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- School Name -->
            <div class="md:col-span-2">
              <label for="school_name" class="block text-sm font-medium text-gray-700">School Name</label>
              <input
                type="text"
                id="school_name"
                v-model="editableSchoolProfile.name"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- School Code -->
            <div>
              <label for="school_code" class="block text-sm font-medium text-gray-700">School Code</label>
              <input
                type="text"
                id="school_code"
                v-model="editableSchoolProfile.code"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Established Year -->
            <div>
              <label for="established_year" class="block text-sm font-medium text-gray-700">Established Year</label>
              <input
                type="number"
                id="established_year"
                v-model="editableSchoolProfile.established_year"
                :disabled="!isEditingSchool"
                min="1800"
                :max="new Date().getFullYear()"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Email -->
            <div>
              <label for="school_email" class="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="school_email"
                v-model="editableSchoolProfile.email"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Phone Number -->
            <div>
              <label for="school_phone" class="block text-sm font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                id="school_phone"
                v-model="editableSchoolProfile.phone_number"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Website -->
            <div>
              <label for="website" class="block text-sm font-medium text-gray-700">Website</label>
              <input
                type="url"
                id="website"
                v-model="editableSchoolProfile.website"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Logo URL with Cloudinary Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700">School Logo</label>
              <div class="mt-1 flex items-center">
                <img
                  v-if="schoolLogoPreview"
                  :src="schoolLogoPreview"
                  alt="Logo Preview"
                  class="w-16 h-16 object-contain mr-4 border rounded"
                />
                <img
                  v-else-if="editableSchoolProfile.logo_url"
                  :src="editableSchoolProfile.logo_url"
                  alt="Current Logo"
                  class="w-16 h-16 object-contain mr-4 border rounded"
                />
                <div class="flex flex-col">
                  <input
                    type="file"
                    ref="schoolLogoInput"
                    accept="image/*"
                    @change="onSchoolLogoSelected"
                    :disabled="!isEditingSchool || uploadingSchoolLogo"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.schoolLogoInput.click()"
                    :disabled="!isEditingSchool || uploadingSchoolLogo"
                    class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {{ uploadingSchoolLogo ? 'Uploading...' : 'Choose Logo' }}
                  </button>
                </div>
              </div>
              <div v-if="schoolLogoUploadProgress > 0" class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-blue-600 h-1.5 rounded-full"
                    :style="{ width: schoolLogoUploadProgress + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Banner URL with Cloudinary Upload -->
            <div>
              <label class="block text-sm font-medium text-gray-700">School Banner</label>
              <div class="mt-1 flex items-center">
                <img
                  v-if="schoolBannerPreview"
                  :src="schoolBannerPreview"
                  alt="Banner Preview"
                  class="w-20 h-12 object-cover mr-4 border rounded"
                />
                <img
                  v-else-if="editableSchoolProfile.banner_url"
                  :src="editableSchoolProfile.banner_url"
                  alt="Current Banner"
                  class="w-20 h-12 object-cover mr-4 border rounded"
                />
                <div class="flex flex-col">
                  <input
                    type="file"
                    ref="schoolBannerInput"
                    accept="image/*"
                    @change="onSchoolBannerSelected"
                    :disabled="!isEditingSchool || uploadingSchoolBanner"
                    class="hidden"
                  />
                  <button
                    type="button"
                    @click="$refs.schoolBannerInput.click()"
                    :disabled="!isEditingSchool || uploadingSchoolBanner"
                    class="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md shadow-sm text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                  >
                    {{ uploadingSchoolBanner ? 'Uploading...' : 'Choose Banner' }}
                  </button>
                </div>
              </div>
              <div v-if="schoolBannerUploadProgress > 0" class="mt-2">
                <div class="w-full bg-gray-200 rounded-full h-1.5">
                  <div
                    class="bg-blue-600 h-1.5 rounded-full"
                    :style="{ width: schoolBannerUploadProgress + '%' }"
                  ></div>
                </div>
              </div>
            </div>

            <!-- Status -->
            <div>
              <label for="is_active" class="block text-sm font-medium text-gray-700">Status</label>
              <select
                id="is_active"
                v-model="editableSchoolProfile.is_active"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option :value="true">Active</option>
                <option :value="false">Inactive</option>
              </select>
            </div>

            <!-- Address Line 1 -->
            <div>
              <label for="school_address_line1" class="block text-sm font-medium text-gray-700">Address Line 1</label>
              <input
                type="text"
                id="school_address_line1"
                v-model="editableSchoolProfile.address_line1"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Address Line 2 -->
            <div>
              <label for="school_address_line2" class="block text-sm font-medium text-gray-700">Address Line 2</label>
              <input
                type="text"
                id="school_address_line2"
                v-model="editableSchoolProfile.address_line2"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- City -->
            <div>
              <label for="school_city" class="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="school_city"
                v-model="editableSchoolProfile.city"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- State -->
            <div>
              <label for="school_state" class="block text-sm font-medium text-gray-700">State / Province</label>
              <input
                type="text"
                id="school_state"
                v-model="editableSchoolProfile.state"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Country -->
            <div>
              <label for="school_country" class="block text-sm font-medium text-gray-700">Country</label>
              <input
                type="text"
                id="school_country"
                v-model="editableSchoolProfile.country"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>

            <!-- Postal Code -->
            <div>
              <label for="school_postal_code" class="block text-sm font-medium text-gray-700">Postal Code</label>
              <input
                type="text"
                id="school_postal_code"
                v-model="editableSchoolProfile.postal_code"
                :disabled="!isEditingSchool"
                class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="mt-6 flex justify-end space-x-3">
            <button
              @click="cancelEditingSchool"
              type="button"
              class="inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              :disabled="savingSchool || uploadingSchoolLogo || uploadingSchoolBanner"
            >
              {{ savingSchool ? 'Saving...' : 'Save School Changes' }}
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
  name: 'PrincipalProfileManager',
  data() {
    return {
      userId: null,
      user: null,
      principalProfile: null,
      schoolProfile: null,
      editablePrincipalProfile: {
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
        years_of_experience: 0,
        qualification: '',
        office_number: ''
      },
      editableSchoolProfile: {
        name: '',
        code: '',
        email: '',
        phone_number: '',
        website: '',
        address_line1: '',
        address_line2: '',
        city: '',
        state: '',
        country: '',
        postal_code: '',
        established_year: new Date().getFullYear(),
        logo_url: '',
        banner_url: '',
        is_active: true
      },
      // Principal avatar upload
      selectedFile: null,
      imagePreview: null,
      uploading: false,
      uploadProgress: 0,
      
      // School logo upload
      selectedSchoolLogo: null,
      schoolLogoPreview: null,
      uploadingSchoolLogo: false,
      schoolLogoUploadProgress: 0,
      
      // School banner upload
      selectedSchoolBanner: null,
      schoolBannerPreview: null,
      uploadingSchoolBanner: false,
      schoolBannerUploadProgress: 0,
      
      isEditingPrincipal: false,
      isEditingSchool: false,
      loading: true,
      savingPrincipal: false,
      savingSchool: false,
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

        // Fetch Principal Profile details
        const principalResponse = await api.get(`/principal_profiles/${this.userId}`);
        this.principalProfile = principalResponse.data;

        // Initialize editablePrincipalProfile with fetched data
        this.copyPrincipalProfileToEditable();

        // If principal has a school_id, fetch school profile
        if (this.principalProfile.school_id) {
          await this.fetchSchoolProfile(this.principalProfile.school_id);
        }
      } catch (err) {
        this.error = 'Failed to load profile data. ' + (err.response?.data?.detail || err.message);
        console.error('Error fetching profile data:', err);
      } finally {
        this.loading = false;
      }
    },
    async fetchSchoolProfile(schoolId) {
      try {
        const response = await api.get(`/school_profiles/${schoolId}`);
        this.schoolProfile = response.data;
        this.copySchoolProfileToEditable();
      } catch (err) {
        console.error('Error fetching school profile:', err);
        toast.error('Failed to load school profile data.');
      }
    },
    copyPrincipalProfileToEditable() {
      if (this.principalProfile) {
        // Ensure date_of_birth is formatted correctly for input[type="date"]
        const dob = this.principalProfile.date_of_birth ? this.principalProfile.date_of_birth.split('T')[0] : '';
        this.editablePrincipalProfile = {
          first_name: this.principalProfile.first_name || '',
          last_name: this.principalProfile.last_name || '',
          gender: this.principalProfile.gender || 'male',
          date_of_birth: dob,
          bio: this.principalProfile.bio || '',
          avatar_url: this.principalProfile.avatar_url || '',
          phone_number: this.principalProfile.phone_number || '',
          mobile_number: this.principalProfile.mobile_number || '',
          address_line1: this.principalProfile.address_line1 || '',
          address_line2: this.principalProfile.address_line2 || '',
          city: this.principalProfile.city || '',
          state: this.principalProfile.state || '',
          country: this.principalProfile.country || '',
          postal_code: this.principalProfile.postal_code || '',
          years_of_experience: this.principalProfile.years_of_experience || 0,
          qualification: this.principalProfile.qualification || '',
          office_number: this.principalProfile.office_number || ''
        };
      }
    },
    copySchoolProfileToEditable() {
      if (this.schoolProfile) {
        this.editableSchoolProfile = {
          name: this.schoolProfile.name || '',
          code: this.schoolProfile.code || '',
          email: this.schoolProfile.email || '',
          phone_number: this.schoolProfile.phone_number || '',
          website: this.schoolProfile.website || '',
          address_line1: this.schoolProfile.address_line1 || '',
          address_line2: this.schoolProfile.address_line2 || '',
          city: this.schoolProfile.city || '',
          state: this.schoolProfile.state || '',
          country: this.schoolProfile.country || '',
          postal_code: this.schoolProfile.postal_code || '',
          established_year: this.schoolProfile.established_year || new Date().getFullYear(),
          logo_url: this.schoolProfile.logo_url || '',
          banner_url: this.schoolProfile.banner_url || '',
          is_active: this.schoolProfile.is_active !== undefined ? this.schoolProfile.is_active : true
        };
      }
    },

    // Principal Avatar Upload Methods
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
        this.editablePrincipalProfile.avatar_url = data.secure_url;
        toast.success('Principal avatar uploaded successfully!');
      } catch (err) {
        console.error('Error uploading principal avatar:', err);
        toast.error('Failed to upload principal avatar');
      } finally {
        this.uploading = false;
        this.uploadProgress = 0;
      }
    },

    // School Logo Upload Methods
    onSchoolLogoSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      
      this.selectedSchoolLogo = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.schoolLogoPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      this.uploadSchoolLogo();
    },
    async uploadSchoolLogo() {
      if (!this.selectedSchoolLogo) return;
      
      this.uploadingSchoolLogo = true;
      this.schoolLogoUploadProgress = 0;
      
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('file', this.selectedSchoolLogo);
        formData.append('upload_preset', 'lmsUser'); 
        
        // Make request to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/dzrhciunb/image/upload`, {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            this.schoolLogoUploadProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        this.editableSchoolProfile.logo_url = data.secure_url;
        toast.success('School logo uploaded successfully!');
      } catch (err) {
        console.error('Error uploading school logo:', err);
        toast.error('Failed to upload school logo');
      } finally {
        this.uploadingSchoolLogo = false;
        this.schoolLogoUploadProgress = 0;
      }
    },

    // School Banner Upload Methods
    onSchoolBannerSelected(event) {
      const file = event.target.files[0];
      if (!file) return;
      
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error('File size exceeds 10MB limit');
        return;
      }
      
      this.selectedSchoolBanner = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.schoolBannerPreview = e.target.result;
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      this.uploadSchoolBanner();
    },
    async uploadSchoolBanner() {
      if (!this.selectedSchoolBanner) return;
      
      this.uploadingSchoolBanner = true;
      this.schoolBannerUploadProgress = 0;
      
      try {
        // Create a FormData object
        const formData = new FormData();
        formData.append('file', this.selectedSchoolBanner);
        formData.append('upload_preset', 'lmsUser'); 
        
        // Make request to Cloudinary
        const response = await fetch(`https://api.cloudinary.com/v1_1/dzrhciunb/image/upload`, {
          method: 'POST',
          body: formData,
          onUploadProgress: (progressEvent) => {
            this.schoolBannerUploadProgress = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
          }
        });
        
        if (!response.ok) {
          throw new Error('Upload failed');
        }
        
        const data = await response.json();
        this.editableSchoolProfile.banner_url = data.secure_url;
        toast.success('School banner uploaded successfully!');
      } catch (err) {
        console.error('Error uploading school banner:', err);
        toast.error('Failed to upload school banner');
      } finally {
        this.uploadingSchoolBanner = false;
        this.schoolBannerUploadProgress = 0;
      }
    },

    startEditingPrincipal() {
      this.isEditingPrincipal = true;
    },
    cancelEditingPrincipal() {
      this.isEditingPrincipal = false;
      this.selectedFile = null;
      this.imagePreview = null;
      this.copyPrincipalProfileToEditable();
    },
    startEditingSchool() {
      this.isEditingSchool = true;
    },
    cancelEditingSchool() {
      this.isEditingSchool = false;
      this.selectedSchoolLogo = null;
      this.schoolLogoPreview = null;
      this.selectedSchoolBanner = null;
      this.schoolBannerPreview = null;
      this.copySchoolProfileToEditable();
    },
    async savePrincipalProfile() {
      this.savingPrincipal = true;
      this.error = null;
      try {
        const payload = {
          first_name: this.editablePrincipalProfile.first_name,
          last_name: this.editablePrincipalProfile.last_name,
          gender: this.editablePrincipalProfile.gender,
          date_of_birth: this.editablePrincipalProfile.date_of_birth,
          bio: this.editablePrincipalProfile.bio,
          avatar_url: this.editablePrincipalProfile.avatar_url,
          phone_number: this.editablePrincipalProfile.phone_number,
          mobile_number: this.editablePrincipalProfile.mobile_number,
          address_line1: this.editablePrincipalProfile.address_line1,
          address_line2: this.editablePrincipalProfile.address_line2,
          city: this.editablePrincipalProfile.city,
          state: this.editablePrincipalProfile.state,
          country: this.editablePrincipalProfile.country,
          postal_code: this.editablePrincipalProfile.postal_code,
          years_of_experience: this.editablePrincipalProfile.years_of_experience,
          qualification: this.editablePrincipalProfile.qualification,
          office_number: this.editablePrincipalProfile.office_number
        };

        await api.put(`/principal_profiles/${this.userId}`, payload);
        // After successful save, update the displayed profile and exit editing mode
        await this.fetchProfileData();
        this.isEditingPrincipal = false;
        this.selectedFile = null;
        this.imagePreview = null;
        toast.success('Principal profile updated successfully!');
      } catch (err) {
        this.error = 'Failed to save principal profile. ' + (err.response?.data?.detail || err.message);
        console.error('Error saving principal profile:', err);
        toast.error('Failed to save principal profile.');
      } finally {
        this.savingPrincipal = false;
      }
    },
    async saveSchoolProfile() {
      this.savingSchool = true;
      this.error = null;
      try {
        const payload = {
          name: this.editableSchoolProfile.name,
          code: this.editableSchoolProfile.code,
          email: this.editableSchoolProfile.email,
          phone_number: this.editableSchoolProfile.phone_number,
          website: this.editableSchoolProfile.website,
          address_line1: this.editableSchoolProfile.address_line1,
          address_line2: this.editableSchoolProfile.address_line2,
          city: this.editableSchoolProfile.city,
          state: this.editableSchoolProfile.state,
          country: this.editableSchoolProfile.country,
          postal_code: this.editableSchoolProfile.postal_code,
          established_year: this.editableSchoolProfile.established_year,
          logo_url: this.editableSchoolProfile.logo_url,
          banner_url: this.editableSchoolProfile.banner_url,
          is_active: this.editableSchoolProfile.is_active
        };

        await api.put(`/school_profiles/${this.schoolProfile.id}`, payload);
        // After successful save, update the displayed profile and exit editing mode
        await this.fetchSchoolProfile(this.schoolProfile.id);
        this.isEditingSchool = false;
        this.selectedSchoolLogo = null;
        this.schoolLogoPreview = null;
        this.selectedSchoolBanner = null;
        this.schoolBannerPreview = null;
        toast.success('School profile updated successfully!');
      } catch (err) {
        this.error = 'Failed to save school profile. ' + (err.response?.data?.detail || err.message);
        console.error('Error saving school profile:', err);
        toast.error('Failed to save school profile.');
      } finally {
        this.savingSchool = false;
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