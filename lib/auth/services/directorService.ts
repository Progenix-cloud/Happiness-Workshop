import { rolePermissions, RolePermissions } from '../rolePermissions';

export const directorService = {
  role: 'DIRECTOR',
  displayName: 'Director',

  getPermissions(): RolePermissions {
    return rolePermissions.DIRECTOR;
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
      'team-collaboration',
      'custom-quote',
      'testimonials',
      'feedback',
      'strategic-reports',
    ];
  },

  async initializeSession(userId: string) {
    return {
      userId,
      role: 'DIRECTOR',
      permissions: this.getPermissions(),
      accessibleItems: this.getAccessibleDashboardItems(),
      canApproveWorkshops: true,
      canApproveTrainers: true,
      canManageAllContent: true,
      canAccessStrategicReports: true,
      canMakeStrategicDecisions: true,
      canOverseeTeams: true,
    };
  },
};
