import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./layout/shell/shell.component').then(m => m.ShellComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () => import('./pages/dashboard/dashboard.component').then(m => m.DashboardComponent)
      },
      {
        path: 'bookkeeping',
        loadComponent: () => import('./pages/transaction-list/transaction-list.component').then(m => m.TransactionListComponent)
      },
      {
        path: 'bookkeeping/add',
        loadComponent: () => import('./pages/quick-add/quick-add.component').then(m => m.QuickAddComponent)
      },
      {
        path: 'bookkeeping/edit/:id',
        loadComponent: () => import('./pages/quick-add/quick-add.component').then(m => m.QuickAddComponent)
      },
      {
        path: 'transaction-list',
        redirectTo: 'bookkeeping',
      },
      {
        path: 'currency-converter',
        loadComponent: () => import('./pages/currency-converter/currency-converter.component').then(m => m.CurrencyConverterComponent)
      },
      {
        path: 'settings',
        loadComponent: () => import('./pages/settings/settings.component').then(m => m.SettingsComponent)
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