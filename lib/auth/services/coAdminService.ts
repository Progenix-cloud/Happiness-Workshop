import { rolePermissions, RolePermissions } from '../rolePermissions';

export const coAdminService = {
  role: 'CO_ADMIN',
  displayName: 'Co-Administrator',

  getPermissions(): RolePermissions {
    return rolePermissions.CO_ADMIN;
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
    return true;
  },

  canManageTeams(): boolean {
    return true;
  },

  getDefaultDashboardRoute(): string {
    return '/dashboard';
  },

  getAccessibleDashboardItems() {
    return [
      'workshops',
      'trainers',
      'workshop-requests',
      'trainer-applications',
      'analytics',
      'email-templates',
      'custom-quote',
      'testimonials',
      'feedback',
      'certificates',
      'team-collaboration',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'CO_ADMIN',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canApproveWorkshops: true,
      canApproveTrainers: true,
      canManageAllContent: true,
      canAccessSystemSettings: false,
      canDelegateResponsibilities: true,
    };
  },
};
