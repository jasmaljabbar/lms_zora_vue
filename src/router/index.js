// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import AdminDashboard from '@/components/AdminDashboard.vue';
import DashboardHome from '@/components/DashboardHome.vue';
import AddPrincipal from '@/components/AddPrincipal.vue';
import Schools from '@/components/Schools.vue';
import Principals from '@/components/Principals.vue';
import Staffs from '@/components/Staffs.vue';
import Teachers from '@/components/Teachers.vue';
import Students from '@/components/Students.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true } // Add this meta field
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboardHome',
        component: DashboardHome,
      },
      {
        path: 'principals/add',
        name: 'AddPrincipal',
        component: AddPrincipal,
      },
      {
        path: 'schools',
        name: 'AdminSchools',
        component: Schools,
      },
      {
        path: 'principals',
        name: 'AdminPrincipals',
        component: Principals,
      },
      {
        path: 'staff',
        name: 'Adminstaffs',
        component: Staffs,
      },
      {
        path: 'teachers',
        name: 'Adminteachers',
        component: Teachers,
      },
      {
        path: 'students',
        name: 'Adminstudents',
        component: Students,
      },
      { 
        path: '', 
        name: 'AdminRedirect',
        redirect: '/admin/dashboard' 
      },

    ]
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const requiresAdmin = to.matched.some(record => record.meta.requiresAdmin);
  const requiresGuest = to.matched.some(record => record.meta.requiresGuest);
  const token = localStorage.getItem('access_token');
  let user = null;

  if (token) {
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch (e) {
      console.error("Failed to parse user data from localStorage", e);
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      return next('/');
    }
  }

  // Redirect authenticated users away from login page
  if (requiresGuest && token) {
    // Check if user is admin and redirect to admin dashboard
    if (user && user.roles && user.roles.includes('admin')) {
      return next('/admin/dashboard');
    }
    // For other user types, you can add additional redirects here
    // For now, redirect to admin dashboard as fallback
    return next('/admin/dashboard');
  }

  // Check for authentication
  if (requiresAuth && !token) {
    return next('/');
  }

  // Check for admin role
  if (requiresAdmin && (!user || !user.roles || !user.roles.includes('admin'))) {
    alert('Unauthorized: You must be an admin to access this page.');
    return next('/');
  }

  // Allow navigation
  next();
});

export default router;