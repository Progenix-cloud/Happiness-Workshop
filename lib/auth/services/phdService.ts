import { rolePermissions, RolePermissions } from '../rolePermissions';

export const phdService = {
  role: 'PHD_SCHOLAR',
  displayName: 'Ph.D Scholar',

  getPermissions(): RolePermissions {
    return rolePermissions.PHD_SCHOLAR;
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
      'browse-workshops',
      'my-bookings',
      'research-analytics',
      'testimonials',
      'certificates',
      'academic-feedback',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'PHD_SCHOLAR',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canAccessResearchData: true,
      canParticipateInStudies: true,
      canPublishFindings: false,
    };
  },
};
