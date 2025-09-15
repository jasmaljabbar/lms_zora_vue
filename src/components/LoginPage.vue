<template>
  <div class="min-h-screen bg-gray-100">
    <!-- Logo at top center -->
    <div class="flex justify-center pt-8 pb-6">
      <img :src="ZoraImage" alt="Zora AI Logo" class="h-16 md:h-20 lg:h-24">
    </div>

    <!-- Main content container -->
    <div class="flex flex-col lg:flex-row mx-4 md:mx-8 lg:mx-auto lg:max-w-7xl rounded-lg overflow-hidden">
      <!-- Left Section: Illustration -->
      <div class="w-full lg:w-1/2 p-6 md:p-8 flex justify-center items-center bg-gray-100 order-2 lg:order-1">
        <img :src="zoraLogo" alt="Students Illustration" class="max-w-full h-auto rounded-lg max-h-64 md:max-h-80 lg:max-h-full">
      </div>

      <!-- Right Section: Login Form -->
      <div class="w-full lg:w-1/2 p-6 md:p-8 lg:p-12 flex flex-col justify-center bg-gray-100 order-1 lg:order-2">
        <h2 class="text-2xl md:text-3xl font-bold text-gray-800 mb-6 md:mb-8 text-center">Log In</h2>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label for="username" class="sr-only">Username</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <svg class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </span>
              <input
                type="text"
                id="username"
                v-model="username"
                placeholder="Your Username"
                class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-lg"
                required
              />
            </div>
          </div>

          <div>
            <label for="password" class="sr-only">Password</label>
            <div class="relative">
              <span class="absolute inset-y-0 left-0 flex items-center pl-3">
                <i class="pi pi-lock text-gray-400"></i>
              </span>
              <input
                type="password"
                id="password"
                v-model="password"
                placeholder="Password"
                class="block w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-base md:text-lg"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            class="w-full bg-black text-white py-3 rounded-md hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black text-base md:text-lg font-medium transition-colors duration-200"
          >
            Log In
          </button>
        </form>

        <!-- Social login divider -->
        <div class="relative flex items-center my-6">
          <div class="flex-grow border-t border-gray-300"></div>
          <span class="flex-shrink mx-4 text-gray-600 text-sm">Or continue with</span>
          <div class="flex-grow border-t border-gray-300"></div>
        </div>

        <!-- Social login buttons -->
        <div class="grid grid-cols-2 gap-4">
           <!-- Custom Google Button -->
        <button
          @click="loginWithGoogle"
          class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
        >
          <svg class="h-5 w-5 mr-2" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.94 0 6.62 1.7 8.14 3.12l5.52-5.36C34.2 4.25 29.64 2 24 2 14.84 2 7.38 7.9 4.44 16.02l6.94 5.39C13.4 13.48 18.2 9.5 24 9.5z"/>
            <path fill="#34A853" d="M46.14 24.5c0-1.64-.14-3.2-.41-4.7H24v9.05h12.6c-.55 2.82-2.18 5.2-4.66 6.8l7.25 5.63c4.22-3.9 6.95-9.65 6.95-16.78z"/>
            <path fill="#FBBC05" d="M11.38 28.61a14.53 14.53 0 0 1-.76-4.61c0-1.6.27-3.15.76-4.61l-6.94-5.39A21.98 21.98 0 0 0 2 24c0 3.63.87 7.05 2.42 10.04l6.96-5.43z"/>
            <path fill="#4285F4" d="M24 46c5.64 0 10.36-1.86 13.82-5.07l-7.25-5.63c-2 1.35-4.54 2.15-6.57 2.15-5.8 0-10.6-3.98-12.62-9.91l-6.96 5.43C7.38 40.1 14.84 46 24 46z"/>
          </svg>
          <span class="text-sm font-medium text-gray-700">Google</span>
        </button>

          <button
            @click="loginWithMicrosoft"
            class="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <svg class="h-5 w-5 mr-2" viewBox="0 0 23 23" width="23" height="23">
              <path fill="#f3f3f3" d="M0 0h23v23H0z"/>
              <path fill="#f1511b" d="M1 1h10v10H1z"/>
              <path fill="#80cc04" d="M12 1h10v10H12z"/>
              <path fill="#00adef" d="M1 12h10v10H1z"/>
              <path fill="#ffb900" d="M12 12h10v10H12z"/>
            </svg>
            <span class="text-sm font-medium text-gray-700">Microsoft</span>
          </button>
        </div>

        <p v-if="errorMessage" class="text-red-500 text-center mt-4 text-sm md:text-base">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import {jwtDecode} from "jwt-decode";
import { useRouter } from 'vue-router';
import ZoraImage from '@/assets/images/image.png';
import zoraLogo from '@/assets/images/loginimg.png'

// Reactive state for form inputs
const username = ref('');
const password = ref('');
const errorMessage = ref('');

// Get router instance
const router = useRouter();

// Google and Microsoft OAuth2 clients (you'll need to configure these)
let googleAuth = null;
let msalInstance = null;

const saveToken = (token) => {
  // Save raw token
  localStorage.setItem("access_token", token);

  // Decode payload
  const decoded = jwtDecode(token);

  // Save decoded payload (user details)
  localStorage.setItem("user", JSON.stringify(decoded));
  console.log("Decoded JWT:", decoded.roles);
  if (decoded.roles && decoded.roles.includes("admin")) {
    router.push('/admin/dashboard');
  } else if (decoded.roles && decoded.roles.includes("principal")) {
    router.push('/principal/dashboard');
  } else if (decoded.roles && decoded.roles.includes("staff")) {
    router.push('/staff/dashboard');
  } else if (decoded.roles && decoded.roles.includes("student")) {
    router.push('/student/dashboard');
  } else {
    router.push('/dashboard'); // Default redirect if no specific role
  }
  // router.push('/admin/dashboard');
  
};

// Initialize OAuth clients when component mounts
onMounted(() => {
  initializeGoogleSignIn();
  initializeMicrosoftAuth();
});

const initializeGoogleSignIn = () => {
  // Load Google API script dynamically
  const script = document.createElement('script');
  script.src = 'https://accounts.google.com/gsi/client';
  script.async = true;
  script.defer = true;
  document.head.appendChild(script);

  script.onload = () => {
    window.google.accounts.id.initialize({
      client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
      callback: handleGoogleSignIn,
      auto_select: false,
    });
    
    window.google.accounts.id.renderButton(
      document.getElementById('googleSignInButton'),
      { 
        theme: 'outline', 
        size: 'large',
        width: 250, // Set a fixed width or use the parent's width
        text: 'signin_with'
      }
    );
  };
};

const handleGoogleSignIn = async (response) => {
  try {
    console.log('Google sign-in response:', response);
    
    // Send the credential (ID token) to your backend
    const result = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/google/login`, {
      token: response.credential
    });

    const accessToken = result.data.access_token;
    saveToken(accessToken);
    
    
    // alert('Google login successful!');
    console.log('Google login successful, token:', accessToken);

    // Redirect to admin dashboard
    router.push('/admin/dashboard');
    
    // Redirect to dashboard or home page
    // router.push('/dashboard');
  } catch (error) {
    console.error('Google login failed:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail;
    } else {
      errorMessage.value = 'Google login failed. Please try again.';
    }
  }
};

const initializeMicrosoftAuth = () => {
  // For Microsoft, you would typically use MSAL.js
  // This is a simplified implementation - you might want to use the official MSAL library
  console.log('Microsoft auth would be initialized here');
};

const handleLogin = async () => {
  errorMessage.value = ''; // Clear previous errors

  try {
    const formData = new FormData();
    formData.append('grant_type', 'password');
    formData.append('username', username.value);
    formData.append('password', password.value);
    formData.append('scope', '');
    formData.append('client_id', '');
    formData.append('client_secret', '');

    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/login/token`, formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    });

    const token = response.data.access_token;
    saveToken(token);
    // localStorage.setItem('access_token', token);

    // alert('Login successful! Token stored.');
    console.log('Login successful, token:', token);

    username.value = '';
    password.value = '';

    // Redirect to admin dashboard
    // router.push('/admin/dashboard');

  } catch (error) {
    console.error('Login failed:', error);
    if (error.response && error.response.data && error.response.data.detail) {
      errorMessage.value = error.response.data.detail;
    } else {
      errorMessage.value = 'An unexpected error occurred. Please try again.';
    }
  }
};

const loginWithGoogle = () => {
  window.google.accounts.id.initialize({
    client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
    callback: handleGoogleSignIn,
  });

  // Trigger popup sign-in instead of auto-rendered button
  window.google.accounts.id.prompt();
};

const loginWithMicrosoft = async () => {
  // For a production app, you should use the MSAL.js library
  // This is a simplified implementation that redirects to Microsoft's OAuth endpoint
  
  const microsoftClientId = import.meta.env.VITE_MICROSOFT_CLIENT_ID;
  const redirectUri = `${window.location.origin}/auth/microsoft/callback`;
  const scope = 'user.read';
  const authUrl = `https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=${microsoftClientId}&response_type=token&redirect_uri=${encodeURIComponent(redirectUri)}&scope=${encodeURIComponent(scope)}&response_mode=fragment`;
  
  window.location.href = authUrl;
};

const handleGoogleToken = async (token) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/google/login`, {
      token: token
    });

    const accessToken = response.data.access_token;
    localStorage.setItem('access_token', accessToken);
    
    alert('Google login successful!');
    console.log('Google login successful, token:', accessToken);
    
    // Redirect to dashboard or home page
  } catch (error) {
    console.error('Google login failed:', error);
    errorMessage.value = 'Google login failed. Please try again.';
  }
};

// Handle Microsoft callback if using redirect flow
const handleMicrosoftCallback = () => {
  // This would parse the URL fragment for the access token
  const hash = window.location.hash.substr(1);
  const result = hash.split('&').reduce((res, item) => {
    const parts = item.split('=');
    res[parts[0]] = parts[1];
    return res;
  }, {});

  if (result.access_token) {
    sendMicrosoftTokenToBackend(result.access_token);
  }
};

const sendMicrosoftTokenToBackend = async (token) => {
  try {
    const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/microsoft/login`, {
      token: token
    });

    const accessToken = response.data.access_token;
    localStorage.setItem('access_token', accessToken);
    
    alert('Microsoft login successful!');
    console.log('Microsoft login successful, token:', accessToken);

    // Redirect to admin dashboard
    router.push('/admin/dashboard');
    
    // Redirect to dashboard or home page
  } catch (error) {
    console.error('Microsoft login failed:', error);
    errorMessage.value = 'Microsoft login failed. Please try again.';
  }
};

// Check if we're returning from Microsoft login
if (window.location.hash.includes('access_token')) {
  handleMicrosoftCallback();
}
</script>

<style scoped>
/* You can add component-specific styles here if needed */
</style>