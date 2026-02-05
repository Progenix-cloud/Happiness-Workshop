import { rolePermissions, RolePermissions } from '../rolePermissions';

export const volunteerService = {
  role: 'VOLUNTEER',
  displayName: 'Volunteer',
  
  getPermissions(): RolePermissions {
    return rolePermissions.VOLUNTEER;
  },

  canAccessDashboard(): boolean {
    return true;
  },

  canManageWorkshops(): boolean {
    return false;
  },

  canApplyForTraining(): boolean {
    return true;
  },

  canAccessAnalytics(): boolean {
    return false;
  },

  canApproveWorkshops(): boolean {
    return false;
  },

  canManageTeams(): boolean {
    return false;
  },

  getDefaultDashboardRoute(): string {
    return '/dashboard';
  },

  getAccessibleDashboardItems() {
    return [
      'my-bookings',
      'browse-workshops',
      'testimonials',
      'feedback',
      'certificates',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'VOLUNTEER',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
    };
  },
};
