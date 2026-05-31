import { Routes } from '@angular/router';

export const dashboardRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./dashboard.component').then(m => m.DashboardComponent)
  },
  {
    path: 'insights',
    loadComponent: () => import('./dashboard-insights/dashboard-insights.component').then(m => m.DashboardInsightsComponent)
  },
  {
    path: 'scenarios',
    loadComponent: () => import('./dashboard-scenarios/dashboard-scenarios.component').then(m => m.DashboardScenariosComponent)
  },
  {
    path: 'allocation',
    loadComponent: () => import('./dashboard-allocation/dashboard-allocation.component').then(m => m.DashboardAllocationComponent)
  }
];