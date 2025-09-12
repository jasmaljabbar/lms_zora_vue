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
import PrincipalDashboard from '@/components/Principal/PrincipalDashboard.vue';
import PrincipalDashboardHome from '@/components/Principal/DashboardHome.vue';
import principalStaff from '@/components/Principal/Staffs.vue'
import AddStaff from '@/components/Principal/AddStaff.vue';
import { RoleUtils } from '@/utils/roleUtils.js';
import { toast } from 'vue3-toastify'
import principalTeachers from '@/components/Principal/Teachers.vue';
import AddTeacher from '@/components/Principal/AddTeacher.vue';
import principalStudents from '@/components/Principal/Students.vue';
import AddStudent from '@/components/Principal/AddStudent.vue';
import StaffDashboard from '@/components/Staff/StaffDashboard.vue';
import StaffDAshboardHome from '@/components/Staff/DashboardHome.vue';
import ClassSectionManagementVue from '@/components/Staff/ClassSectionManagement.vue.vue';
import SubjectsManagement from '@/components/Staff/SubjectsManagement.vue';
import TeacherManagement from '@/components/Staff/TeacherManagement.vue';
import AcademicSessions from '@/components/Staff/AcademicSessions.vue';
import staffStudents from '@/components/Staff/Students.vue'
import TeacherDashboard from '@/components/Teacher/TeacherDashboard.vue';
import TeacherDashboardHome from '@/components/Teacher/DashboardHome.vue';
import Subjects from '@/components/Teacher/Subjects.vue';
import TeacherTimetable from '@/components/Teacher/TeacherTimetable.vue';
import TimetableManagement from '@/components/Staff/TimetableManagement.vue';


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
      component: staffStudents,
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
  {
  path: '/staff',
  component: StaffDashboard,
  meta: { requiresAuth: true, requiresStaff: true },
  children: [
    {
      path: 'dashboard',
      name: 'StaffDashboardHome',
      component: StaffDAshboardHome,
    },
    {
      path: 'class_section',
      name: 'staffClassSeciton',
      component: ClassSectionManagementVue,
    },
    {
      path: 'subjects',
      name: 'staffSubject',
      component: SubjectsManagement,
    },
    {
      path: 'teachers',
      name: 'StaffTeachers',
      component: TeacherManagement,
    },
    {
      path: 'teachers/add',
      name: 'AddStaffTeacher',
      component: AddTeacher,
    },
    {
      path: 'academicsession',
      name: 'staffAcademicSession',
      component: AcademicSessions,
    },
    {
      path: 'students',
      name: 'staffStudent',
      component: staffStudents,
    },
    {
      path: 'students/add',
      name: 'AddStaffStudent',
      component: AddStudent,
    },
    {
      path: 'timetable',
      name: 'StaffTimetable',
      component: TimetableManagement,
    },
    {
      path: '',
      name: 'StaffRedirect',
      redirect: '/staff/dashboard'
    }
  ]
},
  {
  path: '/teacher',
  component: TeacherDashboard,
  meta: { requiresAuth: true, requiresTeacher: true },
  children: [
    {
      path: 'dashboard',
      name: 'TeacherDashboardHome',
      component: TeacherDashboardHome,
    },
    {
      path: 'subject',
      name: 'teacherSubject',
      component: Subjects,
    },
    {
      path: 'schedule',
      name: 'teacherSchedule',
      component: TeacherTimetable,
    },
    // {
    //   path: 'teachers',
    //   name: 'StaffTeachers',
    //   component: TeacherManagement,
    // },
    // {
    //   path: 'teachers/add',
    //   name: 'AddStaffTeacher',
    //   component: AddTeacher,
    // },
    // {
    //   path: 'academicsession',
    //   name: 'staffAcademicSession',
    //   component: AcademicSessions,
    // },
    // {
    //   path: 'students',
    //   name: 'staffStudent',
    //   component: staffStudents,
    // },
    // {
    //   path: 'students/add',
    //   name: 'AddStaffStudent',
    //   component: AddStudent,
    // },
    // {
    //   path: '',
    //   name: 'StaffRedirect',
    //   redirect: '/staff/dashboard'
    // }
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
        if (user && user.roles && user.roles.includes('staff')) {
          return '/staff/dashboard';
        }
        if (user && user.roles && user.roles.includes('teacher')) {
          return '/teacher/dashboard';
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
    if (user.roles.includes('staff')) {
      return '/staff/dashboard';
    }
  }
  return '/';
}

export default router;