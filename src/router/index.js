// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from '@/components/LoginPage.vue';
import AdminDashboard from '@/components/Admin/AdminDashboard.vue';
import AdminDashboardHome from '@/components/Admin/DashboardHome.vue';
import AddPrincipal from '@/components/Admin/AddPrincipal.vue';
import Schools from '@/components/Admin/Schools.vue';
import Principals from '@/components/Admin/Principals.vue';
import Staffs from '@/components/Admin/Staffs.vue';
import Teachers from '@/components/Admin/Teachers.vue';
import Students from '@/components/Admin/Students.vue';
import PrincipalDashboard from '@/components/PrincipalDashboard.vue';
import PrincipalDashboardHome from '@/components/DashboardHome.vue';
import principalStaff from '@/components/Staffs.vue'
import AddStaff from '@/components/AddStaff.vue';
import { RoleUtils } from '@/utils/roleUtils.js';
import { toast } from 'vue3-toastify'
import principalTeachers from '@/components/Teachers.vue';
import AddTeacher from '@/components/AddTeacher.vue';
import principalStudents from '@/components/Students.vue';
import AddStudent from '@/components/AddStudent.vue';

const routes = [
  {
    path: '/',
    name: 'Login',
    component: LoginPage,
    meta: { requiresGuest: true }
  },
  {
    path: '/admin',
    component: AdminDashboard,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: 'dashboard',
        name: 'AdminDashboardHome',
        component: AdminDashboardHome,
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
        name: 'AdminStaffs',
        component: Staffs,
      },
      {
        path: 'teachers',
        name: 'AdminTeachers',
        component: Teachers,
      },
      {
        path: 'students',
        name: 'AdminStudents',
        component: Students,
      },
      {
        path: '',
        name: 'AdminRedirect',
        redirect: '/admin/dashboard'
      }
    ]
  },
  {
  path: '/principal',
  component: PrincipalDashboard,
  meta: { requiresAuth: true, requiresPrincipal: true },
  children: [
    {
      path: 'dashboard',
      name: 'PrincipalDashboardHome',
      component: PrincipalDashboardHome,
    },
    {
      path: 'staff',
      name: 'PrincipalStaff',
      component: principalStaff,
    },
    {
      path: 'add',
      name: 'AddPrincipalStaff',
      component: AddStaff,
    },
    {
      path: 'teachers',
      name: 'PrincipalTeachers',
      component: principalTeachers,
    },
    {
      path: 'teachers/add',
      name: 'AddPrincipalTeacher',
      component: AddTeacher,
    },
    {
      path: 'students',
      name: 'PrincipalStudents',
      component: principalStudents,
    },
    {
      path: 'students/add',
      name: 'AddPrincipalStudent',
      component: AddStudent,
    },
    {
      path: '',
      name: 'PrincipalRedirect',
      redirect: '/principal/dashboard'
    }
  ]
},

  // Catch all route - redirect to appropriate dashboard or login
  {
    path: '/:pathMatch(.*)*',
    redirect: to => {
      const token = localStorage.getItem('access_token');
      if (!token) return '/';
      
      try {
        const user = JSON.parse(localStorage.getItem('user'));
        if (user && user.roles && user.roles.includes('admin')) {
          return '/admin/dashboard';
        }
        if (user && user.roles && user.roles.includes('principal')) {
          return '/principal/dashboard';
        }
      } catch (e) {
        console.error("Failed to parse user data", e);
      }
      
      return '/';
    }
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Enhanced Navigation Guard
router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
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
    return next(RoleUtils.getDashboardRoute(user));
  }

  // Check for authentication
  if (requiresAuth && !token) {
    return next('/');
  }

  // Check for specific role requirements
  if (requiresAuth && token && user) {
    // Check if user can access this route based on their role
    if (!RoleUtils.canAccessRoute(user, to.meta)) {
      toast.error('Access Denied: You do not have permission to view this page.')
      return next(RoleUtils.getDashboardRoute(user));
    }
  }

  // Allow navigation
  next();
});

// Helper function to redirect users to their appropriate dashboard
function redirectToAppropriateDashboard(user) {
  if (user && user.roles) {
    if (user.roles.includes('admin')) {
      return '/admin/dashboard';
    }
    if (user.roles.includes('principal')) {
      return '/principal/dashboard';
    }
  }
  return '/';
}

export default router;