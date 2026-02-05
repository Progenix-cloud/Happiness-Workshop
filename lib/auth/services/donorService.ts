import { rolePermissions, RolePermissions } from '../rolePermissions';

export const donorService = {
  role: 'DONOR',
  displayName: 'Donor',

  getPermissions(): RolePermissions {
    return rolePermissions.DONOR;
  },

  canAccessDashboard(): boolean {
    return true;
  },

  canManageWorkshops(): boolean {
    return false;
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
      'analytics',
      'impact-metrics',
      'browse-workshops',
      'testimonials',
      'reports',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'DONOR',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canViewImpactMetrics: true,
      canDownloadReports: true,
      canSeeTransparencyData: true,
    };
  },
};
