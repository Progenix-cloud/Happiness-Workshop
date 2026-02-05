import { rolePermissions, RolePermissions } from '../rolePermissions';

export const participantService = {
  role: 'PARTICIPANT',
  displayName: 'Participant',

  getPermissions(): RolePermissions {
    return rolePermissions.PARTICIPANT;
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
      'certificates',
      'feedback',
      'testimonials',
      'emotion-tracking',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'PARTICIPANT',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canBookWorkshops: true,
      canTrackProgress: true,
    };
  },
};
