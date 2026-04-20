import { Routes } from '@angular/router';

export const accountRoutes: Routes = [
  {
    path: '',
    loadComponent: () => import('./account-list/account-list.component').then(m => m.AccountListComponent)
  },
  {
    path: 'insights',
    loadComponent: () => import('./account-insights/account-insights.component').then(m => m.AccountInsightsComponent)
  },
  {
    path: ':id',
    loadComponent: () => import('./account-detail/account-detail.component').then(m => m.AccountDetailComponent)
  }
];