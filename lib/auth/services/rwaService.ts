import { rolePermissions, RolePermissions } from '../rolePermissions';

export const rwaService = {
  role: 'RWA',
  displayName: 'Resident Welfare Association',

  getPermissions(): RolePermissions {
    return rolePermissions.RWA;
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
      'workshop-requests',
      'trainers',
      'analytics',
      'community-feedback',
      'venue-locations',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'RWA',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canRequestCommunityWorkshops: true,
      canManageCommunityVenues: true,
      canCommunityApprovals: true,
    };
  },
};
