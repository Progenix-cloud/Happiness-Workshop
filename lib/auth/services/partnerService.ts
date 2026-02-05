import { rolePermissions, RolePermissions } from '../rolePermissions';

export const partnerService = {
  role: 'PARTNER',
  displayName: 'Partner',

  getPermissions(): RolePermissions {
    return rolePermissions.PARTNER;
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
      'analytics',
      'my-bookings',
      'team-collaboration',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'PARTNER',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canRequestWorkshops: true,
      canManageCollaborators: true,
      canViewPartnerAnalytics: true,
    };
  },
};
