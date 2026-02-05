import { rolePermissions, RolePermissions } from '../rolePermissions';

export const trainerService = {
  role: 'TRAINER',
  displayName: 'Trainer',

  getPermissions(): RolePermissions {
    return rolePermissions.TRAINER;
  },

  canAccessDashboard(): boolean {
    return true;
  },

  canManageWorkshops(): boolean {
    return true;
  },

  canApplyForTraining(): boolean {
    return false;
  },

  canAccessAnalytics(): boolean {
    return true;
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
      'workshops',
      'my-bookings',
      'analytics',
      'trainers',
      'certificates',
      'feedback',
      'testimonials',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'TRAINER',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canCreateWorkshops: true,
      canViewAnalytics: true,
    };
  },
};
