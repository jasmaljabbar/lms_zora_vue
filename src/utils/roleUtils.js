// src/utils/roleUtils.js
export const RoleUtils = {
  // Check if user has required role
  hasRole(user, requiredRole) {
    return user && user.roles && user.roles.includes(requiredRole);
  },

  // Check if user has any of the required roles
  hasAnyRole(user, requiredRoles) {
    return user && user.roles && requiredRoles.some(role => user.roles.includes(role));
  },

  // Get user's appropriate dashboard route
  getDashboardRoute(user) {
    if (!user || !user.roles) return '/';
    
    if (user.roles.includes('admin')) return '/admin/dashboard';
    if (user.roles.includes('principal')) return '/principal/dashboard';
    
    return '/';
  },

  // Check if user can access route
  canAccessRoute(user, routeMeta) {
    if (routeMeta.requiresAdmin) {
      return this.hasRole(user, 'admin');
    }
    if (routeMeta.requiresPrincipal) {
      return this.hasRole(user, 'principal');
    }
    return true;
  }
};