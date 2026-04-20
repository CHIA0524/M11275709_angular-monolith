import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadChildren: () => import('./pages/dashboard/dashboard.routes').then(m => m.dashboardRoutes)
      },
      {
        path: 'bookkeeping',
        loadChildren: () => import('./pages/bookkeeping/bookkeeping.routes').then(m => m.bookkeepingRoutes)
      },
      {
        path: 'transaction-list',
        redirectTo: 'bookkeeping',
      },
      {
        path: 'currency-converter',
        loadChildren: () => import('./pages/currency-converter/currency-converter.routes').then(m => m.currencyConverterRoutes)
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.routes').then(m => m.settingsRoutes)
      },
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];